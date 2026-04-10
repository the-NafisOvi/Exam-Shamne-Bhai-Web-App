import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

interface PomodoroTimerProps {
  onComplete: (isBreak: boolean) => void;
}

export default function PomodoroTimer({ onComplete }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete(isBreak);
      if (!isBreak) {
        setIsBreak(true);
        setTimeLeft(5 * 60);
      } else {
        setIsBreak(false);
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isBreak, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = isBreak 
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100 
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="max-w-md mx-auto space-y-8 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-black font-bangla tracking-tight">ফোকাস টাইমার</h2>
        <p className="text-muted-foreground font-bangla">একটা কাজে মন দাও ভাই! 🎯</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="rounded-[3rem] border-none soft-shadow-lg overflow-hidden relative">
          <div className={`absolute inset-0 opacity-10 ${isBreak ? 'bg-green-500' : 'bg-primary'}`} />
          <CardContent className="p-12 flex flex-col items-center space-y-8 relative z-10">
            <div className="flex bg-muted/50 p-1 rounded-2xl w-full max-w-[240px]">
              <button 
                onClick={() => {
                  setIsActive(false);
                  setIsBreak(false);
                  setTimeLeft(25 * 60);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${!isBreak ? 'bg-white dark:bg-card soft-shadow text-primary' : 'text-muted-foreground'}`}
              >
                সেশন (২৫মি)
              </button>
              <button 
                onClick={() => {
                  setIsActive(false);
                  setIsBreak(true);
                  setTimeLeft(5 * 60);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all ${isBreak ? 'bg-white dark:bg-card soft-shadow text-green-500' : 'text-muted-foreground'}`}
              >
                ব্রেক (৫মি)
              </button>
            </div>

            <div className="relative w-64 h-64 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-muted/20"
                />
                <motion.circle
                  cx="128"
                  cy="128"
                  r="120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray="753.98"
                  initial={{ strokeDashoffset: 753.98 }}
                  animate={{ strokeDashoffset: 753.98 - (753.98 * progress) / 100 }}
                  transition={{ duration: 1, ease: "linear" }}
                  className={isBreak ? "text-green-500" : "text-primary"}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  key={timeLeft}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-6xl font-black tracking-tighter text-foreground"
                >
                  {formatTime(timeLeft)}
                </motion.span>
                <Badge variant={isBreak ? "outline" : "secondary"} className="mt-2 rounded-full px-4 py-1 font-black uppercase tracking-widest text-[10px]">
                  {isBreak ? "ব্রেক টাইম! ☕" : "পড়াশোনা চলছে... ✍️"}
                </Badge>
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <Button 
                onClick={toggleTimer} 
                className={`flex-1 h-16 rounded-2xl text-lg font-black soft-shadow transition-all active:scale-95 ${isActive ? 'bg-muted text-foreground hover:bg-muted/80' : ''}`}
              >
                {isActive ? (
                  <><Pause className="mr-2 h-6 w-6" /> থামাও</>
                ) : (
                  <><Play className="mr-2 h-6 w-6" /> শুরু করো</>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={resetTimer}
                className="h-16 w-16 rounded-2xl border-2 soft-shadow active:scale-95"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-white dark:bg-card rounded-[2rem] soft-shadow text-center text-foreground"
        >
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">সেশন</p>
          <p className="text-xl font-black">২৫ মিনিট</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 bg-white dark:bg-card rounded-[2rem] soft-shadow text-center text-foreground"
        >
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">ব্রেক</p>
          <p className="text-xl font-black">৫ মিনিট</p>
        </motion.div>
      </div>
    </div>
  );
}

// Helper icons
function Play(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
  )
}

function Pause(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
  )
}

function RotateCcw(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
  )
}
