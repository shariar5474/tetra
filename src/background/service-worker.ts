import { openOrFocusDashboardTab } from './tab-manager';
import { recoverInterruptedJobs } from './recovery-manager';
import { showNotification } from './notification-manager';
import { backgroundJobManager } from './job-manager';

console.log('[CineForge AI] Background Service Worker starting...');

// Handle installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[CineForge AI] Installed:', details.reason);
  // Set alarm for periodic job check
  chrome.alarms.create('cineforge_job_heartbeat', { periodInMinutes: 1 });
  // Recover any previous jobs
  recoverInterruptedJobs();
});

// Alarm listener
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'cineforge_job_heartbeat') {
    recoverInterruptedJobs();
  }
});

// When user clicks the action icon (if no popup configured or from context menu)
chrome.action.onClicked.addListener(() => {
  openOrFocusDashboardTab();
});

// Runtime message dispatcher
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'OPEN_DASHBOARD':
      openOrFocusDashboardTab().then((tab) => {
        sendResponse({ success: true, tabId: tab.id });
      });
      return true;

    case 'SHOW_NOTIFICATION':
      showNotification(message.payload?.title || 'CineForge AI', message.payload?.message || '');
      sendResponse({ success: true });
      return true;

    case 'JOB_START':
      if (message.payload?.jobId) {
        backgroundJobManager.startJob(message.payload.jobId);
        sendResponse({ success: true });
      }
      return true;

    default:
      return false;
  }
});
