import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaCopy } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import * as yaml from 'yaml';

function YAMLFormatter() {
  const { darkMode } = useTheme();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const formatYAML = () => {
    try {
      const parsed = yaml.parse(input);
      const formatted = yaml.stringify(parsed, {
        indent: 2,
        lineWidth: 80,
        singleQuote: true
      });
      setOutput(formatted);
      setError('');
    } catch (err) {
      setError('Invalid YAML format. Please check your input.');
      setOutput('');
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">YAML Formatter</h1>
        
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Format Your YAML</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="yaml-input" className="block text-sm font-medium mb-2">
                  Enter YAML
                </label>
                <textarea
                  id="yaml-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className={`w-full h-64 p-4 rounded-lg font-mono text-sm ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  } border`}
                  placeholder="Paste your YAML here..."
                />
              </div>

              <button
                onClick={formatYAML}
                className={`px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-indigo-500 hover:bg-indigo-400'
                } text-white`}
              >
                Format YAML
              </button>

              {error && (
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-red-900 text-red-100' : 'bg-red-100 text-red-900'
                }`}>
                  {error}
                </div>
              )}

              {output && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">
                      Formatted YAML
                    </label>
                    <button
                      onClick={copyToClipboard}
                      className={`p-2 rounded-lg ${
                        darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <FaCopy className={copied ? 'text-green-500' : ''} />
                    </button>
                  </div>
                  <pre className={`p-4 rounded-lg overflow-x-auto ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <code className="text-sm">{output}</code>
                  </pre>
                  {copied && (
                    <p className="text-green-500 mt-2 text-sm">Copied to clipboard!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">About This Tool</h2>
          <p className="mb-4">
            The <strong>YAML Formatter</strong> is a powerful tool designed to help you format and beautify YAML files. Whether you're working with configuration files, API specifications, or any other YAML-based documents, this tool ensures your YAML is properly indented, consistently formatted, and easy to read.
          </p>

          <h3 className="text-lg font-semibold mb-2">How It Works:</h3>
          <ol className="list-decimal pl-6 mb-4">
            <li className="mb-2">
              <strong>Input Your YAML</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li>Paste your raw YAML content into the input area</li>
                <li>The tool supports both single and multi-document YAML files</li>
              </ul>
            </li>
            <li className="mb-2">
              <strong>Format Your YAML</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li>Click the "Format" button to process your YAML</li>
                <li>The tool will automatically indent and structure your YAML properly</li>
                <li>Invalid YAML will be detected and reported with error messages</li>
              </ul>
            </li>
            <li>
              <strong>Copy and Use</strong>:
              <ul className="list-disc pl-6 mt-2">
                <li>Copy the formatted YAML to your clipboard with a single click</li>
                <li>Use the formatted YAML in your projects or configuration files</li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Example Use Cases</h2>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Configuration Files</strong>: Format and validate YAML configuration files for applications and services</li>
            <li><strong>API Documentation</strong>: Beautify OpenAPI/Swagger specifications for better readability</li>
            <li><strong>DevOps Automation</strong>: Format YAML files used in CI/CD pipelines and infrastructure as code</li>
            <li><strong>Data Serialization</strong>: Convert and format data between YAML and other formats</li>
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
                <li><Link to="/net-income-tax-calculator" className="text-indigo-500 hover:underline">Net Income Tax Calculator</Link> - Determine take-home pay</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Cryptographic Tools</h3>
              <ul className="space-y-1">
                <li><Link to="/crypto-converter" className="text-indigo-500 hover:underline">Crypto Converter</Link> - Convert cryptocurrencies</li>
                <li><Link to="/base64-converter" className="text-indigo-500 hover:underline">Base64 Converter</Link> - Encode/decode text</li>
                <li><Link to="/string-obfuscator" className="text-indigo-500 hover:underline">String Obfuscator</Link> - Protect sensitive strings</li>
                <li><Link to="/uuid-generator" className="text-indigo-500 hover:underline">UUID Generator</Link> - Generate unique identifiers</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Developer Tools</h3>
              <ul className="space-y-1">
                <li><Link to="/browser-info-detector" className="text-indigo-500 hover:underline">Browser Info Detector</Link> - Get browser details</li>
                <li><Link to="/code-formatter" className="text-indigo-500 hover:underline">Code Formatter</Link> - Beautify your code</li>
                <li><Link to="/json-validator" className="text-indigo-500 hover:underline">JSON Validator</Link> - Validate JSON data</li>
                <li><Link to="/curl-generator" className="text-indigo-500 hover:underline">cURL Generator</Link> - Generate API requests</li>
                <li><Link to="/markdown-to-html" className="text-indigo-500 hover:underline">Markdown to HTML</Link> - Convert Markdown</li>
                <li><Link to="/pihole-regex-generator" className="text-indigo-500 hover:underline">Pi-hole Regex Generator</Link> - Create ad-blocking patterns</li>
                <li><Link to="/crontab-generator" className="text-indigo-500 hover:underline">Crontab Generator</Link> - Schedule tasks</li>
                <li><Link to="/port-generator" className="text-indigo-500 hover:underline">Port Generator</Link> - Generate random ports</li>
                <li><Link to="/docker-converter" className="text-indigo-500 hover:underline">Docker Converter</Link> - Simplify Dockerfile creation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YAMLFormatter; 