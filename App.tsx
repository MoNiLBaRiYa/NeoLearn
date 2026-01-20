import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAccessibilityStore } from './stores/accessibilityStore';
import { useAuthStore } from './stores/authStore';

// Components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import Dashboard from './pages/Dashboard';
import NotesPage from './pages/NotesPage';
import LibraryPage from './pages/LibraryPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import CalendarPage from './pages/CalendarPage';
import ProgressPage from './pages/ProgressPage';
import MyGoalsPage from './pages/MyGoalsPage';
import CommunityPage from './pages/CommunityPage';
import EditProfilePage from './pages/EditProfilePage';
import AIAssistantPage from './pages/AIAssistantPage';
import ProtectedRoute from './components/ProtectedRoute';
import AccessibilityToolbar from './components/AccessibilityToolbar';

function App() {
  const { 
    isDyslexicFont, 
    isHighContrast, 
    isReducedMotion,
    isScreenReaderMode,
    isKeyboardOnlyMode,
    isFocusHighlight,
    isLargeClickTargets,
    isTextSpacing,
    isCursorHighlight,
    isLineHeight,
    isLetterSpacing,
    isWordSpacing,
    isSimplifiedUI,
    colorBlindType
  } = useAccessibilityStore();
  const { user } = useAuthStore();

  React.useEffect(() => {
    // Apply accessibility classes to document
    const classes = [];
    if (isDyslexicFont) classes.push('dyslexic-font');
    if (isHighContrast) classes.push('high-contrast');
    if (isReducedMotion) classes.push('reduced-motion');
    if (isScreenReaderMode) classes.push('screen-reader-mode');
    if (isKeyboardOnlyMode) classes.push('keyboard-only-mode');
    if (isFocusHighlight) classes.push('focus-highlight');
    if (isLargeClickTargets) classes.push('large-click-targets');
    if (isTextSpacing) classes.push('text-spacing');
    if (isCursorHighlight) classes.push('cursor-highlight');
    if (isLineHeight) classes.push('increased-line-height');
    if (isLetterSpacing) classes.push('increased-letter-spacing');
    if (isWordSpacing) classes.push('increased-word-spacing');
    if (isSimplifiedUI) classes.push('simplified-ui');
    if (colorBlindType !== 'none') classes.push(`color-blind-${colorBlindType}`);
    
    document.documentElement.className = classes.join(' ');
  }, [
    isDyslexicFont, 
    isHighContrast, 
    isReducedMotion,
    isScreenReaderMode,
    isKeyboardOnlyMode,
    isFocusHighlight,
    isLargeClickTargets,
    isTextSpacing,
    isCursorHighlight,
    isLineHeight,
    isLetterSpacing,
    isWordSpacing,
    isSimplifiedUI,
    colorBlindType
  ]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Skip to main content link for keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/onboarding" 
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notes" 
            element={
              <ProtectedRoute>
                <NotesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/library" 
            element={
              <ProtectedRoute>
                <LibraryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/calendar" 
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/progress" 
            element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/goals" 
            element={
              <ProtectedRoute>
                <MyGoalsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/assistant" 
            element={
              <ProtectedRoute>
                <AIAssistantPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/community" 
            element={
              <ProtectedRoute>
                <CommunityPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile/edit" 
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        {/* Accessibility Toolbar - Available on all pages */}
        <AccessibilityToolbar />
        
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#374151',
              color: '#f9fafb',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;