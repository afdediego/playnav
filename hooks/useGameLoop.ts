/**
 * Hook for game loop management
 */

import { useEffect, useRef, useCallback } from 'react';
import { GameLoop } from '../game/engine/loop';

/**
 * Custom hook for game loop
 */
export function useGameLoop(
  update: (deltaTime: number) => void,
  render: () => void,
  isActive: boolean = true
) {
  const gameLoopRef = useRef<GameLoop | null>(null);
  const updateRef = useRef(update);
  const renderRef = useRef(render);

  // Keep refs updated
  useEffect(() => {
    updateRef.current = update;
  }, [update]);

  useEffect(() => {
    renderRef.current = render;
  }, [render]);

  // Create game loop
  useEffect(() => {
    gameLoopRef.current = new GameLoop(
      (deltaTime: number) => updateRef.current(deltaTime),
      () => renderRef.current()
    );

    return () => {
      gameLoopRef.current?.stop();
    };
  }, []);

  // Control loop based on isActive
  useEffect(() => {
    if (isActive) {
      gameLoopRef.current?.start();
    } else {
      gameLoopRef.current?.stop();
    }
  }, [isActive]);

  const start = useCallback(() => {
    gameLoopRef.current?.start();
  }, []);

  const stop = useCallback(() => {
    gameLoopRef.current?.stop();
  }, []);

  return { start, stop };
}


