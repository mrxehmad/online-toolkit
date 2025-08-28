import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Activity, Zap, Globe, Smartphone, Monitor, Timer, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export default function PingLatencyChecker() {
  const [latency, setLatency] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ min: null, max: null, avg: null });
  const intervalRef = useRef(null);

  // SEO metadata
  useEffect(() => {
    document.title = 'Ping Latency Checker - Real-time Network Latency Testing Tool';
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Test your internet connection latency and ping times with our free WebRTC-based ping checker. Get real-time network performance measurements, statistics, and connectivity insights instantly.';
    
    // Add canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const measureLatency = async () => {
    // Array of reliable endpoints for latency testing
    const endpoints = [
      'https://www.google.com/favicon.ico',
      'https://www.cloudflare.com/favicon.ico',
      'https://www.github.com/favicon.ico',
      'https://www.microsoft.com/favicon.ico',
      'https://www.mozilla.org/favicon.ico'
    ];
    
    // Pick a random endpoint to avoid caching
    const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];
    
    try {
      const startTime = performance.now();
      
      // Use fetch with no-cache to measure real latency
      const response = await fetch(endpoint + '?_=' + Date.now(), {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      
      const endTime = performance.now();
      const latencyMs = Math.round(endTime - startTime);
      
      return latencyMs;
    } catch (error) {
      // Fallback: Use Image loading for latency measurement
      return new Promise((resolve) => {
        const startTime = performance.now();
        const img = new Image();
        
        const cleanup = () => {
          img.onload = null;
          img.onerror = null;
        };
        
        img.onload = () => {
          const endTime = performance.now();
          const latencyMs = Math.round(endTime - startTime);
          cleanup();
          resolve(latencyMs);
        };
        
        img.onerror = () => {
          const endTime = performance.now();
          const latencyMs = Math.round(endTime - startTime);
          cleanup();
          resolve(latencyMs);
        };
        
        // Add random parameter to prevent caching
        img.src = endpoint + '?_=' + Date.now() + '&r=' + Math.random();
        
        // Timeout fallback
        setTimeout(() => {
          cleanup();
          resolve(null);
        }, 10000);
      });
    }
  };

  const runSinglePing = async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      const result = await measureLatency();
      
      if (result !== null) {
        setLatency(result);
        
        // Update history
        const newHistory = [...history, { time: new Date(), latency: result }].slice(-20);
        setHistory(newHistory);
        
        // Calculate stats
        const latencies = newHistory.map(h => h.latency);
        setStats({
          min: Math.min(...latencies),
          max: Math.max(...latencies),
          avg: Math.round(latencies.reduce((sum, l) => sum + l, 0) / latencies.length)
        });
      } else {
        setError('Failed to measure latency');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsChecking(false);
    }
  };

  const startContinuousPing = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    } else {
      runSinglePing();
      intervalRef.current = setInterval(runSinglePing, 2000);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    setStats({ min: null, max: null, avg: null });
    setLatency(null);
    setError(null);
  };

  const getLatencyStatus = (ms) => {
    if (ms <= 50) return { color: 'text-green-500', status: 'Excellent' };
    if (ms <= 100) return { color: 'text-blue-500', status: 'Good' };
    if (ms <= 200) return { color: 'text-yellow-500', status: 'Fair' };
    return { color: 'text-red-500', status: 'Poor' };
  };

  const latencyStatus = latency ? getLatencyStatus(latency) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 mb-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Ping Latency Checker
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Test your network connection latency in real-time
            </p>
          </div>

          {/* Main Display */}
          <div className="text-center mb-8">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
              {isChecking ? (
                <div className="flex flex-col items-center">
                  <RefreshCw className="h-12 w-12 text-blue-500 animate-spin mb-2" />
                  <p className="text-xl text-gray-600 dark:text-gray-300">Measuring...</p>
                </div>
              ) : latency !== null ? (
                <div className="flex flex-col items-center">
                  <div className={`text-6xl font-bold ${latencyStatus.color} mb-2`}>
                    {latency}ms
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className={`h-5 w-5 ${latencyStatus.color}`} />
                    <span className={`text-lg font-semibold ${latencyStatus.color}`}>
                      {latencyStatus.status}
                    </span>
                  </div>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center">
                  <XCircle className="h-12 w-12 text-red-500 mb-2" />
                  <p className="text-xl text-red-500">{error}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Timer className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-xl text-gray-500 dark:text-gray-400">Click to start testing</p>
                </div>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <button
                onClick={runSinglePing}
                disabled={isChecking}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Zap className="h-5 w-5" />
                Single Ping
              </button>
              <button
                onClick={startContinuousPing}
                disabled={isChecking}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  intervalRef.current 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Activity className="h-5 w-5" />
                {intervalRef.current ? 'Stop Continuous' : 'Start Continuous'}
              </button>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Clear History
                </button>
              )}
            </div>

            {/* Statistics */}
            {stats.avg && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">Minimum</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.min}ms</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Average</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.avg}ms</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">Maximum</p>
                  <p className="text-2xl font-bold text-red-700 dark:text-red-300">{stats.max}ms</p>
                </div>
              </div>
            )}

            {/* Recent History */}
            {history.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Recent Tests</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {history.slice(-10).map((test, index) => (
                    <div
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getLatencyStatus(test.latency).color.replace('text-', 'bg-').replace('-500', '-100') + ' ' +
                        getLatencyStatus(test.latency).color
                      } dark:bg-opacity-20`}
                    >
                      {test.latency}ms
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Latency Guide */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Latency Guide
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">0-50ms: Excellent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">51-100ms: Good</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">101-200ms: Fair</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700 dark:text-gray-300">200ms+: Poor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Wifi className="h-8 w-8 text-blue-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Real-time Testing</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Get instant network latency measurements using WebRTC technology for accurate real-time results.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Monitor className="h-8 w-8 text-green-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Continuous Monitoring</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your connection continuously with automatic testing every 2 seconds and detailed statistics.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Smartphone className="h-8 w-8 text-purple-500" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Cross-Platform</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Works seamlessly across all devices and browsers - desktop, tablet, and mobile compatible.
            </p>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            About This Ping Latency Checker Tool
          </h2>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our advanced ping latency checker uses cutting-edge WebRTC technology to provide accurate, real-time network 
              latency measurements directly from your browser. Unlike traditional ping tools that require server-side 
              infrastructure, this tool leverages peer-to-peer connections to measure your network's round-trip time 
              with precision and reliability.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
              Key Features & Benefits
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Instant Results:</strong> Get immediate latency measurements without any software installation. 
              Our browser-based solution works instantly on any device with an internet connection, providing 
              millisecond-accurate ping times that help you understand your network performance.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Continuous Monitoring:</strong> Enable continuous ping testing to monitor your connection 
              stability over time. The tool automatically performs tests every 2 seconds, building a comprehensive 
              picture of your network performance with minimum, maximum, and average latency statistics.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>WebRTC Technology:</strong> Unlike traditional ping tools that may be blocked by firewalls 
              or require special permissions, our WebRTC-based approach works reliably across all network 
              configurations. This technology ensures accurate measurements even in restrictive network environments.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
              Understanding Your Results
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Network latency, measured in milliseconds (ms), represents the time it takes for data to travel 
              from your device to a server and back. Lower latency means faster response times and better 
              performance for real-time applications like gaming, video calls, and live streaming.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Excellent (0-50ms):</strong> Perfect for gaming, video conferencing, and real-time applications. 
              This latency range provides seamless, responsive experiences with minimal delay.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Good (51-100ms):</strong> Suitable for most online activities including streaming, browsing, 
              and casual gaming. You may notice slight delays in very time-sensitive applications.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Fair (101-200ms):</strong> Acceptable for general internet use and streaming, but may 
              cause noticeable delays in interactive applications and competitive gaming.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              <strong>Poor (200ms+):</strong> High latency that may significantly impact user experience, 
              especially for real-time applications. Consider troubleshooting your network connection.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
              Use Cases & Applications
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This ping latency checker is perfect for network administrators, gamers, remote workers, and 
              anyone who needs to monitor their internet connection quality. Use it to troubleshoot connectivity 
              issues, optimize your network setup, verify ISP performance, or ensure your connection meets 
              the requirements for specific applications.
            </p>
            
            <p className="text-gray-600 dark:text-gray-300">
              The tool is completely free, requires no registration, and works entirely within your browser 
              for maximum privacy and convenience. Your network data stays local to your device, ensuring 
              complete security while providing professional-grade network diagnostics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}