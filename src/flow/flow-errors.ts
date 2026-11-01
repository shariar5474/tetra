export interface FlowError {
  code: 'TAB_NOT_FOUND' | 'LOGIN_REQUIRED' | 'SELECTOR_MISMATCH' | 'CREDITS_EXHAUSTED' | 'RATE_LIMITED' | 'NETWORK_ERROR' | 'MANUAL_HANDOFF_NEEDED' | 'UNKNOWN';
  message: string;
  recommendation: string;
}

export function createFlowError(code: FlowError['code'], customMessage?: string): FlowError {
  switch (code) {
    case 'TAB_NOT_FOUND':
      return {
        code,
        message: customMessage || 'Google Flow tab was not detected in Chrome.',
        recommendation: 'Click "Open Google Flow" to open the official studio in a new tab, then return here.',
      };
    case 'LOGIN_REQUIRED':
      return {
        code,
        message: customMessage || 'Google Flow requires an active user login.',
        recommendation: 'Switch to the Google Flow tab, sign into your Google account, and click "Check Connection".',
      };
    case 'SELECTOR_MISMATCH':
      return {
        code,
        message: customMessage || 'Google Flow UI layout was updated by Google.',
        recommendation: 'CineForge AI has activated Manual Handoff Mode so you can paste the prompt directly without interruption.',
      };
    case 'CREDITS_EXHAUSTED':
      return {
        code,
        message: customMessage || 'Google Flow credits appear to be depleted.',
        recommendation: 'Verify your credits on Google Flow or switch to an alternate configured AI provider in AI Models.',
      };
    case 'MANUAL_HANDOFF_NEEDED':
      return {
        code,
        message: customMessage || 'This operation requires your direct interaction on Google Flow.',
        recommendation: 'Use the one-click Copy Prompt button, paste into Flow, and import your downloaded video.',
      };
    default:
      return {
        code: 'UNKNOWN',
        message: customMessage || 'An unexpected event occurred during Flow synchronization.',
        recommendation: 'Refresh your Google Flow tab and re-test connection.',
      };
  }
}
