import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
  FaCalculator,
  FaCode,
  FaLock,
  FaPalette,
  FaTag,
  FaImage,
  FaQrcode,
  FaHome,
  FaBars,
  FaTimes,
  FaChevronDown,
} from 'react-icons/fa';

function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simplified categories for desktop - only showing main ones
  const mainCategories = {
    'Finance': {
      icon: <FaCalculator className="w-4 h-4" />,
      tools: [
        { path: '/mortgage-calculator', name: 'Mortgage Calculator' },
        { path: '/investment-calculator', name: 'Investment Calculator' },
        { path: '/tax-calculator', name: 'Tax Calculator' },
        { path: '/currency-converter', name: 'Currency Converter' },
        { path: '/roi-calculator', name: 'ROI Calculator' },
      ]
    },
    'Developer': {
      icon: <FaCode className="w-4 h-4" />,
      tools: [
        { path: '/code-formatter', name: 'Code Formatter' },
        { path: '/json-beautifier-validator', name: 'JSON Beautifier' },
        { path: '/curl-generator', name: 'cURL Generator' },
        { path: '/docker-converter', name: 'Docker Converter' },
        { path: '/regex-playground', name: 'Regex Playground' },
      ]
    },
    'Security': {
      icon: <FaLock className="w-4 h-4" />,
      tools: [
        { path: '/strong-password-generator', name: 'Password Generator' },
        { path: '/crypto-converter', name: 'Crypto Converter' },
        { path: '/base64-converter', name: 'Base64 Converter' },
        { path: '/uuid-generator', name: 'UUID Generator' },
        { path: '/jwt-generator-validator', name: 'JWT Generator' },
      ]
    },
    'Design': {
      icon: <FaPalette className="w-4 h-4" />,
      tools: [
        { path: '/css-gradient-generator', name: 'CSS Gradient' },
        { path: '/color-palette-generator', name: 'Color Palette' },
        { path: '/glassmorphism-generator', name: 'Glassmorphism' },
        { path: '/box-shadow-generator', name: 'Box Shadow' },
        { path: '/favicon-generator', name: 'Favicon Generator' },
      ]
    },
    'SEO': {
      icon: <FaTag className="w-4 h-4" />,
      tools: [
        { path: '/seo-meta-generator', name: 'Meta Generator' },
        { path: '/robots-txt-generator', name: 'Robots.txt' },
        { path: '/xml-sitemap-generator', name: 'XML Sitemap' },
        { path: '/hashtag-generator', name: 'Hashtag Generator' },
        { path: '/keyword-density-checker', name: 'Keyword Density' },
      ]
    },
    'Media': {
      icon: <FaImage className="w-4 h-4" />,
      tools: [
        { path: '/image-compressor', name: 'Image Compressor' },
        { path: '/video-gif-converter', name: 'Video to GIF' },
        { path: '/screen-recorder', name: 'Screen Recorder' },
        { path: '/pdf-split-merge', name: 'PDF Split/Merge' },
        { path: '/image-to-text-ocr', name: 'Image to Text' },
      ]
    },
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`${
      darkMode 
        ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-700' 
        : 'bg-gradient-to-r from-white via-gray-50 to-white border-gray-200'
    } border-b backdrop-blur-lg shadow-lg sticky top-0 z-50 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <a 
            href="https://ehmi.se" 
            className="flex items-center space-x-3 hover:opacity-90 transition-all duration-200"
          >
            <span className="text-2xl font-bold bg-black text-white dark:bg-white dark:text-black px-3 py-1 select-none">
              EHMI
            </span>
          </a>
          
          {/* Desktop Menu - Simplified */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link 
              to="/" 
              className={`flex items-center space-x-2 ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              } px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
            >
              <FaHome className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {/* Categories - Limited to 6 main ones */}
            {Object.entries(mainCategories).map(([category, data]) => (
              <div key={category} className="relative group">
                <button 
                  className={`flex items-center space-x-2 ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  } px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
                >
                  {data.icon}
                  <span>{category}</span>
                  <FaChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                </button>
                
                {/* Compact Dropdown */}
                <div className={`absolute left-0 mt-2 w-56 rounded-xl shadow-xl py-2 ${
                  darkMode 
                    ? 'bg-gray-800 border border-gray-700' 
                    : 'bg-white border border-gray-200'
                } opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-1 group-hover:translate-y-0`}>
                  {data.tools.map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      className={`block px-4 py-2 text-sm transition-all duration-200 ${
                        darkMode 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                      }`}
                    >
                      {tool.name}
                    </Link>
                  ))}
                  <div className={`border-t mt-2 pt-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <Link
                      to="/"
                      className={`block px-4 py-2 text-xs font-medium ${
                        darkMode 
                          ? 'text-purple-400 hover:text-purple-300' 
                          : 'text-purple-600 hover:text-purple-700'
                      }`}
                    >
                      View All {category} Tools →
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {/* All Tools Link */}
            <Link 
              to="/" 
              className={`${
                darkMode 
                  ? 'text-purple-400 hover:text-purple-300 bg-purple-900/30 hover:bg-purple-800/40' 
                  : 'text-purple-600 hover:text-purple-700 bg-purple-100 hover:bg-purple-200'
              } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200`}
            >
              <FaQrcode className="w-4 h-4 inline mr-2" />
              All Tools
            </Link>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-lg transition-all duration-300 ${
                darkMode 
                  ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
                  : 'bg-gray-700 text-white hover:bg-gray-800'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className={`lg:hidden p-2 rounded-lg transition-all duration-200 ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              {mobileMenuOpen ? <FaTimes className="w-5 h-5" /> : <FaBars className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden ${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } border-t`}>
          <div className="px-4 py-4 space-y-2 max-h-80 overflow-y-auto">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-3 ${
                darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-purple-600'
              } p-3 rounded-lg transition-colors duration-200`}
            >
              <FaHome className="w-4 h-4" />
              <span className="font-medium">Home - All Tools</span>
            </Link>
            
            {Object.entries(mainCategories).map(([category, data]) => (
              <div key={category} className="space-y-1">
                <div className={`flex items-center space-x-2 p-2 ${
                  darkMode ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100'
                } rounded-lg text-sm font-semibold`}>
                  {data.icon}
                  <span>{category}</span>
                </div>
                <div className="pl-6 space-y-1">
                  {data.tools.slice(0, 3).map((tool) => (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block p-2 text-sm ${
                        darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-purple-600'
                      } transition-colors duration-200`}
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;