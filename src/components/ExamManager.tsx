import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
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
import { db, collection, addDoc, deleteDoc, doc, OperationType, handleFirestoreError } from "../lib/firebase";

interface ExamManagerProps {
  exams: Exam[];
  uid: string;
}

export default function ExamManager({ exams, uid }: ExamManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newExam, setNewExam] = useState({ subject: "", date: "", time: "" });

  const addExam = async () => {
    if (!newExam.subject || !newExam.date) return;
    try {
      await addDoc(collection(db, "exams"), {
        uid: uid,
        subject: newExam.subject,
        date: newExam.date,
        time: newExam.time
      });
      setNewExam({ subject: "", date: "", time: "" });
      setIsAddOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, "exams");
    }
  };

  const deleteExam = async (id: string) => {
    try {
      await deleteDoc(doc(db, "exams", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `exams/${id}`);
    }
  };

  const sortedExams = [...exams].sort((a, b) => a.date.localeCompare(b.date));

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
                <Label htmlFor="subject" className="font-bangla">Subject</Label>
                <Input 
                  id="subject" 
                  value={newExam.subject} 
                  onChange={(e) => setNewExam({ ...newExam, subject: e.target.value })}
                  placeholder="e.g., Physics"
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
                <Label htmlFor="time" className="font-bangla">Time (Optional)</Label>
                <Input 
                  id="time" 
                  type="time"
                  value={newExam.time} 
                  onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addExam} className="w-full font-bangla">Routine e Add Koro</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedExams.map(exam => {
          const examDate = parseISO(exam.date);
          const isSoon = isBefore(examDate, addDays(new Date(), 3));

          return (
            <Card key={exam.id} className={`overflow-hidden border-2 ${isSoon ? 'border-destructive/30 bg-destructive/5' : 'border-primary/10'}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold font-bangla">{exam.subject}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => deleteExam(exam.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="font-medium">{format(examDate, "PPP")}</span>
                </div>
                {exam.time && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-primary" />
                    <span>{exam.time}</span>
                  </div>
                )}
                {isSoon && (
                  <div className="flex items-center gap-2 text-xs text-destructive font-bold font-bangla bg-destructive/10 p-2 rounded-lg">
                    <AlertTriangle className="h-4 w-4" />
                    Bhai, exam khub kase! Pora shuru koro! 😨
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        {exams.length === 0 && (
          <div className="col-span-full p-12 text-center bg-muted/20 rounded-3xl border-2 border-dashed">
            <p className="text-muted-foreground font-bangla">Kono exam routine nai. <br/> Bhai, tumi ki pass kora geso? 😂</p>
          </div>
        )}
      </div>
    </div>
  );
}
