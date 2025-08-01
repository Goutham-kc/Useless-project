import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LandingPageProps {
  onNext: () => void;
}

export const LandingPage = ({ onNext }: LandingPageProps) => {
  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="text-center space-y-8 max-w-2xl mx-auto px-6">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-white drop-shadow-lg">
            Welcome to our Useless Project
          </h1>
          <p className="text-xl text-white/90">
            Sometimes the most useless things bring the most joy
          </p>
        </div>
        <button onClick={onNext} className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-white/90 hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg">
          Let's start
        </button>
      </div>
    </div>
  );
};