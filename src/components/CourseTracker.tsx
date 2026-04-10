import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Plus, Trash2, BookOpen, CheckCircle2, Circle } from "lucide-react";
import { Course, Topic } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { db, collection, addDoc, deleteDoc, doc, setDoc, OperationType, handleFirestoreError } from "../lib/firebase";

interface CourseTrackerProps {
  courses: Course[];
  uid: string;
}

export default function CourseTracker({ courses, uid }: CourseTrackerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState("");

  const addCourse = async () => {
    if (!newCourseName) return;
    try {
      await addDoc(collection(db, "courses"), {
        uid: uid,
        name: newCourseName,
        topics: []
      });
      setNewCourseName("");
      setIsAddOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "courses");
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await deleteDoc(doc(db, "courses", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `courses/${id}`);
    }
  };

  const addTopic = async (courseId: string) => {
    if (!newTopicTitle) return;
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const newTopic: Topic = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTopicTitle,
      completed: false
    };

    try {
      await setDoc(doc(db, "courses", courseId), {
        ...course,
        topics: [...course.topics, newTopic]
      }, { merge: true });
      setNewTopicTitle("");
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `courses/${courseId}`);
    }
  };

  const toggleTopic = async (courseId: string, topicId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const updatedTopics = course.topics.map(t => 
      t.id === topicId ? { ...t, completed: !t.completed } : t
    );

    try {
      await setDoc(doc(db, "courses", courseId), {
        ...course,
        topics: updatedTopics
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `courses/${courseId}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-bangla">Subject Tracker</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full gap-2 font-bangla">
              <Plus className="h-4 w-4" /> Notun Subject Add Koro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-bangla">Notun Subject Add Koro</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="courseName" className="font-bangla">Subject er Naam</Label>
              <Input 
                id="courseName" 
                value={newCourseName} 
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="e.g., Physics, Math"
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

          return (
            <Card key={course.id} className="overflow-hidden border-primary/10 hover:border-primary/30 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold">{course.name}</CardTitle>
                    <CardDescription className="font-bangla">{completedCount}/{totalCount} topics sesh</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteCourse(course.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Progress value={progress} className="h-1.5 mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {course.topics.map(topic => (
                    <div 
                      key={topic.id} 
                      className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-lg transition-colors group"
                    >
                      <Checkbox 
                        id={`topic-${topic.id}`}
                        checked={topic.completed}
                        onCheckedChange={() => toggleTopic(course.id, topic.id)}
                      />
                      <label 
                        htmlFor={`topic-${topic.id}`}
                        className={`text-sm flex-1 ${topic.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {topic.title}
                      </label>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Input 
                    placeholder="Topic add koro..." 
                    value={activeCourseId === course.id ? newTopicTitle : ""}
                    onChange={(e) => {
                      setActiveCourseId(course.id);
                      setNewTopicTitle(e.target.value);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && addTopic(course.id)}
                    className="h-8 text-xs"
                  />
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="h-8 px-2"
                    onClick={() => addTopic(course.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {courses.length === 0 && (
          <div className="col-span-full p-12 text-center bg-muted/20 rounded-3xl border-2 border-dashed">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
            <p className="text-muted-foreground font-bangla">Kono subject add koro nai bhai. <br/> Pora-lekha ki bad dila? 🤨</p>
          </div>
        )}
      </div>
    </div>
  );
}
