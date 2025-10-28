/**
 * Hook for localStorage persistence
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for localStorage with SSR safety and hydration fix
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // SIEMPRE inicializar con initialValue para evitar errores de hidratación
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [mounted, setMounted] = useState(false);

  // Leer de localStorage solo DESPUÉS de montar (client-side only)
  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
      }
    }
  }, [key]);

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * Hook specifically for high score
 */
export function useHighScore(): [number, (score: number) => void] {
  const [highScore, setHighScore] = useLocalStorage<number>('playnav_high_score', 0);

  const updateHighScore = useCallback(
    (score: number) => {
      if (score > highScore) {
        setHighScore(score);
      }
    },
    [highScore, setHighScore]
  );

  return [highScore, updateHighScore];
}

/**
 * Hook for mute setting - DESHABILITADO: Sonido siempre activado
 */
export function useMuteSetting(): [boolean, () => void] {
  // Sonido siempre activado (muted = false)
  const muted = false;
  const toggleMute = useCallback(() => {
    // No hace nada - el sonido siempre está activado
  }, []);

  return [muted, toggleMute];
}

/**
 * Hook for max level reached
 */
export function useMaxLevel(): [number, (level: number) => void] {
  const [maxLevel, setMaxLevel] = useLocalStorage<number>('playnav_max_level', 1);

  const updateMaxLevel = useCallback(
    (level: number) => {
      if (level > maxLevel) {
        setMaxLevel(level);
      }
    },
    [maxLevel, setMaxLevel]
  );

  return [maxLevel, updateMaxLevel];
}


