import { ExtensionMessage, ExtensionResponse } from '../shared/types/messages';
import { generateId } from '../shared/utils/helpers';

export function sendRuntimeMessage<T = any, R = any>(type: ExtensionMessage['type'], payload?: T): Promise<ExtensionResponse<R>> {
  return new Promise((resolve) => {
    if (typeof chrome === 'undefined' || !chrome.runtime?.sendMessage) {
      resolve({
        success: false,
        error: { code: 'EXTENSION_NOT_AVAILABLE', message: 'Chrome extension runtime not found' },
      });
      return;
    }

    const message: ExtensionMessage<T> = {
      type,
      requestId: generateId('req'),
      sender: 'dashboard',
      payload,
      timestamp: Date.now(),
    };

    chrome.runtime.sendMessage(message, (response: ExtensionResponse<R>) => {
      if (chrome.runtime.lastError) {
        resolve({
          success: false,
          error: { code: 'RUNTIME_ERROR', message: chrome.runtime.lastError.message || 'Message dispatch failed' },
        });
      } else {
        resolve(response || { success: true });
      }
    });
  });
}
