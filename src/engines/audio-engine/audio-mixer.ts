import { AudioClip } from '../../shared/types/editor';

export interface SoundEffectPreset {
  id: string;
  name: string;
  category: 'footsteps' | 'ambient' | 'nature' | 'traffic' | 'crowd' | 'comedy' | 'cinematic';
  duration: number;
  synthesizeSample: (audioCtx: AudioContext) => AudioBuffer;
}

export class AudioMixerEngine {
  private audioCtx: AudioContext | null = null;
  private activeNodes: Map<string, { source: AudioBufferSourceNode; gainNode: GainNode }> = new Map();

  constructor() {
    // Lazy AudioContext initialization
  }

  private getContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Generate synthetic cinematic SFX using Web Audio oscillator/noise buffers for immediate zero-download sound
  createCinematicRiserBuffer(): AudioBuffer {
    const ctx = this.getContext();
    const duration = 3.0;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const progress = t / duration;
      const freq = 60 + Math.pow(progress, 3) * 600;
      const noise = (Math.random() * 2 - 1) * 0.15;
      const wave = Math.sin(2 * Math.PI * freq * t) * (1 - Math.cos(progress * Math.PI / 2));
      const val = (wave + noise) * progress * 0.5;
      left[i] = val;
      right[i] = val * 0.95;
    }
    return buffer;
  }

  createFootstepsBuffer(): AudioBuffer {
    const ctx = this.getContext();
    const duration = 2.0;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const stepIdx = Math.floor(t * 2); // 2 steps per second
      const stepTime = t % 0.5;
      if (stepTime < 0.08) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-stepTime * 50) * 0.6;
      } else {
        data[i] = 0;
      }
    }
    return buffer;
  }

  createVillageAmbienceBuffer(): AudioBuffer {
    const ctx = this.getContext();
    const duration = 4.0;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(2, sampleRate * duration, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      // Gentle wind and distant cricket chirps
      const wind = (Math.random() * 2 - 1) * 0.05 * (0.8 + 0.2 * Math.sin(t * 0.5));
      const cricket = Math.sin(2 * Math.PI * 4500 * t) * (Math.sin(2 * Math.PI * 15 * t) > 0.8 ? 0.03 : 0);
      left[i] = wind + cricket;
      right[i] = wind + cricket * 0.9;
    }
    return buffer;
  }

  playBuffer(buffer: AudioBuffer, volume = 1.0, id = 'preview'): void {
    const ctx = this.getContext();
    this.stopClip(id);

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);

    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.start(0);
    this.activeNodes.set(id, { source, gainNode });

    source.onended = () => {
      this.activeNodes.delete(id);
    };
  }

  stopClip(id: string): void {
    const active = this.activeNodes.get(id);
    if (active) {
      try {
        active.source.stop();
      } catch (_) {}
      this.activeNodes.delete(id);
    }
  }

  stopAll(): void {
    this.activeNodes.forEach(({ source }) => {
      try {
        source.stop();
      } catch (_) {}
    });
    this.activeNodes.clear();
  }
}

export const audioMixer = new AudioMixerEngine();
