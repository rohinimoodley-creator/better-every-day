# Better Every Day 🌱 — Sustainable Small-Step Wellbeing

> **Better Every Day** is a comprehensive, holistic wellness application built on the principle of progressive disclosure: **"Small steps, sustainable wellbeing."** Designed to feel calming, intuitive, and zero-overwhelm while packing deep wellness tracking and personalization.

---

## ✨ Key Features & Architecture

### 🏠 1. Home Dashboard
- **Gentle Greeting & Daily Check-In**: Dynamic time-of-day greeting with Pip the Sprout mascot avatar and single-tap daily check-in.
- **"One Thing at a Time" (Guide Me Flow)**: Focus mode providing interactive in-place exercises (Hydrate, Breathwork, Move, Mind, Nourish, Rest) with zero unexpected page redirects, instant hub auto-updating, and exercise switching.
- **Need a Little Support?**: Quick SOS motivation and calming breathing exercises on demand.
- **Customizable Weekly Overview**: Choose exactly which wellness pillars (Hydrate, Move, Nourish, Rest, Mind, Breathwork, Cycle, Steps) appear on your dashboard.
- **Today's Schedule & Routine Alignment**: Visual timeline of daily intentions and routines.

### 🧭 2. Wellness Hub (8 Core Pillars)
- **💧 Hydrate**: Smart water tracking, volume presets, refill reminders, and hourly hydration distribution.
- **🏃 Move**: Guided flows, Count Down (`30m → 0:00`) vs Count Up (`0:00 → 30m`) timers, Live Move Tracker (cadence, steps, km, MET calorie burn) with **Pause**, **Finish & Save**, and **Stop & Delete** controls.
- **🥗 Nourish**: Mindful meal logging, nutrient balance insights, cravings tracker, and community recipe queue.
- **🌙 Rest**: Sleep stages analysis, restorative audio soundscape player (Rain, Ocean, Brown Noise, Forest, Sleep Drone), and sleep timers.
- **🙏 Mind**: Gratitude journal studio with prompt discovery, tags, voice note capture, and mood history.
- **🌬️ Breathwork**: Real-time animated breathing pacers (Box Breathing 4-4-4-4, 4-7-8 Deep Calm, 4-6 Heart Resonance, Physiological Sigh) with audio chimes.
- **🌸 Cycle**: Phase-aware hormonal guidance, symptom tracking, and sync recommendations.
- **⚡ Body**: Body signals log, HRV metrics, recovery score, and anomaly detection.

### 🌿 3. Mascot Companion (Pip the Sprout)
- **Wardrobe & Aura Customization**: Click Pip anywhere on the Home screen to customize his aura color (Sprout, Sunset, Lavender, Ocean, Honey) and headwear (Flower, Sunglasses, Knit Beanie, Crown, Leaf).

### 👥 4. Together & Social Hub
- **Wellness Circles & Challenges**: Private peer accountability circles, community challenges, and cheer sharing.
- **Granular Privacy Center**: Complete control over what is shared publicly, with circles, or kept strictly local.

### 🎙️ 5. Voice & AI Record Hub
- **Multimodal Voice Journaling**: Speak freely to log reflections, habits, or meals with on-device parsing and privacy review.

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation
```bash
# Clone or navigate to the repository
cd better-every-day

# Install dependencies
npm install

# Start the local development server (accessible locally and on your LAN)
npm run dev -- --host
```

By default, the application runs on `http://localhost:5173/` and exposes a local network IP (e.g. `http://192.168.x.x:5173/`) so you can test on mobile devices connected to the same Wi-Fi.

### Build & Lint
```bash
# Check code style and rules
npm run lint

# Compile production bundle
npm run build
```

---

## 📦 Pushing to GitHub

To publish this codebase to your own GitHub repository:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Stage all files
git add .

# 3. Commit
git commit -m "feat: initial commit of Better Every Day wellness app"

# 4. Create a new repository on GitHub (https://github.com/new)

# 5. Link your GitHub remote and push (replace with your repo URL)
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/better-every-day.git
git push -u origin main
```

---

## 🛠️ Technology Stack
- **Framework**: React 19 + Vite
- **Styling**: Modern CSS Variables & Glassmorphism design system
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API synthesized pink/brown noise generators & harmonic chimes
- **Interactive Effects**: Canvas Confetti

---

## 📄 License
MIT License. Built with care for sustainable personal wellbeing.
