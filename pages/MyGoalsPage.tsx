import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target,
  Plus,
  Calendar,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Trash2,
  ExternalLink,
  FileText,
  Video,
  Star,
  BarChart3
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

interface Goal {
  id: string;
  name: string;
  type: 'course' | 'exam';
  deadline: string;
  progress: number;
  totalTopics: number;
  completedTopics: number;
  weeklyHours: number;
  subjects: Subject[];
  resources: Resource[];
  aiSuggestion?: string;
  status: 'active' | 'completed' | 'paused';
}

interface Subject {
  id: string;
  name: string;
  progress: number;
  totalTopics: number;
  completedTopics: number;
}

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'course' | 'pdf' | 'website';
  url: string;
  rating: number;
  isPaid: boolean;
}

const MyGoalsPage: React.FC = () => {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const { speak } = useAccessibilityStore();
  const { user } = useAuthStore();

  // Mock data for demonstration
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 'gate-2026',
      name: 'GATE Computer Science 2026',
      type: 'exam',
      deadline: '2026-02-15',
      progress: 67,
      totalTopics: 150,
      completedTopics: 100,
      weeklyHours: 25,
      status: 'active',
      subjects: [
        { id: '1', name: 'Operating Systems', progress: 85, totalTopics: 25, completedTopics: 21 },
        { id: '2', name: 'Database Management', progress: 75, totalTopics: 20, completedTopics: 15 },
        { id: '3', name: 'Data Structures', progress: 60, totalTopics: 30, completedTopics: 18 },
        { id: '4', name: 'Computer Networks', progress: 45, totalTopics: 25, completedTopics: 11 },
        { id: '5', name: 'Algorithms', progress: 30, totalTopics: 35, completedTopics: 10 }
      ],
      resources: [
        { id: '1', title: 'GATE CS Complete Course', type: 'course', url: '#', rating: 4.8, isPaid: true },
        { id: '2', title: 'Operating Systems Playlist', type: 'video', url: '#', rating: 4.5, isPaid: false },
        { id: '3', title: 'GATE Previous Papers', type: 'pdf', url: '#', rating: 4.7, isPaid: false }
      ],
      aiSuggestion: "You're behind in Computer Networks. Consider dedicating 3 extra hours this week to catch up."
    },
    {
      id: 'python-course',
      name: 'Python for Data Science',
      type: 'course',
      deadline: '2024-03-30',
      progress: 45,
      totalTopics: 40,
      completedTopics: 18,
      weeklyHours: 8,
      status: 'active',
      subjects: [
        { id: '1', name: 'Python Basics', progress: 90, totalTopics: 10, completedTopics: 9 },
        { id: '2', name: 'Data Analysis', progress: 40, totalTopics: 15, completedTopics: 6 },
        { id: '3', name: 'Machine Learning', progress: 20, totalTopics: 15, completedTopics: 3 }
      ],
      resources: [
        { id: '1', title: 'Python Data Science Handbook', type: 'pdf', url: '#', rating: 4.9, isPaid: false },
        { id: '2', title: 'Coursera Python Course', type: 'course', url: '#', rating: 4.6, isPaid: true }
      ],
      aiSuggestion: "Great progress on Python basics! Focus on practical projects for Data Analysis next."
    },
    {
      id: 'dbms-subject',
      name: 'Database Management Systems',
      type: 'course',
      deadline: '2024-05-15',
      progress: 80,
      totalTopics: 25,
      completedTopics: 20,
      weeklyHours: 6,
      status: 'active',
      subjects: [
        { id: '1', name: 'SQL Fundamentals', progress: 95, totalTopics: 8, completedTopics: 7 },
        { id: '2', name: 'Normalization', progress: 85, totalTopics: 7, completedTopics: 6 },
        { id: '3', name: 'Transactions', progress: 60, totalTopics: 10, completedTopics: 6 }
      ],
      resources: [
        { id: '1', title: 'Database System Concepts', type: 'pdf', url: '#', rating: 4.8, isPaid: false },
        { id: '2', title: 'SQL Practice Platform', type: 'website', url: '#', rating: 4.4, isPaid: false }
      ],
      aiSuggestion: "You're doing excellent! Consider advanced topics like indexing and query optimization."
    }
  ]);

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-learning-600 bg-learning-100';
      case 'completed': return 'text-primary-600 bg-primary-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleGoalClick = (goalId: string) => {
    setSelectedGoal(selectedGoal === goalId ? null : goalId);
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      speak(`${goal.name}: ${goal.progress}% completed. ${getDaysUntilDeadline(goal.deadline)} days remaining.`);
    }
  };

  const handleReschedule = (goalId: string) => {
    toast.success('Goal timeline rescheduled successfully');
    speak('Goal timeline has been rescheduled based on your current progress.');
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
                My Goals
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Manage your courses and exam preparations
              </p>
            </div>
            
            <button
              onClick={() => setIsAddGoalModalOpen(true)}
              className="btn btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Goal</span>
            </button>
          </div>
        </div>

        {/* Goals Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="card p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary-600" />
            </div>
            <div className="text-3xl font-bold text-primary-600 mb-2">{goals.filter(g => g.status === 'active').length}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Goals</p>
          </motion.div>

          <motion.div 
            className="card p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-16 h-16 bg-learning-100 dark:bg-learning-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-learning-600" />
            </div>
            <div className="text-3xl font-bold text-learning-600 mb-2">
              {Math.round(goals.reduce((sum, goal) => sum + goal.progress, 0) / goals.length)}%
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Progress</p>
          </motion.div>

          <motion.div 
            className="card p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-16 h-16 bg-achievement-100 dark:bg-achievement-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-achievement-600" />
            </div>
            <div className="text-3xl font-bold text-achievement-600 mb-2">
              {goals.reduce((sum, goal) => sum + goal.weeklyHours, 0)}h
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Weekly Hours</p>
          </motion.div>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              className="card overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.4 }}
            >
              {/* Goal Header */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => handleGoalClick(goal.id)}
                role="button"
                tabIndex={0}
                aria-expanded={selectedGoal === goal.id}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleGoalClick(goal.id);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          goal.type === 'exam' ? 'bg-achievement-100 dark:bg-achievement-900' : 'bg-primary-100 dark:bg-primary-900'
                        }`}>
                          {goal.type === 'exam' ? (
                            <Award className={`w-6 h-6 ${goal.type === 'exam' ? 'text-achievement-600' : 'text-primary-600'}`} />
                          ) : (
                            <BookOpen className={`w-6 h-6 ${goal.type === 'exam' ? 'text-achievement-600' : 'text-primary-600'}`} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {goal.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                              {goal.type.toUpperCase()}
                            </span>
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{getDaysUntilDeadline(goal.deadline)} days left</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{goal.weeklyHours}h/week</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Overall Progress
                        </span>
                        <span className="text-sm text-gray-500">
                          {goal.completedTopics}/{goal.totalTopics} topics ({goal.progress}%)
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${goal.type === 'exam' ? 'bg-achievement-500' : 'bg-primary-500'}`}
                          style={{ width: `${goal.progress}%` }}
                          role="progressbar"
                          aria-valuenow={goal.progress}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${goal.name} progress: ${goal.progress}%`}
                        />
                      </div>
                    </div>

                    {/* AI Suggestion */}
                    {goal.aiSuggestion && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>AI Suggestion:</strong> {goal.aiSuggestion}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReschedule(goal.id);
                      }}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      aria-label="Reschedule goal"
                    >
                      <Calendar className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Edit goal logic
                      }}
                      className="p-2 text-gray-400 hover:text-learning-600 hover:bg-learning-50 rounded-lg transition-colors"
                      aria-label="Edit goal"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {selectedGoal === goal.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-gray-200 dark:border-gray-700"
                >
                  <div className="p-6 space-y-6">
                    {/* Edit Form */}
                    {editingGoal === goal.id && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                        <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
                          Edit Goal
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Goal Name
                            </label>
                            <input
                              type="text"
                              value={editData.name || ''}
                              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                              className="form-input"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Deadline
                            </label>
                            <input
                              type="date"
                              value={editData.deadline || ''}
                              onChange={(e) => setEditData({ ...editData, deadline: e.target.value })}
                              className="form-input"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Weekly Hours
                            </label>
                            <input
                              type="number"
                              value={editData.weeklyHours || ''}
                              onChange={(e) => setEditData({ ...editData, weeklyHours: parseInt(e.target.value) })}
                              className="form-input"
                              min="1"
                              max="40"
                            />
                          </div>
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleSaveEdit(goal.id)}
                              className="btn btn-primary"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={() => {
                                setEditingGoal(null);
                                setEditData({});
                              }}
                              className="btn btn-secondary"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Subject Breakdown */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-primary-600" />
                        <span>Subject Progress</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {goal.subjects.map((subject) => (
                          <div key={subject.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {subject.name}
                              </span>
                              <span className="text-sm text-gray-500">
                                {subject.progress}%
                              </span>
                            </div>
                            <div className="progress-bar mb-2">
                              <div 
                                className="progress-fill bg-primary-500"
                                style={{ width: `${subject.progress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {subject.completedTopics}/{subject.totalTopics} topics completed
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-primary-600" />
                        <span>Recommended Resources</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {goal.resources.map((resource) => (
                          <div key={resource.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                {resource.type === 'video' && <Video className="w-4 h-4 text-red-500" />}
                                {resource.type === 'course' && <BookOpen className="w-4 h-4 text-blue-500" />}
                                {resource.type === 'pdf' && <FileText className="w-4 h-4 text-green-500" />}
                                {resource.type === 'website' && <ExternalLink className="w-4 h-4 text-purple-500" />}
                                <span className="font-medium text-gray-900 dark:text-white text-sm">
                                  {resource.title}
                                </span>
                              </div>
                              {resource.isPaid && (
                                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                  Paid
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {resource.rating}
                                </span>
                              </div>
                              <a
                                href={resource.url}
                                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Weekly Effort */}
                    <div className="bg-gradient-to-r from-primary-50 to-learning-50 dark:from-primary-900/20 dark:to-learning-900/20 rounded-lg p-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-primary-600" />
                        <span>This Week's Effort</span>
                      </h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary-600">{goal.weeklyHours}h</div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Planned</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-learning-600">{Math.round(goal.weeklyHours * 0.8)}h</div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-achievement-600">{goal.weeklyHours - Math.round(goal.weeklyHours * 0.8)}h</div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Remaining</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No goals yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first learning goal to get started
            </p>
            <button
              onClick={() => setIsAddGoalModalOpen(true)}
              className="btn btn-primary"
            >
              Add Your First Goal
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyGoalsPage;