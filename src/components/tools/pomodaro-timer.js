import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings, TrendingUp, Clock, Target, Zap } from 'lucide-react';

const PomodoroTimer = () => {
  // Timer states
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSession, setCurrentSession] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [sessionCount, setSessionCount] = useState(0);
  
  // Settings states
  const [settings, setSettings] = useState({
    workTime: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4
  });
  
  // UI states
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // Statistics (in a real app, this would be localStorage)
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalFocusTime: 0,
    streakDays: 1,
    todaySessions: 0
  });

  const intervalRef = useRef(null);

  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    } else {
      clearInterval(intervalRef.current);
    }
    
    return () => clearInterval(intervalRef.current);
  }, [isActive, isPaused, timeLeft, handleSessionComplete]);

  const handleSessionComplete = useCallback(() => {
    // Play notification sound (browser notification sound)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Complete!', {
        body: `${currentSession === 'work' ? 'Work session' : 'Break'} completed!`,
        icon: '🍅'
      });
    }

    if (currentSession === 'work') {
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalSessions: prev.totalSessions + 1,
        totalFocusTime: prev.totalFocusTime + settings.workTime,
        todaySessions: prev.todaySessions + 1
      }));

      // Determine next session
      if (newSessionCount % settings.longBreakInterval === 0) {
        setCurrentSession('longBreak');
        setTimeLeft(settings.longBreak * 60);
      } else {
        setCurrentSession('shortBreak');
        setTimeLeft(settings.shortBreak * 60);
      }
    } else {
      setCurrentSession('work');
      setTimeLeft(settings.workTime * 60);
    }
    
    setIsActive(false);
    setIsPaused(false);
  }, [currentSession, sessionCount, settings]);

  const toggleTimer = () => {
    if (!isActive) {
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }
    
    setIsActive(!isActive);
    setIsPaused(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    const sessionTimes = {
      work: settings.workTime,
      shortBreak: settings.shortBreak,
      longBreak: settings.longBreak
    };
    setTimeLeft(sessionTimes[currentSession] * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const sessionTimes = {
      work: settings.workTime,
      shortBreak: settings.shortBreak,
      longBreak: settings.longBreak
    };
    const totalTime = sessionTimes[currentSession] * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const getSessionColor = () => {
    switch (currentSession) {
      case 'work': return 'from-red-400 to-red-600';
      case 'shortBreak': return 'from-green-400 to-green-600';
      case 'longBreak': return 'from-blue-400 to-blue-600';
      default: return 'from-red-400 to-red-600';
    }
  };

  const getSessionTitle = () => {
    switch (currentSession) {
      case 'work': return 'Focus Time';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Focus Time';
    }
  };

  const SettingsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
          <button 
            onClick={() => setShowSettings(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl font-light"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-medium">Work Time</label>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                value={settings.workTime}
                onChange={(e) => setSettings({...settings, workTime: parseInt(e.target.value)})}
                className="w-16 p-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-red-400 focus:border-transparent"
                min="1" max="60"
              />
              <span className="text-gray-500">min</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-medium">Short Break</label>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                value={settings.shortBreak}
                onChange={(e) => setSettings({...settings, shortBreak: parseInt(e.target.value)})}
                className="w-16 p-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-green-400 focus:border-transparent"
                min="1" max="30"
              />
              <span className="text-gray-500">min</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-medium">Long Break</label>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                value={settings.longBreak}
                onChange={(e) => setSettings({...settings, longBreak: parseInt(e.target.value)})}
                className="w-16 p-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                min="1" max="60"
              />
              <span className="text-gray-500">min</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <label className="text-gray-700 font-medium">Long Break Interval</label>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                value={settings.longBreakInterval}
                onChange={(e) => setSettings({...settings, longBreakInterval: parseInt(e.target.value)})}
                className="w-16 p-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                min="2" max="10"
              />
              <span className="text-gray-500">sessions</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={() => {
            setShowSettings(false);
            resetTimer();
          }}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all duration-200"
        >
          Save Settings
        </button>
      </div>
    </div>
  );

  const StatsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Statistics</h2>
          <button 
            onClick={() => setShowStats(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl font-light"
          >
            ×
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-2xl">
            <div className="flex items-center justify-center w-10 h-10 bg-red-200 rounded-full mb-2">
              <Target className="w-5 h-5 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-700">{stats.totalSessions}</div>
            <div className="text-sm text-red-600">Total Sessions</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-200 rounded-full mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-700">{Math.round(stats.totalFocusTime / 60)}h</div>
            <div className="text-sm text-blue-600">Focus Time</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl">
            <div className="flex items-center justify-center w-10 h-10 bg-green-200 rounded-full mb-2">
              <Zap className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-700">{stats.streakDays}</div>
            <div className="text-sm text-green-600">Day Streak</div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl">
            <div className="flex items-center justify-center w-10 h-10 bg-purple-200 rounded-full mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-700">{stats.todaySessions}</div>
            <div className="text-sm text-purple-600">Today</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">🍅</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Focus Timer</h1>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowStats(true)}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <TrendingUp className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow duration-200"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      {/* Main Timer */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          {/* Session Info */}
          <div className="text-center mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">{getSessionTitle()}</h2>
            <div className="text-sm text-gray-500">
              Session {sessionCount + 1} • {sessionCount > 0 && sessionCount % settings.longBreakInterval === 0 ? 'Long break next' : `${settings.longBreakInterval - (sessionCount % settings.longBreakInterval)} until long break`}
            </div>
          </div>

          {/* Timer Circle */}
          <div className="relative flex items-center justify-center mb-8">
            <div className="w-64 h-64 md:w-80 md:h-80">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="white"
                  strokeWidth="6"
                  opacity="0.3"
                />
                {/* Progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                  className="transition-all duration-300 ease-in-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" className={currentSession === 'work' ? 'stop-red-400' : currentSession === 'shortBreak' ? 'stop-green-400' : 'stop-blue-400'} />
                    <stop offset="100%" className={currentSession === 'work' ? 'stop-red-600' : currentSession === 'shortBreak' ? 'stop-green-600' : 'stop-blue-600'} />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Timer Display */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl md:text-6xl font-light text-gray-800 mb-2">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {isActive ? (isPaused ? 'Paused' : 'Running') : 'Ready to start'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={toggleTimer}
              className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105 ${
                isActive 
                  ? 'bg-gradient-to-br from-orange-400 to-orange-600' 
                  : `bg-gradient-to-br ${getSessionColor()}`
              }`}
            >
              {isActive ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>
            
            <button
              onClick={resetTimer}
              className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              <RotateCcw className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Session Progress */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(getProgress())}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getSessionColor()} transition-all duration-300`}
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </main>

      {/* SEO Footer */}
      <footer className="bg-white border-t border-gray-200 p-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gray-600 mb-2">
            Free Pomodoro Timer - Boost your productivity with the proven Pomodoro Technique
          </p>
          <p className="text-xs text-gray-400">
            Focus • Break • Achieve • Improve your time management and concentration
          </p>
        </div>
      </footer>

      {/* Modals */}
      {showSettings && <SettingsModal />}
      {showStats && <StatsModal />}
    </div>
  );
};

export default PomodoroTimer;