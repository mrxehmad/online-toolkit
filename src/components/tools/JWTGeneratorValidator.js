import React, { useState, useRef, useEffect } from 'react';
import { Key, Shield, Eye, EyeOff, Copy, Check, AlertCircle, Clock, User, Settings } from 'lucide-react';

export default function JWTGeneratorValidator() {
  const [mode, setMode] = useState('generate');
  const [token, setToken] = useState('');
  const [header, setHeader] = useState(JSON.stringify({ alg: 'HS256', typ: 'JWT' }, null, 2));
  const [payload, setPayload] = useState(JSON.stringify({
    sub: '1234567890',
    name: 'John Doe',
    iat: Math.floor(Date.now() / 1000)
  }, null, 2));
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [algorithm, setAlgorithm] = useState('HS256');
  const [result, setResult] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const resultRef = useRef(null);

  // SEO metadata
  useEffect(() => {
    document.title = 'JWT Generator & Validator | Create and Verify JSON Web Tokens Online';
    
    // Meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Free online JWT generator and validator tool. Create, decode, and verify JSON Web Tokens (JWT) with support for HS256, HS384, HS512 algorithms. Perfect for developers and authentication testing.');

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}${window.location.pathname}`);
  }, []);

  const scrollToResult = () => {
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Simple HMAC implementation for JWT signing
  const hmac = async (algorithm, key, data) => {
    const encoder = new TextEncoder();
    const keyBuffer = encoder.encode(key);
    const dataBuffer = encoder.encode(data);
    
    let hashAlgorithm;
    switch (algorithm) {
      case 'HS256': hashAlgorithm = 'SHA-256'; break;
      case 'HS384': hashAlgorithm = 'SHA-384'; break;
      case 'HS512': hashAlgorithm = 'SHA-512'; break;
      default: hashAlgorithm = 'SHA-256';
    }
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'HMAC', hash: hashAlgorithm },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer);
    return btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const base64UrlEncode = (str) => {
    return btoa(str)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  };

  const base64UrlDecode = (str) => {
    // Add padding if needed
    const padding = 4 - (str.length % 4);
    if (padding !== 4) {
      str += '='.repeat(padding);
    }
    
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    try {
      return atob(base64);
    } catch (e) {
      throw new Error('Invalid base64 encoding');
    }
  };

  const generateJWT = async () => {
    try {
      setError('');
      
      // Validate JSON inputs
      const parsedHeader = JSON.parse(header);
      const parsedPayload = JSON.parse(payload);
      
      // Create header and payload
      const headerEncoded = base64UrlEncode(JSON.stringify(parsedHeader));
      const payloadEncoded = base64UrlEncode(JSON.stringify(parsedPayload));
      
      // Create signature
      const data = `${headerEncoded}.${payloadEncoded}`;
      const signature = await hmac(algorithm, secret, data);
      
      const jwt = `${headerEncoded}.${payloadEncoded}.${signature}`;
      setResult(jwt);
      setToken(jwt);
      
      setTimeout(scrollToResult, 100);
    } catch (err) {
      setError(`Generation failed: ${err.message}`);
    }
  };

  const validateJWT = async () => {
    try {
      setError('');
      
      if (!token.trim()) {
        setError('Please enter a JWT token');
        return;
      }
      
      const parts = token.split('.');
      if (parts.length !== 3) {
        setError('Invalid JWT format');
        return;
      }
      
      // Decode header and payload
      const decodedHeader = JSON.parse(base64UrlDecode(parts[0]));
      const decodedPayload = JSON.parse(base64UrlDecode(parts[1]));
      
      // Verify signature
      const data = `${parts[0]}.${parts[1]}`;
      const expectedSignature = await hmac(decodedHeader.alg || 'HS256', secret, data);
      const isValid = expectedSignature === parts[2];
      
      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      const isExpired = decodedPayload.exp && decodedPayload.exp < now;
      
      setValidationResult({
        header: decodedHeader,
        payload: decodedPayload,
        signature: parts[2],
        isValid,
        isExpired,
        algorithm: decodedHeader.alg || 'HS256'
      });
      
      setTimeout(scrollToResult, 100);
    } catch (err) {
      setError(`Validation failed: ${err.message}`);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Key className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              JWT Generator & Validator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Create, decode, and verify JSON Web Tokens (JWT) with support for HMAC algorithms. 
              Perfect for developers working with authentication and authorization systems.
            </p>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
              <button
                onClick={() => setMode('generate')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  mode === 'generate'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Settings className="inline-block w-4 h-4 mr-2" />
                Generate
              </button>
              <button
                onClick={() => setMode('validate')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  mode === 'validate'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Shield className="inline-block w-4 h-4 mr-2" />
                Validate
              </button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700 dark:text-red-400">{error}</span>
              </div>
            </div>
          )}

          {mode === 'generate' ? (
            /* Generate Mode */
            <div className="space-y-6">
              {/* Algorithm Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Algorithm
                </label>
                <select
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="HS256">HS256</option>
                  <option value="HS384">HS384</option>
                  <option value="HS512">HS512</option>
                </select>
              </div>

              {/* Header */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Header (JSON)
                </label>
                <textarea
                  value={header}
                  onChange={(e) => setHeader(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter header JSON..."
                />
              </div>

              {/* Payload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payload (JSON)
                </label>
                <textarea
                  value={payload}
                  onChange={(e) => setPayload(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter payload JSON..."
                />
              </div>

              {/* Secret */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secret Key
                </label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter secret key..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={generateJWT}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Generate JWT Token
              </button>
            </div>
          ) : (
            /* Validate Mode */
            <div className="space-y-6">
              {/* JWT Token Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  JWT Token
                </label>
                <textarea
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-blue-500"
                  placeholder="Paste your JWT token here..."
                />
              </div>

              {/* Secret for Validation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Secret Key (for signature verification)
                </label>
                <div className="relative">
                  <input
                    type={showSecret ? 'text' : 'password'}
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter secret key..."
                  />
                  <button
                    type="button"
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showSecret ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Validate Button */}
              <button
                onClick={validateJWT}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Validate JWT Token
              </button>
            </div>
          )}

          {/* Results Section */}
          <div ref={resultRef} className="mt-8">
            {mode === 'generate' && result && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 dark:text-white">Generated JWT Token</h3>
                  <button
                    onClick={() => copyToClipboard(result)}
                    className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                  >
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded border p-3 font-mono text-sm text-gray-900 dark:text-white break-all">
                  {result}
                </div>
              </div>
            )}

            {mode === 'validate' && validationResult && (
              <div className="space-y-4">
                {/* Validation Status */}
                <div className={`p-4 rounded-lg ${
                  validationResult.isValid 
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                  <div className="flex items-center">
                    {validationResult.isValid ? (
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                    )}
                    <span className={`font-medium ${
                      validationResult.isValid 
                        ? 'text-green-700 dark:text-green-400' 
                        : 'text-red-700 dark:text-red-400'
                    }`}>
                      Signature {validationResult.isValid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                  {validationResult.isExpired && (
                    <div className="flex items-center mt-2">
                      <Clock className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="text-orange-700 dark:text-orange-400">Token has expired</span>
                    </div>
                  )}
                </div>

                {/* Decoded Header */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <Settings className="h-4 w-4 mr-2" />
                    Header
                  </h3>
                  <pre className="bg-white dark:bg-gray-800 rounded border p-3 text-sm text-gray-900 dark:text-white overflow-auto">
                    {JSON.stringify(validationResult.header, null, 2)}
                  </pre>
                </div>

                {/* Decoded Payload */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Payload
                  </h3>
                  <pre className="bg-white dark:bg-gray-800 rounded border p-3 text-sm text-gray-900 dark:text-white overflow-auto">
                    {JSON.stringify(validationResult.payload, null, 2)}
                  </pre>
                  
                  {/* Timestamp Information */}
                  <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {validationResult.payload.iat && (
                      <div>
                        <strong>Issued At:</strong> {formatTimestamp(validationResult.payload.iat)}
                      </div>
                    )}
                    {validationResult.payload.exp && (
                      <div>
                        <strong>Expires At:</strong> {formatTimestamp(validationResult.payload.exp)}
                      </div>
                    )}
                    {validationResult.payload.nbf && (
                      <div>
                        <strong>Not Before:</strong> {formatTimestamp(validationResult.payload.nbf)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Long Description */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Complete JWT Generator & Validator Tool
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims to be transferred between two parties. 
              Our comprehensive JWT Generator and Validator tool provides developers with a powerful, client-side solution for 
              creating, decoding, and verifying JWT tokens without sending sensitive data to external servers.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">Key Features</h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-600 dark:text-gray-400">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">JWT Generation</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Support for HS256, HS384, and HS512 algorithms</li>
                  <li>• Customizable header and payload JSON</li>
                  <li>• Real-time token generation</li>
                  <li>• Copy to clipboard functionality</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">JWT Validation</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Signature verification</li>
                  <li>• Expiration checking</li>
                  <li>• Header and payload decoding</li>
                  <li>• Timestamp formatting</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">Security & Privacy</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              All JWT operations are performed entirely in your browser using the Web Crypto API. Your tokens, secrets, 
              and sensitive data never leave your device, ensuring maximum security and privacy. This makes our tool 
              perfect for production environments where data security is paramount.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">Use Cases</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              Whether you're debugging authentication flows, testing API integrations, learning about JWT structure, 
              or developing applications that use JSON Web Tokens, this tool provides everything you need. It's 
              particularly useful for developers working with OAuth 2.0, OpenID Connect, and custom authentication systems.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">Algorithm Support</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our tool supports the most commonly used HMAC-based JWT signing algorithms: HS256 (SHA-256), 
              HS384 (SHA-384), and HS512 (SHA-512). These algorithms provide different levels of security 
              and are widely supported across various JWT libraries and frameworks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}