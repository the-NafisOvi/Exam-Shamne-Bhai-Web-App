import { useState, useEffect, useMemo, ReactNode } from "react";
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
  LogOut,
  LogIn
} from "lucide-react";
import { AppData, Task, Course, Exam } from "./types";
import Dashboard from "./components/Dashboard";
import TaskManager from "./components/TaskManager";
import CourseTracker from "./components/CourseTracker";
import ExamManager from "./components/ExamManager";
import PomodoroTimer from "./components/PomodoroTimer";
import AICoach from "./components/AICoach";
import { Button } from "./components/ui/button";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  onSnapshot,
  OperationType,
  handleFirestoreError
} from "./lib/firebase";
import { ErrorBoundary } from "./components/ErrorBoundary";

const INITIAL_DATA: AppData = {
  tasks: [],
  courses: [],
  exams: [],
  streak: 0,
  lastStudyDate: null,
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AppData>(INITIAL_DATA);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch user profile/stats
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setData(prev => ({ 
              ...prev, 
              streak: userData.streak || 0, 
              lastStudyDate: userData.lastStudyDate || null 
            }));
          } else {
            // Create user profile
            await setDoc(doc(db, "users", currentUser.uid), {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              streak: 0,
              lastStudyDate: null
            });
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
        }
      } else {
        setData(INITIAL_DATA);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Real-time listeners for data
  useEffect(() => {
    if (!user) return;

    const qTasks = query(collection(db, "tasks"), where("uid", "==", user.uid));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task));
      setData(prev => ({ ...prev, tasks }));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "tasks"));

    const qCourses = query(collection(db, "courses"), where("uid", "==", user.uid));
    const unsubCourses = onSnapshot(qCourses, (snapshot) => {
      const courses = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Course));
      setData(prev => ({ ...prev, courses }));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "courses"));

    const qExams = query(collection(db, "exams"), where("uid", "==", user.uid));
    const unsubExams = onSnapshot(qExams, (snapshot) => {
      const exams = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Exam));
      setData(prev => ({ ...prev, exams }));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "exams"));

    return () => {
      unsubTasks();
      unsubCourses();
      unsubExams();
    };
  }, [user]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Bhai, login hoise! Ebar pora shuru koro. 🔥");
    } catch (error) {
      console.error(error);
      toast.error("Login fail hoise bhai. 😭");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info("Bhai, logout keno? Pora sesh? 😏");
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskComplete = async (taskId: string) => {
    if (!user) return;
    const task = data.tasks.find(t => t.id === taskId);
    if (!task) return;

    try {
      const updatedCompleted = !task.completed;
      // We use taskId as the doc ID if it was created with addDoc, 
      // but our Task interface uses 'id' which we map from doc.id
      await setDoc(doc(db, "tasks", taskId), { ...task, completed: updatedCompleted }, { merge: true });
      
      if (updatedCompleted) {
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
          const newStreak = data.streak + 1;
          await setDoc(doc(db, "users", user.uid), { 
            streak: newStreak, 
            lastStudyDate: today 
          }, { merge: true });
          setData(prev => ({ ...prev, streak: newStreak, lastStudyDate: today }));
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tasks/${taskId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground font-sans flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 space-y-8 text-center border-2 border-primary/10 shadow-xl rounded-3xl">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-primary font-bangla">Exam Shamne Bhai</h1>
            <p className="text-muted-foreground font-bangla">Bangladeshi student productivity app</p>
          </div>
          <div className="bg-primary/5 p-6 rounded-2xl">
            <p className="text-sm font-medium font-bangla leading-relaxed">
              "Bhai, exam shamne! Ekhon chill korle pore kintu kapa-kapi hobe. Login koro ar pora shuru koro!"
            </p>
          </div>
          <Button onClick={handleLogin} className="w-full h-14 text-lg rounded-2xl gap-3 font-bangla">
            <LogIn className="h-6 w-6" /> Google diye Login koro
          </Button>
          <p className="text-xs text-muted-foreground">by Nafis Ovi</p>
        </Card>
        <Toaster position="top-center" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
        <div className="max-w-4xl mx-auto pb-24 pt-6 px-4 md:px-8">
          <header className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              {user.photoURL && (
                <img src={user.photoURL} alt="User" className="h-10 w-10 rounded-full border-2 border-primary/20" referrerPolicy="no-referrer" />
              )}
              <div>
                <h1 className="text-xl font-bold text-primary font-bangla leading-tight">Exam Shamne Bhai</h1>
                <p className="text-[10px] text-muted-foreground">Bhai, {user.displayName?.split(' ')[0]}!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setDarkMode(!darkMode)}
                className="rounded-full"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleLogout}
                className="rounded-full text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </header>

          <main>
            <Tabs defaultValue="dashboard" className="w-full">
              <TabsContent value="dashboard">
                <Dashboard data={data} onTaskComplete={handleTaskComplete} />
              </TabsContent>
              
              <TabsContent value="tasks">
                <TaskManager 
                  tasks={data.tasks} 
                  uid={user.uid}
                  onToggle={handleTaskComplete}
                />
              </TabsContent>
              
              <TabsContent value="courses">
                <CourseTracker 
                  courses={data.courses} 
                  uid={user.uid}
                />
              </TabsContent>
              
              <TabsContent value="exams">
                <ExamManager 
                  exams={data.exams} 
                  uid={user.uid}
                />
              </TabsContent>
              
              <TabsContent value="pomodoro">
                <PomodoroTimer onComplete={async () => {
                  const today = new Date().toDateString();
                  if (data.lastStudyDate !== today) {
                    const newStreak = data.streak + 1;
                    await setDoc(doc(db, "users", user.uid), { 
                      streak: newStreak, 
                      lastStudyDate: today 
                    }, { merge: true });
                    setData(prev => ({ ...prev, streak: newStreak, lastStudyDate: today }));
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
    </ErrorBoundary>
  );
}

// Placeholder Card component for the login screen
function Card({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={`bg-card text-card-foreground border rounded-xl shadow-sm ${className}`}>
      {children}
    </div>
  );
}
