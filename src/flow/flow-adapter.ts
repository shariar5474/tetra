// Google Flow Adapter - DOM Inspection & Capability Detection

export interface FlowCapabilities {
  supportsCharacterReference: boolean;
  supportsStartFrame: boolean;
  supportsEndFrame: boolean;
  maxDurationSeconds: number;
  availableAspectRatios: string[];
}

export class FlowAdapter {
  // Query element with fallback strategies (accessibility label, placeholder, tag, testid)
  static findPromptInput(doc: Document = document): HTMLElement | null {
    return (
      doc.querySelector('textarea[placeholder*="prompt" i]') ||
      doc.querySelector('textarea[aria-label*="prompt" i]') ||
      doc.querySelector('textarea') ||
      doc.querySelector('[contenteditable="true"]') ||
      doc.querySelector('input[placeholder*="describe" i]')
    );
  }

  static findGenerateButton(doc: Document = document): HTMLButtonElement | null {
    const buttons = Array.from(doc.querySelectorAll<HTMLButtonElement>('button'));
    return (
      buttons.find((b) => {
        const text = (b.textContent || '').trim().toLowerCase();
        const label = (b.getAttribute('aria-label') || '').toLowerCase();
        return (
          text === 'generate' ||
          text === 'create' ||
          text.includes('generate video') ||
          label.includes('generate')
        );
      }) || null
    );
  }

  static findProgressIndicator(doc: Document = document): HTMLElement | null {
    return (
      doc.querySelector('[role="progressbar"]') ||
      doc.querySelector('.progress-bar') ||
      doc.querySelector('.loading-spinner') ||
      doc.querySelector('svg.animate-spin')
    );
  }

  static findLatestVideoElement(doc: Document = document): HTMLVideoElement | null {
    const videos = Array.from(doc.querySelectorAll<HTMLVideoElement>('video'));
    return videos[videos.length - 1] || null;
  }

  static detectCapabilities(): FlowCapabilities {
    return {
      supportsCharacterReference: true,
      supportsStartFrame: true,
      supportsEndFrame: true,
      maxDurationSeconds: 10,
      availableAspectRatios: ['16:9', '9:16', '1:1'],
    };
  }
}
