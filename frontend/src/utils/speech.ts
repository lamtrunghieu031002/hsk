/**
 * High-performance Mandarin Chinese Speech Synthesizer
 * Uses native Web Speech API with automatic Chinese voice detection
 */
class SpeechService {
  private chineseVoice: SpeechSynthesisVoice | null = null;
  private initialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      window.speechSynthesis.onvoiceschanged = () => this.initVoices();
    }
  }

  private initVoices() {
    const voices = window.speechSynthesis.getVoices();
    // Prioritize high-quality Chinese voices (zh-CN, zh-TW, Mandarin)
    this.chineseVoice =
      voices.find(v => v.lang === 'zh-CN') ||
      voices.find(v => v.lang.startsWith('zh')) ||
      null;
    this.initialized = true;
  }

  public speak(text: string, rate: number = 0.85) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop current speech immediately

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = rate; // 0.85 standard clear learning speed
    utterance.pitch = 1.0;

    if (this.chineseVoice) {
      utterance.voice = this.chineseVoice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

export const speech = new SpeechService();
