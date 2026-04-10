import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brain, ArrowRight, Loader2 } from "lucide-react";
import { Task, Exam } from "../types";
import { getStudySuggestion } from "../lib/gemini";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";

interface AICoachProps {
  tasks: Task[];
  exams: Exam[];
}

export default function AICoach({ tasks, exams }: AICoachProps) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestion = async () => {
    setIsLoading(true);
    try {
      const result = await getStudySuggestion(tasks, exams);
      setSuggestion(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black font-bangla tracking-tight">AI স্টাডি কোচ</h2>
        <p className="text-muted-foreground font-bangla">Gemini AI দিয়ে পড়া-লেখার প্ল্যান করো ভাই! 🧠</p>
      </div>

      <Card className="rounded-[3rem] border-none soft-shadow-lg overflow-hidden card-gradient-purple text-white">
        <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
          <div className="bg-white/20 p-4 rounded-[2rem] backdrop-blur-md">
            <Brain className="h-12 w-12" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black font-bangla">কিভাবে পড়বো ভাই?</h3>
            <p className="opacity-80 text-sm font-bangla">তোমার পেন্ডিং কাজ আর এক্সাম রুটিন চেক করে AI একটা প্ল্যান দিবে।</p>
          </div>
          <Button 
            onClick={fetchSuggestion} 
            disabled={isLoading}
            className="bg-white text-purple-600 hover:bg-white/90 h-14 px-8 rounded-2xl font-black text-lg soft-shadow transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> চিন্তা করতেছি...</>
            ) : (
              <><Sparkles className="mr-2 h-5 w-5" /> প্ল্যান দাও ভাই</>
            )}
          </Button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {suggestion && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 px-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-black font-bangla tracking-tight">AI এর সাজেশন</h3>
            </div>
            <Card className="rounded-[2.5rem] border-none soft-shadow-lg overflow-hidden text-foreground">
              <CardContent className="p-8 prose prose-sm dark:prose-invert max-w-none">
                <div className="markdown-body font-bangla text-base leading-relaxed text-foreground">
                  <ReactMarkdown>{suggestion}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!suggestion && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-white dark:bg-card rounded-[2rem] soft-shadow flex items-center gap-4 text-foreground"
          >
            <div className="bg-blue-100 dark:bg-blue-950/30 p-3 rounded-2xl">
              <ArrowRight className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs font-bold font-bangla">পেন্ডিং কাজগুলো প্রায়োরিটি অনুযায়ী প্ল্যান করো।</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-6 bg-white dark:bg-card rounded-[2rem] soft-shadow flex items-center gap-4 text-foreground"
          >
            <div className="bg-orange-100 dark:bg-orange-950/30 p-3 rounded-2xl">
              <ArrowRight className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-xs font-bold font-bangla">এক্সাম এর কত দিন বাকি সেটা AI মাথায় রাখবে।</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
