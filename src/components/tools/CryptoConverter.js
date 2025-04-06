import React, { useState } from 'react';
import { AES, TripleDES, Rabbit, RC4 } from 'crypto-js';
import { useTheme } from '../../context/ThemeContext';

function CryptoConverter() {
  const { darkMode } = useTheme();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [algorithm, setAlgorithm] = useState('AES');
  const [key, setKey] = useState('');
  const [mode, setMode] = useState('encrypt');
  const [error, setError] = useState('');

  const algorithms = {
    AES: AES,
    TripleDES: TripleDES,
    Rabbit: Rabbit,
    RC4: RC4
  };

  const handleConvert = () => {
    try {
      setError('');
      if (!key) {
        setError('Please enter a key');
        return;
      }

      const selectedAlgorithm = algorithms[algorithm];
      if (!selectedAlgorithm) {
        setError('Invalid algorithm selected');
        return;
      }

      if (mode === 'encrypt') {
        const encrypted = selectedAlgorithm.encrypt(inputText, key);
        setOutputText(encrypted.toString());
      } else {
        const decrypted = selectedAlgorithm.decrypt(inputText, key);
        setOutputText(decrypted.toString(CryptoJS.enc.Utf8));
      }
    } catch (err) {
      setError('Error processing the text. Please check your input and key.');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Cryptographic Converter</h1>
          <p className="text-lg">Encrypt and decrypt text using various cryptographic algorithms</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Algorithm</label>
              <select
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                {Object.keys(algorithms).map((algo) => (
                  <option key={algo} value={algo}>{algo}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              >
                <option value="encrypt">Encrypt</option>
                <option value="decrypt">Decrypt</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Key</label>
            <input
              type="text"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter your encryption key"
              className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              {mode === 'encrypt' ? 'Text to Encrypt' : 'Text to Decrypt'}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              placeholder={mode === 'encrypt' ? 'Enter text to encrypt' : 'Enter text to decrypt'}
            />
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">
              {error}
            </div>
          )}

          <button
            onClick={handleConvert}
            className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
          </button>

          {outputText && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                {mode === 'encrypt' ? 'Encrypted Text' : 'Decrypted Text'}
              </label>
              <textarea
                value={outputText}
                readOnly
                rows={4}
                className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
              />
              <button
                onClick={() => navigator.clipboard.writeText(outputText)}
                className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CryptoConverter; 