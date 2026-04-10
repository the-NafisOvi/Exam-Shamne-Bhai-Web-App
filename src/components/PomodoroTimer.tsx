import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Coffee, Brain } from "lucide-react";
import { motion } from "motion/react";

interface PomodoroTimerProps {
  onComplete: () => void;
}

export default function PomodoroTimer({ onComplete }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  const reset = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  }, [mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'work') {
        onComplete();
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('work');
        setTimeLeft(25 * 60);
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, onComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (timeLeft / (mode === 'work' ? 25 * 60 : 5 * 60)) * 100;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold font-bangla">Pomodoro Timer</h2>
        <p className="text-sm text-muted-foreground font-bangla">
          {mode === 'work' ? "25 min focus, phone dhorba na!" : "5 min break, ektu chill koro."}
        </p>
      </div>

      <Card className="relative overflow-hidden border-2 border-primary/20 max-w-xl mx-auto">
        <CardContent className="p-10 flex flex-col items-center justify-center space-y-8">
          <div className="relative w-48 h-48 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted/20"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="552.92"
                initial={{ strokeDashoffset: 552.92 }}
                animate={{ strokeDashoffset: 552.92 * (progress / 100) }}
                className="text-primary"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black tabular-nums">{formatTime(timeLeft)}</span>
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mt-1">
                {mode === 'work' ? "Focus" : "Break"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={reset}
              className="rounded-full h-12 w-12"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              onClick={() => setIsActive(!isActive)}
              className="rounded-full h-16 w-16 shadow-lg shadow-primary/20"
            >
              {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => {
                setMode(mode === 'work' ? 'break' : 'work');
                setIsActive(false);
                setTimeLeft(mode === 'work' ? 5 * 60 : 25 * 60);
              }}
              className="rounded-full h-12 w-12"
            >
              {mode === 'work' ? <Coffee className="h-5 w-5" /> : <Brain className="h-5 w-5" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className={`cursor-pointer transition-all ${mode === 'work' ? 'ring-2 ring-primary bg-primary/5' : 'opacity-50'}`} onClick={() => { setMode('work'); setTimeLeft(25 * 60); setIsActive(false); }}>
          <CardContent className="p-4 flex items-center gap-3">
            <Brain className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="text-xs font-bold uppercase">Focus</p>
              <p className="text-sm font-medium">25 Minutes</p>
            </div>
          </CardContent>
        </Card>
        <Card className={`cursor-pointer transition-all ${mode === 'break' ? 'ring-2 ring-primary bg-primary/5' : 'opacity-50'}`} onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }}>
          <CardContent className="p-4 flex items-center gap-3">
            <Coffee className="h-5 w-5 text-primary" />
            <div className="text-left">
              <p className="text-xs font-bold uppercase">Break</p>
              <p className="text-sm font-medium">5 Minutes</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
