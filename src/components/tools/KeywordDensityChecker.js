import React, { useState, useEffect } from 'react';
import { Search, Globe, FileText, Copy, Download, AlertCircle, CheckCircle, TrendingUp, BarChart3, Zap } from 'lucide-react';

const KeywordDensityChecker = () => {
  const [inputMethod, setInputMethod] = useState('text');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');

  const extractTextFromHTML = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Remove script and style elements
    const scripts = doc.querySelectorAll('script, style, noscript');
    scripts.forEach(el => el.remove());
    
    return doc.body ? doc.body.textContent || doc.body.innerText || '' : '';
  };

  const analyzeKeywordDensity = (content, targetKw = '') => {
    if (!content.trim()) return null;

    // Clean and normalize text
    const cleanText = content.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const words = cleanText.split(' ').filter(word => word.length > 0);
    
    if (words.length === 0) return null;

    // Count word frequencies
    const wordCount = {};
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    // Calculate densities and sort
    const keywordData = Object.entries(wordCount)
      .filter(([word]) => word.length > 2) // Filter out very short words
      .map(([word, count]) => ({
        keyword: word,
        count,
        density: ((count / words.length) * 100).toFixed(2)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50); // Top 50 keywords

    // Analyze target keyword if provided
    let targetAnalysis = null;
    if (targetKw.trim()) {
      const targetLower = targetKw.toLowerCase().trim();
      const targetCount = wordCount[targetLower] || 0;
      const targetDensity = ((targetCount / words.length) * 100).toFixed(2);
      
      targetAnalysis = {
        keyword: targetKw,
        count: targetCount,
        density: targetDensity,
        recommendation: getRecommendation(parseFloat(targetDensity)),
        status: getStatus(parseFloat(targetDensity))
      };
    }

    return {
      totalWords: words.length,
      uniqueWords: Object.keys(wordCount).length,
      keywordData,
      targetAnalysis,
      textLength: content.length
    };
  };

  const getRecommendation = (density) => {
    if (density === 0) return "Keyword not found. Consider adding it to your content.";
    if (density < 0.5) return "Density is too low. Try to include the keyword more naturally.";
    if (density <= 2.5) return "Good keyword density! Your content is well optimized.";
    if (density <= 4) return "Density is getting high. Consider reducing keyword usage.";
    return "Density is too high! Risk of keyword stuffing. Reduce usage immediately.";
  };

  const getStatus = (density) => {
    if (density === 0) return "missing";
    if (density < 0.5) return "low";
    if (density <= 2.5) return "good";
    if (density <= 4) return "high";
    return "critical";
  };

  const fetchUrlContent = async (urlToFetch) => {
    try {
      // Since we can't directly fetch from URLs due to CORS, we'll simulate this
      // In a real application, you'd need a backend proxy or use a CORS proxy service
      throw new Error("Direct URL fetching is not available in this demo. Please copy and paste the content instead.");
    } catch (err) {
      throw new Error("Unable to fetch URL content. Please copy and paste the text instead.");
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      let content = '';
      
      if (inputMethod === 'url') {
        if (!url.trim()) {
          throw new Error('Please enter a valid URL');
        }
        content = await fetchUrlContent(url);
      } else {
        if (!text.trim()) {
          throw new Error('Please enter some text to analyze');
        }
        content = text;
      }

      const analysis = analyzeKeywordDensity(content, targetKeyword);
      if (!analysis) {
        throw new Error('No analyzable content found');
      }
      
      setResults(analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    if (!results) return;
    
    const exportData = {
      analysis_date: new Date().toISOString(),
      total_words: results.totalWords,
      unique_words: results.uniqueWords,
      text_length: results.textLength,
      target_keyword: results.targetAnalysis,
      top_keywords: results.keywordData.slice(0, 20)
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-density-analysis.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'good': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'high': case 'critical': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'low': return <TrendingUp className="w-5 h-5 text-orange-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2 rounded-xl">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Keyword Density Checker</h1>
              <p className="text-sm text-gray-500">Analyze and optimize your content for better SEO</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* SEO Description */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Free SEO Keyword Density Analyzer</h2>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Optimize your content for search engines with our advanced keyword density checker. Analyze text or web pages to find the perfect keyword balance, avoid keyword stuffing, and improve your SEO rankings. Get detailed insights into keyword frequency, density percentages, and actionable recommendations.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">SEO Analysis</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Keyword Research</span>
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">Content Optimization</span>
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">Free Tool</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Input Method</h3>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setInputMethod('text')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                  inputMethod === 'text' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Paste Text</span>
              </button>
              <button
                onClick={() => setInputMethod('url')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium text-sm transition-all ${
                  inputMethod === 'url' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>From URL</span>
              </button>
            </div>
          </div>

          {/* Target Keyword Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Keyword (Optional)
            </label>
            <input
              type="text"
              value={targetKeyword}
              onChange={(e) => setTargetKeyword(e.target.value)}
              placeholder="Enter your target keyword..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Specify a keyword to get detailed density analysis and recommendations</p>
          </div>

          {/* Input Fields */}
          {inputMethod === 'url' ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Note: Due to browser security restrictions, URL fetching may not work. Use text input instead.</p>
            </div>
          ) : (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content Text
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your content here for keyword density analysis..."
                rows={8}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-500">Characters: {text.length}</p>
                <button
                  onClick={() => navigator.clipboard?.readText().then(setText).catch(() => {})}
                  className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>Paste from clipboard</span>
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white py-3 px-6 rounded-xl font-medium transition-all flex items-center justify-center space-x-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>{loading ? 'Analyzing...' : 'Analyze Keyword Density'}</span>
          </button>
        </div>

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            {/* Overview Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Content Overview</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-gray-900">{results.totalWords.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Words</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-blue-600">{results.uniqueWords.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Unique Words</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-green-600">{results.textLength.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Characters</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-2xl font-bold text-purple-600">{results.keywordData.length}</div>
                  <div className="text-sm text-gray-600">Keywords Found</div>
                </div>
              </div>
            </div>

            {/* Target Keyword Analysis */}
            {results.targetAnalysis && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Keyword Analysis</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-medium text-gray-900">"{results.targetAnalysis.keyword}"</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <StatusIcon status={results.targetAnalysis.status} />
                        <span className="text-sm text-gray-600">
                          {results.targetAnalysis.count} occurrences ({results.targetAnalysis.density}% density)
                        </span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      results.targetAnalysis.status === 'good' ? 'bg-green-100 text-green-700' :
                      results.targetAnalysis.status === 'low' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {results.targetAnalysis.status.toUpperCase()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{results.targetAnalysis.recommendation}</p>
                </div>
              </div>
            )}

            {/* Top Keywords */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Top Keywords</h3>
                <button
                  onClick={exportResults}
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Results</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Keyword</th>
                      <th className="text-center py-3 px-2 text-sm font-medium text-gray-700">Count</th>
                      <th className="text-center py-3 px-2 text-sm font-medium text-gray-700">Density</th>
                      <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">Visual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {results.keywordData.slice(0, 20).map((item, index) => (
                      <tr key={item.keyword} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                              #{index + 1}
                            </span>
                            <span className="font-medium text-gray-900">{item.keyword}</span>
                          </div>
                        </td>
                        <td className="text-center py-3 px-2 font-medium text-gray-900">{item.count}</td>
                        <td className="text-center py-3 px-2 font-medium text-blue-600">{item.density}%</td>
                        <td className="text-right py-3 px-2">
                          <div className="w-full bg-gray-100 rounded-full h-2 max-w-20 ml-auto">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(item.density * 10, 100)}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {results.keywordData.length > 20 && (
                <div className="text-center mt-4 text-sm text-gray-500">
                  Showing top 20 keywords of {results.keywordData.length} total
                </div>
              )}
            </div>

            {/* SEO Tips */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Optimization Tips</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Optimal keyword density is between 0.5% and 2.5% for most content</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Use keywords naturally in headings, first paragraph, and throughout content</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Include related keywords and synonyms to improve semantic relevance</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                  <span>Avoid keyword stuffing - focus on creating valuable, readable content</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeywordDensityChecker;