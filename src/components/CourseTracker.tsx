import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Plus, Trash2, BookOpen, ChevronRight, ChevronDown } from "lucide-react";
import { Course, Topic } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface CourseTrackerProps {
  courses: Course[];
  onUpdate: (courses: Course[]) => void;
}

export default function CourseTracker({ courses, onUpdate }: CourseTrackerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const addCourse = () => {
    if (!newCourseName) return;
    const course: Course = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCourseName,
      topics: [],
    };
    onUpdate([...courses, course]);
    setNewCourseName("");
    setIsAddOpen(false);
  };

  const deleteCourse = (id: string) => {
    onUpdate(courses.filter(c => c.id !== id));
  };

  const addTopic = (courseId: string, title: string) => {
    if (!title) return;
    const updated = courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          topics: [...c.topics, { id: Math.random().toString(36).substr(2, 9), title, completed: false }]
        };
      }
      return c;
    });
    onUpdate(updated);
  };

  const toggleTopic = (courseId: string, topicId: string) => {
    const updated = courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          topics: c.topics.map(t => t.id === topicId ? { ...t, completed: !t.completed } : t)
        };
      }
      return c;
    });
    onUpdate(updated);
  };

  const deleteTopic = (courseId: string, topicId: string) => {
    const updated = courses.map(c => {
      if (c.id === courseId) {
        return {
          ...c,
          topics: c.topics.filter(t => t.id !== topicId)
        };
      }
      return c;
    });
    onUpdate(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-bangla">Course Progress</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full gap-2 font-bangla">
              <Plus className="h-4 w-4" /> Course Add Koro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-bangla">Notun Course Add Koro</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="courseName" className="font-bangla">Course Name (e.g., CSE101)</Label>
              <Input 
                id="courseName" 
                value={newCourseName} 
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="Math123, Physics..."
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button onClick={addCourse} className="w-full font-bangla">Add Koro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map(course => {
          const completedCount = course.topics.filter(t => t.completed).length;
          const totalCount = course.topics.length;
          const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
          const isExpanded = expandedCourse === course.id;

          return (
            <Card key={course.id} className="overflow-hidden border-primary/10">
              <div 
                className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setExpandedCourse(isExpanded ? null : course.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{course.name}</h3>
                      <p className="text-xs text-muted-foreground font-bangla">Course Progress: {progress}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteCourse(course.id);
                      }}
                      className="text-destructive h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {isExpanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </div>
                </div>
                <Progress value={progress} className="h-1.5" />
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t bg-muted/10 overflow-hidden"
                  >
                    <div className="p-4 space-y-4">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Notun topic add koro..." 
                          className="h-9 text-sm"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              addTopic(course.id, e.currentTarget.value);
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        {course.topics.map(topic => (
                          <div key={topic.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <Checkbox 
                                checked={topic.completed}
                                onCheckedChange={() => toggleTopic(course.id, topic.id)}
                              />
                              <span className={`text-sm ${topic.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {topic.title}
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => deleteTopic(course.id, topic.id)}
                              className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        {course.topics.length === 0 && (
                          <p className="text-xs text-center text-muted-foreground py-2 font-bangla">Kono topic add koro nai bhai. 😐</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
        {courses.length === 0 && (
          <div className="text-center py-12 bg-muted/20 rounded-3xl border-2 border-dashed">
            <p className="text-muted-foreground font-bangla">Course add koro bhai, pora shuru koro! 📚</p>
          </div>
        )}
      </div>
    </div>
  );
}
