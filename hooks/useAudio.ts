/**
 * Hook for game audio using Web Audio API
 */

import { useEffect, useRef, useCallback } from 'react';
import type { SoundEffect } from '../game/engine/types';

/**
 * Generate audio buffers for sound effects using Web Audio API
 */
class AudioManager {
  private context: AudioContext | null = null;
  private initialized: boolean = false;
  private muted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Lazy initialization
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  /**
   * Initialize audio context (must be called after user interaction)
   */
  public async initialize(): Promise<void> {
    if (this.initialized || !this.context) return;

    if (this.context.state === 'suspended') {
      await this.context.resume();
    }

    this.initialized = true;
  }

  /**
   * Play shoot sound
   */
  private playShoot(): void {
    if (!this.context || this.muted) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.frequency.setValueAtTime(400, this.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      200,
      this.context.currentTime + 0.1
    );

    gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.context.currentTime + 0.1
    );

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + 0.1);
  }

  /**
   * Play explosion sound
   */
  private playExplosion(): void {
    if (!this.context || this.muted) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, this.context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      50,
      this.context.currentTime + 0.3
    );

    gainNode.gain.setValueAtTime(0.4, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.context.currentTime + 0.3
    );

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + 0.3);
  }

  /**
   * Play level up sound
   */
  private playLevelUp(): void {
    if (!this.context || this.muted) return;

    const notes = [262, 330, 392, 523]; // C, E, G, C (one octave higher)
    const noteDuration = 0.15;

    notes.forEach((freq, index) => {
      const oscillator = this.context!.createOscillator();
      const gainNode = this.context!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.context!.destination);

      oscillator.frequency.setValueAtTime(freq, this.context!.currentTime);
      oscillator.type = 'square';

      const startTime = this.context!.currentTime + index * noteDuration;
      gainNode.gain.setValueAtTime(0.2, startTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        startTime + noteDuration
      );

      oscillator.start(startTime);
      oscillator.stop(startTime + noteDuration);
    });
  }

  /**
   * Play game over sound
   */
  private playGameOver(): void {
    if (!this.context || this.muted) return;

    const notes = [392, 349, 330, 294, 262]; // Descending scale
    const noteDuration = 0.25;

    notes.forEach((freq, index) => {
      const oscillator = this.context!.createOscillator();
      const gainNode = this.context!.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.context!.destination);

      oscillator.frequency.setValueAtTime(freq, this.context!.currentTime);
      oscillator.type = 'sine';

      const startTime = this.context!.currentTime + index * noteDuration;
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        startTime + noteDuration
      );

      oscillator.start(startTime);
      oscillator.stop(startTime + noteDuration);
    });
  }

  /**
   * Play hit sound
   */
  private playHit(): void {
    if (!this.context || this.muted) return;

    const oscillator = this.context.createOscillator();
    const gainNode = this.context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.context.destination);

    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(150, this.context.currentTime);

    gainNode.gain.setValueAtTime(0.3, this.context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.context.currentTime + 0.1
    );

    oscillator.start(this.context.currentTime);
    oscillator.stop(this.context.currentTime + 0.1);
  }

  /**
   * Play a sound effect
   */
  public playSound(effect: SoundEffect): void {
    if (!this.initialized) {
      this.initialize().catch(console.error);
      return;
    }

    switch (effect) {
      case 'shoot':
        this.playShoot();
        break;
      case 'explosion':
        this.playExplosion();
        break;
      case 'levelUp':
        this.playLevelUp();
        break;
      case 'gameOver':
        this.playGameOver();
        break;
      case 'hit':
        this.playHit();
        break;
    }
  }

  /**
   * Set mute state
   */
  public setMuted(muted: boolean): void {
    this.muted = muted;
  }

  /**
   * Get mute state
   */
  public isMuted(): boolean {
    return this.muted;
  }
}

// Singleton instance
let audioManagerInstance: AudioManager | null = null;

function getAudioManager(): AudioManager {
  if (!audioManagerInstance && typeof window !== 'undefined') {
    audioManagerInstance = new AudioManager();
  }
  return audioManagerInstance!;
}

/**
 * Hook for audio playback
 */
export function useAudio(muted: boolean = false) {
  const audioManagerRef = useRef<AudioManager | null>(null);

  useEffect(() => {
    audioManagerRef.current = getAudioManager();

    // Initialize on first user interaction
    const initAudio = () => {
      audioManagerRef.current?.initialize();
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };

    document.addEventListener('click', initAudio);
    document.addEventListener('keydown', initAudio);
    document.addEventListener('touchstart', initAudio);

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
  }, []);

  useEffect(() => {
    audioManagerRef.current?.setMuted(muted);
  }, [muted]);

  const playSound = useCallback((effect: SoundEffect) => {
    audioManagerRef.current?.playSound(effect);
  }, []);

  return { playSound };
}


