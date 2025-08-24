import React, { useState } from 'react';
import { 
  FaYoutube, 
  FaCopy, 
  FaCheck, 
  FaCode, 
  FaEye, 
  FaShieldAlt,
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaStar,
  FaDownload,
  FaPlay
} from 'react-icons/fa';

const YouTubeEmbedConverter = () => {
  const [url, setUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [noCookieEmbedCode, setNoCookieEmbedCode] = useState('');
  const [copied, setCopied] = useState('');
  const [videoId, setVideoId] = useState('');
  const [error, setError] = useState('');
  const [previewMode, setPreviewMode] = useState('cookie');
  
  // Extract video ID from various YouTube URL formats
  const extractVideoId = (url) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^&\n?#]+)/,
      /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:m\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const generateEmbedCode = (videoId, noCookie = false) => {
    const domain = noCookie ? 'youtube-nocookie.com' : 'youtube.com';
    return `<iframe 
  width="560" 
  height="315" 
  src="https://www.${domain}/embed/${videoId}" 
  title="YouTube video player" 
  frameborder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
  allowfullscreen>
</iframe>`;
  };

  const handleUrlChange = (e) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    setError('');
    
    if (!inputUrl.trim()) {
      setEmbedCode('');
      setNoCookieEmbedCode('');
      setVideoId('');
      return;
    }
    
    const id = extractVideoId(inputUrl);
    if (id) {
      setVideoId(id);
      setEmbedCode(generateEmbedCode(id, false));
      setNoCookieEmbedCode(generateEmbedCode(id, true));
    } else {
      setError('Invalid YouTube URL. Please enter a valid YouTube video URL.');
      setEmbedCode('');
      setNoCookieEmbedCode('');
      setVideoId('');
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const sampleUrls = [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://www.youtube.com/shorts/dQw4w9WgXcQ'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* SEO Meta Information */}
      <div className="sr-only">
        <h1>YouTube Embed Code Generator - Cookie & No-Cookie Versions</h1>
        <p>Free YouTube embed code generator that creates both regular and privacy-enhanced (no-cookie) embed codes. Supports all YouTube URL formats including shorts, mobile links, and direct video IDs. Perfect for websites, blogs, and developers who need GDPR-compliant YouTube embeds.</p>
        <meta name="description" content="Generate YouTube embed codes instantly - both regular and privacy-enhanced no-cookie versions. Supports all URL formats. Free, fast, and GDPR compliant. Perfect for websites and blogs." />
        <meta name="keywords" content="youtube embed generator, youtube no cookie embed, youtube privacy embed, embed code generator, youtube iframe, GDPR compliant youtube, youtube nocookie, embed youtube video" />
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 p-2 rounded-xl">
                <FaYoutube className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">YouTube Embed Generator</h1>
                <p className="text-sm text-gray-500">Cookie & No-Cookie Versions</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <FaShieldAlt className="text-green-500" />
              <span>Privacy-First</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Generate YouTube Embed Codes Instantly
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Convert any YouTube URL into embed-ready code with both regular and privacy-enhanced (no-cookie) versions. 
            Perfect for websites, blogs, and developers who prioritize user privacy and GDPR compliance.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <FaGlobe className="text-blue-500" />
              <span>All URL Formats</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaMobile className="text-green-500" />
              <span>Mobile Responsive</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaShieldAlt className="text-purple-500" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <FaStar className="text-yellow-500" />
              <span>100% Free</span>
            </div>
          </div>
        </section>

        {/* Main Converter */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
            <h3 className="text-2xl font-bold text-white mb-2">Convert YouTube URL</h3>
            <p className="text-red-100">Paste your YouTube URL below and get instant embed codes</p>
          </div>
          
          <div className="p-6">
            {/* URL Input */}
            <div className="mb-6">
              <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-700 mb-3">
                YouTube URL or Video ID
              </label>
              <div className="relative">
                <input
                  id="youtube-url"
                  type="text"
                  value={url}
                  onChange={handleUrlChange}
                  placeholder="https://www.youtube.com/watch?v=... or video ID"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg transition-all duration-200"
                />
                <FaYoutube className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600 flex items-center space-x-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </p>
              )}
            </div>

            {/* Sample URLs */}
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-700 mb-3">Try these sample URLs:</p>
              <div className="flex flex-wrap gap-2">
                {sampleUrls.map((sampleUrl, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setUrl(sampleUrl);
                      handleUrlChange({ target: { value: sampleUrl } });
                    }}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-600 transition-colors duration-200"
                  >
                    {sampleUrl.includes('youtu.be') ? 'Short URL' : 
                     sampleUrl.includes('shorts') ? 'YouTube Short' : 'Standard URL'}
                  </button>
                ))}
              </div>
            </div>

            {/* Results */}
            {videoId && (
              <div className="space-y-8">
                {/* Preview Toggle */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <button
                    onClick={() => setPreviewMode('cookie')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      previewMode === 'cookie'
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaEye className="inline mr-2" />
                    Regular Preview
                  </button>
                  <button
                    onClick={() => setPreviewMode('nocookie')}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      previewMode === 'nocookie'
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaShieldAlt className="inline mr-2" />
                    No-Cookie Preview
                  </button>
                </div>

                {/* Video Preview */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <FaPlay className="mr-2 text-red-500" />
                    Video Preview ({previewMode === 'cookie' ? 'Regular' : 'Privacy-Enhanced'})
                  </h4>
                  <div className="relative w-full max-w-2xl mx-auto">
                    <div className="relative w-full pb-[56.25%] h-0 overflow-hidden rounded-lg shadow-lg">
                      <iframe
                        src={`https://www.youtube${previewMode === 'nocookie' ? '-nocookie' : ''}.com/embed/${videoId}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Regular Embed Code */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <FaCode className="mr-2 text-blue-500" />
                      Standard YouTube Embed
                    </h4>
                    <button
                      onClick={() => copyToClipboard(embedCode, 'regular')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        copied === 'regular'
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {copied === 'regular' ? <FaCheck /> : <FaCopy />}
                      <span>{copied === 'regular' ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="bg-white p-4 rounded-lg border text-sm overflow-x-auto">
                    <code>{embedCode}</code>
                  </pre>
                  <p className="text-sm text-gray-600 mt-2">
                    Standard embed that may set cookies and track users for personalization.
                  </p>
                </div>

                {/* No-Cookie Embed Code */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800 flex items-center">
                      <FaShieldAlt className="mr-2 text-green-500" />
                      Privacy-Enhanced Embed (No Cookies)
                    </h4>
                    <button
                      onClick={() => copyToClipboard(noCookieEmbedCode, 'nocookie')}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        copied === 'nocookie'
                          ? 'bg-green-500 text-white'
                          : 'bg-green-500 hover:bg-green-600 text-white'
                      }`}
                    >
                      {copied === 'nocookie' ? <FaCheck /> : <FaCopy />}
                      <span>{copied === 'nocookie' ? 'Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                  <pre className="bg-white p-4 rounded-lg border text-sm overflow-x-auto">
                    <code>{noCookieEmbedCode}</code>
                  </pre>
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Recommended:</strong> GDPR-compliant embed that doesn't set cookies until user interacts with the video.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <section className="mb-12">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our YouTube Embed Generator?
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <FaGlobe className="text-blue-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Universal URL Support</h4>
              <p className="text-gray-600 text-sm">
                Supports all YouTube URL formats including watch URLs, short URLs (youtu.be), 
                YouTube Shorts, mobile URLs, and direct video IDs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="bg-green-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <FaShieldAlt className="text-green-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Privacy-Enhanced Embeds</h4>
              <p className="text-gray-600 text-sm">
                Generate GDPR-compliant no-cookie embeds using youtube-nocookie.com 
                that respect user privacy and comply with data protection regulations.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="bg-purple-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <FaDesktop className="text-purple-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Fully Responsive</h4>
              <p className="text-gray-600 text-sm">
                Works perfectly on all devices - desktop, tablet, and mobile. 
                All processing happens in your browser for maximum speed and privacy.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="bg-red-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <FaCode className="text-red-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Clean HTML Code</h4>
              <p className="text-gray-600 text-sm">
                Generates clean, optimized HTML embed code with proper attributes 
                for accessibility and SEO optimization.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="bg-yellow-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <FaStar className="text-yellow-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">100% Free Forever</h4>
              <p className="text-gray-600 text-sm">
                No registration, no limits, no watermarks. Completely free tool 
                for developers, content creators, and website owners.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <div className="bg-indigo-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <FaDownload className="text-indigo-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Instant Results</h4>
              <p className="text-gray-600 text-sm">
                No server processing required. Everything happens instantly in your browser 
                with live preview and one-click copying.
              </p>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Complete Guide to YouTube Embed Codes
          </h3>
          
          <div className="prose max-w-none text-gray-700">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">What is a YouTube Embed Code?</h4>
            <p className="mb-6">
              A YouTube embed code is an HTML iframe element that allows you to display YouTube videos 
              directly on your website or blog. Instead of redirecting users to YouTube, the video 
              plays within your webpage, providing a seamless viewing experience while keeping 
              visitors on your site.
            </p>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">Regular vs No-Cookie YouTube Embeds</h4>
            <p className="mb-4">
              <strong>Regular YouTube Embeds (youtube.com/embed):</strong> These embeds may set 
              cookies and track user behavior for personalization and advertising purposes. They 
              provide full YouTube functionality but may impact user privacy.
            </p>
            <p className="mb-6">
              <strong>Privacy-Enhanced Embeds (youtube-nocookie.com/embed):</strong> These embeds 
              use YouTube's privacy-enhanced mode, which doesn't set cookies or track users until 
              they actually interact with the video. This makes them GDPR-compliant and 
              privacy-friendly while maintaining full video functionality.
            </p>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">Supported YouTube URL Formats</h4>
            <ul className="mb-6 space-y-2">
              <li>• Standard watch URLs: https://www.youtube.com/watch?v=VIDEO_ID</li>
              <li>• Short URLs: https://youtu.be/VIDEO_ID</li>
              <li>• Mobile URLs: https://m.youtube.com/watch?v=VIDEO_ID</li>
              <li>• YouTube Shorts: https://www.youtube.com/shorts/VIDEO_ID</li>
              <li>• Embed URLs: https://www.youtube.com/embed/VIDEO_ID</li>
              <li>• Direct Video IDs: Just paste the 11-character video ID</li>
            </ul>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">Benefits for Website Owners</h4>
            <ul className="mb-6 space-y-2">
              <li>• <strong>Improved User Experience:</strong> Videos play without leaving your site</li>
              <li>• <strong>Better SEO:</strong> Reduces bounce rate and increases time on page</li>
              <li>• <strong>Privacy Compliance:</strong> No-cookie embeds help with GDPR compliance</li>
              <li>• <strong>Professional Appearance:</strong> Clean integration with your website design</li>
              <li>• <strong>Mobile Responsive:</strong> Automatically adapts to all screen sizes</li>
            </ul>

            <h4 className="text-xl font-semibold text-gray-900 mb-3">How to Use This Tool</h4>
            <ol className="mb-6 space-y-2">
              <li>1. Copy any YouTube video URL from your browser</li>
              <li>2. Paste it into the input field above</li>
              <li>3. Choose between regular or no-cookie embed versions</li>
              <li>4. Preview the video to ensure it works correctly</li>
              <li>5. Copy the generated HTML code</li>
              <li>6. Paste it into your website's HTML where you want the video to appear</li>
            </ol>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-red-500 p-2 rounded-xl">
                <FaYoutube className="text-white text-xl" />
              </div>
              <h3 className="text-xl font-bold">YouTube Embed Generator</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Free, fast, and privacy-focused YouTube embed code generator. 
              Convert any YouTube URL into embed-ready HTML with both regular and 
              GDPR-compliant no-cookie versions.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <FaShieldAlt />
                <span>Privacy First</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaStar />
                <span>100% Free</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaGlobe />
                <span>All Devices</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCode />
                <span>Clean Code</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default YouTubeEmbedConverter;