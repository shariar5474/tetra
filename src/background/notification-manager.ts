export function showNotification(title: string, message: string, id = 'cineforge-notif'): void {
  if (typeof chrome !== 'undefined' && chrome.notifications?.create) {
    chrome.notifications.create(id, {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icons/icon-128.png'),
      title,
      message,
      priority: 2,
    });
  }
}
