export interface Task {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  completed: boolean;
}

export interface Topic {
  id: string;
  title: string;
  completed: boolean;
}

export interface Course {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Exam {
  id: string;
  subject: string;
  date: string;
  time: string;
}

export interface AppData {
  tasks: Task[];
  courses: Course[];
  exams: Exam[];
  streak: number;
  lastStudyDate: string | null;
}
