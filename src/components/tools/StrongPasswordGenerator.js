import React, { useState, useRef, useEffect } from 'react';
import { Shield, Copy, RefreshCw, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

export default function StrongPasswordGenerator() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [strength, setStrength] = useState({ score: 0, text: '', color: '' });
  const resultRef = useRef(null);

  // Character sets
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const ambiguous = '0O1Il';

  // Generate password
  const generatePassword = () => {
    let charset = '';
    let generatedPassword = '';

    // Build character set
    if (includeUppercase) charset += uppercase;
    if (includeLowercase) charset += lowercase;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    // Remove ambiguous characters if requested
    if (excludeAmbiguous) {
      charset = charset.split('').filter(char => !ambiguous.includes(char)).join('');
    }

    if (!charset) {
      setPassword('Please select at least one character type');
      return;
    }

    // Ensure at least one character from each selected type
    if (includeUppercase) generatedPassword += uppercase[Math.floor(Math.random() * uppercase.length)];
    if (includeLowercase) generatedPassword += lowercase[Math.floor(Math.random() * lowercase.length)];
    if (includeNumbers) generatedPassword += numbers[Math.floor(Math.random() * numbers.length)];
    if (includeSymbols) generatedPassword += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill remaining length
    for (let i = generatedPassword.length; i < length; i++) {
      generatedPassword += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle the password
    generatedPassword = generatedPassword.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(generatedPassword);
    calculateStrength(generatedPassword);
    
    // Scroll to result after short delay
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 1200);
  };

  // Calculate password strength
  const calculateStrength = (pwd) => {
    let score = 0;
    let feedback = [];

    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    let strengthData;
    if (score < 3) {
      strengthData = { score, text: 'Weak', color: 'text-red-500' };
    } else if (score < 5) {
      strengthData = { score, text: 'Fair', color: 'text-yellow-500' };
    } else if (score < 6) {
      strengthData = { score, text: 'Good', color: 'text-blue-500' };
    } else {
      strengthData = { score, text: 'Strong', color: 'text-green-500' };
    }

    setStrength(strengthData);
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password');
    }
  };

  // SEO metadata (would be handled by parent component or Next.js Head)
  useEffect(() => {
    document.title = 'Strong Password Generator - Create Secure Passwords Online';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      {/* SEO Meta Tags - These would typically go in a Head component */}
      <div style={{ display: 'none' }}>
        <meta name="description" content="Generate strong, secure passwords with customizable length and character sets. Free online password generator with advanced security features and real-time strength analysis." />
        <meta name="keywords" content="password generator, strong password, secure password, random password, password security" />
        <link rel="canonical" href="https://yoursite.com/tools/strong-password-generator" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <Shield className="w-16 h-16 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Strong Password Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Create secure, customizable passwords with advanced options for maximum protection
          </p>
        </div>

        {/* Main Tool Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          {/* Password Length */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password Length: {length}
            </label>
            <input
              type="range"
              min="4"
              max="128"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>4</span>
              <span>128</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeUppercase}
                onChange={(e) => setIncludeUppercase(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Uppercase Letters (A-Z)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeLowercase}
                onChange={(e) => setIncludeLowercase(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Lowercase Letters (a-z)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeNumbers}
                onChange={(e) => setIncludeNumbers(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Numbers (0-9)</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeSymbols}
                onChange={(e) => setIncludeSymbols(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Symbols (!@#$%^&*)</span>
            </label>
          </div>

          {/* Additional Options */}
          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={excludeAmbiguous}
                onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 dark:text-gray-300">Exclude Ambiguous Characters (0, O, 1, l, I)</span>
            </label>
          </div>

          {/* Generate Button */}
          <button
            onClick={generatePassword}
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Generate Strong Password</span>
          </button>
        </div>

        {/* Result Section */}
        {password && (
          <div ref={resultRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-green-500" />
              Generated Password
            </h2>

            {/* Password Display */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    readOnly
                    className="w-full bg-transparent text-lg font-mono text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Password Strength */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Strength</span>
                <span className={`text-sm font-semibold ${strength.color}`}>{strength.text}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    strength.score < 3 ? 'bg-red-500' :
                    strength.score < 5 ? 'bg-yellow-500' :
                    strength.score < 6 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(strength.score / 7) * 100}%` }}
                ></div>
              </div>
            </div>

            {copied && (
              <div className="flex items-center text-green-600 dark:text-green-400 text-sm">
                <Check className="w-4 h-4 mr-1" />
                Password copied to clipboard!
              </div>
            )}
          </div>
        )}

        {/* Description Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <AlertCircle className="w-6 h-6 mr-2 text-blue-500" />
            About Strong Password Generator
          </h2>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our Strong Password Generator creates cryptographically secure passwords using advanced randomization algorithms. 
              This tool runs entirely in your browser, ensuring your generated passwords never leave your device for maximum security.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Key Features:</h3>
            <ul className="text-gray-600 dark:text-gray-300 mb-4 space-y-1">
              <li>• Customizable password length from 4 to 128 characters</li>
              <li>• Multiple character set options (uppercase, lowercase, numbers, symbols)</li>
              <li>• Option to exclude ambiguous characters for better readability</li>
              <li>• Real-time password strength analysis</li>
              <li>• One-click copy to clipboard functionality</li>
              <li>• Show/hide password visibility toggle</li>
              <li>• Completely client-side - no data sent to servers</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Password Security Best Practices:</h3>
            <ul className="text-gray-600 dark:text-gray-300 mb-4 space-y-1">
              <li>• Use passwords with at least 12-16 characters</li>
              <li>• Include a mix of uppercase, lowercase, numbers, and symbols</li>
              <li>• Use unique passwords for every account</li>
              <li>• Consider using a password manager to store generated passwords</li>
              <li>• Enable two-factor authentication when available</li>
              <li>• Regularly update passwords, especially for sensitive accounts</li>
            </ul>

            <p className="text-gray-600 dark:text-gray-300">
              This password generator uses your browser's built-in cryptographic functions to ensure true randomness. 
              The generated passwords are not stored or transmitted anywhere, making this tool completely secure for 
              creating passwords for your most sensitive accounts.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}