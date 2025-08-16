import React, { useState } from 'react';
import { FaDownload, FaYoutube, FaCopy, FaCheck, FaExclamationCircle, FaImage } from 'react-icons/fa';

const YouTubeThumbnailDownloader = () => {
  const [url, setUrl] = useState('');
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const extractVideoId = (url) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const generateThumbnails = (videoId) => {
    return [
      {
        quality: 'Max Resolution',
        url: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        size: '1280x720',
        description: 'Highest quality available'
      },
      {
        quality: 'Standard Definition',
        url: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
        size: '640x480',
        description: 'Standard quality'
      },
      {
        quality: 'High Quality',
        url: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        size: '480x360',
        description: 'High quality'
      },
      {
        quality: 'Medium Quality',
        url: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        size: '320x180',
        description: 'Medium quality'
      },
      {
        quality: 'Default',
        url: `https://img.youtube.com/vi/${videoId}/default.jpg`,
        size: '120x90',
        description: 'Default thumbnail'
      }
    ];
  };

  const handleSubmit = () => {
    setError('');
    setThumbnails([]);
    
    if (!url.trim()) {
      setError('Please enter a YouTube URL');
      return;
    }

    const videoId = extractVideoId(url.trim());
    if (!videoId) {
      setError('Invalid YouTube URL. Please enter a valid YouTube video URL.');
      return;
    }

    setLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      setThumbnails(generateThumbnails(videoId));
      setLoading(false);
    }, 1000);
  };

  const downloadThumbnail = async (thumbnailUrl, quality) => {
    try {
      const response = await fetch(thumbnailUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `youtube-thumbnail-${quality.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(''), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
              <FaYoutube className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">YouTube Thumbnail Downloader</h1>
              <p className="text-sm text-gray-500">Download high-quality thumbnails instantly</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Input Form */}
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-sm border border-gray-200/50 p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-3 pl-12 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all duration-200"
                />
                <FaYoutube className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
                <FaExclamationCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FaImage className="w-5 h-5" />
                  Get Thumbnails
                </>
              )}
            </button>
          </div>
        </div>

        {/* Thumbnails Grid */}
        {thumbnails.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {thumbnails.map((thumbnail, index) => (
              <div key={index} className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-sm border border-gray-200/50 overflow-hidden">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  <img
                    src={thumbnail.url}
                    alt={`${thumbnail.quality} thumbnail`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                      {thumbnail.size}
                    </span>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{thumbnail.quality}</h3>
                    <p className="text-sm text-gray-500">{thumbnail.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadThumbnail(thumbnail.url, thumbnail.quality)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <FaDownload className="w-4 h-4" />
                      Download
                    </button>
                    
                    <button
                      onClick={() => copyToClipboard(thumbnail.url, index)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2.5 rounded-lg transition-colors duration-200"
                      title="Copy URL"
                    >
                      {copied === index ? (
                        <FaCheck className="w-4 h-4 text-green-600" />
                      ) : (
                        <FaCopy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 bg-white/60 backdrop-blur-lg rounded-2xl shadow-sm border border-gray-200/50 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Choose Our YouTube Thumbnail Downloader?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaDownload className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Multiple Resolutions</h3>
              <p className="text-sm text-gray-600">Download thumbnails in various qualities from 120x90 to 1280x720 pixels</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaYoutube className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Access</h3>
              <p className="text-sm text-gray-600">Get thumbnails immediately without waiting or registration required</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FaImage className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">High Quality</h3>
              <p className="text-sm text-gray-600">Original quality thumbnails perfect for presentations and projects</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 bg-white/60 backdrop-blur-lg rounded-2xl shadow-sm border border-gray-200/50 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How do I use this YouTube thumbnail downloader?</h3>
              <p className="text-gray-600 text-sm">Simply paste any YouTube video URL into the input field and click "Get Thumbnails". You'll instantly see all available thumbnail sizes that you can download.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What thumbnail sizes are available?</h3>
              <p className="text-gray-600 text-sm">We provide thumbnails in 5 different resolutions: Max Resolution (1280x720), Standard Definition (640x480), High Quality (480x360), Medium Quality (320x180), and Default (120x90).</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is this tool free to use?</h3>
              <p className="text-gray-600 text-sm">Yes, this YouTube thumbnail downloader is completely free to use with no registration required. Download as many thumbnails as you need.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I use downloaded thumbnails commercially?</h3>
              <p className="text-gray-600 text-sm">Please respect YouTube's terms of service and copyright laws. Thumbnails may be subject to copyright restrictions, so use them responsibly.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubeThumbnailDownloader;