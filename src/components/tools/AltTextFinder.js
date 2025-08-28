import React, { useState, useCallback } from 'react';
import { Search, Image, AlertTriangle, CheckCircle, Info, Copy, Download, Upload } from 'lucide-react';

const AltTextFinder = () => {
  const [htmlInput, setHtmlInput] = useState('');
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const analyzeHTML = useCallback(() => {
    if (!htmlInput.trim()) {
      setResults(null);
      return;
    }

    try {
      // Create a temporary div to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlInput;
      
      // Find all img tags
      const imgTags = Array.from(tempDiv.querySelectorAll('img'));
      
      const analyzed = imgTags.map((img, index) => {
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt');
        const hasAlt = alt !== null;
        const altText = alt || '';
        const isEmpty = hasAlt && altText.trim() === '';
        const outerHTML = img.outerHTML;
        
        // SEO Analysis
        const seoScore = calculateSEOScore(altText, src);
        const suggestions = generateSuggestions(altText, src, hasAlt, isEmpty);
        
        return {
          index: index + 1,
          src,
          alt: altText,
          hasAlt,
          isEmpty,
          outerHTML,
          seoScore,
          suggestions
        };
      });

      const stats = {
        total: analyzed.length,
        withAlt: analyzed.filter(img => img.hasAlt && !img.isEmpty).length,
        withoutAlt: analyzed.filter(img => !img.hasAlt).length,
        emptyAlt: analyzed.filter(img => img.isEmpty).length,
        goodSEO: analyzed.filter(img => img.seoScore >= 80).length
      };

      setResults({ images: analyzed, stats });
    } catch (error) {
      console.error('Error parsing HTML:', error);
      setResults({ images: [], stats: { total: 0, withAlt: 0, withoutAlt: 0, emptyAlt: 0, goodSEO: 0 }, error: 'Invalid HTML format' });
    }
  }, [htmlInput]);

  const calculateSEOScore = (altText, src) => {
    let score = 0;
    
    if (!altText) return 0;
    
    const text = altText.trim();
    if (text.length === 0) return 10;
    
    // Length optimization (125 chars recommended)
    if (text.length >= 10 && text.length <= 125) score += 30;
    else if (text.length > 5) score += 20;
    
    // Descriptiveness
    const words = text.split(/\s+/).length;
    if (words >= 3) score += 25;
    else if (words >= 2) score += 15;
    
    // Avoid generic terms
    const genericTerms = ['image', 'picture', 'photo', 'img', 'graphic'];
    const hasGeneric = genericTerms.some(term => text.toLowerCase().includes(term));
    if (!hasGeneric) score += 20;
    
    // Context relevance (basic filename matching)
    const filename = src.split('/').pop()?.split('.')[0] || '';
    if (filename && text.toLowerCase().includes(filename.toLowerCase())) {
      score += 15;
    }
    
    // Punctuation (should not end with period for screen readers)
    if (!text.endsWith('.')) score += 10;
    
    return Math.min(score, 100);
  };

  const generateSuggestions = (altText, src, hasAlt, isEmpty) => {
    const suggestions = [];
    
    if (!hasAlt) {
      suggestions.push({
        type: 'error',
        message: 'Add an alt attribute to improve accessibility and SEO'
      });
    } else if (isEmpty) {
      suggestions.push({
        type: 'warning',
        message: 'Alt text is empty. Add descriptive text or use alt="" only for decorative images'
      });
    } else {
      const text = altText.trim();
      
      if (text.length < 10) {
        suggestions.push({
          type: 'warning',
          message: 'Alt text is too short. Aim for 10-125 characters for better SEO'
        });
      }
      
      if (text.length > 125) {
        suggestions.push({
          type: 'warning',
          message: 'Alt text is too long. Keep it under 125 characters for optimal SEO'
        });
      }
      
      const genericTerms = ['image', 'picture', 'photo', 'img', 'graphic'];
      if (genericTerms.some(term => text.toLowerCase().includes(term))) {
        suggestions.push({
          type: 'info',
          message: 'Avoid generic terms like "image" or "picture". Be more specific'
        });
      }
      
      if (text.endsWith('.')) {
        suggestions.push({
          type: 'info',
          message: 'Remove ending period - screen readers add pauses automatically'
        });
      }
      
      const words = text.split(/\s+/).length;
      if (words < 3) {
        suggestions.push({
          type: 'info',
          message: 'Consider adding more descriptive words for better context'
        });
      }
    }
    
    return suggestions;
  };

  const getFilteredImages = () => {
    if (!results) return [];
    
    switch (activeTab) {
      case 'missing':
        return results.images.filter(img => !img.hasAlt);
      case 'empty':
        return results.images.filter(img => img.isEmpty);
      case 'good':
        return results.images.filter(img => img.hasAlt && !img.isEmpty);
      default:
        return results.images;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const exportResults = () => {
    if (!results) return;
    
    const exportData = {
      analysis_date: new Date().toISOString(),
      stats: results.stats,
      images: results.images.map(img => ({
        index: img.index,
        src: img.src,
        alt: img.alt,
        hasAlt: img.hasAlt,
        seoScore: img.seoScore,
        suggestions: img.suggestions.map(s => s.message)
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alt-text-analysis.json';
    a.click();
  };

  const getSEOScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSEOScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-sm">
              <Image className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Alt Text Finder</h1>
              <p className="text-gray-600">Analyze HTML for image accessibility & SEO</p>
            </div>
          </div>
          
          {/* Input Section */}
          <div className="space-y-4">
            <div className="relative">
              <textarea
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="Use ctrl + u copy and paste your HTML code here..."
                className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <div className="absolute top-3 right-3">
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <button
              onClick={analyzeHTML}
              disabled={!htmlInput.trim()}
              className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium py-3 px-8 rounded-xl transition-colors flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Analyze Images</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          {results.error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700">{results.error}</span>
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-gray-900">{results.stats.total}</div>
                  <div className="text-sm text-gray-600">Total Images</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-green-600">{results.stats.withAlt}</div>
                  <div className="text-sm text-gray-600">With Alt Text</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-red-600">{results.stats.withoutAlt}</div>
                  <div className="text-sm text-gray-600">Missing Alt</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-yellow-600">{results.stats.emptyAlt}</div>
                  <div className="text-sm text-gray-600">Empty Alt</div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">{results.stats.goodSEO}</div>
                  <div className="text-sm text-gray-600">SEO Ready</div>
                </div>
              </div>

              {/* Export Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={exportResults}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Results</span>
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="bg-white rounded-xl border border-gray-200 mb-6 overflow-hidden">
                <div className="flex overflow-x-auto">
                  {[
                    { key: 'all', label: 'All Images', count: results.stats.total },
                    { key: 'missing', label: 'Missing Alt', count: results.stats.withoutAlt },
                    { key: 'empty', label: 'Empty Alt', count: results.stats.emptyAlt },
                    { key: 'good', label: 'With Alt Text', count: results.stats.withAlt }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-1 min-w-0 py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab.key
                          ? 'border-blue-500 text-blue-600 bg-blue-50'
                          : 'border-transparent text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Results */}
              <div className="space-y-4">
                {getFilteredImages().map((img) => (
                  <div key={img.index} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                      {/* Image Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                              {img.index}
                            </span>
                            <div className="flex items-center space-x-2">
                              {img.hasAlt && !img.isEmpty ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                              )}
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getSEOScoreBg(img.seoScore)} ${getSEOScoreColor(img.seoScore)}`}>
                            SEO: {img.seoScore}%
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                            <div className="bg-gray-50 rounded-lg p-3 break-all text-sm text-gray-600">
                              {img.src || 'No source specified'}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                            <div className={`rounded-lg p-3 text-sm ${
                              img.hasAlt && !img.isEmpty 
                                ? 'bg-green-50 text-green-800' 
                                : 'bg-red-50 text-red-800'
                            }`}>
                              {img.hasAlt ? (img.isEmpty ? '(empty)' : img.alt) : '(missing)'}
                              {img.hasAlt && !img.isEmpty && (
                                <span className="ml-2 text-gray-500">({img.alt.length} chars)</span>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">HTML Code</label>
                            <div className="bg-gray-50 rounded-lg p-3 relative group">
                              <code className="text-sm text-gray-600 break-all">{img.outerHTML}</code>
                              <button
                                onClick={() => copyToClipboard(img.outerHTML)}
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white hover:bg-gray-100 p-2 rounded-lg transition-all shadow-sm"
                              >
                                <Copy className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                          </div>

                          {/* Suggestions */}
                          {img.suggestions.length > 0 && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">SEO Suggestions</label>
                              <div className="space-y-2">
                                {img.suggestions.map((suggestion, idx) => (
                                  <div 
                                    key={idx}
                                    className={`flex items-start space-x-2 p-3 rounded-lg text-sm ${
                                      suggestion.type === 'error' 
                                        ? 'bg-red-50 text-red-700'
                                        : suggestion.type === 'warning'
                                        ? 'bg-yellow-50 text-yellow-700' 
                                        : 'bg-blue-50 text-blue-700'
                                    }`}
                                  >
                                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>{suggestion.message}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {getFilteredImages().length === 0 && (
                  <div className="text-center py-12">
                    <Image className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No images found matching the current filter</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* SEO Info Footer */}
      <div className="max-w-4xl mx-auto px-4 py-8 mt-12">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Info className="w-5 h-5 mr-2" />
            SEO & Accessibility Tips
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• Keep alt text between 10-125 characters for optimal SEO performance</p>
            <p>• Describe the image content and context, not just what it is</p>
            <p>• Avoid generic terms like "image", "picture", or "photo"</p>
            <p>• Don't end with periods - screen readers add pauses automatically</p>
            <p>• Use empty alt="" only for purely decorative images</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AltTextFinder;