import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Target,
  BookOpen,
  Download,
  Volume2,
  RefreshCw,
  Star,
  Flame,
  Trophy,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface SubjectProgress {
  name: string;
  progress: number;
  totalTopics: number;
  completedTopics: number;
  timeSpent: number;
}

interface WeeklyActivity {
  day: string;
  hours: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

interface TaskItem {
  id: string;
  title: string;
  subject: string;
  status: 'completed' | 'missed' | 'pending';
  date: string;
  xpEarned?: number;
}

const ProgressPage: React.FC = () => {
  const { speak } = useAccessibilityStore();
  const { user } = useAuthStore();
  const [isExporting, setIsExporting] = useState(false);

  // Mock data for demonstration
  const overallProgress = 67;
  const currentStreak = 6;
  const totalXP = 2450;
  const xpGoal = 3000;
  const weeklyGoal = 25;
  const weeklyCompleted = 18;

  const subjectProgress: SubjectProgress[] = [
    { name: 'Operating Systems', progress: 85, totalTopics: 25, completedTopics: 21, timeSpent: 45 },
    { name: 'Database Management', progress: 75, totalTopics: 20, completedTopics: 15, timeSpent: 32 },
    { name: 'Data Structures', progress: 60, totalTopics: 30, completedTopics: 18, timeSpent: 28 },
    { name: 'Computer Networks', progress: 45, totalTopics: 25, completedTopics: 11, timeSpent: 20 },
    { name: 'Algorithms', progress: 30, totalTopics: 35, completedTopics: 10, timeSpent: 15 }
  ];

  const weeklyActivity: WeeklyActivity[] = [
    { day: 'Mon', hours: 3.5 },
    { day: 'Tue', hours: 2.8 },
    { day: 'Wed', hours: 4.2 },
    { day: 'Thu', hours: 1.5 },
    { day: 'Fri', hours: 3.8 },
    { day: 'Sat', hours: 2.2 },
    { day: 'Sun', hours: 0 }
  ];

  const achievements: Achievement[] = [
    { id: '1', name: 'First Steps', description: 'Complete your first topic', icon: '🎯', earned: true, earnedDate: '2024-01-15' },
    { id: '2', name: 'Week Warrior', description: 'Study for 7 consecutive days', icon: '🔥', earned: true, earnedDate: '2024-01-20' },
    { id: '3', name: 'Knowledge Seeker', description: 'Complete 50 topics', icon: '📚', earned: true, earnedDate: '2024-02-01' },
    { id: '4', name: 'XP Master', description: 'Earn 1000 XP', icon: '⭐', earned: true, earnedDate: '2024-02-10' },
    { id: '5', name: 'Subject Expert', description: 'Complete a full subject', icon: '🏆', earned: false },
    { id: '6', name: 'Marathon Runner', description: 'Study for 30 consecutive days', icon: '🏃', earned: false }
  ];

  const recentTasks: TaskItem[] = [
    { id: '1', title: 'Process Synchronization', subject: 'Operating Systems', status: 'completed', date: '2024-01-25', xpEarned: 25 },
    { id: '2', title: 'SQL Joins Practice', subject: 'Database Management', status: 'completed', date: '2024-01-25', xpEarned: 20 },
    { id: '3', title: 'Binary Trees', subject: 'Data Structures', status: 'missed', date: '2024-01-24' },
    { id: '4', title: 'TCP/IP Protocol', subject: 'Computer Networks', status: 'pending', date: '2024-01-26' },
    { id: '5', title: 'Sorting Algorithms', subject: 'Algorithms', status: 'completed', date: '2024-01-23', xpEarned: 30 }
  ];

  const handleReadProgress = () => {
    const progressText = `Your overall progress is ${overallProgress}%. You have a ${currentStreak} day streak. 
    You've earned ${totalXP} XP out of your ${xpGoal} XP goal. 
    This week you've completed ${weeklyCompleted} hours out of ${weeklyGoal} hours planned.
    Your top performing subject is ${subjectProgress[0].name} at ${subjectProgress[0].progress}%.
    You have ${achievements.filter(a => a.earned).length} achievements earned out of ${achievements.length} total.`;
    
    speak(progressText);
    toast.success('Reading progress aloud');
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    
    try {
      const reportData = {
        generatedDate: new Date().toISOString(),
        user: user?.name || 'Student',
        overallProgress,
        currentStreak,
        totalXP,
        xpGoal,
        weeklyProgress: {
          completed: weeklyCompleted,
          goal: weeklyGoal,
          percentage: Math.round((weeklyCompleted / weeklyGoal) * 100)
        },
        subjectProgress,
        weeklyActivity,
        achievements: achievements.filter(a => a.earned),
        recentTasks,
        summary: {
          totalTopics: subjectProgress.reduce((sum, subject) => sum + subject.totalTopics, 0),
          completedTopics: subjectProgress.reduce((sum, subject) => sum + subject.completedTopics, 0),
          totalTimeSpent: subjectProgress.reduce((sum, subject) => sum + subject.timeSpent, 0),
          completedTasks: recentTasks.filter(task => task.status === 'completed').length,
          missedTasks: recentTasks.filter(task => task.status === 'missed').length
        }
      };

      const reportText = `
NeoLearn Progress Report
Generated: ${new Date().toLocaleDateString()}
Student: ${user?.name || 'Student'}

OVERALL PROGRESS
================
Overall Completion: ${overallProgress}%
Current Streak: ${currentStreak} days
Total XP Earned: ${totalXP}/${xpGoal}
Weekly Progress: ${weeklyCompleted}/${weeklyGoal} hours (${Math.round((weeklyCompleted / weeklyGoal) * 100)}%)

SUBJECT BREAKDOWN
=================
${subjectProgress.map(subject => 
  `${subject.name}: ${subject.progress}% (${subject.completedTopics}/${subject.totalTopics} topics, ${subject.timeSpent}h)`
).join('\n')}

WEEKLY ACTIVITY
===============
${weeklyActivity.map(day => `${day.day}: ${day.hours}h`).join('\n')}

ACHIEVEMENTS EARNED
===================
${achievements.filter(a => a.earned).map(achievement => 
  `${achievement.icon} ${achievement.name} - ${achievement.description} (${achievement.earnedDate})`
).join('\n')}

RECENT TASKS
============
${recentTasks.map(task => 
  `${task.title} (${task.subject}) - ${task.status.toUpperCase()}${task.xpEarned ? ` - ${task.xpEarned} XP` : ''}`
).join('\n')}

SUMMARY STATISTICS
==================
Total Topics: ${reportData.summary.totalTopics}
Completed Topics: ${reportData.summary.completedTopics}
Total Study Time: ${reportData.summary.totalTimeSpent} hours
Completed Tasks: ${reportData.summary.completedTasks}
Missed Tasks: ${reportData.summary.missedTasks}
      `;

      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `neolearn-progress-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Progress report exported successfully');
      speak('Progress report has been exported and downloaded');
    } catch (error) {
      toast.error('Failed to export report');
      speak('Failed to export progress report');
    } finally {
      setIsExporting(false);
    }
  };

  const handleRescheduleMissedTasks = () => {
    const missedTasks = recentTasks.filter(task => task.status === 'missed');
    if (missedTasks.length === 0) {
      toast.info('No missed tasks to reschedule');
      speak('No missed tasks found to reschedule');
      return;
    }

    // Simulate rescheduling missed tasks to tomorrow
    toast.success(`Rescheduled ${missedTasks.length} missed tasks to tomorrow`);
    speak(`${missedTasks.length} missed tasks have been rescheduled to tomorrow`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Progress Overview
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Track your learning journey and achievements
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handleReadProgress}
                className="btn btn-secondary flex items-center space-x-2"
                aria-label="Read progress aloud"
              >
                <Volume2 className="w-5 h-5" />
                <span>Read Progress</span>
              </button>
              
              <button
                onClick={handleExportReport}
                disabled={isExporting}
                className="btn btn-primary flex items-center space-x-2"
                aria-label="Export progress report"
              >
                <Download className="w-5 h-5" />
                <span>{isExporting ? 'Exporting...' : 'Export Report'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="card p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">{overallProgress}%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</p>
          </motion.div>

          <motion.div 
            className="card p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-achievement-100 dark:bg-achievement-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flame className="w-8 h-8 text-achievement-600" />
            </div>
            <div className="text-3xl font-bold text-achievement-600 mb-2">{currentStreak}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
          </motion.div>

          <motion.div 
            className="card p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-16 h-16 bg-learning-100 dark:bg-learning-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-learning-600" />
            </div>
            <div className="text-3xl font-bold text-learning-600 mb-2">{totalXP}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
          </motion.div>

          <motion.div 
            className="card p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-600 mb-2">{weeklyCompleted}h</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Subject Progress */}
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-primary-600" />
              <span>Subject Progress</span>
            </h3>
            
            <div className="space-y-4">
              {subjectProgress.map((subject, index) => (
                <div key={subject.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {subject.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {subject.progress}% ({subject.completedTopics}/{subject.totalTopics})
                    </span>
                  </div>
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill bg-primary-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${subject.progress}%` }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                    />
                  </div>
                  <div className="text-xs text-gray-400">
                    {subject.timeSpent} hours spent
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weekly Activity */}
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-learning-600" />
              <span>Weekly Activity</span>
            </h3>
            
            <div className="space-y-4">
              {weeklyActivity.map((day, index) => (
                <div key={day.day} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600 dark:text-gray-400">
                    {day.day}
                  </div>
                  <div className="flex-1">
                    <div className="progress-bar h-6">
                      <motion.div 
                        className="progress-fill bg-learning-500 flex items-center justify-end pr-2"
                        initial={{ width: 0 }}
                        animate={{ width: `${(day.hours / 5) * 100}%` }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                      >
                        {day.hours > 0 && (
                          <span className="text-xs text-white font-medium">
                            {day.hours}h
                          </span>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-learning-50 dark:bg-learning-900/20 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-learning-800 dark:text-learning-200">
                  Weekly Goal Progress
                </span>
                <span className="text-sm text-learning-600">
                  {weeklyCompleted}/{weeklyGoal} hours
                </span>
              </div>
              <div className="progress-bar mt-2">
                <div 
                  className="progress-fill bg-learning-500"
                  style={{ width: `${(weeklyCompleted / weeklyGoal) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* XP Progress */}
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Award className="w-6 h-6 text-achievement-600" />
              <span>XP Progress</span>
            </h3>
            
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-achievement-600 mb-2">
                {totalXP}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                / {xpGoal} XP Goal
              </div>
            </div>
            
            <div className="progress-bar h-4 mb-4">
              <motion.div 
                className="progress-fill bg-achievement-500"
                initial={{ width: 0 }}
                animate={{ width: `${(totalXP / xpGoal) * 100}%` }}
                transition={{ delay: 0.9, duration: 1 }}
              />
            </div>
            
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              {xpGoal - totalXP} XP remaining to reach your goal
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <span>Achievements</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    achievement.earned 
                      ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800' 
                      : 'border-gray-200 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 opacity-60'
                  }`}
                >
                  <div className="text-2xl mb-2">{achievement.icon}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {achievement.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {achievement.description}
                  </div>
                  {achievement.earned && achievement.earnedDate && (
                    <div className="text-xs text-yellow-600 mt-1">
                      Earned {new Date(achievement.earnedDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Tasks & AI Suggestions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tasks */}
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-primary-600" />
                <span>Recent Tasks</span>
              </h3>
              
              <button
                onClick={handleRescheduleMissedTasks}
                className="btn btn-sm btn-secondary flex items-center space-x-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reschedule Missed</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {task.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    {task.status === 'missed' && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    {task.status === 'pending' && (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                    
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {task.subject} • {new Date(task.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {task.xpEarned && (
                    <div className="text-sm font-medium text-achievement-600">
                      +{task.xpEarned} XP
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Smart Suggestions */}
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-blue-600" />
              <span>AI Smart Suggestions</span>
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-blue-800 dark:text-blue-200 mb-2">
                      <strong>Focus Area Alert:</strong> Computer Networks needs attention
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      You're behind schedule. Consider dedicating 3 extra hours this weekend to catch up.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                      <strong>Great Progress:</strong> Operating Systems mastery
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      You're excelling in OS! Consider moving to advanced topics like distributed systems.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Clock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-2">
                      <strong>Study Schedule:</strong> Optimize your timing
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Your peak performance is between 9-11 AM. Schedule difficult topics during this time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProgressPage;