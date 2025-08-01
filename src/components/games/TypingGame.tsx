import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TypingGameProps {
  onComplete: () => void;
  onClose: () => void;
}

export const TypingGame: React.FC<TypingGameProps> = ({ onComplete, onClose }) => {
  const [sentences, setSentences] = useState([
    "The quick brown fox jumps over the lazy dog",
    "Pack my box with five dozen liquor jugs",
    "How vexingly quick daft zebras jump",
  ]);
  
  const [currentSentence, setCurrentSentence] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [gameStarted, setGameStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const targetWPM = 40;
  const targetAccuracy = 90;

  const startGame = () => {
    setGameStarted(true);
    setStartTime(Date.now());
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const resetGame = () => {
    setCurrentSentence(0);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setWpm(0);
    setAccuracy(100);
    setGameStarted(false);
    setIsComplete(false);
  };

  const calculateStats = (input: string, target: string, timeElapsed: number) => {
    const wordsTyped = input.trim().split(' ').length;
    const timeInMinutes = timeElapsed / 60000;
    const calculatedWPM = Math.round(wordsTyped / timeInMinutes);
    
    let correctChars = 0;
    for (let i = 0; i < Math.min(input.length, target.length); i++) {
      if (input[i] === target[i]) correctChars++;
    }
    const calculatedAccuracy = Math.round((correctChars / target.length) * 100);
    
    return { wpm: calculatedWPM, accuracy: calculatedAccuracy };
  };

  useEffect(() => {
    if (!gameStarted || !startTime) return;

    const target = sentences[currentSentence];
    const timeElapsed = Date.now() - startTime;
    
    if (timeElapsed > 0) {
      const stats = calculateStats(userInput, target, timeElapsed);
      setWpm(stats.wpm);
      setAccuracy(stats.accuracy);
    }

    if (userInput === target) {
      setEndTime(Date.now());
      if (currentSentence < sentences.length - 1) {
        setTimeout(() => {
          setCurrentSentence(prev => prev + 1);
          setUserInput('');
          setStartTime(Date.now());
        }, 1000);
      } else {
        setIsComplete(true);
      }
    }
  }, [userInput, gameStarted, startTime, currentSentence, sentences]);

  useEffect(() => {
    if (isComplete && wpm >= targetWPM && accuracy >= targetAccuracy) {
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }, [isComplete, wpm, accuracy, onComplete]);

  const target = sentences[currentSentence];
  const progress = Math.round((userInput.length / target.length) * 100);
  
  const renderTextWithHighlight = () => {
    return target.split('').map((char, index) => {
      let className = 'transition-colors duration-150';
      
      if (index < userInput.length) {
        className += userInput[index] === char 
          ? ' bg-game-success/30 text-game-success' 
          : ' bg-game-danger/30 text-game-danger';
      } else if (index === userInput.length) {
        className += ' bg-game-primary/30 animate-pulse';
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  if (!gameStarted) {
    return (
      <div className="text-center space-y-6">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">⌨️ Speed Typing Challenge</h3>
          <p className="text-muted-foreground">
            Type {sentences.length} sentences with {targetWPM}+ WPM and {targetAccuracy}%+ accuracy!
          </p>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>📊 Target: {targetWPM} WPM, {targetAccuracy}% accuracy</p>
            <p>📝 {sentences.length} sentences to complete</p>
          </div>
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={startGame} className="bg-blue-500">
            Start Typing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm">
            Sentence {currentSentence + 1}/{sentences.length}
          </div>
          <div className="text-sm">
            Progress: {progress}%
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">WPM</div>
            <div className={`text-xl font-bold ${wpm >= targetWPM ? 'text-game-success' : 'text-foreground'}`}>
              {wpm}
            </div>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <div className="text-sm text-muted-foreground">Accuracy</div>
            <div className={`text-xl font-bold ${accuracy >= targetAccuracy ? 'text-game-success' : 'text-foreground'}`}>
              {accuracy}%
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted p-6 rounded-lg">
        <div className="text-lg font-mono leading-relaxed mb-4">
          {renderTextWithHighlight()}
        </div>
        
        <Input
          ref={inputRef}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Start typing..."
          className="text-lg font-mono"
          disabled={!gameStarted}
        />
      </div>

      {isComplete && (
        <div className={`p-4 rounded-lg border ${
          wpm >= targetWPM && accuracy >= targetAccuracy
            ? 'bg-gradient-to-r from-game-success/10 to-game-secondary/10 border-game-success/20'
            : 'bg-gradient-to-r from-game-warning/10 to-game-danger/10 border-game-warning/20'
        }`}>
          <h4 className={`text-lg font-bold mb-2 ${
            wpm >= targetWPM && accuracy >= targetAccuracy ? 'text-game-success' : 'text-game-warning'
          }`}>
            {wpm >= targetWPM && accuracy >= targetAccuracy ? '⌨️ Excellent Typing!' : '📝 Keep Practicing!'}
          </h4>
          <p className="text-sm text-muted-foreground">
            Final Stats: {wpm} WPM, {accuracy}% accuracy
          </p>
          {wpm >= targetWPM && accuracy >= targetAccuracy && (
            <p className="text-xs text-game-success mt-1">Ready to unlock your field!</p>
          )}
        </div>
      )}

      <div className="flex justify-center space-x-4">
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
        <Button onClick={resetGame} variant="outline">
          Restart
        </Button>
        {isComplete && wpm >= targetWPM && accuracy >= targetAccuracy && (
          <Button onClick={onComplete} className="bg-game-success text-white">
            ⌨️ Complete Challenge!
          </Button>
        )}
      </div>
    </div>
  );
};