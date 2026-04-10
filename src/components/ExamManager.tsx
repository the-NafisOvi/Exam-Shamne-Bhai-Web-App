import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Plus, Trash2, Calendar, Clock, AlertTriangle } from "lucide-react";
import { Exam } from "../types";
import { format, parseISO, isBefore, addDays } from "date-fns";
import { motion } from "motion/react";

interface ExamManagerProps {
  exams: Exam[];
  onUpdate: (exams: Exam[]) => void;
}

export default function ExamManager({ exams, onUpdate }: ExamManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newExam, setNewExam] = useState({ subject: "", date: "", time: "" });

  const addExam = () => {
    if (!newExam.subject || !newExam.date) return;
    const exam: Exam = {
      id: Math.random().toString(36).substr(2, 9),
      subject: newExam.subject,
      date: newExam.date,
      time: newExam.time || "10:00",
    };
    onUpdate([...exams, exam]);
    setNewExam({ subject: "", date: "", time: "" });
    setIsAddOpen(false);
  };

  const deleteExam = (id: string) => {
    onUpdate(exams.filter(e => e.id !== id));
  };

  const sortedExams = [...exams].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-bangla">Exam Routine</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full gap-2 font-bangla">
              <Plus className="h-4 w-4" /> Exam Add Koro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-bangla">Notun Exam Add Koro</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject" className="font-bangla">Subject Name</Label>
                <Input 
                  id="subject" 
                  value={newExam.subject} 
                  onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                  placeholder="e.g., CSE101"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="date" className="font-bangla">Date</Label>
                <Input 
                  id="date" 
                  type="date"
                  value={newExam.date} 
                  onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time" className="font-bangla">Time</Label>
                <Input 
                  id="time" 
                  type="time"
                  value={newExam.time} 
                  onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addExam} className="w-full font-bangla">Add Koro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedExams.map(exam => {
          const examDate = parseISO(exam.date);
          const isSoon = isBefore(examDate, addDays(new Date(), 3));
          
          return (
            <motion.div 
              key={exam.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className={`${isSoon ? 'border-destructive/50 bg-destructive/5' : 'border-primary/10'}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className={`p-3 rounded-2xl flex flex-col items-center justify-center min-w-[60px] ${isSoon ? 'bg-destructive text-destructive-foreground' : 'bg-primary/10 text-primary'}`}>
                        <span className="text-xs font-bold uppercase">{format(examDate, "MMM")}</span>
                        <span className="text-xl font-black">{format(examDate, "dd")}</span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg">{exam.subject}</h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {format(examDate, "EEEE")}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {exam.time}</span>
                        </div>
                        {isSoon && (
                          <p className="text-[10px] text-destructive font-bold flex items-center gap-1 mt-1 font-bangla">
                            <AlertTriangle className="h-3 w-3" /> Bhai danger! Exam ekdom kache! 😭
                          </p>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteExam(exam.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {exams.length === 0 && (
          <div className="text-center py-12 bg-muted/20 rounded-3xl border-2 border-dashed">
            <p className="text-muted-foreground font-bangla">Kono exam routine nai. Chill naki? 😏</p>
          </div>
        )}
      </div>
    </div>
  );
}
