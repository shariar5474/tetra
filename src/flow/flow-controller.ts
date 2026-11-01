import { inspectFlowSession, openOfficialFlowTab } from './flow-detector';
import { FlowSessionState, FlowGenerationPayload, ManualHandoffData } from '../shared/types/flow';
import { createFlowError } from './flow-errors';

export class FlowController {
  private currentSession: FlowSessionState = {
    status: 'disconnected',
    isLoggedIn: false,
    lastChecked: 0,
  };

  async checkStatus(): Promise<FlowSessionState> {
    this.currentSession = await inspectFlowSession();
    return this.currentSession;
  }

  async connect(): Promise<FlowSessionState> {
    await openOfficialFlowTab();
    // Wait briefly for tab to load
    await new Promise((r) => setTimeout(r, 1200));
    return this.checkStatus();
  }

  async triggerGeneration(
    payload: FlowGenerationPayload,
    onManualHandoffRequired: (handoff: ManualHandoffData) => void
  ): Promise<{ success: boolean; manualHandoff?: boolean; error?: any }> {
    const session = await this.checkStatus();

    if (session.status === 'tab_not_found') {
      const err = createFlowError('TAB_NOT_FOUND');
      return { success: false, error: err };
    }

    if (!session.tabId) {
      const err = createFlowError('TAB_NOT_FOUND');
      return { success: false, error: err };
    }

    // Attempt autofill via content script
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(
        session.tabId!,
        {
          type: 'FLOW_AUTOFILL_PROMPT',
          payload: { prompt: payload.prompt },
        },
        (response) => {
          if (chrome.runtime.lastError || !response?.success) {
            // Activate Manual Handoff Fallback
            const handoffData: ManualHandoffData = {
              sceneId: payload.sceneId,
              sceneTitle: `Scene ${payload.sceneId}`,
              prompt: payload.prompt,
              referenceImages: (payload.characterImageUrls || []).map((url, i) => ({
                name: `Character Anchor ${i + 1}`,
                url,
                type: 'character',
              })),
              instructions: [
                '1. Click "Copy Prompt" below.',
                '2. Switch to your Google Flow tab.',
                '3. Paste prompt into the prompt field and click Generate.',
                '4. When video is complete, click "Import Generated Video" below to link it to this scene.',
              ],
            };

            onManualHandoffRequired(handoffData);
            resolve({ success: true, manualHandoff: true });
          } else {
            resolve({ success: true, manualHandoff: false });
          }
        }
      );
    });
  }
}

export const flowController = new FlowController();
