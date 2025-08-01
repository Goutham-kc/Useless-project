import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Obstacle, PowerUp } from '../types';
import { 
  generateObstacle, 
  generatePowerUp, 
  updateGameState,
  GAME_WIDTH,
  GAME_HEIGHT,
  PLAYER_SIZE,
  JUMP_FORCE
} from '../utils/gameLogic';

interface EscapeGameProps {
  onComplete: () => void;
}

export const EscapeGame: React.FC<EscapeGameProps> = ({ onComplete }) => {
  const [gameState, setGameState] = useState<GameState>({
    x: 100,
    y: GAME_HEIGHT - PLAYER_SIZE - 50,
    velocity: 0,
    isJumping: false,
    score: 0,
    lives: 3,
    powerUps: [],
    invulnerable: false,
    invulnerableTime: 0
  });
  
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [gameRunning, setGameRunning] = useState(true);
  const [gameTime, setGameTime] = useState(0);
  
  // Jump handler
  const handleJump = useCallback(() => {
    if (!gameState.isJumping && gameState.y >= GAME_HEIGHT - PLAYER_SIZE - 50) {
      setGameState(prev => ({
        ...prev,
        velocity: JUMP_FORCE,
        isJumping: true
      }));
    }
  }, [gameState.isJumping, gameState.y]);
  
  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleJump();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleJump]);
  
  // Game loop
  useEffect(() => {
    if (!gameRunning) return;
    
    const gameLoop = setInterval(() => {
      setGameTime(prev => prev + 1);
      
      // Update game state
      setGameState(prev => updateGameState(prev, obstacles, powerUps));
      
      // Move obstacles
      setObstacles(prev => 
        prev.map(obstacle => ({ ...obstacle, x: obstacle.x - 3 }))
          .filter(obstacle => obstacle.x > -obstacle.width)
      );
      
      // Move power-ups
      setPowerUps(prev => 
        prev.map(powerUp => ({ ...powerUp, x: powerUp.x - 3 }))
          .filter(powerUp => powerUp.x > -30)
      );
      
      // Generate new obstacles
      if (Math.random() < 0.02) {
        setObstacles(prev => [...prev, generateObstacle(gameTime)]);
      }
      
      // Generate new power-ups
      if (Math.random() < 0.005) {
        setPowerUps(prev => [...prev, generatePowerUp()]);
      }
      
    }, 16); // ~60 FPS
    
    return () => clearInterval(gameLoop);
  }, [gameRunning, obstacles, powerUps, gameTime]);
  
  // Check win condition
  useEffect(() => {
    if (gameState.score > 3000) { // Win after surviving long enough
      setGameRunning(false);
      setTimeout(() => onComplete(), 2000);
    }
  }, [gameState.score, onComplete]);
  
  // Check game over
  useEffect(() => {
    if (gameState.lives <= 0) {
      setGameRunning(false);
      setTimeout(() => {
        // Reset game
        setGameState({
          x: 100,
          y: GAME_HEIGHT - PLAYER_SIZE - 50,
          velocity: 0,
          isJumping: false,
          score: 0,
          lives: 3,
          powerUps: [],
          invulnerable: false,
          invulnerableTime: 0
        });
        setObstacles([]);
        setPowerUps([]);
        setGameTime(0);
        setGameRunning(true);
      }, 2000);
    }
  }, [gameState.lives]);
  
  const getPowerUpIcon = (type: PowerUp['type']) => {
    switch (type) {
      case 'clear-cookies': return '🍪';
      case 'incognito': return '🕶️';
      case 'mute-notifications': return '🔇';
      default: return '⭐';
    }
  };
  
  const getObstacleContent = (obstacle: Obstacle) => {
    switch (obstacle.type) {
      case 'checkbox': return '☑️';
      case 'text-wall': return '📄';
      case 'popup': return '💬';
      case 'captcha': return '🤖';
      default: return '❌';
    }
  };
  
  return (
    <div className="min-h-screen bg-black text-green-400 p-4 font-mono">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-4 animate-pulse">
          🏃‍♂️ ESCAPE THE TERMS & CONDITIONS 🏃‍♂️
        </h1>
        
        {/* Game UI */}
        <div className="bg-gray-900 rounded-lg p-4 mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Lives: {'❤️'.repeat(gameState.lives)}</span>
            <span>Score: {gameState.score}</span>
            <span>Time: {Math.floor(gameTime / 60)}s</span>
          </div>
          
          {gameState.invulnerable && (
            <div className="text-yellow-400 text-xs animate-bounce">
              🛡️ INVULNERABLE MODE ACTIVE!
            </div>
          )}
        </div>
        
        {/* Game Canvas */}
        <div 
          className="relative bg-blue-900 rounded-lg overflow-hidden cursor-pointer border-2 border-green-400"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT, margin: '0 auto' }}
          onClick={handleJump}
        >
          {/* Player */}
          <div
            className={`absolute text-2xl transition-all duration-75 ${
              gameState.invulnerable ? 'animate-pulse' : ''
            }`}
            style={{
              left: gameState.x,
              top: gameState.y,
              width: PLAYER_SIZE,
              height: PLAYER_SIZE
            }}
          >
            🏃‍♂️
          </div>
          
          {/* Obstacles */}
          {obstacles.map(obstacle => (
            <div
              key={obstacle.id}
              className="absolute bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold"
              style={{
                left: obstacle.x,
                top: obstacle.y,
                width: obstacle.width,
                height: obstacle.height
              }}
            >
              <span className="text-lg">{getObstacleContent(obstacle)}</span>
            </div>
          ))}
          
          {/* Power-ups */}
          {powerUps.map(powerUp => (
            <div
              key={powerUp.id}
              className="absolute bg-yellow-400 rounded-full flex items-center justify-center animate-bounce"
              style={{
                left: powerUp.x,
                top: powerUp.y,
                width: 30,
                height: 30
              }}
            >
              <span className="text-lg">{getPowerUpIcon(powerUp.type)}</span>
            </div>
          ))}
          
          {/* Ground */}
          <div 
            className="absolute bg-green-600 w-full"
            style={{
              bottom: 0,
              height: 50
            }}
          />
          
          {!gameRunning && gameState.lives <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">💀 GAME OVER 💀</h3>
                <p className="text-sm">The legal maze has consumed you!</p>
                <p className="text-xs mt-2 animate-pulse">Restarting...</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-sm mb-2">
            🎮 Click or press SPACE/UP to jump and avoid obstacles!
          </p>
          <p className="text-xs text-gray-400">
            Collect power-ups: 🍪 Clear Cookies | 🕶️ Incognito Mode | 🔇 Mute Notifications
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="mt-4 bg-gray-800 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((gameState.score / 3000) * 100, 100)}%` }}
          />
        </div>
        <p className="text-center text-xs mt-1">
          Progress to Freedom: {Math.floor((gameState.score / 3000) * 100)}%
        </p>
      </div>
    </div>
  );
};