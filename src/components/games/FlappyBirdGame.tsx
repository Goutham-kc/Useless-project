import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";

interface FlappyBirdGameProps {
  onComplete: () => void;
  onClose: () => void;
}

export const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({ onComplete, onClose }) => {
  const [birdY, setBirdY] = useState(300);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Array<{ x: number; topHeight: number; bottomY: number }>>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const GRAVITY = 0.6;
  const JUMP_FORCE = -12;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 150;
  const BIRD_SIZE = 30;

  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
      return;
    }
    if (gameOver) return;
    setBirdVelocity(JUMP_FORCE);
  }, [gameStarted, gameOver]);

  const resetGame = () => {
    setBirdY(300);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameStarted(false);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [jump]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      setBirdY(prev => {
        const newY = prev + birdVelocity;
        if (newY <= 0 || newY >= 570) {
          setGameOver(true);
          return prev;
        }
        return newY;
      });

      setBirdVelocity(prev => prev + GRAVITY);

      setPipes(prev => {
        let newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - 3 }));
        
        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < 400) {
          const topHeight = Math.random() * 200 + 100;
          newPipes.push({
            x: 600,
            topHeight,
            bottomY: topHeight + PIPE_GAP
          });
        }

        newPipes = newPipes.filter(pipe => pipe.x > -PIPE_WIDTH);

        // Check for collisions
        newPipes.forEach(pipe => {
          if (pipe.x < 100 + BIRD_SIZE && pipe.x + PIPE_WIDTH > 100) {
            if (birdY < pipe.topHeight || birdY + BIRD_SIZE > pipe.bottomY) {
              setGameOver(true);
            }
          }
          
          // Score when passing pipe
          if (pipe.x + PIPE_WIDTH === 97) {
            setScore(s => s + 1);
          }
        });

        return newPipes;
      });
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, birdVelocity, birdY]);

  useEffect(() => {
    if (score >= 3) {
      onComplete();
    }
  }, [score, onComplete]);

  return (
    <div className="text-center space-y-4">
      <div 
        className="relative w-full h-96 bg-gradient-to-b from-blue-400 to-blue-600 border-2 border-primary rounded-lg overflow-hidden cursor-pointer"
        onClick={jump}
      >
        {/* Bird */}
        <div
          className="absolute w-8 h-8 bg-yellow-400 rounded-full transition-transform duration-75 flex items-center justify-center text-lg"
          style={{
            left: '100px',
            top: `${birdY}px`,
            transform: `rotate(${Math.min(birdVelocity * 3, 45)}deg)`
          }}
        >
          🐦
        </div>

        {/* Pipes */}
        {pipes.map((pipe, index) => (
          <div key={index}>
            <div
              className="absolute bg-green-500 border-2 border-green-700"
              style={{
                left: `${pipe.x}px`,
                top: '0px',
                width: `${PIPE_WIDTH}px`,
                height: `${pipe.topHeight}px`
              }}
            />
            <div
              className="absolute bg-green-500 border-2 border-green-700"
              style={{
                left: `${pipe.x}px`,
                top: `${pipe.bottomY}px`,
                width: `${PIPE_WIDTH}px`,
                height: `${600 - pipe.bottomY}px`
              }}
            />
          </div>
        ))}

        {/* Game UI */}
        <div className="absolute top-4 left-4 text-white font-bold text-xl">
          Score: {score}/3
        </div>

        {!gameStarted && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white">
            <h3 className="text-2xl font-bold mb-4">🐦 Flappy Bird Challenge</h3>
            <p className="mb-4">Get 3 points to unlock your field!</p>
            <p className="text-sm">Click or press SPACE to jump</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75 text-white">
            <h3 className="text-2xl font-bold mb-4">💥 Game Over!</h3>
            <p className="mb-4">Score: {score}/3</p>
            <div className="space-y-2">
              <Button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600 text-white">
                Try Again
              </Button>
              <Button onClick={onClose} variant="outline" className="text-black">
                Close
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-4">
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
        {score >= 3 && (
          <Button onClick={onComplete} className="bg-game-success text-white">
            🎉 Complete Challenge!
          </Button>
        )}
      </div>
    </div>
  );
};