import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AbsurdSuccessProps {
  userName: string;
  onRestart: () => void;
}

export const AbsurdSuccess = ({ userName, onRestart }: AbsurdSuccessProps) => {
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
  };