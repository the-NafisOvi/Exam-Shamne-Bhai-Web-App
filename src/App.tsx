import { useState, useEffect, useMemo } from "react";
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
  Sun
} from "lucide-react";
import { AppData, Task, Course, Exam } from "./types";
import Dashboard from "./components/Dashboard";
import TaskManager from "./components/TaskManager";
import CourseTracker from "./components/CourseTracker";
import ExamManager from "./components/ExamManager";
import PomodoroTimer from "./components/PomodoroTimer";
import AICoach from "./components/AICoach";
import { Button } from "./components/ui/button";

const INITIAL_DATA: AppData = {
  tasks: [],
  courses: [],
  exams: [],
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

  // Streak logic
  useEffect(() => {
    const today = new Date().toDateString();
    if (data.lastStudyDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (data.lastStudyDate === yesterday.toDateString()) {
        // Continue streak
        // This should be triggered when a task is completed or pomodoro finished
      } else if (data.lastStudyDate !== null) {
        // Streak broken
        // setData(prev => ({ ...prev, streak: 0 }));
      }
    }
  }, [data.lastStudyDate]);

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
        "Bhai, eita sesh! Aro kisu korba naki? 😏",
        "Kopaiya dila bhai! 🔥",
        "Ekta kaj sesh, ebar ektu chill koro? (Nah, pora baki ase) 😐",
        "Shabash! Exam e o emne kopaba. 🎯"
      ];
      toast.success(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
      
      // Update streak if first task of the day
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
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      <div className="max-w-4xl mx-auto pb-24 pt-6 px-4 md:px-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary font-bangla">Exam Shamne Bhai</h1>
            <p className="text-xs text-muted-foreground">by Nafis Ovi</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-full"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </header>

        <main>
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsContent value="dashboard">
              <Dashboard data={data} onTaskComplete={handleTaskComplete} />
            </TabsContent>
            
            <TabsContent value="tasks">
              <TaskManager 
                tasks={data.tasks} 
                onUpdate={(tasks) => updateData({ tasks })}
                onToggle={handleTaskComplete}
              />
            </TabsContent>
            
            <TabsContent value="courses">
              <CourseTracker 
                courses={data.courses} 
                onUpdate={(courses) => updateData({ courses })} 
              />
            </TabsContent>
            
            <TabsContent value="exams">
              <ExamManager 
                exams={data.exams} 
                onUpdate={(exams) => updateData({ exams })} 
              />
            </TabsContent>
            
            <TabsContent value="pomodoro">
              <PomodoroTimer onComplete={() => {
                const today = new Date().toDateString();
                if (data.lastStudyDate !== today) {
                  updateData({ streak: data.streak + 1, lastStudyDate: today });
                }
                toast.success("Bhai, 25 min sesh! Ebar 5 min break nao. 🔥");
              }} />
            </TabsContent>

            <TabsContent value="ai">
              <AICoach tasks={data.tasks} exams={data.exams} />
            </TabsContent>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border px-4 py-2 z-50">
              <div className="max-w-2xl mx-auto flex justify-between items-center">
                <TabsList className="grid grid-cols-6 w-full h-14 bg-transparent gap-1">
                  <TabsTrigger value="dashboard" className="flex flex-col gap-1 data-[state=active]:bg-primary/10">
                    <LayoutDashboard className="h-5 w-5" />
                    <span className="text-[10px]">Home</span>
                  </TabsTrigger>
                  <TabsTrigger value="tasks" className="flex flex-col gap-1 data-[state=active]:bg-primary/10">
                    <CheckSquare className="h-5 w-5" />
                    <span className="text-[10px]">Tasks</span>
                  </TabsTrigger>
                  <TabsTrigger value="courses" className="flex flex-col gap-1 data-[state=active]:bg-primary/10">
                    <BookOpen className="h-5 w-5" />
                    <span className="text-[10px]">Courses</span>
                  </TabsTrigger>
                  <TabsTrigger value="exams" className="flex flex-col gap-1 data-[state=active]:bg-primary/10">
                    <CalendarIcon className="h-5 w-5" />
                    <span className="text-[10px]">Exams</span>
                  </TabsTrigger>
                  <TabsTrigger value="pomodoro" className="flex flex-col gap-1 data-[state=active]:bg-primary/10">
                    <Timer className="h-5 w-5" />
                    <span className="text-[10px]">Focus</span>
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="flex flex-col gap-1 data-[state=active]:bg-primary/10">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-[10px]">AI</span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
          </Tabs>
        </main>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
