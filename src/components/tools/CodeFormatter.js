import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import MetaTags from '../MetaTags';

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
    <>
      <MetaTags
        title="Code Formatter & Beautifier"
        description="Format and beautify your code with our online code formatter. Supports multiple programming languages including JavaScript, HTML, CSS, JSON, and more. Features syntax highlighting and customizable formatting options."
        keywords={[
          'code formatter',
          'code beautifier',
          'code prettifier',
          'javascript formatter',
          'html formatter',
          'css formatter',
          'json formatter',
          'syntax highlighter',
          'code indentation',
          'source code formatter'
        ]}
        canonicalUrl="/code-formatter"
      />
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

          {/* Informational Content */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
            <h2 className="text-2xl font-semibold mb-4">Format Your Code Instantly with Our Code Formatter</h2>
            <p className="mb-4">
              Writing clean and well-structured code is essential for readability and maintainability. Our <strong>code formatter</strong> helps you instantly format your code, ensuring proper indentation, consistent styling, and enhanced clarity.
            </p>
            <h3 className="text-xl font-semibold mb-2">Why Use Our Code Formatter?</h3>
            <p className="mb-4">
              Our <strong>online code beautifier</strong> is designed to streamline your coding workflow. With just a few clicks, you can:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Automatically format messy or unstructured code</li>
              <li>Improve code readability and maintain consistency</li>
              <li>Reduce syntax errors caused by improper indentation</li>
              <li>Support multiple programming languages</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">How to Use the Code Formatter</h3>
            <p className="mb-4">
              Using our code formatter is simple:
            </p>
            <ol className="list-decimal pl-6 mb-4">
              <li>Paste your code into the input field.</li>
              <li>Select your programming language.</li>
              <li>Click the "Format" button.</li>
              <li>Instantly get well-structured, readable code.</li>
            </ol>
            <p className="mb-4">
              This tool is perfect for developers, students, and professionals looking to maintain clean code without the hassle of manual formatting.
            </p>
            <h3 className="text-xl font-semibold mb-2">Explore More Developer Tools</h3>
            <p className="mb-4">
              Enhance your coding and financial planning with our additional tools:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li><strong><a href="/tax-calculator" className="text-indigo-600 hover:underline">Tax Calculator</a></strong> – Quickly estimate your tax liability.</li>
              <li><strong><a href="/mortgage-calculator" className="text-indigo-600 hover:underline">Mortgage Calculator</a></strong> – Plan your home loan effectively.</li>
              <li><strong><a href="/investment-calculator" className="text-indigo-600 hover:underline">Investment Calculator</a></strong> – Calculate potential investment returns over time.</li>
            </ul>
            <p className="mb-4">
              By using these tools together, you can create a well-rounded financial plan that maximizes your investments and minimizes financial risks.
            </p>
            <h3 className="text-xl font-semibold mb-2">Start Formatting Your Code Now!</h3>
            <p>
              Don't waste time manually fixing code structure. Use our <strong>code formatter</strong> to instantly enhance your code's readability and maintain professional coding standards. Try it now and explore our other helpful tools!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default CodeFormatter; 