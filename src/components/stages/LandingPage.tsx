import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LandingPageProps {
  onNext: () => void;
}

export const LandingPage = ({ onNext }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-6xl font-bold tracking-tight">
            Welcome to{' '}
            <span className="corporate-gradient bg-clip-text text-transparent">
              UXHell
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The revolutionary platform that's definitely not going to waste your time 
            with unnecessary steps, confusing forms, or endless agreements.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="p-6 corporate-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 corporate-gradient rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h3 className="font-semibold">Lightning Fast</h3>
              <p className="text-sm text-muted-foreground">
                Sign up in just 47 easy steps! Our streamlined process ensures maximum efficiency.*
              </p>
            </div>
          </Card>

          <Card className="p-6 corporate-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 corporate-gradient rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">🔒</span>
              </div>
              <h3 className="font-semibold">Ultra Secure</h3>
              <p className="text-sm text-muted-foreground">
                Your password must contain at least 73 characters, including hieroglyphs and emotions.
              </p>
            </div>
          </Card>

          <Card className="p-6 corporate-shadow">
            <div className="space-y-3">
              <div className="w-12 h-12 corporate-gradient rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">📋</span>
              </div>
              <h3 className="font-semibold">Simple Terms</h3>
              <p className="text-sm text-muted-foreground">
                Our terms and conditions are only 50,000 pages long. We've made them fun and interactive!
              </p>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <div className="space-y-4 mt-12">
          <Button 
            size="lg" 
            className="corporate-gradient hover:opacity-90 text-lg px-8 py-3"
            onClick={onNext}
          >
            Start Your Amazing Journey
          </Button>
          <p className="text-xs text-muted-foreground">
            *Speed may vary. Journey length not guaranteed. Side effects may include frustration, 
            confusion, and the inexplicable urge to close your browser.
          </p>
        </div>

        {/* Fake testimonials */}
        <div className="mt-16 space-y-4">
          <h2 className="text-2xl font-semibold">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <Card className="p-4">
              <p className="italic">"I thought I was signing up for a simple service, but I got so much more! Like a headache and existential dread."</p>
              <p className="mt-2 font-medium">- Sarah K.</p>
            </Card>
            <Card className="p-4">
              <p className="italic">"The signup process was so memorable, I'm still having flashbacks 3 months later!"</p>
              <p className="mt-2 font-medium">- Mike R.</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};