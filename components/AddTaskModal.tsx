import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, Clock, Target, BookOpen } from 'lucide-react';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import toast from 'react-hot-toast';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date;
  onAddTask: (task: any) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, selectedDate, onAddTask }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    duration: 1,
    type: 'study' as 'study' | 'practice' | 'revision' | 'exam',
    xp: 25
  });
  const { speak } = useAccessibilityStore();

  // Update date when selectedDate changes
  React.useEffect(() => {
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0]
      }));
    }
  }, [selectedDate]);

  const subjects = [
    'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Operating Systems', 'Database Management', 'Data Structures', 'Computer Networks'
  ];

  const taskTypes = [
    { value: 'study', label: 'Study', color: 'bg-primary-500', xp: 25 },
    { value: 'practice', label: 'Practice', color: 'bg-learning-500', xp: 30 },
    { value: 'revision', label: 'Revision', color: 'bg-achievement-500', xp: 20 },
    { value: 'exam', label: 'Exam', color: 'bg-purple-500', xp: 50 }
  ];

  const handleTypeChange = (type: string) => {
    const taskType = taskTypes.find(t => t.value === type);
    setFormData({
      ...formData,
      type: type as any,
      xp: taskType?.xp || 25
    });
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    if (!formData.subject) {
      toast.error('Please select a subject');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title: formData.title,
      subject: formData.subject,
      date: formData.date,
      duration: formData.duration,
      xp: formData.xp,
      status: 'pending',
      type: formData.type,
      goalId: 'default'
    };

    onAddTask(newTask);
    speak(`Task ${formData.title} added successfully`);
    toast.success('Task added successfully!');
    
    // Reset form
    setFormData({
      title: '',
      subject: '',
      date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      duration: 1,
      type: 'study',
      xp: 25
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        drag="y"
        dragConstraints={{ top: -100, bottom: 100 }}
        dragElastic={0.1}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Task
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-4">
          {selectedDate && (
            <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <p className="text-sm text-primary-800 dark:text-primary-200">
                Adding task for: <strong>{selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</strong>
              </p>
            </div>
          )}
          
          <div className="space-y-4">
          {/* Task Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
              placeholder="e.g., Review Linear Algebra Chapter 3"
            />
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject
            </label>
            <select
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="form-input"
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="form-input-with-icon"
              />
            </div>
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duration (hours)
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
                min="0.5"
                max="12"
                step="0.5"
                className="form-input-with-icon"
              />
            </div>
          </div>

          {/* Task Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {taskTypes.map((type) => (
                <button
                  key={type.value}
                  onClick={() => handleTypeChange(type.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.type === type.value
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-primary-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full ${type.color} mx-auto mb-1`} />
                  <span className="text-sm font-medium">{type.label}</span>
                  <div className="text-xs text-gray-500">+{type.xp} XP</div>
                </button>
              ))}
            </div>
          </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4 p-6 pt-4 border-t border-gray-200 dark:border-gray-700">
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
            Add Task
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AddTaskModal;