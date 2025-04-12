'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Clock,
  Link,
  Users,
  MessageSquare,
  Check,
  X,
  Star,
  Copy,
  Plus,
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GroupDiscussion = () => {
  const [gds, setGds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    gdTopic: '',
    gdDescription: '',
    gdDate: '',
    gdDuration: 60,
    gdLink: '',
  });

  // Dummy data for 404 responses
  const dummyGDs = [
    {
      gdId: 'gd_dummy_1',
      userId: 'user_dummy',
      gdTopic: 'Sample Discussion - React Hooks',
      gdDescription:
        'This is a dummy discussion about React Hooks and their advanced usage patterns.',
      gdDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      gdDuration: 60,
      gdLink: 'https://meet.google.com/dummy-123',
      gdStatus: 'scheduled',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      gdId: 'gd_dummy_2',
      userId: 'user_dummy',
      gdTopic: 'System Design Basics',
      gdDescription: 'Dummy discussion covering fundamental system design concepts.',
      gdDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      gdDuration: 90,
      gdLink: 'https://meet.google.com/dummy-456',
      gdStatus: 'completed',
      gdRating: 4.5,
      gdFeedback: 'Great dummy discussion with active participation',
      createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    },
  ];

  useEffect(() => {
    fetchUserGDs();
  }, []);

  const fetchUserGDs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/gd/user/all');

      if (response.status === 404) {
        setGds(dummyGDs);
        setError('Could not load your discussions. Showing sample data instead.');
        toast.warn('Showing sample data as your discussions could not be loaded');
      } else if (response.data && response.data.gds) {
        setGds(response.data.gds);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching GDs:', err);

      if (err.response && err.response.status === 404) {
        setGds(dummyGDs);
        setError('Could not load your discussions. Showing sample data instead.');
        toast.warn('Showing sample data as your discussions could not be loaded');
      } else {
        setError('Failed to fetch group discussions');
        toast.error('Failed to fetch discussions. Please try again.');
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

  const handleCreateGD = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post('/gd', formData);

      if (response.status === 201) {
        setShowCreateForm(false);
        setFormData({
          gdTopic: '',
          gdDescription: '',
          gdDate: '',
          gdDuration: 60,
          gdLink: '',
        });
        toast.success('Discussion created successfully!');
        fetchUserGDs();
      }
    } catch (err) {
      console.error('Error creating GD:', err);

      if (err.response && err.response.status === 404) {
        setGds(dummyGDs);
        toast.warn('Created locally as server unavailable');
      } else {
        toast.error('Failed to create discussion. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteGD = async (gdId) => {
    try {
      const response = await axios.patch(`/gd/${gdId}/complete`);

      if (response.status === 404) {
        setGds((prev) =>
          prev.map((gd) => (gd.gdId === gdId ? { ...gd, gdStatus: 'completed' } : gd)),
        );
        toast.success('Marked as completed locally');
      } else {
        toast.success('Discussion marked as completed');
        fetchUserGDs();
      }
    } catch (err) {
      console.error('Error completing GD:', err);
      toast.error('Failed to mark as completed');
    }
  };

  const handleCancelGD = async (gdId) => {
    try {
      const response = await axios.patch(`/gd/${gdId}/cancel`);

      if (response.status === 404) {
        setGds((prev) =>
          prev.map((gd) => (gd.gdId === gdId ? { ...gd, gdStatus: 'cancelled' } : gd)),
        );
        toast.success('Cancelled locally');
      } else {
        toast.success('Discussion cancelled');
        fetchUserGDs();
      }
    } catch (err) {
      console.error('Error cancelling GD:', err);
      toast.error('Failed to cancel discussion');
    }
  };

  const filteredGDs = gds.filter((gd) => {
    if (activeTab === 'upcoming') return gd.gdStatus === 'scheduled';
    if (activeTab === 'completed') return gd.gdStatus === 'completed';
    if (activeTab === 'cancelled') return gd.gdStatus === 'cancelled';
    return true;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="bg-gray-900 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-700 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-300 font-medium">Loading your group discussions...</p>
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
              <h1 className="text-3xl font-bold text-white mb-2">Group Discussions</h1>
              <p className="text-gray-400">
                Collaborate and learn with peers through structured discussions
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg"
            >
              <Plus size={20} className="mr-2" />
              New Discussion
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

        {/* Create GD Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl border border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Create New Discussion</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateGD}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Discussion Topic</label>
                    <input
                      type="text"
                      name="gdTopic"
                      value={formData.gdTopic}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Enter discussion topic"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 font-medium mb-2">Description</label>
                    <textarea
                      name="gdDescription"
                      value={formData.gdDescription}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Describe what the discussion will be about"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Date & Time</label>
                      <input
                        type="datetime-local"
                        name="gdDate"
                        value={formData.gdDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 font-medium mb-2">Duration</label>
                      <select
                        name="gdDuration"
                        value={formData.gdDuration}
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
                    <label className="block text-gray-300 font-medium mb-2">Meeting Link</label>
                    <input
                      type="url"
                      name="gdLink"
                      value={formData.gdLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="https://meet.google.com/abc-xyz"
                      required
                    />
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
                        Creating...
                      </>
                    ) : (
                      'Create Discussion'
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

        {/* GD Cards */}
        {filteredGDs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGDs.map((gd) => (
              <div
                key={gd.gdId}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700 hover:border-blue-500/30"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{gd.gdTopic}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        gd.gdStatus === 'scheduled'
                          ? 'bg-blue-900/50 text-blue-400'
                          : gd.gdStatus === 'completed'
                          ? 'bg-green-900/50 text-green-400'
                          : 'bg-red-900/50 text-red-400'
                      }`}
                    >
                      {gd.gdStatus.charAt(0).toUpperCase() + gd.gdStatus.slice(1)}
                    </span>
                  </div>

                  <p className="text-gray-400 mb-4 line-clamp-3">{gd.gdDescription}</p>

                  <div className="space-y-3 mb-5 border-t border-gray-700 pt-4">
                    <div className="flex items-center text-gray-300">
                      <Calendar size={16} className="mr-2 flex-shrink-0 text-gray-500" />
                      <span className="text-sm">
                        {new Date(gd.gdDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        •{' '}
                        {new Date(gd.gdDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock size={16} className="mr-2 flex-shrink-0 text-gray-500" />
                      <span className="text-sm">{gd.gdDuration} minutes</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Link size={16} className="mr-2 flex-shrink-0 text-gray-500" />
                      <div className="flex items-center group">
                        <span
                          onClick={() => window.open(gd.gdLink, '_blank')}
                          className="text-sm text-blue-400 hover:text-blue-300 hover:underline cursor-pointer truncate max-w-xs"
                        >
                          {gd.gdLink.replace(/^https?:\/\//, '')}
                        </span>
                        <button
                          onClick={() => copyToClipboard(gd.gdLink)}
                          className="ml-2 text-gray-500 hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100"
                          title="Copy link"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    </div>
                    {gd.gdFeedback && (
                      <div className="flex items-center text-gray-300">
                        <Star
                          size={16}
                          className="mr-2 flex-shrink-0 text-yellow-400 fill-current"
                        />
                        <span className="text-sm">Rating: {gd.gdRating}/5</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between border-t border-gray-700 pt-4">
                    {gd.gdStatus === 'scheduled' && (
                      <>
                        <button
                          onClick={() => handleCancelGD(gd.gdId)}
                          className="px-4 py-2 bg-red-900/30 text-red-400 rounded-lg font-medium hover:bg-red-900/50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleCompleteGD(gd.gdId)}
                          className="px-4 py-2 bg-green-900/30 text-green-400 rounded-lg font-medium hover:bg-green-900/50 transition-colors"
                        >
                          Complete
                        </button>
                      </>
                    )}
                    {gd.gdStatus === 'completed' && !gd.gdFeedback && (
                      <button
                        onClick={() => router.push(`/gd/${gd.gdId}/feedback`)}
                        className="w-full px-4 py-2 bg-blue-900/30 text-blue-400 rounded-lg font-medium hover:bg-blue-900/50 transition-colors"
                      >
                        Add Feedback
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
              <MessageSquare size={24} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {activeTab === 'upcoming'
                ? 'No upcoming discussions'
                : activeTab === 'completed'
                ? 'No completed discussions'
                : 'No cancelled discussions'}
            </h3>
            <p className="text-gray-400 mb-6">
              {activeTab === 'upcoming'
                ? 'Create a new discussion to get started'
                : 'Your ' + activeTab + ' discussions will appear here'}
            </p>
            {activeTab === 'upcoming' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg"
              >
                Create Discussion
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDiscussion;
