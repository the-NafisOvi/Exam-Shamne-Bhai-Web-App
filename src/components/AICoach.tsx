import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, MessageSquareQuote } from "lucide-react";
import { Task, Exam } from "../types";
import { getStudySuggestion } from "../lib/gemini";
import { motion, AnimatePresence } from "motion/react";

interface AICoachProps {
  tasks: Task[];
  exams: Exam[];
}

export default function AICoach({ tasks, exams }: AICoachProps) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSuggestion = async () => {
    setLoading(true);
    const taskTitles = tasks.filter(t => !t.completed).map(t => t.title);
    const examSubjects = exams.map(e => e.subject);
    
    const result = await getStudySuggestion(taskTitles, examSubjects);
    setSuggestion(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold font-bangla">AI Suggestion</h2>
        <p className="text-sm text-muted-foreground font-bangla">
          Bhai, ki porba bujhteso na? AI ke jigges koro!
        </p>
      </div>

      <Card className="border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent max-w-2xl mx-auto">
        <CardContent className="p-8 flex flex-col items-center justify-center space-y-6">
          <div className="bg-primary/10 p-4 rounded-full text-primary animate-pulse">
            <Sparkles className="h-10 w-10" />
          </div>
          
          <AnimatePresence mode="wait">
            {suggestion ? (
              <motion.div 
                key="suggestion"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-4"
              >
                <div className="relative p-6 bg-background border rounded-2xl shadow-sm">
                  <MessageSquareQuote className="absolute -top-3 -left-3 h-8 w-8 text-primary/20" />
                  <p className="text-lg font-medium font-bangla leading-relaxed">
                    {suggestion}
                  </p>
                </div>
                <Button variant="outline" onClick={fetchSuggestion} disabled={loading} className="font-bangla">
                  Aro ekta suggestion dao
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="initial"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4"
              >
                <p className="text-muted-foreground font-bangla">
                  AI suggest korbe ajke tomar ki kora uchit.
                </p>
                <Button onClick={fetchSuggestion} disabled={loading} className="rounded-full px-8 font-bangla">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                  Suggestion Nao
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <div className="p-4 bg-muted/30 rounded-2xl border border-dashed text-center">
        <p className="text-xs text-muted-foreground italic font-bangla">
          "Pora lekha kore je, gari ghora chore se... <br/> kintu bhai, exam shamne, ekhon pora chara upai nai!"
        </p>
      </div>
    </div>
  );
}
