import React from 'react';
import { ArrowRight, Shield, Zap } from 'lucide-react';

interface LandingPageProps {
  onContinue: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center text-white">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4 animate-pulse">
            🎯 UXtreme Challenge
          </h1>
          <p className="text-xl opacity-90 mb-8">
            The world's most "innovative" user experience awaits you!
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <Shield className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
            <h3 className="text-lg font-semibold mb-2">100% Secure*</h3>
            <p className="text-sm opacity-80">*Security not guaranteed</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <Zap className="w-12 h-12 mx-auto mb-4 text-green-300" />
            <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm opacity-80">Loading times may vary</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <div className="text-4xl mb-4">🎮</div>
            <h3 className="text-lg font-semibold mb-2">Gamified Experience</h3>
            <p className="text-sm opacity-80">You'll see what we mean</p>
          </div>
        </div>
        
        <button
          onClick={onContinue}
          className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 mx-auto"
        >
          Begin Your Journey
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <p className="text-xs opacity-60 mt-8">
          By continuing, you agree to experience the future of web design
        </p>
      </div>
    </div>
  );
};