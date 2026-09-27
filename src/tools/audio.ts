export class AudioEngine {
  private synth: SpeechSynthesis;
  private hasInitialized: boolean = false;

  constructor() {
    this.synth = window.speechSynthesis;
  }

  public init() {
    if (this.hasInitialized) return;
    // Warm up speech synthesis with a silent utterance on the user gesture
    if (this.synth) {
      const utterance = new SpeechSynthesisUtterance(' ');
      utterance.volume = 0;
      this.synth.speak(utterance);
    }
    this.hasInitialized = true;
  }

  public playSpeech(text: string, tempo: number = 1.0) {
    if (!this.synth) return;
    if (this.synth.speaking) this.synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    // Adjust speech rate based on tempo - faster tempo = faster speech
    utterance.rate = 1.1 * tempo;
    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e.error);
    };
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) this.synth.cancel();
  }
}

export const audioEngine = new AudioEngine();
