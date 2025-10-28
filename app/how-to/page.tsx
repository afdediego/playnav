'use client';

/**
 * How to Play page - Game instructions
 */

import Link from 'next/link';
import Button from '../../components/ui/Button';

export default function HowToPage() {
  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="secondary" size="small">
              ← BACK
            </Button>
          </Link>
        </div>

        {/* Title */}
        <h1 className="font-pixel text-4xl md:text-6xl text-center mb-12 retro-text">
          <span className="text-retro-cyan">HOW TO </span>
          <span className="text-retro-yellow">PLAY</span>
        </h1>

        {/* Content */}
        <div className="space-y-8 font-pixel">
          {/* Objective */}
          <section className="bg-white/5 border-2 border-retro-purple/50 rounded-lg p-6">
            <h2 className="text-2xl text-retro-purple mb-4">🎯 OBJECTIVE</h2>
            <p className="text-white/80 leading-relaxed">
              Defend Earth from waves of alien invaders! Shoot down all enemies before they reach the ground. 
              Each level gets progressively harder with faster enemies and more aggressive attacks.
            </p>
          </section>

          {/* Desktop Controls */}
          <section className="bg-white/5 border-2 border-retro-cyan/50 rounded-lg p-6">
            <h2 className="text-2xl text-retro-cyan mb-4">⌨️ KEYBOARD CONTROLS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <kbd className="px-3 py-2 bg-white/10 rounded text-center min-w-[60px]">← →</kbd>
                <span className="text-white/80">Move left/right</span>
              </div>
              <div className="flex items-center space-x-3">
                <kbd className="px-3 py-2 bg-white/10 rounded text-center min-w-[60px]">A D</kbd>
                <span className="text-white/80">Alternative move</span>
              </div>
              <div className="flex items-center space-x-3">
                <kbd className="px-3 py-2 bg-white/10 rounded text-center min-w-[60px]">SPACE</kbd>
                <span className="text-white/80">Shoot</span>
              </div>
              <div className="flex items-center space-x-3">
                <kbd className="px-3 py-2 bg-white/10 rounded text-center min-w-[60px]">J</kbd>
                <span className="text-white/80">Alternative shoot</span>
              </div>
              <div className="flex items-center space-x-3">
                <kbd className="px-3 py-2 bg-white/10 rounded text-center min-w-[60px]">P</kbd>
                <span className="text-white/80">Pause/Resume</span>
              </div>
              <div className="flex items-center space-x-3">
                <kbd className="px-3 py-2 bg-white/10 rounded text-center min-w-[60px]">M</kbd>
                <span className="text-white/80">Mute/Unmute</span>
              </div>
            </div>
          </section>

          {/* Mobile Controls */}
          <section className="bg-white/5 border-2 border-retro-green/50 rounded-lg p-6">
            <h2 className="text-2xl text-retro-green mb-4">📱 MOBILE CONTROLS</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Touch controls appear automatically on mobile devices:
            </p>
            <ul className="space-y-2 text-white/80">
              <li>• <strong className="text-retro-green">← → buttons</strong>: Move your ship left and right</li>
              <li>• <strong className="text-retro-green">FIRE button</strong>: Shoot at enemies</li>
              <li>• All controls are positioned at the bottom for easy thumb access</li>
            </ul>
          </section>

          {/* Gameplay */}
          <section className="bg-white/5 border-2 border-retro-yellow/50 rounded-lg p-6">
            <h2 className="text-2xl text-retro-yellow mb-4">🎮 GAMEPLAY</h2>
            <ul className="space-y-3 text-white/80">
              <li className="flex items-start">
                <span className="text-retro-yellow mr-2">•</span>
                <span><strong>Lives:</strong> You start with 3 lives. Lose a life when hit by enemy fire or when enemies reach the ground.</span>
              </li>
              <li className="flex items-start">
                <span className="text-retro-yellow mr-2">•</span>
                <span><strong>Enemies:</strong> Different colored enemies are worth different points. Yellow squids (30pts), Magenta crabs (20pts), Cyan octopuses (10pts).</span>
              </li>
              <li className="flex items-start">
                <span className="text-retro-yellow mr-2">•</span>
                <span><strong>Movement:</strong> Enemies move in formation, side to side, dropping down when they reach the edge.</span>
              </li>
              <li className="flex items-start">
                <span className="text-retro-yellow mr-2">•</span>
                <span><strong>Progression:</strong> Clear all enemies to advance. Each level increases speed and enemy aggression.</span>
              </li>
              <li className="flex items-start">
                <span className="text-retro-yellow mr-2">•</span>
                <span><strong>Invulnerability:</strong> After being hit, you get 2 seconds of invulnerability (ship blinks).</span>
              </li>
            </ul>
          </section>

          {/* Tips */}
          <section className="bg-white/5 border-2 border-retro-pink/50 rounded-lg p-6">
            <h2 className="text-2xl text-retro-pink mb-4">💡 TIPS & TRICKS</h2>
            <ul className="space-y-2 text-white/80">
              <li>• Focus on eliminating enemies in the lower rows first</li>
              <li>• Keep moving to avoid enemy fire</li>
              <li>• Use the edges of the screen strategically</li>
              <li>• Take advantage of your invulnerability time after being hit</li>
              <li>• The fewer enemies remain, the faster they move!</li>
            </ul>
          </section>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link href="/play">
            <Button size="large">
              ▶ START PLAYING
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}


