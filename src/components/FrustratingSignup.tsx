import React, { useState, useEffect, useRef } from 'react';
import { FormData } from '../types';

interface FrustratingSignupProps {
  onFail: () => void;
}

export const FrustratingSignup: React.FC<FrustratingSignupProps> = ({ onFail }) => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
    newsletter: false
  });
  
  const [passwordRequirements, setPasswordRequirements] = useState([
    'At least 8 characters',
    'One uppercase letter'
  ]);
  
  const [currentFocus, setCurrentFocus] = useState<string>('');
  const [isScrolling, setIsScrolling] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  // Chaotic input jumping
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const inputs = ['email', 'password', 'confirmPassword'];
        const randomInput = inputs[Math.floor(Math.random() * inputs.length)];
        document.getElementById(randomInput)?.focus();
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Evolving password requirements
  useEffect(() => {
    if (formData.password.length > 0) {
      const newReqs = [...passwordRequirements];
      
      if (!newReqs.includes('One number') && formData.password.length > 3) {
        newReqs.push('One number');
      }
      if (!newReqs.includes('Include a Greek letter') && formData.password.length > 6) {
        newReqs.push('Include a Greek letter');
      }
      if (!newReqs.includes('Must rhyme with your name') && formData.password.length > 10) {
        newReqs.push('Must rhyme with your name');
      }
      if (!newReqs.includes('Contains your mothers maiden name') && formData.password.length > 15) {
        newReqs.push('Contains your mothers maiden name');
      }
      
      setPasswordRequirements(newReqs);
    }
  }, [formData.password]);
  
  // Uncontrollable scrolling on hover
  const handleMouseEnter = () => {
    setIsScrolling(true);
    if (formRef.current) {
      const scrollInterval = setInterval(() => {
        window.scrollBy(0, Math.sin(Date.now() / 100) * 5);
      }, 50);
      
      timeoutRef.current = setTimeout(() => {
        clearInterval(scrollInterval);
        setIsScrolling(false);
      }, 3000);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Always fail on first attempt
    setTimeout(() => {
      onFail();
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-red-50 py-8">
      <div 
        ref={formRef}
        className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8"
        onMouseEnter={handleMouseEnter}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-red-600">
          🚨 Quick Signup! 🚨
        </h2>
        
        {isScrolling && (
          <div className="bg-yellow-200 p-2 rounded mb-4 text-xs animate-bounce">
            ⚠️ Form is experiencing technical difficulties
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email*</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              onFocus={() => setCurrentFocus('email')}
              className={`w-full p-2 border rounded transition-all duration-300 ${
                currentFocus === 'email' ? 'border-blue-500 transform rotate-1' : 'border-gray-300'
              }`}
              placeholder={currentFocus === 'email' ? 'Type faster! ⏱️' : 'your@email.com'}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password*</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              onFocus={() => setCurrentFocus('password')}
              className={`w-full p-2 border rounded transition-all duration-300 ${
                currentFocus === 'password' ? 'border-red-500 animate-pulse' : 'border-gray-300'
              }`}
              required
            />
            
            <div className="mt-2 space-y-1">
              <p className="text-xs font-semibold text-gray-700">Password must include:</p>
              {passwordRequirements.map((req, index) => (
                <p key={index} className={`text-xs ${
                  index < 2 ? 'text-green-600' : 'text-red-500 animate-pulse'
                }`}>
                  • {req}
                </p>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password*</label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              onFocus={() => setCurrentFocus('confirmPassword')}
              className={`w-full p-2 border rounded transition-all duration-300 ${
                currentFocus === 'confirmPassword' ? 'border-purple-500 transform -rotate-1' : 'border-gray-300'
              }`}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.terms}
                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.checked }))}
                className="transform scale-150"
                required
              />
              <span className="text-xs">I agree to the 847-page terms and conditions*</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.newsletter}
                onChange={(e) => setFormData(prev => ({ ...prev, newsletter: e.target.checked }))}
                className="transform scale-150"
              />
              <span className="text-xs animate-bounce">Subscribe to our daily newsletter (47 emails/day)</span>
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded font-bold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 animate-pulse"
          >
            🎯 SIGN UP NOW! 🎯
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 animate-bounce">
            *Required fields subject to change without notice
          </p>
        </div>
      </div>
    </div>
  );
};