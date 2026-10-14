# Manika's Little World 🌸

> A little place to breathe, feel loved, and find some peace.

A personal digital sanctuary created with love — a gentle, dreamy website designed to offer comfort, guided breathing, heartfelt letters, a private journal, and peaceful atmosphere experiences.

---

## ✨ Features

| Section | Description |
|---------|-------------|
| **Welcome Screen** | An enchanting animated welcome with sakura petals and a glowing entrance |
| **Home** | Rotating gentle reminders and quick shortcuts to comfort features |
| **Breathe** | A fully functional guided breathing exercise with adjustable timing |
| **Little Letters** | 8 heartfelt digital envelopes to open in different emotional moments |
| **Journal** | A private digital diary stored locally in the browser (localStorage) |
| **Peaceful Corner** | 5 visual atmosphere themes with optional ambient audio |

## 🎨 Design

- **Dreamy pastel palette** — blush pink, sakura, lavender mist, warm cream
- **Glassmorphism** — translucent frosted glass cards and navigation
- **Floating sakura petals** — gentle ambient particle effects
- **Elegant typography** — Playfair Display, Poppins, Caveat
- **Smooth animations** — respects `prefers-reduced-motion`
- **Mobile-first** — responsive design for all screen sizes

## 🚀 Getting Started

### Option 1: Open directly
Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local server (recommended for audio)
For the best experience with audio files, use a local server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (if npx is available)
npx -y serve .

# Using VS Code
# Install "Live Server" extension → Right-click index.html → "Open with Live Server"
```

Then open `http://localhost:8000` in your browser.

### Option 3: Publish online
Upload the entire project folder to any static hosting service:
- [GitHub Pages](https://pages.github.com/) (free)
- [Netlify](https://www.netlify.com/) (free tier)
- [Vercel](https://vercel.com/) (free tier)
- [Cloudflare Pages](https://pages.cloudflare.com/) (free)

## 📁 File Structure

```
sis stress/
├── index.html          — Main HTML (all sections)
├── style.css           — Complete stylesheet
├── script.js           — All interactive logic
├── assets/
│   ├── README.md       — Assets documentation
│   └── audio/
│       └── README.md   — Instructions for adding audio files
└── README.md           — This file
```

## 🔊 Adding Ambient Audio

The Peaceful Corner supports three ambient sounds. To add them:

1. Download royalty-free ambient audio (see `assets/audio/README.md` for sources)
2. Place the files in `assets/audio/`:
   - `rain.mp3` — Gentle rain
   - `forest.mp3` — Soft forest ambience
   - `water.mp3` — Flowing water
3. The audio controls will automatically detect the files

The website works perfectly without audio — visual atmospheres are fully functional.

## 🔒 Privacy

- **No analytics, tracking, or advertising**
- **No external data transmission**
- **No backend required**
- Journal entries are stored **only** in the browser's `localStorage`
- Journal data is **not encrypted** — avoid saving sensitive information on shared devices
- All settings are stored locally and can be cleared at any time

## ♿ Accessibility

- Semantic HTML5 structure
- ARIA labels on all interactive elements
- Full keyboard navigation support
- Visible focus indicators
- Respects `prefers-reduced-motion`
- Sufficient color contrast for readability
- Screen reader compatible

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 90+     |
| Edge    | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |

## 💜 Credits

Made with love by your little brother. 🤍
