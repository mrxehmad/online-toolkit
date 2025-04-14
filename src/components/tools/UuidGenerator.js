import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../../context/ThemeContext';
import MetaTags from '../MetaTags';
import { FaCopy } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function UUIDGenerator() {
  const { darkMode } = useTheme();
  const [uuid, setUuid] = useState(uuidv4());
  const [copied, setCopied] = useState(false);

  const generateNewUUID = () => {
    setUuid(uuidv4());
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uuid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <MetaTags
        title="UUID Generator"
        description="Generate random UUIDs for your projects."
        keywords={["uuid generator", "random uuid", "unique identifier"]}
        canonicalUrl="/uuid-generator"
      />
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>UUID Generator</h1>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Generate random UUIDs for your projects</p>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Generated UUID</label>
              <div className="relative">
                <div className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono">{uuid}</span>
                    <button
                      onClick={copyToClipboard}
                      className={`p-2 rounded-lg ${
                        darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <FaCopy className={copied ? 'text-green-500' : ''} />
                    </button>
                  </div>
                </div>
                {copied && (
                  <p className="text-green-500 mt-2 text-sm">Copied to clipboard!</p>
                )}
              </div>
            </div>

            <button
              onClick={generateNewUUID}
              className={`w-full py-2 px-4 rounded-lg ${
                darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
              } text-white font-semibold`}
            >
              Generate New UUID
            </button>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">About This Tool</h2>
              <p className="mb-4">
                The <strong>UUID Generator</strong> is a simple yet indispensable tool designed to generate Universally Unique Identifiers (UUIDs) for your projects. UUIDs are 128-bit unique identifiers that are widely used in software development, database management, and distributed systems to ensure that every entity has a distinct identifier.
              </p>
              
              <h3 className="text-lg font-semibold mb-2">How It Works:</h3>
              <ol className="list-decimal pl-6 mb-4">
                <li className="mb-2">
                  <strong>Generate UUID</strong>: Click the "Generate New UUID" button, and the tool will instantly produce a new UUID in the standard format (e.g., <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">17ce1a9f-45cf-46c9-944a-8597cd040098</code>).
                </li>
                <li>
                  <strong>Copy and Use</strong>: The generated UUID can be copied and used directly in your projects, ensuring that it is unique across systems and applications.
                </li>
              </ol>

              <h3 className="text-lg font-semibold mb-2">Use Cases:</h3>
              <ul className="list-disc pl-6 mb-4">
                <li>Creating unique identifiers for database records</li>
                <li>Generating IDs for API requests or responses</li>
                <li>Ensuring uniqueness in distributed systems where multiple servers or services are involved</li>
                <li>Tagging resources in cloud platforms or containerized environments</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2">Example Use Cases:</h3>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Database Records</strong>: Assign a unique UUID to each row in a database table to avoid collisions</li>
                <li><strong>API Development</strong>: Use UUIDs as request/response identifiers for traceability and debugging</li>
                <li><strong>Session Management</strong>: Generate unique session IDs for user authentication and tracking</li>
                <li><strong>File Naming</strong>: Create unique filenames for uploaded files to prevent overwriting</li>
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
    </>
  );
}

export default UUIDGenerator;