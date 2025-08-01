import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface AbsurdSuccessProps {
  userName: string;
  onRestart: () => void;
}

export const AbsurdSuccess = ({ userName, onRestart }: AbsurdSuccessProps) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = new Audio('mm.mp3');
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
      className="min-h-screen flex flex-col items-center justify-center p-4 text-white"
      style={{
        backgroundColor: '#121212',
        backgroundImage: `url('https://media.tenor.com/aOpFNxUUTSYAAAAM/karikku-mamanodu.gif')`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="bg-black bg-opacity-70 backdrop-blur-sm rounded-lg p-6 max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">
          Congratulations {userName}!
        </h1>
        <p className="mb-6 text-lg font-semibold italic">
          Congratulation in wasting your valuable time
        </p>
        <div className="flex gap-3 justify-center">
          <Button
            onClick={toggleMute}
            className="bg-gray-700 hover:bg-gray-800 transition-colors text-xs font-semibold py-2 w-28 h-9 rounded-full"
            style={{ minWidth: '7rem' }}
          >
            {isMuted ? 'Unmute Music' : 'Mute Music'}
          </Button>
          <Button
            onClick={onRestart}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-xs font-semibold py-2 w-28 h-9 rounded-full"
            style={{ minWidth: '7rem' }}
          >
            Restart
          </Button>
        </div>
      </div>
    </div>
  );
};
