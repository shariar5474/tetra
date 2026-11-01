// Google Flow Importer - Extracts video blob or download stream

export class FlowImporter {
  static async extractVideoBlobFromUrl(videoUrl: string): Promise<Blob> {
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch video stream: ${response.statusText}`);
    }
    return response.blob();
  }

  static findDownloadLink(doc: Document = document): string | null {
    const downloadBtn = Array.from(doc.querySelectorAll<HTMLAnchorElement>('a[download], a[href*="blob:"], a[href*=".mp4"]'));
    if (downloadBtn.length > 0 && downloadBtn[0].href) {
      return downloadBtn[0].href;
    }
    const video = doc.querySelector<HTMLVideoElement>('video');
    return video?.src || null;
  }
}
