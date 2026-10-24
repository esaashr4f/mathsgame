#!/usr/bin/env python3
"""Build the Lowmarsh soundtrack.

    python3 tools/music/build.py            # every track
    python3 tools/music/build.py village    # just one

Writes, for each track in tracks.py:
  audio/music/midi/<name>.mid   the score, one loop, to open in GarageBand / Logic / FL Studio / MuseScore
  audio/music/<name>.mp3        a rendered loop for the game (needs fluidsynth, a GM soundfont, ffmpeg, numpy)
and rewrites audio/music/music.js so the game plays them.

The rendered loops are seamless: the track is rendered three times over and the middle pass is cut out with
a second of real music either side, so the reverb tail of the end flows into the start. The game loops the
exact middle section (see `loop` and `start` in music.js).
"""
import json
import os
import subprocess
import sys
import tempfile
import wave

sys.path.insert(0, os.path.dirname(__file__))
import tracks  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
OUT = os.path.join(ROOT, 'audio', 'music')
SF2 = os.environ.get('SOUNDFONT', '/usr/share/sounds/sf2/FluidR3_GM.sf2')
PAD = 1.0  # seconds of music kept either side of the loop
GAIN = {'marsh': 0.8, 'home': 0.9, 'study': 0.85, 'encounter': 1.0, 'finale': 1.0}


def lint(song):
    for t in song.tracks:
        for (b, d, p, v) in t.events:
            if b < -1e-6 or b >= song.length - 1e-6:
                raise SystemExit(f'{song.name}/{t.name}: a note at beat {b} is outside the loop (0 to {song.length})')
            if b + d > song.length + 0.25 and t.channel != 9:
                print(f'  note: {song.name}/{t.name} holds a note {b + d - song.length:.2f} beats past the loop point (it rings over)')


def render(song, mp3):
    import numpy as np
    with tempfile.TemporaryDirectory() as tmp:
        mid, wav = os.path.join(tmp, 'x.mid'), os.path.join(tmp, 'x.wav')
        song.write(mid, passes=3)
        subprocess.run(['fluidsynth', '-ni', '-q', '-g', '0.55', '-r', '44100',
                        '-o', 'synth.reverb.room-size=0.62', '-o', 'synth.reverb.damp=0.35',
                        '-o', 'synth.reverb.width=0.9', '-o', 'synth.reverb.level=0.75',
                        '-o', 'synth.chorus.active=0', '-F', wav, SF2, mid], check=True)
        with wave.open(wav) as w:
            sr, n, ch = w.getframerate(), w.getnframes(), w.getnchannels()
            a = np.frombuffer(w.readframes(n), dtype=np.int16).reshape(-1, ch).astype(np.float32) / 32768
        L = song.seconds()
        i0, i1 = int(round((L - PAD) * sr)), int(round((2 * L + PAD) * sr))
        seg = a[i0:i1]
        # loudness: aim every track at the same average level, without clipping
        rms = float(np.sqrt(np.mean(seg ** 2)) + 1e-9)
        seg = seg * min(0.12 / rms * GAIN.get(song.name, 1.0), 0.95 / float(np.max(np.abs(seg)) + 1e-9))
        pcm = (np.clip(seg, -1, 1) * 32767).astype(np.int16)
        cut = os.path.join(tmp, 'cut.wav')
        with wave.open(cut, 'wb') as w:
            w.setnchannels(ch); w.setsampwidth(2); w.setframerate(sr); w.writeframes(pcm.tobytes())
        subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', cut, '-c:a', 'libmp3lame', '-q:a', '4', mp3], check=True)
    return {'file': os.path.basename(mp3), 'loop': round(L, 4), 'start': PAD}


def main():
    only = sys.argv[1:]
    os.makedirs(os.path.join(OUT, 'midi'), exist_ok=True)
    manifest_path = os.path.join(OUT, 'tracks.json')
    manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else {}
    for fn in tracks.ALL:
        song = fn()
        if only and song.name not in only:
            continue
        lint(song)
        song.write(os.path.join(OUT, 'midi', song.name + '.mid'), passes=1, humanize=False)
        print(f'{song.name}: {song.length:g} beats at {song.bpm} bpm = {song.seconds():.1f} s')
        manifest[song.name] = render(song, os.path.join(OUT, song.name + '.mp3'))
    json.dump(manifest, open(manifest_path, 'w'), indent=1)
    order = [f().name for f in tracks.ALL]
    lines = ',\n'.join(f"  {k}: {{ file: '{v['file']}', loop: {v['loop']}, start: {v['start']} }}" for k, v in sorted(manifest.items(), key=lambda kv: order.index(kv[0]) if kv[0] in order else 99))
    with open(os.path.join(OUT, 'music.js'), 'w') as f:
        f.write('// The game\'s music: written by tools/music/build.py (the scores are in tools/music/tracks.py).\n'
                '// Each track is a seamless loop: `loop` is its length in seconds and `start` where the loop begins in the file.\n'
                '// To use your own recording for a slot instead, replace the entry with just a file name, e.g. village: \'my-village.mp3\'.\n'
                'window.LOWMARSH_MUSIC = {\n' + lines + ',\n};\n')


if __name__ == '__main__':
    main()
