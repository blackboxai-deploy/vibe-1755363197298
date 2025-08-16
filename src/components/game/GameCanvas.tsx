"use client";

import { useEffect, useRef, useCallback } from 'react';
import { GameEngine } from '@/lib/game/GameEngine';
import { GameRenderer } from '@/lib/game/GameRenderer';
import { GameState } from '@/types/game';

interface GameCanvasProps {
  gameState: GameState;
  onGameOver: (score: number) => void;
  onUpdateGameState: (updates: Partial<GameState>) => void;
}

export default function GameCanvas({ gameState, onGameOver, onUpdateGameState }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<GameRenderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const gameLoop = useCallback((currentTime: number) => {
    if (!gameEngineRef.current || !rendererRef.current || gameState.isPaused) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Update game logic
    gameEngineRef.current.update(deltaTime);

    // Check for game over
    if (gameEngineRef.current.isGameOver()) {
      const finalScore = gameEngineRef.current.getGameData().score;
      onGameOver(finalScore);
      return;
    }

    // Update game state
    const gameData = gameEngineRef.current.getGameData();
    onUpdateGameState({
      score: gameData.score,
      level: Math.floor(gameData.score / 1000) + 1,
      lives: gameData.lives
    });

    // Render
    rendererRef.current.render(gameEngineRef.current);

    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState.isPaused, onGameOver, onUpdateGameState]);

  const initializeGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Initialize game systems
    gameEngineRef.current = new GameEngine(canvas);
    rendererRef.current = new GameRenderer(canvas);

    // Start game loop
    lastTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameLoop]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }, []);

  useEffect(() => {
    initializeGame();

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [initializeGame, handleResize]);

  useEffect(() => {
    // Handle pause/resume
    if (gameState.isPaused) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    } else if (gameState.isPlaying) {
      lastTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameState.isPaused, gameState.isPlaying, gameLoop]);

  useEffect(() => {
    // Handle game restart
    if (gameState.isPlaying && gameEngineRef.current) {
      gameEngineRef.current.reset();
      lastTimeRef.current = performance.now();
      if (!animationFrameRef.current && !gameState.isPaused) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    }
  }, [gameState.isPlaying, gameLoop]);

  useEffect(() => {
    // Handle keyboard events for pause and restart
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyP':
          if (gameState.isPlaying) {
            onUpdateGameState({ isPaused: !gameState.isPaused });
          }
          break;
        case 'KeyR':
          if (gameState.isGameOver) {
            onUpdateGameState({
              isPlaying: true,
              isPaused: false,
              isGameOver: false,
              score: 0,
              level: 1,
              lives: 3
            });
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, onUpdateGameState]);

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-black"
        style={{ 
          display: 'block',
          imageRendering: 'pixelated'
        }}
      />
      
      {gameState.isPaused && (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-cyan-400 mb-4">PAUSED</h2>
            <p className="text-gray-300 mb-2">Press P to resume</p>
            <p className="text-gray-300">Press R to restart</p>
          </div>
        </div>
      )}
    </div>
  );
}