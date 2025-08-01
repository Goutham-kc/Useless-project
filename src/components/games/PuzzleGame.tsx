import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

interface PuzzleGameProps {
  onComplete: () => void;
  onClose: () => void;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ onComplete, onClose }) => {
  const [grid, setGrid] = useState<(number | null)[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const GRID_SIZE = 4;
  const EMPTY_TILE = null;

  const initializeGame = () => {
    // Create solved state: [1, 2, 3, ..., 14, 15, null]
    const solvedGrid = Array.from({ length: GRID_SIZE * GRID_SIZE - 1 }, (_, i) => i + 1);
    solvedGrid.push(EMPTY_TILE);
    
    // Shuffle the grid
    const shuffledGrid = [...solvedGrid];
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = shuffledGrid.indexOf(EMPTY_TILE);
      const possibleMoves = getPossibleMoves(emptyIndex);
      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
      [shuffledGrid[emptyIndex], shuffledGrid[randomMove]] = [shuffledGrid[randomMove], shuffledGrid[emptyIndex]];
    }
    
    setGrid(shuffledGrid);
    setMoves(0);
    setIsComplete(false);
    setGameStarted(true);
  };

  const getPossibleMoves = (emptyIndex: number) => {
    const moves = [];
    const row = Math.floor(emptyIndex / GRID_SIZE);
    const col = emptyIndex % GRID_SIZE;

    // Up
    if (row > 0) moves.push(emptyIndex - GRID_SIZE);
    // Down
    if (row < GRID_SIZE - 1) moves.push(emptyIndex + GRID_SIZE);
    // Left
    if (col > 0) moves.push(emptyIndex - 1);
    // Right
    if (col < GRID_SIZE - 1) moves.push(emptyIndex + 1);

    return moves;
  };

  const moveTile = (tileIndex: number) => {
    if (!gameStarted || isComplete) return;

    const emptyIndex = grid.indexOf(EMPTY_TILE);
    const possibleMoves = getPossibleMoves(emptyIndex);

    if (possibleMoves.includes(tileIndex)) {
      const newGrid = [...grid];
      [newGrid[emptyIndex], newGrid[tileIndex]] = [newGrid[tileIndex], newGrid[emptyIndex]];
      setGrid(newGrid);
      setMoves(prev => prev + 1);
    }
  };

  const checkWin = () => {
    for (let i = 0; i < grid.length - 1; i++) {
      if (grid[i] !== i + 1) return false;
    }
    return grid[grid.length - 1] === EMPTY_TILE;
  };

  useEffect(() => {
    if (gameStarted && checkWin()) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [grid, gameStarted, onComplete]);

  const getTileColor = (value: number | null, index: number) => {
    if (value === EMPTY_TILE) return 'bg-gray-200 border-gray-300';
    
    const isCorrectPosition = value === index + 1;
    if (isCorrectPosition) {
      return 'bg-gradient-to-br from-game-success to-game-secondary text-white border-game-success';
    }
    
    return 'bg-gradient-to-br from-game-primary to-game-secondary text-white border-game-primary hover:shadow-lg';
  };

  if (!gameStarted) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">🧩 Number Puzzle</h3>
          <p className="text-muted-foreground">
            Arrange the numbers 1-15 in order to unlock your field!
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>🎯 Goal: Numbers 1-15 in order, empty space at bottom-right</p>
            <p>🖱️ Click tiles next to the empty space to move them</p>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={initializeGame} className="bg-game-primary text-white">
            Start Puzzle
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-sm">
          <span className="font-medium">Moves:</span> {moves}
        </div>
        <div className="text-sm">
          <span className="font-medium">Status:</span> {isComplete ? 'Complete! 🎉' : 'In Progress'}
        </div>
      </div>

      <div className="inline-block bg-gray-100 p-4 rounded-xl">
        <div className="grid grid-cols-4 gap-2">
          {grid.map((value, index) => (
            <div
              key={index}
              onClick={() => moveTile(index)}
              className={`
                w-16 h-16 border-2 rounded-lg flex items-center justify-center font-bold text-lg
                cursor-pointer transition-all duration-200 transform hover:scale-105
                ${getTileColor(value, index)}
                ${value === EMPTY_TILE ? 'cursor-default hover:scale-100' : ''}
              `}
            >
              {value}
            </div>
          ))}
        </div>
      </div>

      {isComplete && (
        <div className="bg-gradient-to-r from-game-success/10 to-game-secondary/10 p-4 rounded-lg border border-game-success/20">
          <h4 className="text-lg font-bold text-game-success mb-2">🧩 Puzzle Solved!</h4>
          <p className="text-sm text-muted-foreground">
            Completed in {moves} moves!
          </p>
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button onClick={initializeGame} variant="outline">
          New Puzzle
        </Button>
        {isComplete && (
          <Button onClick={onComplete} className="bg-game-success text-white">
            🧩 Complete Challenge!
          </Button>
        )}
      </div>
    </div>
  );
};