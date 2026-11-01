# Chrome Web Store Packaging & Publishing Guide

## 1. Automated Packaging
CineForge AI includes an automated script that compiles and creates a production ZIP package according to Google Chrome Web Store policies.

Run:
```bash
npm run package
```

This will:
1. Compile the production bundles via Vite into `dist/`.
2. Copy `manifest.json` and static assets.
3. Generate `cineforge-ai-v1.0.0.zip` at the project root.

---

## 2. Chrome Web Store Developer Dashboard Steps

1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
2. Sign in with your verified Google Developer account.
3. Click **Add new item**.
4. Drag and drop the generated `cineforge-ai-v1.0.0.zip` file.
5. Fill out the Store Listing:
   - **Product Name:** CineForge AI - Cinematic Movie Studio
   - **Summary:** One Script. One World. One Complete Movie. All-in-One AI Cinematic Movie Production Chrome Extension.
   - **Category:** Productivity / Photos & Videos
   - **Detailed Description:** Paste content from `README.md`.
6. Upload Screenshots (1280x800 or 640x400) and promotional tiles.
7. Privacy Tab:
   - Mark permissions used (`storage`, `tabs`, `scripting`, `downloads`, `alarms`).
   - Justification: "Allows users to direct AI movie projects locally and orchestrate their own Google Flow account generation."
8. Click **Submit for Review**.
