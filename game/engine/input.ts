/**
 * Input management system for keyboard and touch controls
 */

import type { InputState } from './types';

export class InputManager {
  private keys: Set<string> = new Set();
  private inputState: InputState = {
    left: false,
    right: false,
    shoot: false,
    pause: false,
    mute: false,
  };

  // Track if keys were just pressed (for single-press actions)
  private justPressed: Set<string> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupKeyboardListeners();
    }
  }

  private setupKeyboardListeners(): void {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    
    // Prevent default for game keys
    if (['arrowleft', 'arrowright', 'arrowup', 'arrowdown', ' '].includes(key)) {
      event.preventDefault();
    }

    // Track just pressed
    if (!this.keys.has(key)) {
      this.justPressed.add(key);
    }

    this.keys.add(key);
    this.updateInputState();
  }

  private handleKeyUp(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();
    this.keys.delete(key);
    this.justPressed.delete(key);
    this.updateInputState();
  }

  private updateInputState(): void {
    // Movement (continuous)
    this.inputState.left =
      this.keys.has('arrowleft') || this.keys.has('a');
    this.inputState.right =
      this.keys.has('arrowright') || this.keys.has('d');

    // Shoot (can be continuous or single press depending on game logic)
    this.inputState.shoot =
      this.keys.has(' ') || this.keys.has('j');

    // Pause (single press)
    this.inputState.pause = this.justPressed.has('p');

    // Mute (single press)
    this.inputState.mute = this.justPressed.has('m');
  }

  /**
   * Get the current input state
   */
  public getInputState(): InputState {
    return { ...this.inputState };
  }

  /**
   * Check if a key was just pressed this frame
   */
  public wasJustPressed(key: string): boolean {
    return this.justPressed.has(key.toLowerCase());
  }

  /**
   * Check if a key is currently pressed
   */
  public isPressed(key: string): boolean {
    return this.keys.has(key.toLowerCase());
  }

  /**
   * Clear just pressed keys (call after processing input)
   */
  public clearJustPressed(): void {
    this.justPressed.clear();
    this.inputState.pause = false;
    this.inputState.mute = false;
  }

  /**
   * Set input state programmatically (for touch controls)
   */
  public setInput(input: Partial<InputState>): void {
    this.inputState = { ...this.inputState, ...input };
  }

  /**
   * Clear all input
   */
  public clear(): void {
    this.keys.clear();
    this.justPressed.clear();
    this.inputState = {
      left: false,
      right: false,
      shoot: false,
      pause: false,
      mute: false,
    };
  }

  /**
   * Cleanup listeners
   */
  public destroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown.bind(this));
      window.removeEventListener('keyup', this.handleKeyUp.bind(this));
    }
  }
}

// Singleton instance
let inputManagerInstance: InputManager | null = null;

export function getInputManager(): InputManager {
  if (!inputManagerInstance) {
    inputManagerInstance = new InputManager();
  }
  return inputManagerInstance;
}


