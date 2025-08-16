import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();

  const categories = {
    'Social': ['/social-media-analyzer', '/hashtag-generator'],
    'Finance': ['/mortgage-calculator', '/investment-calculator', '/tax-calculator', '/net-income-tax-calculator'],
    'Cryptographic': ['/crypto-converter', '/base64-converter', '/string-obfuscator', '/uuid-generator', '/base64-file-converter'],
    'Developers': ['/browser-info-detector', '/code-formatter', '/json-validator', '/curl-generator', '/markdown-to-html', '/pihole-regex-generator', '/crontab-generator', '/yaml-formatter', '/port-generator', '/docker-converter', '/chmod-calculator', '/webcam-tester'],
    'Media': ['/screen-recorder', '/audio-recorder', '/youtube-thumbnail-downloader', '/youtube-caption-downloader'],
  };

  return (
    <nav className={`${darkMode ? 'dark bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            to="/" 
            className={`flex items-center space-x-3 text-2xl font-bold ${darkMode ? 'text-white' : 'text-indigo-600'} hover:opacity-90 transition-colors duration-200`}
          >
            <span>Online Toolkit</span>
          </Link>
          
          <div className="hidden sm:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-indigo-600'} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200`}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            {Object.keys(categories).map((category) => (
              <div key={category} className="relative group">
                <button 
                  className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-indigo-600'} px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center`}
                >
                  {category}
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {categories[category].map((path) => (
                    <Link
                      key={path}
                      to={path}
                      className={`block px-4 py-2 text-sm ${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-600' : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-100'}`}
                    >
                      {typeof path === 'string' ? path.split('/').pop().split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replace('Curl', 'cURL') : ''}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-600'} transition-colors duration-200`}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 