import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AbsurdSuccessProps {
  userName: string;
  onRestart: () => void;
}

export const AbsurdSuccess = ({ userName, onRestart }: AbsurdSuccessProps) => {
  const [isMuted, setIsMuted] = useState(false);
  
  useEffect(() => {
    const audio = new Audio('');
    audio.loop = true;
    audio.muted = isMuted;
    audio.play().catch((error) => console.error('Audio playback failed:', error));
    
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('https://media.tenor.com/aOpFNxUUTSYAAAAM/karikku-mamanodu.gif')`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
    </div>
  );
};