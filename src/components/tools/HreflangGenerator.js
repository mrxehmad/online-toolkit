import React, { useState, useCallback } from 'react';
import { Globe, Plus, Trash2, Copy, Check, Download, Info, Search } from 'lucide-react';

const HreflangGenerator = () => {
  const [urls, setUrls] = useState([
    { url: '', language: '', country: '' }
  ]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  // Common language-country combinations
  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'nl', name: 'Dutch' },
    { code: 'sv', name: 'Swedish' },
    { code: 'da', name: 'Danish' },
    { code: 'no', name: 'Norwegian' },
    { code: 'fi', name: 'Finnish' },
    { code: 'pl', name: 'Polish' },
    { code: 'tr', name: 'Turkish' },
    { code: 'th', name: 'Thai' }
  ];

  const countryOptions = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'RU', name: 'Russia' },
    { code: 'JP', name: 'Japan' },
    { code: 'KR', name: 'South Korea' },
    { code: 'CN', name: 'China' },
    { code: 'IN', name: 'India' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'SE', name: 'Sweden' },
    { code: 'DK', name: 'Denmark' },
    { code: 'NO', name: 'Norway' },
    { code: 'FI', name: 'Finland' },
    { code: 'PL', name: 'Poland' },
    { code: 'TR', name: 'Turkey' },
    { code: 'TH', name: 'Thailand' }
  ];

  const addUrl = useCallback(() => {
    setUrls(prev => [...prev, { url: '', language: '', country: '' }]);
  }, []);

  const removeUrl = useCallback((index) => {
    if (urls.length > 1) {
      setUrls(prev => prev.filter((_, i) => i !== index));
    }
  }, [urls.length]);

  const updateUrl = useCallback((index, field, value) => {
    setUrls(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  }, []);

  const generateHreflang = useCallback((url, language, country) => {
    if (!url || !language) return '';
    
    const hreflangValue = country ? `${language}-${country}` : language;
    return `<link rel="alternate" hreflang="${hreflangValue}" href="${url}" />`;
  }, []);

  const generateAllTags = useCallback(() => {
    return urls
      .filter(item => item.url && item.language)
      .map(item => generateHreflang(item.url, item.language, item.country))
      .join('\n');
  }, [urls, generateHreflang]);

  const copyToClipboard = async (text, index = null) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text');
    }
  };

  const downloadTags = () => {
    const tags = generateAllTags();
    if (!tags) return;
    
    const blob = new Blob([tags], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hreflang-tags.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const allTags = generateAllTags();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-blue-500 p-3 rounded-2xl shadow-lg">
                <Globe className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Hreflang Tag Generator
            </h1>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Generate SEO-optimized hreflang tags for international websites. Improve your multilingual SEO and help search engines understand your content's language and regional targeting.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>Multilingual SEO</span>
              </div>
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                <span>Search Engine Optimization</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                <span>International Targeting</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Info Panel */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">What are Hreflang Tags?</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Hreflang tags tell search engines which language and country you're targeting with specific content. They help prevent duplicate content issues and ensure users find the right version of your site.
              </p>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-700 transition-colors"
              >
                {showInfo ? 'Show Less' : 'Learn More'}
              </button>
              {showInfo && (
                <div className="mt-3 pt-3 border-t border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Best Practices:</h4>
                  <ul className="text-sm text-blue-800 space-y-1 ml-4">
                    <li>• Include all language/region variations of your content</li>
                    <li>• Always include a self-referencing hreflang tag</li>
                    <li>• Use ISO 639-1 language codes and ISO 3166-1 Alpha 2 country codes</li>
                    <li>• Place tags in the &lt;head&gt; section of your HTML</li>
                    <li>• Ensure bidirectional linking between all versions</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* URL Input Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add Your URLs</h2>
            <button
              onClick={addUrl}
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add URL
            </button>
          </div>

          <div className="space-y-4">
            {urls.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL *
                    </label>
                    <input
                      type="url"
                      value={item.url}
                      onChange={(e) => updateUrl(index, 'url', e.target.value)}
                      placeholder="https://example.com/page"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language *
                    </label>
                    <select
                      value={item.language}
                      onChange={(e) => updateUrl(index, 'language', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select Language</option>
                      {languageOptions.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name} ({lang.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country (Optional)
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={item.country}
                        onChange={(e) => updateUrl(index, 'country', e.target.value)}
                        className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      >
                        <option value="">No Country</option>
                        {countryOptions.map(country => (
                          <option key={country.code} value={country.code}>
                            {country.name} ({country.code})
                          </option>
                        ))}
                      </select>
                      
                      {urls.length > 1 && (
                        <button
                          onClick={() => removeUrl(index)}
                          className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Preview for individual URL */}
                {item.url && item.language && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <code className="text-sm bg-white px-3 py-2 rounded border text-gray-700 flex-1 mr-3">
                        {generateHreflang(item.url, item.language, item.country)}
                      </code>
                      <button
                        onClick={() => copyToClipboard(generateHreflang(item.url, item.language, item.country), index)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        {copiedIndex === index ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Generated Tags Section */}
        {allTags && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Generated Hreflang Tags</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => copyToClipboard(allTags, 'all')}
                  className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm"
                >
                  {copiedIndex === 'all' ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  Copy All
                </button>
                <button
                  onClick={downloadTags}
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                {allTags}
              </pre>
            </div>
            
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Implementation:</strong> Copy these tags and paste them in the &lt;head&gt; section of your HTML document. Make sure each page includes hreflang tags for all language/region variations.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* SEO Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              About Hreflang Tags for SEO
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Hreflang tags are essential HTML attributes that help search engines understand the language and geographical targeting of your web pages. They're crucial for international SEO, preventing duplicate content issues, and ensuring users find the most relevant version of your content based on their language and location preferences.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">SEO Benefits</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Improved international rankings</li>
                  <li>• Reduced duplicate content penalties</li>
                  <li>• Better user experience</li>
                  <li>• Increased organic traffic</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Technical Features</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• ISO standard language codes</li>
                  <li>• Country-specific targeting</li>
                  <li>• Automatic tag generation</li>
                  <li>• Copy & download functionality</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Use Cases</h4>
                <ul className="text-gray-600 space-y-2">
                  <li>• Multilingual websites</li>
                  <li>• International e-commerce</li>
                  <li>• Regional content targeting</li>
                  <li>• Global brand websites</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HreflangGenerator;