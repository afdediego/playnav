/**
 * Hook for input management
 */

import { useEffect, useRef, useCallback } from 'react';
import { InputManager } from '../game/engine/input';
import type { InputState } from '../game/engine/types';

/**
 * Hook for input management
 */
export function useInput() {
  const inputManagerRef = useRef<InputManager | null>(null);

  useEffect(() => {
    inputManagerRef.current = new InputManager();

    return () => {
      inputManagerRef.current?.destroy();
    };
  }, []);

  const getInputState = useCallback((): InputState => {
    return (
      inputManagerRef.current?.getInputState() || {
        left: false,
        right: false,
        shoot: false,
        pause: false,
        mute: false,
      }
    );
  }, []);

  const clearJustPressed = useCallback(() => {
    inputManagerRef.current?.clearJustPressed();
  }, []);

  const setInput = useCallback((input: Partial<InputState>) => {
    inputManagerRef.current?.setInput(input);
  }, []);

  const clear = useCallback(() => {
    inputManagerRef.current?.clear();
  }, []);

  const wasJustPressed = useCallback((key: string): boolean => {
    return inputManagerRef.current?.wasJustPressed(key) || false;
  }, []);

  const isPressed = useCallback((key: string): boolean => {
    return inputManagerRef.current?.isPressed(key) || false;
  }, []);

  return {
    getInputState,
    clearJustPressed,
    setInput,
    clear,
    wasJustPressed,
    isPressed,
  };
}


