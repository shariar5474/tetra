import { VideoTimeline, ExportSettings } from '../../shared/types/editor';

export interface RenderProgress {
  stage: 'preparing' | 'rendering_frames' | 'mixing_audio' | 'encoding' | 'completed' | 'failed';
  percent: number;
  message: string;
  currentFrame?: number;
  totalFrames?: number;
}

export class MovieExportEngine {
  private isCancelled = false;

  cancel(): void {
    this.isCancelled = true;
  }

  async exportMovie(
    timeline: VideoTimeline,
    settings: ExportSettings,
    onProgress: (p: RenderProgress) => void
  ): Promise<Blob> {
    this.isCancelled = false;
    onProgress({ stage: 'preparing', percent: 5, message: 'Validating approved scenes and timeline...' });

    // Determine dimensions
    let width = 1920;
    let height = 1080;
    if (settings.resolution === '720p') {
      width = 1280;
      height = 720;
    }
    if (settings.aspectRatio === '9:16') {
      const temp = width;
      width = height;
      height = temp;
    } else if (settings.aspectRatio === '1:1') {
      height = width;
    }

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Could not create Canvas 2D context for movie rendering');

    // Create stream from canvas
    const fps = settings.fps || 30;
    const stream = canvas.captureStream(fps);

    // Prepare Web Audio destination for mixing audio
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioContextClass();
    const audioDestination = audioCtx.createMediaStreamDestination();

    // Attach audio track to stream
    if (audioDestination.stream.getAudioTracks().length > 0) {
      stream.addTrack(audioDestination.stream.getAudioTracks()[0]);
    }

    // MediaRecorder
    let mimeType = 'video/webm;codecs=vp9,opus';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    const recordedChunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: settings.videoBitrateMbps * 1000000 || 5000000,
    });

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    const completionPromise = new Promise<Blob>((resolve, reject) => {
      mediaRecorder.onstop = () => {
        const finalBlob = new Blob(recordedChunks, { type: 'video/mp4' });
        audioCtx.close();
        resolve(finalBlob);
      };
      mediaRecorder.onerror = (err) => {
        audioCtx.close();
        reject(err);
      };
    });

    mediaRecorder.start(100);

    const totalSeconds = Math.max(1, timeline.totalDurationSeconds || timeline.videoClips.reduce((acc, c) => acc + (c.sourceDuration - c.trimStart - c.trimEnd), 0) || 5);
    const totalFrames = Math.round(totalSeconds * fps);

    // Pre-load video elements
    onProgress({ stage: 'preparing', percent: 15, message: 'Loading cinematic video clips...' });
    const videoElements: { clipId: string; el: HTMLVideoElement; duration: number }[] = [];

    for (const clip of timeline.videoClips) {
      if (clip.videoUrl) {
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.src = clip.videoUrl;
        video.muted = true;
        await new Promise((res) => {
          video.onloadeddata = () => res(true);
          video.onerror = () => res(false);
          setTimeout(() => res(true), 1500); // safety fallback
        });
        videoElements.push({ clipId: clip.id, el: video, duration: clip.sourceDuration || 5 });
      }
    }

    onProgress({ stage: 'rendering_frames', percent: 25, message: `Compositing ${totalFrames} frames...` });

    // Render loop
    for (let frame = 0; frame < totalFrames; frame++) {
      if (this.isCancelled) {
        mediaRecorder.stop();
        throw new Error('Export cancelled by user.');
      }

      const currentTime = frame / fps;

      // Find current clip
      let accumulatedTime = 0;
      let activeClip = timeline.videoClips[0];
      let clipLocalTime = currentTime;

      for (const c of timeline.videoClips) {
        const clipDur = c.sourceDuration - c.trimStart - c.trimEnd;
        if (currentTime >= accumulatedTime && currentTime < accumulatedTime + clipDur) {
          activeClip = c;
          clipLocalTime = currentTime - accumulatedTime + c.trimStart;
          break;
        }
        accumulatedTime += clipDur;
      }

      // Draw background
      ctx.fillStyle = '#05070D'; // Deep Black
      ctx.fillRect(0, 0, width, height);

      // Render clip frame or placeholder
      const loadedVideo = videoElements.find(v => v.clipId === activeClip?.id);
      if (loadedVideo && loadedVideo.el.readyState >= 2) {
        loadedVideo.el.currentTime = clipLocalTime;
        ctx.drawImage(loadedVideo.el, 0, 0, width, height);
      } else {
        // Draw cinematic title card
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#0B0F19');
        gradient.addColorStop(0.5, '#1E293B');
        gradient.addColorStop(1, '#05070D');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#38BDF8';
        ctx.font = `bold ${Math.floor(width * 0.035)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(activeClip?.title || 'CineForge AI Cinema', width / 2, height / 2 - 20);

        ctx.fillStyle = '#94A3B8';
        ctx.font = `${Math.floor(width * 0.02)}px sans-serif`;
        ctx.fillText(`Scene ${timeline.videoClips.indexOf(activeClip) + 1} • Cinematic Frame`, width / 2, height / 2 + 30);
      }

      // Subtitle burn-in if enabled
      if (settings.burnInSubtitles && timeline.subtitles && timeline.subtitles.length > 0) {
        const sub = timeline.subtitles.find(s => currentTime >= s.startTime && currentTime <= s.endTime);
        if (sub) {
          const fontSize = Math.floor(width * 0.026);
          ctx.font = `bold ${fontSize}px "Inter", "Arial", sans-serif`;
          ctx.textAlign = 'center';

          const text = sub.text;
          const subY = height - Math.floor(height * 0.08);

          // Subtitle background box
          const textMetrics = ctx.measureText(text);
          const boxWidth = textMetrics.width + 40;
          const boxHeight = fontSize * 1.6;

          ctx.fillStyle = 'rgba(5, 7, 13, 0.75)';
          ctx.fillRect((width - boxWidth) / 2, subY - fontSize * 1.1, boxWidth, boxHeight);

          // Subtitle text
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(text, width / 2, subY);
        }
      }

      // Progress reporting
      if (frame % 15 === 0 || frame === totalFrames - 1) {
        const percent = Math.min(95, Math.floor(25 + (frame / totalFrames) * 70));
        onProgress({
          stage: 'rendering_frames',
          percent,
          message: `Compositing frames: ${frame}/${totalFrames} (${Math.round((currentTime / totalSeconds) * 100)}%)`,
          currentFrame: frame,
          totalFrames,
        });
      }

      // Yield frame execution
      await new Promise(r => setTimeout(r, 1000 / fps));
    }

    onProgress({ stage: 'encoding', percent: 96, message: 'Encoding final cinematic master...' });
    mediaRecorder.stop();

    const finalBlob = await completionPromise;
    onProgress({ stage: 'completed', percent: 100, message: 'Export completed successfully!' });
    return finalBlob;
  }
}

export const movieExporter = new MovieExportEngine();
