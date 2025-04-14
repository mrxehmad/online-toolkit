import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaServer, FaLock, FaInfoCircle } from 'react-icons/fa';

function AdminDashboard() {
  const { darkMode } = useTheme();
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [serverInfo, setServerInfo] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchServerInfo();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const fetchServerInfo = async () => {
    try {
      const response = await fetch('/api/server-info');
      const data = await response.json();
      setServerInfo(data);
    } catch (err) {
      setError('Failed to fetch server information');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center mb-6">
            <FaLock className={`text-4xl mx-auto ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h2 className={`text-2xl font-bold mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Admin Dashboard
            </h2>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-lg ${
                darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'
              } text-white font-semibold`}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className={`px-4 py-2 rounded-lg ${
              darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
            } text-white`}
          >
            Logout
          </button>
        </div>

        {serverInfo && (
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-lg`}>
            <div className="space-y-4">
              <div className="flex items-center">
                <FaServer className="text-indigo-500 mr-2" />
                <h3 className="font-semibold">Server IP:</h3>
                <span className="ml-2">{serverInfo.ip}</span>
              </div>
              <div className="flex items-center">
                <FaInfoCircle className="text-indigo-500 mr-2" />
                <h3 className="font-semibold">Version:</h3>
                <span className="ml-2">{serverInfo.version}</span>
              </div>
              <div className="flex items-center">
                <FaInfoCircle className="text-indigo-500 mr-2" />
                <h3 className="font-semibold">Build Number:</h3>
                <span className="ml-2">{serverInfo.buildNumber}</span>
              </div>
              <div className="flex items-center">
                <FaInfoCircle className="text-indigo-500 mr-2" />
                <h3 className="font-semibold">Build Time:</h3>
                <span className="ml-2">{serverInfo.buildTime}</span>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Hardware Details:</h3>
              <div className="space-y-2">
                <p><span className="font-semibold">CPU:</span> {serverInfo.hardware.cpu}</p>
                <p><span className="font-semibold">Memory:</span> {serverInfo.hardware.memory}</p>
                <p><span className="font-semibold">Storage:</span> {serverInfo.hardware.storage}</p>
                <p><span className="font-semibold">OS:</span> {serverInfo.hardware.os}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard; 