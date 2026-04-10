import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  CheckSquare, 
  BookOpen, 
  Calendar as CalendarIcon, 
  Timer, 
  Sparkles,
  Moon,
  Sun,
  GraduationCap,
  Book
} from "lucide-react";
import { AppData, Task } from "./types";
import Dashboard from "./components/Dashboard";
import TaskManager from "./components/TaskManager";
import CourseTracker from "./components/CourseTracker";
import ExamManager from "./components/ExamManager";
import PomodoroTimer from "./components/PomodoroTimer";
import AICoach from "./components/AICoach";
import { Button } from "./components/ui/button";
import { motion, AnimatePresence } from "motion/react";

const INITIAL_DATA: AppData = {
  tasks: [
    { id: "1", title: "Assignment 1", subject: "CSE101", deadline: new Date().toISOString().split('T')[0], completed: false },
    { id: "2", title: "Lab Report", subject: "EEE201", deadline: new Date().toISOString().split('T')[0], completed: false },
  ],
  courses: [
    { id: "c1", name: "CSE101", topics: [{ id: "t1", title: "Introduction", completed: true }] },
    { id: "c2", name: "EEE201", topics: [{ id: "t2", title: "Circuit Basics", completed: false }] },
  ],
  exams: [
    { id: "e1", courseName: "Introduction to CS", courseCode: "CSE101", date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: "10:00" },
  ],
  streak: 0,
  lastStudyDate: null,
};

export default function App() {
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem("exam-shamne-bhai-data");
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    localStorage.setItem("exam-shamne-bhai-data", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const updateData = (newData: Partial<AppData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const handleTaskComplete = (taskId: string) => {
    const updatedTasks = data.tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    
    const task = updatedTasks.find(t => t.id === taskId);
    if (task?.completed) {
      const funnyMessages = [
        "ভাই, এইটা শেষ! আরও কিছু করবা নাকি? 😏",
        "কোপাইয়া দিলা ভাই! 🔥",
        "একটা কাজ শেষ, এবার একটু চিল করো? (নাহ, পড়া বাকি আছে) 😐",
        "শাবাশ! এক্সাম এ ও এমনে কোপাবা। 🎯"
      ];
      toast.success(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
      
      const today = new Date().toDateString();
      if (data.lastStudyDate !== today) {
        updateData({ 
          streak: data.streak + 1, 
          lastStudyDate: today 
        });
      }
    }
    
    updateData({ tasks: updatedTasks });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-500 overflow-x-hidden">
      <AnimatePresence>
        {showSplash && (
          <motion.div 
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#001a33] flex flex-col items-center justify-center p-6 overflow-hidden"
          >
            {/* Background decorative elements */}
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1],
                x: [0, 50, 0]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            />
            <motion.div 
              animate={{ 
                rotate: -360,
                scale: [1, 1.3, 1],
                y: [0, -50, 0]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] bg-secondary/20 rounded-full blur-3xl"
            />
            
            {/* Floating Icons */}
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-10 opacity-20"
            >
              <Book className="w-16 h-16 text-white" />
            </motion.div>
            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 right-10 opacity-20"
            >
              <GraduationCap className="w-20 h-20 text-white" />
            </motion.div>

            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", damping: 12 }}
              className="text-center space-y-8 relative z-10"
            >
              <div className="relative inline-block">
                <motion.div 
                  animate={{ 
                    y: [0, -15, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="bg-white p-10 rounded-[3rem] soft-shadow-lg flex items-center justify-center mx-auto"
                >
                  <GraduationCap className="h-24 w-24 text-primary" />
                </motion.div>
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="absolute -top-4 -right-4 bg-red-600 text-white text-sm font-black px-4 py-2 rounded-2xl soft-shadow rotate-12 animate-bounce"
                >
                  EXAM! 😨
                </motion.div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2 overflow-hidden">
                  <motion.h1 
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.8, 
                      delay: 0.4,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="text-6xl md:text-7xl font-black text-white font-bangla tracking-tight"
                  >
                    {"Exam Shamne Bhai".split(" ").map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                        className="inline-block mr-3"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1, type: "spring" }}
                    className="inline-block px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
                  >
                    <p className="text-white font-bangla text-xl font-bold">
                      by Nafis Ovi
                    </p>
                  </motion.div>
                </div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 0.9 }}
                  className="text-white/80 font-bangla text-xl italic"
                >
                  পড়া-লেখা শুরু করো ভাই!
                </motion.p>
              </div>

              <div className="w-48 h-2 bg-white/20 rounded-full mx-auto overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="h-full w-1/2 bg-white rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showSplash ? 0 : 1, y: showSplash ? 20 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl mx-auto pb-32 pt-8 px-4 md:px-8"
      >
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-primary font-bangla tracking-tight">Exam Shamne Bhai</h1>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">by Nafis Ovi</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-2xl border-2 hover:bg-muted soft-shadow transition-all active:scale-90"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        <main>
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsContent value="dashboard" className="mt-0 outline-none">
              <Dashboard data={data} onTaskComplete={handleTaskComplete} />
            </TabsContent>
            
            <TabsContent value="tasks" className="mt-0 outline-none">
              <TaskManager 
                tasks={data.tasks} 
                onUpdate={(tasks) => updateData({ tasks })}
                onToggle={handleTaskComplete}
              />
            </TabsContent>
            
            <TabsContent value="courses" className="mt-0 outline-none">
              <CourseTracker 
                courses={data.courses} 
                onUpdate={(courses) => updateData({ courses })} 
              />
            </TabsContent>
            
            <TabsContent value="exams" className="mt-0 outline-none">
              <ExamManager 
                exams={data.exams} 
                onUpdate={(exams) => updateData({ exams })} 
              />
            </TabsContent>
            
            <TabsContent value="pomodoro" className="mt-0 outline-none">
              <PomodoroTimer onComplete={(wasBreak) => {
                if (!wasBreak) {
                  const today = new Date().toDateString();
                  if (data.lastStudyDate !== today) {
                    updateData({ streak: data.streak + 1, lastStudyDate: today });
                  }
                  toast.success("ভাই, ২৫ মিনিট শেষ! এবার ৫ মিনিট ব্রেক নাও। 🔥");
                } else {
                  toast.success("ব্রেক শেষ! এবার আবার পড়াশোনা শুরু করো ভাই। ✍️");
                }
              }} />
            </TabsContent>

            <TabsContent value="ai" className="mt-0 outline-none">
              <AICoach tasks={data.tasks} exams={data.exams} />
            </TabsContent>

            {/* Floating Bottom Navigation */}
            <div className="fixed bottom-6 left-4 right-4 z-50">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/30 dark:border-white/10 soft-shadow-2xl rounded-[2.5rem] p-1.5 md:p-2">
                  <TabsList className="grid grid-cols-6 w-full h-14 md:h-16 bg-transparent gap-1 relative">
                    {[
                      { value: "dashboard", icon: LayoutDashboard, label: "হোম", color: "blue" },
                      { value: "tasks", icon: CheckSquare, label: "কাজ", color: "orange" },
                      { value: "courses", icon: BookOpen, label: "কোর্স", color: "green" },
                      { value: "exams", icon: CalendarIcon, label: "রুটিন", color: "red" },
                      { value: "pomodoro", icon: Timer, label: "টাইমার", color: "purple" },
                      { value: "ai", icon: Sparkles, label: "AI", color: "indigo" }
                    ].map((tab) => (
                      <TabsTrigger 
                        key={tab.value}
                        value={tab.value} 
                        className="relative flex flex-col gap-0.5 md:gap-1 rounded-2xl transition-all duration-500 data-[state=active]:text-white z-10 group"
                      >
                        <tab.icon className="h-4 w-4 md:h-5 md:w-5 transition-transform group-hover:scale-110" />
                        <span className="text-[8px] md:text-[10px] font-bold">{tab.label}</span>
                        
                        {/* Custom Active Background with Layout Animation */}
                        <TabsTriggerActiveBackground tab={tab} />
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>
            </div>
          </Tabs>
        </main>
      </motion.div>
      <Toaster position="top-center" richColors />
    </div>
  );
}

function TabsTriggerActiveBackground({ tab }: { tab: any }) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500 shadow-blue-500/50",
    orange: "bg-orange-500 shadow-orange-500/50",
    green: "bg-green-500 shadow-green-500/50",
    red: "bg-red-500 shadow-red-500/50",
    purple: "bg-purple-500 shadow-purple-500/50",
    indigo: "bg-indigo-500 shadow-indigo-500/50",
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full h-full rounded-2xl transition-all duration-500 group-data-[state=active]:bg-opacity-100 bg-transparent group-data-[state=active]:shadow-[0_0_20px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className={`w-full h-full opacity-0 group-data-[state=active]:opacity-100 transition-opacity duration-300 ${colorClasses[tab.color] || "bg-primary"} shadow-[0_0_15px_rgba(0,0,0,0.2)]`} />
        </div>
      </div>
    </div>
  );
}
