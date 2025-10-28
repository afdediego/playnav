'use client';

/**
 * Main game canvas component with responsive scaling
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { GameStateManager } from '../game/state/GameStateManager';
import { useGameLoop } from '../hooks/useGameLoop';
import { useInput } from '../hooks/useInput';
import { useAudio } from '../hooks/useAudio';
import { GAME_CONFIG } from '../game/engine/types';
import type { GameState, SoundEffect } from '../game/engine/types';

interface GameCanvasProps {
  highScore: number;
  muted: boolean;
  onGameStateChange: (state: GameState) => void;
  onScoreChange: (score: number, highScore: number) => void;
  onLivesChange: (lives: number) => void;
  onLevelChange: (level: number) => void;
}

export default function GameCanvas({
  highScore,
  muted,
  onGameStateChange,
  onScoreChange,
  onLivesChange,
  onLevelChange,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameStateRef = useRef<GameStateManager | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const { playSound } = useAudio(muted);
  const {
    getInputState,
    clearJustPressed,
    setInput,
  } = useInput();

  // Initialize game state manager
  useEffect(() => {
    if (!gameStateRef.current) {
      gameStateRef.current = new GameStateManager(
        GAME_CONFIG.CANVAS_WIDTH,
        GAME_CONFIG.CANVAS_HEIGHT,
        highScore
      );

      gameStateRef.current.setCallbacks({
        onStateChange: onGameStateChange,
        onScoreChange,
        onLivesChange,
        onLevelChange,
        onPlaySound: (effect: SoundEffect) => playSound(effect),
      });

      setIsInitialized(true);
    }
  }, [highScore, onGameStateChange, onScoreChange, onLivesChange, onLevelChange, playSound]);

  // Update high score when it changes
  useEffect(() => {
    gameStateRef.current?.setHighScore(highScore);
  }, [highScore]);

  // Handle window resize - canvas se ajusta automáticamente con CSS
  useEffect(() => {
    const handleResize = () => {
      // El canvas ahora se escala con CSS para ocupar el máximo espacio disponible
      // mantiene la relación de aspecto automáticamente
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Game update function
  const update = useCallback((deltaTime: number) => {
    if (!gameStateRef.current) return;

    const input = getInputState();

    // Handle pause
    if (input.pause) {
      gameStateRef.current.togglePause();
    }

    // Nota: Mute deshabilitado - sonido siempre activado
    // input.mute ya no hace nada

    // Update game
    gameStateRef.current.update(deltaTime, {
      left: input.left,
      right: input.right,
      shoot: input.shoot,
    });

    // Clear single-press inputs
    clearJustPressed();
  }, [getInputState, clearJustPressed]);

  // Game render function
  const render = useCallback(() => {
    if (!canvasRef.current || !gameStateRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    gameStateRef.current.draw(ctx);
  }, []);

  // Game loop
  useGameLoop(update, render, isInitialized);

  // Expose game controls
  useEffect(() => {
    if (!gameStateRef.current) return;

    // Store reference for external access
    (window as any).__gameState = gameStateRef.current;

    return () => {
      delete (window as any).__gameState;
    };
  }, [isInitialized]);

  return (
    <div
      ref={containerRef}
      className="game-container relative w-full h-full flex items-center justify-center bg-black overflow-hidden"
      style={{ minHeight: '70vh' }}
    >
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.CANVAS_WIDTH}
        height={GAME_CONFIG.CANVAS_HEIGHT}
        className="border-4 border-retro-cyan shadow-2xl shadow-retro-cyan/50 max-w-full max-h-full"
        style={{
          imageRendering: 'pixelated',
          width: '100%',
          height: 'auto',
          maxHeight: '85vh',
        }}
      />
    </div>
  );
}


