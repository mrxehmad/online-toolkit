import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaLock, FaUnlock, FaCopy, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const CryptoConverter = () => {
  const { darkMode } = useTheme();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [algorithm, setAlgorithm] = useState('AES');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [error, setError] = useState('');

  const algorithms = [
    { value: 'AES', label: 'AES' },
    { value: 'TripleDES', label: 'Triple DES' },
    { value: 'Rabbit', label: 'Rabbit' },
    { value: 'RC4', label: 'RC4' },
  ];

  const handleConvert = () => {
    try {
      if (!key) {
        setError('Please enter a key');
        return;
      }

      let result;
      if (mode === 'encrypt') {
        switch (algorithm) {
          case 'AES':
            result = CryptoJS.AES.encrypt(inputText, key).toString();
            break;
          case 'TripleDES':
            result = CryptoJS.TripleDES.encrypt(inputText, key).toString();
            break;
          case 'Rabbit':
            result = CryptoJS.Rabbit.encrypt(inputText, key).toString();
            break;
          case 'RC4':
            result = CryptoJS.RC4.encrypt(inputText, key).toString();
            break;
          default:
            result = CryptoJS.AES.encrypt(inputText, key).toString();
        }
      } else {
        switch (algorithm) {
          case 'AES':
            result = CryptoJS.AES.decrypt(inputText, key).toString(CryptoJS.enc.Utf8);
            break;
          case 'TripleDES':
            result = CryptoJS.TripleDES.decrypt(inputText, key).toString(CryptoJS.enc.Utf8);
            break;
          case 'Rabbit':
            result = CryptoJS.Rabbit.decrypt(inputText, key).toString(CryptoJS.enc.Utf8);
            break;
          case 'RC4':
            result = CryptoJS.RC4.decrypt(inputText, key).toString(CryptoJS.enc.Utf8);
            break;
          default:
            result = CryptoJS.AES.decrypt(inputText, key).toString(CryptoJS.enc.Utf8);
        }
      }

      setOutputText(result);
      setError('');
    } catch (err) {
      setError('Error processing the text. Please check your key and input.');
      setOutputText('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Cryptographic Converter</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-2 font-medium">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value)}
              className={`w-full p-2 rounded border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}
            >
              {algorithms.map((algo) => (
                <option key={algo.value} value={algo.value}>
                  {algo.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Mode</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setMode('encrypt')}
                className={`flex-1 p-2 rounded ${
                  mode === 'encrypt'
                    ? darkMode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <FaLock className="inline mr-2" />
                Encrypt
              </button>
              <button
                onClick={() => setMode('decrypt')}
                className={`flex-1 p-2 rounded ${
                  mode === 'decrypt'
                    ? darkMode
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                <FaUnlock className="inline mr-2" />
                Decrypt
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">Key</label>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className={`w-full p-2 rounded border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
            }`}
            placeholder="Enter your encryption/decryption key"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            {mode === 'encrypt' ? 'Text to Encrypt' : 'Text to Decrypt'}
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className={`w-full h-32 p-2 rounded border ${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
            }`}
            placeholder={mode === 'encrypt' ? 'Enter text to encrypt' : 'Enter text to decrypt'}
          />
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleConvert}
            className={`flex-1 p-3 rounded ${
              darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white font-medium`}
          >
            {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </button>
          <button
            onClick={handleClear}
            className={`p-3 rounded ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            <FaTrash />
          </button>
        </div>

        {outputText && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-medium">
                {mode === 'encrypt' ? 'Encrypted Text' : 'Decrypted Text'}
              </label>
              <button
                onClick={handleCopy}
                className={`p-2 rounded ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <FaCopy />
              </button>
            </div>
            <div
              className={`p-4 rounded border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}
            >
              {outputText}
            </div>
          </div>
        )}

        <div className={`mt-12 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <p className="mb-4">
            The Cryptographic Converter is a versatile and secure web-based tool designed to facilitate encryption and decryption of text data using industry-standard cryptographic algorithms. This tool leverages modern encryption techniques to ensure data confidentiality, integrity, and security during transmission or storage.
          </p>

          <h2 className="text-xl font-semibold mb-3">Key Features</h2>
          
          <h3 className="text-lg font-medium mb-2">Algorithm Support</h3>
          <p className="mb-2">The tool supports four widely recognized cryptographic algorithms:</p>
          <ul className="list-disc pl-5 mb-4 space-y-2">
            <li>
              <strong>AES (Advanced Encryption Standard)</strong>
              <ul className="list-disc pl-5 mt-1">
                <li>A symmetric-key encryption algorithm widely used for securing sensitive data</li>
                <li>Provides robust security with key sizes of 128, 192, or 256 bits</li>
                <li>Ideal for applications requiring high security, such as banking and government communications</li>
              </ul>
            </li>
            <li>
              <strong>Triple DES (Data Encryption Standard)</strong>
              <ul className="list-disc pl-5 mt-1">
                <li>An enhanced version of the original DES algorithm, applying the encryption process three times to increase security</li>
                <li>Suitable for legacy systems that require backward compatibility while maintaining improved security</li>
              </ul>
            </li>
            <li>
              <strong>Rabbit</strong>
              <ul className="list-disc pl-5 mt-1">
                <li>A high-performance stream cipher optimized for speed and efficiency</li>
                <li>Often used in environments where encryption/decryption needs to be performed quickly without compromising security</li>
              </ul>
            </li>
            <li>
              <strong>RC4 (Rivest Cipher 4)</strong>
              <ul className="list-disc pl-5 mt-1">
                <li>A simple and fast stream cipher known for its widespread use in protocols like SSL/TLS</li>
                <li>While still functional, it is less recommended for modern applications due to potential vulnerabilities</li>
              </ul>
            </li>
          </ul>

          <h3 className="text-lg font-medium mb-2">Encryption and Decryption Modes</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Users can toggle between Encrypt and Decrypt modes depending on their requirements</li>
            <li>The tool dynamically adjusts input/output labels and placeholders based on the selected mode</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">User-Friendly Interface</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Clean, responsive design adaptable to both light and dark themes</li>
            <li>Intuitive controls include dropdown menus, buttons, and input fields for seamless interaction</li>
            <li>Real-time feedback ensures users are aware of errors or successful operations</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">Error Handling</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Comprehensive error messages guide users when issues arise (e.g., missing keys or invalid inputs)</li>
            <li>Prevents accidental misuse by validating user inputs before processing</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">Utility Functions</h3>
          <ul className="list-disc pl-5">
            <li>Copy to Clipboard: Allows users to easily copy encrypted/decrypted text for further use</li>
            <li>Clear Inputs: Resets all fields, providing a fresh start for new conversions</li>
          </ul>
          <p>Related tools: <Link to="/code-formatter" className={`${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>Code Formatter</Link>, <Link to="/json-validator" className={`${darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>JSON Validator</Link></p>
        </div>
      </div>
    </div>
  );
};

export default CryptoConverter; 