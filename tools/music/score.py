"""A tiny composition kit for Lowmarsh's music: write notes in beats, get a Standard MIDI File.

Notes are written as text, one token per note:  "D5/1 B4/1 A4/.5 G4/1.5 r/1"
  pitch/duration-in-beats ("r" is a rest), "D5/1!" is accented, "D5/1~" is soft,
  "[G4 B4 D5]/2" is a chord.
Chords are named ("G", "Em", "Am7", "Cmaj7", "D/F#", "Gsus4" ...) and voiced by the helpers below.
"""
import random
import struct

NOTE = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}


def midi(name):
    """'C4' -> 60, 'F#3' -> 54, 'Bb5' -> 82."""
    name = name.strip()
    n = NOTE[name[0].upper()]
    i = 1
    while i < len(name) and name[i] in '#b':
        n += 1 if name[i] == '#' else -1
        i += 1
    return n + 12 * (int(name[i:]) + 1)


QUAL = {
    '': [0, 4, 7], 'm': [0, 3, 7], '7': [0, 4, 7, 10], 'm7': [0, 3, 7, 10], 'maj7': [0, 4, 7, 11],
    'sus4': [0, 5, 7], 'sus2': [0, 2, 7], 'dim': [0, 3, 6], 'add9': [0, 4, 7, 14], 'm9': [0, 3, 7, 10, 14],
    'maj9': [0, 4, 7, 11, 14], '6': [0, 4, 7, 9], 'm6': [0, 3, 7, 9], '9': [0, 4, 7, 10, 14], '13': [0, 4, 10, 14, 21],
    'aug': [0, 4, 8], 'm7b5': [0, 3, 6, 10], 'maj7#11': [0, 4, 7, 11, 18], '5': [0, 7],
}


def chord(name):
    """'Am7' -> (root pitch class, [intervals], bass pitch class)."""
    bass = None
    if '/' in name:
        name, b = name.split('/')
        bass = NOTE[b[0]] + (1 if b[1:2] == '#' else -1 if b[1:2] == 'b' else 0)
    root = NOTE[name[0]]
    i = 1
    if name[1:2] in ('#', 'b'):
        root += 1 if name[1] == '#' else -1
        i = 2
    q = name[i:]
    return root % 12, QUAL[q], (bass if bass is not None else root) % 12


def near(pc, around):
    """The pitch with pitch class pc closest to the midi note `around`."""
    best = None
    for p in range(around - 6, around + 7):
        if p % 12 == pc and (best is None or abs(p - around) < abs(best - around)):
            best = p
    return best


def voicing(name, center=60, size=None):
    """Close-position chord tones around `center` (for pads, strums, piano left hands)."""
    root, ivs, _ = chord(name)
    tones = sorted(set((root + iv) % 12 for iv in ivs))
    notes = sorted(near(pc, center) for pc in tones)
    if size and size > len(notes):
        notes = notes + [n + 12 for n in notes][:size - len(notes)]
    return notes


def bass_note(name, octave=2):
    _, _, b = chord(name)
    return b + 12 * (octave + 1)


class Track:
    def __init__(self, song, name, program, channel, volume=100, pan=64, reverb=60, chorus=0):
        self.song, self.name, self.program, self.channel = song, name, program, channel
        self.volume, self.pan, self.reverb, self.chorus = volume, pan, reverb, chorus
        self.events = []  # (beat, dur, pitch, vel)

    def note(self, beat, dur, pitch, vel=80):
        self.events.append((beat, dur, pitch, max(1, min(127, int(vel)))))

    def notes(self, beat, pitches, dur, vel=80):
        for p in pitches:
            self.note(beat, dur, p, vel)

    def line(self, beat, text, vel=80, transpose=0, legato=0.95):
        """Write a melody from text. Returns the beat after the last token."""
        for tok in text.split():
            if tok == '|':
                continue
            accent = 1.0
            if tok.endswith('!'):
                accent, tok = 1.18, tok[:-1]
            elif tok.endswith('~'):
                accent, tok = 0.75, tok[:-1]
            p, d = tok.rsplit('/', 1)
            d = float(d)
            if p != 'r':
                if p.startswith('['):
                    for q in p[1:-1].split():
                        self.note(beat, d * legato, midi(q) + transpose, vel * accent)
                else:
                    self.note(beat, d * legato, midi(p) + transpose, vel * accent)
            beat += d
        return beat


class Song:
    def __init__(self, name, bpm, beats_per_bar=4, seed=1):
        self.name, self.bpm, self.bpb = name, bpm, beats_per_bar
        self.tracks = []
        self.length = 0  # loop length in beats; set by the composer
        self.rng = random.Random(seed)

    def track(self, *a, **k):
        t = Track(self, *a, **k)
        self.tracks.append(t)
        return t

    def seconds(self):
        return self.length * 60.0 / self.bpm

    # ── writing ──
    def write(self, path, passes=1, humanize=True):
        PPQ = 480
        out = []
        tempo = struct.pack('>I', int(60_000_000 / self.bpm))[1:]
        meta = [(0, b'\xff\x51\x03' + tempo), (0, b'\xff\x58\x04' + bytes([self.bpb, 2, 24, 8]))]
        out.append(self._chunk(meta, PPQ))
        for t in self.tracks:
            ev = []
            ch = t.channel
            ev.append((0, bytes([0xB0 | ch, 7, t.volume])))
            ev.append((0, bytes([0xB0 | ch, 10, t.pan])))
            ev.append((0, bytes([0xB0 | ch, 91, t.reverb])))
            ev.append((0, bytes([0xB0 | ch, 93, t.chorus])))
            if ch != 9:
                ev.append((0, bytes([0xC0 | ch, t.program])))
            # the same small human wobble on every pass, so a rendered loop matches itself exactly
            wobble = [(self.rng.uniform(-0.012, 0.012) if humanize and ch != 9 else 0, self.rng.randint(-5, 5) if humanize else 0) for _ in t.events]
            for k in range(passes):
                off = k * self.length
                for (b, d, p, v), (jt, jv) in zip(t.events, wobble):
                    on = int(round((b + off + max(0, jt)) * PPQ))
                    offt = int(round((b + off + d) * PPQ))
                    vel = max(1, min(127, v + jv))
                    ev.append((on, bytes([0x90 | ch, p, vel])))
                    ev.append((max(on + 1, offt), bytes([0x80 | ch, p, 0])))
            out.append(self._chunk(ev, PPQ))
        data = b'MThd' + struct.pack('>IHHH', 6, 1, len(out), PPQ) + b''.join(out)
        with open(path, 'wb') as f:
            f.write(data)

    @staticmethod
    def _vlq(n):
        b = [n & 0x7F]
        n >>= 7
        while n:
            b.insert(0, 0x80 | (n & 0x7F))
            n >>= 7
        return bytes(b)

    def _chunk(self, events, ppq):
        # note-offs before note-ons at the same tick
        events = sorted(events, key=lambda e: (e[0], 0 if (e[1][0] & 0xF0) == 0x80 else 1))
        body, last = b'', 0
        for t, msg in events:
            body += self._vlq(t - last) + msg
            last = t
        body += b'\x00\xff\x2f\x00'
        return b'MTrk' + struct.pack('>I', len(body)) + body


# ── accompaniment helpers ──
def arpeggio(t, start, prog, pattern, step=0.5, center=60, vel=60, bars_beats=4, dur=None):
    """Broken chords. prog: [(chord, beats), ...]; pattern: indices into the voicing (bass=-1)."""
    b = start
    for name, beats in prog:
        v = voicing(name, center, size=4)
        tones = v + [n + 12 for n in v]
        k = 0
        x = b
        while x < b + beats - 1e-6:
            idx = pattern[k % len(pattern)]
            p = bass_note(name, 2) + 12 if idx == -1 else tones[idx % len(tones)]
            t.note(x, dur or step * 1.6, p, vel + (6 if k % len(pattern) == 0 else 0))
            x += step
            k += 1
        b += beats
    return b


def pad(t, start, prog, center=60, vel=50, size=None):
    b = start
    for name, beats in prog:
        t.notes(b, voicing(name, center, size), beats * 0.98, vel)
        b += beats
    return b


def bassline(t, start, prog, pattern=((0, 1.0),), octave=2, vel=72):
    """pattern: [(beat offset, duration)] per chord, played on the chord's bass note (fifth = +7 if offset key 'f')."""
    b = start
    for name, beats in prog:
        root = bass_note(name, octave)
        for item in pattern:
            off, d = item[0], item[1]
            iv = item[2] if len(item) > 2 else 0
            if off < beats:
                t.note(b + off, min(d, beats - off), root + iv, vel)
        b += beats
    return b


def strum(t, start, prog, rhythm=((0, 1, 1.0),), center=57, vel=62, spread=0.02, bar=4):
    """Guitar-style strums. rhythm: [(beat offset, duration, velocity scale)] repeated every `bar` beats."""
    b = start
    for name, beats in prog:
        v = voicing(name, center, size=5)
        x = 0.0
        while x < beats - 1e-6:
            for off, d, s in rhythm:
                if x + off < beats - 1e-6:
                    for i, p in enumerate(v):
                        t.note(b + x + off + i * spread, d, p, vel * s)
            x += bar
        b += beats
    return b


def prog(text):
    """'G:4 Em:4 C:2 D:2' -> [('G', 4.0), ('Em', 4.0), ('C', 2.0), ('D', 2.0)]"""
    out = []
    for tok in text.split():
        if tok == '|':
            continue
        n, d = tok.rsplit(':', 1)
        out.append((n, float(d)))
    return out


def beats(p):
    return sum(d for _, d in p)
