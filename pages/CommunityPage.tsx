import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users,
  MessageCircle,
  Search,
  Filter,
  Plus,
  Star,
  Calendar,
  BookOpen,
  Award,
  Clock,
  User,
  Send
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import toast from 'react-hot-toast';

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  maxMembers: number;
  description: string;
  nextSession: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isJoined: boolean;
}

const CommunityPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const { speak } = useAccessibilityStore();

  const studyGroups: StudyGroup[] = [
    {
      id: '1',
      name: 'GATE CS 2026 Preparation',
      subject: 'Computer Science',
      members: 45,
      maxMembers: 50,
      description: 'Comprehensive GATE preparation with daily discussions and mock tests',
      nextSession: '2024-02-01T18:00:00',
      difficulty: 'Advanced',
      isJoined: false
    },
    {
      id: '2',
      name: 'Data Structures Study Circle',
      subject: 'Data Structures',
      members: 28,
      maxMembers: 30,
      description: 'Weekly problem-solving sessions and concept discussions',
      nextSession: '2024-01-30T19:00:00',
      difficulty: 'Intermediate',
      isJoined: true
    },
    {
      id: '3',
      name: 'Python Beginners Group',
      subject: 'Programming',
      members: 15,
      maxMembers: 25,
      description: 'Learn Python from scratch with hands-on projects',
      nextSession: '2024-01-29T17:00:00',
      difficulty: 'Beginner',
      isJoined: false
    }
  ];

  const subjects = ['all', 'Computer Science', 'Data Structures', 'Programming', 'Mathematics', 'Physics'];

  const filteredGroups = studyGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || group.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleJoinGroup = (groupId: string) => {
    const group = studyGroups.find(g => g.id === groupId);
    if (group) {
      speak(`Joined ${group.name} study group`);
      toast.success(`Joined ${group.name}!`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                Study Community
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Join study groups and collaborate with fellow learners
              </p>
            </div>
            
            <button className="btn btn-primary flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create Group</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search study groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input-with-icon"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="form-input-with-icon pr-8"
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

        {/* Study Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group, index) => (
            <motion.div
              key={group.id}
              className="card p-6 hover:shadow-lg transition-shadow duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {group.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {group.subject}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(group.difficulty)}`}>
                  {group.difficulty}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {group.description}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{group.members}/{group.maxMembers} members</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Next: {new Date(group.nextSession).toLocaleDateString()}</span>
                </div>
              </div>

              <button
                onClick={() => handleJoinGroup(group.id)}
                disabled={group.isJoined || group.members >= group.maxMembers}
                className={`w-full btn ${
                  group.isJoined 
                    ? 'btn-secondary cursor-not-allowed' 
                    : group.members >= group.maxMembers
                    ? 'btn-secondary cursor-not-allowed'
                    : 'btn-primary'
                }`}
              >
                {group.isJoined ? 'Joined' : group.members >= group.maxMembers ? 'Full' : 'Join Group'}
              </button>
            </motion.div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No study groups found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or create a new group
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CommunityPage;