import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Calendar,
  Target,
  Award,
  CheckCircle,
  Accessibility,
} from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { useAccessibilityStore } from "../stores/accessibilityStore";
import toast from "react-hot-toast";

// Firestore
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

interface CourseExamData {
  type: "course" | "exam";
  name: string;
  targetDate?: string;
  syllabus: string[];
}

const disabilityOptions = [
  { value: "none", label: "No disability" },
  { value: "blind", label: "Blind or visually impaired" },
  { value: "deaf", label: "Deaf or hard of hearing" },
  { value: "dyslexic", label: "Dyslexia or learning disabilities" },
  { value: "motor", label: "Motor disabilities (limited movement)" },
  { value: "cognitive", label: "Cognitive disabilities" },
  { value: "multiple", label: "Multiple disabilities" },
];

const OnboardingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [disabilityType, setDisabilityType] = useState("none");
  const [selectedType, setSelectedType] = useState<"course" | "exam" | null>(null);
  const [courseExamData, setCourseExamData] = useState<CourseExamData[]>([]);
  const [currentItem, setCurrentItem] = useState<Partial<CourseExamData>>({});

  const { updateUser, user } = useAuthStore();
  const { speak, toggleTTS, toggleSTT } = useAccessibilityStore();
  const navigate = useNavigate();

  const steps = [
    {
      title: "Welcome to NeoLearn!",
      description: "Set up your accessibility preferences",
      icon: <Accessibility className="w-12 h-12" />,
    },
    {
      title: "Choose Your Learning Path",
      description: "Are you studying for a course or preparing for an exam?",
      icon: <Target className="w-12 h-12" />,
    },
    {
      title: "Add Details",
      description: "Tell us more about your course or exam",
      icon: <BookOpen className="w-12 h-12" />,
    },
    {
      title: "Set Your Timeline",
      description: "When do you need to complete this?",
      icon: <Calendar className="w-12 h-12" />,
    },
    {
      title: "All Set!",
      description: "You're ready to start your learning journey",
      icon: <CheckCircle className="w-12 h-12" />,
    },
  ];

  const handleFinish = async () => {
    if (user) {
      const userData = {
        onboardingCompleted: true,
        disabilityType,
        courses: courseExamData.filter((i) => i.type === "course"),
        exams: courseExamData.filter((i) => i.type === "exam"),
      };

      // Update preferences for TTS/STT
      if (disabilityType === "blind") toggleTTS();
      else if (disabilityType === "deaf") toggleSTT();

      updateUser(userData);

      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, userData);
      } catch (err) {
        console.error("Error updating Firestore:", err);
      }
    }

    speak("Onboarding completed. Welcome to your dashboard!");
    toast.success("Welcome to NeoLearn! Your dashboard is ready.");
    navigate("/dashboard");
  };

  const addCurrentItem = () => {
    if (currentItem.name && selectedType) {
      setCourseExamData((prev) => [
        ...prev,
        { ...(currentItem as CourseExamData), type: selectedType },
      ]);
      setCurrentItem({});
      setSelectedType(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-learning-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="card p-8 mb-8"
          >
            {currentStep === steps.length - 1 ? (
              <div className="text-center space-y-6">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                <h2 className="text-3xl font-bold">You're All Set!</h2>
                <p className="text-lg text-gray-600">Your personalized dashboard is ready.</p>
                <button onClick={handleFinish} className="btn btn-primary px-8 py-3 text-lg">
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h2>
                <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>

                {/* Step 0: Disability */}
                {currentStep === 0 && (
                  <select
                    className="form-input"
                    value={disabilityType}
                    onChange={(e) => setDisabilityType(e.target.value)}
                  >
                    {disabilityOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}

                {/* Step 1: Select type */}
                {currentStep === 1 && (
                  <div className="flex justify-center gap-4">
                    <button
                      className={`btn ${selectedType === "course" ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => setSelectedType("course")}
                    >
                      Course
                    </button>
                    <button
                      className={`btn ${selectedType === "exam" ? "btn-primary" : "btn-secondary"}`}
                      onClick={() => setSelectedType("exam")}
                    >
                      Exam
                    </button>
                  </div>
                )}

                {/* Step 2: Add name */}
                {currentStep === 2 && (
                  <div className="flex flex-col gap-2">
                    <input
                      className="form-input"
                      placeholder={`Enter ${selectedType || "item"} name`}
                      value={currentItem.name || ""}
                      onChange={(e) =>
                        setCurrentItem((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                    <button onClick={addCurrentItem} className="btn btn-primary">
                      Add {selectedType || "item"}
                    </button>
                    {courseExamData.length > 0 && (
                      <ul className="mt-2 text-left">
                        {courseExamData.map((c, idx) => (
                          <li key={idx}>
                            {c.type}: {c.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Step 3: Timeline */}
                {currentStep === 3 && (
                  <input
                    type="date"
                    className="form-input"
                    value={currentItem.targetDate || ""}
                    onChange={(e) =>
                      setCurrentItem((prev) => ({ ...prev, targetDate: e.target.value }))
                    }
                  />
                )}

                <button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="btn btn-primary px-6 py-2 mt-4"
                  disabled={currentStep === 1 && !selectedType}
                >
                  Next <ChevronRight className="inline w-4 h-4 ml-2" />
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {currentStep > 0 && currentStep < steps.length - 1 && (
          <button
            onClick={() => setCurrentStep((s) => s - 1)}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <ChevronLeft className="w-4 h-4" /> <span>Back</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
