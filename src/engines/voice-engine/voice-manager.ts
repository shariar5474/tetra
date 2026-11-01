import { CharacterVoiceProfile } from '../../shared/types/character';

export interface VoiceOption {
  id: string;
  name: string;
  lang: string;
  gender: string;
  isNative: boolean;
}

export function getAvailableBrowserVoices(): Promise<VoiceOption[]> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    let voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(
        voices.map((v) => ({
          id: v.voiceURI,
          name: `${v.name} (${v.lang})`,
          lang: v.lang,
          gender: v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') ? 'female' : 'male',
          isNative: v.localService,
        }))
      );
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(
        voices.map((v) => ({
          id: v.voiceURI,
          name: `${v.name} (${v.lang})`,
          lang: v.lang,
          gender: v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') ? 'female' : 'male',
          isNative: v.localService,
        }))
      );
    };

    setTimeout(() => {
      resolve([]);
    }, 1000);
  });
}

export function speakPreview(text: string, profile: CharacterVoiceProfile): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      reject(new Error('Speech Synthesis not supported in this browser.'));
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending utterances
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = profile.rate || 1.0;
    utterance.pitch = profile.pitch || 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (profile.voiceId) {
      const matched = voices.find((v) => v.voiceURI === profile.voiceId);
      if (matched) utterance.voice = matched;
    } else if (profile.language) {
      const matched = voices.find((v) => v.lang.startsWith(profile.language));
      if (matched) utterance.voice = matched;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export class VoiceRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  async startRecording(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    };

    this.mediaRecorder.start();
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Recorder not initialized'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        // Stop all audio tracks
        this.mediaRecorder?.stream.getTracks().forEach((track) => track.stop());
        this.mediaRecorder = null;
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }
}
