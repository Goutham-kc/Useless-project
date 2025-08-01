import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AbsurdSuccessProps {
  userName: string;
  onRestart: () => void;
}

export const AbsurdSuccess = ({ userName, onRestart }: AbsurdSuccessProps) => {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const restrictions = [
    "You may only click with your non-dominant hand",
    "All scrolling must be done counterclockwise",
    "You must say 'please' before each click",
    "Typing is limited to 23 characters per minute",
    "You cannot use the letter 'E' in any form fields",
    "All navigation must be done with eyes closed",
    "You must refresh the page every 47 seconds",
    "Only prime-numbered pixels may be clicked",
    "You agree to receive 847 marketing emails per day",
    "Your cursor is now magnetic to all buttons except the ones you want"
  ];

  if (timeLeft === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center space-y-6 max-w-md">
          <h1 className="text-3xl font-bold text-destructive">TIME'S UP!</h1>
          <p className="text-muted-foreground">
            Your 10-minute trial has expired. Please restart your journey to get another 10 minutes.
          </p>
          <Button onClick={onRestart} className="w-full">
            Restart Journey
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen success-gradient flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white success-pulse">
            🎉 SUCCESS! 🎉
          </h1>
          <p className="text-2xl text-white/90">
            Congratulations {userName || 'User'}!
          </p>
          <p className="text-lg text-white/80">
            You have successfully completed our streamlined onboarding process!
          </p>
        </div>

        {/* Timer */}
        <Card className="p-6 success-shadow bg-white/10 border-white/20">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-success-gold">
              Your Premium Trial Time Remaining:
            </h2>
            <div className="text-4xl font-mono text-white success-pulse">
              {formatTime(timeLeft)}
            </div>
            <p className="text-white/70 text-sm">
              Make the most of your exclusive 10-minute access!
            </p>
          </div>
        </Card>

        {/* Absurd Benefits */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/10 border-white/20">
            <h3 className="text-xl font-bold text-success-gold mb-4">
              Your Exclusive Benefits:
            </h3>
            <ul className="text-left space-y-2 text-white/90 text-sm">
              <li>✨ Access to 0.003% of our content</li>
              <li>🚀 Lightning-fast 56k modem speeds</li>
              <li>🎯 Targeted ads every 3.7 seconds</li>
              <li>📧 Premium spam folder integration</li>
              <li>🔐 Bank-level security (from 1987)</li>
              <li>🎮 Exclusive access to loading screens</li>
            </ul>
          </Card>

          <Card className="p-6 bg-white/10 border-white/20">
            <h3 className="text-xl font-bold text-success-gold mb-4">
              Important Usage Restrictions:
            </h3>
            <div className="text-left space-y-1 text-white/90 text-xs max-h-40 overflow-y-auto">
              {restrictions.map((restriction, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="text-success-gold">•</span>
                  <span>{restriction}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Upgrade Nonsense */}
        <Card className="p-6 bg-white/10 border-white/20">
          <h3 className="text-xl font-bold text-success-gold mb-4">
            Upgrade to Premium Plus Ultra Max Pro!
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-white/90">
            <div>
              <h4 className="font-semibold">Basic (Current)</h4>
              <p>10 minutes</p>
              <p>Free*</p>
              <p className="text-xs">*Your soul as collateral</p>
            </div>
            <div>
              <h4 className="font-semibold">Premium</h4>
              <p>11 minutes</p>
              <p>$99.99/month</p>
              <p className="text-xs">*Plus handling fees</p>
            </div>
            <div>
              <h4 className="font-semibold">Ultra Max Pro</h4>
              <p>12 minutes</p>
              <p>$999.99/second</p>
              <p className="text-xs">*Worth every penny</p>
            </div>
          </div>
        </Card>

        {/* Fake Actions */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => alert("This button doesn't actually do anything, but thanks for clicking!")}
            >
              Upgrade Now (Fake Button)
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => alert("Another fake button! You're really getting the authentic web experience.")}
            >
              Share Your Experience
            </Button>
          </div>
          
          <Button 
            onClick={onRestart}
            className="bg-white text-background hover:bg-white/90"
          >
            Start Over (The Only Real Button)
          </Button>
        </div>

        <div className="text-white/60 text-xs space-y-1">
          <p>By using this service, you agree to give us your firstborn child</p>
          <p>Side effects may include: existential dread, browser crashes, and sudden urges to delete the internet</p>
          <p>This experience was brought to you by the Department of Digital Frustration</p>
        </div>
      </div>
    </div>
  );
};