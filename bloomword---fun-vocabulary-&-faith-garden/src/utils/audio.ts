// Audio synthesizer using Web Audio API and speech synthesis

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private speechSpeed: number = 0.85;

  constructor() {
    // Lazy init
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public setSpeechSpeed(speed: number) {
    this.speechSpeed = speed;
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public playSuccessChime() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch {
      // Audio fallback
    }
  }

  public playEncourageSound() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [440, 493.88]; // A4, B4 warm gentle upward step
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.4);
      });
    } catch {
      // Audio fallback
    }
  }

  public playBloomSparkle() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [659.25, 830.61, 987.77, 1318.51, 1661.22];
      freqs.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);

        gain.gain.setValueAtTime(0, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.14, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.4);
      });
    } catch {
      // Audio fallback
    }
  }

  public playLevelUpFanfare() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const chords = [
        { freqs: [523.25, 659.25], time: 0 },
        { freqs: [587.33, 739.99], time: 0.12 },
        { freqs: [659.25, 830.61], time: 0.24 },
        { freqs: [783.99, 987.77, 1318.51], time: 0.38, dur: 0.7 }
      ];

      chords.forEach((chord) => {
        chord.freqs.forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + chord.time);

          const dur = chord.dur || 0.25;
          gain.gain.setValueAtTime(0, now + chord.time);
          gain.gain.linearRampToValueAtTime(0.12, now + chord.time + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + chord.time + dur);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(now + chord.time);
          osc.stop(now + chord.time + dur + 0.05);
        });
      });
    } catch {
      // Audio fallback
    }
  }

  public playPop() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // fallback
    }
  }

  public playWrongAnswer() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.2);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // fallback
    }
  }

  public speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.speechSpeed;
      utterance.pitch = 1.15; // friendly, warm child-friendly tone
      
      // Look for a pleasant English voice
      const voices = window.speechSynthesis.getVoices();
      const femaleOrWarmVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Samantha') ||
            v.name.includes('Victoria') ||
            v.name.includes('Karen') ||
            v.name.includes('Zira') ||
            v.name.includes('Google US English') ||
            v.name.includes('Natural'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (femaleOrWarmVoice) {
        utterance.voice = femaleOrWarmVoice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      if (onEnd) onEnd();
    }
  }

  // Soft boing for mini-challenge feedback
  public playSoftBoing() {
    if (!this.soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch {
      // ignore
    }
  }

  // Focus Ambient Sound generator for Reading Adventure
  private ambientGain: GainNode | null = null;
  private ambientSources: AudioScheduledSourceNode[] = [];
  private currentAmbientType: string | null = null;

  public startAmbient(type: 'rain' | 'forest' | 'waves' | 'space' | 'chimes') {
    if (!this.soundEnabled) return;
    this.stopAmbient();
    try {
      this.initCtx();
      if (!this.ctx) return;

      this.currentAmbientType = type;
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 1.5);
      this.ambientGain.connect(this.ctx.destination);

      if (type === 'space') {
        // Deep warm cosmic drone
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(110, this.ctx.currentTime); // A2
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(164.81, this.ctx.currentTime); // E3
        osc1.connect(this.ambientGain);
        osc2.connect(this.ambientGain);
        osc1.start();
        osc2.start();
        this.ambientSources.push(osc1, osc2);
      } else if (type === 'rain' || type === 'waves') {
        // Noise buffer for gentle rain/water
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + 0.02 * white) / 1.02; // Pink-ish noise
          lastOut = output[i];
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = type === 'waves' ? 'lowpass' : 'bandpass';
        filter.frequency.setValueAtTime(type === 'waves' ? 400 : 800, this.ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(this.ambientGain);
        whiteNoise.start();
        this.ambientSources.push(whiteNoise);
      } else {
        // Peaceful Chimes / Forest Breeze
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, this.ctx.currentTime); // 432Hz calming tuning
        osc.connect(this.ambientGain);
        osc.start();
        this.ambientSources.push(osc);
      }
    } catch {
      // ignore
    }
  }

  public stopAmbient() {
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      }
      this.ambientSources.forEach((src) => {
        try {
          src.stop();
          src.disconnect();
        } catch {}
      });
      this.ambientSources = [];
      this.ambientGain = null;
      this.currentAmbientType = null;
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundEngine();
