import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload,
  Search,
  Filter,
  Plus,
  FileText,
  Star,
  Download,
  Eye,
  Edit3,
  Trash2,
  Globe,
  Lock,
  Calendar
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Sidebar from '../components/Sidebar';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import toast from 'react-hot-toast';

interface Note {
  id: string;
  title: string;
  isPublic: boolean;
  uploadDate: string;
  size: string;
  rating: number;
  downloads: number;
  subject: string;
  type: 'pdf' | 'doc' | 'txt';
}

const NotesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    isPublic: false,
    subject: '',
  });
  const { speak } = useAccessibilityStore();

  // Mock notes data
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Linear Algebra Chapter 3 - Vector Spaces',
      isPublic: true,
      uploadDate: '2024-01-15',
      size: '2.5 MB',
      rating: 4.5,
      downloads: 245,
      subject: 'Mathematics',
      type: 'pdf'
    },
    {
      id: '2',
      title: 'Physics - Quantum Mechanics Basics',
      isPublic: false,
      uploadDate: '2024-01-10',
      size: '1.8 MB',
      rating: 0,
      downloads: 0,
      subject: 'Physics',
      type: 'pdf'
    },
    {
      id: '3',
      title: 'Computer Science - Data Structures',
      isPublic: true,
      uploadDate: '2024-01-05',
      size: '3.2 MB',
      rating: 4.8,
      downloads: 178,
      subject: 'Computer Science',
      type: 'pdf'
    }
  ]);

  const onDrop = (acceptedFiles: File[]) => {
    speak('Files selected for upload');
    // Handle file upload logic here
    console.log('Files dropped:', acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    multiple: true
  });

  const handleUpload = () => {
    if (!uploadData.title.trim()) {
      toast.error('Please enter a note title');
      return;
    }
    
    const newNote: Note = {
      id: Date.now().toString(),
      title: uploadData.title,
      isPublic: uploadData.isPublic,
      uploadDate: new Date().toISOString().split('T')[0],
      size: '1.2 MB', // Mock size
      rating: 0,
      downloads: 0,
      subject: uploadData.subject || 'General',
      type: 'pdf'
    };
    
    setNotes([newNote, ...notes]);
    setIsUploadModalOpen(false);
    setUploadData({ title: '', isPublic: false, subject: '' });
    speak('Note uploaded successfully');
    toast.success('Note uploaded successfully!');
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'public' && note.isPublic) ||
                         (filterType === 'private' && !note.isPublic);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Notes
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Upload, organize, and manage your study materials
              </p>
            </div>
            
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="btn btn-primary flex items-center space-x-2"
              aria-label="Upload new note"
            >
              <Plus className="w-5 h-5" />
              <span>Upload Note</span>
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
                placeholder="Search notes by title or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input-with-icon"
                aria-label="Search notes"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-input-with-icon pr-8"
                  aria-label="Filter notes"
                >
                  <option value="all">All Notes</option>
                  <option value="public">Public Notes</option>
                  <option value="private">Private Notes</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note, index) => (
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
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                      {note.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{note.subject}</span>
                      <span>{note.size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {note.isPublic ? (
                    <Globe className="w-4 h-4 text-learning-600" title="Public" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400" title="Private" />
                  )}
                </div>
              </div>

              {/* Rating and Stats */}
              {note.isPublic && (
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{note.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{note.downloads}</span>
                  </div>
                </div>
              )}

              {/* Upload Date */}
              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Uploaded {new Date(note.uploadDate).toLocaleDateString()}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      speak(`Viewing note: ${note.title}`);
                      // In a real app, this would open the note viewer
                    }}
                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    aria-label="View note"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      speak(`Editing note: ${note.title}`);
                      // In a real app, this would open the note editor
                    }}
                    className="p-2 text-gray-600 hover:text-learning-600 hover:bg-learning-50 rounded-lg transition-colors"
                    aria-label="Edit note"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this note?')) {
                        setNotes(notes.filter(n => n.id !== note.id));
                        speak('Note deleted successfully');
                        toast.success('Note deleted successfully');
                      }
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <button
                  onClick={() => {
                    speak(`Downloading note: ${note.title}`);
                    toast.success('Download started');
                    // In a real app, this would trigger the download
                  }}
                  className="p-2 text-gray-600 hover:text-achievement-600 hover:bg-achievement-50 rounded-lg transition-colors"
                  aria-label="Download note"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No notes found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search terms' : 'Upload your first note to get started'}
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="btn btn-primary"
            >
              Upload Your First Note
            </button>
          </div>
        )}

        {/* Upload Modal */}
        {isUploadModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Upload Note
                </h2>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close upload modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* File Upload Area */}
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    isDragActive 
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    or click to browse your files
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported formats: PDF, DOC, DOCX, TXT
                  </p>
                </div>

                {/* Note Details */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="noteTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Note Title *
                    </label>
                    <input
                      type="text"
                      id="noteTitle"
                      value={uploadData.title}
                      onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                      className="form-input"
                      placeholder="Enter a descriptive title for your note"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="noteSubject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="noteSubject"
                      value={uploadData.subject}
                      onChange={(e) => setUploadData({ ...uploadData, subject: e.target.value })}
                      className="form-input"
                      placeholder="e.g., Mathematics, Physics, Computer Science"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={uploadData.isPublic}
                      onChange={(e) => setUploadData({ ...uploadData, isPublic: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <label htmlFor="isPublic" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Make this note public
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 ml-7">
                    Public notes can be discovered and downloaded by other users in the community library
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setIsUploadModalOpen(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    className="btn btn-primary"
                  >
                    Upload Note
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotesPage;