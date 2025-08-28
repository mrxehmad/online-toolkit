import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Code, Copy, RotateCcw, FileText, Zap, Search } from 'lucide-react';

function JsonBeautifierValidator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

  // Mock theme hook - replace with your actual useTheme hook
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    // Auto-detect system theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  const validateAndBeautify = (jsonString) => {
    if (!jsonString.trim()) {
      setOutput('');
      setIsValid(null);
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(jsonString);
      const beautified = JSON.stringify(parsed, null, indentSize);
      setOutput(beautified);
      setIsValid(true);
      setError('');
    } catch (err) {
      setIsValid(false);
      setError(err.message);
      setOutput('');
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    validateAndBeautify(value);
  };

  const handleCopy = async () => {
    if (output) {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setIsValid(null);
    setError('');
    setCopied(false);
  };

  const minifyJson = () => {
    if (input.trim()) {
      try {
        const parsed = JSON.parse(input);
        const minified = JSON.stringify(parsed);
        setOutput(minified);
        setIsValid(true);
        setError('');
      } catch (err) {
        setIsValid(false);
        setError(err.message);
      }
    }
  };

  const loadSample = () => {
    const sample = `{
  "name": "John Doe",
  "age": 30,
  "city": "New York",
  "hobbies": ["reading", "swimming", "coding"],
  "address": {
    "street": "123 Main St",
    "zipcode": "10001"
  },
  "active": true
}`;
    setInput(sample);
    validateAndBeautify(sample);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-2xl p-6 md:p-8 transition-all duration-300">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-xl mr-3">
                  <Code className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  JSON Beautifier & Validator
                </h1>
              </div>
              
              {/* Status Indicator */}
              {isValid !== null && (
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  isValid 
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                    : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                }`}>
                  {isValid ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Valid JSON
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-2" />
                      Invalid JSON
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
              <button
                onClick={loadSample}
                className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-sm font-medium"
              >
                <FileText className="h-4 w-4 mr-2" />
                Load Sample
              </button>
              
              <button
                onClick={minifyJson}
                className="inline-flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors text-sm font-medium"
              >
                <Zap className="h-4 w-4 mr-2" />
                Minify
              </button>

              <button
                onClick={handleClear}
                className="inline-flex items-center px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Clear
              </button>

              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  Indent:
                </label>
                <select
                  value={indentSize}
                  onChange={(e) => {
                    setIndentSize(Number(e.target.value));
                    if (input.trim()) validateAndBeautify(input);
                  }}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={2}>2 spaces</option>
                  <option value={4}>4 spaces</option>
                  <option value={1}>1 tab</option>
                </select>
              </div>
            </div>

            {/* Input/Output Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Search className="inline h-4 w-4 mr-2" />
                  Input JSON
                </label>
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Paste your JSON here..."
                  className="w-full h-80 md:h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none transition-all"
                />
                
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-red-800 dark:text-red-200 text-sm font-medium">Error:</p>
                    <p className="text-red-600 dark:text-red-300 text-sm mt-1">{error}</p>
                  </div>
                )}
              </div>

              {/* Output Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Code className="inline h-4 w-4 mr-2" />
                    Formatted JSON
                  </label>
                  {output && (
                    <button
                      onClick={handleCopy}
                      className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        copied 
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                
                <div className="relative">
                  <textarea
                    value={output}
                    readOnly
                    placeholder="Formatted JSON will appear here..."
                    className="w-full h-80 md:h-96 p-4 border border-gray-300 dark:border-gray-600 rounded-xl font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Professional JSON Formatting & Validation Tool
              </h2>
              
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
                  Our advanced JSON Beautifier & Validator is the perfect tool for developers, API engineers, and data analysts who need to format, validate, and work with JSON data efficiently. Whether you're debugging API responses, formatting configuration files, or validating data structures, this tool provides everything you need in one convenient interface.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                      Key Features
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                      <li>• Real-time JSON validation with detailed error messages</li>
                      <li>• Beautiful formatting with customizable indentation</li>
                      <li>• One-click JSON minification for production use</li>
                      <li>• Copy formatted output to clipboard instantly</li>
                      <li>• Sample JSON data for testing and learning</li>
                      <li>• Responsive design works on all devices</li>
                      <li>• Dark mode support for comfortable coding</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                      Perfect For
                    </h3>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                      <li>• API response debugging and analysis</li>
                      <li>• Configuration file formatting</li>
                      <li>• Data validation before processing</li>
                      <li>• Code review and documentation</li>
                      <li>• Educational purposes and learning JSON</li>
                      <li>• Converting between minified and readable formats</li>
                      <li>• Quality assurance and testing workflows</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                    Why Choose Our JSON Tool?
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200">
                    Built with modern web technologies, our tool runs entirely in your browser for maximum privacy and speed. No data is sent to external servers, ensuring your sensitive JSON data remains secure. The intuitive interface provides instant feedback, making it easy to spot and fix JSON syntax errors quickly.
                  </p>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Free to use • No registration required • Works offline • Open source friendly
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JsonBeautifierValidator;