import React, { useState, useEffect } from 'react';
import { Link, Copy, Check, Globe, Search, Tag, Shield, Smartphone, Monitor, Tablet } from 'lucide-react';

const CanonicalTagGenerator = () => {
  const [url, setUrl] = useState('');
  const [canonicalTag, setCanonicalTag] = useState('');
  const [copied, setCopied] = useState(false);
  const [urlError, setUrlError] = useState('');

  // Validate URL function
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Generate canonical tag
  const generateCanonicalTag = (inputUrl) => {
    if (!inputUrl.trim()) {
      setCanonicalTag('');
      setUrlError('');
      return;
    }

    // Add https:// if no protocol specified
    let processedUrl = inputUrl.trim();
    if (!processedUrl.match(/^https?:\/\//i)) {
      processedUrl = 'https://' + processedUrl;
    }

    if (isValidUrl(processedUrl)) {
      const cleanUrl = new URL(processedUrl);
      // Remove trailing slash for consistency (except root domain)
      const finalUrl = cleanUrl.pathname === '/' ? 
        cleanUrl.origin : 
        cleanUrl.href.replace(/\/$/, '');
      
      setCanonicalTag(`<link rel="canonical" href="${finalUrl}" />`);
      setUrlError('');
    } else {
      setUrlError('Please enter a valid URL');
      setCanonicalTag('');
    }
  };

  // Handle URL input change
  useEffect(() => {
    generateCanonicalTag(url);
  }, [url]);

  // Copy to clipboard
  const copyToClipboard = async () => {
    if (canonicalTag) {
      try {
        await navigator.clipboard.writeText(canonicalTag);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    }
  };

  // Clear form
  const clearForm = () => {
    setUrl('');
    setCanonicalTag('');
    setUrlError('');
    setCopied(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-xl shadow-lg">
              <Link className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Canonical Tag Generator
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Description Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-start space-x-4 mb-6">
            <div className="p-3 bg-green-100 rounded-xl">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                SEO Canonical Tag Generator
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Generate clean, SEO-optimized canonical tags to prevent duplicate content issues and improve your website's search engine rankings. 
                Canonical tags help search engines understand which version of a page is the primary one when you have similar or duplicate content.
              </p>
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-800">Prevent Duplicate Content</h3>
                <p className="text-sm text-gray-600 mt-1">Avoid SEO penalties from duplicate content across multiple URLs</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Globe className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-800">Improve Rankings</h3>
                <p className="text-sm text-gray-600 mt-1">Help search engines index the correct version of your pages</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Tag className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-800">Clean HTML</h3>
                <p className="text-sm text-gray-600 mt-1">Generate properly formatted canonical tags ready for implementation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Generator Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
              <Tag className="w-5 h-5" />
              <span>Generate Your Canonical Tag</span>
            </h2>
          </div>

          <div className="p-8 space-y-6">
            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className={`w-full px-4 py-3 pr-12 border-2 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    urlError ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <Globe className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {urlError && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                  <span className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center text-xs">!</span>
                  <span>{urlError}</span>
                </p>
              )}
            </div>

            {/* Generated Tag Display */}
            {canonicalTag && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Generated Canonical Tag
                </label>
                <div className="relative">
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4 font-mono text-sm text-gray-800 break-all">
                    {canonicalTag}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className={`absolute top-3 right-3 p-2 rounded-lg transition-all duration-200 ${
                      copied 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                    title={copied ? 'Copied!' : 'Copy to clipboard'}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copied && (
                  <p className="text-sm text-green-600 flex items-center space-x-1">
                    <Check className="w-4 h-4" />
                    <span>Copied to clipboard!</span>
                  </p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={copyToClipboard}
                disabled={!canonicalTag}
                className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-6 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Tag</span>
              </button>
              <button
                onClick={clearForm}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 rounded-xl font-medium transition-all duration-200"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center space-x-2">
            <Tag className="w-5 h-5 text-blue-500" />
            <span>How to Use Canonical Tags</span>
          </h2>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gray-800 mb-3">1. Implementation</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                  Add the generated canonical tag in the <code className="bg-gray-100 px-2 py-1 rounded text-xs">&lt;head&gt;</code> section of your HTML document.
                </p>
                <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-700 border">
                  &lt;head&gt;<br/>
                  &nbsp;&nbsp;...<br/>
                  &nbsp;&nbsp;&lt;link rel="canonical" href="..." /&gt;<br/>
                  &lt;/head&gt;
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-800 mb-3">2. Best Practices</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Use absolute URLs instead of relative ones</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Ensure the canonical URL is accessible and returns 200 status</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Only use one canonical tag per page</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Point to the most authoritative version of the content</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h4 className="font-medium text-blue-900 mb-2">💡 Pro Tip</h4>
              <p className="text-blue-800 text-sm">
                Use canonical tags when you have similar content accessible via multiple URLs (e.g., with tracking parameters, 
                mobile versions, or pagination). This helps consolidate SEO authority to your preferred URL.
              </p>
            </div>
          </div>
        </div>

        {/* Device Compatibility */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Device Compatibility
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <Smartphone className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-800">Mobile Optimized</h3>
              <p className="text-sm text-gray-600 mt-1">iOS & Android compatible</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <Tablet className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-800">Tablet Friendly</h3>
              <p className="text-sm text-gray-600 mt-1">Perfect for iPad & Android tablets</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <Monitor className="w-8 h-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-medium text-gray-800">Desktop Ready</h3>
              <p className="text-sm text-gray-600 mt-1">Full-featured PC experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            Generate SEO-friendly canonical tags instantly • Free canonical tag generator tool
          </p>
        </div>
      </footer>
    </div>
  );
};

export default CanonicalTagGenerator;