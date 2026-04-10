import { useMemo } from "react";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AppData } from "../types";
import { 
  Flame, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Trophy,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { motion } from "motion/react";
import { format, parseISO, differenceInDays, differenceInHours } from "date-fns";

interface DashboardProps {
  data: AppData;
  onTaskComplete: (id: string) => void;
}

export default function Dashboard({ data, onTaskComplete }: DashboardProps) {
  const today = new Date().toDateString();
  const todayTasks = data.tasks.filter(t => {
    if (t.completed) return false;
    if (!t.deadline) return true;
    return new Date(t.deadline).toDateString() === today;
  });

  const progress = useMemo(() => {
    if (data.tasks.length === 0) return 0;
    const completed = data.tasks.filter(t => t.completed).length;
    return Math.round((completed / data.tasks.length) * 100);
  }, [data.tasks]);

  const nextExam = useMemo(() => {
    if (data.exams.length === 0) return null;
    const futureExams = data.exams
      .filter(e => new Date(e.date) >= new Date(new Date().setHours(0,0,0,0)))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return futureExams[0] || null;
  }, [data.exams]);

  const countdown = useMemo(() => {
    if (!nextExam) return null;
    const examDate = parseISO(`${nextExam.date}T${nextExam.time || "00:00"}`);
    const now = new Date();
    const days = differenceInDays(examDate, now);
    const hours = differenceInHours(examDate, now) % 24;
    return { days, hours, isUrgent: days < 3 };
  }, [nextExam]);

  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden rounded-[2.5rem] bg-[#003366] p-8 text-white soft-shadow-lg"
      >
        <div className="relative z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="font-bangla text-lg font-medium opacity-90">ভাই, এক্সাম সামনে! পড়া শুরু করছো?</p>
          </motion.div>
          
          <div className="space-y-2">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-black font-bangla tracking-tight"
            >
              আজকে {progress}% কাজ শেষ
            </motion.h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1.5, ease: "circOut", delay: 0.6 }}
                  className="h-full bg-white rounded-full"
                />
              </div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-sm font-bold"
              >
                {progress}%
              </motion.span>
            </div>
          </div>
        </div>
        
        {/* Decorative circles */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/20 rounded-full blur-xl" 
        />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Flame, label: "স্ট্রিক", value: `${data.streak} দিন 🔥`, color: "orange", border: "hover:border-orange-200", lightBg: "bg-orange-100", darkBg: "dark:bg-orange-950/30", text: "text-orange-500" },
          { icon: CheckCircle2, label: "শেষ", value: `${data.tasks.filter(t => t.completed).length} কাজ`, color: "blue", border: "hover:border-blue-200", lightBg: "bg-blue-100", darkBg: "dark:bg-blue-950/30", text: "text-blue-500" },
          { icon: Trophy, label: "পয়েন্ট", value: data.tasks.filter(t => t.completed).length * 10, color: "green", border: "hover:border-green-200", lightBg: "bg-green-100", darkBg: "dark:bg-green-950/30", text: "text-green-500" },
          { icon: Clock, label: "বাকি", value: `${todayTasks.length} কাজ`, color: "purple", border: "hover:border-purple-200", lightBg: "bg-purple-100", darkBg: "dark:bg-purple-950/30", text: "text-purple-500" }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className={`rounded-[2rem] bg-white dark:bg-card p-6 soft-shadow border-2 border-transparent ${stat.border} transition-all text-foreground`}
          >
            <div className={`${stat.lightBg} ${stat.darkBg} p-3 rounded-2xl w-fit mb-4`}>
              <stat.icon className={`h-6 w-6 ${stat.text}`} />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-2xl font-black">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Next Exam Section */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-black font-bangla tracking-tight">পরের এক্সাম</h3>
            <Badge variant="secondary" className="rounded-full px-4 py-1 font-bangla">রুটিন দেখো</Badge>
          </div>
          
          {nextExam ? (
            <Card className={`rounded-[2.5rem] overflow-hidden border-none soft-shadow-lg ${countdown?.isUrgent ? 'card-gradient-orange' : 'card-gradient-blue'} text-white`}>
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-sm font-bold opacity-80 uppercase tracking-widest">কোর্স</p>
                    <h4 className="text-3xl font-black font-bangla">{nextExam.courseName}</h4>
                    <Badge variant="outline" className="bg-white/10 border-white/20 text-white text-[10px] font-black uppercase tracking-widest">
                      {nextExam.courseCode}
                    </Badge>
                  </div>
                  {countdown?.isUrgent && (
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="bg-white/20 backdrop-blur-md p-2 rounded-xl"
                    >
                      <AlertTriangle className="h-6 w-6" />
                    </motion.div>
                  )}
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold opacity-70 uppercase tracking-wider">সময় বাকি</p>
                    <p className="text-2xl font-black">
                      {countdown?.days} দিন {countdown?.hours} ঘণ্টা
                    </p>
                  </div>
                  <div className="h-10 w-px bg-white/20" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold opacity-70 uppercase tracking-wider">তারিখ</p>
                    <p className="text-lg font-bold">{format(parseISO(nextExam.date), "MMM dd")}</p>
                  </div>
                </div>
                
                {countdown?.isUrgent && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm font-bold font-bangla bg-white/10 p-3 rounded-2xl text-center"
                  >
                    ভাই, এখন না পড়লে আর কবে?! 😨
                  </motion.p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="rounded-[2.5rem] border-2 border-dashed border-muted-foreground/20 bg-muted/5 p-10 text-center">
              <p className="text-muted-foreground font-bangla text-lg">কোনো এক্সাম অ্যাড করো নাই ভাই। <br/> চিল নাকি? 😏</p>
            </Card>
          )}
        </motion.div>

        {/* Today's Tasks Section */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-black font-bangla tracking-tight">আজকের কাজ</h3>
            <span className="text-sm font-bold text-primary">{todayTasks.length} টা বাকি</span>
          </div>
          
          {todayTasks.length > 0 ? (
            <div className="space-y-3">
              {todayTasks.slice(0, 4).map((task, index) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                  className="group flex items-center gap-4 p-5 bg-white dark:bg-card rounded-[1.5rem] soft-shadow border-2 border-transparent hover:border-primary/20 transition-all"
                >
                  <div className="relative flex items-center justify-center">
                    <Checkbox 
                      id={`task-${task.id}`} 
                      checked={task.completed}
                      onCheckedChange={() => onTaskComplete(task.id)}
                      className="h-6 w-6 rounded-lg border-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label 
                      htmlFor={`task-${task.id}`}
                      className="text-base font-bold leading-none cursor-pointer group-hover:text-primary transition-colors text-foreground"
                    >
                      {task.title}
                    </label>
                    <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-wider">{task.subject}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </motion.div>
              ))}
              {todayTasks.length > 4 && (
                <p className="text-center text-xs font-bold text-muted-foreground pt-2">
                  আরও {todayTasks.length - 4} টা কাজ বাকি আছে...
                </p>
              )}
            </div>
          ) : (
            <div className="p-10 text-center bg-muted/5 rounded-[2.5rem] border-2 border-dashed border-muted-foreground/20">
              <p className="text-muted-foreground font-bangla text-lg">আজকে কোনো কাজ নাই! <br/> এক্সাম আছে, চিল করতেছো?! 😐</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
