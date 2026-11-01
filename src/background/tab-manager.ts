export async function getActiveFlowTab(): Promise<chrome.tabs.Tab | null> {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.url && (tab.url.includes('labs.google') || tab.url.includes('aitestkitchen'))) {
      return tab;
    }
  }
  return null;
}

export async function openOrFocusDashboardTab(): Promise<chrome.tabs.Tab> {
  const dashboardUrl = chrome.runtime.getURL('src/dashboard/dashboard.html');
  const tabs = await chrome.tabs.query({});
  const existing = tabs.find((t) => t.url && t.url.startsWith(dashboardUrl));

  if (existing && existing.id) {
    await chrome.tabs.update(existing.id, { active: true });
    if (existing.windowId) {
      await chrome.windows.update(existing.windowId, { focused: true });
    }
    return existing;
  }

  return chrome.tabs.create({ url: dashboardUrl, active: true });
}
