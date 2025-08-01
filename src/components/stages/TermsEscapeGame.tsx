import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface TermsEscapeGameProps {
  onNext: () => void;
}

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  content: string;
}

export const TermsEscapeGame = ({ onNext }: TermsEscapeGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [player, setPlayer] = useState({ x: 50, y: 300, width: 20, height: 30 });
  const [obstacles, setObstacles] = useState<GameObject[]>([]);
  const [gameTime, setGameTime] = useState(0);

  const legalTexts = [
    '☐', '✓', 'AGREE', 'TERMS', 'CONDITIONS', 'PRIVACY', 'COOKIES', 'GDPR',
    'CONSENT', 'BINDING', 'ARBITRATION', 'DAMAGES', 'LIABILITY', 'WAIVER',
    'JURISDICTION', 'GOVERNING LAW', 'SEVERABILITY', 'FORCE MAJEURE'
  ];

  useEffect(() => {
    if (!gameRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    let lastObstacleTime = 0;

    const gameLoop = (timestamp: number) => {
      // Clear canvas
      ctx.fillStyle = 'hsl(120, 20%, 10%)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update game time
      setGameTime(prev => prev + 16);

      // Spawn obstacles
      if (timestamp - lastObstacleTime > 800) {
        const newObstacle: GameObject = {
          x: canvas.width,
          y: Math.random() * (canvas.height - 100),
          width: Math.random() * 80 + 40,
          height: 30,
          speed: 2 + Math.random() * 3,
          content: legalTexts[Math.floor(Math.random() * legalTexts.length)]
        };
        setObstacles(prev => [...prev, newObstacle]);
        lastObstacleTime = timestamp;
      }

      // Update obstacles
      setObstacles(prev => prev.map(obstacle => ({
        ...obstacle,
        x: obstacle.x - obstacle.speed
      })).filter(obstacle => obstacle.x + obstacle.width > 0));

      // Draw player (stick figure)
      ctx.fillStyle = 'hsl(120, 100%, 40%)';
      ctx.fillRect(player.x, player.y, player.width, player.height);
      
      // Draw stick figure details
      ctx.strokeStyle = 'hsl(120, 100%, 40%)';
      ctx.lineWidth = 2;
      // Head
      ctx.beginPath();
      ctx.arc(player.x + 10, player.y - 5, 5, 0, Math.PI * 2);
      ctx.stroke();
      // Arms
      ctx.beginPath();
      ctx.moveTo(player.x + 10, player.y + 10);
      ctx.lineTo(player.x + 5, player.y + 15);
      ctx.moveTo(player.x + 10, player.y + 10);
      ctx.lineTo(player.x + 15, player.y + 15);
      ctx.stroke();
      // Legs
      ctx.beginPath();
      ctx.moveTo(player.x + 10, player.y + 20);
      ctx.lineTo(player.x + 5, player.y + 30);
      ctx.moveTo(player.x + 10, player.y + 20);
      ctx.lineTo(player.x + 15, player.y + 30);
      ctx.stroke();

      // Draw obstacles
      obstacles.forEach(obstacle => {
        ctx.fillStyle = 'hsl(0, 100%, 50%)';
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        
        ctx.fillStyle = 'white';
        ctx.font = '12px monospace';
        ctx.fillText(obstacle.content, obstacle.x + 5, obstacle.y + 20);
      });

      // Check collisions
      obstacles.forEach(obstacle => {
        if (player.x < obstacle.x + obstacle.width &&
            player.x + player.width > obstacle.x &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
          setLives(prev => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              setGameRunning(false);
              // Auto-complete after losing
              setTimeout(() => setGameWon(true), 1000);
            }
            return newLives;
          });
          // Remove the obstacle that hit the player
          setObstacles(prev => prev.filter(o => o !== obstacle));
        }
      });

      // Update score
      setScore(prev => prev + 1);

      // Win condition - survive for 10 seconds
      if (gameTime > 10000) {
        setGameRunning(false);
        setGameWon(true);
      }

      if (gameRunning) {
        animationFrame = requestAnimationFrame(gameLoop);
      }
    };

    animationFrame = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [gameRunning, player, obstacles, gameTime]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning) return;

      setPlayer(prev => {
        let newY = prev.y;
        let newX = prev.x;

        switch (e.key) {
          case 'ArrowUp':
          case 'w':
            newY = Math.max(0, prev.y - 20);
            break;
          case 'ArrowDown':
          case 's':
            newY = Math.min(370, prev.y + 20);
            break;
          case 'ArrowLeft':
          case 'a':
            newX = Math.max(0, prev.x - 15);
            break;
          case 'ArrowRight':
          case 'd':
            newX = Math.min(580, prev.x + 15);
            break;
        }

        return { ...prev, x: newX, y: newY };
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameRunning]);

  const startGame = () => {
    setGameRunning(true);
    setGameWon(false);
    setScore(0);
    setLives(3);
    setGameTime(0);
    setPlayer({ x: 50, y: 300, width: 20, height: 30 });
    setObstacles([]);
  };

  if (gameWon) {
    return (
      <div className="min-h-screen retro-gradient flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-retro-green retro-glow">
            CONGRATULATIONS!
          </h1>
          <p className="text-retro-amber text-lg">
            You have successfully navigated the Terms & Conditions!
          </p>
          <p className="text-retro-green">
            Score: {score} | Time Survived: {(gameTime / 1000).toFixed(1)}s
          </p>
          <Button 
            onClick={onNext}
            className="bg-retro-green text-retro-bg hover:bg-retro-amber retro-shadow"
          >
            Claim Your Reward
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen retro-gradient flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-retro-green retro-glow">
            ESCAPE THE TERMS & CONDITIONS
          </h1>
          <p className="text-retro-amber">
            Dodge the falling legal text to accept our terms!
          </p>
        </div>

        <div className="bg-retro-bg border-2 border-retro-green rounded-lg p-4 retro-shadow">
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            className="border border-retro-green"
          />
          
          {gameRunning && (
            <div className="mt-2 flex justify-between text-retro-green text-sm">
              <span>Score: {score}</span>
              <span>Lives: {'❤️'.repeat(lives)}</span>
              <span>Time: {(gameTime / 1000).toFixed(1)}s</span>
            </div>
          )}
        </div>

        {!gameRunning && !gameWon && (
          <div className="space-y-4">
            <div className="text-retro-amber text-sm">
              <p>Use WASD or Arrow Keys to move</p>
              <p>Survive for 10 seconds to win!</p>
              <p className="text-xs mt-2">
                (Don't worry, you'll "win" either way. This is just for show.)
              </p>
            </div>
            <Button 
              onClick={startGame}
              className="bg-retro-green text-retro-bg hover:bg-retro-amber retro-shadow"
            >
              Start Game
            </Button>
          </div>
        )}

        {lives <= 0 && !gameWon && (
          <div className="text-retro-amber">
            <p>Game Over! But don't worry...</p>
            <p className="text-sm">You "agreed" to our terms anyway! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};