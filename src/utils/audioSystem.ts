/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API procedural sound system for high-tech beeps, hums, and startup alerts.
class AudioSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private hasWelcomed: boolean = false;

  constructor() {
    // Read initial state from sessionStorage or start muted by default
    const savedMute = localStorage.getItem('audio_muted_v2');
    this.isMuted = savedMute !== 'false'; // true by default (muted-by-default)
    this.hasWelcomed = localStorage.getItem('welcomed_v2') === 'true';
  }

  public getMuteState(): boolean {
    return this.isMuted;
  }

  public setMuteState(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('audio_muted_v2', muted ? 'true' : 'false');
    
    // Play a verification chime when unmuting
    if (!muted) {
      this.initContext();
      this.playBeep(600, 0.08, 'sine');
      setTimeout(() => this.playBeep(900, 0.12, 'sine'), 80);
      
      // Trigger welcome if not yet played
      this.triggerWelcomeOnce();
    }
  }

  private initContext() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Synthesizes a high-tech sound effect
   * @param frequency Start frequency
   * @param duration Tone duration in seconds
   * @param type Oscillator type ('sine' | 'square' | 'triangle' | 'sawtooth')
   * @param endFrequency Optional sweep end frequency
   */
  public playBeep(frequency: number, duration: number, type: OscillatorType = 'sine', endFrequency?: number) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      
      if (endFrequency) {
        osc.frequency.exponentialRampToValueAtTime(endFrequency, this.ctx.currentTime + duration);
      }

      // Envelope: Instant attack, exponential decay
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play failure:', e);
    }
  }

  // Subtle hum/beep for navigation scroll transitions
  public playScrollTransition() {
    if (this.isMuted) return;
    // Play a warm, low double-beep
    this.playBeep(320, 0.1, 'triangle', 480);
  }

  // Tactical click beep for HUD controls
  public playClickBeep() {
    if (this.isMuted) return;
    this.playBeep(880, 0.06, 'sine', 1200);
  }

  // Welcome sequence (sound effect + speech synthesis)
  public triggerWelcomeOnce() {
    if (this.isMuted || this.hasWelcomed) return;
    this.hasWelcomed = true;
    localStorage.setItem('welcomed_v2', 'true');

    try {
      this.initContext();
      if (!this.ctx) return;

      // Immersive sci-fi boot sound
      const now = this.ctx.currentTime;
      const notes = [220, 330, 440, 660, 880];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          this.playBeep(freq, 0.3, 'sine', freq * 1.5);
        }, idx * 120);
      });

      // Speech Synthesis greeting
      if ('speechSynthesis' in window) {
        setTimeout(() => {
          const text = "Welcome to Anandhu Krishnan's technical operations center. Portals and telemetry streams are online.";
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 1.05;
          utterance.pitch = 0.95;
          utterance.volume = 0.8;
          
          // Select a professional sounding English voice if available
          const voices = window.speechSynthesis.getVoices();
          const preferredVoice = voices.find(v => 
            v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural'))
          );
          if (preferredVoice) {
            utterance.voice = preferredVoice;
          }
          
          window.speechSynthesis.speak(utterance);
        }, 800);
      }
    } catch (e) {
      console.warn('Welcome audio sequence failed:', e);
    }
  }
}

export const audioSystem = new AudioSystem();
