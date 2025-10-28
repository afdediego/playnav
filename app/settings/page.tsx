'use client';

/**
 * Settings page - Game configuration
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import { useLocalStorage, useMuteSetting } from '../../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../../game/engine/types';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [muted, toggleMute] = useMuteSetting();
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleResetProgress = () => {
    setShowConfirm(true);
  };

  const confirmReset = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.HIGH_SCORE);
      localStorage.removeItem(STORAGE_KEYS.MAX_LEVEL);
      setShowConfirm(false);
      // Reload to update state
      window.location.reload();
    }
  };

  const cancelReset = () => {
    setShowConfirm(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
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
          <span className="text-retro-cyan">SETTINGS</span>
        </h1>

        {/* Settings */}
        <div className="space-y-6">
          {/* Audio Settings */}
          <section className="bg-white/5 border-2 border-retro-cyan/50 rounded-lg p-6">
            <h2 className="font-pixel text-2xl text-retro-cyan mb-6">🔊 AUDIO</h2>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-pixel text-lg mb-1">Sound Effects</div>
                <div className="text-sm text-white/60">
                  Enable or disable game sound effects
                </div>
              </div>
              <button
                onClick={toggleMute}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-retro-cyan focus:ring-offset-2 focus:ring-offset-black ${
                  muted ? 'bg-white/20' : 'bg-retro-green'
                }`}
                role="switch"
                aria-checked={!muted}
                aria-label="Toggle sound effects"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    muted ? 'translate-x-1' : 'translate-x-7'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* Progress Section */}
          <section className="bg-white/5 border-2 border-retro-yellow/50 rounded-lg p-6">
            <h2 className="font-pixel text-2xl text-retro-yellow mb-6">📊 PROGRESS</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center font-pixel">
                <span>High Score:</span>
                <span className="text-retro-cyan">
                  {localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) || '0'}
                </span>
              </div>
              <div className="flex justify-between items-center font-pixel">
                <span>Max Level Reached:</span>
                <span className="text-retro-green">
                  {localStorage.getItem(STORAGE_KEYS.MAX_LEVEL) || '1'}
                </span>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-white/5 border-2 border-retro-pink/50 rounded-lg p-6">
            <h2 className="font-pixel text-2xl text-retro-pink mb-6">⚠️ DANGER ZONE</h2>
            <div className="space-y-4">
              <p className="text-sm text-white/60">
                Reset all game progress including high score and max level reached.
                This action cannot be undone.
              </p>
              <Button
                variant="danger"
                onClick={handleResetProgress}
                className="w-full"
              >
                🗑️ RESET PROGRESS
              </Button>
            </div>
          </section>

          {/* Info Section */}
          <section className="bg-white/5 border-2 border-retro-purple/50 rounded-lg p-6">
            <h2 className="font-pixel text-2xl text-retro-purple mb-6">ℹ️ ABOUT</h2>
            <div className="space-y-3 text-sm text-white/70">
              <div className="flex justify-between">
                <span>Version:</span>
                <span className="text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Built with:</span>
                <span className="text-white">Next.js 14 + React + TypeScript</span>
              </div>
              <div className="flex justify-between">
                <span>License:</span>
                <span className="text-white">MIT</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border-4 border-retro-pink rounded-lg p-8 max-w-md">
            <h3 className="font-pixel text-2xl text-retro-pink mb-4">
              CONFIRM RESET
            </h3>
            <p className="text-white/80 mb-6">
              Are you sure you want to reset all progress? This will delete your
              high score and max level reached.
            </p>
            <div className="flex gap-4">
              <Button
                variant="danger"
                onClick={confirmReset}
                className="flex-1"
              >
                YES, RESET
              </Button>
              <Button
                variant="secondary"
                onClick={cancelReset}
                className="flex-1"
              >
                CANCEL
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}


