"use client";

import { useState, useEffect } from 'react';
import GameCanvas from '@/components/game/GameCanvas';
import GameUI from '@/components/game/GameUI';
import GameMenu from '@/components/game/GameMenu';
import { GameState } from '@/types/game';

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    level: 1,
    lives: 3
  });

  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('spaceDefenderHighScore');
    if (savedHighScore) {
      setGameState(prev => ({
        ...prev,
        highScore: parseInt(savedHighScore, 10)
      }));
    }
  }, []);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      score: 0,
      level: 1,
      lives: 3
    }));
  };

  const pauseGame = () => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  };

  const gameOver = (finalScore: number) => {
    const isNewHighScore = finalScore > gameState.highScore;
    
    if (isNewHighScore) {
      localStorage.setItem('spaceDefenderHighScore', finalScore.toString());
    }

    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isGameOver: true,
      score: finalScore,
      highScore: isNewHighScore ? finalScore : prev.highScore
    }));
  };

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({
      ...prev,
      ...updates
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars absolute inset-0"></div>
        <div className="stars2 absolute inset-0"></div>
      </div>

      <div className="relative z-10 w-full h-screen flex flex-col">
        {/* Game Header */}
        <div className="flex justify-between items-center p-4 bg-black/50 backdrop-blur-sm border-b border-cyan-500/30">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            SPACE DEFENDER
          </h1>
          
          {gameState.isPlaying && (
            <GameUI 
              gameState={gameState}
              onPause={pauseGame}
            />
          )}
        </div>

        {/* Game Area */}
        <div className="flex-1 relative">
          {!gameState.isPlaying ? (
            <GameMenu 
              gameState={gameState}
              onStartGame={startGame}
              onRestartGame={startGame}
            />
          ) : (
            <GameCanvas 
              gameState={gameState}
              onGameOver={gameOver}
              onUpdateGameState={updateGameState}
            />
          )}
        </div>

        {/* Game Instructions (when not playing) */}
        {!gameState.isPlaying && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-center">
            <div className="bg-black/70 backdrop-blur-sm border border-cyan-500/30 rounded-lg p-4">
              <p className="text-cyan-400 text-sm mb-2">CONTROLS</p>
              <div className="flex space-x-6 text-xs text-gray-300">
                <span>← → MOVE</span>
                <span>SPACE SHOOT</span>
                <span>P PAUSE</span>
                <span>R RESTART</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .stars {
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: 
            ${Array.from({ length: 400 }, () => 
              `${Math.random() * 2000}px ${Math.random() * 1000}px #FFF`
            ).join(', ')};
          animation: animStar 20s linear infinite;
        }
        
        .stars2 {
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: 
            ${Array.from({ length: 100 }, () => 
              `${Math.random() * 2000}px ${Math.random() * 1000}px #FFF`
            ).join(', ')};
          animation: animStar 40s linear infinite;
        }
        
        @keyframes animStar {
          from { transform: translateY(0px); }
          to { transform: translateY(-1000px); }
        }
      `}</style>
    </div>
  );
}