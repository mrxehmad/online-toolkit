import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, 
  Check, 
  X, 
  Info, 
  Shield, 
  Globe, 
  Zap, 
  Eye,
  EyeOff,
  Copy,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const PiholeRegexPlayground = () => {
  const [regex, setRegex] = useState('');
  const [testUrls, setTestUrls] = useState('google.com\nfacebook.com\nads.example.com\ntracker.malware.com');
  const [flags, setFlags] = useState('gi');
  const [showMatches, setShowMatches] = useState(true);
  const [results, setResults] = useState([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Common Pi-hole regex patterns
  const commonPatterns = [
    { name: 'Block all subdomains', pattern: '^.*\\.example\\.com$', description: 'Blocks all subdomains of example.com' },
    { name: 'Block ads keywords', pattern: '.*\\b(ads?|advertisement|banner|popup)\\b.*', description: 'Blocks domains containing ad-related keywords' },
    { name: 'Block tracking', pattern: '.*\\b(track|analytics|metric|telemetry)\\b.*', description: 'Blocks tracking and analytics domains' },
    { name: 'Block social widgets', pattern: '.*\\b(facebook|twitter|instagram|tiktok).*widget.*', description: 'Blocks social media widgets' },
    { name: 'Block specific TLD', pattern: '.*\\.tk$', description: 'Blocks all .tk domains' },
    { name: 'Wildcard subdomain', pattern: '^([a-z0-9.-]+\\.)?doubleclick\\.net$', description: 'Blocks doubleclick.net and all subdomains' }
  ];

  // Test the regex against URLs
  const testRegex = useMemo(() => {
    if (!regex.trim()) return [];
    
    try {
      const regexObj = new RegExp(regex, flags);
      const urls = testUrls.split('\n').filter(url => url.trim());
      
      return urls.map(url => {
        const cleanUrl = url.trim();
        const matches = regexObj.test(cleanUrl);
        const matchDetails = cleanUrl.match(regexObj);
        
        return {
          url: cleanUrl,
          matches,
          matchDetails: matchDetails || [],
          blocked: matches // In Pi-hole context, match = blocked
        };
      });
    } catch (err) {
      setError(err.message);
      setIsValid(false);
      return [];
    }
  }, [regex, testUrls, flags]);

  useEffect(() => {
    setResults(testRegex);
    setIsValid(true);
    setError('');
  }, [testRegex]);

  const handlePatternSelect = (pattern) => {
    setRegex(pattern);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const exportResults = () => {
    const data = {
      regex,
      flags,
      results: results.map(r => ({ url: r.url, blocked: r.blocked }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pihole-regex-test.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const blockedCount = results.filter(r => r.blocked).length;
  const allowedCount = results.length - blockedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* SEO Meta Information */}
      <div className="hidden">
        <h1>Pi-hole Regex Playground - Test & Validate DNS Blocking Rules</h1>
        <p>Free online Pi-hole regex tester and validator. Test DNS blocking patterns, validate regex syntax, and optimize your Pi-hole configuration. Works offline in your browser with real-time validation.</p>
      </div>
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pi-hole Regex Playground</h1>
                <p className="text-sm text-gray-600">Test and validate your DNS blocking patterns</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
              <Globe className="h-4 w-4" />
              <span>Browser-based • No data sent</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Regex Input */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-lg font-semibold text-gray-900 flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-500" />
                  Regex Pattern
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => copyToClipboard(regex)}
                    className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                    disabled={!regex}
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  {copySuccess && (
                    <span className="text-xs text-green-600 flex items-center">
                      <Check className="h-3 w-3 mr-1" />
                      Copied!
                    </span>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <textarea
                  value={regex}
                  onChange={(e) => setRegex(e.target.value)}
                  placeholder="Enter your Pi-hole regex pattern here... e.g., ^.*\.doubleclick\.net$"
                  className={`w-full h-24 px-4 py-3 border-2 rounded-xl font-mono text-sm resize-none transition-colors ${
                    isValid 
                      ? 'border-gray-200 focus:border-blue-500' 
                      : 'border-red-300 focus:border-red-500'
                  } focus:outline-none focus:ring-0`}
                />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <label className="text-sm text-gray-600 flex items-center">
                      Flags:
                      <input
                        type="text"
                        value={flags}
                        onChange={(e) => setFlags(e.target.value)}
                        className="ml-2 px-2 py-1 border border-gray-300 rounded-lg font-mono text-xs w-12"
                        placeholder="gi"
                      />
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    {isValid ? (
                      <div className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Valid Pattern
                      </div>
                    ) : (
                      <div className="flex items-center text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Invalid Pattern
                      </div>
                    )}
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Test URLs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <label className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                <Globe className="h-5 w-5 mr-2 text-blue-500" />
                Test Domains
              </label>
              
              <textarea
                value={testUrls}
                onChange={(e) => setTestUrls(e.target.value)}
                placeholder="Enter domains to test (one per line)&#10;google.com&#10;ads.example.com&#10;tracker.malware.com"
                className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl font-mono text-sm resize-none focus:border-blue-500 focus:outline-none focus:ring-0"
              />
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowMatches(!showMatches)}
                    className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {showMatches ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
                    {showMatches ? 'Hide' : 'Show'} Match Details
                  </button>
                  
                  <button
                    onClick={exportResults}
                    className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    disabled={results.length === 0}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export Results
                  </button>
                </div>
                
                <div className="text-sm text-gray-500">
                  {results.length} domains tested
                </div>
              </div>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Play className="h-5 w-5 mr-2 text-blue-500" />
                    Test Results
                  </h3>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-red-600">
                      <X className="h-4 w-4 mr-1" />
                      {blockedCount} Blocked
                    </div>
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4 mr-1" />
                      {allowedCount} Allowed
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-xl border transition-colors ${
                        result.blocked
                          ? 'bg-red-50 border-red-200'
                          : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {result.blocked ? (
                            <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                          ) : (
                            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          )}
                          <span className={`font-mono text-sm ${
                            result.blocked ? 'text-red-700' : 'text-green-700'
                          }`}>
                            {result.url}
                          </span>
                        </div>
                        
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          result.blocked
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {result.blocked ? 'BLOCKED' : 'ALLOWED'}
                        </span>
                      </div>
                      
                      {showMatches && result.matchDetails.length > 0 && (
                        <div className="mt-2 pl-7">
                          <div className="text-xs text-gray-600 mb-1">Matches:</div>
                          {result.matchDetails.map((match, i) => (
                            <code key={i} className="text-xs bg-white px-2 py-1 rounded mr-2 border">
                              {match}
                            </code>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            {results.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Domains</span>
                    <span className="font-semibold">{results.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Blocked</span>
                    <span className="font-semibold text-red-600">{blockedCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Allowed</span>
                    <span className="font-semibold text-green-600">{allowedCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Block Rate</span>
                    <span className="font-semibold">
                      {results.length > 0 ? Math.round((blockedCount / results.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Common Patterns */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-blue-500" />
                Common Patterns
              </h3>
              <div className="space-y-3">
                {commonPatterns.map((pattern, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">{pattern.name}</h4>
                        <p className="text-xs text-gray-600 mb-2">{pattern.description}</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono block truncate">
                          {pattern.pattern}
                        </code>
                      </div>
                    </div>
                    <button
                      onClick={() => handlePatternSelect(pattern.pattern)}
                      className="mt-2 w-full text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Use This Pattern
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                <Info className="h-5 w-5 mr-2" />
                About Pi-hole Regex
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>Pi-hole uses regex patterns to block domains. Blocked domains return a null response.</p>
                <p><strong>Tips:</strong></p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Use ^ for start of string</li>
                  <li>Use $ for end of string</li>
                  <li>Escape dots with \.</li>
                  <li>Use .* for wildcards</li>
                  <li>Test thoroughly before deploying</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-2">
            <p className="text-gray-600">
              🛡️ Pi-hole Regex Playground - Test DNS blocking patterns safely in your browser
            </p>
            <p className="text-sm text-gray-500">
              No data is sent to servers. All processing happens locally for your privacy and security.
            </p>
            <div className="flex justify-center space-x-4 text-xs text-gray-400 mt-4">
              <span>• Regex Testing</span>
              <span>• Pattern Validation</span>
              <span>• DNS Blocking</span>
              <span>• Privacy-First</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PiholeRegexPlayground;