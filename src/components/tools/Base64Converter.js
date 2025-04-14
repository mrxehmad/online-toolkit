import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaExchangeAlt, FaCopy } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Base64Converter() {
  const { darkMode } = useTheme();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const encodeBase64 = (str) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (err) {
      setError('Error encoding to Base64');
      return '';
    }
  };

  const decodeBase64 = (str) => {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (err) {
      setError('Error decoding from Base64');
      return '';
    }
  };

  const handleEncode = () => {
    setError('');
    setOutput(encodeBase64(input));
    setCopied(false);
  };

  const handleDecode = () => {
    setError('');
    setOutput(decodeBase64(input));
    setCopied(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Base64 Converter</h1>
        
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Input</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to encode/decode..."
              className={`w-full h-32 px-4 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={handleEncode}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
              } text-white font-semibold`}
            >
              <FaExchangeAlt />
              <span>Encode</span>
            </button>
            <button
              onClick={handleDecode}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
              } text-white font-semibold`}
            >
              <FaExchangeAlt />
              <span>Decode</span>
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200">
              {error}
            </div>
          )}

          {output && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Result</label>
              <div className="relative">
                <pre className={`p-4 rounded-lg overflow-x-auto ${
                  darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'
                }`}>
                  {output}
                </pre>
                <button
                  onClick={() => copyToClipboard(output)}
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

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">About This Tool</h2>
            <p className="mb-4">
              The <strong>Base64 Converter</strong> is a simple yet powerful tool designed to encode and decode text using the Base64 encoding scheme. Base64 is widely used in various applications, such as embedding binary data in text formats (e.g., emails, JSON, or XML), securing sensitive information during transmission, and encoding images or files for web use.
            </p>
            
            <h3 className="text-lg font-semibold mb-2">How It Works:</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                <strong>Encode</strong>: Enter plain text into the input field and click "Encode." The tool will convert your text into a Base64-encoded string, which can be safely transmitted or stored in text-based systems.
              </li>
              <li>
                <strong>Decode</strong>: Paste a Base64-encoded string into the input field and click "Decode." The tool will reverse the process, converting the encoded string back into its original plain text format.
              </li>
            </ol>

            <h3 className="text-lg font-semibold mb-2">Use Cases:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Encoding sensitive data for secure transmission</li>
              <li>Embedding images or files in HTML, CSS, or JavaScript</li>
              <li>Debugging and testing APIs that use Base64 encoding</li>
              <li>Simplifying the process of working with binary data in text formats</li>
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Explore More Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Social Media Tools</h3>
                <ul className="space-y-1">
                  <li><Link to="/social-media-analyzer" className="text-indigo-500 hover:underline">Social Media Analyzer</Link> - Gain insights into social media trends</li>
                  <li><Link to="/hashtag-generator" className="text-indigo-500 hover:underline">Hashtag Generator</Link> - Create optimized hashtags</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Finance Tools</h3>
                <ul className="space-y-1">
                  <li><Link to="/mortgage-calculator" className="text-indigo-500 hover:underline">Mortgage Calculator</Link> - Plan your home loan payments</li>
                  <li><Link to="/investment-calculator" className="text-indigo-500 hover:underline">Investment Calculator</Link> - Estimate investment growth</li>
                  <li><Link to="/tax-calculator" className="text-indigo-500 hover:underline">Tax Calculator</Link> - Calculate tax liabilities</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Cryptographic Tools</h3>
                <ul className="space-y-1">
                  <li><Link to="/crypto-converter" className="text-indigo-500 hover:underline">Crypto Converter</Link> - Convert cryptocurrencies</li>
                  <li><Link to="/string-obfuscator" className="text-indigo-500 hover:underline">String Obfuscator</Link> - Protect sensitive strings</li>
                  <li><Link to="/uuid-generator" className="text-indigo-500 hover:underline">UUID Generator</Link> - Generate unique identifiers</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Developer Tools</h3>
                <ul className="space-y-1">
                  <li><Link to="/code-formatter" className="text-indigo-500 hover:underline">Code Formatter</Link> - Beautify your code</li>
                  <li><Link to="/json-validator" className="text-indigo-500 hover:underline">JSON Validator</Link> - Validate JSON data</li>
                  <li><Link to="/yaml-formatter" className="text-indigo-500 hover:underline">YAML Formatter</Link> - Format YAML files</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Base64Converter; 