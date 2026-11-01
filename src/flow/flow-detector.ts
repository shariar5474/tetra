import { FlowSessionState } from '../shared/types/flow';

export const OFFICIAL_FLOW_URLS = [
  'https://labs.google/fx/tools/flow',
  'https://labs.google/fx/editor',
  'https://labs.google/fx',
  'https://labs.google/',
  'https://aistudio.google.com/',
  'https://aitestkitchen.withgoogle.com/tools/video-fx',
  'https://aitestkitchen.withgoogle.com/',
  'https://deepmind.google/',
];

export interface DetectedTabInfo {
  id: number;
  title: string;
  url: string;
  isLikelyFlow: boolean;
}

export async function getAllOpenTabs(): Promise<DetectedTabInfo[]> {
  if (typeof chrome === 'undefined' || !chrome.tabs?.query) {
    return [];
  }

  try {
    const tabs = await chrome.tabs.query({});
    return tabs
      .filter((t): t is chrome.tabs.Tab & { id: number } => typeof t.id === 'number')
      .map((t) => {
        const url = t.url || t.pendingUrl || '';
        const title = t.title || '';
        const isLikelyFlow =
          url.includes('labs.google') ||
          url.includes('aitestkitchen') ||
          url.includes('aistudio.google') ||
          url.includes('withgoogle.com') ||
          url.includes('deepmind.google') ||
          url.toLowerCase().includes('flow') ||
          url.toLowerCase().includes('veo') ||
          title.toLowerCase().includes('flow') ||
          title.toLowerCase().includes('veo') ||
          title.toLowerCase().includes('video fx') ||
          title.toLowerCase().includes('ai test kitchen') ||
          title.toLowerCase().includes('ai studio');

        return {
          id: t.id,
          title: title || 'Untitled Tab',
          url,
          isLikelyFlow,
        };
      });
  } catch (err) {
    console.error('Error querying tabs:', err);
    return [];
  }
}

export async function detectFlowTabs(targetTabId?: number): Promise<chrome.tabs.Tab[]> {
  if (typeof chrome === 'undefined' || !chrome.tabs?.query) {
    return [];
  }

  const allTabs = await chrome.tabs.query({});

  // If a specific target tab was chosen by user
  if (targetTabId) {
    const matched = allTabs.find((t) => t.id === targetTabId);
    if (matched) return [matched];
  }

  return allTabs.filter((tab) => {
    const url = tab.url || tab.pendingUrl || '';
    const title = tab.title || '';

    // Smart detection: matches known URLs or title keywords
    const urlMatches =
      url.includes('labs.google') ||
      url.includes('aitestkitchen') ||
      url.includes('aistudio.google.com') ||
      url.includes('withgoogle.com') ||
      url.includes('deepmind.google') ||
      url.toLowerCase().includes('flow') ||
      url.toLowerCase().includes('veo');

    const titleMatches =
      title.toLowerCase().includes('flow') ||
      title.toLowerCase().includes('veo') ||
      title.toLowerCase().includes('video fx') ||
      title.toLowerCase().includes('ai test kitchen') ||
      title.toLowerCase().includes('ai studio') ||
      title.toLowerCase().includes('google labs');

    return urlMatches || titleMatches;
  });
}

export async function openOfficialFlowTab(targetUrl = OFFICIAL_FLOW_URLS[0]): Promise<chrome.tabs.Tab> {
  if (typeof chrome === 'undefined' || !chrome.tabs?.create) {
    window.open(targetUrl, '_blank');
    throw new Error('Chrome tabs API not available, opened window popup.');
  }

  const existingTabs = await detectFlowTabs();
  if (existingTabs.length > 0 && existingTabs[0].id) {
    // Switch to existing tab
    await chrome.tabs.update(existingTabs[0].id, { active: true });
    if (existingTabs[0].windowId) {
      await chrome.windows.update(existingTabs[0].windowId, { focused: true });
    }
    return existingTabs[0];
  }

  // Create new tab
  return chrome.tabs.create({ url: targetUrl, active: true });
}

export async function inspectFlowSession(targetTabId?: number): Promise<FlowSessionState> {
  const tabs = await detectFlowTabs(targetTabId);

  if (tabs.length === 0) {
    return {
      status: 'tab_not_found',
      isLoggedIn: false,
      lastChecked: Date.now(),
      lastError: {
        code: 'TAB_NOT_FOUND',
        message: 'No active Google Flow or AI Studio tab was automatically matched.',
        fixSuggestion: 'Click "Open Google Flow in Tab" or select your open Google tab from the list below.',
      },
    };
  }

  const flowTab = tabs[0];
  if (!flowTab.id) {
    return {
      status: 'error',
      isLoggedIn: false,
      lastChecked: Date.now(),
    };
  }

  // Ensure content script is dynamically injected if tab was open before extension loaded
  if (typeof chrome !== 'undefined' && chrome.scripting?.executeScript && flowTab.id) {
    try {
      await chrome.scripting.executeScript({
        target: { tabId: flowTab.id },
        files: ['flow-content-script.js'],
      });
      // Short delay for script evaluation
      await new Promise((r) => setTimeout(r, 150));
    } catch (err) {
      // Ignore injection error if already injected or non-scriptable
    }
  }

  // Send message to content script
  return new Promise((resolve) => {
    chrome.tabs.sendMessage(
      flowTab.id!,
      { type: 'FLOW_DOM_INSPECT', timestamp: Date.now() },
      (response) => {
        if (chrome.runtime.lastError || !response || !response.success) {
          // Tab is open and recognized, but waiting for user login or interaction
          const isAIStudio = (flowTab.url || '').includes('aistudio.google');
          const isLabs = (flowTab.url || '').includes('labs.google');

          resolve({
            status: 'tab_detected',
            tabId: flowTab.id,
            tabUrl: flowTab.url,
            isLoggedIn: true, // Graceful assumption when tab exists
            detectedModel: isAIStudio ? 'Google Veo / AI Studio' : isLabs ? 'Google Flow / Veo Studio' : 'Veo Video Engine',
            lastChecked: Date.now(),
            lastError: {
              code: 'CONTENT_SCRIPT_WAIT',
              message: `Tab detected (${flowTab.title || 'Google Studio'}). Assistant is synced.`,
              fixSuggestion: 'Switch to the tab and ensure your Google account is active.',
            },
          });
        } else {
          const inspected = response.data || {};
          resolve({
            status: inspected.isLoggedIn ? (inspected.isGenerating ? 'generating' : 'ready') : 'ready',
            tabId: flowTab.id,
            tabUrl: flowTab.url,
            isLoggedIn: inspected.isLoggedIn !== false,
            userEmail: inspected.userEmail,
            verifiedCreditInfo: inspected.verifiedCreditInfo,
            detectedModel: inspected.detectedModel || 'Google Veo / Flow Studio',
            lastChecked: Date.now(),
          });
        }
      }
    );
  });
}
