'use client';

/**
 * Play page - Main game screen
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import GameCanvas from '../../components/GameCanvas';
import HUD from '../../components/ui/HUD';
import MobileControls from '../../components/ui/MobileControls';
import Button from '../../components/ui/Button';
import { useHighScore, useMaxLevel } from '../../hooks/useLocalStorage';
import { useInput } from '../../hooks/useInput';
import type { GameState } from '../../game/engine/types';

export default function PlayPage() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [score, setScore] = useState(0);
  const [highScore, updateHighScore] = useHighScore();
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [, updateMaxLevel] = useMaxLevel();
  const { setInput } = useInput();
  
  // Sonido siempre activado
  const muted = false;

  // Start game on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).__gameState) {
      (window as any).__gameState.startGame();
    }
  }, []);

  const handleGameStateChange = useCallback((newState: GameState) => {
    setGameState(newState);
  }, []);

  const handleScoreChange = useCallback(
    (newScore: number, newHighScore: number) => {
      setScore(newScore);
      updateHighScore(newScore);
    },
    [updateHighScore]
  );

  const handleLivesChange = useCallback((newLives: number) => {
    setLives(newLives);
  }, []);

  const handleLevelChange = useCallback(
    (newLevel: number) => {
      setLevel(newLevel);
      updateMaxLevel(newLevel);
    },
    [updateMaxLevel]
  );

  const handleContinue = () => {
    if (typeof window !== 'undefined' && (window as any).__gameState) {
      (window as any).__gameState.nextLevel();
    }
  };

  const handleRetry = () => {
    if (typeof window !== 'undefined' && (window as any).__gameState) {
      (window as any).__gameState.startGame();
    }
  };

  const handleBackToMenu = () => {
    router.push('/');
  };

  const handleResume = () => {
    if (typeof window !== 'undefined' && (window as any).__gameState) {
      (window as any).__gameState.resume();
    }
  };

  // Mobile controls - Arkanoid style
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const handlePositionChange = (x: number) => {
    if (typeof window !== 'undefined' && (window as any).__gameState) {
      (window as any).__gameState.setPlayerPosition(x);
    }
  };

  // Habilitar auto-shoot en móvil y obtener canvas ref
  useEffect(() => {
    const updateMobileSettings = () => {
      const isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
      if (typeof window !== 'undefined' && (window as any).__gameState) {
        (window as any).__gameState.setAutoShoot(isMobile);
      }
      
      // Get canvas ref after a short delay to ensure it's mounted
      setTimeout(() => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
          canvasRef.current = canvas as HTMLCanvasElement;
        }
      }, 100);
    };

    updateMobileSettings();
    
    // También actualizar si cambia el tamaño de ventana
    window.addEventListener('resize', updateMobileSettings);
    
    return () => {
      window.removeEventListener('resize', updateMobileSettings);
    };
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col relative overflow-hidden">
      {/* HUD */}
      <HUD score={score} highScore={highScore} lives={lives} level={level} />

      {/* Game Canvas */}
      <div className="flex-1 relative flex items-center justify-center">
        <GameCanvas
          highScore={highScore}
          muted={muted}
          onGameStateChange={handleGameStateChange}
          onScoreChange={handleScoreChange}
          onLivesChange={handleLivesChange}
          onLevelChange={handleLevelChange}
        />

        {/* Pause Overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 pointer-events-auto">
            <div className="bg-black/90 border-4 border-retro-cyan p-8 rounded-lg max-w-md mx-4">
              <h2 className="font-pixel text-4xl text-center mb-6 text-retro-cyan retro-text">
                PAUSA
              </h2>
              <div className="space-y-4">
                <Button onClick={handleResume} className="w-full pointer-events-auto">
                  ▶ CONTINUAR
                </Button>
                <Button onClick={handleBackToMenu} variant="secondary" className="w-full pointer-events-auto">
                  ⌂ MENÚ
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Level Complete Overlay */}
        {gameState === 'levelComplete' && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 pointer-events-auto">
            <div className="bg-black/90 border-4 border-retro-green p-8 rounded-lg max-w-md mx-4 text-center">
              <h2 className="font-pixel text-4xl mb-4 text-retro-green retro-text animate-pulse">
                ¡NIVEL {level} COMPLETADO!
              </h2>
              <div className="font-pixel text-2xl mb-6 text-white">
                <div className="mb-2">PUNTOS: {score}</div>
                {level < 5 && <div className="text-retro-yellow">SIGUIENTE: NIVEL {level + 1}</div>}
              </div>
              <Button onClick={handleContinue} className="w-full pointer-events-auto">
                → CONTINUAR
              </Button>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50 pointer-events-auto">
            <div className="bg-black/90 border-4 border-retro-pink p-8 rounded-lg max-w-md mx-4 text-center">
              {level >= 5 ? (
                <>
                  <h2 className="font-pixel text-4xl mb-4 text-retro-green retro-text animate-pulse">
                    ¡VICTORIA!
                  </h2>
                  <p className="font-pixel text-lg mb-4 text-retro-yellow">
                    ¡Completaste todos los niveles!
                  </p>
                </>
              ) : (
                <h2 className="font-pixel text-4xl mb-4 text-retro-pink retro-text">
                  FIN DEL JUEGO
                </h2>
              )}
              <div className="font-pixel text-xl mb-6 text-white space-y-2">
                <div>PUNTUACIÓN FINAL</div>
                <div className="text-3xl text-retro-cyan">{score}</div>
                {score === highScore && score > 0 && (
                  <div className="text-retro-yellow animate-pulse">¡NUEVO RÉCORD!</div>
                )}
                <div className="text-sm text-white/70">NIVEL ALCANZADO: {level}</div>
              </div>
              <div className="space-y-3">
                <Button onClick={handleRetry} className="w-full pointer-events-auto">
                  ↻ VOLVER A JUGAR
                </Button>
                <Button onClick={handleBackToMenu} variant="secondary" className="w-full pointer-events-auto">
                  ⌂ MENÚ
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Controls - Arkanoid style */}
      <MobileControls
        onPositionChange={handlePositionChange}
        canvasRef={canvasRef}
      />
    </main>
  );
}


