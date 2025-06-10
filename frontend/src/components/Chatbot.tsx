"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'quick-actions';
}

interface QuickAction {
  id: string;
  text: string;
  action: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! 👋 I'm your AI assistant. How can I help you with CodeVeer today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'quick-actions'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions: QuickAction[] = [
    { id: '1', text: 'What is CodeVeer?', action: 'explain_codeveer' },
    { id: '2', text: 'How to get started?', action: 'getting_started' },
    { id: '3', text: 'Features & Pricing', action: 'features_pricing' },
    { id: '4', text: 'Contact Support', action: 'contact_support' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enhanced AI responses with context awareness
  const getBotResponse = async (userMessage: string, action?: string) => {
    setIsTyping(true);
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const message = userMessage.toLowerCase();
    
    // Context-aware responses
    if (action === 'explain_codeveer' || message.includes('what is') || message.includes('tell me about')) {
      return "CodeVeer is an innovative interview preparation platform that connects developers, creators, and companies. We offer AI-powered mock interviews, real-time coding challenges, and personalized learning paths to help you ace your technical interviews and advance your career! 🚀";
    }
    
    if (action === 'getting_started' || message.includes('start') || message.includes('begin') || message.includes('sign up')) {
      return "Getting started is easy! 🎯\n\n1. Choose your role (Developer, Creator, or Admin)\n2. Create your account\n3. Complete your profile\n4. Start practicing with our AI-powered mock interviews\n5. Track your progress and improve!\n\nWould you like me to guide you through the signup process?";
    }
    
    if (action === 'features_pricing' || message.includes('features') || message.includes('pricing') || message.includes('cost')) {
      return "CodeVeer offers amazing features! ✨\n\n• AI-powered mock interviews\n• Real-time coding challenges\n• Personalized learning paths\n• Progress tracking\n• Community support\n• Multiple difficulty levels\n\nWe have flexible pricing plans starting from free tier. Check out our pricing page for detailed information!";
    }
    
    if (action === 'contact_support' || message.includes('support') || message.includes('help') || message.includes('contact')) {
      return "I'm here to help! 💬\n\nFor technical support:\n• Email: support@codeveer.com\n• Live chat: Available 24/7\n• Documentation: docs.codeveer.com\n\nFor general inquiries:\n• Email: hello@codeveer.com\n• Phone: +1 (555) 123-4567\n\nIs there something specific I can help you with?";
    }
    
    if (message.includes('interview') || message.includes('practice')) {
      return "Great! Our AI-powered mock interviews are designed to simulate real interview scenarios. You can practice with different programming languages, difficulty levels, and question types. Each session provides detailed feedback to help you improve! 🎯";
    }
    
    if (message.includes('thank') || message.includes('thanks')) {
      return "You're welcome! 😊 I'm here to help you succeed with CodeVeer. Feel free to ask me anything anytime!";
    }
    
    if (message.includes('bye') || message.includes('goodbye')) {
      return "Goodbye! 👋 Have a great day and good luck with your interview preparation! Remember, I'm here whenever you need help.";
    }

    // Default responses for other queries
    const defaultResponses = [
      "That's a great question! Let me help you with that.",
      "I understand what you're looking for. Here's what I can tell you...",
      "Based on your query, I'd recommend checking out our features section.",
      "I'm here to help! Could you provide more details about that?",
      "That's an interesting point. Let me explain how CodeVeer handles this...",
      "I'd be happy to guide you through that process step by step.",
      "Great question! This is something many users ask about.",
      "Let me break that down for you in simple terms...",
      "I can definitely help you with that! Here's what you need to know...",
      "That's a common concern. Let me address that for you..."
    ];

    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    
    return randomResponse;
  };

  const handleQuickAction = async (action: string, text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    const botResponse = await getBotResponse(text, action);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const botResponse = await getBotResponse(inputValue);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botResponse,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    if (isOpen && isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
    setHasNotification(false);
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      <motion.button
        onClick={toggleChat}
        className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          y: [0, -5, 0]
        }}
        transition={{ 
          delay: 2, 
          duration: 0.5,
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        {/* Notification Badge */}
        {hasNotification && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 3, duration: 0.3 }}
          >
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        )}
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${
              isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
            }`}
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-xs text-blue-100">Online</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {!isMinimized && (
                  <motion.button
                    onClick={minimizeChat}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Minimize2 size={16} />
                  </motion.button>
                )}
                {isMinimized && (
                  <motion.button
                    onClick={() => setIsMinimized(false)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Maximize2 size={16} />
                  </motion.button>
                )}
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          message.sender === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }`}>
                          {message.sender === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                        </div>
                        <div className={`px-4 py-2 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
                        }`}>
                          <p className="text-sm whitespace-pre-line">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                          }`}>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          
                          {/* Quick Actions */}
                          {message.type === 'quick-actions' && (
                            <div className="mt-3 space-y-2">
                              {quickActions.map((action, idx) => (
                                <motion.button
                                  key={action.id}
                                  onClick={() => handleQuickAction(action.action, action.text)}
                                  className="w-full text-left p-2 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors text-xs"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.5 + idx * 0.1 }}
                                >
                                  {action.text}
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      className="flex justify-start"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center">
                          <Sparkles size={16} className="text-gray-600 dark:text-gray-300" />
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-2xl rounded-bl-md">
                          <div className="flex space-x-1">
                            <motion.div
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-gray-400 rounded-full"
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      disabled={isTyping}
                    />
                    <motion.button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Send size={16} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot; 