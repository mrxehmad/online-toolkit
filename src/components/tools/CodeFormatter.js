import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

function CodeFormatter() {
  const { darkMode } = useTheme();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [formattedCode, setFormattedCode] = useState('');
  const [error, setError] = useState('');

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
  ];

  const formatCode = () => {
    setError('');
    try {
      let result = '';
      
      switch (language) {
        case 'javascript':
          // Basic JavaScript formatting
          try {
            result = JSON.stringify(eval('(' + code + ')'), null, 2);
          } catch {
            // If not a valid object/array, try to format the code with basic indentation
            result = code
              .replace(/[{]/g, '{\n  ')
              .replace(/[}]/g, '\n}\n')
              .replace(/;/g, ';\n')
              .replace(/\n\s*\n/g, '\n') // Remove extra newlines
              .split('\n')
              .map(line => line.trim())
              .join('\n');
          }
          break;

        case 'json':
          // JSON formatting
          result = JSON.stringify(JSON.parse(code), null, 2);
          break;

        case 'html':
          // Basic HTML formatting
          result = code
            .replace(/></g, '>\n<')
            .replace(/(<[^/][^>]*>)/g, '$1\n')
            .replace(/(<\/[^>]*>)/g, '\n$1')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map((line, index, array) => {
              const indent = (line.match(/<\//) || index === 0 || array[index - 1].match(/<\//)) ? '' : '  ';
              return indent + line;
            })
            .join('\n');
          break;

        case 'css':
          // Basic CSS formatting
          result = code
            .replace(/[{]/g, ' {\n  ')
            .replace(/[}]/g, '\n}\n')
            .replace(/;/g, ';\n  ')
            .replace(/\n\s*\n/g, '\n')
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .join('\n');
          break;

        default:
          result = code;
      }
      
      setFormattedCode(result);
    } catch (err) {
      setError('Invalid code format. Please check your input.');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Code Formatter
          </h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Format and beautify your code with support for multiple languages
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Select Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="block text-sm font-medium mb-2">
              Input Code
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full h-96 px-3 py-2 rounded-md border font-mono text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Paste your code here..."
            />

            <button
              onClick={formatCode}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Format Code
            </button>

            {error && (
              <p className="mt-2 text-red-500 text-sm">
                {error}
              </p>
            )}
          </div>

          {/* Output Section */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
            <label className="block text-sm font-medium mb-2">
              Formatted Code
            </label>
            <pre className={`w-full h-96 px-3 py-2 rounded-md border font-mono text-sm overflow-auto ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'}`}>
              {formattedCode}
            </pre>

            <button
              onClick={() => {
                navigator.clipboard.writeText(formattedCode);
              }}
              className="mt-4 w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CodeFormatter; 