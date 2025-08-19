import React, { useState, useEffect, useMemo } from 'react';
import { Play, Copy, RefreshCw, Search, Code, FileText, Smartphone, AlertCircle, CheckCircle, Info } from 'lucide-react';

const RegexTester = () => {
  const [pattern, setPattern] = useState('\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Contact us at support@example.com or sales@test.org for more information.');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [selectedExample, setSelectedExample] = useState('');

  const examples = [
    {
      name: 'Email Validation',
      pattern: '\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b',
      flags: 'gi',
      test: 'Contact us at support@example.com or sales@test.org for assistance.'
    },
    {
      name: 'Phone Numbers',
      pattern: '\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}',
      flags: 'g',
      test: 'Call us at (555) 123-4567 or 555.987.6543 or 555 111 2222'
    },
    {
      name: 'URLs',
      pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
      flags: 'g',
      test: 'Visit https://www.example.com or http://test.org for more info'
    },
    {
      name: 'IP Address',
      pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b',
      flags: 'g',
      test: 'Server IPs: 192.168.1.1, 10.0.0.1, and 172.16.254.1'
    },
    {
      name: 'Credit Card',
      pattern: '\\b(?:\\d{4}[-.\\s]?){3}\\d{4}\\b',
      flags: 'g',
      test: '4532 1234 5678 9012 or 4532-1234-5678-9012 or 4532123456789012'
    },
    {
      name: 'Hexadecimal Colors',
      pattern: '#[a-fA-F0-9]{6}\\b|#[a-fA-F0-9]{3}\\b',
      flags: 'g',
      test: 'Colors: #FF5733, #333, #A1B2C3, and #fff for styling'
    }
  ];

  const flagOptions = [
    { key: 'g', label: 'Global', desc: 'Find all matches' },
    { key: 'i', label: 'Ignore Case', desc: 'Case insensitive' },
    { key: 'm', label: 'Multiline', desc: '^$ match line breaks' },
    { key: 's', label: 'Dotall', desc: '. matches newlines' },
    { key: 'u', label: 'Unicode', desc: 'Unicode support' },
    { key: 'y', label: 'Sticky', desc: 'Match from lastIndex' }
  ];

  const testRegex = useMemo(() => {
    try {
      if (!pattern) return null;
      const regex = new RegExp(pattern, flags);
      setError('');
      return regex;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [pattern, flags]);

  useEffect(() => {
    if (testRegex && testString) {
      try {
        const foundMatches = [];
        let match;
        
        if (flags.includes('g')) {
          const regex = new RegExp(pattern, flags);
          while ((match = regex.exec(testString)) !== null) {
            foundMatches.push({
              match: match[0],
              index: match.index,
              groups: match.slice(1),
              namedGroups: match.groups || {}
            });
            if (match.index === regex.lastIndex) break;
          }
        } else {
          match = testRegex.exec(testString);
          if (match) {
            foundMatches.push({
              match: match[0],
              index: match.index,
              groups: match.slice(1),
              namedGroups: match.groups || {}
            });
          }
        }
        
        setMatches(foundMatches);
      } catch (err) {
        setError(err.message);
        setMatches([]);
      }
    } else {
      setMatches([]);
    }
  }, [testRegex, testString, pattern, flags]);

  const handleExampleSelect = (example) => {
    setPattern(example.pattern);
    setFlags(example.flags);
    setTestString(example.test);
    setSelectedExample(example.name);
  };

  const toggleFlag = (flag) => {
    setFlags(prev => 
      prev.includes(flag) 
        ? prev.replace(flag, '') 
        : prev + flag
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const highlightMatches = () => {
    if (!matches.length) return testString;
    
    let result = testString;
    let offset = 0;
    
    matches.forEach((match, index) => {
      const start = match.index + offset;
      const end = start + match.match.length;
      const highlighted = `<mark class="bg-blue-100 text-blue-800 px-1 rounded font-medium">${match.match}</mark>`;
      result = result.substring(0, start) + highlighted + result.substring(end);
      offset += highlighted.length - match.match.length;
    });
    
    return result;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Regex Tester & Playground
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Test, validate, and debug regular expressions online with our powerful iOS-styled regex tester. 
              Perfect for developers, data analysts, and anyone working with pattern matching.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Real-time testing
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No server required
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Mobile responsive
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Pattern examples
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Testing Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Regular Expression Input */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-blue-500" />
                Regular Expression
              </h2>
              
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm font-mono">/</span>
                    </div>
                    <input
                      type="text"
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      className="block w-full pl-8 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="Enter your regex pattern..."
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm font-mono">/{flags}</span>
                    </div>
                  </div>
                </div>

                {/* Flags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flags</label>
                  <div className="flex flex-wrap gap-2">
                    {flagOptions.map((flag) => (
                      <button
                        key={flag.key}
                        onClick={() => toggleFlag(flag.key)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          flags.includes(flag.key)
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title={flag.desc}
                      >
                        {flag.key} - {flag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Test String Input */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Test String
              </h2>
              
              <textarea
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="w-full h-32 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                placeholder="Enter your test string here..."
              />
            </div>

            {/* Results */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Search className="w-5 h-5 text-purple-500" />
                  Results ({matches.length} matches)
                </h2>
                {testString && (
                  <button
                    onClick={() => copyToClipboard(testString)}
                    className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Copy test string"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Highlighted Text */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Highlighted Matches</h3>
                <div 
                  className="p-4 bg-gray-50 rounded-lg border font-mono text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                />
              </div>

              {/* Match Details */}
              {matches.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Match Details</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {matches.map((match, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-900">
                            Match {index + 1}
                          </span>
                          <span className="text-xs text-blue-600">
                            Position: {match.index}-{match.index + match.match.length}
                          </span>
                        </div>
                        <div className="font-mono text-sm bg-white p-2 rounded border">
                          "{match.match}"
                        </div>
                        {match.groups.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-blue-600">Groups:</span>
                            <div className="text-xs font-mono text-gray-600">
                              {match.groups.map((group, i) => (
                                <div key={i}>Group {i + 1}: "{group}"</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {matches.length === 0 && !error && pattern && testString && (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No matches found</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Examples */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-orange-500" />
                Quick Examples
              </h3>
              
              <div className="space-y-2">
                {examples.map((example) => (
                  <button
                    key={example.name}
                    onClick={() => handleExampleSelect(example)}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedExample === example.name
                        ? 'bg-blue-50 border-2 border-blue-200 text-blue-900'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent text-gray-700'
                    }`}
                  >
                    <div className="font-medium text-sm">{example.name}</div>
                    <div className="text-xs text-gray-500 mt-1 font-mono truncate">
                      /{example.pattern}/{example.flags}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Regex Guide */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-500" />
                Quick Reference
              </h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Common Patterns</h4>
                  <div className="space-y-1 text-gray-600 font-mono text-xs">
                    <div><code className="bg-gray-100 px-1 rounded">\d</code> - Any digit</div>
                    <div><code className="bg-gray-100 px-1 rounded">\w</code> - Word character</div>
                    <div><code className="bg-gray-100 px-1 rounded">\s</code> - Whitespace</div>
                    <div><code className="bg-gray-100 px-1 rounded">.</code> - Any character</div>
                    <div><code className="bg-gray-100 px-1 rounded">^</code> - Start of string</div>
                    <div><code className="bg-gray-100 px-1 rounded">$</code> - End of string</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Quantifiers</h4>
                  <div className="space-y-1 text-gray-600 font-mono text-xs">
                    <div><code className="bg-gray-100 px-1 rounded">*</code> - 0 or more</div>
                    <div><code className="bg-gray-100 px-1 rounded">+</code> - 1 or more</div>
                    <div><code className="bg-gray-100 px-1 rounded">?</code> - 0 or 1</div>
                    <div><code className="bg-gray-100 px-1 rounded">{`{n}`}</code> - Exactly n</div>
                    <div><code className="bg-gray-100 px-1 rounded">{`{n,m}`}</code> - Between n and m</div>
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Tool</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                This regex tester runs entirely in your browser - no data is sent to any server. 
                Perfect for testing regular expressions for validation, data extraction, and text processing. 
                Works on desktop, tablet, and mobile devices.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Use Our Regex Tester?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Play className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Real-time Testing</h3>
                <p className="text-sm text-gray-600">Instant results as you type your pattern</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Mobile Friendly</h3>
                <p className="text-sm text-gray-600">Works perfectly on all devices</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">No Registration</h3>
                <p className="text-sm text-gray-600">Start testing immediately</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Code className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">Developer Friendly</h3>
                <p className="text-sm text-gray-600">Built for developers by developers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTester;