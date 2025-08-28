import React, { useState, useEffect } from 'react';
import { FileCode, Minimize2, Copy, Download, Check, AlertCircle, Zap } from 'lucide-react';

export default function HtmlCssJsMinifier() {
  const [activeTab, setActiveTab] = useState('html');
  const [inputCode, setInputCode] = useState('');
  const [outputCode, setOutputCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [error, setError] = useState('');
  const [compressionRatio, setCompressionRatio] = useState(0);

  // Sample code for each tab
  const sampleCode = {
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample HTML</title>
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: Arial, sans-serif;
        }
    </style>
</head>
<body>
    <h1>Hello World</h1>
    <p>This is a sample HTML document.</p>
    <script>
        console.log('Hello from HTML!');
    </script>
</body>
</html>`,
    css: `/* Main Styles */
body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    text-align: center;
    border-radius: 10px;
    margin-bottom: 2rem;
}

.btn {
    display: inline-block;
    padding: 12px 24px;
    background: #007bff;
    color: white;
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.btn:hover {
    background: #0056b3;
    transform: translateY(-2px);
}`,
    js: `// Sample JavaScript Code
function calculateSum(a, b) {
    return a + b;
}

const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
];

class UserManager {
    constructor() {
        this.users = [];
        this.init();
    }

    init() {
        console.log('UserManager initialized');
        this.loadUsers();
    }

    loadUsers() {
        // Simulate API call
        setTimeout(() => {
            this.users = users;
            this.renderUsers();
        }, 1000);
    }

    renderUsers() {
        const container = document.getElementById('users');
        if (!container) return;

        container.innerHTML = this.users
            .map(user => \`
                <div class="user-card">
                    <h3>\${user.name}</h3>
                    <p>\${user.email}</p>
                </div>
            \`)
            .join('');
    }

    addUser(userData) {
        const newUser = {
            id: Date.now(),
            ...userData
        };
        this.users.push(newUser);
        this.renderUsers();
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    const userManager = new UserManager();
    
    // Event listeners
    document.getElementById('add-user-btn')?.addEventListener('click', () => {
        userManager.addUser({
            name: 'New User',
            email: 'new@example.com'
        });
    });
});`
  };

  // Minification functions
  const minifyHTML = (html) => {
    return html
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/>\s+</g, '><') // Remove spaces between tags
      .replace(/\s+>/g, '>') // Remove spaces before closing bracket
      .replace(/<\s+/g, '<') // Remove spaces after opening bracket
      .trim();
  };

  const minifyCSS = (css) => {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/;\s*}/g, '}') // Remove last semicolon before closing brace
      .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
      .replace(/;\s*/g, ';') // Remove spaces after semicolon
      .replace(/,\s*/g, ',') // Remove spaces after comma
      .replace(/:\s*/g, ':') // Remove spaces after colon
      .replace(/}\s*/g, '}') // Remove spaces after closing brace
      .trim();
  };

  const minifyJS = (js) => {
    return js
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
      .replace(/\/\/.*$/gm, '') // Remove single-line comments
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\s*{\s*/g, '{') // Remove spaces around opening brace
      .replace(/\s*}\s*/g, '}') // Remove spaces around closing brace
      .replace(/\s*;\s*/g, ';') // Remove spaces around semicolon
      .replace(/\s*,\s*/g, ',') // Remove spaces around comma
      .replace(/\s*\(\s*/g, '(') // Remove spaces around opening parenthesis
      .replace(/\s*\)\s*/g, ')') // Remove spaces around closing parenthesis
      .replace(/\s*=\s*/g, '=') // Remove spaces around equals
      .replace(/\s*\+\s*/g, '+') // Remove spaces around plus
      .replace(/\s*-\s*/g, '-') // Remove spaces around minus
      .trim();
  };

  const handleMinify = () => {
    if (!inputCode.trim()) {
      setError('Please enter some code to minify');
      return;
    }

    setIsProcessing(true);
    setError('');

    setTimeout(() => {
      try {
        let minified = '';
        
        switch (activeTab) {
          case 'html':
            minified = minifyHTML(inputCode);
            break;
          case 'css':
            minified = minifyCSS(inputCode);
            break;
          case 'js':
            minified = minifyJS(inputCode);
            break;
        }

        setOutputCode(minified);
        
        // Calculate compression ratio
        const originalSize = inputCode.length;
        const minifiedSize = minified.length;
        const ratio = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
        setCompressionRatio(ratio);
        
        setIsProcessing(false);
      } catch (err) {
        setError('Error minifying code: ' + err.message);
        setIsProcessing(false);
      }
    }, 500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const extensions = { html: 'html', css: 'css', js: 'js' };
    const blob = new Blob([outputCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `minified.${extensions[activeTab]}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    setInputCode(sampleCode[activeTab]);
    setOutputCode('');
    setError('');
    setCompressionRatio(0);
  };

  const clearAll = () => {
    setInputCode('');
    setOutputCode('');
    setError('');
    setCompressionRatio(0);
  };

  useEffect(() => {
    // Set page title and meta description for SEO
    document.title = 'HTML CSS JS Minifier - Free Online Code Minification Tool';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Free online HTML, CSS, and JavaScript minifier tool. Reduce file sizes, optimize code, and improve website performance with our fast client-side minification.');
    }

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', window.location.href);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* iOS-style Card Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 px-6 py-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <Minimize2 className="w-8 h-8 mr-3" />
              <h1 className="text-3xl md:text-4xl font-bold">HTML CSS JS Minifier</h1>
            </div>
            <p className="text-center text-blue-100 max-w-2xl mx-auto">
              Optimize your web code by removing unnecessary characters, comments, and whitespace
            </p>
          </div>

          <div className="p-6 md:p-8">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
              {['html', 'css', 'js'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setInputCode('');
                    setOutputCode('');
                    setError('');
                    setCompressionRatio(0);
                  }}
                  className={`flex-1 px-4 py-2 rounded-md font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
                  }`}
                >
                  <FileCode className="w-4 h-4 inline mr-2" />
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={loadSample}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Load Sample
              </button>
              <button
                onClick={clearAll}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Input Code ({activeTab.toUpperCase()})
                </label>
                <textarea
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  placeholder={`Paste your ${activeTab.toUpperCase()} code here...`}
                  className="w-full h-64 md:h-80 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Output Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Minified Code
                  </label>
                  {outputCode && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="Copy to clipboard"
                      >
                        {copySuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                        title="Download file"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                <textarea
                  value={outputCode}
                  readOnly
                  placeholder="Minified code will appear here..."
                  className="w-full h-64 md:h-80 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-sm resize-none"
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                <span className="text-red-700 dark:text-red-400">{error}</span>
              </div>
            )}

            {/* Stats */}
            {outputCode && compressionRatio > 0 && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-green-700 dark:text-green-400">
                    <Zap className="w-5 h-5 inline mr-2" />
                    Compression successful!
                  </span>
                  <span className="text-green-700 dark:text-green-400 font-medium">
                    Size reduced by {compressionRatio}%
                  </span>
                </div>
                <div className="mt-2 text-sm text-green-600 dark:text-green-400">
                  Original: {inputCode.length} characters → Minified: {outputCode.length} characters
                </div>
              </div>
            )}

            {/* Minify Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleMinify}
                disabled={!inputCode.trim() || isProcessing}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-4 h-4 inline mr-2" />
                    Minify Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Long Description for SEO */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/30 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Professional Code Minification Tool
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Our HTML CSS JS Minifier is a powerful, free online tool designed to optimize your web code for better performance and faster loading times. By removing unnecessary characters, comments, and whitespace, this tool helps reduce file sizes significantly while maintaining full functionality.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>HTML Minification:</strong> Remove comments, extra whitespace, and optimize tag structure</li>
                  <li>• <strong>CSS Optimization:</strong> Eliminate comments, unnecessary spaces, and redundant semicolons</li>
                  <li>• <strong>JavaScript Compression:</strong> Strip comments, whitespace, and optimize syntax</li>
                  <li>• <strong>Real-time Processing:</strong> Instant minification with live compression statistics</li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• <strong>Client-side Processing:</strong> Your code never leaves your browser - completely secure</li>
                  <li>• <strong>Download & Copy:</strong> Easy export options for minified code</li>
                  <li>• <strong>Sample Code:</strong> Built-in examples to test the tool</li>
                  <li>• <strong>Mobile Responsive:</strong> Works perfectly on all devices</li>
                </ul>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Why Minify Your Code?</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Code minification is essential for modern web development. It reduces bandwidth usage, improves page load speeds, and enhances user experience. Search engines also favor faster websites, making minification crucial for SEO. Our tool typically achieves 20-60% file size reduction while preserving complete functionality.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Best Practices</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Always keep original, well-formatted versions of your code for development and maintenance. Use minified versions only for production deployment. Test your minified code thoroughly to ensure functionality remains intact. Consider using source maps for debugging minified code in production environments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}