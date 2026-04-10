import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AppData, Task, Exam } from "../types";
import { format, differenceInDays, differenceInHours, parseISO } from "date-fns";
import { AlertCircle, Flame, Calendar, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

interface DashboardProps {
  data: AppData;
  onTaskComplete: (id: string) => void;
}

export default function Dashboard({ data, onTaskComplete }: DashboardProps) {
  const today = new Date();
  
  const nextExam = useMemo(() => {
    if (data.exams.length === 0) return null;
    const sorted = [...data.exams].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    const future = sorted.filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)));
    return future[0] || null;
  }, [data.exams]);

  const countdown = useMemo(() => {
    if (!nextExam) return null;
    const examDate = parseISO(`${nextExam.date}T${nextExam.time || "00:00"}`);
    const days = differenceInDays(examDate, today);
    const hours = differenceInHours(examDate, today) % 24;
    return { days, hours, isUrgent: days < 1 };
  }, [nextExam, today]);

  const todayTasks = useMemo(() => {
    return data.tasks.filter(t => !t.completed).slice(0, 3);
  }, [data.tasks]);

  const progress = useMemo(() => {
    if (data.tasks.length === 0) return 0;
    const completed = data.tasks.filter(t => t.completed).length;
    return Math.round((completed / data.tasks.length) * 100);
  }, [data.tasks]);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1"
      >
        <h2 className="text-2xl font-bold font-bangla">Bhai, Exam shamne!</h2>
        <p className="text-muted-foreground font-bangla">Pora shuru korso? Ajke {format(today, "do MMMM, yyyy")}</p>
      </motion.div>

      {/* Streak & Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-lg text-white">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">Study Streak</p>
              <p className="text-xl font-bold">{data.streak} Din 🔥</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-blue-500 p-2 rounded-lg text-white">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Completed</p>
              <p className="text-xl font-bold">{data.tasks.filter(t => t.completed).length} Kaj</p>
            </div>
          </CardContent>
        </Card>
        
        {/* Progress Card for Desktop */}
        <Card className="hidden md:block md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium font-bangla">Ajke {progress}% kaj sesh</CardTitle>
              <span className="text-xs text-muted-foreground">{data.tasks.filter(t => t.completed).length}/{data.tasks.length}</span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Next Exam Countdown */}
          {nextExam ? (
            <Card className={`${countdown?.isUrgent ? 'border-destructive bg-destructive/5' : 'border-primary/20'}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Next Exam
                  </CardTitle>
                  {countdown?.isUrgent && (
                    <Badge variant="destructive" className="animate-pulse font-bangla">Danger! 😭</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-xl font-bold font-bangla">{nextExam.subject}</p>
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-black ${countdown?.isUrgent ? 'text-destructive' : 'text-primary'}`}>
                      {countdown?.days}d {countdown?.hours}h
                    </span>
                    <span className="text-muted-foreground text-sm font-bangla">baki 😨</span>
                  </div>
                  {countdown?.isUrgent && (
                    <p className="text-xs text-destructive font-bold font-bangla">Akhon na porle ar kobe?!</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-muted-foreground">
                <p className="font-bangla">Kono exam add koro nai bhai. Chill naki? 😏</p>
              </CardContent>
            </Card>
          )}

          {/* Progress (Mobile only) */}
          <Card className="md:hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-sm font-medium font-bangla">Ajke {progress}% kaj sesh</CardTitle>
                <span className="text-xs text-muted-foreground">{data.tasks.filter(t => t.completed).length}/{data.tasks.length}</span>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Tasks */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold font-bangla">Ajker Kaj</h3>
            <Badge variant="outline" className="font-bangla">{todayTasks.length} ta baki</Badge>
          </div>
          {todayTasks.length > 0 ? (
            <div className="space-y-2">
              {todayTasks.map(task => (
                <motion.div 
                  key={task.id}
                  layout
                  className="flex items-center space-x-3 p-3 bg-card border rounded-xl shadow-sm"
                >
                  <Checkbox 
                    id={`task-${task.id}`} 
                    checked={task.completed}
                    onCheckedChange={() => onTaskComplete(task.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <label 
                      htmlFor={`task-${task.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate block"
                    >
                      {task.title}
                    </label>
                    <p className="text-xs text-muted-foreground truncate">{task.subject}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-muted/30 rounded-2xl border border-dashed">
              <p className="text-sm text-muted-foreground font-bangla">Ajke kono kaj nai! <br/> Exam ase, chill korteso?! 😐</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
