import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  Trophy,
  BookOpen,
  Upload,
  Library,
  Settings,
  Bell,
  Plus,
  Target,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  Star,
  Users
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import Sidebar from '../components/Sidebar';
import AddTaskModal from '../components/AddTaskModal';

const Dashboard: React.FC = () => {
  const { user, addXP } = useAuthStore();
  const { speak } = useAccessibilityStore();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data for demonstration
  const todaysTasks = [
    { id: 1, title: 'Review Linear Algebra Chapter 3', completed: false, xp: 25, type: 'study' },
    { id: 2, title: 'Complete Physics Problem Set', completed: true, xp: 30, type: 'assignment' },
    { id: 3, title: 'Practice Python Coding', completed: false, xp: 20, type: 'practice' },
    { id: 4, title: 'Weekly Quiz - Chemistry', completed: false, xp: 50, type: 'quiz' },
  ];

  const [tasks, setTasks] = useState(todaysTasks);

  const achievements = [
    { id: 1, title: 'First Week', description: 'Completed your first week', icon: '🚀', earned: true },
    { id: 2, title: 'Study Streak', description: '7 days in a row', icon: '🔥', earned: true },
    { id: 3, title: 'Note Taker', description: 'Uploaded 10 notes', icon: '📚', earned: false },
    { id: 4, title: 'Helper', description: 'Helped 5 students', icon: '🤝', earned: false },
  ];

  const recentActivity = [
    { id: 1, action: 'Completed task', item: 'Physics Problem Set', time: '2 hours ago', xp: 30 },
    { id: 2, action: 'Uploaded note', item: 'Calculus Chapter 2', time: '4 hours ago', xp: 15 },
    { id: 3, action: 'Joined study group', item: 'Computer Science', time: '1 day ago', xp: 10 },
  ];

  const handleTaskComplete = (taskId: number, xp: number) => {
    addXP(xp);
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    speak(`Task completed! You earned ${xp} XP points.`);
  };
  
  const handleAddTask = (newTask: any) => {
    setTasks([...tasks, { ...newTask, id: tasks.length + 1 }]);
  };
  
  const handleUploadNotes = () => {
    navigate('/notes');
    speak('Navigating to notes page');
  };
  
  const handleBrowseLibrary = () => {
    navigate('/library');
    speak('Navigating to library page');
  };
  
  const handleJoinStudyGroup = () => {
    navigate('/community');
    speak('Navigating to community page');
  };

  const progressData = {
    courses: [
      { name: 'Computer Science', progress: 75, color: 'bg-primary-500' },
      { name: 'Mathematics', progress: 60, color: 'bg-learning-500' },
      { name: 'Physics', progress: 45, color: 'bg-achievement-500' },
    ],
    exams: [
      { name: 'GRE', progress: 80, date: '2024-03-15', color: 'bg-purple-500' },
      { name: 'TOEFL', progress: 65, date: '2024-04-20', color: 'bg-pink-500' },
    ]
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
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {user?.quote || "Ready to continue your learning journey?"}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-achievement-500 to-achievement-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">{user?.xp || 0} XP</span>
              </div>
              <div className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-4 py-2 rounded-lg flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Level {user?.level || 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total XP</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.xp || 0}</p>
              </div>
              <div className="w-12 h-12 bg-achievement-100 dark:bg-achievement-900 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-achievement-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Study Streak</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.streak || 0} days</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Courses</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.courses?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-learning-100 dark:bg-learning-900 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-learning-600" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Exams</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.exams?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Tasks */}
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Today's Tasks
                </h2>
                <button 
                  onClick={() => setIsAddTaskModalOpen(true)}
                  className="btn btn-primary text-sm flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div 
                    key={task.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      task.completed 
                        ? 'bg-learning-50 border-learning-200 dark:bg-learning-900/20 dark:border-learning-700'
                        : 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => !task.completed && handleTaskComplete(task.id, task.xp)}
                        className={`w-6 h-6 rounded-full border-2 transition-colors ${
                          task.completed
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-primary-400'
                        }`}
                        aria-label={task.completed ? 'Task completed' : 'Mark task as complete'}
                      >
                        {task.completed && (
                          <CheckCircle className="w-6 h-6 text-white" />
                        )}
                      </button>
                      <div>
                        <p className={`font-medium ${
                          task.completed 
                            ? 'text-gray-500 line-through dark:text-gray-400' 
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {task.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`badge badge-${
                            task.type === 'quiz' ? 'achievement' : 
                            task.type === 'assignment' ? 'primary' : 'success'
                          } text-xs`}>
                            {task.type}
                          </span>
                          <span className="text-xs text-gray-500">+{task.xp} XP</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Progress Overview */}
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Progress Overview
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                    Courses
                  </h3>
                  <div className="space-y-3">
                    {progressData.courses.map((course, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {course.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className={`progress-fill ${course.color}`}
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                    Upcoming Exams
                  </h3>
                  <div className="space-y-3">
                    {progressData.exams.map((exam, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {exam.name}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(exam.date).toLocaleDateString()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {exam.progress}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className={`progress-fill ${exam.color}`}
                            style={{ width: `${exam.progress}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar Content */}
          <div className="space-y-8">
            {/* Achievements */}
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Achievements
              </h2>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      achievement.earned 
                        ? 'bg-achievement-50 dark:bg-achievement-900/20' 
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <div className="text-2xl">
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium text-sm ${
                        achievement.earned 
                          ? 'text-achievement-800 dark:text-achievement-200' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {achievement.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <CheckCircle className="w-5 h-5 text-achievement-600" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">{activity.action}</span>{' '}
                        <span className="text-primary-600">{activity.item}</span>
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">{activity.time}</p>
                        <span className="text-xs text-achievement-600 font-medium">
                          +{activity.xp} XP
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button 
                  onClick={handleUploadNotes}
                  className="w-full btn btn-primary text-left flex items-center space-x-3 hover:bg-primary-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Notes</span>
                </button>
                <button 
                  onClick={handleBrowseLibrary}
                  className="w-full btn btn-secondary text-left flex items-center space-x-3 hover:bg-gray-300 transition-colors"
                >
                  <Library className="w-5 h-5" />
                  <span>Browse Library</span>
                </button>
                <button 
                  onClick={handleJoinStudyGroup}
                  className="w-full btn btn-secondary text-left flex items-center space-x-3 hover:bg-gray-300 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span>Join Study Group</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      
      <AddTaskModal 
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />
    </div>
  );
};

export default Dashboard;