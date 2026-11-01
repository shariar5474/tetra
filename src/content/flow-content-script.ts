// CineForge AI - Google Flow Content Script
// Manifest V3 Content Script for authorized Google Flow / AI Studio assistance

(function () {
  console.log('[CineForge AI] Google Flow Content Script active.');

  function findGeneratedVideo(): string | null {
    const videos = Array.from(document.querySelectorAll('video'));
    for (const v of videos) {
      if (v.src && v.src.length > 5) {
        return v.src;
      }
      const source = v.querySelector('source');
      if (source && source.src) {
        return source.src;
      }
    }
    const downloadLinks = Array.from(document.querySelectorAll('a[download], a[href*=".mp4"], a[href*="video"]'));
    for (const a of downloadLinks) {
      const href = (a as HTMLAnchorElement).href;
      if (href && (href.includes('.mp4') || href.includes('video'))) {
        return href;
      }
    }
    return null;
  }

  function injectStatusBadge() {
    let badge = document.getElementById('cineforge-flow-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.id = 'cineforge-flow-badge';
      badge.style.position = 'fixed';
      badge.style.bottom = '24px';
      badge.style.right = '24px';
      badge.style.zIndex = '999999';
      badge.style.padding = '8px 14px';
      badge.style.borderRadius = '9999px';
      badge.style.background = 'linear-gradient(135deg, #0B0F19, #1E293B)';
      badge.style.border = '1px solid #06B6D4';
      badge.style.boxShadow = '0 8px 24px rgba(6, 182, 212, 0.35)';
      badge.style.color = '#F8FAFC';
      badge.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      badge.style.fontSize = '12px';
      badge.style.fontWeight = '600';
      badge.style.display = 'flex';
      badge.style.alignItems = 'center';
      badge.style.gap = '10px';
      badge.style.transition = 'all 0.2s ease';
      document.body.appendChild(badge);
    }

    const videoUrl = findGeneratedVideo();
    if (videoUrl) {
      badge.innerHTML = `
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #10B981; box-shadow: 0 0 10px #10B981;"></span>
        <span>CineForge AI</span>
        <button id="cineforge-sync-video-btn" style="background: linear-gradient(135deg, #06B6D4, #3B82F6); color:#fff; border:none; border-radius:999px; padding:4px 10px; font-size:11px; font-weight:700; cursor:pointer; box-shadow:0 2px 6px rgba(6,182,212,0.4);">
          📥 Sync to CineForge
        </button>
      `;

      const btn = badge.querySelector('#cineforge-sync-video-btn');
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          chrome.runtime.sendMessage({
            type: 'FLOW_VIDEO_CAPTURED',
            payload: { videoUrl, timestamp: Date.now() },
          });
          btn.textContent = '✓ Sent to CineForge!';
          setTimeout(() => {
            btn.textContent = '📥 Sync to CineForge';
          }, 3000);
        });
      }
    } else {
      badge.innerHTML = `
        <span style="width: 8px; height: 8px; border-radius: 50%; background: #10B981; box-shadow: 0 0 8px #10B981;"></span>
        <span id="cineforge-open-link" style="cursor:pointer;">CineForge AI Connected</span>
      `;
      const link = badge.querySelector('#cineforge-open-link');
      if (link) {
        link.addEventListener('click', () => {
          chrome.runtime.sendMessage({ type: 'OPEN_DASHBOARD', timestamp: Date.now() });
        });
      }
    }
  }

  // Poll DOM periodically for video generation changes
  setInterval(injectStatusBadge, 3000);

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    injectStatusBadge();
  } else {
    document.addEventListener('DOMContentLoaded', injectStatusBadge);
  }

  // DOM Inspection
  function inspectDOM() {
    const avatar = document.querySelector('img[src*="googleusercontent.com"], a[href*="accounts.google.com/SignOut"], [aria-label*="Google Account"]');
    const hasSignInBtn = !!Array.from(document.querySelectorAll('a, button')).find(
      (el) => el.textContent?.toLowerCase().includes('sign in') || el.textContent?.toLowerCase().includes('log in')
    );
    const isLoggedIn = !!avatar || !hasSignInBtn;

    let verifiedCreditInfo: { hasCredits: boolean; rawText: string; verifiedAt: number } | undefined = undefined;
    const allTextNodes = document.querySelectorAll('*');
    for (const el of allTextNodes) {
      if (el.children.length === 0 && el.textContent) {
        const text = el.textContent.trim();
        if (/(\d+)\s*(credits?|gens?|generations?)/i.test(text) && text.length < 50) {
          verifiedCreditInfo = {
            hasCredits: true,
            rawText: text,
            verifiedAt: Date.now(),
          };
          break;
        }
      }
    }

    const promptInput = document.querySelector(
      'textarea, input[placeholder*="prompt" i], input[placeholder*="describe" i], [contenteditable="true"]'
    );

    const generateBtn = Array.from(document.querySelectorAll('button')).find(
      (btn) =>
        btn.textContent?.toLowerCase().includes('generate') ||
        btn.textContent?.toLowerCase().includes('create') ||
        btn.textContent?.toLowerCase().includes('run') ||
        btn.getAttribute('aria-label')?.toLowerCase().includes('generate') ||
        btn.getAttribute('aria-label')?.toLowerCase().includes('run')
    );

    const isGenerating = !!document.querySelector(
      '[role="progressbar"], .loading-spinner, [aria-busy="true"], svg.animate-spin'
    );

    const isAIStudio = window.location.hostname.includes('aistudio');
    const isLabs = window.location.hostname.includes('labs.google');
    const detectedModel = isAIStudio ? 'Google Veo / AI Studio' : isLabs ? 'Google Flow / Veo Studio' : 'Veo Video Engine';
    const videoUrl = findGeneratedVideo();

    return {
      isLoggedIn,
      verifiedCreditInfo,
      hasPromptInput: !!promptInput,
      hasGenerateBtn: !!generateBtn,
      isGenerating,
      detectedModel,
      videoUrl,
    };
  }

  // Fill prompt into Google Flow's input
  function autofillPrompt(promptText: string): boolean {
    const promptInput = document.querySelector<HTMLTextAreaElement | HTMLInputElement>(
      'textarea, input[placeholder*="prompt" i], input[placeholder*="describe" i], [contenteditable="true"]'
    );

    if (!promptInput) return false;

    if (promptInput.tagName === 'TEXTAREA' || promptInput.tagName === 'INPUT') {
      promptInput.value = promptText;
      promptInput.dispatchEvent(new Event('input', { bubbles: true }));
      promptInput.dispatchEvent(new Event('change', { bubbles: true }));
      promptInput.focus();
      return true;
    } else if (promptInput.isContentEditable) {
      promptInput.innerText = promptText;
      promptInput.dispatchEvent(new Event('input', { bubbles: true }));
      promptInput.focus();
      return true;
    }

    return false;
  }

  // Listen for runtime messages
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'FLOW_DOM_INSPECT') {
      const info = inspectDOM();
      sendResponse({ success: true, data: info });
      return true;
    }

    if (message.type === 'FLOW_AUTOFILL_PROMPT') {
      const success = autofillPrompt(message.payload?.prompt || '');
      sendResponse({ success });
      return true;
    }

    return false;
  });
})();
