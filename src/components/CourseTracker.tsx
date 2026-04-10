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
import { Plus, Trash2, BookOpen } from "lucide-react";
import { Course, Topic } from "../types";
import { motion } from "motion/react";

interface CourseTrackerProps {
  courses: Course[];
  onUpdate: (courses: Course[]) => void;
}

export default function CourseTracker({ courses, onUpdate }: CourseTrackerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState("");

  const addCourse = () => {
    if (!newCourseName) return;
    const course: Course = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCourseName,
      topics: []
    };
    onUpdate([...courses, course]);
    setNewCourseName("");
    setIsAddOpen(false);
  };

  const deleteCourse = (id: string) => {
    onUpdate(courses.filter(c => c.id !== id));
  };

  const addTopic = (courseId: string) => {
    if (!newTopicTitle) return;
    const updatedCourses = courses.map(c => {
      if (c.id === courseId) {
        const newTopic: Topic = {
          id: Math.random().toString(36).substr(2, 9),
          title: newTopicTitle,
          completed: false
        };
        return { ...c, topics: [...c.topics, newTopic] };
      }
      return c;
    });
    onUpdate(updatedCourses);
    setNewTopicTitle("");
  };

  const toggleTopic = (courseId: string, topicId: string) => {
    const updatedCourses = courses.map(c => {
      if (c.id === courseId) {
        const updatedTopics = c.topics.map(t => 
          t.id === topicId ? { ...t, completed: !t.completed } : t
        );
        return { ...c, topics: updatedTopics };
      }
      return c;
    });
    onUpdate(updatedCourses);
  };

  return (
    <div className="space-y-8 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center px-2"
      >
        <h2 className="text-2xl font-black font-bangla tracking-tight">সাবজেক্ট ট্র্যাকার</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger render={
            <Button className="rounded-2xl gap-2 font-bangla soft-shadow h-12 px-6">
              <Plus className="h-5 w-5" /> নতুন সাবজেক্ট
            </Button>
          } />
          <DialogContent className="rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="font-bangla text-2xl font-black">নতুন সাবজেক্ট অ্যাড করো</DialogTitle>
            </DialogHeader>
            <div className="py-6">
              <Label htmlFor="courseName" className="font-bangla font-bold">সাবজেক্ট এর নাম</Label>
              <Input 
                id="courseName" 
                value={newCourseName} 
                onChange={(e) => setNewCourseName(e.target.value)}
                placeholder="যেমন: CSE101, PHY101"
                className="mt-2 rounded-xl h-12"
              />
            </div>
            <DialogFooter>
              <Button onClick={addCourse} className="w-full h-12 rounded-xl font-bangla font-bold text-lg">অ্যাড করো</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, index) => {
          const completedCount = course.topics.filter(t => t.completed).length;
          const totalCount = course.topics.length;
          const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden rounded-[2rem] border-none soft-shadow hover:soft-shadow-lg transition-all text-foreground">
                <CardHeader className="pb-4 bg-primary/5">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-black text-foreground">{course.name}</CardTitle>
                      <p className="text-xs font-bold text-muted-foreground font-bangla">{completedCount}/{totalCount} টপিক শেষ</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteCourse(course.id)}
                      className="text-muted-foreground hover:text-destructive rounded-xl"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-primary">
                      <span>প্রগ্রেস</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 rounded-full" />
                  </div>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    {course.topics.map(topic => (
                      <div 
                        key={topic.id} 
                        className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-xl transition-colors group"
                      >
                        <Checkbox 
                          id={`topic-${topic.id}`}
                          checked={topic.completed}
                          onCheckedChange={() => toggleTopic(course.id, topic.id)}
                          className="h-5 w-5 rounded-md border-2"
                        />
                        <label 
                          htmlFor={`topic-${topic.id}`}
                          className={`text-sm font-bold flex-1 cursor-pointer text-foreground ${topic.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {topic.title}
                        </label>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Input 
                      placeholder="টপিক অ্যাড করো..." 
                      value={activeCourseId === course.id ? newTopicTitle : ""}
                      onChange={(e) => {
                        setActiveCourseId(course.id);
                        setNewTopicTitle(e.target.value);
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && addTopic(course.id)}
                      className="h-10 rounded-xl text-sm"
                    />
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      className="h-10 w-10 rounded-xl shrink-0"
                      onClick={() => addTopic(course.id)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {courses.length === 0 && (
          <div className="col-span-full p-16 text-center bg-muted/5 rounded-[3rem] border-2 border-dashed border-muted-foreground/20">
            <div className="bg-muted/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-10 w-10 text-muted-foreground opacity-40" />
            </div>
            <p className="text-muted-foreground font-bangla text-xl font-bold">কোনো সাবজেক্ট অ্যাড করো নাই ভাই। <br/> পড়া-লেখা কি বাদ দিলা? 🤨</p>
          </div>
        )}
      </div>
    </div>
  );
}
