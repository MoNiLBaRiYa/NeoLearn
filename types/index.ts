export interface User {
  id: string;
  email: string;
  name: string;
  disabilityType: string;
  profilePicture?: string;
  quote?: string;
  age?: number;
  ambition?: string;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  courses: Course[];
  exams: Exam[];
  onboardingCompleted: boolean;
}

export interface Course {
  id: string;
  name: string;
  progress: number;
  targetDate?: string;
  syllabus: string[];
  completedTopics: string[];
  timetable: TimetableEntry[];
}

export interface Exam {
  id: string;
  name: string;
  progress: number;
  targetDate: string;
  syllabus: string[];
  completedTopics: string[];
  timetable: TimetableEntry[];
}

export interface TimetableEntry {
  id: string;
  title: string;
  date: string;
  time: string;
  type: 'study' | 'revision' | 'practice' | 'exam';
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  isPublic: boolean;
  uploadDate: string;
  size: string;
  rating: number;
  downloads: number;
  subject: string;
  type: 'pdf' | 'doc' | 'txt';
  content?: string;
  tags: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
  xpReward: number;
}