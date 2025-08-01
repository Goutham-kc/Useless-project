import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

// --- Game Data ---
const logos = [
  { name: 'mastercard', src: 'master.webp' },
  { name: 'tinkerhub', src: 'tinker.webp' },
  { name: 'duckduckgo', src: 'duck.webp' },
  { name: 'linux', src: 'linux.webp' },
  { name: 'java', src: 'java.webp' },
];

// Define a type for the logo object for type safety
type Logo = {
  name: string;
  src: string;
};

// Define the component's props
interface LogoGuessrProps {
  onComplete: (score: number) => void;
  onClose: () => void;
}

// --- Main LogoGuessr Component ---
// This component encapsulates all the game logic and UI.
export const LogoGuessr: React.FC<LogoGuessrProps> = ({ onComplete, onClose }) => {
  // --- Game State ---
  const [score, setScore] = useState<number>(0);
  const [shuffledLogos, setShuffledLogos] = useState<Logo[]>([]);
  const [currentLogoIndex, setCurrentLogoIndex] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<string>('');
  const [feedback, setFeedback] = useState<{ message: string; color: string } | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);

  // --- Game Functions ---
  const startGame = () => {
    setScore(0);
    setCurrentLogoIndex(0);
    setFeedback(null);
    setIsGameOver(false);
    setUserGuess('');
    setInputDisabled(false);
    
    // Shuffle logos for a new game
    const newShuffledLogos = [...logos].sort(() => Math.random() - 0.5);
    setShuffledLogos(newShuffledLogos);
  };

  // Effect to start the game on initial render
  useEffect(() => {
    startGame();
  }, []);

  // Effect to check for game over and call onComplete
  useEffect(() => {
    if (currentLogoIndex >= shuffledLogos.length && shuffledLogos.length > 0) {
      setIsGameOver(true);
      onComplete(score);
    }
  }, [currentLogoIndex, shuffledLogos, score, onComplete]);

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userGuess.trim() || inputDisabled) {
      return;
    }
    
    const currentLogo = shuffledLogos[currentLogoIndex];
    const isCorrect = userGuess.trim().toLowerCase() === currentLogo.name.toLowerCase();

    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
      setFeedback({ message: 'Correct! Great job!', color: 'text-green-500' });
      setInputDisabled(true);
      
      // Move to the next logo after a short delay
      setTimeout(() => {
        setCurrentLogoIndex(prevIndex => prevIndex + 1);
        setFeedback(null);
        setUserGuess('');
        setInputDisabled(false);
      }, 1500);
    } else {
      setFeedback({ message: 'Incorrect. Try again!', color: 'text-red-500' });
    }
  };

  const currentLogo = shuffledLogos[currentLogoIndex];

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-[#f0f4f8] text-[#334155]">
      {/* Game Header */}
      <div className="flex justify-between w-full max-w-lg mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Guess the Logo</h1>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>

      {/* Main Game UI */}
      {!isGameOver && currentLogo && (
        <div className="game-card text-center max-w-lg w-full">
          <p id="score-display" className="text-xl font-semibold mb-6 text-gray-600">Score: {score}</p>
          
          <div className="w-full h-40 flex items-center justify-center mb-6">
            <img 
              id="logo-img" 
              className="max-w-full max-h-full object-contain rounded-lg border border-gray-200 bg-gray-50" 
              src={currentLogo.src} 
              alt="Logo to guess"
            />
          </div>
          
          <form onSubmit={handleGuess} className="space-y-4">
            <input 
              type="text" 
              id="guess-input" 
              className="w-full p-3 rounded-lg text-lg text-center border-2 border-gray-200 focus:outline-none focus:border-blue-500 focus:shadow-md" 
              placeholder="Type your guess here" 
              autoComplete="off"
              value={userGuess}
              onChange={(e) => setUserGuess(e.target.value)}
              disabled={inputDisabled}
            />
            <div className={`text-lg font-semibold min-h-[1.5rem] ${feedback?.color}`}>
              {feedback?.message}
            </div>
            <Button 
              type="submit" 
              className="neon-button w-full"
              disabled={inputDisabled}
            >
              Submit
            </Button>
          </form>
        </div>
      )}

      {/* Game Over UI */}
      {isGameOver && (
        <div className="game-card text-center p-8 max-w-lg w-full">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Game Over!</h2>
          <p className="text-2xl text-gray-600 mb-6">You guessed all the logos.</p>
          <p className="text-3xl font-bold text-green-500 mb-8">Final Score: {score}</p>
          <Button onClick={startGame} className="neon-button">
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};