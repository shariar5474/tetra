# CineForge AI — Installation & Chrome Setup Guide

## System Requirements
- Google Chrome version 114+ (or any Chromium browser: Brave, Edge, Arc)
- Node.js 18+ (for building from source)
- An active Google account with access to [Google Flow](https://labs.google/fx/tools/flow)

---

## Quick Installation (Load Unpacked)

CineForge AI is engineered as a unified Manifest V3 Chrome Extension. You can install it into your browser in under 60 seconds:

### Step 1: Build the Extension
In your terminal, navigate to the `cineforge-ai` project directory:

```bash
# Install dependencies
npm install

# Compile the production bundle
npm run build
```

The build will generate a ready-to-load extension directory in `dist/`.

---

### Step 2: Load into Google Chrome

1. Open Google Chrome.
2. Navigate to:
   ```text
   chrome://extensions
   ```
3. In the top-right corner, toggle on **Developer mode**.
4. Click the **Load unpacked** button in the top-left toolbar.
5. In the file picker, select the `dist` folder located inside `c:\Users\UESR\Desktop\ai studio veo\dist`.
6. Click **Select Folder**.

---

### Step 3: Pin and Launch

1. Click the **Extensions** puzzle icon in your Chrome toolbar.
2. Find **CineForge AI - Cinematic Movie Studio** and click the **Pin** icon.
3. Click the CineForge AI icon in your toolbar, then click:
   ```text
   [ Open Full Studio Dashboard ]
   ```
   The full-screen production dashboard will launch in a dedicated Chrome tab.

---

## Verifying Installation
Once launched, you will see the **Midnight Navy & Neon Cyan** production studio. CineForge AI immediately establishes your local IndexedDB storage, meaning all projects, screenplay breakdowns, character bibles, and videos remain private and offline-first on your machine.
