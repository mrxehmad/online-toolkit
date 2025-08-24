import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, RotateCcw, Zap, Clock, Target, Trophy, Smartphone, Monitor, Tablet } from 'lucide-react';

const TypingSpeedTest = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalTypedChars, setTotalTypedChars] = useState(0);
  const inputRef = useRef(null);

  const sampleTexts = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once. Typing tests like this help improve both speed and accuracy when practicing keyboard skills.",
    "In a world where digital communication dominates our daily lives, the ability to type quickly and accurately has become an essential skill. Whether you're writing emails, coding, or chatting with friends, fast typing saves time.",
    "Technology has transformed the way we work and communicate. From smartphones to laptops, we interact with keyboards every day. Developing good typing habits early can significantly boost your productivity and efficiency.",
    "The art of touch typing involves muscle memory and finger placement. Professional typists can reach speeds of over 100 words per minute while maintaining high accuracy. Practice makes perfect in this valuable skill.",
    "Modern keyboards come in many varieties, from mechanical switches to touch screens. Each type offers different tactile feedback and response times. Finding the right keyboard can enhance your typing experience significantly."
  ];

  const initializeTest = useCallback(() => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);
    setUserInput('');
    setTimeLeft(60);
    setIsActive(false);
    setIsComplete(false);
    setWpm(0);
    setAccuracy(100);
    setCurrentWordIndex(0);
    setCurrentCharIndex(0);
    setErrors(0);
    setTotalTypedChars(0);
  }, []);

  useEffect(() => {
    initializeTest();
  }, [initializeTest]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            setIsComplete(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const calculateStats = useCallback(() => {
    if (totalTypedChars === 0) return;
    
    const timeElapsed = 60 - timeLeft;
    const wordsTyped = totalTypedChars / 5; // Standard: 5 characters = 1 word
    const currentWpm = timeElapsed > 0 ? Math.round((wordsTyped / timeElapsed) * 60) : 0;
    const currentAccuracy = totalTypedChars > 0 ? Math.round(((totalTypedChars - errors) / totalTypedChars) * 100) : 100;
    
    setWpm(currentWpm);
    setAccuracy(Math.max(0, currentAccuracy));
  }, [timeLeft, totalTypedChars, errors]);

  useEffect(() => {
    calculateStats();
  }, [calculateStats]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (!isActive && !isComplete) {
      setIsActive(true);
    }

    if (isComplete) return;

    setUserInput(value);
    setTotalTypedChars(value.length);

    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < value.length; i++) {
      if (i >= text.length || value[i] !== text[i]) {
        errorCount++;
      }
    }
    setErrors(errorCount);

    // Find current word and character position
    let charCount = 0;
    let wordIndex = 0;
    const words = text.split(' ');
    
    for (let i = 0; i < words.length; i++) {
      if (charCount + words[i].length + (i > 0 ? 1 : 0) >= value.length) {
        wordIndex = i;
        break;
      }
      charCount += words[i].length + (i > 0 ? 1 : 0);
    }
    
    setCurrentWordIndex(wordIndex);
    setCurrentCharIndex(value.length - charCount);

    // Check if test is complete
    if (value === text) {
      setIsActive(false);
      setIsComplete(true);
    }
  };

  const startTest = () => {
    setIsActive(true);
    inputRef.current?.focus();
  };

  const resetTest = () => {
    initializeTest();
    inputRef.current?.focus();
  };

  const renderText = () => {
    const words = text.split(' ');
    return words.map((word, wordIndex) => {
      const isCurrentWord = wordIndex === currentWordIndex;
      const wordStartIndex = words.slice(0, wordIndex).join(' ').length + (wordIndex > 0 ? 1 : 0);
      
      return (
        <span key={wordIndex} className={`${isCurrentWord ? 'bg-blue-50 rounded px-1' : ''}`}>
          {word.split('').map((char, charIndex) => {
            const globalCharIndex = wordStartIndex + charIndex;
            let className = 'text-gray-600';
            
            if (globalCharIndex < userInput.length) {
              className = userInput[globalCharIndex] === char ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
            } else if (globalCharIndex === userInput.length && isActive) {
              className = 'text-gray-800 bg-blue-200 border-l-2 border-blue-500';
            }
            
            return (
              <span key={charIndex} className={`${className} transition-all duration-150 ease-in-out`}>
                {char}
              </span>
            );
          })}
          {wordIndex < words.length - 1 && (
            <span className={userInput.length > wordStartIndex + word.length ? 
              (userInput[wordStartIndex + word.length] === ' ' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50') : 
              'text-gray-600'
            }> </span>
          )}
        </span>
      );
    });
  };

  const getPerformanceLevel = () => {
    if (wpm >= 80) return { level: 'Expert', color: 'text-purple-600', icon: Trophy };
    if (wpm >= 60) return { level: 'Advanced', color: 'text-green-600', icon: Target };
    if (wpm >= 40) return { level: 'Intermediate', color: 'text-blue-600', icon: Zap };
    return { level: 'Beginner', color: 'text-orange-600', icon: Clock };
  };

  const performance = getPerformanceLevel();
  const PerformanceIcon = performance.icon;

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:py-8">
      {/* SEO Header Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Free Online Typing Speed Test
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Improve your typing skills with our iOS-styled typing speed test. Test your WPM (Words Per Minute), 
            accuracy, and track your progress. Perfect for students, professionals, and anyone looking to enhance their keyboard skills.
          </p>
        </div>

        {/* Device Icons */}
        <div className="flex justify-center items-center gap-4 mb-6 text-gray-400">
          <div className="flex items-center gap-2">
            <Smartphone size={20} />
            <span className="text-sm">Mobile</span>
          </div>
          <div className="flex items-center gap-2">
            <Tablet size={20} />
            <span className="text-sm">Tablet</span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor size={20} />
            <span className="text-sm">Desktop</span>
          </div>
        </div>
      </div>

      {/* Main Test Interface */}
      <div className="max-w-4xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">WPM</p>
                <p className="text-2xl font-bold text-blue-600">{wpm}</p>
              </div>
              <Zap className="text-blue-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Accuracy</p>
                <p className="text-2xl font-bold text-green-600">{accuracy}%</p>
              </div>
              <Target className="text-green-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Time</p>
                <p className="text-2xl font-bold text-orange-600">{timeLeft}s</p>
              </div>
              <Clock className="text-orange-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Level</p>
                <p className={`text-lg font-bold ${performance.color}`}>{performance.level}</p>
              </div>
              <PerformanceIcon className={performance.color.replace('text-', 'text-')} size={24} />
            </div>
          </div>
        </div>

        {/* Test Area */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6">
          <div className="mb-6">
            <div className="text-lg leading-relaxed font-mono bg-gray-50 p-6 rounded-xl border-2 border-gray-100 min-h-32">
              {renderText()}
            </div>
          </div>

          <div className="space-y-4">
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              disabled={isComplete && timeLeft === 0}
              placeholder={isActive ? "Start typing..." : "Click Start to begin typing test"}
              className="w-full h-32 p-4 text-lg font-mono border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 resize-none transition-colors duration-200 disabled:bg-gray-100"
              autoComplete="off"
              spellCheck="false"
            />

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={startTest}
                disabled={isActive}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Play size={20} />
                {isActive ? 'Test in Progress...' : 'Start Test'}
              </button>
              
              <button
                onClick={resetTest}
                className="flex-1 sm:flex-initial bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isComplete && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Test Complete! 🎉</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-blue-600">{wpm}</p>
                <p className="text-gray-600">Words per minute</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">{accuracy}%</p>
                <p className="text-gray-600">Accuracy</p>
              </div>
              <div>
                <p className={`text-3xl font-bold ${performance.color}`}>{performance.level}</p>
                <p className="text-gray-600">Performance level</p>
              </div>
            </div>
          </div>
        )}

        {/* SEO Content */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use Our Typing Speed Test?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">📱 Responsive Design</h3>
              <p>Works perfectly on all devices - smartphones, tablets, and desktop computers with iOS-inspired design.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">⚡ Real-time Feedback</h3>
              <p>Get instant feedback on your typing speed, accuracy, and see your mistakes highlighted in real-time.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🎯 Accurate Metrics</h3>
              <p>Precise WPM calculation and accuracy tracking to help you monitor your typing improvement.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">🔄 Multiple Texts</h3>
              <p>Various sample texts to keep your practice sessions engaging and challenging.</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Typing Speed Benchmarks:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="font-semibold text-orange-600">Beginner</p>
                <p className="text-orange-700">0-40 WPM</p>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="font-semibold text-blue-600">Intermediate</p>
                <p className="text-blue-700">40-60 WPM</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="font-semibold text-green-600">Advanced</p>
                <p className="text-green-700">60-80 WPM</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="font-semibold text-purple-600">Expert</p>
                <p className="text-purple-700">80+ WPM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingSpeedTest;