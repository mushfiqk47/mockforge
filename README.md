# ⚡ MockForge

> **Transform your screenshots into photorealistic 3D studio device mockups in seconds.**

[![React](https://img.shields.io/badge/React-19-blue.svg?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Font](https://img.shields.io/badge/Font-Satoshi-black.svg?style=flat-square)](https://www.fontshare.com/fonts/satoshi)
[![Created By](https://img.shields.io/badge/X-@mushfiqk47-black.svg?style=flat-square&logo=x)](https://x.com/mushfiqk47)

**MockForge** is a modern, lightweight web application designed for creators, designers, and developers to generate commercial-grade device mockups directly in the browser. Featuring realistic device hardware modeling, multi-stop shadows, diagonal glass sheen glare, and one-click high-resolution PNG export.

---

## ✨ Features

### 🖥️ 7 Realistic Device Frames
- **macOS Safari Browser**: Interactive macOS traffic light buttons with hover action glyphs (`×`, `−`, `+`), navigation controls (back, forward, reload), active SSL security padlock, editable URL domain, and PRO pill badge.
- **iPhone 16 Pro Mobile**: Physical side buttons (Action button, Volume Up/Down, Power key), Dynamic Island with camera lens aperture & ambient sensor, realistic status bar (`9:41`, Wi-Fi, cellular, battery pill), and home indicator.
- **MacBook Pro Laptop**: Clamshell display lid with camera notch, FaceTime lens, and machined aluminum bottom keyboard deck with front thumb opening indent.
- **iPad Pro Tablet**: Slim symmetric bezels, top power key, side volume rocker, FaceTime camera with antireflective glint, and home bar.
- **Apple Studio Display Monitor**: Ultra-thin metallic bezel, FaceTime HD camera with active green status LED, aluminum bottom chin bar with embossed logo dot, and weighted cylindrical stand assembly.
- **Floating Glass**: Translucent 28px frosted glass panel with specular border highlights, gloss header, and domain badge.
- **Frameless**: Pure edge-to-edge layout for minimal, borderless presentation.

### 🎨 3 Premium Device Finishes
- **Dark Titanium** (Space Black): Dark metallic chassis with specular highlights.
- **Silver Aluminum**: Sleek natural silver casing with light titlebars and high-contrast address elements.
- **Midnight**: Deep navy blue metallic housing with luminous sky blue accents.

### ✨ Realistic Glass Glare Sheen
- Toggleable 42° diagonal specular screen reflection (`✦ Glare on / No glare`) with `pointer-events: none` ensuring that pan-and-crop and divider interactions remain 100% responsive.

### 🎚️ Format & Hero Modes
- **Single Hero**: Solo mockup layout with interactive pan-and-crop pointer capture.
- **Split Hero**: Dual-view layout with a draggable atlas divider and independent horizontal/vertical controls per section.

### 📐 Ratios & Dimensions
- **Fit (Auto)**: Intelligently sizes to match natural device aspect ratios.
- **16:9**: Desktop wide display.
- **9:16**: Mobile story / vertical format.
- **4:3**: Classic presentation display.
- **1:1**: Social media square.

### 🌌 Studio Backdrops
- Choose from solid black, ember glow, vibrant dual-stop gradients, or realistic 3D studio background backdrops.

### 💬 Interactive Floating Suggestion Box
- Floating suggestion pill in the bottom-right corner matching modern SaaS interfaces.
- Opens an interactive suggestion popover directly connected to **[@mushfiqk47 on X](https://x.com/mushfiqk47)** with pre-composed tweet intents and one-click DM actions.

### 🌓 WCAG AAA Light & Dark Mode
- Theme toggle featuring the Lucide `sun-moon` icon.
- Hand-tuned contrast tokens ensuring full readability in both light and dark environments.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev) & [React DOM 19](https://react.dev)
- **Build Tool**: [Vite 8](https://vitejs.dev)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) with `@tailwindcss/vite`
- **Language**: [TypeScript 5.7](https://www.typescriptlang.org)
- **Typography**: [Satoshi by Fontshare](https://www.fontshare.com/fonts/satoshi)
- **Export Engine**: [`html-to-image`](https://github.com/bubkoo/html-to-image)
- **Linter & Formatter**: [OxFmt](https://github.com/oxc-project/oxc)

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org) (v18 or newer recommended)
- [pnpm](https://pnpm.io) (or npm / yarn / bun)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/mushfiqk47/mockforge.git
   cd mockforge
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```
   Open `http://localhost:8443` in your browser.

4. **Build for production**:
   ```bash
   pnpm build
   ```

5. **Format code**:
   ```bash
   pnpm run format
   ```

---

## 📂 Project Structure

```
├── index.html              # HTML shell & Satoshi font preconnects
├── package.json            # Scripts & project dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration with React & Tailwind CSS v4
├── src/
│   ├── App.tsx             # Composition root (thin: wires state + layout)
│   ├── main.tsx            # React application entrypoint
│   ├── index.css           # Global CSS, theme tokens, and frame architectures
│   ├── types.ts            # Domain types for the editable mockup document
│   ├── services/           # Framework-free logic: reducer, layout maths,
│   │                       #   drag geometry, export pipeline, uploads, presets
│   ├── hooks/              # React adapters: useMockupState, useRafThrottle,
│   │                       #   useDividerDrag, useCropDrag
│   ├── components/         # MockupCanvas, FrameShell, MockupContent, icons,
│   │   │                   #   ControlPanel, FloatingSuggestionBox
│   │   ├── sections/       # One file per control-panel section
│   │   └── ui/             # Shared panel primitives (RangeInput, swatches)
│   └── Frame/              # 3D studio backdrop assets
│       ├── laptop_pro_frame.jpg
│       ├── mobile_tall_frame.jpg
│       └── studio_monitor_frame.jpg
```

### Architecture notes

- **State**: one reducer (`src/services/mockupState.ts`) driven by `useMockupState()`. Components never call `setState` for document state; they call named `actions`.
- **Performance**: every panel section and the canvas are `memo`ized and receive stable state slices, so dragging the divider or crop handle only re-renders the canvas. Pointer moves are coalesced to one update per animation frame.
- **Purity**: geometry, clamping and defaults live in `src/services` as pure functions, which keeps them testable without React or a DOM.

### ⚠️ Formatting caveat

`pnpm run format` uses oxfmt 0.2.0, which is **lossy**: it removes the separator inside single-line type/object literals (`{ x: number; y: number }` → `{ x: number y: number }`), turning valid TypeScript into invalid TypeScript. Do not run it until the formatter is fixed or configured otherwise.


---

## 👤 Author

**Mushfiq**
- X (Twitter): [@mushfiqk47](https://x.com/mushfiqk47)
- GitHub: [@mushfiqk47](https://github.com/mushfiqk47)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
