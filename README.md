# 🎹 Nocturne

<p align="center">
  <em>A beautiful, playable piano in the browser with real sampled sounds, falling notes, and MIDI support.</em>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#usage">Usage</a> •
  <a href="#project-structure">Structure</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#roadmap">Roadmap</a>
</p>

---

## ✨ Features

| Feature | Description |
| --------- | ------------- |
| 🎵 **Real Piano Sounds** | High-quality sampled grand piano via [smplr](https://github.com/danigb/smplr) |
| ✨ **Glowing Key Effects** | Beautiful canvas-based particle effects and glow trails |
| 🎼 **Learn a Song Mode** | Falling note blocks guide you through 10 built-in pieces |
| ⏸️ **Wait Mode** | Time pauses until you hit the right key — perfect for beginners |
| 🎯 **Scroll Mode** | Real-time scoring for a timing challenge |
| 🎹 **MIDI Keyboard Support** | Plug in any MIDI keyboard — auto-detected via Web MIDI API |
| 📥 **Import MIDI Files** | Bring your own `.mid` files with automatic hand splitting |
| 🌓 **Dark/Light Themes** | Elegant design with warm ember (right hand) and cool violet (left hand) |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile with touch support |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nocturne.git

# Navigate to project
cd nocturne

# Install dependencies
npm install

# Start development server
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

> 🎹 Piano samples are fetched from a CDN on first play — an internet connection is required.

---

## 🎮 Usage

### Controls

| Input Method | How to Use |
| -------------- | ------------ |
| 🖱️ **Mouse/Touch** | Click or tap any key |
| ⌨️ **Computer Keyboard** | `Z S X D C V G B H N J M` (white/black keys), `Q 2 W 3 E R 5 T 6 Y 7 U` (next octave) |
| 🎹 **MIDI Keyboard** | Plug in via USB — auto-detected. Use `[` / `]` to shift octaves |

### Learning a Song

1. Click **"Learn a Song"** in the top bar
2. Select from **10 built-in pieces** across skill levels:
   - 🟢 **Beginner**: Hot Cross Buns, Mary Had a Little Lamb, Frère Jacques, Row Row Row Your Boat, Twinkle Twinkle Little Star
   - 🟡 **Intermediate**: Happy Birthday to You, Ode to Joy, Jingle Bells, Amazing Grace
   - 🔴 **Advanced**: Für Elise (opening)
   - 🤝 **Two Hands**: Twinkle Twinkle, Ode to Joy (with bass accompaniment)
3. Toggle between **Wait Mode** (learn) and **Scroll Mode** (challenge)
4. Or import your own `.mid` file!

---

## 📁 Project Structure

```
nocturne/
├── src/
│   ├── data/                    # 📚 Song library (10 built-in pieces)
│   │   ├── songs.ts
│   │   └── demoSong.ts
│   ├── lib/                     # 🔧 Core utilities (no React)
│   │   ├── piano-audio.ts       # Audio engine & sampling
│   │   ├── keyboard-map.ts      # Key binding mappings
│   │   ├── midi-import.ts       # MIDI file parser
│   │   ├── note-utils.ts        # Note conversion utilities
│   │   └── song-builder.ts      # Song data structures
│   ├── hooks/                   # 🪝 App-level hooks
│   │   └── theme.ts
│   ├── features/
│   │   └── piano/               # 🎹 Piano feature module
│   │       ├── PianoStage.tsx    # Main orchestrator
│   │       ├── PianoKeyboard.tsx # Keybed component
│   │       ├── PianoKey.tsx      # Individual key
│   │       ├── NoteLane.tsx      # Canvas: falling notes & particles
│   │       ├── TopBar.tsx        # Navigation bar
│   │       ├── SongPicker.tsx    # Song selection UI
│   │       ├── SongStyleToggle.tsx # Wait/Scroll toggle
│   │       ├── MidiImportButton.tsx # Import .mid files
│   │       ├── engine/           # 🎨 Canvas particle system
│   │       │   └── particles.ts
│   │       └── hooks/            # 🎹 Piano-specific hooks
│   │           ├── useKeyboardInput.ts
│   │           ├── useMidiInput.ts
│   │           └── useSongPlayback.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                # 🎨 Design tokens & themes
├── public/                      # Static assets
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🛠️ Tech Stack

| Technology | Purpose | Icon |
| ------------ | --------- | ------ |
| [React 19](https://react.dev/) | UI Framework | ⚛️ |
| [TypeScript](https://www.typescriptlang.org/) | Type Safety | 📘 |
| [Vite](https://vitejs.dev/) | Build Tool & Dev Server | ⚡ |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling & Design Tokens | 🎨 |
| [smplr](https://github.com/danigb/smplr) | Sampled Piano Audio | 🎹 |
| [@tonejs/midi](https://github.com/Tonejs/Midi) | MIDI File Parsing | 🎼 |
| [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) | Hardware MIDI Input | 🔌 |
| [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) | Particle Effects & Animations | 🎬 |
| [oxlint](https://oxc-project.github.io/) | Linting | 🔍 |

---

## 🎨 Design System

Nocturne uses a custom design token system with semantic color variables:

```css
/* Theme tokens */
--color-ember: #f2a65a;      /* Right hand - warm orange */
--color-violet: #7c6cf0;     /* Left hand - cool purple */
--color-base: #0a0912;       /* Dark background */
--color-surface: #131120;    /* Card surfaces */
```

**Typography:**

- Display: Fraunces (serif)
- Body: Manrope (sans-serif)
- Code: IBM Plex Mono

---

## 🗺️ Roadmap

Future enhancements:

- [ ] 🎤 Record & export your playing
- [ ] ⏱️ Built-in metronome
- [ ] 🎵 Additional instrument sounds
- [ ] 💾 Persist imported songs across sessions
- [ ] 📊 Practice progress tracking
- [ ] 🎓 Guided lessons with scoring

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ and 🎹
</p>
