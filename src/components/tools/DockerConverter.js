import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaExchangeAlt, FaCopy } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function DockerConverter() {
  const { darkMode } = useTheme();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [conversionType, setConversionType] = useState('runToYaml');
  const [copied, setCopied] = useState(false);

  const convertDocker = () => {
    // Placeholder for actual conversion logic
    // This would be implemented with proper parsing and conversion
    if (conversionType === 'runToYaml') {
      setOutput('Converted YAML will appear here');
    } else {
      setOutput('Converted docker run command will appear here');
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
        <h1 className="text-3xl font-bold mb-8">Docker Converter</h1>
        
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Conversion Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="runToYaml"
                  checked={conversionType === 'runToYaml'}
                  onChange={(e) => setConversionType(e.target.value)}
                  className="mr-2"
                />
                Docker Run to YAML
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="yamlToRun"
                  checked={conversionType === 'yamlToRun'}
                  onChange={(e) => setConversionType(e.target.value)}
                  className="mr-2"
                />
                YAML to Docker Run
              </label>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {conversionType === 'runToYaml' ? 'Docker Run Command' : 'Docker Compose YAML'}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full h-32 p-3 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
              placeholder={
                conversionType === 'runToYaml'
                  ? 'Paste your docker run command here...'
                  : 'Paste your docker-compose.yml content here...'
              }
            />
          </div>

          <button
            onClick={convertDocker}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
              darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white font-semibold`}
          >
            <FaExchangeAlt />
            <span>Convert</span>
          </button>

          {output && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  {conversionType === 'runToYaml' ? 'Docker Compose YAML' : 'Docker Run Command'}
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
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <pre className="whitespace-pre-wrap">{output}</pre>
              </div>
              {copied && (
                <p className="text-green-500 mt-2 text-sm">Copied to clipboard!</p>
              )}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">About This Tool</h2>
            <p className="mb-4">
              The <strong>Docker Converter</strong> is a powerful and intuitive tool designed to streamline the process of converting between Docker Run commands and Docker Compose YAML configurations. Whether you're managing containerized applications or setting up development environments, this tool simplifies the transition between command-line instructions and declarative configuration files. It's perfect for developers, DevOps engineers, and anyone working with Docker who wants to save time and reduce manual errors.
            </p>
            
            <h3 className="text-lg font-semibold mb-2">How It Works:</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                <strong>Docker Run to YAML</strong>:
                <ul className="list-disc pl-6 mt-2">
                  <li>Paste your <code>docker run</code> command into the input field</li>
                  <li>Click "Convert," and the tool will automatically generate an equivalent Docker Compose YAML configuration</li>
                  <li>Use the generated YAML file to define and manage multi-container applications with ease</li>
                </ul>
              </li>
              <li>
                <strong>YAML to Docker Run</strong>:
                <ul className="list-disc pl-6 mt-2">
                  <li>Paste your Docker Compose YAML configuration into the input field</li>
                  <li>Click "Convert," and the tool will extract the relevant information to generate a corresponding <code>docker run</code> command</li>
                  <li>This is ideal for quickly testing or debugging container setups without needing a full YAML file</li>
                </ul>
              </li>
            </ol>

            <h3 className="text-lg font-semibold mb-2">Use Cases:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Converting existing <code>docker run</code> commands into reusable and scalable YAML configurations</li>
              <li>Simplifying the process of migrating from command-line workflows to Docker Compose</li>
              <li>Debugging and testing container configurations by converting YAML back into <code>docker run</code> commands</li>
              <li>Streamlining collaboration by providing a standardized way to share container setups</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">Example Use Cases:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Docker Run to YAML</strong>: You've been using <code>docker run</code> commands to start containers manually, but now you want to define these configurations in a <code>docker-compose.yml</code> file for better scalability and maintainability</li>
              <li><strong>YAML to Docker Run</strong>: You have a complex Docker Compose setup and need to quickly test a single service using a <code>docker run</code> command</li>
              <li><strong>Learning Docker</strong>: Newcomers to Docker can use this tool to understand how <code>docker run</code> commands map to YAML configurations and vice versa</li>
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
                  <li><Link to="/yaml-formatter" className="text-indigo-500 hover:underline">YAML Formatter</Link> - Format YAML files</li>
                  <li><Link to="/port-generator" className="text-indigo-500 hover:underline">Port Generator</Link> - Generate random ports</li>
                  <li><Link to="/chmod-calculator" className="text-indigo-500 hover:underline">Chmod Calculator</Link> - Calculate file permissions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DockerConverter; 