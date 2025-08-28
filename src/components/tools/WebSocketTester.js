import React, { useState, useEffect, useRef } from 'react';
import { Wifi, WifiOff, Send, Trash2, Copy, AlertCircle, CheckCircle, Globe, Zap } from 'lucide-react';

const WebSocketTester = () => {
  const [url, setUrl] = useState('wss://echo.websocket.org/');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  
  const wsRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (type, content, timestamp = new Date()) => {
    const newMessage = {
      id: Date.now() + Math.random(),
      type,
      content,
      timestamp: timestamp.toLocaleTimeString()
    };
    setMessages(prev => [...prev, newMessage]);
    setShowResults(true);
  };

  const isValidWebSocketUrl = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'ws:' || urlObj.protocol === 'wss:';
    } catch {
      return false;
    }
  };

  const connect = () => {
    if (isConnected || isConnecting) return;
    
    // Validate URL before attempting connection
    if (!url.trim()) {
      setError('Please enter a WebSocket URL');
      return;
    }
    
    if (!isValidWebSocketUrl(url.trim())) {
      setError('Invalid WebSocket URL. Use ws:// or wss:// protocol');
      return;
    }
    
    setIsConnecting(true);
    setConnectionStatus('Connecting...');
    setError('');
    
    try {
      const ws = new WebSocket(url.trim());
      
      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setConnectionStatus('Connected');
        setError('');
        addMessage('system', `Connected to ${url}`);
        wsRef.current = ws;
      };
      
      ws.onmessage = (event) => {
        addMessage('received', event.data);
      };
      
      ws.onclose = (event) => {
        setIsConnected(false);
        setIsConnecting(false);
        setConnectionStatus('Disconnected');
        const reason = event.reason || 'Connection closed';
        addMessage('system', `Disconnected: ${reason} (Code: ${event.code})`);
        wsRef.current = null;
      };
      
      ws.onerror = (event) => {
        setIsConnecting(false);
        setError('Connection failed. Please check the URL and server availability.');
        setConnectionStatus('Error');
        addMessage('error', 'WebSocket connection failed');
      };
      
    } catch (err) {
      setIsConnecting(false);
      setError('Failed to create WebSocket connection');
      setConnectionStatus('Error');
      addMessage('error', `Connection error: ${err.message}`);
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'User disconnected');
      wsRef.current = null;
    }
    setIsConnected(false);
    setConnectionStatus('Disconnected');
  };

  const sendMessage = () => {
    if (!isConnected || !message.trim()) return;
    
    try {
      wsRef.current.send(message);
      addMessage('sent', message);
      setMessage('');
    } catch (err) {
      setError('Failed to send message');
      addMessage('error', 'Failed to send message');
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setShowResults(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
    });
  };

  const getStatusColor = () => {
    if (isConnected) return 'text-green-600 dark:text-green-400';
    if (isConnecting) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const getStatusIcon = () => {
    if (isConnected) return <CheckCircle className="w-4 h-4" />;
    if (isConnecting) return <Zap className="w-4 h-4 animate-pulse" />;
    return <WifiOff className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      {/* SEO Metadata */}
      <div className="hidden">
        <h1>WebSocket Tester - Test Real-time WebSocket Connections Online</h1>
        <meta name="description" content="Free online WebSocket tester tool to test real-time connections, send and receive messages, debug WebSocket APIs, and monitor connection status. Perfect for developers testing WebSocket endpoints." />
        <meta name="keywords" content="websocket tester, websocket client, real-time testing, websocket debugger, API testing" />
        <link rel="canonical" href="/tools/websocket-tester" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              WebSocket Tester
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Test and debug WebSocket connections in real-time. Connect to any WebSocket server, send messages, and monitor responses.
          </p>
        </div>

        {/* Main Tool Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          {/* Connection Section */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              WebSocket URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="wss://echo.websocket.org/"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isConnected || isConnecting}
              />
              <button
                onClick={isConnected ? disconnect : connect}
                disabled={isConnecting}
                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                  isConnected 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isConnected ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                {isConnected ? 'Disconnect' : isConnecting ? 'Connecting...' : 'Connect'}
              </button>
            </div>
            
            {/* Status */}
            <div className={`flex items-center gap-2 mt-2 text-sm ${getStatusColor()}`}>
              {getStatusIcon()}
              <span>{connectionStatus}</span>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Enter message to send..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!isConnected || !message.trim()}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Messages ({messages.length})
                </h3>
                <button
                  onClick={clearMessages}
                  className="px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                {messages.map((msg) => (
                  <div key={msg.id} className="mb-3 last:mb-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          msg.type === 'sent' 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                            : msg.type === 'received'
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                            : msg.type === 'error'
                            ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}>
                          {msg.type.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {msg.timestamp}
                        </span>
                      </div>
                      <button
                        onClick={() => copyToClipboard(msg.content)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 p-3 rounded border font-mono break-all">
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About WebSocket Tester
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              WebSocket Tester is a powerful, free online tool designed for developers to test and debug WebSocket connections in real-time. Whether you're building real-time applications, chat systems, live data feeds, or any other WebSocket-powered application, this tool provides everything you need to test your endpoints effectively.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Key Features:</h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-4">
              <li>• <strong>Real-time Connection Testing:</strong> Connect to any WebSocket server and monitor connection status</li>
              <li>• <strong>Message Exchange:</strong> Send and receive messages with timestamp tracking</li>
              <li>• <strong>Connection Management:</strong> Easy connect/disconnect with status indicators</li>
              <li>• <strong>Message History:</strong> View all sent and received messages with clear categorization</li>
              <li>• <strong>Error Handling:</strong> Detailed error messages and connection diagnostics</li>
              <li>• <strong>Copy Functionality:</strong> One-click copying of messages for easy debugging</li>
              <li>• <strong>Responsive Design:</strong> Works perfectly on desktop, tablet, and mobile devices</li>
            </ul>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Perfect For:</h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-4">
              <li>• API developers testing WebSocket endpoints</li>
              <li>• Real-time application debugging</li>
              <li>• WebSocket protocol learning and experimentation</li>
              <li>• Integration testing for chat applications</li>
              <li>• Live data feed validation</li>
              <li>• WebSocket server performance testing</li>
            </ul>
            
            <p className="text-gray-600 dark:text-gray-300">
              This tool runs entirely in your browser with no server-side processing, ensuring your data remains private and secure. Test your WebSocket connections with confidence and streamline your development workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebSocketTester;