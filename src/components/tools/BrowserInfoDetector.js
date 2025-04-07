import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaDesktop, FaMobile, FaTablet, FaInfoCircle } from 'react-icons/fa';
import { UAParser } from 'ua-parser-js';

const BrowserInfoDetector = () => {
  const { darkMode } = useTheme();
  const [browserInfo, setBrowserInfo] = useState(null);

  useEffect(() => {
    const parser = new UAParser();
    const result = parser.getResult();
    setBrowserInfo(result);
  }, []);

  const getDeviceIcon = () => {
    if (!browserInfo?.device) return <FaDesktop />;
    
    if (browserInfo.device.type === 'mobile') return <FaMobile />;
    if (browserInfo.device.type === 'tablet') return <FaTablet />;
    return <FaDesktop />;
  };

  return (
    <div className={`min-h-screen p-6 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Browser Info Detector</h1>

        <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          {browserInfo ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-6">
                <div className={`text-6xl ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                  {getDeviceIcon()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Browser Information</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {browserInfo.browser.name || 'Unknown'}</p>
                    <p><span className="font-medium">Version:</span> {browserInfo.browser.version || 'Unknown'}</p>
                    <p><span className="font-medium">Engine:</span> {browserInfo.engine.name || 'Unknown'}</p>
                    <p><span className="font-medium">Engine Version:</span> {browserInfo.engine.version || 'Unknown'}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Operating System</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {browserInfo.os.name || 'Unknown'}</p>
                    <p><span className="font-medium">Version:</span> {browserInfo.os.version || 'Unknown'}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Device Information</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">Type:</span> {browserInfo.device.type || 'Unknown'}</p>
                    <p><span className="font-medium">Model:</span> {browserInfo.device.model || 'Unknown'}</p>
                    <p><span className="font-medium">Vendor:</span> {browserInfo.device.vendor || 'Unknown'}</p>
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">CPU Information</h2>
                  <div className="space-y-2">
                    <p><span className="font-medium">Architecture:</span> {browserInfo.cpu.architecture || 'Unknown'}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
              <p className="mt-4">Detecting browser information...</p>
            </div>
          )}
        </div>

        <div className={`mt-12 p-6 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h2 className="text-xl font-semibold mb-4">About This Tool</h2>
          <p className="mb-4">
            The Browser Info Detector is a powerful utility that automatically identifies and displays detailed information about your browser environment. This tool is particularly useful for developers who need to understand their users' browser capabilities and device specifications.
          </p>

          <h3 className="text-lg font-medium mb-2">Features</h3>
          <ul className="list-disc pl-5 mb-4">
            <li><strong>Browser Detection:</strong> Identifies browser name, version, and rendering engine</li>
            <li><strong>OS Information:</strong> Detects operating system name and version</li>
            <li><strong>Device Details:</strong> Determines device type (mobile, tablet, desktop), model, and vendor</li>
            <li><strong>CPU Architecture:</strong> Identifies the processor architecture</li>
            <li><strong>Real-time Detection:</strong> Automatically updates when the page loads</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">Use Cases</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Browser compatibility testing</li>
            <li>Device-specific feature detection</li>
            <li>User experience optimization</li>
            <li>Analytics and user tracking</li>
            <li>Debugging and troubleshooting</li>
          </ul>

          <h3 className="text-lg font-medium mb-2">Technical Details</h3>
          <p className="mb-2">This tool uses the UAParser.js library, which is a lightweight JavaScript-based user-agent string parser that:</p>
          <ul className="list-disc pl-5">
            <li>Parses user-agent strings to detect browser, engine, OS, CPU, and device type/model</li>
            <li>Provides accurate and up-to-date detection results</li>
            <li>Works across all major browsers and devices</li>
            <li>Is regularly updated to support new browsers and devices</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BrowserInfoDetector; 