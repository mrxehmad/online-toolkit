import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import {
  FaCalculator,
  FaCode,
  FaHashtag,
  FaChartLine,
  FaTerminal,
  FaMarkdown,
} from 'react-icons/fa';

function Home() {
  const { darkMode } = useTheme();

  const tools = {
    'Finance Tools': [
      {
        name: 'Mortgage Calculator',
        description: 'Calculate mortgage payments and amortization schedules',
        path: '/tools/mortgage-calculator',
        icon: <FaCalculator />,
      },
      {
        name: 'Investment Calculator',
        description: 'Plan your investments and calculate returns',
        path: '/tools/investment-calculator',
        icon: <FaChartLine />,
      },
      {
        name: 'Tax Calculator',
        description: 'Estimate your income tax and take-home pay',
        path: '/tools/tax-calculator',
        icon: <FaCalculator />,
      },
    ],
    'Developer Tools': [
      {
        name: 'Code Formatter',
        description: 'Format and beautify your code',
        path: '/tools/code-formatter',
        icon: <FaCode />,
      },
      {
        name: 'JSON Validator',
        description: 'Validate and format JSON data',
        path: '/tools/json-validator',
        icon: <FaCode />,
      },
      {
        name: 'cURL Generator',
        description: 'Generate cURL commands for API requests',
        path: '/tools/curl-generator',
        icon: <FaTerminal />,
      },
      {
        name: 'Markdown to HTML',
        description: 'Convert Markdown text to HTML',
        path: '/tools/markdown-to-html',
        icon: <FaMarkdown />,
      },
    ],
    'Social Media Tools': [
      {
        name: 'Social Media Analyzer',
        description: 'Analyze social media post performance',
        path: '/tools/social-media-analyzer',
        icon: <FaChartLine />,
      },
      {
        name: 'Hashtag Generator',
        description: 'Generate relevant hashtags for your content',
        path: '/tools/hashtag-generator',
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
      </div>
    </div>
  );
}

export default Home; 