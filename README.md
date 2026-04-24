# Mir Hyder Ali — Portfolio 2026

> **Live site:** [mirhyderali.com](https://mirhyderali.com)

Personal portfolio for an **AI HPC Infrastructure Lead Engineer** at Wistron Corporation. Built entirely from scratch with vanilla HTML, CSS, and JavaScript — no frameworks.

---

## Highlights

- **Interactive 3D Hardware Viewer** — four NVIDIA GB200 NVL72 models explorable in-browser via Three.js + Draco compression. Models generated with [Tripo3D AI](https://studio.tripo3d.ai) and optimised for web delivery (55 MB → ~6 MB each)
- **Aurora + Neural Web background** — animated canvas particle system with mouse interaction in dark mode; breathing hex-grid in light mode
- **Glassmorphism design system** — consistent glass card components with backdrop blur and specular highlights
- **SVG handwriting intro** — stroke-animated signature on first load
- **Puzzle-gated resume** — terminal-style challenge before the PDF unlocks
- **Scratch-card project reveals** — canvas-based scratchable project cards
- **Dark / Light mode** — fully themed, distinct backgrounds per mode, persisted via localStorage

---

## Tech Stack

| Layer | What |
|---|---|
| Markup | Semantic HTML5 |
| Styling | Vanilla CSS (custom properties, glassmorphism, keyframe animations) |
| Scripting | Vanilla JS (ES2022, Canvas API, IntersectionObserver) |
| 3D | Three.js r165, GLTFLoader, DRACOLoader, OrbitControls |
| Animation | GSAP 3 + ScrollTrigger |
| 3D Models | Tripo3D AI → Draco-compressed GLB |
| Fonts | Inter, JetBrains Mono (Google Fonts) |
| Hosting | GitHub Pages |

---

## 3D Models

| Model | Description | Compressed Size |
|---|---|---|
| GB200 Grace Blackwell Superchip | Base compute module, no NIC | 5.9 MB |
| GB200 NVL2 Module | Grace Blackwell + ConnectX-7 NDR 400G | 5.9 MB |
| NVL72 Rack Chassis | 8-tray chassis, no cabling | 6.2 MB |
| NVL72 Compute Tray | Full cabling, 9× NVL2 modules | 3.3 MB |

Models generated via [Tripo3D AI](https://studio.tripo3d.ai), Draco-compressed with `@gltf-transform/cli` at `--quantize-position 14` for quality-preserving compression.

---

## Structure

```
Portfolio-2026/
├── index.html          # Single-page app
├── style.css           # ~3500 lines, all custom
├── script.js           # Canvas animations, interactions, puzzle
├── three-scene.js      # Three.js scene setup
├── models/             # Draco-compressed GLB files
├── images/             # Static assets
└── resume.pdf          # Downloadable resume
```

---

## Local Development

No build step — open directly in a browser or use any static server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

---

*Built by Mir Hyder Ali · [LinkedIn](https://www.linkedin.com/in/mir-hyder-ali) · [mirhyderali.com](https://mirhyderali.com)*
