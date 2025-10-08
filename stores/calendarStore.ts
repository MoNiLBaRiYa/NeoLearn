import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  subject: string;
  date: string;
  duration: number;
  xp: number;
  status: 'completed' | 'in-progress' | 'missed' | 'pending';
  type: 'study' | 'practice' | 'revision' | 'exam' | 'reminder';
  goalId?: string;
  isReminder?: boolean;
  reminderTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'course' | 'exam' | 'reminder';
  courseId?: string;
  examId?: string;
  dueDate?: string;
  description?: string;
}

interface CalendarState {
  tasks: Task[];
  events: CalendarEvent[];
  
  // Task management
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: Task['status']) => void;
  
  // Event management
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  
  // Utility functions
  getTasksForDate: (date: string) => Task[];
  getEventsForDate: (date: string) => CalendarEvent[];
  getTasksForDateRange: (startDate: string, endDate: string) => Task[];
  getUpcomingTasks: (days: number) => Task[];
  getOverdueTasks: () => Task[];
  
  // Statistics
  getCompletedTasksCount: (startDate?: string, endDate?: string) => number;
  getTotalXPEarned: (startDate?: string, endDate?: string) => number;
  getTaskCompletionRate: (startDate?: string, endDate?: string) => number;
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      tasks: [],
      events: [],

      // Task management
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask]
        }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          )
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id)
        }));
      },

      updateTaskStatus: (id, status) => {
        set((state) => ({
          tasks: state.tasks.map(task =>
            task.id === id
              ? { ...task, status, updatedAt: new Date().toISOString() }
              : task
          )
        }));
      },

      // Event management
      addEvent: (eventData) => {
        const newEvent: CalendarEvent = {
          ...eventData,
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        
        set((state) => {
          // Check if event already exists to prevent duplicates
          const existingEvent = state.events.find(e => e.id === eventData.id || 
            (e.courseId === eventData.courseId && e.examId === eventData.examId && e.date === eventData.date));
          
          if (existingEvent) {
            return state;
          }
          
          return {
            events: [...state.events, newEvent]
          };
        });
      },

      updateEvent: (id, updates) => {
        set((state) => ({
          events: state.events.map(event =>
            event.id === id ? { ...event, ...updates } : event
          )
        }));
      },

      deleteEvent: (id) => {
        set((state) => ({
          events: state.events.filter(event => event.id !== id)
        }));
      },

      // Utility functions with memoization
      getTasksForDate: (date) => {
        const { tasks } = get();
        return tasks.filter(task => task.date === date).sort((a, b) => {
          // Sort by status priority: pending -> in-progress -> completed -> missed
          const statusOrder = { 'pending': 0, 'in-progress': 1, 'completed': 2, 'missed': 3 };
          return statusOrder[a.status] - statusOrder[b.status];
        });
      },

      getEventsForDate: (date) => {
        const { events } = get();
        return events.filter(event => event.date === date).sort((a, b) => {
          // Sort by type priority: exam -> course -> reminder
          const typeOrder = { 'exam': 0, 'course': 1, 'reminder': 2 };
          return typeOrder[a.type] - typeOrder[b.type];
        });
      },

      getTasksForDateRange: (startDate, endDate) => {
        const { tasks } = get();
        return tasks.filter(task => {
          const taskDate = new Date(task.date);
          const start = new Date(startDate);
          const end = new Date(endDate);
          return taskDate >= start && taskDate <= end;
        });
      },

      getUpcomingTasks: (days) => {
        const { tasks } = get();
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);
        
        return tasks.filter(task => {
          const taskDate = new Date(task.date);
          return taskDate >= today && taskDate <= futureDate && task.status === 'pending';
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },

      getOverdueTasks: () => {
        const { tasks } = get();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return tasks.filter(task => {
          const taskDate = new Date(task.date);
          taskDate.setHours(0, 0, 0, 0);
          return taskDate < today && task.status === 'pending';
        });
      },

      // Statistics
      getCompletedTasksCount: (startDate, endDate) => {
        const { tasks } = get();
        let filteredTasks = tasks.filter(task => task.status === 'completed');
        
        if (startDate && endDate) {
          filteredTasks = filteredTasks.filter(task => {
            const taskDate = new Date(task.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return taskDate >= start && taskDate <= end;
          });
        }
        
        return filteredTasks.length;
      },

      getTotalXPEarned: (startDate, endDate) => {
        const { tasks } = get();
        let filteredTasks = tasks.filter(task => task.status === 'completed');
        
        if (startDate && endDate) {
          filteredTasks = filteredTasks.filter(task => {
            const taskDate = new Date(task.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return taskDate >= start && taskDate <= end;
          });
        }
        
        return filteredTasks.reduce((total, task) => total + task.xp, 0);
      },

      getTaskCompletionRate: (startDate, endDate) => {
        const { tasks } = get();
        let filteredTasks = tasks;
        
        if (startDate && endDate) {
          filteredTasks = tasks.filter(task => {
            const taskDate = new Date(task.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            return taskDate >= start && taskDate <= end;
          });
        }
        
        if (filteredTasks.length === 0) return 0;
        
        const completedTasks = filteredTasks.filter(task => task.status === 'completed').length;
        return Math.round((completedTasks / filteredTasks.length) * 100);
      },
    }),
    {
      name: 'calendar-storage',
    }
  )
);