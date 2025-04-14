import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaRandom, FaCopy } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function PortGenerator() {
  const { darkMode } = useTheme();
  const [portRange, setPortRange] = useState('known'); // 'known' or 'all'
  const [generatedPort, setGeneratedPort] = useState(null);
  const [copied, setCopied] = useState(false);

  const generatePort = () => {
    let min, max;
    if (portRange === 'known') {
      min = 0;
      max = 1023;
    } else {
      min = 0;
      max = 65535;
    }
    const port = Math.floor(Math.random() * (max - min + 1)) + min;
    setGeneratedPort(port);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (generatedPort !== null) {
      navigator.clipboard.writeText(generatedPort.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Port Generator</h1>
        
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Port Range</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="known"
                  checked={portRange === 'known'}
                  onChange={(e) => setPortRange(e.target.value)}
                  className="mr-2"
                />
                Known Ports (0-1023)
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="all"
                  checked={portRange === 'all'}
                  onChange={(e) => setPortRange(e.target.value)}
                  className="mr-2"
                />
                All Ports (0-65535)
              </label>
            </div>
          </div>

          <button
            onClick={generatePort}
            className={`w-full py-3 px-4 rounded-lg flex items-center justify-center space-x-2 ${
              darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white font-semibold`}
          >
            <FaRandom />
            <span>Generate Port</span>
          </button>

          {generatedPort !== null && (
            <div className="mt-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-100 dark:bg-gray-700">
                <span className="text-2xl font-mono">{generatedPort}</span>
                <button
                  onClick={copyToClipboard}
                  className={`p-2 rounded-lg ${
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
              The <strong>Port Generator</strong> is a versatile and easy-to-use tool designed to generate random port numbers for various applications. Ports are essential in networking, allowing devices and services to communicate over the internet or local networks. Whether you're setting up a new server, testing network configurations, or developing software that requires unique ports, this tool ensures that you can quickly generate valid port numbers within your desired range.
            </p>
            
            <h3 className="text-lg font-semibold mb-2">How It Works:</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                <strong>Select Port Range</strong>:
                <ul className="list-disc pl-6 mt-2">
                  <li><strong>Known Ports (0–1023)</strong>: These are reserved for well-known services like HTTP (port 80), HTTPS (port 443), and SSH (port 22). Use this range if you need ports typically associated with standard protocols.</li>
                  <li><strong>All Ports (0–65535)</strong>: This includes all possible port numbers, including dynamic and private ports (1024–65535). Use this range if you need a broader selection, such as for custom applications or testing purposes.</li>
                </ul>
              </li>
              <li className="mb-2">
                <strong>Generate Port</strong>: Click the "Generate Port" button, and the tool will produce a random port number within the selected range.
              </li>
              <li>
                <strong>Copy and Use</strong>: The generated port number can be copied and used directly in your projects or configurations.
              </li>
            </ol>

            <h3 className="text-lg font-semibold mb-2">Use Cases:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Configuring servers and network services</li>
              <li>Testing firewall rules or network security settings</li>
              <li>Assigning unique ports for applications or microservices</li>
              <li>Avoiding conflicts when running multiple services on the same machine</li>
            </ul>

            <h3 className="text-lg font-semibold mb-2">Example Use Cases:</h3>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>Server Configuration</strong>: Generate a random port for a new service to ensure it doesn't conflict with existing services</li>
              <li><strong>Firewall Testing</strong>: Use the tool to test whether specific ports are open or blocked by a firewall</li>
              <li><strong>Development Environments</strong>: Assign unique ports for development servers or APIs to avoid port collisions</li>
              <li><strong>Gaming Servers</strong>: Generate a port number for hosting multiplayer game servers</li>
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

export default PortGenerator; 