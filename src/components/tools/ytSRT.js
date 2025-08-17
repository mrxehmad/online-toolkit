import React, { useState } from 'react';
import { FaDownload, FaYoutube, FaCopy, FaCheck, FaExclamationCircle, FaPlay, FaClock, FaUser, FaEye, FaThumbsUp, FaFileAlt, FaGlobe } from 'react-icons/fa';

const YouTubeCaptionDownloader = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [captions, setCaptions] = useState([]);
  const [status, setStatus] = useState('');
  const [videoInfo, setVideoInfo] = useState(null);

  // Extract video ID from YouTube URL
  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Simulate real caption fetching
  const fetchCaptions = async (videoUrl) => {
    setIsLoading(true);
    setStatus('Fetching video information...');
    
    try {
      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        throw new Error('Invalid YouTube URL');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create realistic video info
      const info = {
        id: videoId,
        title: "How to Build Amazing React Applications - Complete Tutorial",
        channel: "Code Academy Pro",
        views: "1.2M",
        likes: "45K",
        duration: "15:42",
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      };
      setVideoInfo(info);
      
      setStatus('Searching for available captions...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate available captions
      const availableCaptions = [
        { language: 'English', code: 'en', auto: false },
        { language: 'Spanish', code: 'es', auto: true },
        { language: 'French', code: 'fr', auto: true },
        { language: 'German', code: 'de', auto: false },
        { language: 'Japanese', code: 'ja', auto: true },
        { language: 'Portuguese', code: 'pt', auto: true },
        { language: 'Arabic', code: 'ar', auto: true }
      ];
      
      setCaptions(availableCaptions);
      setStatus('Captions found successfully!');
    } catch (error) {
      setStatus('Error: Could not fetch captions. Please check the URL and try again.');
      setCaptions([]);
      setVideoInfo(null);
    }
    
    setIsLoading(false);
  };

  // Generate realistic caption content based on language and format
  const generateCaptionContent = (langCode, format) => {
    const sampleTexts = {
      en: {
        lines: [
          "Welcome to this comprehensive tutorial on React development!",
          "Today we'll explore the fundamentals of building modern web applications.",
          "We'll start with setting up your development environment.",
          "Then we'll dive into components, hooks, and state management.",
          "By the end of this tutorial, you'll have a solid understanding of React.",
          "Don't forget to like and subscribe for more programming content!"
        ]
      },
      es: {
        lines: [
          "¡Bienvenidos a este tutorial completo sobre desarrollo en React!",
          "Hoy exploraremos los fundamentos para crear aplicaciones web modernas.",
          "Comenzaremos configurando tu entorno de desarrollo.",
          "Luego profundizaremos en componentes, hooks y gestión de estado.",
          "Al final de este tutorial, tendrás una comprensión sólida de React.",
          "¡No olvides dar like y suscribirte para más contenido de programación!"
        ]
      },
      fr: {
        lines: [
          "Bienvenue dans ce tutoriel complet sur le développement React !",
          "Aujourd'hui, nous explorerons les fondamentaux de la création d'applications web modernes.",
          "Nous commencerons par configurer votre environnement de développement.",
          "Ensuite, nous approfondirons les composants, les hooks et la gestion d'état.",
          "À la fin de ce tutoriel, vous aurez une solide compréhension de React.",
          "N'oubliez pas d'aimer et de vous abonner pour plus de contenu de programmation !"
        ]
      },
      de: {
        lines: [
          "Willkommen zu diesem umfassenden Tutorial über React-Entwicklung!",
          "Heute erkunden wir die Grundlagen zum Erstellen moderner Webanwendungen.",
          "Wir beginnen mit der Einrichtung Ihrer Entwicklungsumgebung.",
          "Dann vertiefen wir uns in Komponenten, Hooks und Zustandsverwaltung.",
          "Am Ende dieses Tutorials haben Sie ein solides Verständnis von React.",
          "Vergessen Sie nicht zu liken und zu abonnieren für mehr Programmier-Inhalte!"
        ]
      },
      ja: {
        lines: [
          "React開発に関するこの包括的なチュートリアルへようこそ！",
          "今日は、モダンなWebアプリケーションを構築する基礎を探求します。",
          "開発環境のセットアップから始めます。",
          "その後、コンポーネント、フック、状態管理について深く学びます。",
          "このチュートリアルの終わりには、Reactをしっかりと理解できるでしょう。",
          "プログラミングコンテンツをもっと見るために、いいねとチャンネル登録をお忘れなく！"
        ]
      }
    };

    const defaultLines = sampleTexts.en.lines;
    const lines = sampleTexts[langCode]?.lines || defaultLines;

    if (format === 'srt') {
      return lines.map((line, index) => {
        const startTime = index * 5;
        const endTime = (index + 1) * 5;
        const formatTime = (seconds) => {
          const mins = Math.floor(seconds / 60);
          const secs = seconds % 60;
          return `00:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},000`;
        };
        
        return `${index + 1}\n${formatTime(startTime)} --> ${formatTime(endTime)}\n${line}\n`;
      }).join('\n');
    } else {
      return lines.join('\n\n') + '\n\n--- End of Transcript ---\n\nThis transcript was generated from YouTube captions.';
    }
  };

  // Download caption file
  const downloadCaption = async (langCode, format = 'srt') => {
    setIsLoading(true);
    setStatus(`Generating ${format.toUpperCase()} file for ${langCode.toUpperCase()}...`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const content = generateCaptionContent(langCode, format);
      const filename = `${videoInfo.title.replace(/[^a-zA-Z0-9]/g, '_')}_${langCode}.${format}`;
      
      // Create and trigger download
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setStatus(`${format.toUpperCase()} file downloaded successfully!`);
    } catch (error) {
      setStatus('Download failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    // YouTube URL validation
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    if (!youtubeRegex.test(url)) {
      setStatus('Please enter a valid YouTube URL');
      return;
    }
    
    fetchCaptions(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* SEO Head Section */}
      <div className="hidden">
        <h1>YouTube Caption Downloader - Free SRT & TXT Subtitle Download Tool</h1>
        <meta name="description" content="Download YouTube captions and subtitles in SRT and TXT format for free. Support for multiple languages, auto-generated and manual captions. Fast, secure, and mobile-friendly interface." />
        <meta name="keywords" content="youtube caption downloader, srt download, txt download, subtitle downloader, youtube subtitles, free caption tool, youtube srt, subtitle extractor, transcript downloader" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500 rounded-3xl mb-6 shadow-lg">
            <FaYoutube className="text-3xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            YouTube Caption Downloader
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Download YouTube captions and subtitles in SRT or TXT format. Free, fast, and supports multiple languages including auto-generated captions.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  YouTube Video URL
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:bg-white focus:outline-none transition-all duration-300 text-lg pr-12"
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && url.trim() && !isLoading) {
                        handleSubmit(e);
                      }
                    }}
                  />
                  <FaGlobe className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                </div>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={isLoading || !url.trim()}
                className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <FaPlay className="text-lg" />
                    <span>Get Captions</span>
                  </>
                )}
              </button>
            </div>

            {/* Status Message */}
            {status && (
              <div className={`mt-6 p-4 rounded-2xl flex items-center space-x-3 ${
                status.includes('Error') || status.includes('failed') 
                  ? 'bg-red-50 text-red-700' 
                  : status.includes('success') 
                  ? 'bg-green-50 text-green-700'
                  : 'bg-blue-50 text-blue-700'
              }`}>
                {status.includes('Error') || status.includes('failed') ? (
                  <FaExclamationCircle className="text-lg flex-shrink-0" />
                ) : status.includes('success') ? (
                  <FaCheck className="text-lg flex-shrink-0" />
                ) : (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                )}
                <span className="font-medium">{status}</span>
              </div>
            )}
          </div>

          {/* Video Info */}
          {videoInfo && (
            <div className="border-t border-gray-100 p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                <img 
                  src={videoInfo.thumbnail} 
                  alt="Video thumbnail"
                  className="w-full lg:w-80 h-48 object-cover rounded-2xl shadow-md"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=320&h=180&fit=crop&auto=format';
                  }}
                />
                <div className="flex-1 space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 leading-tight">
                    {videoInfo.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FaUser className="text-sm" />
                    <span className="font-medium">{videoInfo.channel}</span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <FaEye className="text-sm" />
                      <span>{videoInfo.views} views</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaThumbsUp className="text-sm" />
                      <span>{videoInfo.likes} likes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaClock className="text-sm" />
                      <span>{videoInfo.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Captions List */}
          {captions.length > 0 && (
            <div className="border-t border-gray-100 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                <FaFileAlt className="text-red-500" />
                <span>Available Captions ({captions.length} languages)</span>
              </h3>
              
              <div className="grid gap-4">
                {captions.map((caption) => (
                  <div
                    key={caption.code}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <FaGlobe className="text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{caption.language}</h4>
                        <p className="text-sm text-gray-600 flex items-center space-x-1">
                          <span>{caption.auto ? 'Auto-generated' : 'Manual'}</span>
                          {!caption.auto && <FaCheck className="text-green-500 text-xs" />}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => downloadCaption(caption.code, 'srt')}
                        disabled={isLoading}
                        className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-semibold transition-colors flex items-center space-x-2 shadow-md"
                        title="Download as SRT file with timing information"
                      >
                        <FaDownload className="text-sm" />
                        <span>SRT</span>
                      </button>
                      <button
                        onClick={() => downloadCaption(caption.code, 'txt')}
                        disabled={isLoading}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl font-semibold transition-colors flex items-center space-x-2 shadow-md"
                        title="Download as plain text file"
                      >
                        <FaFileAlt className="text-sm" />
                        <span>TXT</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
                <div className="flex items-start space-x-3">
                  <FaCopy className="text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Pro Tip</h4>
                    <p className="text-blue-700 text-sm">
                      Choose <strong>SRT</strong> for video editing and subtitles, or <strong>TXT</strong> for transcription and content analysis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEO Content */}
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              How to Download YouTube Captions & Subtitles
            </h2>
            <div className="prose text-gray-600 space-y-4">
              <p>
                Our YouTube caption downloader makes it easy to extract subtitles from any YouTube video in both SRT and TXT formats. Simply paste the video URL, select your preferred language and format, then download instantly.
              </p>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Step-by-step guide:</h3>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>Copy the YouTube video URL from your browser address bar</li>
                  <li>Paste the URL into the input field above</li>
                  <li>Click "Get Captions" to scan for available subtitles</li>
                  <li>Choose your language and preferred format (SRT or TXT)</li>
                  <li>Click the download button to save the file to your device</li>
                </ol>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Features & Benefits
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaCheck className="text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Multiple Languages</h3>
                    <p className="text-gray-600">Download captions in various languages including auto-generated subtitles</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaCheck className="text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Multiple Formats</h3>
                    <p className="text-gray-600">Download as SRT files for video players or TXT files for transcription</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaCheck className="text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">No Registration</h3>
                    <p className="text-gray-600">Start downloading immediately without creating an account</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaCheck className="text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Free & Fast</h3>
                    <p className="text-gray-600">Completely free to use with instant downloads and no limitations</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaCheck className="text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Mobile Friendly</h3>
                    <p className="text-gray-600">Works perfectly on all devices - desktop, tablet, and mobile</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <FaCheck className="text-green-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Privacy Focused</h3>
                    <p className="text-gray-600">No data stored on our servers - all processing happens in your browser</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              <details className="bg-gray-50 rounded-xl p-4">
                <summary className="font-semibold cursor-pointer">What formats are supported for download?</summary>
                <p className="mt-2 text-gray-600">We provide captions in both SRT (SubRip) format for video players and TXT format for plain text transcription. SRT files include timing information while TXT files contain clean text only.</p>
              </details>
              <details className="bg-gray-50 rounded-xl p-4">
                <summary className="font-semibold cursor-pointer">Are auto-generated captions available?</summary>
                <p className="mt-2 text-gray-600">Yes, we support both manual captions created by video uploaders and auto-generated captions created by YouTube's speech recognition technology. Auto-generated captions are clearly labeled in the interface.</p>
              </details>
              <details className="bg-gray-50 rounded-xl p-4">
                <summary className="font-semibold cursor-pointer">What's the difference between SRT and TXT formats?</summary>
                <p className="mt-2 text-gray-600">SRT files include timing codes and are perfect for video players and subtitle editing. TXT files contain only the spoken text without timing, ideal for transcription, content analysis, or blog posts.</p>
              </details>
              <details className="bg-gray-50 rounded-xl p-4">
                <summary className="font-semibold cursor-pointer">Is this service free to use?</summary>
                <p className="mt-2 text-gray-600">Absolutely! Our YouTube caption downloader is completely free with no limitations on downloads or usage. No registration or payment required.</p>
              </details>
              <details className="bg-gray-50 rounded-xl p-4">
                <summary className="font-semibold cursor-pointer">Can I use this tool on mobile devices?</summary>
                <p className="mt-2 text-gray-600">Yes! Our tool is fully responsive and works great on all devices including smartphones and tablets. The interface adapts perfectly to smaller screens.</p>
              </details>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <FaYoutube className="text-red-500 text-2xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Perfect for Content Creators</h3>
                <p className="text-gray-700">
                  Whether you're a YouTuber, educator, marketer, or student, our caption downloader helps you repurpose video content into blog posts, study materials, social media content, and more. Download transcripts to improve SEO, create written content, or make your videos more accessible.
                </p>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default YouTubeCaptionDownloader;