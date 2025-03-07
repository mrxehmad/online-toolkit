import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

function JsonValidator() {
  const { darkMode } = useTheme();
  const [jsonInput, setJsonInput] = useState('');
  const [result, setResult] = useState({
    isValid: false,
    formattedJson: '',
    error: '',
  });

  const validateJson = () => {
    try {
      if (!jsonInput.trim()) {
        setResult({
          isValid: false,
          formattedJson: '',
          error: 'Please enter JSON to validate',
        });
        return;
      }

      const parsedJson = JSON.parse(jsonInput);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      
      setResult({
        isValid: true,
        formattedJson,
        error: '',
      });
    } catch (err) {
      setResult({
        isValid: false,
        formattedJson: '',
        error: `Invalid JSON: ${err.message}`,
      });
    }
  };

  const handleMinify = () => {
    try {
      const parsedJson = JSON.parse(jsonInput);
      const minifiedJson = JSON.stringify(parsedJson);
      setJsonInput(minifiedJson);
    } catch (err) {
      setResult({
        isValid: false,
        formattedJson: '',
        error: `Invalid JSON: ${err.message}`,
      });
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            JSON Validator
          </h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Validate and format your JSON data
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
            <label className="block text-sm font-medium mb-2">
              Input JSON
            </label>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className={`w-full h-96 px-3 py-2 rounded-md border font-mono text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Paste your JSON here..."
            />

            <div className="mt-4 flex space-x-4">
              <button
                onClick={validateJson}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Validate & Format
              </button>
              <button
                onClick={handleMinify}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                Minify
              </button>
            </div>

            {result.error && (
              <p className="mt-2 text-red-500 text-sm">
                {result.error}
              </p>
            )}
          </div>

          {/* Output Section */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                Formatted JSON
              </label>
              {result.isValid && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Valid JSON
                </span>
              )}
            </div>
            <pre className={`w-full h-96 px-3 py-2 rounded-md border font-mono text-sm overflow-auto ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'}`}>
              {result.formattedJson}
            </pre>

            {result.isValid && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(result.formattedJson);
                }}
                className="mt-4 w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
              >
                Copy to Clipboard
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JsonValidator; 