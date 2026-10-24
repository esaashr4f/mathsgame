"""The Lowmarsh soundtrack, written as code. Run tools/music/build.py to make the MIDI files and the audio.

Everything grows from one tune, the Lowmarsh theme (THEME_A/THEME_B, in G major): it's the title music,
the village whistles it, Fen's kitchen hums it as a lullaby, the fog in the marsh has eaten half its notes,
the encounters play it in a minor key, and the Hush finale turns it from G minor back to G major.
"""
from score import Song, prog, beats, arpeggio, pad, bassline, strum, voicing, bass_note, midi

# General MIDI programs used
PIANO, EPIANO, HARPSI, CELESTA, GLOCK, MUSICBOX, VIBES, MARIMBA = 0, 4, 6, 8, 9, 10, 11, 12
ACCORDION, NYLON, STEEL, ABASS, FBASS, SYNBASS = 21, 24, 25, 32, 33, 38
VIOLIN, CELLO, CONTRABASS, PIZZ, HARP, TIMPANI, STRINGS, SLOWSTR, CHOIR = 40, 42, 43, 45, 46, 47, 48, 49, 52
HORN, TUBA, OBOE, BASSOON, CLARINET, FLUTE, RECORDER, PANFLUTE = 60, 58, 68, 70, 71, 73, 74, 75
SQUARE, NEWAGE, WARMPAD, HALO, SEASHORE = 80, 88, 89, 94, 122
DRUMS = 9  # channel
KICK, STICK, SNARE, HAT, PHAT, OHAT, CRASH, RIDE, TAMB, SHAKER, WOODHI, WOODLO, TRIANGLE = 36, 37, 38, 42, 44, 46, 49, 51, 54, 70, 76, 77, 81

THEME_A = ('D5/1 B4/1 A4/1 G4/1 | A4/1 B4/1 D5/2 | E5/1 D5/1 B4/1 A4/1 | B4/3 r/1 | '
           'D5/1 B4/1 A4/1 G4/1 | A4/1 B4/.5 A4/.5 G4/1 E4/1 | D4/1 E4/1 G4/1 A4/1 | G4/3 r/1')
PROG_A = 'G:4 Em:4 C:4 D:4 G:4 C:4 Am7:2 D7:2 G:4'
THEME_B = ('E5/1.5 D5/.5 C5/1 B4/1 | A4/2 G4/1 A4/1 | B4/1.5 A4/.5 G4/1 E4/1 | F#4/2 A4/2 | '
           'G4/1 B4/1 D5/1 G5/1 | F#5/1.5 E5/.5 D5/2 | C5/1 B4/1 A4/1 G4/1 | A4/3 r/1')
PROG_B = 'C:4 Am:4 Em:4 D:4 G:4 Bm:4 C:4 D:4'


def check(song, at):
    assert abs(at - song.length) < 1e-6, (song.name, at, song.length)


# ───────────────────────── title ─────────────────────────
def title():
    s = Song('title', 72, seed=11)
    pno = s.track('piano', PIANO, 0, volume=96, reverb=80)
    harp = s.track('harp', HARP, 1, volume=78, pan=44, reverb=90)
    strg = s.track('strings', SLOWSTR, 2, volume=72, pan=84, reverb=95)
    fl = s.track('flute', FLUTE, 3, volume=84, pan=70, reverb=85)
    cb = s.track('bass', CONTRABASS, 4, volume=70, reverb=70)
    gl = s.track('glock', GLOCK, 5, volume=46, pan=90, reverb=100)
    intro = prog('G:4 Em:4 C:4 D:4')
    arpeggio(harp, 0, intro, [0, 1, 2, 3, 4, 3, 2, 1], step=0.5, center=62, vel=52)
    pad(strg, 0, intro, center=60, vel=38)
    # A: piano, harp, strings
    A, B = prog(PROG_A), prog(PROG_B)
    b = 16
    pno.line(b, THEME_A, vel=66)
    arpeggio(harp, b, A, [0, 1, 2, 3, 4, 3, 2, 1], step=0.5, center=55, vel=46)
    pad(strg, b, A, center=57, vel=40)
    bassline(cb, b, A, [(0, 3.8)], octave=2, vel=60)
    b += 32
    # B: flute takes the tune, piano accompanies
    fl.line(b, THEME_B, vel=70)
    arpeggio(pno, b, B, [-1, 1, 2, 3, 2, 1], step=2 / 3, center=55, vel=44)
    pad(strg, b, B, center=60, vel=44)
    bassline(cb, b, B, [(0, 3.8)], octave=2, vel=58)
    b += 32
    # A again, up the octave, with a strings counter-line and sparkles
    pno.line(b, THEME_A, vel=62, transpose=12)
    strg.line(b, 'G4/4 G4/4 E4/4 F#4/4 G4/4 E4/4 E4/2 F#4/2 G4/4', vel=48)
    arpeggio(harp, b, A, [0, 2, 4, 2], step=1, center=55, vel=44)
    for k in range(0, 32, 4):
        gl.note(b + k, 2, [74, 71, 76, 74, 74, 72, 74, 71][k // 4], 40)
    bassline(cb, b, A, [(0, 3.8)], octave=2, vel=58)
    b += 32
    # turnaround back to the start
    tail = prog('C/G:4 G:4 Am7:4 Dsus4:2 D:2')
    arpeggio(harp, b, tail, [0, 1, 2, 3, 4, 3, 2, 1], step=0.5, center=62, vel=48)
    pad(strg, b, tail, center=60, vel=40)
    pno.line(b, 'r/2 G4/1 A4/1 | B4/4 | C5/2 B4/1 A4/1 | A4/2 F#4/2', vel=52)
    b += 16
    s.length = b
    check(s, b)
    return s


# ───────────────────────── village ─────────────────────────
def village():
    s = Song('village', 100, seed=12)
    gtr = s.track('guitar', STEEL, 0, volume=82, pan=48, reverb=55)
    fl = s.track('flute', FLUTE, 1, volume=92, pan=76, reverb=60)
    cl = s.track('clarinet', CLARINET, 2, volume=84, pan=70, reverb=60)
    pz = s.track('pizz bass', PIZZ, 3, volume=86, reverb=40)
    gl = s.track('glock', GLOCK, 4, volume=50, pan=92, reverb=70)
    dr = s.track('shaker', 0, DRUMS, volume=60, pan=64, reverb=30)
    pick = [-1, 2, 1, 3, 0, 2, 1, 3]
    A, B = prog(PROG_A), prog(PROG_B)

    def groove(b, p, shaker=True):
        arpeggio(gtr, b, p, pick, step=0.5, center=60, vel=58)
        bassline(pz, b, p, [(0, 0.9), (2, 0.9, 7)], octave=2, vel=72)
        if shaker:
            for k in range(int(beats(p) * 2)):
                dr.note(b + k * 0.5, 0.2, SHAKER, 34 if k % 2 else 48)

    intro = prog('G:4 Em:4 C:4 D:4')
    groove(0, intro, shaker=False)
    b = 16
    groove(b, A)
    fl.line(b, THEME_A, vel=78)
    b += 32
    groove(b, B)
    cl.line(b, THEME_B, vel=74)
    fl.line(b, 'r/4 r/4 r/4 r/2 D5/1 C5/1 | B4/4 D5/2 C#5/2 | r/4 F#5/2 E5/2', vel=56)
    b += 32
    groove(b, A)
    fl.line(b, THEME_A, vel=76, transpose=12)
    cl.line(b, THEME_A, vel=56)
    for k in range(0, 32, 2):
        gl.note(b + k, 0.8, [79, 74, 76, 71, 72, 79, 74, 74, 79, 74, 72, 76, 74, 69, 67, 74][k // 2], 44)
    b += 32
    tag = prog('C:4 G/B:4 Am7:4 D7:4')
    groove(b, tag)
    fl.line(b, 'E5/1 D5/1 C5/1 G4/1 | D5/2 B4/2 | C5/1 B4/1 A4/1 E4/1 | F#4/2 A4/1 C5/1', vel=62)
    b += 16
    s.length = b
    check(s, b)
    return s


# ───────────────────────── home (Fen's kitchen and the cosy interiors) ─────────────────────────
def home():
    s = Song('home', 84, beats_per_bar=3, seed=13)
    mb = s.track('music box', MUSICBOX, 0, volume=88, pan=70, reverb=75)
    gtr = s.track('guitar', NYLON, 1, volume=80, pan=50, reverb=60)
    strg = s.track('strings', SLOWSTR, 2, volume=58, pan=64, reverb=90)
    cel = s.track('celesta', CELESTA, 3, volume=62, pan=86, reverb=85)
    tune = ('G5/1 E5/1 D5/1 | C5/1 D5/1 E5/1 | G5/2 A5/1 | G5/3 | G5/1 E5/1 D5/1 | C5/1.5 D5/.5 C5/1 | A4/1 G4/1 A4/1 | C5/3 | '
            'E5/1 F5/1 G5/1 | A5/2 G5/1 | F5/1 E5/1 D5/1 | E5/3 | E5/1 D5/1 C5/1 | D5/2 E5/1 | D5/1 C5/1 B4/1 | C5/3')
    P = prog('C:3 Am:3 F:3 C:3 C:3 F:3 G:3 C:3 Am:3 F:3 G:3 C:3 Am:3 Dm:3 G:3 C:3')

    def waltz(b, p, vel=56):
        for name, d in p:
            gtr.note(b, 0.9, bass_note(name, 2) + 12, vel + 6)
            v = voicing(name, 60)
            gtr.notes(b + 1, v, 0.8, vel - 6)
            gtr.notes(b + 2, v, 0.8, vel - 10)
            b += d
        return b

    intro = prog('C:3 F:3 C:3 G:3')
    waltz(0, intro)
    b = 12
    waltz(b, P)
    mb.line(b, tune, vel=74, transpose=-12)
    pad(strg, b, P, center=60, vel=30)
    b += 48
    waltz(b, P, vel=52)
    mb.line(b, tune, vel=66)
    cel.line(b, tune, vel=46, transpose=-12, legato=0.6)
    pad(strg, b, P, center=55, vel=40)
    b += 48
    s.length = b
    check(s, b)
    return s


# ───────────────────────── study (drills, papers, the Daily Challenge) ─────────────────────────
def study():
    s = Song('study', 78, seed=14)
    ep = s.track('rhodes', EPIANO, 0, volume=86, pan=56, reverb=60, chorus=30)
    bs = s.track('bass', FBASS, 1, volume=82, reverb=30)
    vb = s.track('vibes', VIBES, 2, volume=66, pan=80, reverb=80)
    dr = s.track('brushes', 40, DRUMS, volume=56, reverb=40)
    P = prog('Cmaj9:4 Am9:4 Dm9:4 G13:4 Cmaj9:4 Am9:4 Fmaj7:4 G13:4 Em7:4 Am9:4 Dm9:4 G13:4 Fmaj7:4 Em7:4 Dm9:4 G13:4') * 2
    b = 0
    for name, d in P:
        v = voicing(name, 62)
        ep.notes(b, v, 1.4, 52)
        ep.notes(b + 1.5, v, 0.4, 40)
        ep.notes(b + 2.5, v, 1.2, 46)
        bs.note(b, 1.4, bass_note(name, 2), 70)
        bs.note(b + 1.5, 0.4, bass_note(name, 2) + 7, 56)
        bs.note(b + 2.5, 1.2, bass_note(name, 2) + 12, 60)
        for k in range(4):
            dr.note(b + k, 0.3, RIDE, 30)
            dr.note(b + k + 2 / 3, 0.2, RIDE, 22)
        dr.note(b + 1, 0.4, SNARE, 26)
        dr.note(b + 3, 0.4, SNARE, 26)
        dr.note(b, 0.4, KICK, 34)
        b += d
    vb.line(16, 'r/2 E5/1 G5/1 | B5/2 A5/1 G5/1 | E5/3 r/1 | r/4 | r/2 C5/1 E5/1 | G5/1.5 F5/.5 E5/1 D5/1 | C5/4 | r/4', vel=58)
    vb.line(80, 'r/2 B5/1 A5/1 | G5/2 E5/2 | r/1 F5/1 A5/1 C6/1 | B5/4 | r/2 A5/1 G5/1 | E5/2 D5/1 C5/1 | D5/4 | r/4', vel=54)
    s.length = b
    check(s, b)
    return s


# ───────────────────────── wilds (the open fen, the default outdoors) ─────────────────────────
def wilds():
    s = Song('wilds', 92, seed=15)
    gtr = s.track('guitar', STEEL, 0, volume=80, pan=46, reverb=70)
    rec = s.track('recorder', RECORDER, 1, volume=84, pan=74, reverb=75)
    strg = s.track('strings', SLOWSTR, 2, volume=56, pan=64, reverb=90)
    ab = s.track('bass', ABASS, 3, volume=74, reverb=50)
    fl = s.track('flute', FLUTE, 4, volume=78, pan=80, reverb=80)
    P = prog('D:4 A/C#:4 Bm:4 G:4 D:4 G:4 Em7:4 A:4 Bm:4 G:4 D:4 A:4 G:4 D/F#:4 Em7:4 Asus4:2 A:2') * 2
    arpeggio(gtr, 0, P, [-1, 1, 2, 3, 2, 1, 0, 1], step=0.5, center=62, vel=54)
    pad(strg, 0, P, center=62, vel=32)
    bassline(ab, 0, P, [(0, 1.8), (2.5, 1.4, 7)], octave=2, vel=62)
    tune = ('r/4 | r/4 | r/4 | r/4 | A4/1 D5/1 E5/1 F#5/1 | G5/2 F#5/1 E5/1 | D5/1.5 E5/.5 B4/2 | A4/4 | '
            'B4/1 D5/1 F#5/1.5 E5/.5 | D5/2 B4/2 | A4/1 D5/1 F#5/1 A5/1 | G5/2 E5/2 | '
            'G5/1.5 F#5/.5 E5/1 D5/1 | F#5/2 D5/2 | E5/1 D5/1 B4/1 A4/1 | B4/2 C#5/2')
    rec.line(0, tune, vel=72)
    fl.line(64, tune.replace('r/4 | r/4 | r/4 | r/4 | ', 'F#5/2 E5/2 | D5/4 | E5/2 C#5/2 | A4/4 | ', 1), vel=66)
    s.length = beats(P)
    check(s, s.length)
    return s


# ───────────────────────── gorge (Bramble and the fallen bridge) ─────────────────────────
def gorge():
    s = Song('gorge', 76, seed=16)
    harp = s.track('harp', HARP, 0, volume=78, pan=44, reverb=85)
    ob = s.track('oboe', OBOE, 1, volume=84, pan=72, reverb=80)
    vc = s.track('cello', CELLO, 2, volume=78, pan=58, reverb=80)
    strg = s.track('strings', SLOWSTR, 3, volume=54, reverb=95)
    P = prog('Em:4 C:4 G:4 D:4 Em:4 C:4 Am:4 B7:4 C:4 D:4 Bm:4 Em:4 C:4 Am:4 B7:4 Em:4')
    arpeggio(harp, 0, P, [-1, 0, 1, 2, 3, 2, 1, 0], step=0.5, center=59, vel=48)
    pad(strg, 0, P, center=59, vel=34)
    vc.line(0, 'E3/4 C3/4 G2/4 D3/4 | E3/4 C3/4 A2/4 B2/4 | C3/4 D3/4 B2/4 E3/4 | C3/4 A2/4 B2/4 E3/4', vel=58)
    ob.line(0, 'B4/1.5 G4/.5 E4/2 | E5/1.5 D5/.5 C5/2 | B4/1 D5/1 G4/2 | A4/3 r/1 | '
               'B4/1.5 G4/.5 E4/2 | G4/1.5 A4/.5 C5/2 | C5/1 B4/1 A4/1 E4/1 | F#4/3 r/1 | '
               'E5/1.5 D5/.5 C5/1 G4/1 | A4/1 B4/1 C5/1 D5/1 | D5/1 B4/1 F#4/1 B4/1 | G4/3 r/1 | '
               'G4/1 A4/1 B4/1 C5/1 | E5/2 C5/2 | B4/1.5 A4/.5 F#4/1 D#4/1 | E4/3 r/1', vel=70)
    s.length = beats(P)
    check(s, s.length)
    return s


# ───────────────────────── coast (Gull Point: a gentle shanty, in 6/8) ─────────────────────────
def coast():
    # one beat = one quaver; 210 quavers a minute = 70 dotted crotchets
    s = Song('coast', 210, beats_per_bar=6, seed=17)
    acc = s.track('accordion', ACCORDION, 0, volume=70, pan=46, reverb=60)
    vn = s.track('fiddle', VIOLIN, 1, volume=82, pan=76, reverb=70)
    ab = s.track('bass', ABASS, 2, volume=76, reverb=50)
    sea = s.track('sea', SEASHORE, 3, volume=44, pan=64, reverb=60)
    harp = s.track('harp', HARP, 4, volume=60, pan=30, reverb=80)
    fl = s.track('flute', FLUTE, 5, volume=66, pan=86, reverb=80)
    P = prog('Am:6 Am:6 G:6 G:6 Am:6 C:6 G:6 Am:6 F:6 C:6 G:6 Am:6 F:6 G:6 Esus4:3 E:3 Am:6') * 2
    b = 0
    for name, d in P:
        ab.note(b, 2.6, bass_note(name, 2), 70)
        if d == 6:
            ab.note(b + 3, 2.6, bass_note(name, 2) + 7, 58)
        v = voicing(name, 62)
        acc.notes(b + 1, v, 0.8, 46)
        acc.notes(b + 2, v, 0.8, 40)
        if d == 6:
            acc.notes(b + 4, v, 0.8, 46)
            acc.notes(b + 5, v, 0.8, 40)
        b += d
    shanty = ('E5/2 A4/1 A4/2 B4/1 | C5/2 B4/1 A4/3 | G4/2 B4/1 D5/2 B4/1 | G4/3 r/3 | '
               'E5/2 A4/1 A4/2 B4/1 | C5/2 D5/1 E5/3 | D5/2 B4/1 G4/2 B4/1 | A4/3 r/3 | '
               'A5/2 G5/1 F5/2 E5/1 | E5/2 D5/1 C5/3 | D5/2 E5/1 D5/2 B4/1 | A4/2 B4/1 C5/3 | '
               'F5/2 E5/1 D5/2 C5/1 | B4/2 C5/1 D5/3 | B4/3 G#4/3 | A4/5 r/1')
    vn.line(0, shanty, vel=70)
    vn.line(96, shanty, vel=64)
    fl.line(96, shanty, vel=46, transpose=12)
    arpeggio(harp, 96, P[:17], [0, 1, 2, 3, 2, 1], step=1, center=64, vel=40)
    for k in range(0, int(beats(P)), 24):
        sea.note(k, 22, 60, 50)
    s.length = beats(P)
    check(s, s.length)
    return s


# ───────────────────────── meadows (Rowan's farm) ─────────────────────────
def meadows():
    s = Song('meadows', 108, seed=18)
    gtr = s.track('guitar', NYLON, 0, volume=82, pan=44, reverb=50)
    cl = s.track('clarinet', CLARINET, 1, volume=86, pan=74, reverb=55)
    pz = s.track('pizz', PIZZ, 2, volume=70, pan=60, reverb=50)
    ab = s.track('bass', ABASS, 3, volume=78, reverb=40)
    dr = s.track('perc', 0, DRUMS, volume=56, reverb=30)
    fl = s.track('flute', FLUTE, 5, volume=80, pan=82, reverb=60)
    P = prog('F:4 C:4 Dm:4 Bb:4 F:4 C:4 Bb:2 C:2 F:4 Bb:4 F:4 Gm:4 C:4 Bb:4 F/A:4 Gm7:2 C:2 F:4') * 2
    b = 0
    for name, d in P:
        for k in range(0, int(d), 2):
            ab.note(b + k, 0.9, bass_note(name, 2) + (7 if k == 2 else 0), 72)
            gtr.notes(b + k + 1, voicing(name, 60), 0.5, 52)
            gtr.notes(b + k + 1.5, voicing(name, 60), 0.3, 40)
        for k in range(int(d) * 2):
            dr.note(b + k * 0.5, 0.2, SHAKER, 40 if k % 2 == 0 else 28)
        if d == 4:
            dr.note(b + 2, 0.3, TAMB, 30)
        b += d
    tune = ('C5/1 A4/.5 C5/.5 F5/1 E5/1 | D5/1 E5/.5 D5/.5 C5/2 | D5/1 F5/1 A5/1 F5/1 | D5/3 r/1 | '
            'C5/1 A4/.5 C5/.5 F5/1 A5/1 | G5/1 F5/1 E5/1 C5/1 | D5/1 Bb4/1 E5/1 C5/1 | F5/3 r/1 | '
            'A5/1.5 G5/.5 F5/1 C5/1 | D5/1.5 E5/.5 F5/2 | A5/1 G5/1 F5/1 D5/1 | Bb4/2 D5/2 | '
            'E5/1 G5/1 C6/1 Bb5/1 | A5/1 G5/1 F5/1 D5/1 | C5/1 F5/1 A5/1 G5/1 | F5/3 r/1')
    cl.line(0, tune, vel=74)
    fl.line(64, tune, vel=70)
    cl.line(64, tune, vel=48, transpose=-12)
    pz.line(32, 'F5/.5 r/.5 A5/.5 r/.5 C6/.5 r/.5 A5/.5 r/.5 ' * 4, vel=44)
    s.length = beats(P)
    check(s, s.length)
    return s


# ───────────────────────── flood (chapter 4: the meadows under water) ─────────────────────────
def flood():
    s = Song('flood', 72, seed=19)
    pno = s.track('piano', PIANO, 0, volume=84, pan=50, reverb=80)
    strg = s.track('strings', SLOWSTR, 1, volume=70, reverb=95)
    vc = s.track('cello', CELLO, 2, volume=86, pan=70, reverb=85)
    ch = s.track('choir', CHOIR, 3, volume=50, reverb=100)
    tp = s.track('timpani', TIMPANI, 4, volume=60, reverb=80)
    P = prog('Dm:4 Bb:4 F:4 C:4 Dm:4 Bb:4 Gm:4 A:4 Bb:4 F:4 C:4 Dm:4 Gm:4 Bb:4 A7:4 Dm:4')
    arpeggio(pno, 0, P, [-1, 1, 2, 1], step=0.5, center=50, vel=50)
    pad(strg, 0, P, center=60, vel=44)
    pad(ch, 32, prog('Bb:4 F:4 C:4 Dm:4 Gm:4 Bb:4 A7:4 Dm:4'), center=64, vel=36)
    vc.line(0, 'A3/2 D4/2 | F4/3 D4/1 | C4/2 A3/2 | G3/4 | A3/2 D4/2 | F4/2 G4/2 | Bb4/2 A4/1 G4/1 | A4/4 | '
               'D5/3 C5/1 | A4/2 F4/2 | G4/2 E4/2 | F4/2 D4/2 | Bb4/2 A4/1 G4/1 | F4/2 D4/2 | E4/2 C#4/2 | D4/4', vel=68)
    for k in range(0, 64, 16):
        tp.note(k, 1, midi('D2'), 56)
        tp.note(k + 12, 0.5, midi('A1'), 44)
    s.length = beats(P)
    check(s, s.length)
    return s


# ───────────────────────── marsh (the Still: the fog has eaten half the tune) ─────────────────────────
def marsh():
    s = Song('marsh', 54, seed=20)
    padt = s.track('pad', NEWAGE, 0, volume=66, reverb=110)
    pno = s.track('piano', PIANO, 1, volume=74, pan=54, reverb=110)
    cel = s.track('celesta', CELESTA, 2, volume=48, pan=86, reverb=120)
    halo = s.track('halo', HALO, 3, volume=40, pan=40, reverb=120)
    P = prog('Gmaj7:8 Em9:8 Cmaj7#11:8 Am9:4 D:4 Gmaj7:8 Em9:8 Cmaj7#11:8 Am9:4 Dsus4:4')
    pad(padt, 0, P, center=55, vel=44)
    pad(halo, 32, prog('Gmaj7:8 Em9:8 Cmaj7#11:8 Am9:4 Dsus4:4'), center=67, vel=30)
    # the Lowmarsh theme with notes missing, slowed and far apart
    pno.line(0, 'D5/2 r/1 A4/1 G4/4 | A4/1 r/1 D5/4 r/2 | E5/2 D5/2 r/2 A4/2 | B4/6 r/2 | '
                'D5/2 r/2 r/1 G4/3 | A4/1 r/1 G4/1 E4/5 | r/4 | D4/2 r/2 A4/4 | r/4', vel=48)
    for k, p in enumerate(['B5', 'F#6', 'E6', 'B5', 'G6', 'D6']):
        cel.note(6 + k * 10, 2, midi(p), 40)
    s.length = beats(P)
    check(s, s.length)
    return s


# ───────────────────────── townhall (the archive, Pim, Magistrate Strix) ─────────────────────────
def townhall():
    s = Song('townhall', 96, seed=21)
    hc = s.track('harpsichord', HARPSI, 0, volume=72, pan=46, reverb=50)
    bn = s.track('bassoon', BASSOON, 1, volume=82, pan=56, reverb=50)
    ob = s.track('oboe', OBOE, 2, volume=82, pan=76, reverb=55)
    pz = s.track('pizz', PIZZ, 3, volume=62, pan=64, reverb=50)
    fl = s.track('flute', FLUTE, 4, volume=74, pan=84, reverb=60)
    P = prog('Bb:4 F/A:4 Gm:4 D/F#:4 Eb:4 Bb/D:4 Cm7:2 F7:2 Bb:4 Bb:4 Eb:4 Cm:4 F:4 Bb:4 Eb:4 Cm7:2 F7:2 Bb:2 F7:2') * 2
    arpeggio(hc, 0, P, [-1, 0, 1, 2, 1, 0, 1, 2], step=0.5, center=62, vel=50)
    b = 0
    for name, d in P:
        r = bass_note(name, 2)
        for k in range(int(d)):
            bn.note(b + k, 0.8, r + [0, 7, 12, 7][k % 4], 60)
        b += d
    ob.line(0, 'F5/1 D5/.5 Bb4/.5 F4/1 Bb4/1 | C5/1 A4/.5 F4/.5 C5/2 | D5/1 Bb4/.5 G4/.5 D5/1 G5/1 | F#5/2 A4/2 | '
               'G5/1 Eb5/.5 Bb4/.5 G5/1 Eb5/1 | F5/1 D5/.5 Bb4/.5 F5/2 | Eb5/1 C5/1 A4/1 C5/1 | Bb4/3 r/1 | '
               'D5/.5 Eb5/.5 F5/1 Bb5/1 F5/1 | G5/.5 F5/.5 Eb5/1 D5/2 | Eb5/.5 D5/.5 C5/1 G5/1 Eb5/1 | F5/2 C5/2 | '
               'D5/1 F5/1 Bb5/1 A5/1 | G5/1 Eb5/1 Bb4/2 | C5/.5 D5/.5 Eb5/1 A4/1 C5/1 | Bb4/2 D5/1 C5/1', vel=66)
    pz.line(32, 'Bb4/1 r/1 D5/1 r/1 ' * 8, vel=40)
    fl.line(64, 'F5/1 D5/.5 Bb4/.5 F4/1 Bb4/1 | C5/1 A4/.5 F4/.5 C5/2 | D5/1 Bb4/.5 G4/.5 D5/1 G5/1 | F#5/2 A4/2 | '
               'G5/1 Eb5/.5 Bb4/.5 G5/1 Eb5/1 | F5/1 D5/.5 Bb4/.5 F5/2 | Eb5/1 C5/1 A4/1 C5/1 | Bb4/3 r/1', vel=62, transpose=12)
    ob.line(96, 'D5/4 Eb5/4 C5/4 F5/4 D5/4 G5/4 Eb5/2 C5/2 D5/2 C5/2', vel=56)
    s.length = beats(P)
    check(s, s.length)
    return s


# ───────────────────────── lighthouse (Ottoline's lamp room: a ghost's waltz) ─────────────────────────
def lighthouse():
    s = Song('lighthouse', 132, beats_per_bar=3, seed=22)
    vb = s.track('vibes', VIBES, 0, volume=76, pan=50, reverb=95)
    fl = s.track('flute', FLUTE, 1, volume=80, pan=74, reverb=95)
    strg = s.track('strings', SLOWSTR, 2, volume=56, reverb=110)
    cel = s.track('celesta', CELESTA, 3, volume=54, pan=88, reverb=110)
    P = prog('Am:3 F:3 C:3 E:3 Am:3 Dm:3 E:3 Am:3 F:3 G:3 C:3 Am:3 Dm:3 E:3 Am:3 E7:3 ' * 2)
    b = 0
    for name, d in P:
        vb.note(b, 2.6, bass_note(name, 3), 52)
        vb.notes(b + 1, voicing(name, 64), 0.9, 40)
        vb.notes(b + 2, voicing(name, 64), 0.9, 34)
        b += d
    pad(strg, 48, P[16:], center=60, vel=40)
    tune = ('E5/2 A4/1 | C5/2 A4/1 | G4/2 E4/1 | G#4/3 | A4/1 B4/1 C5/1 | D5/2 F5/1 | E5/2 D5/1 | C5/2 B4/1 | '
            'A4/2 C5/1 | B4/2 D5/1 | E5/2 G5/1 | E5/3 | F5/2 D5/1 | B4/2 G#4/1 | A4/3 | r/3')
    fl.line(0, tune, vel=64)
    fl.line(48, tune, vel=60, transpose=12)
    cel.line(48, tune, vel=36, legato=0.4)
    s.length = beats(P)
    check(s, s.length)
    return s


# ───────────────────────── lock (Cog the golem's clockwork) ─────────────────────────
def lock():
    s = Song('lock', 104, seed=23)
    mar = s.track('marimba', MARIMBA, 0, volume=82, pan=48, reverb=45)
    tb = s.track('tuba', TUBA, 1, volume=78, pan=58, reverb=45)
    cl = s.track('clarinet', CLARINET, 2, volume=80, pan=76, reverb=55)
    dr = s.track('clock', 0, DRUMS, volume=64, reverb=40)
    gl = s.track('glock', GLOCK, 4, volume=48, pan=86, reverb=60)
    P = prog('C:4 Bb/C:4 F/C:4 C:4 C:4 Bb:4 F:4 G:4 Am:4 F:4 C:4 G:4 Am:4 Bb:4 F:4 G7:4') * 2
    b = 0
    for name, d in P:
        v = voicing(name, 64)
        pat = [v[0], v[1], v[2], v[1], v[0] + 12, v[2], v[1], v[2]]
        for k in range(int(d) * 2):
            mar.note(b + k * 0.5, 0.4, pat[k % 8], 52 if k % 2 == 0 else 42)
        tb.note(b, 0.9, bass_note(name, 1) + 12, 70)
        tb.note(b + 2, 0.9, bass_note(name, 1) + 19, 60)
        for k in range(int(d)):
            dr.note(b + k, 0.2, WOODHI if k % 2 == 0 else WOODLO, 54)
        b += d
    cl.line(16, 'G5/.5 E5/.5 C5/1 r/1 G4/1 | Bb4/.5 C5/.5 D5/1 F5/2 | A5/.5 G5/.5 F5/1 C5/1 A4/1 | B4/1 D5/1 G5/2 | '
                'E5/1 C5/1 A4/2 | F5/1 A5/1 C6/2 | G5/.5 F5/.5 E5/1 C5/2 | B4/1 D5/1 G4/2 | '
                'C5/1 E5/.5 C5/.5 A4/2 | Bb4/1 D5/.5 Bb4/.5 F5/2 | A5/1 F5/1 C5/1 A4/1 | B4/1 F5/1 G5/2', vel=70)
    for k in range(64, 128, 2):
        gl.note(k, 0.5, [72, 79, 77, 76][(k // 2) % 4], 40)
    s.length = beats(P)
    check(s, s.length)
    return s


# ───────────────────────── encounter ("Show Your Working") ─────────────────────────
def encounter():
    s = Song('encounter', 138, seed=24)
    lead = s.track('lead', SQUARE, 0, volume=70, pan=64, reverb=40)
    sb = s.track('bass', SYNBASS, 1, volume=84, reverb=20)
    pno = s.track('piano', PIANO, 2, volume=74, pan=44, reverb=50)
    strg = s.track('strings', STRINGS, 3, volume=62, pan=80, reverb=70)
    dr = s.track('drums', 0, DRUMS, volume=82, reverb=30)
    A = prog('Em:4 C:4 G:4 D:4 Em:4 C:4 Am:4 B7:4')
    B = prog('Em:4 C:4 Am:4 B7:4 Em:4 C:4 Am:2 B7:2 Em:4')
    full = A + A + B + prog('C:4 D:4 B7:4 B7:4')

    b = 0
    for name, d in full:
        r = bass_note(name, 1) + 12
        for k in range(int(d * 2)):
            sb.note(b + k * 0.5, 0.4, r + (12 if k % 4 == 3 else 0), 76 if k % 2 == 0 else 62)
        pno.notes(b, voicing(name, 60), 0.4, 58)
        pno.notes(b + 1.5, voicing(name, 60), 0.4, 50)
        pno.notes(b + 3, voicing(name, 60), 0.4, 54) if d == 4 else None
        for k in range(int(d)):
            dr.note(b + k, 0.2, KICK if k % 2 == 0 else SNARE, 80 if k % 2 == 0 else 70)
            dr.note(b + k, 0.2, HAT, 50)
            dr.note(b + k + 0.5, 0.2, HAT, 38)
        b += d
    riff = ('B4/.5 E5/.5 F#5/.5 G5/1 F#5/.5 E5/1 | D5/.5 E5/.5 D5/.5 B4/1.5 r/1 | G4/.5 B4/.5 D5/.5 E5/1 D5/.5 B4/1 | A4/.5 B4/.5 A4/.5 F#4/1.5 r/1 | '
            'B4/.5 E5/.5 F#5/.5 G5/1 F#5/.5 E5/1 | G5/.5 A5/.5 G5/.5 E5/1.5 r/1 | C5/.5 E5/.5 A5/.5 G5/1 F#5/.5 E5/1 | D#5/2 F#5/2')
    lead.line(0, riff, vel=74)
    lead.line(32, riff, vel=76, transpose=12)
    pad(strg, 32, A, center=64, vel=48)
    # the Lowmarsh theme, in E minor
    lead.line(64, 'B4/1 G4/1 F#4/1 E4/1 | F#4/1 G4/1 B4/2 | C5/1 B4/1 G4/1 F#4/1 | G4/2 F#4/2 | '
                  'B4/1 G4/1 F#4/1 E4/1 | F#4/1 G4/.5 F#4/.5 E4/1 C4/1 | B3/1 C4/1 E4/1 F#4/1 | E4/3 r/1', vel=80, transpose=12)
    pad(strg, 64, B, center=60, vel=54)
    lead.line(96, 'E5/1 G5/1 C6/2 | D6/1 C6/1 A5/2 | D#5/1 F#5/1 A5/1 B5/1 | D#6/4', vel=78)
    for k in range(4):
        dr.note(96 + 12 + k, 0.2, SNARE, 60 + k * 8)
        dr.note(96 + 12 + k + 0.5, 0.2, SNARE, 56 + k * 8)
    dr.note(0, 1, CRASH, 70)
    s.length = beats(full)
    check(s, s.length)
    return s


# ───────────────────────── finale (the Hush: G minor to G major) ─────────────────────────
def finale():
    s = Song('finale', 104, seed=25)
    hn = s.track('horn', HORN, 0, volume=88, pan=60, reverb=80)
    strg = s.track('strings', STRINGS, 1, volume=78, pan=50, reverb=85)
    ost = s.track('ostinato', STRINGS, 2, volume=70, pan=78, reverb=70)
    ch = s.track('choir', CHOIR, 3, volume=64, reverb=100)
    tp = s.track('timpani', TIMPANI, 4, volume=76, reverb=80)
    cb = s.track('basses', CONTRABASS, 5, volume=80, reverb=70)
    gl = s.track('glock', GLOCK, 6, volume=54, pan=90, reverb=100)
    MIN = prog('Gm:4 Eb:4 Cm:4 D:4 Gm:4 Cm:4 Am7b5:2 D7:2 Gm:4')
    MAJ = prog(PROG_A)
    TURN = prog('Eb:4 Cm:4 D:4 D7:4')
    b = 0
    for part, p in (('min', MIN), ('min2', MIN), ('maj', MAJ), ('turn', TURN)):
        for name, d in p:
            v = voicing(name, 60, size=3)
            for k in range(int(d * 2)):
                ost.note(b + k * 0.5, 0.42, [v[0], v[1], v[2], v[1]][k % 4] + (12 if part == 'maj' else 0), 58 if k % 2 == 0 else 46)
            cb.note(b, d * 0.95, bass_note(name, 1) + 12, 70)
            tp.note(b, 0.5, bass_note(name, 1) + 12, 70 if part != 'maj' else 56)
            if part != 'min':
                pad(ch, b, [(name, d)], center=64, vel=44 if part == 'min2' else 52)
            if part == 'maj':
                pad(strg, b, [(name, d)], center=67, vel=50)
            b += d
    theme_min = ('D5/1 Bb4/1 A4/1 G4/1 | A4/1 Bb4/1 D5/2 | Eb5/1 D5/1 Bb4/1 A4/1 | Bb4/3 r/1 | '
                 'D5/1 Bb4/1 A4/1 G4/1 | A4/1 Bb4/.5 A4/.5 G4/1 Eb4/1 | D4/1 Eb4/1 G4/1 A4/1 | G4/3 r/1')
    hn.line(0, theme_min, vel=72, transpose=-12)
    hn.line(32, theme_min, vel=80)
    strg.line(32, 'G4/4 G4/4 G4/4 F#4/4 G4/4 G4/4 Eb4/2 F#4/2 G4/4', vel=54)
    hn.line(64, THEME_A, vel=88)
    gl.line(64, THEME_A, vel=46, transpose=12, legato=0.5)
    strg.line(96, 'G4/4 Eb4/4 F#4/4 A4/4', vel=56)
    hn.line(96, 'Bb4/2 G4/2 | C5/2 Eb5/2 | D5/4 | F#4/2 A4/2', vel=74)
    for k in range(8):
        tp.note(108 + k * 0.5, 0.4, midi('D2'), 50 + k * 4)
    s.length = b
    check(s, b)
    return s


ALL = [title, village, home, study, wilds, gorge, coast, meadows, flood, marsh, townhall, lighthouse, lock, encounter, finale]
