# 🎓 NeoLearn - Modern Learning Platform

A comprehensive, accessible learning management platform built with React, TypeScript, Firebase, and Tailwind CSS. Designed to help students manage courses, track progress, and achieve their learning goals.

![React](https://img.shields.io/badge/React-18.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.7-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-cyan)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 📚 Learning Management
- **Course & Exam Tracking** - Organize courses, exams, and study schedules
- **Smart Calendar** - Visual calendar with task scheduling and reminders
- **Notes System** - Create, organize, and share study notes
- **Goal Setting** - Set learning goals and track progress
- **Progress Analytics** - Visualize learning progress with charts and statistics

### 🤖 AI-Powered Features
- **AI Study Assistant** - Get personalized study recommendations
- **Smart Scheduling** - AI-powered task prioritization
- **Learning Insights** - Data-driven learning analytics

### 👥 Community
- **Study Groups** - Connect with other learners
- **Resource Sharing** - Share notes and study materials
- **Discussion Forums** - Ask questions and help others

### ♿ Accessibility First
- **Screen Reader Support** - Full ARIA compliance
- **Dyslexic-Friendly Fonts** - OpenDyslexic font option
- **High Contrast Mode** - Enhanced visibility
- **Text-to-Speech** - Listen to content
- **Keyboard Navigation** - Complete keyboard accessibility
- **Color Blind Modes** - Multiple color blind filters
- **Adjustable Text Size** - Small, medium, large options
- **Reduced Motion** - Respects user preferences

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16.x or higher
- **npm** or **yarn**
- **Firebase Account** (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/neolearn.git
cd neolearn
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Firebase**

Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

Enable the following services:
- ✅ Authentication (Email/Password & Google Sign-In)
- ✅ Firestore Database
- ✅ Storage

4. **Configure environment variables**

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

5. **Deploy Firebase rules**
```bash
npm run firebase:deploy:rules
npm run firebase:deploy:indexes
```

6. **Start the development server**
```bash
npm run dev
```

7. **Open your browser**
```
http://localhost:5173
```

## 📁 Project Structure

```
neolearn/
├── components/          # Reusable React components
│   ├── AccessibilityToolbar.tsx
│   ├── AddCourseExamModal.tsx
│   ├── AddTaskModal.tsx
│   ├── ErrorBoundary.tsx
│   ├── LoadingSpinner.tsx
│   ├── ProtectedRoute.tsx
│   └── Sidebar.tsx
├── pages/              # Page components
│   ├── AIAssistantPage.tsx
│   ├── CalendarPage.tsx
│   ├── CommunityPage.tsx
│   ├── Dashboard.tsx
│   ├── EditProfilePage.tsx
│   ├── LandingPage.tsx
│   ├── LibraryPage.tsx
│   ├── LoginPage.tsx
│   ├── MyGoalsPage.tsx
│   ├── NotesPage.tsx
│   ├── OnboardingPage.tsx
│   ├── ProfilePage.tsx
│   ├── ProgressPage.tsx
│   ├── RegisterPage.tsx
│   └── SettingsPage.tsx
├── stores/             # Zustand state management
│   ├── accessibilityStore.ts
│   ├── authStore.ts
│   └── calendarStore.ts
├── types/              # TypeScript definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── constants.ts
│   └── helpers.ts
├── hooks/              # Custom React hooks
│   ├── useDebounce.ts
│   └── useLocalStorage.ts
├── firebase.ts         # Firebase configuration
├── App.tsx             # Main app component
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript type checking |
| `npm run firebase:deploy` | Deploy to Firebase Hosting |
| `npm run firebase:deploy:rules` | Deploy Firestore & Storage rules |
| `npm run firebase:deploy:indexes` | Deploy Firestore indexes |
| `npm run firebase:emulators` | Start Firebase emulators |

## 🔥 Firebase Setup

### Firestore Security Rules

The platform uses security rules to protect user data. Rules are defined in `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Deploy rules:
```bash
npm run firebase:deploy:rules
```

### Firestore Indexes

Some queries require composite indexes. Deploy them:
```bash
npm run firebase:deploy:indexes
```

## 🎨 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Styling |
| **Zustand** | State Management |
| **Firebase** | Backend (Auth, Database, Storage) |
| **React Router v6** | Routing |
| **Lucide React** | Icons |
| **Framer Motion** | Animations |
| **React Hook Form** | Form Handling |
| **React Hot Toast** | Notifications |

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 📱 Responsive Design

NeoLearn is fully responsive and works seamlessly on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktops (1024px+)
- 🖥️ Large screens (1920px+)

## ♿ Accessibility Standards

NeoLearn follows WCAG 2.1 Level AA guidelines:
- ✅ Keyboard Navigation
- ✅ Screen Reader Support
- ✅ Color Contrast Ratios
- ✅ Focus Indicators
- ✅ ARIA Labels
- ✅ Semantic HTML

## 🔒 Security

- 🔐 Firebase Authentication
- 🔐 Firestore Security Rules
- 🔐 Environment Variables
- 🔐 XSS Protection
- 🔐 CSRF Protection

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Firebase](https://firebase.google.com/) - Backend Platform
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Lucide](https://lucide.dev/) - Icon Library
- [OpenDyslexic](https://opendyslexic.org/) - Dyslexic-Friendly Font

## 📞 Support

If you encounter any issues or have questions:
- 📧 Email: support@neolearn.com
- 🐛 [Report a Bug](https://github.com/yourusername/neolearn/issues)
- 💡 [Request a Feature](https://github.com/yourusername/neolearn/issues)

## 🗺️ Roadmap

- [ ] Mobile App (React Native)
- [ ] Offline Mode
- [ ] Video Lessons Integration
- [ ] Gamification Features
- [ ] Advanced Analytics Dashboard
- [ ] Multi-language Support
- [ ] Dark Mode Improvements
- [ ] AI-Powered Study Plans

---

<div align="center">
  <p>Made with ❤️ by the NeoLearn Team</p>
  <p>⭐ Star us on GitHub if you find this project useful!</p>
</div>
