import { useState } from "react";
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
import { db, collection, addDoc, deleteDoc, doc, OperationType, handleFirestoreError } from "../lib/firebase";

interface TaskManagerProps {
  tasks: Task[];
  uid: string;
  onToggle: (id: string) => void;
}

export default function TaskManager({ tasks, uid, onToggle }: TaskManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", subject: "", deadline: "" });

  const addTask = async () => {
    if (!newTask.title) return;
    try {
      const taskData = {
        uid: uid,
        title: newTask.title,
        subject: newTask.subject || "General",
        deadline: newTask.deadline,
        completed: false,
        createdAt: new Date().toISOString()
      };
      // We'll let Firestore generate the ID
      await addDoc(collection(db, "tasks"), taskData);
      setNewTask({ title: "", subject: "", deadline: "" });
      setIsAddOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "tasks");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tasks/${id}`);
    }
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-bangla">Kaj er List</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full gap-2 font-bangla">
              <Plus className="h-4 w-4" /> Notun Kaj Add Koro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-bangla">Notun Kaj Add Koro</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="font-bangla">Kaj er Naam</Label>
                <Input 
                  id="title" 
                  value={newTask.title} 
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g., Chapter 1 pora"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject" className="font-bangla">Subject</Label>
                <Input 
                  id="subject" 
                  value={newTask.subject} 
                  onChange={(e) => setNewTask({ ...newTask, subject: e.target.value })}
                  placeholder="e.g., CSE101"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="deadline" className="font-bangla">Deadline</Label>
                <Input 
                  id="deadline" 
                  type="date"
                  value={newTask.deadline} 
                  onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addTask} className="w-full font-bangla">Add Koro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2 font-bangla">
            <Clock className="h-4 w-4" /> Baki Ase ({pendingTasks.length})
          </h3>
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {pendingTasks.map(task => (
                <motion.div 
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  layout
                  className="flex items-center space-x-3 p-4 bg-card border rounded-2xl shadow-sm group"
                >
                  <Checkbox 
                    id={`task-${task.id}`} 
                    checked={task.completed}
                    onCheckedChange={() => onToggle(task.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <label 
                      htmlFor={`task-${task.id}`}
                      className="text-sm font-semibold block truncate"
                    >
                      {task.title}
                    </label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{task.subject}</Badge>
                      {task.deadline && (
                        <span className="text-[10px] text-muted-foreground">{task.deadline}</span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
            {pendingTasks.length === 0 && (
              <p className="text-center py-8 text-muted-foreground text-sm font-bangla">Kono kaj baki nai bhai! 🥳</p>
            )}
          </div>
        </div>

        {completedTasks.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2 font-bangla">
              <CheckCircle2 className="h-4 w-4" /> Shesh Kora Hoise ({completedTasks.length})
            </h3>
            <div className="space-y-2 opacity-60">
              {completedTasks.map(task => (
                <div 
                  key={task.id}
                  className="flex items-center space-x-3 p-3 bg-muted/50 border rounded-xl"
                >
                  <Checkbox 
                    id={`task-${task.id}`} 
                    checked={task.completed}
                    onCheckedChange={() => onToggle(task.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <label 
                      htmlFor={`task-${task.id}`}
                      className="text-sm font-medium line-through truncate block"
                    >
                      {task.title}
                    </label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteTask(task.id)}
                    className="text-muted-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
