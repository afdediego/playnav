'use client';

/**
 * Heads-Up Display component showing game stats
 */

interface HUDProps {
  score: number;
  highScore: number;
  lives: number;
  level: number;
}

export default function HUD({ score, highScore, lives, level }: HUDProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none">
      <div className="w-full px-2 md:px-4 py-2 md:py-3 bg-black/50 backdrop-blur-sm border-b border-retro-cyan/30">
        <div className="flex justify-between items-start gap-2 md:gap-4 font-pixel text-white retro-text">
          {/* Left side - Score */}
          <div className="flex flex-col space-y-1 min-w-0 flex-shrink-0">
            <div className="text-xs md:text-sm text-retro-cyan whitespace-nowrap">PUNTOS</div>
            <div className="text-lg md:text-xl font-bold whitespace-nowrap">{score.toString().padStart(6, '0')}</div>
          </div>

          {/* Center - High Score */}
          <div className="flex flex-col space-y-1 text-center min-w-0 flex-shrink-0">
            <div className="text-xs md:text-sm text-retro-yellow whitespace-nowrap">RÉCORD</div>
            <div className="text-lg md:text-xl font-bold whitespace-nowrap">{highScore.toString().padStart(6, '0')}</div>
          </div>

          {/* Right side - Lives & Level */}
          <div className="flex flex-col space-y-1 items-end min-w-0 flex-shrink-0">
            <div className="flex items-center space-x-1 md:space-x-2">
              <span className="text-xs md:text-sm text-retro-green whitespace-nowrap">VIDAS</span>
              <div className="flex space-x-1">
                {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 md:w-4 md:h-4 bg-retro-green"
                    style={{
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="text-sm md:text-base whitespace-nowrap">
              <span className="text-retro-pink">NIVEL </span>
              <span className="font-bold">{level}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


