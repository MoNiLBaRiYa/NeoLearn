import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search,
  Filter,
  Star,
  Download,
  Eye,
  BookOpen,
  TrendingUp,
  Calendar,
  User,
  Globe,
  FileText,
  Award
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import toast from 'react-hot-toast';

interface LibraryNote {
  id: string;
  title: string;
  author: string;
  subject: string;
  rating: number;
  downloads: number;
  uploadDate: string;
  size: string;
  type: 'pdf' | 'doc' | 'txt';
  description: string;
  tags: string[];
}

const LibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { speak } = useAccessibilityStore();

  // Mock library data
  const libraryNotes: LibraryNote[] = [
    {
      id: '1',
      title: 'Advanced Calculus - Integration Techniques',
      author: 'Sarah M.',
      subject: 'Mathematics',
      rating: 4.8,
      downloads: 1250,
      uploadDate: '2024-01-20',
      size: '3.4 MB',
      type: 'pdf',
      description: 'Comprehensive guide covering all major integration techniques with detailed examples and practice problems.',
      tags: ['calculus', 'integration', 'mathematics', 'advanced']
    },
    {
      id: '2',
      title: 'Quantum Physics Fundamentals',
      author: 'Dr. James Wilson',
      subject: 'Physics',
      rating: 4.9,
      downloads: 980,
      uploadDate: '2024-01-18',
      size: '5.2 MB',
      type: 'pdf',
      description: 'Complete introduction to quantum mechanics principles, wave functions, and quantum states.',
      tags: ['quantum', 'physics', 'mechanics', 'fundamentals']
    },
    {
      id: '3',
      title: 'Data Structures and Algorithms Cheat Sheet',
      author: 'Alex Chen',
      subject: 'Computer Science',
      rating: 4.7,
      downloads: 2100,
      uploadDate: '2024-01-15',
      size: '1.8 MB',
      type: 'pdf',
      description: 'Quick reference guide for common data structures and algorithms with time complexity analysis.',
      tags: ['algorithms', 'data-structures', 'programming', 'computer-science']
    },
    {
      id: '4',
      title: 'Organic Chemistry Reaction Mechanisms',
      author: 'Prof. Maria Garcia',
      subject: 'Chemistry',
      rating: 4.6,
      downloads: 850,
      uploadDate: '2024-01-12',
      size: '4.1 MB',
      type: 'pdf',
      description: 'Detailed explanation of organic reaction mechanisms with step-by-step breakdowns.',
      tags: ['organic', 'chemistry', 'reactions', 'mechanisms']
    },
    {
      id: '5',
      title: 'World War II Historical Analysis',
      author: 'Robert Taylor',
      subject: 'History',
      rating: 4.5,
      downloads: 640,
      uploadDate: '2024-01-10',
      size: '2.9 MB',
      type: 'pdf',
      description: 'Comprehensive analysis of World War II causes, major events, and global impact.',
      tags: ['history', 'world-war', 'analysis', 'global-impact']
    },
    {
      id: '6',
      title: 'Microeconomics Study Guide',
      author: 'Emma Johnson',
      subject: 'Economics',
      rating: 4.4,
      downloads: 720,
      uploadDate: '2024-01-08',
      size: '2.3 MB',
      type: 'pdf',
      description: 'Essential microeconomics concepts, graphs, and problem-solving techniques.',
      tags: ['microeconomics', 'economics', 'graphs', 'study-guide']
    }
  ];

  const subjects = ['all', 'Mathematics', 'Physics', 'Computer Science', 'Chemistry', 'History', 'Economics'];
  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'downloads', label: 'Most Downloaded' },
    { value: 'date', label: 'Recently Added' },
    { value: 'title', label: 'Alphabetical' }
  ];

  const filteredAndSortedNotes = libraryNotes
    .filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesSubject = selectedSubject === 'all' || note.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'downloads':
          return b.downloads - a.downloads;
        case 'date':
          return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const handleDownload = (note: LibraryNote) => {
    speak(`Downloading ${note.title}`);
    toast.success(`Downloading ${note.title}`);
  };

  const handleRate = (noteId: string, rating: number) => {
    speak(`Rated ${rating} stars`);
    toast.success(`Thank you for rating!`);
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
                Community Library
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Discover and download study materials shared by the community
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-4 py-2 rounded-lg">
                <span className="font-semibold">{libraryNotes.length}</span> notes available
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, author, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input-with-icon"
                aria-label="Search library notes"
              />
            </div>
            
            {/* Subject Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="form-input-with-icon"
                aria-label="Filter by subject"
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort */}
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input-with-icon"
                aria-label="Sort notes"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredAndSortedNotes.length} of {libraryNotes.length} notes
          </p>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              aria-label="Grid view"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V4zM3 12a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm6 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
              aria-label="List view"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Notes Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedNotes.map((note, index) => (
              <motion.div
                key={note.id}
                className="card p-6 hover:shadow-lg transition-shadow duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
                        {note.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{note.author}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {note.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {note.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="badge badge-primary text-xs">
                      {tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-xs text-gray-500">+{note.tags.length - 3} more</span>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span>{note.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-4 h-4" />
                      <span>{note.downloads}</span>
                    </div>
                  </div>
                  <span className="text-xs">{note.size}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      aria-label="Preview note"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => handleRate(note.id, star)}
                          className="p-1 text-gray-300 hover:text-yellow-400 transition-colors"
                          aria-label={`Rate ${star} stars`}
                        >
                          <Star className={`w-4 h-4 ${star <= Math.floor(note.rating) ? 'text-yellow-400 fill-current' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(note)}
                    className="btn btn-primary px-4 py-2 text-sm flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAndSortedNotes.map((note, index) => (
              <motion.div
                key={note.id}
                className="card p-6 hover:shadow-lg transition-shadow duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {note.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {note.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{note.author}</span>
                        </div>
                        <span>{note.subject}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span>{note.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="w-3 h-3" />
                          <span>{note.downloads}</span>
                        </div>
                        <span>{note.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      aria-label="Preview note"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownload(note)}
                      className="btn btn-primary px-4 py-2 text-sm flex items-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {filteredAndSortedNotes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}

        {/* Featured Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Most Popular This Week
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {libraryNotes.slice(0, 3).map((note, index) => (
              <div key={note.id} className="card p-6 border-2 border-achievement-200 dark:border-achievement-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-achievement-600" />
                    <span className="text-sm font-medium text-achievement-600">
                      #{index + 1} Most Downloaded
                    </span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {note.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  By {note.author} • {note.downloads} downloads
                </p>
                <button
                  onClick={() => handleDownload(note)}
                  className="btn btn-achievement w-full"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LibraryPage;