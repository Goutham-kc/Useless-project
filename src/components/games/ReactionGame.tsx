import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface ReactionGameProps {
  onComplete: () => void;
  onClose: () => void;
}

export const ReactionGame: React.FC<ReactionGameProps> = ({ onComplete, onClose }) => {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'click' | 'clicked' | 'tooSoon'>('waiting');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number>(0);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(0);

  const targetRounds = 3;
  const maxReactionTime = 500; // 500ms or less to pass

  // Ref to hold latest gameState for timeout callback
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const startGame = () => {
    setGameState('ready');
    const delay = Math.random() * 4000 + 1000; // 1-5 seconds

    setTimeout(() => {
      // Use gameStateRef.current to get latest gameState
      if (gameStateRef.current !== 'ready') return;
      setGameState('click');
      setStartTime(Date.now());
    }, delay);
  };

  const handleClick = useCallback(() => {
    if (gameState === 'click') {
      const reactionTime = Date.now() - startTime;
      setReactionTime(reactionTime);
      setAttempts(prev => [...prev, reactionTime]);
      setGameState('clicked');
      setCurrentRound(prev => prev + 1);
    } else if (gameState === 'ready') {
      setGameState('tooSoon');
    }
  }, [gameState, startTime]);

  const nextRound = () => {
    if (currentRound < targetRounds) {
      setGameState('waiting');
    }
  };

  const resetGame = () => {
    setGameState('waiting');
    setAttempts([]);
    setCurrentRound(0);
    setReactionTime(0);
  };

  useEffect(() => {
    if (attempts.length >= targetRounds) {
      const avgReactionTime = attempts.reduce((a, b) => a + b, 0) / attempts.length;
      if (avgReactionTime <= maxReactionTime) {
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }
  }, [attempts, onComplete]);

  const avgReactionTime = attempts.length > 0
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length)
    : 0;

  const getStateDisplay = () => {
    switch (gameState) {
      case 'waiting':
        return {
          bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
          text: 'Click "Start Round" when ready',
          emoji: '⏱️'
        };
      case 'ready':
        return {
          bg: 'bg-gradient-to-br from-red-500 to-red-600',
          text: 'Wait for GREEN...',
          emoji: '🔴'
        };
      case 'click':
        return {
          bg: 'bg-gradient-to-br from-green-500 to-green-600',
          text: 'CLICK NOW!',
          emoji: '🟢'
        };
      case 'clicked':
        return {
          bg: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
          text: `${reactionTime}ms ${reactionTime <= maxReactionTime ? '✅' : '❌'}`,
          emoji: reactionTime <= maxReactionTime ? '⚡' : '🐌'
        };
      case 'tooSoon':
        return {
          bg: 'bg-gradient-to-br from-red-600 to-red-700',
          text: 'Too soon! Wait for green.',
          emoji: '❌'
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-500 to-gray-600',
          text: '',
          emoji: ''
        };
    }
  };

  const display = getStateDisplay();
  const isComplete = attempts.length >= targetRounds && avgReactionTime <= maxReactionTime;

  return (
    <div className="text-center space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold">⚡ Lightning Reflexes</h3>
        <p className="text-muted-foreground">
          React in under {maxReactionTime}ms for {targetRounds} rounds to unlock your field!
        </p>
        <div className="text-sm text-muted-foreground">
          Round {currentRound + 1}/{targetRounds} • Avg: {avgReactionTime}ms
        </div>
      </div>

      <div
        className={`
          w-full h-64 rounded-xl border-4 border-white/20 flex flex-col items-center justify-center
          text-white font-bold text-xl cursor-pointer transition-all duration-300 transform hover:scale-105
          ${display.bg}
        `}
        onClick={handleClick}
      >
        <div className="text-4xl mb-4 animate-pulse-game">{display.emoji}</div>
        <div>{display.text}</div>
        {gameState === 'clicked' && reactionTime <= maxReactionTime && (
          <div className="text-sm mt-2 animate-bounce">Great reaction!</div>
        )}
      </div>

      {attempts.length > 0 && (
        <div className="bg-muted p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Results:</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            {attempts.map((time, index) => (
              <div key={index} className={`p-2 rounded ${time <= maxReactionTime ? 'bg-game-success/20' : 'bg-game-danger/20'}`}>
                Round {index + 1}: {time}ms
              </div>
            ))}
          </div>
        </div>
      )}

      {isComplete && (
        <div className="bg-gradient-to-r from-game-success/10 to-game-secondary/10 p-4 rounded-lg border border-game-success/20">
          <h4 className="text-lg font-bold text-game-success mb-2">⚡ Lightning Fast!</h4>
          <p className="text-sm text-muted-foreground">
            Average reaction time: {avgReactionTime}ms
          </p>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>

        {gameState === 'waiting' && currentRound < targetRounds && (
          <Button onClick={startGame} className="bg-game-primary text-white">
            Start Round {currentRound + 1}
          </Button>
        )}

        {(gameState === 'clicked' || gameState === 'tooSoon') && currentRound < targetRounds && (
          <Button onClick={nextRound} className="bg-game-secondary text-white">
            Next Round
          </Button>
        )}

        <Button onClick={resetGame} variant="outline">
          Reset
        </Button>

        {isComplete && (
          <Button onClick={onComplete} className="bg-game-success text-white">
            ⚡ Complete Challenge!
          </Button>
        )}
      </div>
    </div>
  );
};
