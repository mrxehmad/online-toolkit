import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import MetaTags from '../MetaTags';

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
    <>
      <MetaTags
        title="JSON Validator and Formatter"
        description="Validate and format your JSON data with our online JSON validator tool. Features include syntax highlighting, error detection, and automatic formatting."
        keywords={[
          'json validator',
          'json formatter',
          'json parser',
          'json beautifier',
          'json lint',
          'json checker',
          'json syntax',
          'json tools',
          'validate json',
          'format json'
        ]}
        canonicalUrl="/json-validator"
      />
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

          {/* Informational Content */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
            <h2 className="text-2xl font-semibold mb-4">Validate and Format JSON Effortlessly with Our JSON Validator</h2>
            <p className="mb-4">
              Working with JSON data can be tricky, especially when dealing with complex structures. Our <strong>JSON validator</strong> helps you validate and format JSON data quickly and accurately.
            </p>
            <h3 className="text-xl font-semibold mb-2">Why Use Our JSON Validator?</h3>
            <p className="mb-4">
              Our tool is designed to simplify your JSON data handling. With just a few clicks, you can:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Validate JSON data for syntax errors</li>
              <li>Format JSON for better readability</li>
              <li>Ensure your JSON is ready for API requests</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">How to Use the JSON Validator</h3>
            <p className="mb-4">
              Using our JSON validator is simple:
            </p>
            <ol className="list-decimal pl-6 mb-4">
              <li>Paste your JSON data into the input field.</li>
              <li>Click the "Validate" button to check for errors.</li>
              <li>View the formatted JSON output for easy reading.</li>
            </ol>
            <p className="mb-4">
              This tool is perfect for developers and data analysts who work with JSON data regularly.
            </p>
            <h3 className="text-xl font-semibold mb-2">Explore More Developer Tools</h3>
            <p className="mb-4">
              Enhance your development workflow with our additional tools:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong><a href="/code-formatter" className="text-indigo-600 hover:underline">Code Formatter</a></strong> – Instantly format and beautify your code.</li>
              <li><strong><a href="/curl-generator" className="text-indigo-600 hover:underline">cURL Generator</a></strong> – Generate cURL commands for API requests.</li>
            </ul>
            <p className="mb-4">
              By using these tools together, you can improve your coding efficiency and maintain high-quality code standards.
            </p>
            <h3 className="text-xl font-semibold mb-2">Start Validating JSON Now!</h3>
            <p>
              Ensure your JSON data is error-free and well-formatted. Use our <strong>JSON validator</strong> to streamline your data handling. Try it now and explore our other developer tools!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default JsonValidator; 