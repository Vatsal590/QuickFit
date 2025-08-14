import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ExerciseTimerProps {
  duration: number; // in seconds
  onComplete?: () => void;
  autoStart?: boolean;
  className?: string;
}

const ExerciseTimer = ({ duration, onComplete, autoStart = false, className = "" }: ExerciseTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0 && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsCompleted(true);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, isCompleted, onComplete]);

  const handlePlayPause = () => {
    if (isCompleted) return;
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTimeLeft(duration);
    setIsRunning(false);
    setIsCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className={`flex items-center gap-3 p-3 border rounded-lg bg-white ${className}`}>
      {/* Timer Display */}
      <div className="flex flex-col items-center">
        <div className="relative w-16 h-16">
          {/* Progress Circle */}
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="4"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="none"
              stroke={isCompleted ? "#10b981" : "#3b82f6"}
              strokeWidth="4"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          
          {/* Time Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-sm font-bold ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handlePlayPause}
          disabled={isCompleted}
          className="flex items-center gap-1"
        >
          {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isRunning ? 'Pause' : 'Play'}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={handleReset}
          className="flex items-center gap-1"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ExerciseTimer;