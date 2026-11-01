// CineForge AI - Spoken Dialogue Synthesis (TTS Service)
// Speaks character dialogues dynamically when videos play in preview or timeline

export function speakDialogue(text?: string): void {
  if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
  try {
    window.speechSynthesis.cancel();
    const clean = text
      .replace(/^[A-Za-z\u0980-\u09FF\s]+:\s*/, '')
      .replace(/^[#*_~"'\s]+|[#*_~"'\s]+$/g, '')
      .trim();
    if (!clean || clean.length < 2) return;

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    const isBengali = /[\u0980-\u09FF]/.test(clean);
    const voices = window.speechSynthesis.getVoices();
    if (isBengali) {
      const bnVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('bn') ||
          v.name.toLowerCase().includes('bangla') ||
          v.name.toLowerCase().includes('bengali')
      );
      if (bnVoice) utterance.voice = bnVoice;
    }
    window.speechSynthesis.speak(utterance);
  } catch (_) {}
}

export function stopDialogueSpeech(): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }
}
