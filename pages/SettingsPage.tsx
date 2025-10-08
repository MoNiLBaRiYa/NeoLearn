import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings,
  User,
  Bell,
  Shield,
  Accessibility,
  Palette,
  Volume2,
  VolumeX,
  Eye,
  Type,
  Moon,
  Sun,
  Save,
  Lock,
  Globe
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const {
    isDyslexicFont,
    isHighContrast,
    isReducedMotion,
    isDarkMode,
    fontSize,
    isTTSEnabled,
    isSTTEnabled,
    speechRate,
    speechVolume,
    toggleDyslexicFont,
    toggleHighContrast,
    toggleReducedMotion,
    toggleDarkMode,
    setFontSize,
    toggleTTS,
    toggleSTT,
    setSpeechRate,
    setSpeechVolume,
    speak
  } = useAccessibilityStore();

  const { user, updateUser } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('accessibility');
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    quote: user?.quote || '',
    age: user?.age?.toString() || '',
    ambition: user?.ambition || ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notifications, setNotifications] = useState({
    dailyReminders: true,
    studyStreaks: true,
    achievements: true,
    communityUpdates: false,
    emailDigest: true
  });

  const tabs = [
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const handleSaveProfile = () => {
    updateUser({
      name: profileData.name,
      quote: profileData.quote,
      age: profileData.age ? parseInt(profileData.age) : undefined,
      ambition: profileData.ambition
    });
    speak('Profile updated successfully');
    toast.success('Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    // Handle password change logic here
    speak('Password changed successfully');
    toast.success('Password changed successfully!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const renderAccessibilitySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Visual Accessibility
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Type className="w-5 h-5 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dyslexic-Friendly Font</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Use OpenDyslexic font for better readability</p>
              </div>
            </div>
            <button
              onClick={toggleDyslexicFont}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDyslexicFont ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle dyslexic font"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDyslexicFont ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Eye className="w-5 h-5 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">High Contrast</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Increase contrast for better visibility</p>
              </div>
            </div>
            <button
              onClick={toggleHighContrast}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isHighContrast ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle high contrast"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isHighContrast ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Reduced Motion</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Minimize animations and transitions</p>
              </div>
            </div>
            <button
              onClick={toggleReducedMotion}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isReducedMotion ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle reduced motion"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isReducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Type className="w-5 h-5 text-primary-600" />
              <p className="font-medium text-gray-900 dark:text-white">Font Size</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setFontSize('small')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  fontSize === 'small' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                }`}
              >
                Small
              </button>
              <button
                onClick={() => setFontSize('medium')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  fontSize === 'medium' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                }`}
              >
                Medium
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  fontSize === 'large' 
                    ? 'bg-primary-600 text-white' 
                    : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                }`}
              >
                Large
              </button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Audio Accessibility
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-5 h-5 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Text-to-Speech (TTS)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Have text read aloud to you</p>
              </div>
            </div>
            <button
              onClick={toggleTTS}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isTTSEnabled ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle text-to-speech"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isTTSEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <VolumeX className="w-5 h-5 text-primary-600" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Speech-to-Text (STT)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Use voice input for text fields</p>
              </div>
            </div>
            <button
              onClick={toggleSTT}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isSTTEnabled ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle speech-to-text"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isSTTEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {isTTSEnabled && (
            <>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Volume2 className="w-5 h-5 text-primary-600" />
                  <p className="font-medium text-gray-900 dark:text-white">Speech Rate</p>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={speechRate}
                  onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                  className="w-full"
                  aria-label="Speech rate"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span>Slow</span>
                  <span>Normal</span>
                  <span>Fast</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3 mb-3">
                  <Volume2 className="w-5 h-5 text-primary-600" />
                  <p className="font-medium text-gray-900 dark:text-white">Speech Volume</p>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={speechVolume}
                  onChange={(e) => setSpeechVolume(parseFloat(e.target.value))}
                  className="w-full"
                  aria-label="Speech volume"
                />
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <span>Quiet</span>
                  <span>Loud</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Personal Information
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              className="form-input"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label htmlFor="quote" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Personal Quote
            </label>
            <input
              type="text"
              id="quote"
              value={profileData.quote}
              onChange={(e) => setProfileData({ ...profileData, quote: e.target.value })}
              className="form-input"
              placeholder="Your motivational quote..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                min="13"
                max="120"
              />
            </div>

            <div>
              <label htmlFor="ambition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ambition
              </label>
              <input
                type="text"
                id="ambition"
                value={profileData.ambition}
                onChange={(e) => setProfileData({ ...profileData, ambition: e.target.value })}
                className="form-input"
                placeholder="Your goals..."
              />
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Password
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="form-input"
            />
          </div>

          <button
            onClick={handlePasswordChange}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Lock className="w-4 h-4" />
            <span>Change Password</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Theme
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              {isDarkMode ? <Moon className="w-5 h-5 text-primary-600" /> : <Sun className="w-5 h-5 text-primary-600" />}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Switch between light and dark themes</p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isDarkMode ? 'bg-primary-600' : 'bg-gray-300'
              }`}
              aria-label="Toggle dark mode"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {key === 'dailyReminders' && 'Get daily study reminders'}
                    {key === 'studyStreaks' && 'Notifications about your study streaks'}
                    {key === 'achievements' && 'When you earn new badges and achievements'}
                    {key === 'communityUpdates' && 'Updates from the community library'}
                    {key === 'emailDigest' && 'Weekly email digest of your progress'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [key]: !value })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  value ? 'bg-primary-600' : 'bg-gray-300'
                }`}
                aria-label={`Toggle ${key}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Customize your NeoLearn experience
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="card p-8"
            >
              {activeTab === 'accessibility' && renderAccessibilitySettings()}
              {activeTab === 'profile' && renderProfileSettings()}
              {activeTab === 'security' && renderSecuritySettings()}
              {activeTab === 'appearance' && renderAppearanceSettings()}
              {activeTab === 'notifications' && renderNotificationSettings()}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;