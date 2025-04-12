'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  MessageSquare,
  User,
  Bot,
  Send,
  Loader2,
  BookOpen,
  Briefcase,
  GraduationCap,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Check,
  FileText,
  Upload,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GROQ_API_KEY = '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';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const CareerGuidanceChatbot = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I'm your Career Guidance Assistant. Upload your resume (PDF or text) for analysis or ask career questions.",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [careerFlow, setCareerFlow] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeFile, setResumeFile] = useState(null);
  const [isReviewingResume, setIsReviewingResume] = useState(false);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Career paths data (same as before)
  const careerPaths = {
    technology: {
      name: 'Technology',
      steps: [
        'Identify your tech interest',
        'Learn programming skills',
        'Build projects',
        'Create portfolio',
        'Prepare for interviews',
        'Apply for positions',
      ],
      resources: ['freeCodeCamp', 'Codecademy', 'LeetCode'],
    },
    business: {
      name: 'Business',
      steps: [
        'Choose business area',
        'Develop relevant skills',
        'Gain experience',
        'Network',
        'Create resume',
        'Apply for jobs',
      ],
      resources: ['Harvard Business Review', 'Coursera'],
    },
    healthcare: {
      name: 'Healthcare',
      steps: [
        'Determine role',
        'Complete education',
        'Gain experience',
        'Prepare for exams',
        'Develop skills',
        'Apply for positions',
      ],
      resources: ['Khan Academy Medicine', 'AMA'],
    },
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, careerFlow]);

  const queryLLM = async (prompt) => {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: GROQ_MODEL,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1024,
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
          withCredentials: false,
        },
      );
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling API:', error);
      throw error;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];

    if (!validTypes.includes(file.type)) {
      toast.error('Please upload PDF, DOC, DOCX, or TXT');
      return;
    }

    // Validate size
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large (max 5MB)');
      return;
    }

    setResumeFile(file);
    setIsReviewingResume(true);
    setLoading(true);

    try {
      // Read file as text
      const text = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
      });

      // Analyze with LLM
      const prompt = `Analyze this resume and provide detailed feedback on:
      1. Overall structure
      2. Key strengths
      3. Areas for improvement
      4. Specific suggestions
      
      Resume content:
      ${text.substring(0, 10000)}`; // Limit to first 10k chars

      const analysis = await queryLLM(prompt);

      setMessages((prev) => [
        ...prev,
        {
          role: 'user',
          content: `[Uploaded Resume: ${file.name}]`,
        },
        {
          role: 'assistant',
          content: analysis,
        },
      ]);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      toast.error('Analysis failed. Please try again.');
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I could not analyze your resume. Please try a different file.',
        },
      ]);
    } finally {
      setIsReviewingResume(false);
      setLoading(false);
    }
  };

  const handleRemoveResume = () => {
    setResumeFile(null);
    toast.info('Resume removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Check for career path questions
      const lowerInput = input.toLowerCase();
      if (lowerInput.includes('career path') || lowerInput.includes('learning path')) {
        if (lowerInput.includes('tech') || lowerInput.includes('software')) {
          setCareerFlow(careerPaths.technology);
          setCurrentStep(0);
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: "Let's explore the Technology career path." },
          ]);
        } else if (lowerInput.includes('business') || lowerInput.includes('finance')) {
          setCareerFlow(careerPaths.business);
          setCurrentStep(0);
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: "Let's explore the Business career path." },
          ]);
        } else if (lowerInput.includes('health') || lowerInput.includes('medical')) {
          setCareerFlow(careerPaths.healthcare);
          setCurrentStep(0);
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: "Let's explore the Healthcare career path." },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'Which career field interests you? (Technology, Business, Healthcare)',
            },
          ]);
        }
        setLoading(false);
        return;
      }

      // Normal question
      const response = await queryLLM(input);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Sorry, I couldn't process that. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of the component code remains the same, including render/UI parts)
  // This includes the handleQuickQuestion, toggleResources, handleNextStep, handlePrevStep, completeCareerFlow functions
  // And the JSX return statement with all the UI components

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 py-6 px-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare className="text-blue-400" size={24} />
            <h1 className="text-2xl font-bold text-white">Career Guidance Assistant</h1>
          </div>
          <button
            onClick={() => setShowResources(!showResources)}
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {showResources ? (
              <>
                <ChevronUp size={18} className="mr-2" />
                Hide Resources
              </>
            ) : (
              <>
                <ChevronDown size={18} className="mr-2" />
                Career Resources
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Chat Container */}
        <div className="flex-1 flex flex-col bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-lg p-4 ${
                    message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <div className="flex items-center mb-2">
                    {message.role === 'user' ? (
                      <User size={18} className="mr-2" />
                    ) : (
                      <Bot size={18} className="mr-2 text-green-400" />
                    )}
                    <span className="font-medium">
                      {message.role === 'user' ? 'You' : 'Career Assistant'}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))}

            {/* Career Flow Display */}
            {careerFlow && (
              <div className="mb-4 flex justify-start">
                <div className="max-w-3xl rounded-lg p-4 bg-gray-700 text-gray-100">
                  <div className="flex items-center mb-2">
                    <Bot size={18} className="mr-2 text-green-400" />
                    <span className="font-medium">Career Path: {careerFlow.name}</span>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-medium mb-2">
                      Step {currentStep + 1} of {careerFlow.steps.length}:
                    </h3>
                    <p className="bg-gray-600 p-3 rounded-lg">{careerFlow.steps[currentStep]}</p>
                  </div>

                  {currentStep === careerFlow.steps.length - 1 && (
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Recommended Resources:</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {careerFlow.resources.map((resource, idx) => (
                          <li key={idx}>{resource}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      disabled={currentStep === 0}
                      className={`px-4 py-2 rounded-lg ${
                        currentStep === 0
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      Previous
                    </button>

                    {currentStep < careerFlow.steps.length - 1 ? (
                      <button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                      >
                        Next Step <ArrowRight size={18} className="ml-2" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setMessages((prev) => [
                            ...prev,
                            {
                              role: 'assistant',
                              content: `You've completed the ${careerFlow.name} career path overview!`,
                            },
                          ]);
                          setCareerFlow(null);
                          setCurrentStep(0);
                        }}
                        className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg"
                      >
                        Complete <Check size={18} className="ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex justify-start mb-4">
                <div className="max-w-3xl rounded-lg p-4 bg-gray-700 text-gray-100">
                  <div className="flex items-center">
                    <Bot size={18} className="mr-2 text-green-400" />
                    <span className="font-medium">Career Assistant</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <Loader2 size={20} className="animate-spin mr-2 text-gray-400" />
                    <span>{isReviewingResume ? 'Analyzing resume...' : 'Thinking...'}</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
            {/* Resume Upload Section */}
            <div className="mb-3">
              {resumeFile ? (
                <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                  <div className="flex items-center">
                    <FileText size={18} className="mr-2 text-blue-400" />
                    <span className="truncate max-w-xs">{resumeFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center cursor-pointer bg-gray-700 hover:bg-gray-600 p-3 rounded-lg transition-colors">
                  <Upload size={18} className="mr-2" />
                  <span>Upload Resume (PDF, DOC, TXT)</span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.txt"
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about career paths, skills, job search tips..."
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setInput('What careers are good for problem-solving?')}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full transition-colors"
              >
                Problem-solving careers
              </button>
              <button
                type="button"
                onClick={() => setInput('How can I improve my resume for tech jobs?')}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full transition-colors"
              >
                Tech resume tips
              </button>
              <button
                type="button"
                onClick={() => setInput('Show me the technology career path')}
                className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-full transition-colors"
              >
                Tech career path
              </button>
            </div>
          </form>
        </div>

        {/* Resources Panel */}
        {showResources && (
          <div className="md:w-80 bg-gray-800 rounded-xl shadow-lg overflow-hidden h-fit">
            <div className="p-4 bg-gray-700 border-b border-gray-600">
              <h2 className="text-lg font-bold flex items-center">
                <BookOpen size={18} className="mr-2 text-yellow-400" />
                Career Resources
              </h2>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
              <h3 className="font-medium text-lg mb-3 text-blue-400">Quick Career Paths</h3>
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => {
                    setCareerFlow(careerPaths.technology);
                    setCurrentStep(0);
                    setMessages((prev) => [
                      ...prev,
                      {
                        role: 'assistant',
                        content: "Let's explore the Technology career path",
                      },
                    ]);
                    setShowResources(false);
                  }}
                  className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Briefcase size={16} className="mr-2 text-blue-400" />
                    Technology Path
                  </div>
                </button>
                <button
                  onClick={() => {
                    setCareerFlow(careerPaths.business);
                    setCurrentStep(0);
                    setMessages((prev) => [
                      ...prev,
                      {
                        role: 'assistant',
                        content: "Let's explore the Business career path",
                      },
                    ]);
                    setShowResources(false);
                  }}
                  className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <GraduationCap size={16} className="mr-2 text-green-400" />
                    Business Path
                  </div>
                </button>
                <button
                  onClick={() => {
                    setCareerFlow(careerPaths.healthcare);
                    setCurrentStep(0);
                    setMessages((prev) => [
                      ...prev,
                      {
                        role: 'assistant',
                        content: "Let's explore the Healthcare career path",
                      },
                    ]);
                    setShowResources(false);
                  }}
                  className="w-full text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <div className="flex items-center">
                    <Lightbulb size={16} className="mr-2 text-yellow-400" />
                    Healthcare Path
                  </div>
                </button>
              </div>

              <h3 className="font-medium text-lg mb-3 text-blue-400">General Resources</h3>
              <ul className="space-y-2">
                <li className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    LinkedIn Networking
                  </a>
                </li>
                <li className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <a
                    href="https://www.coursera.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    Coursera Courses
                  </a>
                </li>
                <li className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <a
                    href="https://www.indeed.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    Indeed Job Search
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-4 px-4 border-t border-gray-700">
        <div className="container mx-auto text-center text-gray-400 text-sm">
          <p>Career Guidance Assistant - Helping you navigate your professional journey</p>
        </div>
      </footer>
    </div>
  );
};

export default CareerGuidanceChatbot;
