export function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function isValidFlowUrl(url?: string): boolean {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    const validHosts = [
      'labs.google',
      'aitestkitchen.withgoogle.com',
      'flow.google',
      'fx.tools.google',
    ];
    return validHosts.some(host => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

export function validateMessageOrigin(sender: chrome.runtime.MessageSender): boolean {
  // Check if message is from extension itself or authorized content scripts
  if (!sender.id || sender.id !== chrome.runtime.id) {
    return false;
  }
  if (sender.tab?.url && !isValidFlowUrl(sender.tab.url)) {
    // If sent from a tab, make sure it's authorized
    return false;
  }
  return true;
}
