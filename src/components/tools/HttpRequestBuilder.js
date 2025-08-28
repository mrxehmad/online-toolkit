import React, { useState, useEffect } from 'react';
import { Send, Plus, Trash2, Copy, CheckCircle, Globe, Code, Settings, Zap } from 'lucide-react';

// Mock useTheme hook - replace with your actual implementation
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  return { theme, setTheme };
};

export default function HttpRequestBuilder() {
  const { theme } = useTheme();
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState([{ key: '', value: '' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  // SEO metadata setup
  useEffect(() => {
    document.title = 'HTTP Request Builder - Test APIs & Web Services Online | Free Developer Tool';
    
    // Create or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Free HTTP Request Builder tool for developers. Test REST APIs, send GET/POST/PUT/DELETE requests, customize headers, and view responses. Perfect for API testing and web service debugging.');
    
    // Create or update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}/tools/http-request-builder`);
  }, []);

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const removeHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const sendRequest = async () => {
    if (!url) return;
    
    setLoading(true);
    setShowResponse(true);
    
    try {
      const requestHeaders = {};
      headers.forEach(header => {
        if (header.key && header.value) {
          requestHeaders[header.key] = header.value;
        }
      });

      const requestOptions = {
        method,
        headers: requestHeaders,
      };

      if (method !== 'GET' && method !== 'HEAD' && body) {
        requestOptions.body = body;
      }

      const startTime = Date.now();
      const res = await fetch(url, requestOptions);
      const endTime = Date.now();
      
      const responseText = await res.text();
      let parsedResponse;
      
      try {
        parsedResponse = JSON.parse(responseText);
      } catch {
        parsedResponse = responseText;
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data: parsedResponse,
        time: endTime - startTime
      });
    } catch (error) {
      setResponse({
        error: error.message,
        status: 0,
        statusText: 'Network Error'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* iOS-style card */}
        <div className={`rounded-2xl shadow-2xl backdrop-blur-lg border transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-gray-800/90 border-gray-700/50 shadow-black/20' 
            : 'bg-white/90 border-gray-200/50 shadow-gray-500/20'
        }`}>
          
          {/* Header Section */}
          <div className="p-8 text-center border-b border-gray-200/20 dark:border-gray-700/20">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full ${
                theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'
              }`}>
                <Zap className={`w-8 h-8 ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
            </div>
            <h1 className={`text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              HTTP Request Builder
            </h1>
            <p className={`text-lg ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Test and debug REST APIs with ease
            </p>
          </div>

          {/* Main Tool Section */}
          <div className="p-8">
            {/* Request Configuration */}
            <div className="space-y-6">
              {/* Method and URL */}
              <div className="flex flex-col sm:flex-row gap-4">
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className={`px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                >
                  {methods.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                
                <div className="flex-1 relative">
                  <Globe className={`absolute left-3 top-3.5 w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://api.example.com/endpoint"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
                
                <button
                  onClick={sendRequest}
                  disabled={!url || loading}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    theme === 'dark'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>

              {/* Headers */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Settings className={`w-5 h-5 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`} />
                  <h3 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Headers
                  </h3>
                  <button
                    onClick={addHeader}
                    className={`ml-auto p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={header.key}
                        onChange={(e) => updateHeader(index, 'key', e.target.value)}
                        placeholder="Header name"
                        className={`flex-1 px-3 py-2 rounded-lg border focus:ring-1 focus:ring-blue-500 transition-all ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <input
                        type="text"
                        value={header.value}
                        onChange={(e) => updateHeader(index, 'value', e.target.value)}
                        placeholder="Header value"
                        className={`flex-1 px-3 py-2 rounded-lg border focus:ring-1 focus:ring-blue-500 transition-all ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                      <button
                        onClick={() => removeHeader(index)}
                        className={`p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors ${
                          theme === 'dark' ? 'text-red-400' : 'text-red-600'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Body */}
              {method !== 'GET' && method !== 'HEAD' && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Code className={`w-5 h-5 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                    }`} />
                    <h3 className={`text-lg font-semibold ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Request Body
                    </h3>
                  </div>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder='{"key": "value"}'
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono text-sm ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Response Section */}
            {showResponse && response && (
              <div className="mt-8 pt-6 border-t border-gray-200/20 dark:border-gray-700/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Response
                  </h3>
                  <div className="flex items-center gap-4">
                    {response.time && (
                      <span className={`text-sm ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {response.time}ms
                      </span>
                    )}
                    <button
                      onClick={copyResponse}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-all ${
                        theme === 'dark' 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-green-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setShowResponse(false)}
                      className={`text-sm px-3 py-1 rounded-lg transition-all ${
                        theme === 'dark' 
                          ? 'hover:bg-gray-700 text-gray-300' 
                          : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      Close
                    </button>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg border ${
                  theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
                }`}>
                  {response.error ? (
                    <div className="text-red-500">
                      <div className="font-semibold">Error: {response.error}</div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          response.status >= 200 && response.status < 300
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : response.status >= 400
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        }`}>
                          {response.status} {response.statusText}
                        </span>
                      </div>
                      
                      <pre className={`text-sm overflow-x-auto whitespace-pre-wrap break-words ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
                      }`}>
                        {typeof response.data === 'string' 
                          ? response.data 
                          : JSON.stringify(response.data, null, 2)
                        }
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Description Section */}
          <div className={`p-8 border-t ${
            theme === 'dark' ? 'border-gray-700/20' : 'border-gray-200/20'
          }`}>
            <div className={`prose max-w-none ${
              theme === 'dark' ? 'prose-invert' : ''
            }`}>
              <h2 className={`text-2xl font-bold mb-4 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                Professional HTTP Request Builder & API Testing Tool
              </h2>
              
              <p className={`text-lg mb-6 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Our HTTP Request Builder is a comprehensive, free online tool designed for developers, API testers, and web service integrators. Build, send, and analyze HTTP requests with support for all major HTTP methods including GET, POST, PUT, DELETE, PATCH, HEAD, and OPTIONS.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Key Features
                  </h3>
                  <ul className={`space-y-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <li>• Support for all HTTP methods (GET, POST, PUT, DELETE, etc.)</li>
                    <li>• Custom headers configuration</li>
                    <li>• JSON request body editor</li>
                    <li>• Real-time response viewer</li>
                    <li>• Response time measurement</li>
                    <li>• One-click response copying</li>
                    <li>• Mobile-responsive design</li>
                    <li>• Dark/light theme support</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className={`text-xl font-semibold mb-3 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Perfect For
                  </h3>
                  <ul className={`space-y-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    <li>• REST API development and testing</li>
                    <li>• Web service integration</li>
                    <li>• API endpoint validation</li>
                    <li>• HTTP status code debugging</li>
                    <li>• Request/response analysis</li>
                    <li>• API documentation examples</li>
                    <li>• Educational purposes</li>
                    <li>• Rapid prototyping</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6">
                <p className={`${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  This tool runs entirely in your browser - no data is sent to external servers except for your actual HTTP requests. Your request configurations and responses remain private and secure. Perfect for testing internal APIs, debugging web services, or learning about HTTP protocols.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}