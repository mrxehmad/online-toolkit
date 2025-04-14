import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaCode, FaCopy } from 'react-icons/fa';
import YAML from 'yaml';

function YamlFormatter() {
  const { darkMode } = useTheme();
  const [input, setInput] = useState('');
  const [formatted, setFormatted] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatYaml = () => {
    try {
      // Parse the input to validate it's valid YAML
      const parsed = YAML.parse(input);
      // Convert back to YAML with proper formatting
      const formattedYaml = YAML.stringify(parsed, {
        indent: 2,
        lineWidth: 0,
        noRefs: true,
      });
      setFormatted(formattedYaml);
      setError('');
    } catch (err) {
      setError('Invalid YAML format');
      setFormatted('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">YAML Formatter</h1>
        
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Input YAML</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your YAML here..."
              className={`w-full h-64 px-4 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <button
            onClick={formatYaml}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
              darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white font-semibold`}
          >
            <FaCode />
            <span>Format YAML</span>
          </button>

          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          {formatted && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Formatted YAML</label>
              <div className="relative">
                <pre className={`p-4 rounded-lg overflow-x-auto ${
                  darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'
                }`}>
                  {formatted}
                </pre>
                <button
                  onClick={copyToClipboard}
                  className={`absolute top-2 right-2 p-2 rounded-lg ${
                    darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  <FaCopy className={copied ? 'text-green-500' : ''} />
                </button>
              </div>
              {copied && (
                <p className="text-green-500 mt-2 text-sm">Copied to clipboard!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default YamlFormatter; 