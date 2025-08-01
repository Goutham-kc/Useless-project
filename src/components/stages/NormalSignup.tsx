import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { FlappyBirdGame } from '../games/FlappyBirdGame';
import { MemoryGame } from '../games/MemoryGame';
import { ReactionGame } from '../games/ReactionGame';
import { TypingGame } from '../games/TypingGame';
import { PuzzleGame } from '../games/PuzzleGame';
import { Lock, Unlock, Gamepad2, Trophy } from 'lucide-react';

interface NormalSignupProps {
  onNext: () => void;
  onUserName: (name: string) => void;
}



export const NormalSignup: React.FC<NormalSignupProps> = ({ onNext, onUserName }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [fieldStatus, setFieldStatus] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [completedGames, setCompletedGames] = useState<string[]>([]);

  const games = {
    firstName: { component: FlappyBirdGame, title: 'Flappy Bird Challenge', icon: '🐦' },
    lastName: { component: MemoryGame, title: 'Memory Match', icon: '🧠' },
    email: { component: ReactionGame, title: 'Lightning Reflexes', icon: '⚡' },
    password: { component: TypingGame, title: 'Speed Typing', icon: '⌨️' },
    confirmPassword: { component: PuzzleGame, title: 'Number Puzzle', icon: '🧩' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUserName(formData.firstName);
    onNext();
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGameStart = (field: string) => {
    setActiveGame(field);
  };

  const handleGameComplete = (field: string) => {
    setFieldStatus(prev => ({ ...prev, [field]: true }));
    setCompletedGames(prev => [...prev, field]);
    setActiveGame(null);
  };

  const handleGameClose = () => {
    setActiveGame(null);
  };

  const renderField = (
    field: keyof typeof formData,
    label: string,
    type: string = 'text',
    placeholder: string = ''
  ) => {
    const isUnlocked = fieldStatus[field];
    const GameComponent = games[field].component;
    const gameData = games[field];

    return (
      <div className="space-y-2">
        <Label htmlFor={field} className="text-foreground font-medium">
          {label}
        </Label>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Input
              id={field}
              type={type}
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              disabled={!isUnlocked}
              className={`transition-all duration-300 ${
                isUnlocked
                  ? 'bg-background border-primary shadow-sm'
                  : 'bg-muted border-border opacity-50'
              }`}
              required
            />
            {!isUnlocked && (
              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            )}
            {isUnlocked && (
              <Unlock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-game-success animate-unlock-success" />
            )}
          </div>
          
          {!isUnlocked && (
            <Button
              type="button"
              onClick={() => handleGameStart(field)}
              className="bg-gradient-to-r from-purple-500 to-green-500 text-white font-bold py-2 px-4 rounded-full shadow-lg"
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Play {gameData.icon}
            </Button>
          )}
          
          {isUnlocked && (
            <div className="flex items-center text-game-success animate-bounce-game">
              <Trophy className="w-4 h-4 mr-1" />
              <span className="text-sm font-medium">Unlocked!</span>
            </div>
          )}
        </div>
        
        {!isUnlocked && (
          <p className="text-xs text-muted-foreground flex items-center">
            <span className="mr-1">{gameData.icon}</span>
            Complete "{gameData.title}" to unlock this field
          </p>
        )}
      </div>
    );
  };

  if (activeGame) {
    const GameComponent = games[activeGame as keyof typeof games].component;
    const gameTitle = games[activeGame as keyof typeof games].title;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-6 bg-card shadow-[var(--shadow-game)]">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">{gameTitle}</h2>
            <p className="text-muted-foreground">Complete the challenge to unlock your field!</p>
          </div>
          
          <GameComponent
            onComplete={() => handleGameComplete(activeGame)}
            onClose={handleGameClose}
          />
        </Card>
      </div>
    );
  }

  const allFieldsUnlocked = Object.values(fieldStatus).every(status => status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-green-500 flex items-center justify-center">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Unlock & Play Signup</h1>
          <p className="text-muted-foreground">
            Complete mini-games to unlock each field and create your account!
          </p>
          <div className="flex justify-center space-x-1">
            {Object.entries(fieldStatus).map(([field, unlocked]) => (
              <div
                key={field}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  unlocked ? 'bg-game-success' : 'bg-border'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="p-6 bg-card shadow-lg border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {renderField('firstName', 'First Name', 'text', 'John')}
              {renderField('lastName', 'Last Name', 'text', 'Doe')}
              {renderField('email', 'Email Address', 'email', 'john.doe@example.com')}
              {renderField('password', 'Password', 'password')}
              {renderField('confirmPassword', 'Confirm Password', 'password')}
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  required 
                  className="w-4 h-4 text-game-primary bg-background border-border rounded focus:ring-game-primary focus:ring-2" 
                />
                <span className="text-sm text-foreground">
                  I agree to the{' '}
                  <span className="text-game-primary hover:underline cursor-pointer">
                    Terms and Conditions
                  </span>
                </span>
              </label>
              
              {allFieldsUnlocked && (
                <div className="text-center p-4 bg-gradient-to-r from-game-success/10 to-game-secondary/10 rounded-lg border border-game-success/20">
                  <p className="text-sm text-game-success font-medium">
                    🎉 Congratulations! All fields unlocked!
                  </p>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              disabled={!allFieldsUnlocked}
              className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 ${
                allFieldsUnlocked
                  ? 'bg-gradient-to-r from-game-primary to-game-secondary hover:opacity-90 text-white shadow-[var(--shadow-game)] hover:scale-105'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {allFieldsUnlocked ? (
                <>
                  <Trophy className="w-4 h-4 mr-2" />
                  Create Account
                </>
              ) : (
                `Unlock ${5 - completedGames.length} more fields`
              )}
            </Button>
          </form>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            🎮 Gaming meets productivity - make form filling fun!
          </p>
        </div>
      </div>
    </div>
  );
};