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
  const [formPosition, setFormPosition] = useState({ x: 0, y: 0, scale: 1 });
  const [inputPositions, setInputPositions] = useState({ email: { x: 0, y: 0 }, password: { x: 0, y: 0 }, confirm: { x: 0, y: 0 } });
  const [isShaking, setIsShaking] = useState(false);
  const [scrollChaos, setScrollChaos] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [chaosLevel, setChaosLevel] = useState(1);
  const [randomColors, setRandomColors] = useState({ bg: '', text: '', border: '' });
  const [checkboxPosition, setCheckboxPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [checkboxFlee, setCheckboxFlee] = useState(false);
  const [fleeActive, setFleeActive] = useState(false);
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
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // This hook starts the checkbox movement and sets a timer to stop it.
  useEffect(() => {
    if (attempt === 2 && !isChecked) {
      setCheckboxFlee(true);
      setFleeActive(true);

      const timeoutId = setTimeout(() => {
        setCheckboxFlee(false);
        setFleeActive(false);
        setCheckboxPosition({ x: 0, y: 0 });
      }, 4000);

      // This cleanup function will stop the timer if the component unmounts
      // or if the dependencies change, preventing a memory leak.
      return () => clearTimeout(timeoutId);
    }
  }, [attempt, isChecked]);

  // This hook handles the actual movement based on the mouse position.
  // It only runs when checkboxFlee and fleeActive are true.
  useEffect(() => {
    if (attempt !== 2 || !checkboxFlee || !fleeActive || isChecked) return;

    const checkboxElement = document.getElementById('tos-checkbox');
    if (!checkboxElement) return;

    const rect = checkboxElement.getBoundingClientRect();
    const checkboxCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - checkboxCenter.x, 2) +
      Math.pow(mousePosition.y - checkboxCenter.y, 2)
    );

    if (distance < 150) {
      const fleeDistance = 100;
      const angle = Math.atan2(
        checkboxCenter.y - mousePosition.y,
        checkboxCenter.x - mousePosition.x
      );
      setCheckboxPosition({
        x: Math.cos(angle) * fleeDistance + (Math.random() - 0.5) * 50,
        y: Math.sin(angle) * fleeDistance + (Math.random() - 0.5) * 50
      });
    }
  }, [mousePosition, attempt, checkboxFlee, fleeActive, isChecked]);

  useEffect(() => {
    const currentChaosLevel = Math.min(attempt + 1, 3);
    setChaosLevel(currentChaosLevel);

    const requirementInterval = setInterval(() => {
      const randomReq = passwordRequirements[Math.floor(Math.random() * passwordRequirements.length)];
      setPasswordRequirement(randomReq);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), Math.random() * 1000 + 300);
    }, Math.max(3000 - (currentChaosLevel * 200), 1000));

    const moveInterval = setInterval(() => {
      setFormPosition({
        x: (Math.random() - 0.5) * 100 * currentChaosLevel,
        y: (Math.random() - 0.5) * 80 * currentChaosLevel,
        scale: 1
      });
    }, Math.max(5000 - (currentChaosLevel * 500), 2000));

    const inputInterval = setInterval(() => {
      setInputPositions({
        email: {
          x: (Math.random() - 0.5) * 50 * currentChaosLevel,
          y: (Math.random() - 0.5) * 30 * currentChaosLevel
        },
        password: {
          x: (Math.random() - 0.5) * 75 * currentChaosLevel,
          y: (Math.random() - 0.5) * 40 * currentChaosLevel
        },
        confirm: {
          x: (Math.random() - 0.5) * 60 * currentChaosLevel,
          y: (Math.random() - 0.5) * 30 * currentChaosLevel
        }
      });
    }, Math.max(4000 - (currentChaosLevel * 400), 1500));

    const scrollInterval = setInterval(() => {
      setScrollChaos(true);
      setTimeout(() => setScrollChaos(false), Math.random() * 2000 + 500);
    }, Math.max(10000 - (currentChaosLevel * 1500), 3000));

    const colorInterval = setInterval(() => {
      const chaosColors = ['bg-chaos-red', 'bg-chaos-orange', 'bg-chaos-yellow', 'bg-destructive', 'bg-purple-500', 'bg-green-500'];
      const textColors = ['text-white', 'text-black', 'text-chaos-red', 'text-chaos-orange', 'text-yellow-300'];
      const borderColors = ['border-chaos-red', 'border-chaos-orange', 'border-chaos-yellow', 'border-purple-500'];
      setRandomColors({
        bg: chaosColors[Math.floor(Math.random() * chaosColors.length)],
        text: textColors[Math.floor(Math.random() * textColors.length)],
        border: borderColors[Math.floor(Math.random() * borderColors.length)]
      });
    }, Math.max(8000 - (currentChaosLevel * 1000), 2000));

    return () => {
      clearInterval(requirementInterval);
      clearInterval(moveInterval);
      clearInterval(inputInterval);
      clearInterval(scrollInterval);
      clearInterval(colorInterval);
    };
  }, [attempt]);

  const handleCheckboxClick = () => {
    if (checkboxFlee && fleeActive && attempt === 2) {
      return;
    }
    setIsChecked(!isChecked);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isChecked) {
      return;
    }
    setAttempt(prev => prev + 1);
    if (attempt >= 2) {
      onNext();
    } else {
      setIsShaking(true);
      setPasswordRequirement(`ERROR: ${passwordRequirements[Math.floor(Math.random() * passwordRequirements.length)]}`);
      setPassword('');
      setConfirmPassword('');
      setIsChecked(false);
      setTimeout(() => setIsShaking(false), 1000);
    }
  };

  return (
    <div className={`min-h-screen bg-background p-4 relative overflow-hidden ${randomColors.bg}`}>
      <div className="absolute inset-0 chaos-gradient opacity-10"></div>

      {Array.from({ length: chaosLevel * 2 }).map((_, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 ${randomColors.bg} opacity-30`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${0.5 + Math.random()}s`
          }}
        />
      ))}

      <div className="max-w-md mx-auto pt-8">
        <div className={`space-y-6 transition-all duration-500 ${randomColors.text}`}
          style={{
            transform: `translate(${formPosition.x}px, ${formPosition.y}px) scale(${formPosition.scale})`,
            transition: 'transform 0.5s ease-out'
          }}
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Almost There!</h1>
            <p className="text-muted-foreground">Just a quick signup to get you started...</p>
          </div>

          <Card className={`p-6 chaos-shadow ${randomColors.border} transition-all duration-500`}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"
                style={{
                  transform: `translate(${inputPositions.email.x}px, ${inputPositions.email.y}px)`,
                  transition: 'transform 0.4s ease-out'
                }}
              >
                <Label htmlFor="email" className={`${randomColors.text}`}>
                  Email Address {attempt > 1 ? '(STOP MOVING!)' : ''} {chaosLevel > 2 ? '📧💥' : ''}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${isShaking ? `border-chaos-red ${randomColors.border}` : ''} transition-all duration-300`}
                  placeholder="your.email@example.com"
                  style={{
                    transition: 'transform 0.3s ease-out'
                  }}
                  required
                />
              </div>

              <div className="space-y-2"
                style={{
                  transform: `translate(${inputPositions.password.x}px, ${inputPositions.password.y}px)`,
                  transition: 'transform 0.4s ease-out'
                }}
              >
                <Label htmlFor="password" className={`${randomColors.text}`}>
                  Password {attempt > 1 ? '(WHY IS THIS SO HARD?)' : ''} {chaosLevel > 2 ? '🔐💀' : ''}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${isShaking ? `border-chaos-orange ${randomColors.border}` : ''} transition-all duration-300`}
                  style={{
                    transition: 'transform 0.3s ease-out'
                  }}
                  required
                />
                <p className={`${isShaking ? `text-chaos-red ${randomColors.text}` : 'text-muted-foreground'} text-xs transition-all duration-300`}>
                  {passwordRequirement} {chaosLevel > 2 ? '🤪' : ''}
                </p>
              </div>

              <div className="space-y-2"
                style={{
                  transform: `translate(${inputPositions.confirm.x}px, ${inputPositions.confirm.y}px)`,
                  transition: 'transform 0.4s ease-out'
                }}
              >
                <Label htmlFor="confirmPassword" className={`${randomColors.text}`}>
                  Confirm Password {attempt > 1 ? '(I GIVE UP!)' : ''} {chaosLevel > 2 ? '💣🆘' : ''}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`${isShaking ? `border-chaos-yellow ${randomColors.border}` : ''} transition-all duration-300`}
                  style={{
                    transition: 'transform 0.3s ease-out'
                  }}
                  required
                />
              </div>

              <div className="space-y-2 relative" style={{ transition: 'transform 0.5s ease-out' }}>
                <label className="flex items-center space-x-2">
                  <div className="relative">
                    <input
                      id="tos-checkbox"
                      type="checkbox"
                      checked={isChecked}
                      onChange={handleCheckboxClick}
                      disabled={checkboxFlee && fleeActive && attempt === 2}
                      className={`transition-all duration-300 cursor-pointer`}
                      style={{
                        transform: `translate(${checkboxPosition.x}px, ${checkboxPosition.y}px) ${checkboxFlee && fleeActive ? 'scale(1.5)' : 'scale(1)'}`,
                        transition: checkboxFlee ? 'transform 0.2s ease-out' : 'transform 0.4s ease-out'
                      }}
                    />
                  </div>
                  <span className={`text-sm ${randomColors.text} transition-all duration-300`}>
                    I agree to the{' '}
                    <span
                      className={`text-primary underline hover:text-green-500`}
                    >
                      {attempt > 1 ? 'EVIL ' : ''}Terms and Conditions{attempt > 1 ? ' OF DOOM' : ''} {chaosLevel > 2 ? '👹' : ''}
                    </span>
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                className={`w-full corporate-gradient hover:opacity-90 transition-all duration-300 ${attempt > 1 ? `bg-chaos-red ${randomColors.bg}` : ''}`}
                style={{ transition: 'transform 0.4s ease-out' }}
              >
                {attempt === 0 ? 'Create Account' :
                  attempt === 1 ? 'Try Again?' :
                  attempt === 2 ? 'PLEASE WORK!' :
                  'CHAOS REIGNS! 💀'}
              </Button>
            </form>

            {attempt > 0 && (
              <div className={`mt-4 p-3 bg-destructive/10 border border-destructive rounded-md transition-all duration-500`}
                style={{ transition: 'transform 0.4s ease-out' }}
              >
                <p className={`text-sm text-destructive ${randomColors.text}`}>
                  {attempt === 1 ? 'Oops! Something went wrong. Please try again.' :
                    attempt === 2 ? 'ERROR 404: Your patience not found.' :
                    'SYSTEM MELTDOWN IMMINENT 🔥💻☠️'}
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};