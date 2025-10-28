'use client';

/**
 * Mute toggle button
 */

interface ToggleMuteProps {
  muted: boolean;
  onToggle: () => void;
}

export default function ToggleMute({ muted, onToggle }: ToggleMuteProps) {
  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-30 w-12 h-12 bg-black/50 border-2 border-white/30 rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-retro-cyan"
      aria-label={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? (
        // Muted icon
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            clipRule="evenodd"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          />
        </svg>
      ) : (
        // Unmuted icon
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      )}
    </button>
  );
}


