import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Send,
  Bot,
  User,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Calendar,
  BookOpen,
  Target,
  TrendingUp,
  Lightbulb,
  Clock
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useAccessibilityStore } from '../stores/accessibilityStore';
import { useAuthStore } from '../stores/authStore';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI learning assistant. I can help you with study planning, progress tracking, and answering questions about your courses. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { speak, isSTTEnabled, isTTSEnabled } = useAccessibilityStore();
  const { user } = useAuthStore();

  const quickActions = [
    { icon: Calendar, text: 'Plan my week', color: 'bg-primary-100 text-primary-600' },
    { icon: TrendingUp, text: 'Show my progress', color: 'bg-learning-100 text-learning-600' },
    { icon: Target, text: 'Update my goals', color: 'bg-achievement-100 text-achievement-600' },
    { icon: BookOpen, text: 'Recommend resources', color: 'bg-purple-100 text-purple-600' },
    { icon: Clock, text: 'Optimize my schedule', color: 'bg-pink-100 text-pink-600' },
    { icon: Lightbulb, text: 'Study tips', color: 'bg-yellow-100 text-yellow-600' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('progress') || message.includes('how am i doing')) {
      return `Based on your current progress, you've completed 67% of your GATE preparation. You're doing well in Operating Systems (80%) and Database Management (75%), but you might want to focus more on Computer Networks (45%). Your current streak is ${user?.streak || 0} days - keep it up!`;
    }
    
    if (message.includes('plan') || message.includes('schedule') || message.includes('week')) {
      return 'I can help you plan your week! Based on your goals and current progress, I recommend:\n\n• Monday: Focus on Computer Networks (2 hours)\n• Tuesday: Data Structures practice (1.5 hours)\n• Wednesday: Operating Systems revision (2 hours)\n• Thursday: Mock test (1 hour)\n• Friday: Database Management (1.5 hours)\n\nWould you like me to add these to your calendar?';
    }
    
    if (message.includes('goal') || message.includes('target')) {
      return 'Your current goals:\n\n🎯 GATE 2026: 67% complete (182 days remaining)\n📚 Python Course: 45% complete (30 days remaining)\n\nYou\'re on track with GATE preparation but falling slightly behind in Python. I suggest dedicating 30 minutes daily to Python to catch up. Would you like me to adjust your schedule?';
    }
    
    if (message.includes('resource') || message.includes('recommend') || message.includes('study material')) {
      return 'Here are some recommended resources based on your current subjects:\n\n📚 **Computer Networks:**\n• "Computer Networks" by Tanenbaum (Free PDF available)\n• Gate Smashers YouTube playlist (4.8★)\n\n💻 **Operating Systems:**\n• "Operating System Concepts" by Silberschatz\n• Neso Academy videos (4.9★)\n\nWould you like me to find more specific resources for any topic?';
    }
    
    if (message.includes('tip') || message.includes('advice') || message.includes('help')) {
      return 'Here are some personalized study tips for you:\n\n✅ **Active Recall:** Test yourself regularly instead of just re-reading\n✅ **Spaced Repetition:** Review topics at increasing intervals\n✅ **Pomodoro Technique:** Study in 25-minute focused sessions\n✅ **Practice Tests:** Take mock exams weekly to track progress\n\nBased on your learning style, I also recommend using visual aids for complex topics like networking protocols.';
    }
    
    if (message.includes('behind') || message.includes('struggling') || message.includes('difficult')) {
      return 'I understand you\'re facing some challenges. Here\'s what I suggest:\n\n🎯 **Prioritize:** Focus on high-weightage topics first\n📅 **Reschedule:** I can help redistribute your remaining topics\n🤝 **Get Help:** Consider joining study groups or finding a study buddy\n💪 **Stay Motivated:** Remember your goals and celebrate small wins\n\nWould you like me to create a catch-up plan for you?';
    }
    
    return 'I\'m here to help with your learning journey! I can assist with study planning, progress tracking, resource recommendations, and answering questions about your courses. What specific area would you like help with?';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      if (isTTSEnabled) {
        speak(aiResponse.content);
      }
    }, 1000);
  };

  const handleQuickAction = (actionText: string) => {
    setInputMessage(actionText);
    handleSendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    if (!isSTTEnabled) {
      speak('Speech to text is not enabled. Please enable it in settings.');
      return;
    }
    
    setIsListening(!isListening);
    if (!isListening) {
      speak('Listening for your message');
      // In a real implementation, you would start speech recognition here
    } else {
      speak('Stopped listening');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-learning-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                AI Learning Assistant
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Your personal study companion powered by AI
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleQuickAction(action.text)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80 ${action.color}`}
              >
                <action.icon className="w-4 h-4" />
                <span>{action.text}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-3 max-w-3xl ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-primary-600' 
                    : 'bg-gradient-to-br from-primary-600 to-learning-600'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className={`rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                }`}>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-primary-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex items-start space-x-3 max-w-3xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-600 to-learning-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your studies..."
                className="w-full resize-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              {isSTTEnabled && (
                <button
                  onClick={toggleListening}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                  }`}
                  aria-label={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
              )}
              
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="btn btn-primary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AIAssistantPage;