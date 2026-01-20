import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Type,
  Eye,
  EyeOff,
  Contrast,
  Zap,
  ZapOff,
  Maximize2,
  Minimize2,
  Settings,
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Languages,
  Subtitles,
  MousePointer,
  Hand,
  Focus
} from 'lucide-react';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import toast from 'react-hot-toast';

const AccessibilityToolbar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const {
    isTTSEnabled,
    isSTTEnabled,
    isDyslexicFont,
    isHighContrast,
    isReducedMotion,
    fontSize,
    speechRate,
    speechVolume,
    toggleTTS,
    toggleSTT,
    toggleDyslexicFont,
    toggleHighContrast,
    toggleReducedMotion,
    setFontSize,
    setSpeechRate,
    setSpeechVolume,
    speak,
    stopSpeaking,
    // New features
    isScreenReaderMode,
    isKeyboardOnlyMode,
    isFocusHighlight,
    isColorBlindMode,
    colorBlindType,
    isLargeClickTargets,
    isReadingGuide,
    isTextSpacing,
    toggleScreenReaderMode,
    toggleKeyboardOnlyMode,
    toggleFocusHighlight,
    toggleColorBlindMode,
    setColorBlindType,
    toggleLargeClickTargets,
    toggleReadingGuide,
    toggleTextSpacing,
  } = useAccessibilityStore();

  const [isReading, setIsReading] = useState(false);

  const handleReadPage = () => {
    if (isReading) {
      stopSpeaking();
      setIsReading(false);
      speak('Reading stopped');
    } else {
      const mainContent = document.querySelector('main');
      if (mainContent) {
        const text = mainContent.innerText;
        speak(text);
        setIsReading(true);
        toast.success('Reading page content');
      }
    }
  };

  const quickActions = [
    {
      id: 'tts',
      icon: isTTSEnabled ? Volume2 : VolumeX,
      label: 'Text to Speech',
      active: isTTSEnabled,
      action: () => {
        toggleTTS();
        speak(isTTSEnabled ? 'Text to speech disabled' : 'Text to speech enabled');
      },
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      id: 'stt',
      icon: isSTTEnabled ? Mic : MicOff,
      label: 'Speech to Text',
      active: isSTTEnabled,
      action: () => {
        toggleSTT();
        speak(isSTTEnabled ? 'Speech to text disabled' : 'Speech to text enabled');
      },
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900/20'
    },
    {
      id: 'dyslexic',
      icon: Type,
      label: 'Dyslexic Font',
      active: isDyslexicFont,
      action: () => {
        toggleDyslexicFont();
        speak(isDyslexicFont ? 'Standard font' : 'Dyslexic font enabled');
      },
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      id: 'contrast',
      icon: Contrast,
      label: 'High Contrast',
      active: isHighContrast,
      action: () => {
        toggleHighContrast();
        speak(isHighContrast ? 'Normal contrast' : 'High contrast enabled');
      },
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      id: 'motion',
      icon: isReducedMotion ? ZapOff : Zap,
      label: 'Reduce Motion',
      active: isReducedMotion,
      action: () => {
        toggleReducedMotion();
        speak(isReducedMotion ? 'Animations enabled' : 'Reduced motion enabled');
      },
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      id: 'focus',
      icon: Focus,
      label: 'Focus Highlight',
      active: isFocusHighlight,
      action: () => {
        toggleFocusHighlight();
        speak(isFocusHighlight ? 'Focus highlight disabled' : 'Focus highlight enabled');
      },
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    }
  ];

  return (
    <>
      {/* Floating Accessibility Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
          aria-label="Accessibility toolbar"
          aria-expanded={isExpanded}
        >
          <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </motion.div>

      {/* Expanded Toolbar */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>Accessibility</span>
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Close toolbar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      action.active
                        ? `${action.bgColor} border-current ${action.color}`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                    aria-label={action.label}
                    aria-pressed={action.active}
                  >
                    <action.icon className={`w-5 h-5 mx-auto mb-1 ${action.active ? action.color : 'text-gray-600 dark:text-gray-400'}`} />
                    <span className={`text-xs font-medium ${action.active ? action.color : 'text-gray-600 dark:text-gray-400'}`}>
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Reading Controls */}
              {isTTSEnabled && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-3">
                    Reading Controls
                  </h4>
                  <div className="flex items-center space-x-2 mb-3">
                    <button
                      onClick={handleReadPage}
                      className="flex-1 btn btn-primary text-sm py-2"
                    >
                      {isReading ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                      {isReading ? 'Stop' : 'Read Page'}
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-blue-800 dark:text-blue-200 mb-1 block">
                        Speed: {speechRate}x
                      </label>
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
                    </div>
                    <div>
                      <label className="text-xs text-blue-800 dark:text-blue-200 mb-1 block">
                        Volume: {Math.round(speechVolume * 100)}%
                      </label>
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
                    </div>
                  </div>
                </div>
              )}

              {/* Font Size */}
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Font Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['small', 'medium', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setFontSize(size);
                        speak(`Font size ${size}`);
                      }}
                      className={`py-2 px-3 rounded-lg border-2 transition-all ${
                        fontSize === size
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                      aria-label={`Font size ${size}`}
                      aria-pressed={fontSize === size}
                    >
                      <span className={`font-medium ${
                        size === 'small' ? 'text-xs' : size === 'large' ? 'text-base' : 'text-sm'
                      }`}>
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Settings */}
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                >
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Advanced Options
                  </h4>
                  
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Screen Reader Mode</span>
                    <input
                      type="checkbox"
                      checked={isScreenReaderMode}
                      onChange={toggleScreenReaderMode}
                      className="w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Keyboard Only</span>
                    <input
                      type="checkbox"
                      checked={isKeyboardOnlyMode}
                      onChange={toggleKeyboardOnlyMode}
                      className="w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Large Click Targets</span>
                    <input
                      type="checkbox"
                      checked={isLargeClickTargets}
                      onChange={toggleLargeClickTargets}
                      className="w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Reading Guide</span>
                    <input
                      type="checkbox"
                      checked={isReadingGuide}
                      onChange={toggleReadingGuide}
                      className="w-4 h-4"
                    />
                  </label>

                  <label className="flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Text Spacing</span>
                    <input
                      type="checkbox"
                      checked={isTextSpacing}
                      onChange={toggleTextSpacing}
                      className="w-4 h-4"
                    />
                  </label>

                  <div>
                    <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">
                      Color Blind Mode
                    </label>
                    <select
                      value={colorBlindType}
                      onChange={(e) => setColorBlindType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                    >
                      <option value="none">None</option>
                      <option value="protanopia">Protanopia (Red-Blind)</option>
                      <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                      <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                      <option value="achromatopsia">Achromatopsia (Total)</option>
                    </select>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading Guide Overlay */}
      {isReadingGuide && (
        <div
          className="fixed inset-0 pointer-events-none z-40"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.7) 100%)'
          }}
        />
      )}
    </>
  );
};

export default AccessibilityToolbar;
