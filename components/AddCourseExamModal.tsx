import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen, Target, Calendar, Plus, Trash2 } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import toast from 'react-hot-toast';

interface AddCourseExamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddCourseExamModal: React.FC<AddCourseExamModalProps> = ({ isOpen, onClose }) => {
  const [type, setType] = useState<'course' | 'exam'>('course');
  const [formData, setFormData] = useState({
    name: '',
    targetDate: '',
    syllabus: ['']
  });
  const { user, updateUser } = useAuthStore();
  const { speak } = useAccessibilityStore();

  const commonCourses = [
    'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Engineering', 'Business Administration', 'Psychology', 'History', 'Literature'
  ];

  const commonExams = [
    'GATE', 'GRE', 'GMAT', 'TOEFL', 'IELTS', 'LSAT', 'MCAT', 'JEE', 'NEET', 'CAT'
  ];

  const handleAddSyllabusItem = () => {
    setFormData({
      ...formData,
      syllabus: [...formData.syllabus, '']
    });
  };

  const handleRemoveSyllabusItem = (index: number) => {
    const newSyllabus = formData.syllabus.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      syllabus: newSyllabus.length > 0 ? newSyllabus : ['']
    });
  };

  const handleSyllabusChange = (index: number, value: string) => {
    const newSyllabus = [...formData.syllabus];
    newSyllabus[index] = value;
    setFormData({
      ...formData,
      syllabus: newSyllabus
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('Please enter a name');
      return;
    }

    if (type === 'exam' && !formData.targetDate) {
      toast.error('Target date is required for exams');
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: formData.name,
      progress: 0,
      targetDate: formData.targetDate,
      syllabus: formData.syllabus.filter(item => item.trim() !== ''),
      completedTopics: [],
      timetable: [],
      type: type,
      weeklyHours: 10,
      subjects: formData.syllabus.filter(item => item.trim() !== '').map((topic, index) => ({
        id: (index + 1).toString(),
        name: topic,
        progress: 0,
        totalTopics: 10,
        completedTopics: 0
      })),
      resources: [],
      status: 'active' as const,
      totalTopics: formData.syllabus.filter(item => item.trim() !== '').length * 10,
      aiSuggestion: `Great choice! Focus on understanding the fundamentals of ${formData.name} first.`
    };

    if (user) {
      if (type === 'course') {
        updateUser({ 
          courses: [...(user.courses || []), newItem]
        });
      } else {
        updateUser({ 
          exams: [...(user.exams || []), newItem]
        });
      }
    }

    speak(`${type} ${formData.name} added successfully`);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`);
    
    // Reset form
    setFormData({ name: '', targetDate: '', syllabus: [''] });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New {type.charAt(0).toUpperCase() + type.slice(1)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              What are you adding?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setType('course')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  type === 'course'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                }`}
              >
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                <span className="font-medium">Course</span>
              </button>
              <button
                onClick={() => setType('exam')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  type === 'exam'
                    ? 'border-learning-600 bg-learning-50 dark:bg-learning-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-learning-300'
                }`}
              >
                <Target className="w-8 h-8 mx-auto mb-2 text-learning-600" />
                <span className="font-medium">Exam</span>
              </button>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {type.charAt(0).toUpperCase() + type.slice(1)} Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder={`Enter ${type} name`}
            />
            
            {/* Quick Select Options */}
            <div className="mt-3">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Quick select:</p>
              <div className="flex flex-wrap gap-2">
                {(type === 'course' ? commonCourses : commonExams).map((option) => (
                  <button
                    key={option}
                    onClick={() => setFormData({ ...formData, name: option })}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Target Date */}
          <div>
            <label htmlFor="targetDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Date {type === 'exam' && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                id="targetDate"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="form-input-with-icon"
              />
            </div>
          </div>

          {/* Syllabus */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Syllabus Topics
            </label>
            <div className="space-y-2">
              {formData.syllabus.map((topic, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => handleSyllabusChange(index, e.target.value)}
                    className="form-input flex-1"
                    placeholder={`Topic ${index + 1}`}
                  />
                  {formData.syllabus.length > 1 && (
                    <button
                      onClick={() => handleRemoveSyllabusItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      aria-label="Remove topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={handleAddSyllabusItem}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Topic</span>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Add {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddCourseExamModal;