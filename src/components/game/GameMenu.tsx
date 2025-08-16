"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameState } from '@/types/game';

interface GameMenuProps {
  gameState: GameState;
  onStartGame: () => void;
  onRestartGame: () => void;
}

export default function GameMenu({ gameState, onStartGame, onRestartGame }: GameMenuProps) {
  const isGameOver = gameState.isGameOver;
  const isNewHighScore = gameState.score === gameState.highScore && gameState.score > 0;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <Card className="bg-black/80 border-cyan-500/30 backdrop-blur-md max-w-md w-full mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {isGameOver ? (isNewHighScore ? 'NEW HIGH SCORE!' : 'GAME OVER') : 'SPACE DEFENDER'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isGameOver && (
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg p-4 border border-cyan-500/30">
                <div className="text-cyan-400 text-2xl font-bold mb-2">
                  {gameState.score.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">FINAL SCORE</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-purple-400 text-lg font-bold">
                    {gameState.highScore.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-xs">HIGH SCORE</div>
                </div>
                <div className="text-center">
                  <div className="text-yellow-400 text-lg font-bold">
                    {gameState.level}
                  </div>
                  <div className="text-gray-400 text-xs">LEVEL REACHED</div>
                </div>
              </div>

              {isNewHighScore && (
                <div className="text-center py-2">
                  <div className="text-yellow-400 text-lg font-bold animate-pulse">
                    🎉 CONGRATULATIONS! 🎉
                  </div>
                  <div className="text-yellow-300 text-sm">
                    You set a new high score!
                  </div>
                </div>
              )}
            </div>
          )}

          {!isGameOver && (
            <div className="text-center space-y-4">
              <div className="text-gray-300 text-lg">
                Ready to defend Earth from the cosmic invasion?
              </div>
              
              <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-lg p-4 border border-cyan-500/30">
                <div className="text-purple-400 text-xl font-bold mb-1">
                  {gameState.highScore.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">HIGH SCORE TO BEAT</div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button
              onClick={isGameOver ? onRestartGame : onStartGame}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-3 text-lg"
            >
              {isGameOver ? 'PLAY AGAIN' : 'START GAME'}
            </Button>

            <Link href="/">
              <Button
                variant="outline"
                className="w-full border-gray-500 text-gray-300 hover:bg-gray-800"
              >
                BACK TO MENU
              </Button>
            </Link>
          </div>

          {!isGameOver && (
            <div className="text-center">
              <div className="text-gray-400 text-sm mb-3">GAME TIPS</div>
              <div className="space-y-2 text-xs text-gray-500">
                <div>• Collect power-ups for special abilities</div>
                <div>• Each enemy type has different behavior</div>
                <div>• Difficulty increases with each level</div>
                <div>• Avoid collisions to preserve lives</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}