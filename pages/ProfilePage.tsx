import React from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Award,
  Trophy,
  Calendar,
  BookOpen,
  Target,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  Edit3
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuthStore } from '../stores/authStore';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  // Mock data for demonstration
  const stats = {
    totalXP: user?.xp || 0,
    level: user?.level || 1,
    streak: user?.streak || 0,
    coursesCompleted: 3,
    notesShared: 15,
    studyHours: 127
  };

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Completed first week', icon: '🚀', earned: true, date: '2024-01-15' },
    { id: 2, title: 'Study Streak', description: '7 days in a row', icon: '🔥', earned: true, date: '2024-01-20' },
    { id: 3, title: 'Note Taker', description: 'Uploaded 10 notes', icon: '📚', earned: true, date: '2024-01-25' },
    { id: 4, title: 'Helper', description: 'Helped 5 students', icon: '🤝', earned: false, date: null },
    { id: 5, title: 'Scholar', description: 'Reached level 5', icon: '🎓', earned: false, date: null },
    { id: 6, title: 'Mentor', description: 'Top contributor', icon: '⭐', earned: false, date: null }
  ];

  const recentActivity = [
    { id: 1, type: 'completed', content: 'Physics Problem Set', date: '2024-01-26', xp: 30 },
    { id: 2, type: 'uploaded', content: 'Calculus Chapter 2 Notes', date: '2024-01-25', xp: 15 },
    { id: 3, type: 'achievement', content: 'Note Taker Badge', date: '2024-01-25', xp: 50 },
    { id: 4, type: 'joined', content: 'Computer Science Study Group', date: '2024-01-24', xp: 10 },
    { id: 5, type: 'completed', content: 'Mathematics Quiz', date: '2024-01-23', xp: 25 }
  ];

  const progressData = [
    { subject: 'Computer Science', progress: 75, total: 100, color: 'bg-primary-500' },
    { subject: 'Mathematics', progress: 60, total: 80, color: 'bg-learning-500' },
    { subject: 'Physics', progress: 45, total: 60, color: 'bg-achievement-500' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-learning-600" />;
      case 'uploaded': return <BookOpen className="w-4 h-4 text-primary-600" />;
      case 'achievement': return <Award className="w-4 h-4 text-achievement-600" />;
      case 'joined': return <User className="w-4 h-4 text-purple-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-learning-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user?.name}
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {user?.quote || "Learning enthusiast"}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <span>Level {stats.level}</span>
                  <span>•</span>
                  <span>{stats.totalXP} XP</span>
                  <span>•</span>
                  <span>{stats.streak} day streak</span>
                </div>
              </div>
            </div>
            
            <Link
              to="/profile/edit"
              className="btn btn-primary flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <motion.div 
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-12 h-12 bg-achievement-100 dark:bg-achievement-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-achievement-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalXP}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total XP</p>
              </motion.div>

              <motion.div 
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-primary-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.streak}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
              </motion.div>

              <motion.div 
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-12 h-12 bg-learning-100 dark:bg-learning-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-learning-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.coursesCompleted}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
              </motion.div>

              <motion.div 
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.notesShared}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Notes Shared</p>
              </motion.div>

              <motion.div 
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-pink-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.studyHours}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Study Hours</p>
              </motion.div>

              <motion.div 
                className="card p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.level}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Level</p>
              </motion.div>
            </div>

            {/* Progress Overview */}
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <Target className="w-6 h-6 text-primary-600" />
                <span>Learning Progress</span>
              </h2>
              
              <div className="space-y-6">
                {progressData.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {item.subject}
                      </span>
                      <span className="text-sm text-gray-500">
                        {item.progress}/{item.total} topics
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${item.color}`}
                        style={{ width: `${(item.progress / item.total) * 100}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((item.progress / item.total) * 100)}% complete
                    </div>
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <Clock className="w-6 h-6 text-primary-600" />
                <span>Recent Activity</span>
              </h2>
              
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="w-8 h-8 bg-white dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium capitalize">{activity.type}</span>{' '}
                        <span className="text-primary-600">{activity.content}</span>
                      </p>
                      <div className="flex items-center space-x-3 mt-1">
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString()}
                        </p>
                        <span className="text-xs text-achievement-600 font-medium">
                          +{activity.xp} XP
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Level Progress */}
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Level Progress
              </h3>
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-learning-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-white">{stats.level}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.totalXP % 100} / 100 XP to next level
                </p>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill bg-gradient-to-r from-primary-600 to-learning-600"
                  style={{ width: `${(stats.totalXP % 100)}%` }}
                />
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      achievement.earned 
                        ? 'bg-achievement-50 dark:bg-achievement-900/20 border border-achievement-200 dark:border-achievement-800' 
                        : 'bg-gray-50 dark:bg-gray-700 opacity-60'
                    }`}
                  >
                    <div className="text-2xl">
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
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
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-gray-400 mt-1">
                          Earned {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    {achievement.earned && (
                      <CheckCircle className="w-5 h-5 text-achievement-600 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                This Week
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Study Sessions</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">XP Earned</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">180</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Notes Uploaded</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">3</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">8</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;