'use client';

/**
 * Home page - Main menu
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../components/ui/Button';
import { useHighScore, useMaxLevel } from '../hooks/useLocalStorage';

export default function HomePage() {
  const [highScore] = useHighScore();
  const [maxLevel] = useMaxLevel();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0 z-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-8 text-center">
        {/* Title */}
        <div className="space-y-4">
          <h1 className="font-pixel text-6xl md:text-8xl font-bold retro-text animate-pulse-slow">
            <span className="text-retro-cyan">PLAY</span>
            <span className="text-retro-pink">NAV</span>
          </h1>
          <p className="font-pixel text-lg md:text-xl text-retro-yellow">
            INVASORES DEL ESPACIO
          </p>
        </div>

        {/* Stats */}
        {mounted && (highScore > 0 || maxLevel > 1) && (
          <div className="bg-white/5 border-2 border-retro-purple/50 rounded-lg p-6 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-4 font-pixel">
              <div>
                <div className="text-sm text-retro-cyan mb-1">MEJOR PUNTUACIÓN</div>
                <div className="text-2xl font-bold">{highScore.toString().padStart(6, '0')}</div>
              </div>
              <div>
                <div className="text-sm text-retro-green mb-1">NIVEL MÁXIMO</div>
                <div className="text-2xl font-bold">{maxLevel}</div>
              </div>
            </div>
          </div>
        )}

        {/* Menu buttons */}
        <div className="space-y-4">
          <Link href="/play" className="block">
            <Button size="large" className="w-full md:w-auto md:min-w-[300px]">
              ▶ JUGAR
            </Button>
          </Link>
        </div>

        {/* Footer */}
        <div className="font-pixel text-xs text-white/50 space-y-2">
          <p>Construido con Next.js, React y TypeScript</p>
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded">←</kbd>
              <kbd className="px-2 py-1 bg-white/10 rounded">→</kbd>
              <span>Mover</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded">SPACE</kbd>
              <span>Disparar</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white/10 rounded">P</kbd>
              <span>Pausa</span>
            </span>
          </p>
          <p className="text-retro-cyan">📱 En móvil: Arrastra el dedo para mover</p>
        </div>
      </div>
    </main>
  );
}


