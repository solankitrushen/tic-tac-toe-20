'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Mic,
  MicOff,
  Code,
  Loader2,
  Check,
  X,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Send,
  ChevronDown,
  Terminal,
  Maximize2,
  Minimize2,
  Trash2,
  Save,
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Editor from '@monaco-editor/react';

const AIInterviewer = () => {
  // Groq API configuration
  const GROQ_API_KEY = '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';
  const GROQ_MODEL = 'llama3-70b-8192';

  // Application state
  const [interviewState, setInterviewState] = useState('idle');
  const [isListening, setIsListening] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [code, setCode] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [language, setLanguage] = useState('javascript');
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [interviewFeedback, setInterviewFeedback] = useState('');
  const [interviewTimer, setInterviewTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState('');
  const [availableTopics, setAvailableTopics] = useState([]);
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);
  const [showDrawingCanvas, setShowDrawingCanvas] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [isCanvasMaximized, setIsCanvasMaximized] = useState(false);
  const [typingStats, setTypingStats] = useState({
    startTime: null,
    lastTypedTime: null,
    wordCount: 0,
    keystrokes: 0,
  });
  const [drawing, setDrawing] = useState({
    isDrawing: false,
    color: '#000000',
    lineWidth: 5,
    paths: [],
  });

  // Refs
  const conversationEndRef = useRef(null);
  const editorRef = useRef(null);
  const canvasRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join('');
          setUserTranscript(transcript);
        };

        recognitionInstance.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          toast.error(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      } else {
        toast.warn('Speech recognition not supported in this browser');
      }
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Initialize canvas when shown
  useEffect(() => {
    if (showDrawingCanvas && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Redraw all paths
      drawing.paths.forEach((path) => {
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.lineWidth;
        ctx.beginPath();
        ctx.moveTo(path.points[0].x, path.points[0].y);

        for (let i = 1; i < path.points.length; i++) {
          ctx.lineTo(path.points[i].x, path.points[i].y);
        }

        ctx.stroke();
      });
    }
  }, [showDrawingCanvas, drawing.paths]);

  // Track typing speed and detect cheating
  useEffect(() => {
    if (code.length > 0 && interviewState === 'in_progress') {
      const now = Date.now();

      // Initialize typing stats if not already started
      if (!typingStats.startTime) {
        setTypingStats({
          startTime: now,
          lastTypedTime: now,
          wordCount: code.split(/\s+/).length,
          keystrokes: code.length,
        });
        return;
      }

      // Update typing stats
      const wordCount = code.split(/\s+/).length;
      const timeElapsed = (now - typingStats.startTime) / 60000; // in minutes
      const wpm = Math.round(wordCount / timeElapsed);

      // Check for unrealistic typing speed (> 120 WPM is considered very fast)
      if (wpm > 120 && timeElapsed > 0.5) {
        // Only check after 30 seconds
        toast.warn('Unusually high typing speed detected. Please write your own code.');
      }

      setTypingStats({
        startTime: typingStats.startTime,
        lastTypedTime: now,
        wordCount,
        keystrokes: code.length,
      });

      // Reset the cheating detection timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        // If no typing for 10 seconds, reset the start time
        setTypingStats((prev) => ({
          ...prev,
          startTime: null,
        }));
      }, 10000);
    }
  }, [code]);

  // Auto-start listening when AI stops speaking
  useEffect(() => {
    if (!isAiSpeaking && interviewState === 'in_progress' && !isListening) {
      startListening();
    }
  }, [isAiSpeaking, interviewState, isListening]);

  // Scroll to bottom of conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Start interview timer
  useEffect(() => {
    if (interviewState === 'in_progress' && !timerInterval) {
      const interval = setInterval(() => {
        setInterviewTimer((prev) => prev + 1);
      }, 1000);
      setTimerInterval(interval);
    } else if (interviewState !== 'in_progress' && timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  }, [interviewState]);

  // Initialize topics when component mounts
  useEffect(() => {
    if (interviewState === 'idle') {
      generateInterviewTopics();
    }
  }, [interviewState]);

  // Drawing functions
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setDrawing({
      ...drawing,
      isDrawing: true,
      paths: [
        ...drawing.paths,
        {
          color: drawing.color,
          lineWidth: drawing.lineWidth,
          points: [{ x, y }],
        },
      ],
    });
  };

  const draw = (e) => {
    if (!drawing.isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = drawing.color;
    ctx.lineWidth = drawing.lineWidth;
    ctx.lineCap = 'round';

    const lastPath = drawing.paths[drawing.paths.length - 1];
    const lastPoint = lastPath.points[lastPath.points.length - 1];

    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Update the last path with the new point
    const updatedPaths = [...drawing.paths];
    updatedPaths[updatedPaths.length - 1].points.push({ x, y });
    setDrawing({
      ...drawing,
      paths: updatedPaths,
    });
  };

  const stopDrawing = () => {
    setDrawing({
      ...drawing,
      isDrawing: false,
    });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setDrawing({
      ...drawing,
      paths: [],
    });
  };

  const saveDrawing = () => {
    if (drawing.paths.length === 0) {
      toast.warn('No drawing to save');
      return;
    }

    // In a real app, you might send this to your backend
    toast.success('Drawing saved for review');
    return drawing.paths;
  };

  const generateInterviewTopics = async () => {
    try {
      const response = await queryLLM(
        `Generate 5 technical interview topics that would be relevant for a software engineering interview. 
        Return them as a JSON array of strings. Example: ["System Design", "Algorithms", "Data Structures", "Database Design", "API Architecture"]`,
      );

      const topics = JSON.parse(response);
      setAvailableTopics(topics);
    } catch (err) {
      console.error('Error generating topics:', err);
      // Fallback topics
      setAvailableTopics([
        'System Design',
        'Algorithms',
        'Data Structures',
        'Database Design',
        'API Architecture',
      ]);
    }
  };

  const selectTopic = (topic) => {
    setSelectedTopic(topic);
    setShowTopicDropdown(false);
    setShowDrawingCanvas(topic === 'System Design');
    setInterviewState('starting');
    startInterview(topic);
  };

  const startInterview = async (topic) => {
    setConversation([]);
    setUserTranscript('');
    setAiResponse('');
    setCode('');
    setInterviewFeedback('');
    setInterviewTimer(0);
    setOutput('');
    setIsCanvasMaximized(false);
    setDrawing({
      isDrawing: false,
      color: '#000000',
      lineWidth: 5,
      paths: [],
    });
    setTypingStats({
      startTime: null,
      lastTypedTime: null,
      wordCount: 0,
      keystrokes: 0,
    });

    try {
      // Generate a problem statement dynamically based on the selected topic
      const problemPrompt = `Generate a ${difficulty} difficulty level technical problem statement about ${topic} for a ${language} developer. 
      The problem should be appropriate for a 30-minute interview and should test both theoretical knowledge and practical skills.
      Return only the problem statement, no additional commentary.`;

      const generatedProblem = await queryLLM(problemPrompt);
      setProblemStatement(generatedProblem);

      // Generate initial AI greeting and problem statement
      const greeting = await queryLLM(
        `You are a technical interviewer conducting an interview about ${topic}. 
        Greet the candidate warmly and present them with this problem: "${generatedProblem}".
        Explain that they should think aloud as they work through the solution and that they can start coding whenever ready.
        Keep your introduction to 2-3 sentences and maintain a professional but friendly tone.`,
      );

      setAiResponse(greeting);
      setConversation([{ role: 'ai', content: greeting }]);
      speakResponse(greeting);

      setInterviewState('in_progress');
    } catch (err) {
      console.error('Error starting interview:', err);
      toast.error('Failed to start interview. Please try again.');
      setInterviewState('idle');
    }
  };

  const endInterview = async () => {
    setInterviewState('completed');

    // Generate final feedback
    const feedbackPrompt = `You are a technical interviewer. Provide detailed feedback on this interview performance.
    
    Topic: ${selectedTopic}
    Problem: ${problemStatement}
    
    Candidate's final code:
    ${code}
    
    ${showDrawingCanvas ? 'Candidate created a system design diagram.\n' : ''}
    
    Conversation history:
    ${conversation.map((msg) => `${msg.role}: ${msg.content}`).join('\n')}
    
    Provide constructive feedback on:
    1. Problem solving approach
    2. Technical knowledge
    3. Code quality and correctness
    4. Communication skills
    5. Areas for improvement
    6. Overall performance (1-5 scale)
    
    Keep the feedback professional but helpful, about 3-4 paragraphs.`;

    const feedback = await queryLLM(feedbackPrompt);
    setInterviewFeedback(feedback);
    setConversation((prev) => [...prev, { role: 'ai', content: feedback }]);
    speakResponse(feedback);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
      setIsListening(true);
      toast.info('Microphone is now listening...');
    } else {
      toast.error('Speech recognition not available');
    }
  };

  const stopListening = async () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);

    if (!userTranscript.trim()) return;

    // Add user message to conversation
    const userMessage = { role: 'user', content: userTranscript };
    setConversation((prev) => [...prev, userMessage]);

    // Check for cheating in the code if there is code
    if (code.trim()) {
      setIsCheckingCode(true);
      const isCheating = await checkForCheating(code);
      setIsCheckingCode(false);

      if (isCheating) {
        toast.warn('Please write your own code instead of copying solutions.');
        const warningMsg = await queryLLM(
          `The candidate might be using external solutions for this problem about ${selectedTopic}. 
          Politely remind them to write their own code without giving away the solution. 
          Keep it to 1-2 sentences.`,
        );
        setAiResponse(warningMsg);
        setConversation((prev) => [...prev, { role: 'ai', content: warningMsg }]);
        speakResponse(warningMsg);
        setUserTranscript('');
        return;
      }
    }

    // Generate AI response
    const prompt = `You are conducting a technical interview about ${selectedTopic}. The candidate is solving: "${problemStatement}".
    
    Conversation so far:
    ${conversation.map((msg) => `${msg.role}: ${msg.content}`).join('\n')}
    
    Candidate's current code:
    ${code}
    
    Candidate's latest response:
    ${userTranscript}
    
    ${showDrawingCanvas ? 'Candidate has created a system design diagram.\n' : ''}
    
    Provide a helpful, professional response that:
    1. Acknowledges their approach
    2. Asks probing questions if needed
    3. Provides hints only if they're stuck (don't give full solutions)
    4. Encourages them to think aloud
    5. Keeps response to 2-3 sentences
    
    Remember you're evaluating their technical skills in ${selectedTopic}.`;

    const response = await queryLLM(prompt);
    setAiResponse(response);
    setConversation((prev) => [...prev, { role: 'ai', content: response }]);
    speakResponse(response);
    setUserTranscript('');
  };

  const runCode = async () => {
    if (!code.trim()) {
      toast.warn('Please write some code first');
      return;
    }

    setIsRunningCode(true);
    setOutput('Running code...');

    try {
      // For security reasons, we'll simulate code execution in the browser
      // In a real app, you'd send this to a secure backend or use WebAssembly
      if (language === 'javascript') {
        // Create a safe execution environment
        const originalConsoleLog = console.log;
        let outputText = '';

        console.log = (...args) => {
          outputText += args.join(' ') + '\n';
        };

        try {
          // Use Function constructor for safer execution
          new Function(code)();
          setOutput(outputText || 'Code executed successfully (no output)');
        } catch (err) {
          setOutput(`Error: ${err.message}`);
        } finally {
          console.log = originalConsoleLog;
        }
      } else {
        // For other languages, we'll simulate execution
        setOutput(`Simulated ${language} code execution:\n\n${code}`);
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setIsRunningCode(false);
    }
  };

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
    } catch (err) {
      console.error('Error querying Groq API:', err);
      toast.error('Failed to get AI response. Please try again.');
      return 'I encountered an error processing your response. Please continue with your explanation.';
    }
  };

  const checkForCheating = async (codeToCheck) => {
    try {
      // First check typing speed (WPM > 120 is suspicious)
      const timeElapsed = (Date.now() - typingStats.startTime) / 60000; // in minutes
      const wpm = typingStats.wordCount / timeElapsed;

      if (wpm > 120 && timeElapsed > 0.5) {
        return true;
      }

      // Then check with AI
      const prompt = `Analyze if this code appears to be an original solution to the problem "${problemStatement}" about ${selectedTopic} or if it might be copied from an external source.
      
      Code:
      ${codeToCheck}
      
      Respond with JSON only: 
      {
        "isCopied": boolean,
        "confidence": "low|medium|high",
        "reason": "brief explanation"
      }`;

      const response = await queryLLM(prompt);
      const result = JSON.parse(response);
      return result.isCopied && result.confidence !== 'low';
    } catch (err) {
      console.error('Error checking for cheating:', err);
      return false;
    }
  };

  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      toast.warn('Text-to-speech not supported in this browser');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value, event) => {
    setCode(value);
  };

  const getLanguageForEditor = () => {
    switch (language) {
      case 'javascript':
        return 'javascript';
      case 'python':
        return 'python';
      case 'java':
        return 'java';
      case 'c++':
        return 'cpp';
      default:
        return 'javascript';
    }
  };

  const toggleCanvasSize = () => {
    setIsCanvasMaximized(!isCanvasMaximized);
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Technical Interviewer</h1>
          <p className="text-gray-400">
            Practice technical interviews with voice-to-voice AI powered by Groq LLaMA 3
          </p>
        </header>

        {/* Topic Selection (when idle) */}
        {interviewState === 'idle' && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">
              What would you like to practice today?
            </h2>
            <div className="relative">
              <button
                onClick={() => setShowTopicDropdown(!showTopicDropdown)}
                className="flex items-center justify-between w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600"
              >
                {selectedTopic || 'Select a topic'}
                <ChevronDown
                  size={18}
                  className={`transition-transform ${showTopicDropdown ? 'rotate-180' : ''}`}
                />
              </button>

              {showTopicDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg shadow-lg border border-gray-600 max-h-60 overflow-auto">
                  {availableTopics.map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => selectTopic(topic)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600 transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interview Controls */}
        {interviewState !== 'idle' && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6 border border-gray-700">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Difficulty:</span>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    disabled={interviewState !== 'idle'}
                    className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">Language:</span>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={interviewState !== 'idle'}
                    className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="c++">C++</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {interviewState === 'in_progress' && (
                  <>
                    <div className="flex items-center bg-gray-700 px-4 py-2 rounded-lg">
                      <span className="text-blue-400 mr-2">Time:</span>
                      <span className="font-mono">{formatTime(interviewTimer)}</span>
                    </div>

                    <button
                      onClick={endInterview}
                      className="flex items-center bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-lg font-medium hover:from-red-500 hover:to-red-400 transition-all duration-300 shadow-lg"
                    >
                      <Pause size={18} className="mr-2" />
                      End Interview
                    </button>
                  </>
                )}

                {interviewState === 'completed' && (
                  <button
                    onClick={() => setInterviewState('idle')}
                    className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-lg"
                  >
                    <Play size={18} className="mr-2" />
                    Start New Interview
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        {interviewState !== 'idle' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Problem and Code */}
            <div className="space-y-6">
              {/* Problem Statement */}
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Code size={20} className="mr-2 text-blue-400" />
                  Problem Statement
                </h2>

                {problemStatement ? (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-gray-300 whitespace-pre-wrap">{problemStatement}</p>
                  </div>
                ) : (
                  <div className="bg-gray-700 p-4 rounded-lg text-gray-400 italic">
                    Loading problem statement...
                  </div>
                )}
              </div>

              {/* Drawing Canvas (only shown for System Design topic) */}
              {showDrawingCanvas && (
                <div
                  className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${
                    isCanvasMaximized ? 'fixed inset-0 z-50 m-0 p-4 bg-gray-900' : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <Code size={20} className="mr-2 text-blue-400" />
                      System Design Canvas
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={clearCanvas}
                        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                        title="Clear canvas"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={saveDrawing}
                        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                        title="Save drawing"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={toggleCanvasSize}
                        className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
                        title={isCanvasMaximized ? 'Minimize' : 'Maximize'}
                      >
                        {isCanvasMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                      </button>
                    </div>
                  </div>
                  <div
                    className={`w-full ${
                      isCanvasMaximized ? 'h-[calc(100vh-150px)]' : 'h-96'
                    } bg-white rounded-lg overflow-hidden border-2 border-gray-600`}
                  >
                    <canvas
                      ref={canvasRef}
                      width={isCanvasMaximized ? window.innerWidth - 40 : 800}
                      height={isCanvasMaximized ? window.innerHeight - 150 : 384}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={(e) => {
                        e.preventDefault();
                        startDrawing(e.touches[0]);
                      }}
                      onTouchMove={(e) => {
                        e.preventDefault();
                        draw(e.touches[0]);
                      }}
                      onTouchEnd={stopDrawing}
                    />
                  </div>
                  <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Color:</span>
                      <input
                        type="color"
                        value={drawing.color}
                        onChange={(e) => setDrawing({ ...drawing, color: e.target.value })}
                        className="w-8 h-8 cursor-pointer"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Size:</span>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={drawing.lineWidth}
                        onChange={(e) =>
                          setDrawing({ ...drawing, lineWidth: parseInt(e.target.value) })
                        }
                        className="w-24"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Code Editor */}
              {!isCanvasMaximized && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center">
                      <Code size={20} className="mr-2 text-blue-400" />
                      Code Editor
                    </h2>
                    <div className="text-sm text-gray-400">
                      Language: {language.charAt(0).toUpperCase() + language.slice(1)}
                    </div>
                  </div>

                  <div className="w-full h-64 bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
                    <Editor
                      height="100%"
                      language={getLanguageForEditor()}
                      theme="vs-dark"
                      value={code}
                      onChange={handleEditorChange}
                      onMount={handleEditorDidMount}
                      options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        wordWrap: 'on',
                        readOnly: interviewState !== 'in_progress',
                      }}
                    />
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={runCode}
                      disabled={isRunningCode || interviewState !== 'in_progress'}
                      className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRunningCode ? (
                        <Loader2 size={16} className="animate-spin mr-2" />
                      ) : (
                        <Terminal size={16} className="mr-2" />
                      )}
                      Run Code
                    </button>

                    {isCheckingCode && (
                      <div className="flex items-center text-yellow-400 text-sm">
                        <Loader2 size={16} className="animate-spin mr-2" />
                        Analyzing your code...
                      </div>
                    )}
                  </div>

                  {output && (
                    <div className="mt-4 bg-gray-900 p-4 rounded-lg border border-gray-700">
                      <h3 className="text-sm font-bold text-gray-400 mb-2">Output:</h3>
                      <pre className="text-gray-300 text-sm whitespace-pre-wrap">{output}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column - Conversation */}
            <div
              className={`bg-gray-800 rounded-xl p-6 border border-gray-700 flex flex-col ${
                isCanvasMaximized ? 'hidden lg:block' : ''
              }`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Volume2 size={20} className="mr-2 text-blue-400" />
                  Interview Conversation
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
                    {isAiSpeaking ? 'AI is speaking...' : isListening ? 'You are speaking...' : ''}
                  </span>
                  <button
                    onClick={() => {
                      if (isAiSpeaking) {
                        window.speechSynthesis.cancel();
                        setIsAiSpeaking(false);
                      }
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                    title={isAiSpeaking ? 'Stop AI speech' : 'AI is not speaking'}
                  >
                    {isAiSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>
              </div>

              {/* Conversation History */}
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                {conversation.length > 0 ? (
                  conversation.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === 'ai' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.role === 'ai' ? 'bg-gray-700 text-white' : 'bg-blue-600 text-white'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 italic">
                    Waiting for AI to start the conversation...
                  </div>
                )}
                <div ref={conversationEndRef} />
              </div>

              {/* User Input */}
              <div className="mt-auto">
                {interviewState === 'in_progress' && (
                  <div className="space-y-4">
                    <div className="relative">
                      <textarea
                        value={userTranscript}
                        onChange={(e) => setUserTranscript(e.target.value)}
                        className="w-full bg-gray-700 text-white p-4 pr-12 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Type your response or use voice input..."
                        rows={3}
                      />
                      <button
                        onClick={toggleListening}
                        className={`absolute right-3 bottom-3 p-2 rounded-full ${
                          isListening ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                        }`}
                        title={isListening ? 'Stop listening' : 'Start listening'}
                      >
                        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                      </button>
                    </div>

                    <div className="flex justify-between">
                      <div className="text-sm text-gray-400">
                        {isListening ? (
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                            Listening...
                          </span>
                        ) : (
                          'Press the mic button to use voice input'
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (userTranscript.trim()) {
                            stopListening();
                          }
                        }}
                        disabled={!userTranscript.trim()}
                        className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={16} className="mr-2" />
                        Send
                      </button>
                    </div>
                  </div>
                )}

                {interviewState === 'completed' && interviewFeedback && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <h3 className="text-lg font-bold text-white mb-2">Interview Feedback</h3>
                    <div className="text-gray-300 whitespace-pre-wrap">{interviewFeedback}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInterviewer;
