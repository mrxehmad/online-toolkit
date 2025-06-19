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
  FaDesktop,
  FaShieldAlt,
  FaRandom,
  FaDocker,
  FaFileAlt,
  FaLockOpen,
  FaSearch,
  FaFileCode,
} from 'react-icons/fa';
import NetIncomeTaxCalculatorIcon from '@mui/icons-material/Calculate';

function Home() {
  const { darkMode } = useTheme();

  const tools = {
    'Finance Tools': [
      {
        name: 'Mortgage Calculator',
        description: 'Calculate mortgage payments and amortization schedules',
        path: '/mortgage-calculator',
        icon: <FaCalculator />,
      },
      {
        name: 'Investment Calculator',
        description: 'Plan your investments and calculate returns',
        path: '/investment-calculator',
        icon: <FaChartLine />,
      },
      {
        name: 'Tax Calculator',
        description: 'Estimate your income tax and take-home pay',
        path: '/tax-calculator',
        icon: <FaCalculator />,
      },
      {
        name: 'Net Income Tax Calculator',
        description: 'Calculate your net income after tax.',
        icon: <NetIncomeTaxCalculatorIcon />,
        path: '/net-income-tax-calculator',
      },
    ],
    'Cryptographic Tools': [
      {
        name: 'Base64 File Converter',
        description: 'Convert files and text to base64 representation',
        path: '/base64-file-converter',
        icon: <FaFileCode />,
      },
      {
        name: 'Cryptographic Converter',
        description: 'Encrypt and decrypt text using various algorithms (AES, TripleDES, Rabbit, RC4)',
        path: '/crypto-converter',
        icon: <FaLock />,
      },
      {
        name: 'String Obfuscator',
        description: 'Obfuscate strings to make them harder to read and reverse engineer',
        path: '/string-obfuscator',
        icon: <FaLockOpen />,
      },
      {
        name: 'Base64 Encode/Decode',
        description: 'Encode and decode text using Base64 encoding',
        path: '/base64-converter',
        icon: <FaShieldAlt />,
      },
      {
        name: 'UUID Generator',
        description: 'Generate random UUIDs for your projects',
        path: '/uuid-generator',
        icon: <FaKey />,
      },
    ],
    'Developer Tools': [
      {
        name: 'Browser Info Detector',
        description: 'Detect and display browser, OS, device, and CPU information',
        path: '/browser-info-detector',
        icon: <FaDesktop />,
      },
      {
        name: 'Code Formatter',
        description: 'Format and beautify your code',
        path: '/code-formatter',
        icon: <FaCode />,
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
        name: 'Markdown to HTML',
        description: 'Convert Markdown text to HTML',
        path: '/markdown-to-html',
        icon: <FaMarkdown />,
      },
      {
        name: 'Pi-hole Regex Generator',
        description: 'Create regex patterns for Pi-hole domain blocking',
        path: '/pihole-regex-generator',
        icon: <FaFilter />,
      },
      {
        name: 'Crontab Generator',
        description: 'Create and understand crontab scheduling expressions',
        path: '/crontab-generator',
        icon: <FaClock />,
      },
      {
        name: 'Port Generator',
        description: 'Generate random port numbers within specified ranges',
        path: '/port-generator',
        icon: <FaRandom />,
      },
      {
        name: 'Docker Run to Compose',
        description: 'Convert Docker run commands to Docker Compose format',
        path: '/docker-converter',
        icon: <FaDocker />,
      },
      {
        name: 'Chmod Calculator',
        description: 'Calculate and understand file permissions',
        path: '/chmod-calculator',
        icon: <FaFileAlt />,
      },
      {
        name: 'YAML Formatter',
        description: 'Format and prettify YAML files',
        path: '/yaml-formatter',
        icon: <FaCode />,
      },
      {
        name: 'Google Dork Generator',
        description: 'Create advanced Google search queries for security research',
        path: '/google-dork-generator',
        icon: <FaSearch />,
      },
    ],
    'Social Media Tools': [
      {
        name: 'Social Media Analyzer',
        description: 'Analyze social media post performance',
        path: '/social-media-analyzer',
        icon: <FaChartLine />,
      },
      {
        name: 'Hashtag Generator',
        description: 'Generate relevant hashtags for your content',
        path: '/hashtag-generator',
        icon: <FaHashtag />,
      },
    ],
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
            Welcome to Toolkit Website
          </h1>
          <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Your one-stop destination for useful online tools
          </p>
        </div>

        <div className="space-y-12">
          {Object.entries(tools).map(([category, categoryTools]) => (
            <div key={category}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => (
                  <Link
                    key={tool.path}
                    to={tool.path}
                    className={`block p-6 rounded-lg shadow-md transition-transform transform hover:scale-105 ${
                      darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <div className={`text-2xl ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {tool.icon}
                      </div>
                      <h3 className="ml-3 text-lg font-medium">{tool.name}</h3>
                    </div>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {tool.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <a href="/tools/webcam-tester" className="tool-card">
          <div className="tool-card-title">Webcam Tester</div>
          <div className="tool-card-desc">Test your webcam, take a picture or record a video, and view detailed webcam information.</div>
        </a>
      </div>
    </div>
  );
}

export default Home; 