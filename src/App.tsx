import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { FrustratingSignup } from './components/FrustratingSignup';
import { NormalSignup } from './components/NormalSignup';
import { EscapeGame } from './components/EscapeGame';
import { EndScreen } from './components/EndScreen';

type AppState = 'landing' | 'frustrating-signup' | 'failed-signup' | 'normal-signup' | 'game' | 'end';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing');

  const handleLandingContinue = () => {
    setCurrentState('frustrating-signup');
  };

  const handleSignupFail = () => {
    setCurrentState('failed-signup');
    // Auto transition to normal signup after showing the error
    setTimeout(() => {
      setCurrentState('normal-signup');
    }, 3000);
  };

  const handleSignupSuccess = () => {
    setCurrentState('game');
  };

  const handleGameComplete = () => {
    setCurrentState('end');
  };

  const handleRestart = () => {
    setCurrentState('landing');
  };

  const renderCurrentState = () => {
    switch (currentState) {
      case 'landing':
        return <LandingPage onContinue={handleLandingContinue} />;
      
      case 'frustrating-signup':
        return <FrustratingSignup onFail={handleSignupFail} />;
      
      case 'failed-signup':
        return (
          <div className="min-h-screen bg-red-600 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-6xl mb-4 animate-pulse">💥</div>
              <h2 className="text-3xl font-bold mb-4">SYSTEM ERROR</h2>
              <p className="text-xl mb-2">Failed to process your signup!</p>
              <p className="text-sm opacity-80">Redirecting to backup system...</p>
              <div className="mt-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              </div>
            </div>
          </div>
        );
      
      case 'normal-signup':
        return <NormalSignup onSuccess={handleSignupSuccess} />;
      
      case 'game':
        return <EscapeGame onComplete={handleGameComplete} />;
      
      case 'end':
        return <EndScreen onRestart={handleRestart} />;
      
      default:
        return <LandingPage onContinue={handleLandingContinue} />;
    }
  };

  return (
    <div className="App">
      {renderCurrentState()}
    </div>
  );
}

export default App;