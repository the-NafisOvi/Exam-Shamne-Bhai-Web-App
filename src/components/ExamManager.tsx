import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  Download, 
  Printer,
  Tag
} from "lucide-react";
import { Exam } from "../types";
import { format, parseISO, isBefore, addDays } from "date-fns";
import { motion } from "motion/react";
import jsPDF from "jspdf";
import { domToPng } from "modern-screenshot";
import { toast } from "sonner";

interface ExamManagerProps {
  exams: Exam[];
  onUpdate: (exams: Exam[]) => void;
}

export default function ExamManager({ exams, onUpdate }: ExamManagerProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newExam, setNewExam] = useState({ courseName: "", courseCode: "", date: "", time: "", type: "" });
  const routineRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  const addExam = () => {
    if (!newExam.courseName || !newExam.date) return;
    const exam: Exam = {
      id: Math.random().toString(36).substr(2, 9),
      courseName: newExam.courseName,
      courseCode: newExam.courseCode || "N/A",
      date: newExam.date,
      time: newExam.time,
      type: newExam.type || "সাধারণ"
    };
    onUpdate([...exams, exam]);
    setNewExam({ courseName: "", courseCode: "", date: "", time: "", type: "" });
    setIsAddOpen(false);
  };

  const deleteExam = (id: string) => {
    onUpdate(exams.filter(e => e.id !== id));
  };

  const downloadPDF = async () => {
    if (!tableRef.current || exams.length === 0) return;
    
    const toastId = toast.loading("PDF তৈরি হচ্ছে ভাই... একটু দাড়াও।");
    try {
      // Temporarily show the table for capturing
      const tableElement = tableRef.current;
      tableElement.style.display = "block";
      tableElement.style.position = "absolute";
      tableElement.style.left = "-9999px";
      tableElement.style.top = "0";
      
      const dataUrl = await domToPng(tableElement, {
        scale: 2,
        backgroundColor: "#ffffff"
      });
      
      tableElement.style.display = "none";
      
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Exam_Routine_Exam_Shamne_Bhai.pdf");
      toast.success("রুটিন ডাউনলোড হইছে ভাই! 📄", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("PDF বানাতে সমস্যা হইছে ভাই।", { id: toastId });
    }
  };

  const printRoutine = () => {
    window.print();
  };

  const sortedExams = [...exams].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="space-y-8 pb-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-2"
      >
        <div className="space-y-1">
          <h2 className="text-2xl font-black font-bangla tracking-tight">এক্সাম রুটিন</h2>
          <p className="text-xs text-muted-foreground font-bangla">সব এক্সাম এর হিসাব এখানে ভাই!</p>
        </div>
        
        <div className="flex flex-wrap gap-2 print:hidden">
          {exams.length > 0 && (
            <>
              <Button 
                variant="outline" 
                onClick={printRoutine}
                className="rounded-2xl gap-2 font-bangla soft-shadow h-12 px-4 border-2"
              >
                <Printer className="h-5 w-5" /> প্রিন্ট
              </Button>
              <Button 
                variant="outline" 
                onClick={downloadPDF}
                className="rounded-2xl gap-2 font-bangla soft-shadow h-12 px-4 border-2"
              >
                <Download className="h-5 w-5" /> PDF ডাউনলোড
              </Button>
            </>
          )}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger render={
              <Button className="rounded-2xl gap-2 font-bangla soft-shadow h-12 px-6">
                <Plus className="h-5 w-5" /> এক্সাম অ্যাড করো
              </Button>
            } />
            <DialogContent className="rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="font-bangla text-2xl font-black">নতুন এক্সাম অ্যাড করো</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="courseName" className="font-bangla font-bold">কোর্স এর নাম</Label>
                  <Input 
                    id="courseName" 
                    value={newExam.courseName} 
                    onChange={(e) => setNewExam({ ...newExam, courseName: e.target.value })}
                    placeholder="যেমন: Data Structures"
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="courseCode" className="font-bangla font-bold">কোর্স কোড</Label>
                  <Input 
                    id="courseCode" 
                    value={newExam.courseCode} 
                    onChange={(e) => setNewExam({ ...newExam, courseCode: e.target.value })}
                    placeholder="যেমন: CSE101"
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type" className="font-bangla font-bold">এক্সাম টাইপ</Label>
                  <Input 
                    id="type" 
                    value={newExam.type} 
                    onChange={(e) => setNewExam({ ...newExam, type: e.target.value })}
                    placeholder="যেমন: Midterm, Final, Quiz"
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date" className="font-bangla font-bold">তারিখ</Label>
                  <Input 
                    id="date" 
                    type="date"
                    value={newExam.date} 
                    onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                    className="rounded-xl h-12"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time" className="font-bangla font-bold">সময় (ঐচ্ছিক)</Label>
                  <Input 
                    id="time" 
                    type="time"
                    value={newExam.time} 
                    onChange={(e) => setNewExam({ ...newExam, time: e.target.value })}
                    className="rounded-xl h-12"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={addExam} className="w-full h-12 rounded-xl font-bangla font-bold text-lg">রুটিনে অ্যাড করো</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Routine Cards - Hidden during print */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:hidden">
        {sortedExams.map((exam, index) => {
          const examDate = parseISO(exam.date);
          const isSoon = isBefore(examDate, addDays(new Date(), 3));

          return (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`overflow-hidden rounded-[2.5rem] border-none soft-shadow hover:soft-shadow-lg transition-all ${isSoon ? 'bg-destructive/5' : 'bg-white dark:bg-card'} text-foreground`}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-xl font-black font-bangla tracking-tight text-foreground">{exam.courseName}</CardTitle>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-primary/20 text-primary">
                          {exam.courseCode}
                        </Badge>
                        {exam.type && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Tag className="h-3 w-3" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{exam.type}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteExam(exam.id)}
                      className="text-muted-foreground hover:text-destructive rounded-xl"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-2xl">
                    <div className="bg-primary/10 p-2 rounded-xl">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">এক্সাম তারিখ</p>
                      <p className="text-base font-bold text-foreground">{format(examDate, "PPP")}</p>
                    </div>
                  </div>
                  
                  {exam.time && (
                    <div className="flex items-center gap-3 p-3 bg-secondary/5 rounded-2xl">
                      <div className="bg-secondary/10 p-2 rounded-xl">
                        <Clock className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">এক্সাম সময়</p>
                        <p className="text-base font-bold text-foreground">{exam.time}</p>
                      </div>
                    </div>
                  )}
                  
                  {isSoon && (
                    <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-2xl animate-pulse">
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                      <p className="text-xs font-black font-bangla text-destructive uppercase tracking-tight">
                        ভাই, এক্সাম খুব কাছে! পড়া শুরু করো! 😨
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {exams.length === 0 && (
          <div className="col-span-full p-16 text-center bg-muted/5 rounded-[3rem] border-2 border-dashed border-muted-foreground/20">
            <div className="bg-muted/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Calendar className="h-10 w-10 text-muted-foreground opacity-40" />
            </div>
            <p className="text-muted-foreground font-bangla text-xl font-bold">কোনো এক্সাম রুটিন নাই। <br/> ভাই, তুমি কি পাস করে গেছো? 😂</p>
          </div>
        )}
      </div>

      {/* Routine Table - Visible during print or used for PDF */}
      <div 
        ref={tableRef} 
        className="hidden print:block bg-white p-8 text-black"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black font-bangla mb-2">এক্সাম রুটিন</h1>
          <p className="text-sm font-bangla text-gray-600">Exam Shamne Bhai - Nafis Ovi</p>
          <div className="mt-4 border-b-2 border-black w-24 mx-auto" />
        </div>

        <table className="w-full border-collapse border-2 border-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border-2 border-black p-3 text-left font-black font-bangla">তারিখ</th>
              <th className="border-2 border-black p-3 text-left font-black font-bangla">সময়</th>
              <th className="border-2 border-black p-3 text-left font-black font-bangla">কোর্স কোড</th>
              <th className="border-2 border-black p-3 text-left font-black font-bangla">কোর্স এর নাম</th>
              <th className="border-2 border-black p-3 text-left font-black font-bangla">টাইপ</th>
            </tr>
          </thead>
          <tbody>
            {sortedExams.map((exam) => (
              <tr key={exam.id}>
                <td className="border-2 border-black p-3 font-bold">{format(parseISO(exam.date), "dd MMM yyyy")}</td>
                <td className="border-2 border-black p-3">{exam.time || "N/A"}</td>
                <td className="border-2 border-black p-3 font-black">{exam.courseCode}</td>
                <td className="border-2 border-black p-3 font-bold">{exam.courseName}</td>
                <td className="border-2 border-black p-3">{exam.type}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-12 text-center text-[10px] text-gray-400 font-bangla">
          Generated by Exam Shamne Bhai App
        </div>
      </div>
    </div>
  );
}
