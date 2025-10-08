import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle,
  X,
  Bell,
  BookOpen,
  GraduationCap,
  Clock,
  Trash2,
  Calendar,
  Filter,
  TrendingUp,
  Star
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuthStore } from '../stores/authStore';
import { useCalendarStore, Task, CalendarEvent } from '../stores/calendarStore';
import toast from 'react-hot-toast';



const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [showStats, setShowStats] = useState(false);

  const { user, addXP } = useAuthStore();
  const {
    tasks,
    events: calendarEvents,
    addTask,
    addEvent,
    updateTaskStatus,
    deleteTask,
    getTasksForDate,
    getEventsForDate,
    getCompletedTasksCount,
    getTotalXPEarned,
    getTaskCompletionRate
  } = useCalendarStore();

  const subjects = useMemo(() => [
    'all', 'Database Management', 'Operating Systems', 'Data Structures', 'Computer Networks'
  ], []);

  // Generate calendar events from user's courses and exams
  useEffect(() => {
    if (user) {
      const events: CalendarEvent[] = [];

      // Add course due dates
      user.courses.forEach(course => {
        if (course.targetDate) {
          events.push({
            id: `course-${course.id}`,
            title: `${course.name} - Course Due`,
            date: course.targetDate,
            type: 'course',
            courseId: course.id,
            dueDate: course.targetDate
          });
        }
      });

      // Add exam dates
      user.exams.forEach(exam => {
        events.push({
          id: `exam-${exam.id}`,
          title: `${exam.name} - Exam`,
          date: exam.targetDate,
          type: 'exam',
          examId: exam.id,
          dueDate: exam.targetDate
        });
      });

      // Clear existing course/exam events and add new ones
      events.forEach(event => {
        const existingEvent = calendarEvents.find(e => e.id === event.id);
        if (!existingEvent) {
          addEvent(event);
        }
      });
    }
  }, [user, addEvent]);

  // Memoized utility functions for better performance
  const getDaysInMonth = useCallback((date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(), []);

  const getFirstDayOfMonth = useCallback((date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay(), []);

  const formatDate = useCallback((date: Date) =>
    date.toISOString().split('T')[0], []);

  const getTasksAndEventsForDate = useCallback((date: string) => {
    const dateTasks = getTasksForDate(date).filter(task =>
      selectedSubject === 'all' || task.subject === selectedSubject
    );
    const dateEvents = getEventsForDate(date);
    return { tasks: dateTasks, events: dateEvents };
  }, [getTasksForDate, getEventsForDate, selectedSubject]);

  // Memoized statistics
  const monthStats = useMemo(() => {
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0];

    return {
      completedTasks: getCompletedTasksCount(startOfMonth, endOfMonth),
      totalXP: getTotalXPEarned(startOfMonth, endOfMonth),
      completionRate: getTaskCompletionRate(startOfMonth, endOfMonth)
    };
  }, [currentDate, getCompletedTasksCount, getTotalXPEarned, getTaskCompletionRate]);

  const getStatusColor = useCallback((status: string) => {
    const colors = {
      'completed': 'bg-gradient-to-r from-green-500 to-green-600 shadow-green-200',
      'in-progress': 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-yellow-200',
      'missed': 'bg-gradient-to-r from-red-500 to-red-600 shadow-red-200',
      'default': 'bg-gradient-to-r from-gray-400 to-gray-500 shadow-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.default;
  }, []);

  const getEventColor = useCallback((type: string) => {
    const colors = {
      'course': 'bg-gradient-to-r from-blue-500 to-blue-600 shadow-blue-200',
      'exam': 'bg-gradient-to-r from-red-500 to-pink-600 shadow-red-200',
      'reminder': 'bg-gradient-to-r from-purple-500 to-purple-600 shadow-purple-200',
      'default': 'bg-gradient-to-r from-gray-500 to-gray-600 shadow-gray-200'
    };
    return colors[type as keyof typeof colors] || colors.default;
  }, []);

  // Function to get due date indicator for a specific date
  const getDueDateIndicator = useCallback((date: string) => {
    const dateEvents = getEventsForDate(date);
    const examEvents = dateEvents.filter(event => event.type === 'exam');
    const courseEvents = dateEvents.filter(event => event.type === 'course');

    // Priority: Exam (red) > Course (green) > Multiple (purple)
    if (examEvents.length > 0) {
      return {
        color: 'border-red-500 bg-red-50 dark:bg-red-900/20',
        ringColor: 'ring-red-400',
        type: 'exam',
        events: examEvents,
        title: examEvents.length === 1 ? examEvents[0].title : `${examEvents.length} Exams Due`
      };
    } else if (courseEvents.length > 0) {
      return {
        color: 'border-green-500 bg-green-50 dark:bg-green-900/20',
        ringColor: 'ring-green-400',
        type: 'course',
        events: courseEvents,
        title: courseEvents.length === 1 ? courseEvents[0].title : `${courseEvents.length} Courses Due`
      };
    } else if (dateEvents.length > 0) {
      return {
        color: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
        ringColor: 'ring-purple-400',
        type: 'reminder',
        events: dateEvents,
        title: dateEvents.length === 1 ? dateEvents[0].title : `${dateEvents.length} Reminders`
      };
    }
    return null;
  }, [getEventsForDate]);

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
  };

  const handleAddTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTask(taskData);
    setIsTaskModalOpen(false);
    toast.success('✨ Task added successfully!', {
      icon: '📝',
      style: { borderRadius: '10px', background: '#10B981', color: '#fff' }
    });
  }, [addTask]);

  const handleAddReminder = useCallback((reminderData: { title: string; date: string; time: string }) => {
    const reminderTask: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
      title: reminderData.title,
      subject: 'Reminder',
      date: reminderData.date,
      duration: 0,
      xp: 0,
      status: 'pending',
      type: 'reminder',
      isReminder: true,
      reminderTime: reminderData.time
    };
    addTask(reminderTask);
    setIsReminderModalOpen(false);
    toast.success('🔔 Reminder set successfully!', {
      icon: '⏰',
      style: { borderRadius: '10px', background: '#8B5CF6', color: '#fff' }
    });
  }, [addTask]);

  const handleTaskStatusChange = useCallback((taskId: string, newStatus: 'completed' | 'in-progress' | 'missed') => {
    const task = tasks.find(t => t.id === taskId);
    if (task && newStatus === 'completed' && task.status !== 'completed' && task.xp > 0) {
      addXP(task.xp);
      toast.success(`🎉 Task completed! +${task.xp} XP`, {
        icon: '⭐',
        style: { borderRadius: '10px', background: '#059669', color: '#fff' }
      });
    }
    updateTaskStatus(taskId, newStatus);
  }, [tasks, addXP, updateTaskStatus]);

  const handleDeleteTask = useCallback((taskId: string) => {
    deleteTask(taskId);
    toast.success('🗑️ Task deleted', {
      style: { borderRadius: '10px', background: '#EF4444', color: '#fff' }
    });
  }, [deleteTask]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderCalendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <motion.div
          key={`empty-${i}`}
          className="h-36 border border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.01 }}
        />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
      const { tasks: dayTasks, events: dayEvents } = getTasksAndEventsForDate(dateStr);
      const isToday = dateStr === formatDate(new Date());
      const isSelected = selectedDate && dateStr === formatDate(selectedDate);
      const hasItems = dayTasks.length > 0 || dayEvents.length > 0;
      const dueDateIndicator = getDueDateIndicator(dateStr);

      days.push(
        <motion.div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`group relative h-36 border border-gray-100 dark:border-gray-800 p-3 cursor-pointer 
            hover:shadow-lg hover:scale-[1.02] transition-all duration-200 overflow-hidden
            ${isToday
              ? 'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/20 border-primary-200 shadow-primary-100'
              : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800'
            } 
            ${isSelected ? 'ring-2 ring-primary-400 shadow-lg' : ''}
            ${hasItems ? 'border-l-4 border-l-primary-400' : ''}
          `}
          role="button"
          tabIndex={0}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (firstDay + day - 1) * 0.02 }}
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="relative">
              <span className={`text-sm font-semibold relative z-10 ${isToday
                ? 'text-primary-700 dark:text-primary-300'
                : dueDateIndicator
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-900 dark:text-white'
                }`}>
                {day}
              </span>

              {/* Due Date Circle Indicator with Tooltip */}
              {dueDateIndicator && (
                <motion.div
                  className={`absolute inset-0 w-8 h-8 -m-1 rounded-full border-2 ${dueDateIndicator.color} ${dueDateIndicator.ringColor} ring-2 ring-opacity-50 flex items-center justify-center group/tooltip`}
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{
                    delay: (firstDay + day - 1) * 0.02 + 0.2,
                    type: "spring",
                    stiffness: 300,
                    damping: 20
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  title={dueDateIndicator.title}
                >
                  {dueDateIndicator.type === 'exam' && <GraduationCap className="w-3 h-3 text-red-600 dark:text-red-400" />}
                  {dueDateIndicator.type === 'course' && <BookOpen className="w-3 h-3 text-green-600 dark:text-green-400" />}
                  {dueDateIndicator.type === 'reminder' && <Bell className="w-3 h-3 text-purple-600 dark:text-purple-400" />}

                  {/* Custom Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {dueDateIndicator.title}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100"></div>
                  </div>
                </motion.div>
              )}
            </div>


            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                  setIsTaskModalOpen(true);
                }}
                className="p-1.5 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-full transition-all duration-200"
                title="Add Task"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-3 h-3 text-primary-600" />
              </motion.button>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
                  setIsReminderModalOpen(true);
                }}
                className="p-1.5 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full transition-all duration-200"
                title="Add Reminder"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-3 h-3 text-purple-600" />
              </motion.button>
            </div>
          </div>

          <div className="space-y-1.5">
            <AnimatePresence>
              {/* Render events */}
              {dayEvents.slice(0, 2).map((event, index) => (
                <motion.div
                  key={event.id}
                  className={`text-xs px-2 py-1.5 rounded-lg text-white truncate shadow-sm ${getEventColor(event.type)}`}
                  title={event.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-1">
                    {event.type === 'course' && <BookOpen className="w-3 h-3" />}
                    {event.type === 'exam' && <GraduationCap className="w-3 h-3" />}
                    <span className="truncate">{event.title}</span>
                  </div>
                </motion.div>
              ))}

              {/* Render tasks */}
              {dayTasks.slice(0, 3 - dayEvents.length).map((task, index) => (
                <motion.div
                  key={task.id}
                  className={`text-xs px-2 py-1.5 rounded-lg text-white truncate shadow-sm ${getStatusColor(task.status)}`}
                  title={task.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: (dayEvents.length + index) * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center gap-1">
                    {task.isReminder && <Bell className="w-3 h-3" />}
                    {task.status === 'completed' && <Star className="w-3 h-3" />}
                    <span className="truncate">{task.title}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Show more indicator */}
            {(dayTasks.length + dayEvents.length) > 3 && (
              <motion.div
                className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                +{(dayTasks.length + dayEvents.length) - 3} more
              </motion.div>
            )}
          </div>
        </motion.div>
      );
    }

    return days;
  }, [currentDate, selectedDate, getTasksAndEventsForDate, formatDate, getDaysInMonth, getFirstDayOfMonth, getStatusColor, getEventColor, handleDateClick]);

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Study Calendar
              </motion.h1>
              <motion.p
                className="text-gray-600 dark:text-gray-400 mt-2 text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Track your study schedule, reminders, and important dates
              </motion.p>
            </div>
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button
                onClick={goToToday}
                className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Calendar className="w-4 h-4" />
                Today
              </motion.button>
              <motion.button
                onClick={() => setShowStats(!showStats)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <TrendingUp className="w-4 h-4" />
                Stats
              </motion.button>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg">
                <motion.button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${viewMode === 'month'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Month
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('week')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${viewMode === 'week'
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Week
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Panel */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Completed Tasks</p>
                    <p className="text-3xl font-bold">{monthStats.completedTasks}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total XP Earned</p>
                    <p className="text-3xl font-bold">{monthStats.totalXP}</p>
                  </div>
                  <Star className="w-8 h-8 text-purple-200" />
                </div>
              </motion.div>

              <motion.div
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg"
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Completion Rate</p>
                    <p className="text-3xl font-bold">{monthStats.completionRate}%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-200" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Due Date Legend - Always visible */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Due Date Indicators
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-red-500 bg-red-50 dark:bg-red-900/20 ring-1 ring-red-400 ring-opacity-50 flex items-center justify-center">
                <GraduationCap className="w-3 h-3 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">Exam Due</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-green-500 bg-green-50 dark:bg-green-900/20 ring-1 ring-green-400 ring-opacity-50 flex items-center justify-center">
                <BookOpen className="w-3 h-3 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">Course Due</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20 ring-1 ring-purple-400 ring-opacity-50 flex items-center justify-center">
                <Bell className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">Reminder</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Calendar Navigation */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-8 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => navigateMonth('prev')}
                className="p-3 hover:bg-white dark:hover:bg-gray-600 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.button>

              {/* Month Selector */}
              <select
                value={currentDate.getMonth()}
                onChange={(e) => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(parseInt(e.target.value));
                  setCurrentDate(newDate);
                }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-semibold"
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'long' })}
                  </option>
                ))}
              </select>

              {/* Year Selector */}
              <select
                value={currentDate.getFullYear()}
                onChange={(e) => {
                  const newDate = new Date(currentDate);
                  newDate.setFullYear(parseInt(e.target.value));
                  setCurrentDate(newDate);
                }}
                className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 font-semibold"
              >
                {(() => {
                  const currentYear = new Date().getFullYear();
                  const startYear = 2000;
                  const endYear = currentYear + 5; // Include 5 future years
                  const years = [];

                  for (let year = endYear; year >= startYear; year--) {
                    years.push(
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  }

                  return years;
                })()}
              </select>

              <motion.button
                onClick={() => navigateMonth('next')}
                className="p-3 hover:bg-white dark:hover:bg-gray-600 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </motion.button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="pl-12 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            <motion.div
              className="grid grid-cols-7 gap-2 rounded-2xl overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {/* Day headers */}
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
                <motion.div
                  key={day}
                  className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 p-4 text-center font-semibold text-gray-800 dark:text-gray-200 rounded-lg"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.05 }}
                >
                  <span className="hidden sm:block">{day}</span>
                  <span className="sm:hidden">{day.slice(0, 3)}</span>
                </motion.div>
              ))}
              {/* Calendar days */}
              {renderCalendarDays}
            </motion.div>
          </div>
        </motion.div>

        {/* Selected Date Details */}
        <AnimatePresence>
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <motion.h3
                    className="text-2xl font-bold text-gray-900 dark:text-white"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    {selectedDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </motion.h3>
                  <motion.p
                    className="text-gray-500 dark:text-gray-400 mt-1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {(() => {
                      const { tasks: dayTasks, events: dayEvents } = getTasksAndEventsForDate(formatDate(selectedDate));
                      return `${dayTasks.length + dayEvents.length} items scheduled`;
                    })()}
                  </motion.p>
                </div>
                <motion.div
                  className="flex gap-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Task
                  </motion.button>
                  <motion.button
                    onClick={() => setIsReminderModalOpen(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="w-4 h-4" />
                    Add Reminder
                  </motion.button>
                </motion.div>
              </div>

              <div className="space-y-4">
                {(() => {
                  const { tasks: dayTasks, events: dayEvents } = getTasksAndEventsForDate(formatDate(selectedDate));

                  if (dayTasks.length === 0 && dayEvents.length === 0) {
                    return (
                      <motion.div
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                          No tasks or events scheduled for this date
                        </p>
                        <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                          Click the buttons above to add your first task or reminder
                        </p>
                      </motion.div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      {/* Events */}
                      <AnimatePresence>
                        {dayEvents.map((event, index) => (
                          <motion.div
                            key={event.id}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className={`w-4 h-4 rounded-full shadow-lg ${getEventColor(event.type).replace('bg-gradient-to-r', 'bg-gradient-to-br')}`}></div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{event.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                                {event.type === 'course' && <><BookOpen className="w-4 h-4" /> Course Due Date</>}
                                {event.type === 'exam' && <><GraduationCap className="w-4 h-4" /> Exam Date</>}
                              </p>
                            </div>
                            <div className="text-right">
                              {event.type === 'course' && <BookOpen className="w-6 h-6 text-blue-500" />}
                              {event.type === 'exam' && <GraduationCap className="w-6 h-6 text-red-500" />}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* Tasks */}
                      <AnimatePresence>
                        {dayTasks.map((task, index) => (
                          <motion.div
                            key={task.id}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-200"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: (dayEvents.length + index) * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className={`w-4 h-4 rounded-full shadow-lg ${getStatusColor(task.status).replace('bg-gradient-to-r', 'bg-gradient-to-br')}`}></div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                                {task.title}
                                {task.status === 'completed' && <Star className="w-4 h-4 text-yellow-500" />}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {task.isReminder ? (
                                  <span className="flex items-center gap-2">
                                    <Bell className="w-4 h-4" />
                                    Reminder{task.reminderTime ? ` at ${task.reminderTime}` : ''}
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-4">
                                    <span>{task.subject}</span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {task.duration}h
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Star className="w-3 h-3" />
                                      {task.xp} XP
                                    </span>
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {!task.isReminder && (
                                <>
                                  <motion.button
                                    onClick={() => handleTaskStatusChange(task.id, 'completed')}
                                    className={`p-2 rounded-xl transition-all duration-200 ${task.status === 'completed'
                                      ? 'bg-green-100 text-green-600 shadow-md'
                                      : 'hover:bg-green-100 text-gray-400 hover:text-green-600'
                                      }`}
                                    title="Mark as completed"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <CheckCircle className="w-5 h-5" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleTaskStatusChange(task.id, 'in-progress')}
                                    className={`p-2 rounded-xl transition-all duration-200 ${task.status === 'in-progress'
                                      ? 'bg-yellow-100 text-yellow-600 shadow-md'
                                      : 'hover:bg-yellow-100 text-gray-400 hover:text-yellow-600'
                                      }`}
                                    title="Mark as in progress"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Clock className="w-5 h-5" />
                                  </motion.button>
                                </>
                              )}
                              <motion.button
                                onClick={() => handleDeleteTask(task.id)}
                                className="p-2 rounded-xl hover:bg-red-100 text-gray-400 hover:text-red-600 transition-all duration-200"
                                title="Delete task"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Trash2 className="w-5 h-5" />
                              </motion.button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task Modal */}
        {isTaskModalOpen && selectedDate && (
          <TaskModal
            date={selectedDate}
            onClose={() => setIsTaskModalOpen(false)}
            onSave={handleAddTask}
          />
        )}

        {/* Reminder Modal */}
        {isReminderModalOpen && selectedDate && (
          <ReminderModal
            date={selectedDate}
            onClose={() => setIsReminderModalOpen(false)}
            onSave={handleAddReminder}
          />
        )}
      </main>
    </div>
  );
};

// Task Modal Component
const TaskModal: React.FC<{
  date: Date;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
}> = ({ date, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    duration: 1,
    xp: 10,
    type: 'study' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.subject.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    onSave({
      ...formData,
      date: date.toISOString().split('T')[0],
      status: 'pending'
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add Task</h3>
          <motion.button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter subject"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Duration (hours)
              </label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                XP Reward
              </label>
              <input
                type="number"
                min="0"
                value={formData.xp}
                onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Task Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="study">Study</option>
              <option value="practice">Practice</option>
              <option value="revision">Revision</option>
              <option value="exam">Exam</option>
            </select>
          </div>

          <div className="flex gap-4 pt-6">
            <motion.button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Task
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

// Reminder Modal Component
const ReminderModal: React.FC<{
  date: Date;
  onClose: () => void;
  onSave: (reminder: { title: string; date: string; time: string }) => void;
}> = ({ date, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    time: '09:00'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a reminder title');
      return;
    }

    onSave({
      title: formData.title,
      date: date.toISOString().split('T')[0],
      time: formData.time
    });
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add Reminder</h3>
          <motion.button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Reminder Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter reminder title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex gap-4 pt-6">
            <motion.button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add Reminder
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CalendarPage;