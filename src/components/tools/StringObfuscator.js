import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaLock, FaUnlock, FaCopy } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function StringObfuscator() {
  const { darkMode } = useTheme();
  const [input, setInput] = useState('');
  const [obfuscated, setObfuscated] = useState('');
  const [copied, setCopied] = useState(false);

  const obfuscateString = (str) => {
    return str.split('').map(char => {
      const code = char.charCodeAt(0);
      return `\\u${code.toString(16).padStart(4, '0')}`;
    }).join('');
  };

  const deobfuscateString = (str) => {
    return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => 
      String.fromCharCode(parseInt(hex, 16))
    );
  };

  const handleObfuscate = () => {
    setObfuscated(obfuscateString(input));
    setCopied(false);
  };

  const handleDeobfuscate = () => {
    setInput(deobfuscateString(obfuscated));
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
        <h1 className="text-3xl font-bold mb-8">String Obfuscator</h1>
        
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Input Text</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to obfuscate..."
              className={`w-full h-32 px-4 py-2 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}
            />
          </div>

          <div className="flex space-x-4 mb-6">
            <button
              onClick={handleObfuscate}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
              } text-white font-semibold`}
            >
              <FaLock />
              <span>Obfuscate</span>
            </button>
            <button
              onClick={handleDeobfuscate}
              className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'
              } text-white font-semibold`}
            >
              <FaUnlock />
              <span>Deobfuscate</span>
            </button>
          </div>

          {obfuscated && (
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Obfuscated Result</label>
              <div className="relative">
                <pre className={`p-4 rounded-lg overflow-x-auto ${
                  darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'
                }`}>
                  {obfuscated}
                </pre>
                <button
                  onClick={() => copyToClipboard(obfuscated)}
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
              The <strong>String Obfuscator</strong> is a powerful and versatile tool designed to help developers, cybersecurity professionals, and enthusiasts protect sensitive strings by transforming them into obfuscated formats. Whether you're safeguarding API keys, passwords, or other confidential data embedded in your code, this tool ensures that your information remains secure from prying eyes.
            </p>
            
            <h3 className="text-lg font-semibold mb-2">How It Works:</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                <strong>Obfuscation</strong>: Paste your input text into the provided field and click "Obfuscate." The tool will generate an encoded version of your string, making it unintelligible without decoding.
              </li>
              <li>
                <strong>Deobfuscation</strong>: To retrieve the original text, simply paste the obfuscated string into the same field and click "Deobfuscate." The tool will decode the string back to its original form.
              </li>
            </ol>

            <h3 className="text-lg font-semibold mb-2">Use Cases:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Protecting sensitive data in source code</li>
              <li>Securing configuration files</li>
              <li>Enhancing privacy in shared environments</li>
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
                  <li><Link to="/base64-converter" className="text-indigo-500 hover:underline">Base64 Converter</Link> - Encode/decode text</li>
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

export default StringObfuscator; 