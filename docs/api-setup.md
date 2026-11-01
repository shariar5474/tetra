# AI Models & External API Setup

## Primary Engine: Google Flow
CineForge AI does not require an API key for its primary workflow because it utilizes your authenticated Google Flow browser session.

---

## Optional: Google AI Studio / Gemini API

If you wish to use official Google Gemini API endpoints for high-speed script analysis or direct Veo video generation:

### Step 1: Obtain a Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Click **Get API key**.
3. Create an API key in a Google Cloud project.

### Step 2: Configure in CineForge AI
1. In the CineForge sidebar, navigate to **AI Models**.
2. Find **Gemini 2.5 Flash** or **Google Veo Video API**.
3. Paste your API key into the **API Secret Key** input field.
4. Click **Test Connection**.

### Privacy & Storage Note
- API keys are stored in your local browser **IndexedDB** database.
- Keys are never logged, forwarded, or shared with third-party tracking services.
