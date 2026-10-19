// Ambient gentle chime synthesized via browser Web Audio API
// High-grade acoustic marimba / singing bowl harmonics designed for elderly care (calming, non-startling)

class AmbientAudioEngine {
  private audioCtx: AudioContext | null = null;

  private init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play gentle, two-tone calming chime (F4 -> C5 harmonious resonance)
  playGentleCheckinChime(): Promise<void> {
    return new Promise((resolve) => {
      try {
        this.init();
        if (!this.audioCtx) {
          resolve();
          return;
        }

        const now = this.audioCtx.currentTime;
        const notes = [
          { freq: 349.23, start: 0.0, dur: 1.4, gain: 0.18 }, // F4
          { freq: 440.00, start: 0.22, dur: 1.6, gain: 0.16 }, // A4
          { freq: 523.25, start: 0.44, dur: 2.2, gain: 0.20 }, // C5
          { freq: 659.25, start: 0.70, dur: 2.8, gain: 0.14 }, // E5
        ];

        notes.forEach((note) => {
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.freq, now + note.start);

          // Soft bell attack and slow decay
          gain.gain.setValueAtTime(0.0001, now + note.start);
          gain.gain.exponentialRampToValueAtTime(note.gain, now + note.start + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.dur);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now + note.start);
          osc.stop(now + note.start + note.dur);
        });

        setTimeout(resolve, 3200);
      } catch (err) {
        console.warn('Audio playback note:', err);
        resolve();
      }
    });
  }

  // Play urgent emergency alert tone (pulsed chime)
  playEmergencyTone(): Promise<void> {
    return new Promise((resolve) => {
      try {
        this.init();
        if (!this.audioCtx) {
          resolve();
          return;
        }

        const now = this.audioCtx.currentTime;
        const bursts = [0, 0.35, 0.7];

        bursts.forEach((offset) => {
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(587.33, now + offset); // D5
          osc.frequency.exponentialRampToValueAtTime(440.00, now + offset + 0.25); // A4

          gain.gain.setValueAtTime(0.001, now + offset);
          gain.gain.linearRampToValueAtTime(0.18, now + offset + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.28);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now + offset);
          osc.stop(now + offset + 0.3);
        });

        setTimeout(resolve, 1200);
      } catch (err) {
        console.warn('Audio alert note:', err);
        resolve();
      }
    });
  }

  // Play soft resonant chime of opening door (Contact Sensor)
  playDoorOpenChime(): Promise<void> {
    return new Promise((resolve) => {
      try {
        this.init();
        if (!this.audioCtx) {
          resolve();
          return;
        }

        const now = this.audioCtx.currentTime;
        const notes = [
          { freq: 523.25, start: 0.0, dur: 0.6, gain: 0.12 },
          { freq: 783.99, start: 0.12, dur: 0.9, gain: 0.14 },
        ];

        notes.forEach((note) => {
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(note.freq, now + note.start);

          gain.gain.setValueAtTime(0.0001, now + note.start);
          gain.gain.exponentialRampToValueAtTime(note.gain, now + note.start + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.dur);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now + note.start);
          osc.stop(now + note.start + note.dur);
        });

        setTimeout(resolve, 1100);
      } catch (err) {
        console.warn('Door audio error:', err);
        resolve();
      }
    });
  }

  // Play delicate non-intrusive radar ping of motion on the porch (Motion Sensor)
  playMotionPing(): Promise<void> {
    return new Promise((resolve) => {
      try {
        this.init();
        if (!this.audioCtx) {
          resolve();
          return;
        }

        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880.00, now);
        osc.frequency.exponentialRampToValueAtTime(1046.50, now + 0.15);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.09, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + 0.45);

        setTimeout(resolve, 550);
      } catch (err) {
        console.warn('Motion audio error:', err);
        resolve();
      }
    });
  }

  // Play telephone ring tone
  playPhoneRingTone(): Promise<void> {
    return new Promise((resolve) => {
      try {
        this.init();
        if (!this.audioCtx) {
          resolve();
          return;
        }

        const now = this.audioCtx.currentTime;
        const cycles = [0, 0.85];

        cycles.forEach((cycleOffset) => {
          if (!this.audioCtx) return;
          const notes = [
            { freq: 440.00, start: 0.00, dur: 0.16, gain: 0.14 }, // A4
            { freq: 554.37, start: 0.14, dur: 0.18, gain: 0.15 }, // C#5
            { freq: 659.25, start: 0.30, dur: 0.38, gain: 0.17 }, // E5
          ];

          notes.forEach((note) => {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(note.freq, now + cycleOffset + note.start);

            gain.gain.setValueAtTime(0.0001, now + cycleOffset + note.start);
            gain.gain.exponentialRampToValueAtTime(note.gain, now + cycleOffset + note.start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + cycleOffset + note.start + note.dur);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now + cycleOffset + note.start);
            osc.stop(now + cycleOffset + note.start + note.dur);
          });
        });

        setTimeout(resolve, 2000);
      } catch (err) {
        console.warn('Phone audio error:', err);
        resolve();
      }
    });
  }
}

export const ambientAudio = new AmbientAudioEngine();
