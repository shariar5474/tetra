# CineForge AI — Troubleshooting & Diagnostics

## Common Issues & Solutions

### 1. "Tab Not Found" when connecting to Google Flow
- **Cause:** No Google Flow tab is open in your active Chrome window.
- **Solution:** Click **Open Google Flow in Tab** on the Google Flow page or in the top navigation. Keep that tab open while working in CineForge.

---

### 2. "Content Script Initializing" or "Waiting for Login"
- **Cause:** The Google Flow tab has opened, but Google is presenting a login prompt.
- **Solution:** Switch to the Google Flow tab, log in with your Google account, and click **Check Connection** in CineForge.

---

### 3. Google Flow UI updated or selector mismatch
- **Cause:** Google has modified class names or element IDs on `labs.google/fx/tools/flow`.
- **Solution:** CineForge AI automatically switches to **Manual Handoff Mode**. Click **Copy Prompt**, paste it into the Flow input box, click generate, and then click **Import Generated Video** in CineForge.

---

### 4. Chrome Service Worker Suspended / Browser Restart
- **Cause:** Chrome Manifest V3 service workers are ephemeral and will enter sleep state when idle.
- **Solution:** CineForge AI includes a built-in `RecoveryManager`. Unfinished tasks are persisted in IndexedDB and recovered as soon as you open the extension or the alarm triggers.

---

### 5. Large Project Memory / Rendering Slowdowns
- **Cause:** Storing dozens of uncompressed videos in memory can exhaust browser heap space.
- **Solution:**
  - CineForge streams assets through IndexedDB blob keys and revokes Object URLs automatically.
  - To clean temporary render caches, navigate to **Settings** and click **Clear Temporary Cache**.
