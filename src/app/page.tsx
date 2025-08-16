"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Background Stars Animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="stars absolute inset-0"></div>
        <div className="stars2 absolute inset-0"></div>
        <div className="stars3 absolute inset-0"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            SPACE DEFENDER
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Defend Earth from incoming asteroids and enemy ships in this epic space battle. 
            How long can you survive the cosmic onslaught?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-black/40 border-cyan-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-cyan-400 text-2xl">Game Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span>Fast-paced space combat</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Multiple enemy types</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Power-ups and upgrades</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Progressive difficulty</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Spectacular visual effects</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-400 text-2xl">How to Play</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                <span>Use ARROW KEYS to move</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Press SPACEBAR to shoot</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                <span>Collect power-ups for abilities</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Avoid enemy collisions</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Survive as long as possible!</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <Link href="/game">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-4 px-8 text-xl rounded-full transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25"
            >
              START GAME
            </Button>
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Best played in fullscreen mode • Works on desktop and mobile
          </p>
        </div>
      </div>

      <style jsx>{`
        .stars {
          width: 1px;
          height: 1px;
          background: transparent;
          box-shadow: 
            ${Array.from({ length: 700 }, () => 
              `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`
            ).join(', ')};
          animation: animStar 50s linear infinite;
        }
        
        .stars2 {
          width: 2px;
          height: 2px;
          background: transparent;
          box-shadow: 
            ${Array.from({ length: 200 }, () => 
              `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`
            ).join(', ')};
          animation: animStar 100s linear infinite;
        }
        
        .stars3 {
          width: 3px;
          height: 3px;
          background: transparent;
          box-shadow: 
            ${Array.from({ length: 100 }, () => 
              `${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`
            ).join(', ')};
          animation: animStar 150s linear infinite;
        }
        
        @keyframes animStar {
          from { transform: translateY(0px); }
          to { transform: translateY(-2000px); }
        }
      `}</style>
    </div>
  );
}