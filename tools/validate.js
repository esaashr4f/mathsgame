#!/usr/bin/env node
// Validates the question bank and the answer checker.
//   node tools/validate.js
// Fails (exit 1) if any canonical answer is rejected, a known-wrong answer is accepted, or data is malformed.
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const MathIn = require(path.join(root, 'js/math.js'));

const sandbox = { window: {}, console };
sandbox.window.MathIn = MathIn;
sandbox.window.Graph = require(path.join(root, 'js/engine/graph.js'));
sandbox.Graph = sandbox.window.Graph;
vm.createContext(sandbox);
const load = f => vm.runInContext('(function(window){' + fs.readFileSync(path.join(root, f), 'utf8') + '\n})(window)', sandbox, { filename: f });
// Data files expect browser globals; expose window.X as bare names for later files.
const files = ['js/data/topics.js', 'js/data/questions.js', 'js/data/papers.js', 'js/data/papers2.js', 'js/story/cast.js'];
files.forEach(load);
Object.assign(sandbox, sandbox.window);
fs.readdirSync(path.join(root, 'js/story')).filter(f => /^ch\d|^finale/.test(f)).sort().forEach(f => { load('js/story/' + f); Object.assign(sandbox, sandbox.window); });
const { TOPICS, QUESTIONS, PAPERS, STORY_PROBLEMS, ENCOUNTERS } = sandbox.window;

let failures = 0;
const fail = (msg) => { failures++; console.error('  ✗ ' + msg); };

// ---------- checker unit tests ----------
const cases = [
  // [step, input, expectedOk]
  [{ type: 'num', answer: '2*sqrt(3)' }, '2√3', true],
  [{ type: 'num', answer: '2*sqrt(3)' }, '2sqrt3', true],
  [{ type: 'num', answer: '2*sqrt(3)' }, 'sqrt12', true],
  [{ type: 'num', answer: '2*sqrt(3)', exact: true }, '3.464', false],
  [{ type: 'num', answer: 0.5 }, '1/2', true],
  [{ type: 'num', answer: 0.5 }, 'x = 0.5', true],
  [{ type: 'num', answer: 6180 }, '6180 N', true],
  [{ type: 'num', answer: 'ln4/0.2', dp: 2 }, '6.93', true],
  [{ type: 'num', answer: 'ln4/0.2', dp: 2 }, '6.9', false],
  [{ type: 'num', answer: 11.025, sf: 3 }, '11.0', true],
  [{ type: 'num', answer: 11.025, sf: 3 }, '11.2', false],
  [{ type: 'expr', answer: '3x^2-4/x' }, '3x²-4x^-1', true],
  [{ type: 'expr', answer: '3x^2-4/x' }, '3x^2 - 4x^(-1)', true],
  [{ type: 'expr', answer: '3x^2-4/x' }, '3x^2+4/x', false],
  [{ type: 'expr', answer: 'x^2-1' }, '(x+1)(x-1)', true],
  [{ type: 'expr', answer: '-3x/4+13/2' }, 'y = 6.5 - 0.75x', true],
  [{ type: 'expr', answer: 'sqrt(x)' }, 'x^(1/2)', true],
  [{ type: 'expr', answer: '2x' }, '2y', false],
  [{ type: 'integral', answer: '2x^3' }, '2x^3 + c', true],
  [{ type: 'integral', answer: '2x^3' }, '2x^3', false],
  [{ type: 'antideriv', answer: '2x^3' }, '2x^3 + 7', true],
  [{ type: 'set', answer: [3, -4] }, '-4, 3', true],
  [{ type: 'set', answer: [3, -4] }, 'x = 3 or x = -4', true],
  [{ type: 'set', answer: [3, -4] }, '3', false],
  [{ type: 'point', answer: [3, -2] }, '(3,-2)', true],
  [{ type: 'point', answer: [3, -2] }, '(-2, 3)', false],
  [{ type: 'vector', answer: [6, -8] }, '6i - 8j', true],
  [{ type: 'vector', answer: [6, -8] }, '(6, -8)', true],
  [{ type: 'vector', answer: [6, -8] }, '6i + 8j', false],
  [{ type: 'choice', answer: 2 }, 2, true],
  [{ type: 'choice', answer: 2 }, 1, false],
];
console.log('Checker tests');
for (const [step, input, want] of cases) {
  const got = MathIn.check(step, input).ok;
  if (got !== want) fail(`${JSON.stringify(step)} with "${input}" → ${got}, expected ${want}`);
}

// ---------- data validation ----------
console.log('Question bank, past papers, story problems');
const topicIds = new Set(TOPICS.map(t => t.id));
const ids = new Set();

function canonicalInput(step) {
  const a = step.answer;
  switch (step.type) {
    case 'choice': return a;
    case 'set': case 'tuple': return a.join(', ');
    case 'point': case 'vector': return '(' + a.join(', ') + ')';
    case 'integral': return a + ' + c';
    default: return String(a);
  }
}

function checkQuestion(q, where, needTopic) {
  if (!q.id) fail(where + ': missing id');
  if (ids.has(q.id)) fail(`${where}: duplicate id`);
  ids.add(q.id);
  if (needTopic && !topicIds.has(q.topic)) fail(`${where}: unknown topic "${q.topic}"`);
  if (!q.prompt) fail(`${where}: missing prompt`);
  if (!Array.isArray(q.steps) || !q.steps.length) { fail(`${where}: no steps`); return; }
  q.steps.forEach((s, i) => {
    const at = `${where} step ${i + 1}`;
    if (!s.ask) fail(`${at}: missing ask`);
    if (!s.explain) fail(`${at}: missing explain`);
    if (!s.hint) fail(`${at}: missing hint`);
    const type = s.type || 'num';
    if (type === 'choice') {
      if (!Array.isArray(s.choices) || s.answer == null || s.answer >= s.choices.length) fail(`${at}: bad choice data`);
      return;
    }
    const res = MathIn.check(Object.assign({ type }, s), canonicalInput(Object.assign({ type }, s)));
    if (!res.ok) fail(`${at}: canonical answer "${canonicalInput(s)}" rejected ${res.message ? '(' + res.message + ')' : ''}`);
    if (type === 'num' && !s.range) {
      const wrong = MathIn.check(s, String(MathIn.evaluate(MathIn.parse(String(s.answer)), {}) * 1.1 + 1));
      if (wrong.ok) fail(`${at}: answer+1 accepted`);
    }
  });
}

QUESTIONS.forEach(q => checkQuestion(q, 'bank ' + q.id, true));
PAPERS.forEach(p => {
  let total = 0;
  p.questions.forEach(q => {
    checkQuestion(q, p.id + ' Q' + q.num, true);
    const stepMarks = q.steps.reduce((t, s) => t + (s.marks || 1), 0);
    if (stepMarks !== q.marks) fail(`${p.id} Q${q.num}: steps give ${stepMarks} marks, question says ${q.marks}`);
    total += q.marks;
  });
  if (total !== 75) fail(`${p.id}: total ${total}, expected 75`);
  console.log(`  ${p.title}: ${p.questions.length} parts, ${total} marks`);
});
Object.values(STORY_PROBLEMS || {}).forEach(q => {
  ids.delete(q.id);
  checkQuestion(Object.assign({}, q, { id: 'story-' + q.id }), 'story ' + q.id, true);
});
Object.entries(ENCOUNTERS || {}).forEach(([k, e]) => {
  if (!e.problem || !e.attacks || !e.taunts || !e.angry || !e.talk) fail('encounter ' + k + ' incomplete');
});

for (const t of TOPICS) {
  const n = QUESTIONS.concat(PAPERS.flatMap(p => p.questions)).filter(q => q.topic === t.id).length;
  if (n < 2) fail(`topic ${t.id} has only ${n} questions`);
}

const allQ = QUESTIONS.concat(PAPERS.flatMap(p => p.questions));
const totalMarks = allQ.reduce((t, q) => t + q.steps.reduce((m, s) => m + (s.marks || 1), 0), 0);
console.log(`  ${allQ.length} practice questions (${totalMarks} marks), ${Object.keys(STORY_PROBLEMS || {}).length} story problems, ${Object.keys(ENCOUNTERS || {}).length} encounters, ${TOPICS.length} topics`);

if (failures) {
  console.error(`\n${failures} problem(s) found.`);
  process.exit(1);
}
console.log('\nAll good ✓');
