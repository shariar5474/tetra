// Google Flow Monitor - Watches active generation progress & error banners

export interface FlowProgressUpdate {
  isGenerating: boolean;
  progressPercent: number;
  statusText: string;
  errorMessage?: string;
}

export class FlowMonitor {
  private observer: MutationObserver | null = null;

  startObserving(
    targetNode: Node = document.body,
    onUpdate: (update: FlowProgressUpdate) => void
  ): void {
    this.stopObserving();

    this.observer = new MutationObserver(() => {
      const isGenerating = !!document.querySelector(
        '[role="progressbar"], .loading-spinner, [aria-busy="true"], svg.animate-spin'
      );

      // Check for error toast or banner
      const errorEl = document.querySelector('[role="alert"], .error-banner, .toast-error');
      const errorMessage = errorEl?.textContent?.trim();

      // Check for progress text e.g. "45%"
      const progressMatch = document.body.innerText.match(/(\d{1,3})%/);
      const progressPercent = progressMatch ? parseInt(progressMatch[1], 10) : isGenerating ? 50 : 100;

      onUpdate({
        isGenerating,
        progressPercent,
        statusText: isGenerating ? 'Flow rendering frames...' : 'Ready',
        errorMessage: errorMessage || undefined,
      });
    });

    this.observer.observe(targetNode, {
      childList: true,
      subtree: true,
      attributes: true,
    });
  }

  stopObserving(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
