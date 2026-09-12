# Nocturne

A playable piano in the browser: real sampled piano sound (plus electric
piano and organ), a glowing key-press effect, and a "Learn a Song" mode
where falling note blocks guide you through a piece. Practice at your own
pace in **Wait Mode** — time waits for you to hit the right key, so anyone
can complete a song — or sit back in **Auto Mode**, where the app plays the
piece itself, sound and falling notes in sync, as a demo of how it goes.
Record what you play and take it with
you as a `.mid` file; your progress and any imported songs are remembered
for next time.

## Run it

```bash
npm install
npm run dev
```

Open the printed local URL. Piano samples are fetched from a public CDN the
first time you play a note, so the tab needs an internet connection.

## Play

- **Mouse / touch**: click or tap any key — or drag across several for a
  glissando, just like running a finger down real piano keys.
- **Computer keyboard**: `Z S X D C V G B H N J M` play the white/black keys
  of one octave, `Q 2 W 3 E R 5 T 6 Y 7 U` continue into the next octave.
  `[` and `]` shift the whole mapping down/up an octave. A full reference
  is one click away — the keyboard icon in the top bar.
- **A real MIDI keyboard**: plug one in and play — Nocturne picks it up
  automatically over the Web MIDI API (Chrome/Edge; not supported in Safari)
  and shows a small "connected" badge. Velocity comes through for dynamics,
  and a hardware sustain pedal (Control Change 64) works too.
- **Instrument** (top right): switch between Grand Piano, Electric Piano,
  Organ, Harpsichord, Celesta, and Strings.
- **Note names** (top right, tag icon): label the keys — the full name
  (e.g. "C4") on every C as an anchor, just the letter elsewhere.
- **Volume** (top right): a standard 0–100% slider.
- **Sustain pedal**: hold Space (or a MIDI pedal) to sustain — notes keep
  ringing after you release the key, just like a real pedal, until released.
- **Metronome** (top left): toggle a click with adjustable BPM (40–240),
  scheduled on the audio clock for accurate timing, with a visual beat pulse.
- On phones and tablets, each key press gives a brief haptic tick where the
  browser supports it.
- **Free Play / Learn a Song** (top bar): switch between playing freely and
  practicing a piece.

### Learn a Song mode

- **Song picker**: choose from fourteen built-in pieces across four groups —
  **Beginner** (Hot Cross Buns, Mary Had a Little Lamb, Frère Jacques, Row
  Row Row Your Boat, Twinkle Twinkle Little Star), **Intermediate** (Happy
  Birthday to You, Ode to Joy, Jingle Bells, Amazing Grace), **Advanced**
  (Für Elise — opening, with a black-key trill), and **Two Hands** (Twinkle
  Twinkle, Ode to Joy, Mary Had a Little Lamb, and Jingle Bells, each with a
  simple left-hand bass part — colored ember for right / violet for left).
  Songs you've completed show a ✓ right in the list.
- **Import MIDI**: bring your own `.mid` file. Multi-track files map the
  first track to the right hand and the rest to the left; single-track files
  split by pitch around middle C. Imported songs are saved in the browser
  (`localStorage`) so they're still there next time you open the app; a
  "Clear imports" link appears once you have at least one.
- **Wait / Auto toggle**: Wait Mode pauses time at each note (or two-hand
  chord) until you play it correctly. Auto Mode runs in real time and plays
  the piece itself — each note's sound and its key-light fire the instant
  it's due, so audio and the falling block stay in sync; you can still play
  along freely, it just won't affect the song.
- **Loop**: repeat just a note range (e.g. notes 5–12) instead of the whole
  piece — set the start/end and it loops there in either style, so you can
  drill a hard passage without replaying everything before it.

### Recording

The record button (top-left of the piano) works in either mode. Stop it and
a "Download MIDI" button appears with your performance, ready to open in any
DAW or notation app, or re-import back into Nocturne.

## Project structure

```
src/
├── data/               song library (10 built-in pieces)
├── lib/                 audio engine (multi-instrument), keyboard mapping,
│                        key geometry, song builder, MIDI file import/export,
│                        imported-song + practice-progress persistence
├── hooks/               app-level hooks (theme)
├── features/piano/       the piano itself
│   ├── PianoStage.tsx      orchestrator: owns audio + input + playback state
│   ├── PianoKeyboard.tsx / PianoKey.tsx   the DOM keybed
│   ├── NoteLane.tsx         canvas layer: falling notes, glow, particles
│   ├── TopBar.tsx / SongPicker.tsx / SongStyleToggle.tsx /
│   │   MidiImportButton.tsx / RecordControl.tsx / InstrumentPicker.tsx /
│   │   MetronomeControl.tsx / VolumeControl.tsx / SustainBadge.tsx /
│   │   NoteNamesToggle.tsx / LoopControl.tsx / KeyboardHelpOverlay.tsx
│   ├── engine/                canvas particle-system math (pure functions)
│   └── hooks/                  keyboard input, MIDI input (notes + CC64
│                                sustain), recording, metronome scheduler,
│                                sustain pedal, Wait/Auto/Loop playback
│                                state machine (shared chord-group engine)
```

## Stack

React 19 + TypeScript + Vite, Tailwind CSS v4 (design tokens in
`src/index.css`), [`smplr`](https://github.com/danigb/smplr) for the sampled
instruments (grand piano, electric piano, organ), the browser's native Web
Audio API for the metronome click and Web MIDI API for hardware input,
[`@tonejs/midi`](https://github.com/Tonejs/Midi) for both directions of MIDI
file conversion (import and recording export), `localStorage` for imported
songs and practice progress. Falling notes, the glow trail, and the particle
bursts are hand-rolled on a `<canvas>` — no charting or animation library.

Note on `@tonejs/midi`: it hasn't had a release in a few years, but it
remains the de facto standard for this exact task in the JS ecosystem, has
no maintained successor, and parses/writes a binary file format (MIDI) that
is itself decades-stable — unlike a UI library, there's little here that
would need frequent updates.

## What's next

A few natural directions from here: a duet/ensemble mode using more than two
simultaneous parts, an adjustable Auto Mode playback speed, and richer
two-hand arrangements for more of the built-in songs.
