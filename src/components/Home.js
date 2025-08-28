import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  FaCalculator,
  FaCode,
  FaHashtag,
  FaChartLine,
  FaTerminal,
  FaMarkdown,
  FaFilter,
  FaClock,
  FaLock,
  FaKey,
  FaBook,
  FaDesktop,
  FaShieldAlt,
  FaRandom,
  FaDocker,
  FaFileAlt,
  FaLockOpen,
  FaSearch,
  FaFileCode,
  FaCamera,
  FaVideo,
  FaMicrophone,
  FaYoutube,
  FaImage,
  FaFilm,
  FaFileExcel,
  FaPalette,
  FaChartBar,
  FaCloud,
  FaTag,
  FaDollarSign,
  FaQrcode,
  FaKeyboard,
  FaTwitter,
  FaGlobe,
  FaMapMarkedAlt,
  FaFileArchive,
  FaFilePdf,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRuler,
  FaUtensils,
  FaUsers,
  FaNetworkWired,
  FaCompress,
  FaRss,
  FaClipboardCheck,
  FaShareAlt,
  FaStar,
} from 'react-icons/fa';
import { RiRobot2Line } from "react-icons/ri";
import { SiMoleculer } from "react-icons/si";
import { TbWebhook } from "react-icons/tb";
import NetIncomeTaxCalculatorIcon from '@mui/icons-material/Calculate';

function Home() {
  const { darkMode } = useTheme();

  const tools = {
    'Financial & Business Tools': [
      {
        name: 'Mortgage Calculator',
        description: 'Calculate mortgage payments and amortization schedules',
        path: '/mortgage-calculator',
        icon: <FaCalculator />,
        featured: true,
      },
      {
        name: 'Investment Calculator',
        description: 'Plan your investments and calculate returns',
        path: '/investment-calculator',
        icon: <FaChartLine />,
        featured: true,
      },
      {
        name: 'Tax Calculator',
        description: 'Estimate your income tax and take-home pay',
        path: '/tax-calculator',
        icon: <FaCalculator />,
      },
      {
        name: 'Net Income Tax Calculator',
        description: 'Calculate your net income after tax',
        icon: <NetIncomeTaxCalculatorIcon />,
        path: '/net-income-tax-calculator',
      },
      {
        name: 'Stock Crypto Tracker',
        description: 'Track the latest stock and crypto prices',
        path: '/stock-crypto-tracker',
        icon: <FaChartLine />,
      },
      {
        name: 'Currency Converter',
        description: 'Convert currencies between different countries',
        path: '/currency-converter',
        icon: <FaDollarSign />,
      },
      {
        name: 'Invoice Generator',
        description: 'Create professional invoices instantly',
        path: '/invoice-generator',
        icon: <FaFileAlt />,
      },
      {
        name: 'EMI Calculator',
        description: 'Calculate Equated Monthly Installments (EMI) for loans',
        path: '/emi-calculator',
        icon: <FaCalculator />,
      },
      {
        name: 'ROI Calculator',
        description: 'Calculate your return on investment (ROI)',
        path: '/roi-calculator',
        icon: <FaChartLine />,
      },
      {
        name: 'Expense Splitter',
        description: 'Split expenses among friends and groups',
        path: '/expense-splitter',
        icon: <FaUsers />,
      },
    ],
    'Developer & Programming Tools': [
      {
        name: 'Code Formatter',
        description: 'Format and beautify your code in multiple languages',
        path: '/code-formatter',
        icon: <FaCode />,
        featured: true,
      },
      {
        name: 'JSON Beautifier & Validator',
        description: 'Beautify, validate and format JSON data',
        path: '/json-beautifier-validator',
        icon: <FaFileCode />,
      },
      {
        name: 'JSON Validator',
        description: 'Validate and format JSON data',
        path: '/json-validator',
        icon: <FaCode />,
      },
      {
        name: 'cURL Generator',
        description: 'Generate cURL commands for API requests',
        path: '/curl-generator',
        icon: <FaTerminal />,
      },
      {
        name: 'HTTP Request Builder',
        description: 'Build and test HTTP requests with ease',
        path: '/http-request-builder',
        icon: <FaCode />,
      },
      {
        name: 'WebSocket Tester',
        description: 'Test and debug WebSocket connections',
        path: '/web-socket-tester',
        icon: <TbWebhook />,
      },
      {
        name: 'Docker Run to Compose',
        description: 'Convert Docker run commands to Docker Compose format',
        path: '/docker-converter',
        icon: <FaDocker />,
      },
      {
        name: 'Chmod Calculator',
        description: 'Calculate and understand Unix file permissions',
        path: '/chmod-calculator',
        icon: <FaFileAlt />,
      },
      {
        name: 'YAML Formatter',
        description: 'Format and prettify YAML configuration files',
        path: '/yaml-formatter',
        icon: <FaCode />,
      },
      {
        name: 'Code Diff Tool',
        description: 'Compare two pieces of code and highlight differences',
        path: '/code-diff-tool',
        icon: <FaCode />,
      },
      {
        name: 'Regex Playground',
        description: 'Test and debug regular expressions',
        path: '/regex-playground',
        icon: <FaCode />,
      },
      {
        name: 'Pi-hole Regex Generator',
        description: 'Create regex patterns for Pi-hole domain blocking',
        path: '/pihole-regex-generator',
        icon: <FaFilter />,
      },
      {
        name: 'Pi-hole Regex Playground',
        description: 'Test and play with Pi-hole regex patterns',
        path: '/pihole-regex-playground',
        icon: <FaFilter />,
      },
      {
        name: 'Port Generator',
        description: 'Generate random port numbers within specified ranges',
        path: '/port-generator',
        icon: <FaRandom />,
      },
      {
        name: 'Crontab Generator',
        description: 'Create and understand cron scheduling expressions',
        path: '/crontab-generator',
        icon: <FaClock />,
      },
    ],
    'Security & Cryptography Tools': [
      {
        name: 'Strong Password Generator',
        description: 'Generate strong and secure passwords',
        path: '/strong-password-generator',
        icon: <FaLock />,
        featured: true,
      },
      {
        name: 'Password Strength Tester',
        description: 'Test the strength and security of your passwords',
        path: '/password-strength-tester',
        icon: <FaLock />,
      },
      {
        name: 'Cryptographic Converter',
        description: 'Encrypt and decrypt text using various algorithms',
        path: '/crypto-converter',
        icon: <FaLock />,
      },
      {
        name: 'Base64 Encode/Decode',
        description: 'Encode and decode text using Base64 encoding',
        path: '/base64-converter',
        icon: <FaShieldAlt />,
      },
      {
        name: 'Base64 File Converter',
        description: 'Convert files and text to base64 representation',
        path: '/base64-file-converter',
        icon: <FaFileCode />,
      },
      {
        name: 'String Obfuscator',
        description: 'Obfuscate strings to make them harder to reverse engineer',
        path: '/string-obfuscator',
        icon: <FaLockOpen />,
      },
      {
        name: 'UUID Generator',
        description: 'Generate random UUIDs for your projects',
        path: '/uuid-generator',
        icon: <FaKey />,
      },
      {
        name: 'JWT Generator Validator',
        description: 'Generate and validate JWT tokens',
        path: '/jwt-generator-validator',
        icon: <FaLock />,
      },
      {
        name: 'Morse Code Translator',
        description: 'Translate text to Morse code and vice versa',
        path: '/morse-code-translator',
        icon: <FaCode />,
      },
    ],
    'Web Design & Development Tools': [
      {
        name: 'CSS Gradient Generator',
        description: 'Create beautiful CSS gradients with live preview',
        path: '/css-gradient-generator',
        icon: <FaPalette />,
        featured: true,
      },
      {
        name: 'Glassmorphism Generator',
        description: 'Create stunning glassmorphic designs with ease',
        path: '/glassmorphism-generator',
        icon: <FaPalette />,
      },
      {
        name: 'Box Shadow Generator',
        description: 'Generate CSS box shadows with live preview',
        path: '/box-shadow-generator',
        icon: <FaPalette />,
      },
      {
        name: 'Color Palette Generator',
        description: 'Generate beautiful color palettes for your designs',
        path: '/color-palette-generator',
        icon: <FaPalette />,
      },
      {
        name: 'Color Contrast Checker',
        description: 'Check WCAG color contrast compliance',
        path: '/color-contrast-checker',
        icon: <FaPalette />,
      },
      {
        name: 'Favicon Generator',
        description: 'Generate favicon images for your website',
        path: '/favicon-generator',
        icon: <FaImage />,
      },
      {
        name: 'HTML, CSS & JS Minifier',
        description: 'Minify your web assets for better performance',
        path: '/html-css-js-minifier',
        icon: <FaCompress />,
      },
      {
        name: 'Markdown to HTML',
        description: 'Convert Markdown text to clean HTML',
        path: '/markdown-to-html',
        icon: <FaMarkdown />,
      },
    ],
    'SEO & Marketing Tools': [
      {
        name: 'SEO Meta Tag Generator',
        description: 'Generate optimized meta tags for better SEO',
        path: '/seo-meta-generator',
        icon: <FaTag />,
        featured: true,
      },
      {
        name: 'Twitter Card Generator',
        description: 'Generate Twitter Card meta tags for social sharing',
        path: '/twitter-card-generator',
        icon: <FaTwitter />,
      },
      {
        name: 'Robots.txt Generator',
        description: 'Generate and customize robots.txt files',
        path: '/robots-txt-generator',
        icon: <RiRobot2Line />,
      },
      {
        name: 'XML Sitemap Generator',
        description: 'Generate XML sitemaps for search engines',
        path: '/xml-sitemap-generator',
        icon: <FaFileCode />,
      },
      {
        name: 'Keyword Density Checker',
        description: 'Analyze keyword density for SEO optimization',
        path: '/keyword-density-checker',
        icon: <FaSearch />,
      },
      {
        name: 'Alt Text Finder',
        description: 'Find and optimize alt text for accessibility',
        path: '/alt-text-finder',
        icon: <FaImage />,
      },
      {
        name: 'Canonical Tag Generator',
        description: 'Generate canonical tags to prevent duplicate content',
        path: '/canonical-tag-generator',
        icon: <FaTag />,
      },
      {
        name: 'Hreflang Generator',
        description: 'Generate hreflang tags for multilingual SEO',
        path: '/hreflang-generator',
        icon: <FaGlobe />,
      },
      {
        name: 'Hashtag Generator',
        description: 'Generate trending hashtags for social media',
        path: '/hashtag-generator',
        icon: <FaHashtag />,
      },
      {
        name: 'Content Readability Score',
        description: 'Analyze content readability and engagement',
        path: '/content-readability-score',
        icon: <FaBook />,
      },
      {
        name: 'Google Dork Generator',
        description: 'Create advanced Google search queries',
        path: '/google-dork-generator',
        icon: <FaSearch />,
      },
    ],
    'Media & File Processing Tools': [
      {
        name: 'Image Compressor',
        description: 'Compress images while maintaining quality',
        path: '/image-compressor',
        icon: <FaImage />,
        featured: true,
      },
      {
        name: 'Video to GIF Converter',
        description: 'Convert videos to high-quality animated GIFs',
        path: '/video-gif-converter',
        icon: <FaFilm />,
      },
      {
        name: 'Image Format Converter',
        description: 'Convert images between different formats',
        path: '/image-format-converter',
        icon: <FaImage />,
      },
      {
        name: 'PDF Split & Merge Tool',
        description: 'Split and merge PDF files easily',
        path: '/pdf-split-merge',
        icon: <FaFilePdf />,
      },
      {
        name: 'CSV to Excel Converter',
        description: 'Convert CSV files to Excel format',
        path: '/csv-to-excel',
        icon: <FaFileExcel />,
      },
      {
        name: 'Image to Text (OCR)',
        description: 'Extract text from images using OCR technology',
        path: '/image-to-text-ocr',
        icon: <FaImage />,
      },
      {
        name: 'SVG Icon Converter',
        description: 'Convert and optimize SVG images',
        path: '/svg-icon-converter',
        icon: <FaImage />,
      },
      {
        name: 'Exif Tool',
        description: 'View and edit EXIF metadata in images',
        path: '/exif-tool',
        icon: <FaImage />,
      },
      {
        name: 'File Metadata Extractor & Viewer',
        description: 'Extract and view comprehensive file metadata',
        path: '/file-metadata-extractor-editor-viewer',
        icon: <FaFileCode />,
      },
      {
        name: 'Zip File Manager',
        description: 'Create, extract and manage ZIP archives',
        path: '/zip-file-manager',
        icon: <FaFileArchive />,
      },
    ],
    'Audio & Video Tools': [
      {
        name: 'Screen Recorder',
        description: 'Record your screen and save as video',
        path: '/screen-recorder',
        icon: <FaVideo />,
      },
      {
        name: 'Audio Recorder',
        description: 'Record high-quality audio from microphone',
        path: '/audio-recorder',
        icon: <FaMicrophone />,
      },
      {
        name: 'Webcam Tester',
        description: 'Test webcam, capture photos and record videos',
        path: '/webcam-tester',
        icon: <FaCamera />,
      },
      {
        name: 'Audio Pitch and Speed Changer',
        description: 'Modify audio pitch and playback speed',
        path: '/audio-pitch-speed-changer',
        icon: <FaShareAlt />,
      },
      {
        name: 'YouTube Thumbnail Downloader',
        description: 'Download high-quality YouTube video thumbnails',
        path: '/youtube-thumbnail-downloader',
        icon: <FaYoutube />,
      },
      {
        name: 'YouTube Caption Downloader',
        description: 'Download subtitles and captions from YouTube',
        path: '/youtube-caption-downloader',
        icon: <FaYoutube />,
      },
      {
        name: 'YouTube Embedding Converter',
        description: 'Convert YouTube URLs to embed codes',
        path: '/yt-embading',
        icon: <FaYoutube />,
      },
    ],
    'Productivity & Utility Tools': [
      {
        name: 'QR Code Generator',
        description: 'Generate customizable QR codes for any content',
        path: '/qrcode-generator',
        icon: <FaQrcode />,
        featured: true,
      },
      {
        name: 'World Clock & Timezone Converter',
        description: 'Convert time between different timezones',
        path: '/world-clock-timezone-converter',
        icon: <FaClock />,
      },
      {
        name: 'Unit Converter',
        description: 'Convert between various units of measurement',
        path: '/unit-converter',
        icon: <FaRuler />,
      },
      {
        name: 'Age Calculator',
        description: 'Calculate precise age in years, months, and days',
        path: '/age-calculator',
        icon: <FaCalendarAlt />,
      },
      {
        name: 'Date Difference Calculator',
        description: 'Calculate the difference between two dates',
        path: '/date-difference-calculator',
        icon: <FaCalendarAlt />,
      },
      {
        name: 'BMI Calculator',
        description: 'Calculate Body Mass Index and health metrics',
        path: '/bmi-calculator',
        icon: <FaCalculator />,
      },
      {
        name: 'Recipe Scaler',
        description: 'Scale recipe ingredients up or down',
        path: '/recipe-scaler',
        icon: <FaUtensils />,
      },
      {
        name: 'Typing Test',
        description: 'Test and improve your typing speed and accuracy',
        path: '/typing-test',
        icon: <FaKeyboard />,
      },
      {
        name: 'Pomodoro Timer',
        description: 'Boost productivity with the Pomodoro technique',
        path: '/pomodaro-timer',
        icon: <FaClock />,
      },
      {
        name: 'Flashcard App',
        description: 'Create and study digital flashcards',
        path: '/flashcard-app',
        icon: <FaBook />,
      },
      {
        name: 'Checklist Tool',
        description: 'Create and manage organized checklists',
        path: '/checklist-tool',
        icon: <FaClipboardCheck />,
      },
    ],
    'System & Network Tools': [
      {
        name: 'Browser Info Detector',
        description: 'Detect browser, OS, and device information',
        path: '/browser-info-detector',
        icon: <FaDesktop />,
      },
      {
        name: 'Ping Latency Checker',
        description: 'Test network connectivity and latency',
        path: '/ping-latency-checker',
        icon: <FaNetworkWired />,
      },
      {
        name: 'IP Geolocation Finder',
        description: 'Find geographic location of IP addresses',
        path: '/ip-geolocation-finder',
        icon: <FaMapMarkerAlt />,
      },
      {
        name: 'Weather Dashboard',
        description: 'Check current weather and forecasts',
        path: '/weather-dashboard',
        icon: <FaCloud />,
      },
      {
        name: 'Log File Analyzer',
        description: 'Analyze and visualize system log files',
        path: '/log-file-analyzer',
        icon: <FaFileAlt />,
      },
    ],
    'Creative & Design Tools': [
      {
        name: 'ASCII Art Generator',
        description: 'Convert text and images to ASCII art',
        path: '/ascii-art-generator',
        icon: <FaTerminal />,
      },
      {
        name: 'Image to Pixel Art Generator',
        description: 'Convert photos to retro pixel art style',
        path: '/image-to-pixel-art-generator',
        icon: <FaImage />,
      },
      {
        name: 'Resume Builder',
        description: 'Create professional resumes with modern templates',
        path: '/resume-builder',
        icon: <FaFileAlt />,
      },
      {
        name: 'WYSIWYG Markdown Notes',
        description: 'Rich-text notes with Markdown export',
        path: '/wysiwyg-markdown-notes',
        icon: <FaMarkdown />,
      },
      {
        name: 'Molecules Visualizer',
        description: 'Visualize molecular structures in 3D',
        path: '/molecules-visualizer',
        icon: <SiMoleculer />,
      },
    ],
    'Social Media & Content Tools': [
      {
        name: 'Social Media Analyzer',
        description: 'Analyze social media post performance',
        path: '/social-media-analyzer',
        icon: <FaChartLine />,
      },
      {
        name: 'Twitter Embed Creator',
        description: 'Create and customize Twitter embeds',
        path: '/twitter-embed-creator',
        icon: <FaTwitter />,
      },
      {
        name: 'Maps Embed Generator',
        description: 'Generate embeddable interactive maps',
        path: '/maps-embed-generator',
        icon: <FaMapMarkedAlt />,
      },
      {
        name: 'Image Embedding Creator',
        description: 'Create and manage image embeddings for ML',
        path: '/image-embedding-creator',
        icon: <FaImage />,
      },
      {
        name: 'RSS Feed Checker',
        description: 'Validate and analyze RSS feed content',
        path: '/rss-feed-checker',
        icon: <FaRss />,
      },
      {
        name: 'Domain Name Generator',
        description: 'Generate creative domain names from keywords',
        path: '/domain-name-generator',
        icon: <FaGlobe />,
      },
    ],
    'Data Analysis Tools': [
      {
        name: 'CSV Graphs',
        description: 'Create interactive charts and graphs from CSV data',
        path: '/csv-graphs',
        icon: <FaChartBar />,
      },
    ],
  };

  // Get featured tools from all categories
  const featuredTools = Object.values(tools)
    .flat()
    .filter(tool => tool.featured)
    .slice(0, 6);

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6 ${
            darkMode 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
              : 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700'
          }`}>
            <FaStar className="mr-2" />
            100+ Professional Tools Available
          </div>
          <h1 className={`text-5xl font-extrabold mb-6 ${
            darkMode 
              ? 'bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent'
          }`}>
            Ultimate Toolkit Hub
          </h1>
          <p className={`text-xl max-w-3xl mx-auto leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Discover our comprehensive collection of professional-grade online tools designed to boost your productivity, 
            streamline your workflow, and solve everyday challenges with ease.
          </p>
        </div>

        {/* Featured Tools Section */}
        {featuredTools.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <FaStar className={`mr-3 text-2xl ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Featured Tools
              </h2>
              <FaStar className={`ml-3 text-2xl ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {featuredTools.map((tool) => (
                <Link
                  key={tool.path}
                  to={tool.path}
                  className={`group relative p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                    darkMode 
                      ? 'bg-gradient-to-br from-gray-800 to-gray-700 hover:from-purple-800 hover:to-blue-800' 
                      : 'bg-gradient-to-br from-white to-gray-50 hover:from-purple-50 hover:to-blue-50 border border-gray-200'
                  }`}
                >
                  <div className="absolute top-4 right-4">
                    <FaStar className={`text-lg ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                  </div>
                  <div className="flex items-center mb-4">
                    <div className={`text-3xl p-3 rounded-xl transition-colors duration-300 ${
                      darkMode 
                        ? 'text-purple-400 bg-purple-900/30 group-hover:bg-purple-800/40' 
                        : 'text-purple-600 bg-purple-100 group-hover:bg-purple-200'
                    }`}>
                      {tool.icon}
                    </div>
                    <h3 className="ml-4 text-lg font-bold group-hover:text-purple-600 transition-colors">
                      {tool.name}
                    </h3>
                  </div>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Tools by Category */}
        <div className="space-y-16">
          {Object.entries(tools).map(([category, categoryTools]) => (
            <div key={category}>
              <h2 className={`text-3xl font-bold mb-8 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <div className={`w-1 h-8 rounded mr-4 ${
                  darkMode 
                    ? 'bg-gradient-to-b from-purple-400 to-blue-400' 
                    : 'bg-gradient-to-b from-purple-600 to-blue-600'
                }`}></div>
                {category}
                <span className={`ml-4 text-sm px-3 py-1 rounded-full font-medium ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {categoryTools.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className={`group p-6 rounded-xl shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
                      darkMode 
                        ? 'bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-purple-500/50' 
                        : 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`text-2xl p-2 rounded-lg transition-colors duration-300 ${
                        darkMode 
                          ? 'text-blue-400 bg-blue-900/30 group-hover:bg-blue-800/40' 
                          : 'text-blue-600 bg-blue-100 group-hover:bg-blue-200'
                      }`}>
                        {tool.icon}
                      </div>
                      <h3 className="ml-3 text-lg font-semibold group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </h3>
                    </div>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {tool.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className={`mt-20 text-center p-8 rounded-2xl ${
          darkMode 
            ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/20' 
            : 'bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200'
        }`}>
          <h3 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Can't Find What You're Looking For?
          </h3>
          <p className={`text-lg mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            We're constantly adding new tools to help you be more productive. 
            Check back soon for more amazing utilities!
          </p>
          <div className={`inline-flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
            darkMode 
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl' 
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
          }`}>
            <FaSearch className="mr-2" />
            Explore All Tools
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;