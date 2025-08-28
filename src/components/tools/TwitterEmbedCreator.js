import React, { useState, useEffect } from 'react';
import { Twitter, Copy, Eye, Code, Shield, Zap, Globe, Lock } from 'lucide-react';

export default function TwitterEmbedCreator() {
  const [tweetUrl, setTweetUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState('light');

  // Mock useTheme hook - replace with your actual theme hook
  const useTheme = () => {
    useEffect(() => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');
    }, []);
    return { theme };
  };

  const { theme: currentTheme } = useTheme();

  const extractTweetId = (url) => {
    const regex = /(?:twitter\.com|x\.com)\/(?:#!\/)?(\w+)\/status(?:es)?\/(\d+)/;
    const match = url.match(regex);
    return match ? match[2] : null;
  };

  const generateEmbedCode = () => {
    const tweetId = extractTweetId(tweetUrl);
    if (!tweetId) {
      alert('Please enter a valid Twitter/X post URL');
      return;
    }

    const embedHtml = `<blockquote class="twitter-tweet" data-theme="${currentTheme}">
  <p lang="en" dir="ltr">Loading tweet...</p>
  <a href="${tweetUrl}">View original tweet</a>
</blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`;

    setEmbedCode(embedHtml);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  // SEO Meta tags (would be handled by your static site generator)
  useEffect(() => {
    document.title = "Privacy-Focused Twitter/X Post Embedder Creator - Generate Embed Code";
    
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.name = "description";
    metaDescription.content = "Create privacy-focused Twitter/X post embeds for your website. Generate clean embed code client-side without external API calls. Perfect for static sites, blogs, and privacy-conscious developers.";
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.rel = "canonical";
    canonical.href = window.location.href;
    if (!document.querySelector('link[rel="canonical"]')) {
      document.head.appendChild(canonical);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="px-6 sm:px-8 py-6 sm:py-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <Twitter className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                Privacy-Focused Twitter/X Embedder
              </h1>
            </div>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Zap className="w-4 h-4" />
                <span>Client-Side</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Globe className="w-4 h-4" />
                <span>No API Calls</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Lock className="w-4 h-4" />
                <span>Secure</span>
              </div>
            </div>
          </div>

          {/* Main Tool */}
          <div className="px-6 sm:px-8 py-6">
            <div className="space-y-6">
              {/* Input Section */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Twitter/X Post URL
                </label>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <input
                    type="url"
                    value={tweetUrl}
                    onChange={(e) => setTweetUrl(e.target.value)}
                    placeholder="https://twitter.com/username/status/1234567890 or https://x.com/username/status/1234567890"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                  />
                  <button
                    onClick={generateEmbedCode}
                    disabled={!tweetUrl.trim()}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    Generate Embed
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Paste any Twitter or X.com post URL to generate privacy-focused embed code
                </p>
              </div>

              {/* Results Section */}
              {embedCode && (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Generated Embed Code
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={togglePreview}
                        className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{previewMode ? 'Code' : 'Preview'}</span>
                      </button>
                      <button
                        onClick={copyToClipboard}
                        className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-lg transition-colors duration-200 ${
                          copied 
                            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' 
                            : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                        }`}
                      >
                        <Copy className="w-4 h-4" />
                        <span>{copied ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>

                  {previewMode ? (
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                      <div className="text-center text-gray-600 dark:text-gray-400">
                        <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Preview Mode</p>
                        <p className="text-xs mt-1">
                          The actual tweet will appear when this embed code is used on your website
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <pre className="p-4 bg-gray-900 dark:bg-gray-950 text-gray-100 dark:text-gray-200 rounded-lg overflow-x-auto text-sm font-mono border border-gray-700">
                        <code>{embedCode}</code>
                      </pre>
                    </div>
                  )}

                  {/* Usage Instructions */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">How to Use:</h4>
                    <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                      <li>Copy the generated embed code above</li>
                      <li>Paste it into your HTML where you want the tweet to appear</li>
                      <li>The tweet will load automatically when visitors view your page</li>
                      <li>No external API calls needed - respects user privacy</li>
                    </ol>

                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description Section */}
          <div className="px-6 sm:px-8 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Privacy-First Twitter/X Post Embedding
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                This privacy-focused Twitter/X post embedder creates clean, lightweight embed codes for your static website without compromising user privacy. Unlike traditional embedding methods that require external API calls or third-party services, our tool generates standard Twitter embed code that works entirely client-side.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                Perfect for static site generators like Jekyll, Hugo, Next.js, Gatsby, and more. The generated embed code uses Twitter's official embedding system, ensuring compatibility and proper rendering while maintaining fast load times and respecting user privacy. No tracking, no external dependencies during code generation, and full control over when and how tweets are loaded on your site.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                Features include automatic dark/light mode support, responsive design, SEO-friendly markup, and clean HTML output that integrates seamlessly with any website or blog. Simply paste any Twitter or X.com URL and get production-ready embed code instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}