import React, { useState, useEffect } from 'react';
import { Trophy, Clock, RotateCcw } from 'lucide-react';

interface EndScreenProps {
  onRestart: () => void;
}

export const EndScreen: React.FC<EndScreenProps> = ({ onRestart }) => {
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [showCongrats, setShowCongrats] = useState(true);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    const congratsTimer = setTimeout(() => {
      setShowCongrats(false);
    }, 5000);
    
    return () => clearTimeout(congratsTimer);
  }, []);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center text-white">
        {showCongrats && (
          <div className="animate-bounce mb-8">
            <Trophy className="w-24 h-24 mx-auto text-yellow-300 mb-4" />
            <h1 className="text-5xl font-bold mb-4">🎉 CONGRATULATIONS! 🎉</h1>
            <p className="text-xl">You've successfully escaped the digital bureaucracy!</p>
          </div>
        )}
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6">
            You're now legally free to use our site!
          </h2>
          
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6 animate-pulse">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-6 h-6" />
              <span className="text-2xl font-mono">{formatTime(timeRemaining)}</span>
            </div>
            <p className="text-sm">Time remaining on your license</p>
          </div>
          
          {timeRemaining === 0 && (
            <div className="bg-black text-red-400 p-4 rounded-lg mb-6 animate-pulse">
              <h3 className="text-xl font-bold mb-2">⏰ LICENSE EXPIRED ⏰</h3>
              <p className="text-sm">
                Your 10-minute usage license has expired. 
                Please complete the process again to continue using our site.
              </p>
            </div>
          )}
          
          <div className="grid md:grid-cols-2 gap-4 mb-8 text-sm">
            <div className="bg-white/5 rounded p-4">
              <h4 className="font-bold mb-2">What you can do:</h4>
              <ul className="text-left space-y-1">
                <li>• Browse 3 pages maximum</li>
                <li>• Click up to 47 buttons</li>
                <li>• Scroll vertically only</li>
                <li>• Use Comic Sans font</li>
              </ul>
            </div>
            
            <div className="bg-white/5 rounded p-4">
              <h4 className="font-bold mb-2">Restrictions:</h4>
              <ul className="text-left space-y-1">
                <li>• No right-clicking allowed</li>
                <li>• Horizontal scrolling forbidden</li>
                <li>• No screenshots permitted</li>
                <li>• Must agree to 12 more pop-ups</li>
              </ul>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-lg font-semibold">
              Thank you for experiencing the future of user interfaces! 🚀
            </p>
            
            <p className="text-sm opacity-80">
              * This experience was brought to you by the Department of Digital Frustration
            </p>
            
            <button
              onClick={onRestart}
              className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
            >
              <RotateCcw className="w-5 h-5" />
              Experience Again
            </button>
          </div>
        </div>
        
        <div className="text-xs opacity-60 space-y-1">
          <p>© 2025 UXtreme Challenge Inc. All rights temporarily reserved.</p>
          <p>Side effects may include: confusion, laughter, existential dread, and improved appreciation for good UX.</p>
          <p>Not recommended for users with heart conditions, UX designers, or anyone with common sense.</p>
        </div>
      </div>
    </div>
  );
};