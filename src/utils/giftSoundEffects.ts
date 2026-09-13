/**
 * Web Audio API Sound Synthesizer for Maison Entrelaço
 * Generates crystal-clear luxury sounds: gentle slide notes, realistic scissor snip,
 * golden harp arpeggios, and celebratory chime chords without external mp3 dependencies.
 */

class LuxurySoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Gentle slide transition chime (celestial bell)
   */
  public playSlideChime(stepIndex: number = 0) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      const freq = notes[stepIndex % notes.length];
      const now = ctx.currentTime;

      // Primary chime (sine + subtle harmonics)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.01, now + 0.4);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);

      // Sparkle overtone
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now + 0.05);

      gain2.gain.setValueAtTime(0, now + 0.05);
      gain2.gain.linearRampToValueAtTime(0.04, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.05);
      osc2.stop(now + 0.6);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Scissor snip sound effect (crisp blade friction + metallic click)
   */
  public playScissorSnip() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      // White noise burst for blade friction
      const bufferSize = ctx.sampleRate * 0.08; // 80ms
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      // Bandpass filter for metallic snip texture
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.Q.setValueAtTime(3, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      whiteNoise.start(now);

      // Metallic high ping
      const metalOsc = ctx.createOscillator();
      const metalGain = ctx.createGain();
      metalOsc.type = 'triangle';
      metalOsc.frequency.setValueAtTime(4200, now);
      metalOsc.frequency.exponentialRampToValueAtTime(1800, now + 0.06);

      metalGain.gain.setValueAtTime(0.18, now);
      metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      metalOsc.connect(metalGain);
      metalGain.connect(ctx.destination);

      metalOsc.start(now);
      metalOsc.stop(now + 0.08);
    } catch (e) {
      console.warn('Scissor snip error:', e);
    }
  }

  /**
   * Grand Celebration Fanfare & Harp Cascades (Beautiful Luxury Golden Melody)
   * Plays after cutting the ribbon
   */
  public playGrandOpeningFanfare() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      // 1. Scissor snip first
      this.playScissorSnip();

      const now = ctx.currentTime + 0.05;

      // 2. Warm Bass Anchor (Rich foundation)
      const bassOsc = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(130.81, now); // C3
      bassGain.gain.setValueAtTime(0, now);
      bassGain.gain.linearRampToValueAtTime(0.2, now + 0.1);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
      bassOsc.connect(bassGain);
      bassGain.connect(ctx.destination);
      bassOsc.start(now);
      bassOsc.stop(now + 2.8);

      // 3. Golden Harp Arpeggio: C4, E4, G4, B4, C5, E5, G5, B5, C6, E6
      const harpNotes = [
        261.63, // C4
        329.63, // E4
        392.00, // G4
        493.88, // B4
        523.25, // C5
        659.25, // E5
        783.99, // G5
        987.77, // B5
        1046.50, // C6
        1318.51  // E6
      ];

      harpNotes.forEach((freq, idx) => {
        const noteTime = now + (idx * 0.065); // Rapid shimmering cascade
        
        // Main harp string
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0, noteTime);
        gain.gain.linearRampToValueAtTime(0.14, noteTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0005, noteTime + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 1.2);

        // Warm harmonic shimmer
        const oscHarm = ctx.createOscillator();
        const gainHarm = ctx.createGain();
        oscHarm.type = 'triangle';
        oscHarm.frequency.setValueAtTime(freq * 1.5, noteTime);

        gainHarm.gain.setValueAtTime(0, noteTime);
        gainHarm.gain.linearRampToValueAtTime(0.05, noteTime + 0.03);
        gainHarm.gain.exponentialRampToValueAtTime(0.0005, noteTime + 0.8);

        oscHarm.connect(gainHarm);
        gainHarm.connect(ctx.destination);
        oscHarm.start(noteTime);
        oscHarm.stop(noteTime + 0.8);
      });

      // 4. Celebratory Chord sustained on top (C6 major chord with glockenspiel sparkle)
      const chordTime = now + 0.7;
      const topChordNotes = [1046.50, 1318.51, 1567.98, 2093.00]; // C6, E6, G6, C7

      topChordNotes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chordTime);

        gain.gain.setValueAtTime(0, chordTime);
        gain.gain.linearRampToValueAtTime(0.12, chordTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, chordTime + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(chordTime);
        osc.stop(chordTime + 2.5);
      });

    } catch (e) {
      console.warn('Grand opening sound error:', e);
    }
  }
}

export const luxuryAudio = new LuxurySoundSynthesizer();
