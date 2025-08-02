import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface ChaosSignupProps {
  onNext: () => void;
}

export const ChaosSignup = ({ onNext }: ChaosSignupProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordRequirement, setPasswordRequirement] = useState('Password must be at least 8 characters');
  const [formPosition, setFormPosition] = useState({ x: 0, y: 0, rotation: 0, scale: 1 });
  const [inputPositions, setInputPositions] = useState({ email: { x: 0, y: 0 }, password: { x: 0, y: 0 }, confirm: { x: 0, y: 0 } });
  const [isShaking, setIsShaking] = useState(false);
  const [scrollChaos, setScrollChaos] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [chaosLevel, setChaosLevel] = useState(1);
  const [randomColors, setRandomColors] = useState({ bg: '', text: '', border: '' });
  const [chaosPaused, setChaosPaused] = useState(false);
  const [checkboxPosition, setCheckboxPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [checkboxFlee, setCheckboxFlee] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const passwordRequirements = [
    'Password must be at least 8 characters',
    'Password must contain at least 2 uppercase letters',
    'Password must include 3 numbers and a special character',
    'Password must contain at least one emoji',
    'Password must include the current month in Roman numerals',
    'Password must contain the square root of 144',
    'Password must include your favorite childhood pet\'s maiden name',
    'Password must contain at least one hieroglyph',
    'Password must include the meaning of life (hint: it\'s 42)',
    'Password must be written in ancient Latin',
    'Password must contain the sound a tree makes when nobody is listening'
  ];

  useEffect(() => {
    // Mouse tracking for checkbox flee behavior
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    // Checkbox flee logic
    if (chaosPaused && !isChecked) {
      const checkboxElement = document.getElementById('tos-checkbox');
      if (checkboxElement) {
        const rect = checkboxElement.getBoundingClientRect();
        const checkboxCenter = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        };

        const distance = Math.sqrt(
          Math.pow(mousePosition.x - checkboxCenter.x, 2) + 
          Math.pow(mousePosition.y - checkboxCenter.y, 2)
        );

        // If mouse is within 100px of checkbox, make it flee
        if (distance < 100) {
          setCheckboxFlee(true);
          const fleeDistance = 150;
          const angle = Math.atan2(
            checkboxCenter.y - mousePosition.y,
            checkboxCenter.x - mousePosition.x
          );
          
          setCheckboxPosition({
            x: Math.cos(angle) * fleeDistance + (Math.random() - 0.5) * 100,
            y: Math.sin(angle) * fleeDistance + (Math.random() - 0.5) * 100
          });
        } else if (distance > 200) {
          // Reset position when mouse is far away
          setCheckboxFlee(false);
          setCheckboxPosition({ x: 0, y: 0 });
        }
      }
    }
  }, [mousePosition, chaosPaused, isChecked]);

  useEffect(() => {
    if (chaosPaused) return; // Don't run chaos when paused

    // Escalating chaos based on attempts
    const currentChaosLevel = Math.min(attempt + 1, 5);
    setChaosLevel(currentChaosLevel);

    // Change password requirements randomly (more frequent as chaos increases)
    const requirementInterval = setInterval(() => {
      const randomReq = passwordRequirements[Math.floor(Math.random() * passwordRequirements.length)];
      setPasswordRequirement(randomReq);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), Math.random() * 1000 + 300);
    }, Math.max(1000 - (currentChaosLevel * 200), 300));

    // Move entire form around randomly (more chaotic as level increases)
    const moveInterval = setInterval(() => {
      setFormPosition({
        x: (Math.random() - 0.5) * 300 * currentChaosLevel,
        y: (Math.random() - 0.5) * 200 * currentChaosLevel,
        rotation: (Math.random() - 0.5) * 20 * currentChaosLevel,
        scale: 0.8 + Math.random() * 0.4 * currentChaosLevel
      });
    }, Math.max(3000 - (currentChaosLevel * 500), 500));

    // Move individual inputs randomly
    const inputInterval = setInterval(() => {
      setInputPositions({
        email: {
          x: (Math.random() - 0.5) * 100 * currentChaosLevel,
          y: (Math.random() - 0.5) * 50 * currentChaosLevel
        },
        password: {
          x: (Math.random() - 0.5) * 150 * currentChaosLevel,
          y: (Math.random() - 0.5) * 80 * currentChaosLevel
        },
        confirm: {
          x: (Math.random() - 0.5) * 120 * currentChaosLevel,
          y: (Math.random() - 0.5) * 60 * currentChaosLevel
        }
      });
    }, Math.max(2000 - (currentChaosLevel * 300), 400));

    // Trigger random scroll chaos (more frequent at higher chaos)
    const scrollInterval = setInterval(() => {
      setScrollChaos(true);
      setTimeout(() => setScrollChaos(false), Math.random() * 2000 + 500);
    }, Math.max(6000 - (currentChaosLevel * 1000), 1500));

    // Random color changes for maximum chaos
    const colorInterval = setInterval(() => {
      const chaosColors = ['bg-chaos-red', 'bg-chaos-orange', 'bg-chaos-yellow', 'bg-destructive', 'bg-purple-500', 'bg-green-500'];
      const textColors = ['text-white', 'text-black', 'text-chaos-red', 'text-chaos-orange', 'text-yellow-300'];
      const borderColors = ['border-chaos-red', 'border-chaos-orange', 'border-chaos-yellow', 'border-purple-500'];
      
      setRandomColors({
        bg: chaosColors[Math.floor(Math.random() * chaosColors.length)],
        text: textColors[Math.floor(Math.random() * textColors.length)],
        border: borderColors[Math.floor(Math.random() * borderColors.length)]
      });
    }, Math.max(4000 - (currentChaosLevel * 600), 800));

    return () => {
      clearInterval(requirementInterval);
      clearInterval(moveInterval);
      clearInterval(inputInterval);
      clearInterval(scrollInterval);
      clearInterval(colorInterval);
    };
  }, [attempt, chaosPaused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChecked) {
      alert("You must agree to the terms first! (Good luck clicking that checkbox 😈)");
      return;
    }
    
    setAttempt(prev => prev + 1);
    
    if (attempt >= 2) {
      // After 3 attempts, move to normal signup
      onNext();
    } else {
      // Shake everything and show error
      setIsShaking(true);
      setPasswordRequirement(`ERROR: ${passwordRequirements[Math.floor(Math.random() * passwordRequirements.length)]}`);
      // Clear the form to be extra annoying
      setPassword('');
      setConfirmPassword('');
      setIsChecked(false); // Uncheck the box too!
      setTimeout(() => setIsShaking(false), 1000);
    }
  };

  const handleTosClick = () => {
    setChaosPaused(!chaosPaused);
    if (!chaosPaused) {
      alert("CHAOS PAUSED! Now try to click that checkbox... 📦💨");
    } else {
      alert("CHAOS RESUMED! The madness continues! 🎪");
    }
  };

  const handleCheckboxClick = () => {
    if (checkboxFlee) {
      // Make it even more dramatic when they try to click while it's fleeing
      setCheckboxPosition({
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 200
      });
      alert("Ha! You thought you could catch me? 🏃‍♂️💨");
    } else {
      setIsChecked(!isChecked);
      if (!isChecked) {
        alert("Finally! You managed to check the box! 🎉");
      }
    }
  };

  return (
    <div className={`min-h-screen bg-background p-4 relative overflow-hidden ${scrollChaos ? 'animate-bounce-chaos' : ''} ${randomColors.bg}`}>
      {/* Chaotic background elements */}
      <div className="absolute inset-0 chaos-gradient opacity-10 animate-glitch"></div>
      
      {/* Random floating chaos elements */}
      {Array.from({ length: chaosLevel * 3 }).map((_, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 ${randomColors.bg} animate-bounce-chaos opacity-30`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.5 + Math.random()}s`
          }}
        />
      ))}
      
      <div className="max-w-md mx-auto pt-8">
        {chaosPaused && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-md text-center">
            <p className="text-sm text-green-700 font-medium">
              ⏸️ CHAOS PAUSED - Now catch that checkbox! 🎯
            </p>
          </div>
        )}
        
        <div className={`space-y-6 transition-all duration-300 ${isShaking ? 'chaos-shake' : ''} ${randomColors.text}`} 
             style={{ 
               transform: chaosPaused ? 'translate(0px, 0px) rotate(0deg) scale(1)' : `translate(${formPosition.x}px, ${formPosition.y}px) rotate(${formPosition.rotation}deg) scale(${formPosition.scale})`,
               transition: 'transform 0.3s ease-out'
             }}>
          
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Almost There!</h1>
            <p className="text-muted-foreground">Just a quick signup to get you started...</p>
          </div>

          <Card className={`p-6 chaos-shadow ${randomColors.border} transition-all duration-300`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2" 
                   style={{ 
                     transform: chaosPaused ? 'translate(0px, 0px)' : `translate(${inputPositions.email.x}px, ${inputPositions.email.y}px)`,
                     transition: 'transform 0.2s ease-out'
                   }}>
                <Label htmlFor="email" className={`${attempt > 0 ? 'animate-jump' : ''} ${randomColors.text}`}>
                  Email Address {attempt > 1 ? '(STOP MOVING!)' : ''} {chaosLevel > 3 ? '📧💥' : ''}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${attempt > 0 ? 'chaos-jump' : ''} ${isShaking ? `border-chaos-red ${randomColors.border}` : ''} transition-all duration-200`}
                  placeholder="your.email@example.com"
                  style={{
                    transform: chaosPaused ? 'rotate(0deg)' : `rotate(${(Math.random() - 0.5) * chaosLevel * 5}deg)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                  required
                />
              </div>

              <div className="space-y-2"
                   style={{ 
                     transform: chaosPaused ? 'translate(0px, 0px)' : `translate(${inputPositions.password.x}px, ${inputPositions.password.y}px)`,
                     transition: 'transform 0.2s ease-out'
                   }}>
                <Label htmlFor="password" className={`${attempt > 0 ? 'animate-shake' : ''} ${randomColors.text}`}>
                  Password {attempt > 1 ? '(WHY IS THIS SO HARD?)' : ''} {chaosLevel > 2 ? '🔐💀' : ''}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${attempt > 0 ? 'animate-glitch' : ''} ${isShaking ? `border-chaos-orange ${randomColors.border}` : ''} transition-all duration-200`}
                  style={{
                    transform: chaosPaused ? 'rotate(0deg) scale(1)' : `rotate(${(Math.random() - 0.5) * chaosLevel * 8}deg) scale(${0.9 + Math.random() * 0.2})`,
                    transition: 'transform 0.1s ease-out'
                  }}
                  required
                />
                <p className={`text-xs ${isShaking ? `text-chaos-red animate-shake ${randomColors.text}` : 'text-muted-foreground'} transition-all duration-200`}>
                  {passwordRequirement} {chaosLevel > 3 ? '🤪' : ''}
                </p>
              </div>

              <div className="space-y-2"
                   style={{ 
                     transform: chaosPaused ? 'translate(0px, 0px)' : `translate(${inputPositions.confirm.x}px, ${inputPositions.confirm.y}px)`,
                     transition: 'transform 0.2s ease-out'
                   }}>
                <Label htmlFor="confirmPassword" className={`${attempt > 1 ? 'animate-bounce-chaos' : ''} ${randomColors.text}`}>
                  Confirm Password {attempt > 2 ? '(I GIVE UP!)' : ''} {chaosLevel > 4 ? '💣🆘' : ''}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${attempt > 1 ? 'animate-jump' : ''} ${isShaking ? `border-chaos-yellow ${randomColors.border}` : ''} transition-all duration-200`}
                  style={{
                    transform: chaosPaused ? 'rotate(0deg)' : `rotate(${(Math.random() - 0.5) * chaosLevel * 10}deg)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                  required
                />
              </div>

              <div className="space-y-2 relative" 
                   style={{
                     transform: chaosPaused ? 'rotate(0deg)' : `rotate(${(Math.random() - 0.5) * chaosLevel * 3}deg)`,
                     transition: 'transform 0.3s ease-out'
                   }}>
                <label className="flex items-center space-x-2">
                  <div className="relative">
                    <input 
                      id="tos-checkbox"
                      type="checkbox" 
                      checked={isChecked}
                      onChange={handleCheckboxClick}
                      className={`${attempt > 0 ? 'animate-bounce-chaos' : ''} transition-all duration-200 cursor-pointer`}
                      style={{
                        transform: `translate(${checkboxPosition.x}px, ${checkboxPosition.y}px) scale(${0.8 + Math.random() * 0.4 * chaosLevel})`,
                        transition: checkboxFlee ? 'transform 0.1s ease-out' : 'transform 0.3s ease-out'
                      }}
                    />
                    {checkboxFlee && (
                      <div className="absolute -top-8 left-0 text-xs bg-chaos-red text-white px-2 py-1 rounded animate-bounce">
                        Catch me! 🏃‍♂️
                      </div>
                    )}
                  </div>
                  <span className={`text-sm ${attempt > 1 ? 'animate-glitch' : ''} ${randomColors.text} transition-all duration-200`}>
                    I agree to the{' '}
                    <span 
                      className={`text-primary underline cursor-pointer ${chaosLevel > 2 ? 'animate-shake' : ''} hover:text-green-500`}
                      onClick={handleTosClick}
                    >
                      {attempt > 1 ? 'EVIL ' : ''}Terms and Conditions{attempt > 1 ? ' OF DOOM' : ''} {chaosLevel > 3 ? '👹' : ''} {chaosPaused ? '⏸️' : ''}
                    </span>
                  </span>
                </label>
              </div>

              <Button 
                type="submit" 
                className={`w-full corporate-gradient hover:opacity-90 transition-all duration-200 ${
                  attempt > 0 ? 'animate-shake' : ''
                } ${attempt > 1 ? `bg-chaos-red ${randomColors.bg}` : ''}`}
                style={{
                  transform: `rotate(${(Math.random() - 0.5) * chaosLevel * 5}deg) scale(${0.9 + Math.random() * 0.2})`,
                  transition: 'transform 0.2s ease-out'
                }}
              >
                {attempt === 0 ? 'Create Account' : 
                 attempt === 1 ? 'Try Again?' : 
                 attempt === 2 ? 'PLEASE WORK!' :
                 'CHAOS REIGNS! 💀'}
              </Button>
            </form>

            {attempt > 0 && (
              <div className={`mt-4 p-3 bg-destructive/10 border border-destructive rounded-md transition-all duration-300 ${randomColors.bg}`}
                   style={{
                     transform: `rotate(${(Math.random() - 0.5) * chaosLevel * 3}deg)`,
                     transition: 'transform 0.2s ease-out'
                   }}>
                <p className={`text-sm text-destructive animate-shake ${randomColors.text}`}>
                  {attempt === 1 ? 'Oops! Something went wrong. Please try again.' :
                   attempt === 2 ? 'ERROR 404: Your patience not found.' :
                   'SYSTEM MELTDOWN IMMINENT 🔥💻☠️'}
                </p>
              </div>
            )}
          </Card>

          {/* Fake loading bars and popups with extreme chaos */}
          {attempt > 1 && (
            <Card className={`p-4 animate-bounce-chaos transition-all duration-300 ${randomColors.bg} ${randomColors.border}`}
                  style={{
                    transform: `rotate(${(Math.random() - 0.5) * chaosLevel * 8}deg) scale(${0.8 + Math.random() * 0.4})`,
                    transition: 'transform 0.3s ease-out'
                  }}>
              <div className="space-y-2">
                <p className={`text-sm font-medium ${randomColors.text} animate-glitch`}>
                  Loading your frustration... {chaosLevel > 3 ? '😈💥🔥' : ''}
                </p>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="chaos-gradient h-2 rounded-full animate-pulse" 
                    style={{
                      width: `${Math.random() * 100}%`,
                      transition: 'width 0.5s ease-out'
                    }}
                  ></div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};