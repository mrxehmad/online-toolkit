import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

function CurlGenerator() {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    method: 'GET',
    url: '',
    headers: [{ key: '', value: '' }],
    body: '',
    auth: {
      type: 'none',
      username: '',
      password: '',
      token: '',
    },
    options: {
      followRedirects: true,
      insecure: false,
      compressed: true,
      verbose: false,
    },
  });

  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
  const authTypes = [
    { value: 'none', label: 'No Auth' },
    { value: 'basic', label: 'Basic Auth' },
    { value: 'bearer', label: 'Bearer Token' },
  ];

  const handleInputChange = (e, index = null) => {
    const { name, value, checked, type } = e.target;

    if (name.startsWith('header-')) {
      const [, field, idx] = name.split('-');
      const newHeaders = [...formData.headers];
      newHeaders[idx][field] = value;
      setFormData(prev => ({ ...prev, headers: newHeaders }));
    } else if (name.startsWith('auth.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        auth: { ...prev.auth, [field]: value },
      }));
    } else if (name.startsWith('options.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        options: { ...prev.options, [field]: type === 'checkbox' ? checked : value },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const addHeader = () => {
    setFormData(prev => ({
      ...prev,
      headers: [...prev.headers, { key: '', value: '' }],
    }));
  };

  const removeHeader = (index) => {
    setFormData(prev => ({
      ...prev,
      headers: prev.headers.filter((_, i) => i !== index),
    }));
  };

  const generateCurl = () => {
    let curl = 'curl';

    // Add options
    if (formData.options.followRedirects) curl += ' -L';
    if (formData.options.insecure) curl += ' -k';
    if (formData.options.compressed) curl += ' --compressed';
    if (formData.options.verbose) curl += ' -v';

    // Add method
    if (formData.method !== 'GET') {
      curl += ` -X ${formData.method}`;
    }

    // Add headers
    formData.headers.forEach(header => {
      if (header.key && header.value) {
        curl += ` -H "${header.key}: ${header.value}"`;
      }
    });

    // Add authentication
    if (formData.auth.type === 'basic' && formData.auth.username) {
      curl += ` -u "${formData.auth.username}:${formData.auth.password}"`;
    } else if (formData.auth.type === 'bearer' && formData.auth.token) {
      curl += ` -H "Authorization: Bearer ${formData.auth.token}"`;
    }

    // Add body
    if (['POST', 'PUT', 'PATCH'].includes(formData.method) && formData.body) {
      curl += ` -d '${formData.body}'`;
    }

    // Add URL
    curl += ` "${formData.url}"`;

    return curl;
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            cURL Command Generator
          </h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Generate cURL commands for your API requests
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6 mb-8`}>
          <div className="space-y-6">
            {/* Method and URL */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Method
                </label>
                <select
                  name="method"
                  value={formData.method}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  {methods.map(method => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium mb-2">
                  URL
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://api.example.com/endpoint"
                  className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>
            </div>

            {/* Headers */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Headers</label>
                <button
                  type="button"
                  onClick={addHeader}
                  className="text-sm text-indigo-600 hover:text-indigo-500"
                >
                  Add Header
                </button>
              </div>
              <div className="space-y-2">
                {formData.headers.map((header, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      name={`header-key-${index}`}
                      value={header.key}
                      onChange={handleInputChange}
                      placeholder="Header name"
                      className={`flex-1 px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    <input
                      type="text"
                      name={`header-value-${index}`}
                      value={header.value}
                      onChange={handleInputChange}
                      placeholder="Value"
                      className={`flex-1 px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    />
                    <button
                      type="button"
                      onClick={() => removeHeader(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-500"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Authentication */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Authentication
              </label>
              <select
                name="auth.type"
                value={formData.auth.type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2`}
              >
                {authTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              {formData.auth.type === 'basic' && (
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="auth.username"
                    value={formData.auth.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    className={`px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  <input
                    type="password"
                    name="auth.password"
                    value={formData.auth.password}
                    onChange={handleInputChange}
                    placeholder="Password"
                    className={`px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              )}

              {formData.auth.type === 'bearer' && (
                <input
                  type="text"
                  name="auth.token"
                  value={formData.auth.token}
                  onChange={handleInputChange}
                  placeholder="Bearer Token"
                  className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              )}
            </div>

            {/* Request Body */}
            {['POST', 'PUT', 'PATCH'].includes(formData.method) && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Request Body
                </label>
                <textarea
                  name="body"
                  value={formData.body}
                  onChange={handleInputChange}
                  rows="4"
                  className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter request body (JSON, form data, etc.)"
                />
              </div>
            )}

            {/* Options */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="options.followRedirects"
                    checked={formData.options.followRedirects}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Follow redirects (-L)
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="options.insecure"
                    checked={formData.options.insecure}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Allow insecure server connections (-k)
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="options.compressed"
                    checked={formData.options.compressed}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Request compressed response (--compressed)
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="options.verbose"
                    checked={formData.options.verbose}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  Verbose output (-v)
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Generated Command */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
          <div className="flex justify-between items-center mb-2">
            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Generated Command
            </h2>
            <button
              onClick={() => navigator.clipboard.writeText(generateCurl())}
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              Copy to Clipboard
            </button>
          </div>
          <pre className={`p-4 rounded-lg overflow-x-auto ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
            {generateCurl()}
          </pre>
        </div>

        {/* Informational Content */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
          <h2 className="text-2xl font-semibold mb-4">Generate cURL Commands Effortlessly with Our cURL Generator</h2>
          <p className="mb-4">
            Crafting cURL commands manually can be tedious and error-prone. Our <strong>cURL generator</strong> simplifies this process, allowing you to create accurate cURL commands for your API requests with ease.
          </p>
          <h3 className="text-xl font-semibold mb-2">Why Use Our cURL Generator?</h3>
          <p className="mb-4">
            Our tool is designed to streamline your API testing and development workflow. With just a few inputs, you can:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Generate cURL commands for various HTTP methods</li>
            <li>Include headers, authentication, and request body</li>
            <li>Copy the generated command to your clipboard for easy use</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">How to Use the cURL Generator</h3>
          <p className="mb-4">
            Using our cURL generator is simple:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li>Enter the API endpoint URL.</li>
            <li>Select the HTTP method and add any necessary headers.</li>
            <li>Include authentication details and request body if needed.</li>
            <li>Click the "Generate" button to create your cURL command.</li>
          </ol>
          <p className="mb-4">
            This tool is perfect for developers and testers who need to interact with APIs efficiently.
          </p>
          <h3 className="text-xl font-semibold mb-2">Explore More Developer Tools</h3>
          <p className="mb-4">
            Enhance your development workflow with our additional tools:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong><a href="/#/tools/code-formatter" className="text-indigo-600 hover:underline">Code Formatter</a></strong> – Instantly format and beautify your code.</li>
            <li><strong><a href="/#/tools/json-validator" className="text-indigo-600 hover:underline">JSON Validator</a></strong> – Validate and format JSON data with ease.</li>
          </ul>
          <p className="mb-4">
            By using these tools together, you can improve your coding efficiency and maintain high-quality code standards.
          </p>
          <h3 className="text-xl font-semibold mb-2">Start Generating cURL Commands Now!</h3>
          <p>
            Simplify your API interactions with our <strong>cURL generator</strong>. Try it now and explore our other developer tools to enhance your productivity!
          </p>
        </div>
      </div>
    </div>
  );
}

export default CurlGenerator; 