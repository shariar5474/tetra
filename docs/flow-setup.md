# Google Flow Integration & Setup Guide

## Overview
CineForge AI integrates with **Google Flow (Veo Video Studio)** directly inside Google Chrome without requiring external API tokens or proxy servers. It uses your own authorized Google account and eligible Flow credits.

---

## Security & Ethics Architecture

CineForge AI strictly enforces safe, ethical browser automation:
- **No Password Collection:** You authenticate on Google's official login page.
- **No Cookie Theft:** The extension never accesses, reads, or exports your Google authentication cookies or session secrets.
- **No CAPTCHA Bypass:** If security challenges appear, they are displayed directly to you in the official tab.
- **Authentic Credits Only:** Credit counts are never fabricated or guessed.

---

## Connection Steps

### Step 1: Open Google Flow in Chrome
1. In the CineForge AI dashboard, navigate to **Google Flow** in the left sidebar.
2. Click **Open Google Flow in Tab**.
3. A new Chrome tab will open to:
   ```text
   https://labs.google/fx/tools/flow
   ```
4. Log into your Google account on that tab.

### Step 2: Content Script Assistant Verification
Once the Flow tab is active:
- A sleek floating status badge will appear in the bottom-right corner:
  ```text
  ● CineForge AI Connected
  ```
- Return to the CineForge dashboard tab and click **Check Connection**.
- Your connection status will update to `Ready`.

---

## Production Generation & Manual Handoff

### Automated Mode
When you click **Generate via Google Flow** in **Scene Generator**:
1. CineForge extracts the scene's prompt with character and environment anchors.
2. The prompt is automatically transferred into Flow's generation input field.
3. The generation queue monitors progress until completion.

### Manual Handoff Fallback Mode
If Google Flow updates its interface layout or requires interactive verification:
1. CineForge activates **Manual Handoff Mode**.
2. Click the **Copy Prompt** button.
3. Switch to your Flow tab, paste the prompt, and click **Generate**.
4. When your video completes, click **Import Generated Video** in CineForge.
5. The video clip is instantly linked to your scene and populated onto the timeline.
