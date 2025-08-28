import React, { useState, useEffect, useCallback } from 'react';
import { FiFileText, FiAlertTriangle, FiAlertCircle, FiInfo, FiUpload, FiTrash2, FiSun, FiMoon } from 'react-icons/fi';

// SEO and PWA metadata
const TOOL_METADATA = {
  title: "Log File Analyzer - Parse & Highlight Errors Online",
  description: "Free online log file analyzer. Parse logs, highlight errors and warnings with syntax highlighting. Works entirely in your browser - no server uploads required.",
  keywords: "log analyzer, log parser, error detection, warning detection, developer tools, debugging",
  author: "Log Tools",
  url: "https://example.com/log-analyzer",
  image: "https://example.com/og-log-analyzer.jpg"
};

// Log level patterns for detection
const LOG_PATTERNS = {
  error: /\b(error|err|exception|fatal|fail|failed|panic|crash)\b/gi,
  warning: /\b(warn|warning|caution|deprecated|alert)\b/gi,
  info: /\b(info|information|notice|debug|trace)\b/gi,
  timestamp: /\d{4}-\d{2}-\d{2}[\s\T]\d{2}:\d{2}:\d{2}|\d{2}\/\d{2}\/\d{4}\s\d{2}:\d{2}:\d{2}|\w{3}\s\d{1,2}\s\d{2}:\d{2}:\d{2}/g,
  ip: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  httpStatus: /\b[1-5]\d{2}\b/g
};

// Helmet-like SEO component
const SEOHead = ({ metadata }) => {
  useEffect(() => {
    // Update document title
    document.title = metadata.title;
    
    // Update or create meta tags
    const updateMeta = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);
      if (!meta) {
        meta = document.createElement('meta');
        if (property) meta.setAttribute('property', name);
        else meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Basic meta tags
    updateMeta('description', metadata.description);
    updateMeta('keywords', metadata.keywords);
    updateMeta('author', metadata.author);
    updateMeta('viewport', 'width=device-width, initial-scale=1.0');
    
    // Open Graph
    updateMeta('og:title', metadata.title, true);
    updateMeta('og:description', metadata.description, true);
    updateMeta('og:type', 'website', true);
    updateMeta('og:url', metadata.url, true);
    updateMeta('og:image', metadata.image, true);
    
    // Twitter Card
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', metadata.title);
    updateMeta('twitter:description', metadata.description);
    updateMeta('twitter:image', metadata.image);
    
    // Theme color based on current theme
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    updateMeta('theme-color', isDark ? '#1f2937' : '#ffffff');
    
    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', metadata.url);
    
    // JSON-LD Schema
    let jsonLd = document.querySelector('script[type="application/ld+json"]');
    if (!jsonLd) {
      jsonLd = document.createElement('script');
      jsonLd.setAttribute('type', 'application/ld+json');
      document.head.appendChild(jsonLd);
    }
    
    const schema = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Log File Analyzer",
      "description": metadata.description,
      "url": metadata.url,
      "applicationCategory": "DeveloperApplication",
      "operatingSystem": "Any",
      "permissions": "None required - runs entirely in browser",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };
    
    jsonLd.textContent = JSON.stringify(schema);
    
  }, [metadata]);
  
  return null;
};

const LogFileAnalyzer = () => {
  const [logContent, setLogContent] = useState('');
  const [parsedLogs, setParsedLogs] = useState([]);
  const [stats, setStats] = useState({ errors: 0, warnings: 0, info: 0, total: 0 });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showThemeToggle, setShowThemeToggle] = useState(false);

  // Theme detection and management
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);
    
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    // Show manual toggle after 5 seconds if user hasn't interacted
    const timer = setTimeout(() => setShowThemeToggle(true), 5000);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      clearTimeout(timer);
    };
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Parse log content
  const parseLogContent = useCallback((content) => {
    if (!content.trim()) {
      setParsedLogs([]);
      setStats({ errors: 0, warnings: 0, info: 0, total: 0 });
      return;
    }

    const lines = content.split('\n').filter(line => line.trim());
    const parsed = [];
    let errorCount = 0, warningCount = 0, infoCount = 0;

    lines.forEach((line, index) => {
      let level = 'default';
      let matches = [];

      // Determine log level
      if (LOG_PATTERNS.error.test(line)) {
        level = 'error';
        errorCount++;
      } else if (LOG_PATTERNS.warning.test(line)) {
        level = 'warning';
        warningCount++;
      } else if (LOG_PATTERNS.info.test(line)) {
        level = 'info';
        infoCount++;
      }

      // Extract highlighted segments
      const segments = [];
      let lastIndex = 0;

      // Find all pattern matches
      Object.entries(LOG_PATTERNS).forEach(([type, pattern]) => {
        const regex = new RegExp(pattern.source, pattern.flags);
        let match;
        while ((match = regex.exec(line)) !== null) {
          matches.push({
            start: match.index,
            end: match.index + match[0].length,
            type,
            text: match[0]
          });
        }
      });

      // Sort matches by position
      matches.sort((a, b) => a.start - b.start);

      // Build segments
      matches.forEach(match => {
        if (match.start > lastIndex) {
          segments.push({ text: line.slice(lastIndex, match.start), type: 'text' });
        }
        segments.push({ text: match.text, type: match.type });
        lastIndex = match.end;
      });

      if (lastIndex < line.length) {
        segments.push({ text: line.slice(lastIndex), type: 'text' });
      }

      if (segments.length === 0) {
        segments.push({ text: line, type: 'text' });
      }

      parsed.push({
        id: index,
        level,
        segments,
        raw: line
      });
    });

    setParsedLogs(parsed);
    setStats({
      errors: errorCount,
      warnings: warningCount,
      info: infoCount,
      total: lines.length
    });
  }, []);

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setLogContent(content);
      parseLogContent(content);
    };
    reader.readAsText(file);
  };

  // Handle text input
  const handleTextChange = (event) => {
    const content = event.target.value;
    setLogContent(content);
    parseLogContent(content);
  };

  const clearLogs = () => {
    setLogContent('');
    setParsedLogs([]);
    setStats({ errors: 0, warnings: 0, info: 0, total: 0 });
  };

  const theme = isDarkMode ? 'dark' : 'light';

  return (
    <>
      <SEOHead metadata={TOOL_METADATA} />
      
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-900 text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        
        {/* Tool Shell Header */}
        <header className={`sticky top-0 z-10 backdrop-blur-md border-b transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-900/80 border-gray-700' 
            : 'bg-white/80 border-gray-200'
        }`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-2xl ${
                  isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50'
                }`}>
                  <FiFileText className="h-8 w-8 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-semibold">
                    Log File Analyzer
                  </h1>
                  <p className={`text-sm mt-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Parse logs and highlight errors, warnings, and patterns
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Upload Section */}
          <section className={`rounded-3xl p-6 sm:p-8 shadow-sm transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Upload Log File</h2>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Select a log file or paste log content directly
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <label className={`flex-1 flex items-center justify-center px-6 py-4 border-2 border-dashed rounded-2xl cursor-pointer transition-colors duration-200 ${
                  isDarkMode 
                    ? 'border-gray-600 hover:border-gray-500 bg-gray-700/30' 
                    : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                }`}>
                  <input
                    type="file"
                    accept=".log,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    aria-label="Upload log file"
                  />
                  <div className="text-center">
                    <FiUpload className="mx-auto h-8 w-8 mb-2 text-blue-500" />
                    <span className="text-sm font-medium">Choose File</span>
                  </div>
                </label>
                
                {logContent && (
                  <button
                    onClick={clearLogs}
                    className={`px-6 py-4 rounded-2xl transition-colors duration-200 ${
                      isDarkMode 
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' 
                        : 'bg-red-50 hover:bg-red-100 text-red-600'
                    }`}
                    aria-label="Clear logs"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                )}
              </div>

              <div>
                <label htmlFor="log-textarea" className="block text-sm font-medium mb-2">
                  Or paste log content:
                </label>
                <textarea
                  id="log-textarea"
                  value={logContent}
                  onChange={handleTextChange}
                  rows={8}
                  className={`w-full rounded-2xl border-0 p-4 text-sm font-mono resize-none transition-colors duration-300 focus:ring-2 focus:ring-blue-500 ${
                    isDarkMode 
                      ? 'bg-gray-700 text-white placeholder-gray-400' 
                      : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Paste your log content here..."
                  aria-describedby="log-help"
                />
                <p id="log-help" className={`text-xs mt-2 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Supports common log formats and automatically detects errors, warnings, and info messages
                </p>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          {stats.total > 0 && (
            <section className={`rounded-3xl p-6 sm:p-8 shadow-sm transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <h2 className="text-xl font-semibold mb-6">Analysis Summary</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl text-center ${
                  isDarkMode ? 'bg-red-500/20' : 'bg-red-50'
                }`}>
                  <FiAlertCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-500">{stats.errors}</div>
                  <div className="text-sm text-red-600">Errors</div>
                </div>
                <div className={`p-4 rounded-2xl text-center ${
                  isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-50'
                }`}>
                  <FiAlertTriangle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-500">{stats.warnings}</div>
                  <div className="text-sm text-yellow-600">Warnings</div>
                </div>
                <div className={`p-4 rounded-2xl text-center ${
                  isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50'
                }`}>
                  <FiInfo className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-500">{stats.info}</div>
                  <div className="text-sm text-blue-600">Info</div>
                </div>
                <div className={`p-4 rounded-2xl text-center ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <FiFileText className="h-6 w-6 text-gray-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Lines</div>
                </div>
              </div>
            </section>
          )}

          {/* Parsed Logs Section */}
          {parsedLogs.length > 0 && (
            <section className={`rounded-3xl shadow-sm transition-colors duration-300 ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="p-6 sm:p-8 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold">Parsed Logs</h2>
                <p className={`text-sm mt-1 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Syntax highlighted with error and warning detection
                </p>
              </div>
              <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {parsedLogs.map((log) => (
                    <div
                      key={log.id}
                      className={`flex items-start gap-4 p-3 rounded-xl font-mono text-sm transition-colors duration-200 ${
                        log.level === 'error' 
                          ? isDarkMode ? 'bg-red-500/10 border-l-4 border-red-500' : 'bg-red-50 border-l-4 border-red-500'
                        : log.level === 'warning'
                          ? isDarkMode ? 'bg-yellow-500/10 border-l-4 border-yellow-500' : 'bg-yellow-50 border-l-4 border-yellow-500'
                        : log.level === 'info'
                          ? isDarkMode ? 'bg-blue-500/10 border-l-4 border-blue-500' : 'bg-blue-50 border-l-4 border-blue-500'
                          : isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}
                    >
                      <span className={`text-xs font-medium w-8 flex-shrink-0 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {log.id + 1}
                      </span>
                      <div className="flex-1 break-all">
                        {log.segments.map((segment, segIndex) => (
                          <span
                            key={segIndex}
                            className={
                              segment.type === 'error' ? 'text-red-500 font-semibold' :
                              segment.type === 'warning' ? 'text-yellow-500 font-semibold' :
                              segment.type === 'info' ? 'text-blue-500 font-semibold' :
                              segment.type === 'timestamp' ? 'text-green-500' :
                              segment.type === 'ip' ? 'text-purple-500' :
                              segment.type === 'httpStatus' ? 'text-orange-500' :
                              ''
                            }
                          >
                            {segment.text}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Privacy Note */}
          <div className={`text-center text-sm ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <p className="flex items-center justify-center gap-2">
              <span>🔒</span>
              <span>All processing happens locally in your browser. Your data never leaves your device.</span>
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default LogFileAnalyzer;