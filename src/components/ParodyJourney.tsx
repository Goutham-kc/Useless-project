import { useState } from 'react';
import { LandingPage } from './stages/LandingPage';
import { ChaosSignup } from './stages/ChaosSignup';
import { NormalSignup } from './stages/NormalSignup';
import { TermsEscapeGame } from './stages/TermsEscapeGame';
import { AbsurdSuccess } from './stages/AbsurdSuccess';

export type ParodyStage = 'landing' | 'chaos' | 'normal' | 'game' | 'success';

const ParodyJourney = () => {
  const [currentStage, setCurrentStage] = useState<ParodyStage>('landing');
  const [userName, setUserName] = useState('');

  const nextStage = () => {
    switch (currentStage) {
      case 'landing':
        setCurrentStage('chaos');
        break;
      case 'chaos':
        setCurrentStage('normal');
        break;
      case 'normal':
        setCurrentStage('game');
        break;
      case 'game':
        setCurrentStage('success');
        break;
      default:
        setCurrentStage('landing');
    }
  };

  const restart = () => {
    setCurrentStage('landing');
    setUserName('');
  };

  const handleUserName = (name: string) => {
    setUserName(name);
  };

  return (
    <div className="min-h-screen">
      {currentStage === 'landing' && (
        <LandingPage onNext={nextStage} />
      )}
      {currentStage === 'chaos' && (
        <ChaosSignup onNext={nextStage} />
      )}
      {currentStage === 'normal' && (
        <NormalSignup onNext={nextStage} onUserName={handleUserName} />
      )}
      {currentStage === 'game' && (
        <TermsEscapeGame onNext={nextStage} />
      )}
      {currentStage === 'success' && (
        <AbsurdSuccess userName={userName} onRestart={restart} />
      )}
    </div>
  );
};

export default ParodyJourney;