"use client";

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GameState } from '@/types/game';

interface GameUIProps {
  gameState: GameState;
  onPause: () => void;
}

export default function GameUI({ gameState, onPause }: GameUIProps) {
  const healthPercentage = (gameState.lives / 3) * 100;

  return (
    <div className="flex items-center space-x-6">
      {/* Score Display */}
      <div className="text-right">
        <div className="text-cyan-400 text-lg font-bold">
          {gameState.score.toLocaleString()}
        </div>
        <div className="text-xs text-gray-400">SCORE</div>
      </div>

      {/* High Score */}
      <div className="text-right">
        <div className="text-purple-400 text-lg font-bold">
          {gameState.highScore.toLocaleString()}
        </div>
        <div className="text-xs text-gray-400">HIGH SCORE</div>
      </div>

      {/* Level */}
      <div className="text-right">
        <div className="text-yellow-400 text-lg font-bold">
          {gameState.level}
        </div>
        <div className="text-xs text-gray-400">LEVEL</div>
      </div>

      {/* Health/Lives */}
      <div className="flex flex-col items-center min-w-[120px]">
        <div className="flex space-x-1 mb-1">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded border-2 ${
                i < gameState.lives
                  ? 'bg-green-500 border-green-400'
                  : 'bg-gray-700 border-gray-600'
              }`}
            >
              <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent rounded"></div>
            </div>
          ))}
        </div>
        <div className="text-xs text-gray-400">LIVES</div>
      </div>

      {/* Pause Button */}
      <Button
        onClick={onPause}
        variant="outline"
        size="sm"
        className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
      >
        {gameState.isPaused ? 'RESUME' : 'PAUSE'}
      </Button>
    </div>
  );
}