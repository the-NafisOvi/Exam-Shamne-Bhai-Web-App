import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Plus, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Task } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface TaskManagerProps {
  tasks: Task[];
  onUpdate: (tasks: Task[]) => void;
  onToggle: (id: string) => void;
}

export default function TaskManager({ tasks, onUpdate, onToggle }: TaskManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", subject: "", deadline: "" });

  const addTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      subject: newTask.subject || "সাধারণ",
      deadline: newTask.deadline,
      completed: false,
    };
    onUpdate([task, ...tasks]);
    setNewTask({ title: "", subject: "", deadline: "" });
    setIsAddOpen(false);
  };

  const deleteTask = (id: string) => {
    onUpdate(tasks.filter(t => t.id !== id));
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-black font-bangla tracking-tight">কাজের লিস্ট</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={
            <Button className="rounded-2xl gap-2 font-bangla soft-shadow h-12 px-6">
              <Plus className="h-5 w-5" /> নতুন কাজ
            </Button>
          } />
          <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="font-bangla text-2xl font-black">নতুন কাজ অ্যাড করো</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="font-bangla font-bold">কাজের নাম</Label>
                <Input 
                  id="title" 
                  value={newTask.title} 
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="যেমন: চ্যাপ্টার ১ পড়া"
                  className="rounded-xl h-12"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject" className="font-bangla font-bold">সাবজেক্ট</Label>
                <Input 
                  id="subject" 
                  value={newTask.subject} 
                  onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                  placeholder="যেমন: CSE101"
                  className="rounded-xl h-12"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline" className="font-bangla font-bold">ডেডলাইন</Label>
                <Input 
                  id="deadline" 
                  type="date"
                  value={newTask.deadline} 
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  className="rounded-xl h-12"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addTask} className="w-full h-12 rounded-xl font-bangla font-bold text-lg">অ্যাড করো</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h3 className="text-sm font-black text-muted-foreground px-2 flex items-center gap-2 uppercase tracking-widest">
            <Clock className="h-4 w-4" /> বাকি আছে ({pendingTasks.length})
          </h3>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {pendingTasks.map((task, index) => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                  className="flex items-center gap-4 p-5 bg-white dark:bg-card border-2 border-transparent hover:border-primary/20 rounded-[1.5rem] soft-shadow group transition-all"
                >
                  <Checkbox 
                    id={`task-${task.id}`} 
                    checked={task.completed}
                    onCheckedChange={() => onToggle(task.id)}
                    className="h-6 w-6 rounded-lg border-2"
                  />
                  <div className="flex-1 min-w-0">
                    <label 
                      htmlFor={`task-${task.id}`}
                      className="text-base font-bold block truncate cursor-pointer text-foreground"
                    >
                      {task.title}
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-lg">{task.subject}</Badge>
                      {task.deadline && (
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">{task.deadline}</span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive rounded-xl"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
            {pendingTasks.length === 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 bg-muted/5 rounded-[2rem] border-2 border-dashed"
              >
                <p className="text-muted-foreground font-bangla text-lg">কোনো কাজ বাকি নাই ভাই! 🥳</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {completedTasks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-black text-muted-foreground px-2 flex items-center gap-2 uppercase tracking-widest">
              <CheckCircle2 className="h-4 w-4" /> শেষ করা হইছে ({completedTasks.length})
            </h3>
            <div className="space-y-3 opacity-60">
              <AnimatePresence mode="popLayout">
                {completedTasks.map((task, index) => (
                  <motion.div 
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                    className="flex items-center gap-4 p-4 bg-muted/30 border rounded-[1.25rem]"
                  >
                    <Checkbox 
                      id={`task-${task.id}`} 
                      checked={task.completed}
                      onCheckedChange={() => onToggle(task.id)}
                      className="h-5 w-5 rounded-md"
                    />
                    <div className="flex-1 min-w-0">
                      <label 
                        htmlFor={`task-${task.id}`}
                        className="text-sm font-bold line-through truncate block"
                      >
                        {task.title}
                      </label>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteTask(task.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
