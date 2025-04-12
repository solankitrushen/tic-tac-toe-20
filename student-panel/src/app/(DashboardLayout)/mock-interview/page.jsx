'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Link,
  User,
  MessageSquare,
  Check,
  X,
  Star,
  Copy,
  Plus,
  Bookmark,
  Award,
  Mic,
  Video,
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MockInterview = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    interviewType: 'technical',
    interviewTopic: '',
    interviewDescription: '',
    interviewDate: '',
    interviewDuration: 60,
    interviewLink: '',
    resumeUrl: '',
  });

  // Dummy data for 404 responses
  const dummyInterviews = [
    {
      interviewId: 'int_dummy_1',
      userId: 'user_dummy',
      interviewType: 'technical',
      interviewTopic: 'React Advanced Concepts',
      interviewDescription:
        'Mock interview focusing on React hooks, context API, and performance optimization.',
      interviewDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      interviewDuration: 60,
      interviewLink: 'https://meet.google.com/dummy-123',
      interviewStatus: 'requested',
      interviewerName: 'To be assigned',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      interviewId: 'int_dummy_2',
      userId: 'user_dummy',
      interviewType: 'system-design',
      interviewTopic: 'Design Twitter',
      interviewDescription:
        'System design interview focusing on scalability and distributed systems.',
      interviewDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      interviewDuration: 90,
      interviewLink: 'https://meet.google.com/dummy-456',
      interviewStatus: 'completed',
      interviewerName: 'Jane Smith',
      interviewerEmail: 'jane@example.com',
      interviewRating: 4.5,
      interviewFeedback:
        'Great performance on the system design. Work on explaining your thought process more clearly.',
      performanceScore: 85,
      paymentStatus: 'completed',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
  ];

  useEffect(() => {
    fetchUserInterviews();
  }, []);

  const fetchUserInterviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/mock-interviews/user/all');

      if (response.status === 404) {
        setInterviews(dummyInterviews);
        setError('Could not load your interviews. Showing sample data instead.');
        toast.warn('Showing sample data as your interviews could not be loaded');
      } else if (response.data && response.data.interviews) {
        setInterviews(response.data.interviews);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching interviews:', err);

      if (err.response && err.response.status === 404) {
        setInterviews(dummyInterviews);
        setError('Could not load your interviews. Showing sample data instead.');
        toast.warn('Showing sample data as your interviews could not be loaded');
      } else {
        setError('Failed to fetch mock interviews');
        toast.error('Failed to fetch interviews. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload the file to a storage service
      // and get the URL to store in your database
      const dummyUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        resumeUrl: dummyUrl,
      }));
      toast.success('Resume uploaded successfully!');
    }
  };

  const handleCreateInterview = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('/mock-interviews', formData);

      if (response.status === 201) {
        setShowCreateForm(false);
        setFormData({
          interviewType: 'technical',
          interviewTopic: '',
          interviewDescription: '',
          interviewDate: '',
          interviewDuration: 60,
          interviewLink: '',
          resumeUrl: '',
        });
        toast.success('Mock interview requested successfully!');
        fetchUserInterviews();
      }
    } catch (err) {
      console.error('Error creating interview:', err);

      if (err.response && err.response.status === 404) {
        const newInterview = {
          ...formData,
          interviewId: `int_dummy_${Date.now()}`,
          userId: 'user_dummy',
          interviewStatus: 'requested',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setInterviews((prev) => [...prev, newInterview]);
        toast.warn('Created locally as server unavailable');
      } else {
        toast.error('Failed to request mock interview. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelInterview = async (interviewId) => {
    try {
      const response = await axios.patch(`/mock-interviews/${interviewId}/cancel`);

      if (response.status === 404) {
        setInterviews((prev) =>
          prev.map((int) =>
            int.interviewId === interviewId ? { ...int, interviewStatus: 'cancelled' } : int,
          ),
        );
        toast.success('Cancelled locally');
      } else {
        toast.success('Interview cancelled');
        fetchUserInterviews();
      }
    } catch (err) {
      console.error('Error cancelling interview:', err);
      toast.error('Failed to cancel interview');
    }
  };

  const filteredInterviews = interviews.filter((int) => {
    if (activeTab === 'upcoming')
      return ['requested', 'confirmed', 'scheduled'].includes(int.interviewStatus);
    if (activeTab === 'completed') return int.interviewStatus === 'completed';
    if (activeTab === 'cancelled') return int.interviewStatus === 'cancelled';
    return true;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };

  const getInterviewTypeIcon = (type) => {
    switch (type) {
      case 'technical':
        return <Mic size={16} className="mr-1" />;
      case 'system-design':
        return <Award size={16} className="mr-1" />;
      case 'hr':
        return <User size={16} className="mr-1" />;
      default:
        return <Bookmark size={16} className="mr-1" />;
    }
  };

  const getInterviewTypeColor = (type) => {
    switch (type) {
      case 'technical':
        return 'bg-purple-900/30 text-purple-400';
      case 'system-design':
        return 'bg-indigo-900/30 text-indigo-400';
      case 'hr':
        return 'bg-amber-900/30 text-amber-400';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-300 font-medium">Loading your mock interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Mock Interviews</h1>
              <p className="text-gray-400">
                Practice with experienced interviewers and get valuable feedback
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg"
            >
              <Plus size={20} className="mr-2" />
              Request Interview
            </button>
          </div>
        </header>

        {/* Error message (shown when using dummy data) */}
        {error && (
          <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Create Interview Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Request Mock Interview</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateInterview}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Interview Type</label>
                    <select
                      name="interviewType"
                      value={formData.interviewType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                      required
                    >
                      <option value="technical">Technical Interview</option>
                      <option value="system-design">System Design</option>
                      <option value="hr">HR Interview</option>
                      <option value="frontend">Frontend Focused</option>
                      <option value="backend">Backend Focused</option>
                      <option value="fullstack">Fullstack</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Topic/Focus Area</label>
                    <input
                      type="text"
                      name="interviewTopic"
                      value={formData.interviewTopic}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="e.g. React, Node.js, System Design, etc."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Description</label>
                    <textarea
                      name="interviewDescription"
                      value={formData.interviewDescription}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Describe what you'd like to focus on during the interview"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">
                        Preferred Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        name="interviewDate"
                        value={formData.interviewDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Duration</label>
                      <select
                        name="interviewDuration"
                        value={formData.interviewDuration}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        required
                      >
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="90">1.5 hours</option>
                        <option value="120">2 hours</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Meeting Link (if available)
                    </label>
                    <input
                      type="url"
                      name="interviewLink"
                      value={formData.interviewLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="https://meet.google.com/abc-xyz"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">
                      Upload Resume (optional)
                    </label>
                    <div className="flex items-center">
                      <label className="cursor-pointer">
                        <span className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg hover:bg-gray-600 transition-colors">
                          Choose File
                        </span>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                        />
                      </label>
                      {formData.resumeUrl && (
                        <span className="ml-3 text-sm text-gray-300">Resume selected</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Requesting...
                      </>
                    ) : (
                      'Request Interview'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'upcoming'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'completed'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`px-6 py-3 font-medium ${
              activeTab === 'cancelled'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Cancelled
          </button>
        </div>

        {/* Interview Cards */}
        {filteredInterviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInterviews.map((int) => (
              <div
                key={int.interviewId}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-blue-500/30"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{int.interviewTopic}</h3>
                      <div
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getInterviewTypeColor(
                          int.interviewType,
                        )}`}
                      >
                        {getInterviewTypeIcon(int.interviewType)}
                        {int.interviewType
                          .split('-')
                          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ')}
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        int.interviewStatus === 'requested'
                          ? 'bg-blue-900/50 text-blue-400'
                          : int.interviewStatus === 'confirmed' ||
                            int.interviewStatus === 'scheduled'
                          ? 'bg-purple-900/50 text-purple-400'
                          : int.interviewStatus === 'completed'
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}
                    >
                      {int.interviewStatus.charAt(0).toUpperCase() + int.interviewStatus.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-400 mb-4 line-clamp-3">{int.interviewDescription}</p>

                  <div className="space-y-3 mb-5 border-t border-gray-700 pt-4">
                    <div className="flex items-center text-gray-300">
                      <Calendar size={16} className="mr-2 flex-shrink-0 text-gray-500" />
                      <span className="text-sm">
                        {new Date(int.interviewDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        •{' '}
                        {new Date(int.interviewDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock size={16} className="mr-2 flex-shrink-0 text-gray-500" />
                      <span className="text-sm">{int.interviewDuration} minutes</span>
                    </div>

                    {int.interviewerName && (
                      <div className="flex items-center text-gray-300">
                        <User size={16} className="mr-2 flex-shrink-0 text-gray-500" />
                        <span className="text-sm">Interviewer: {int.interviewerName}</span>
                      </div>
                    )}

                    {int.interviewLink && (
                      <div className="flex items-center text-gray-300">
                        <Link size={16} className="mr-2 flex-shrink-0 text-gray-500" />
                        <div className="flex items-center group">
                          <span
                            onClick={() => window.open(int.interviewLink, '_blank')}
                            className="text-sm text-blue-400 hover:text-blue-300 hover:underline cursor-pointer truncate max-w-xs"
                          >
                            {int.interviewLink.replace(/^https?:\/\//, '')}
                          </span>
                          <button
                            onClick={() => copyToClipboard(int.interviewLink)}
                            className="ml-2 text-gray-500 hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100"
                            title="Copy link"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {int.resumeUrl && (
                      <div className="flex items-center text-gray-300">
                        <Bookmark size={16} className="mr-2 flex-shrink-0 text-gray-500" />
                        <a
                          href={int.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                        >
                          View Resume
                        </a>
                      </div>
                    )}

                    {int.interviewRating && (
                      <div className="flex items-center text-gray-300">
                        <Star
                          size={16}
                          className="mr-2 flex-shrink-0 text-yellow-400 fill-current"
                        />
                        <span className="text-sm">Your Rating: {int.interviewRating}/5</span>
                      </div>
                    )}

                    {int.performanceScore && (
                      <div className="flex items-center text-gray-300">
                        <Award size={16} className="mr-2 flex-shrink-0 text-green-400" />
                        <span className="text-sm">
                          Performance Score: {int.performanceScore}/100
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between border-t border-gray-700 pt-4">
                    {['requested', 'confirmed', 'scheduled'].includes(int.interviewStatus) && (
                      <button
                        onClick={() => handleCancelInterview(int.interviewId)}
                        className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg font-medium hover:bg-red-900/50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}

                    {int.interviewStatus === 'completed' && !int.interviewFeedback && (
                      <button
                        onClick={() => router.push(`/mock-interviews/${int.interviewId}/feedback`)}
                        className="w-full px-4 py-2 bg-blue-900/30 text-blue-400 rounded-lg font-medium hover:bg-blue-900/50 transition-colors"
                      >
                        View Feedback
                      </button>
                    )}

                    {int.interviewStatus === 'completed' && int.interviewFeedback && (
                      <button
                        onClick={() => router.push(`/mock-interviews/${int.interviewId}`)}
                        className="w-full px-4 py-2 bg-purple-900/30 text-purple-400 rounded-lg font-medium hover:bg-purple-900/50 transition-colors"
                      >
                        Details & Feedback
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 p-10 rounded-xl shadow-lg text-center border border-gray-700">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
              <User size={24} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'upcoming'
                ? 'No upcoming interviews'
                : activeTab === 'completed'
                ? 'No completed interviews'
                : 'No cancelled interviews'}
            </h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'upcoming'
                ? 'Request a mock interview to get started'
                : 'Your ' + activeTab + ' interviews will appear here'}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg"
              >
                Request Interview
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
