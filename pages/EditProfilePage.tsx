import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User,
  Save,
  ArrowLeft,
  Camera,
  Quote
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAuthStore } from '../stores/authStore';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import toast from 'react-hot-toast';

const EditProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { speak } = useAccessibilityStore();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    quote: user?.quote || '',
    age: user?.age?.toString() || '',
    ambition: user?.ambition || ''
  });

  const handleSave = () => {
    updateUser({
      name: profileData.name,
      quote: profileData.quote,
      age: profileData.age ? parseInt(profileData.age) : undefined,
      ambition: profileData.ambition
    });
    
    speak('Profile updated successfully');
    toast.success('Profile updated successfully!');
    navigate('/profile');
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Go back to profile"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Edit Profile
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Update your personal information and preferences
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl">
          <motion.div
            className="card p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Profile Picture Section */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-learning-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 dark:border-gray-600">
                  <Camera className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Profile Picture
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click the camera icon to upload a new photo
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="quote" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Quote className="inline w-4 h-4 mr-1" />
                  Personal Quote
                </label>
                <textarea
                  id="quote"
                  value={profileData.quote}
                  onChange={(e) => setProfileData({ ...profileData, quote: e.target.value })}
                  className="form-input"
                  placeholder="Your motivational quote or motto..."
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be displayed on your dashboard
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    value={profileData.age}
                    onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                    className="form-input"
                    placeholder="Your age"
                    min="13"
                    max="120"
                  />
                </div>

                <div>
                  <label htmlFor="ambition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ambition/Goal
                  </label>
                  <input
                    type="text"
                    id="ambition"
                    value={profileData.ambition}
                    onChange={(e) => setProfileData({ ...profileData, ambition: e.target.value })}
                    className="form-input"
                    placeholder="Your career goal or ambition"
                  />
                </div>
              </div>

              {/* Current Stats Display */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Current Stats
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary-600">{user?.level || 1}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Level</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-achievement-600">{user?.xp || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Total XP</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-learning-600">{user?.streak || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Day Streak</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{user?.courses?.length || 0}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Courses</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-200 dark:border-gray-700 mt-8">
              <button
                onClick={handleCancel}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!profileData.name.trim()}
                className="btn btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default EditProfilePage;