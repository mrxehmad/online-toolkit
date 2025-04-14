import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FaLock, FaServer, FaMicrochip, FaNetworkWired, FaGithub } from 'react-icons/fa';

function AdminDashboard() {
  const { darkMode } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [commitId, setCommitId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommitId = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/mrxehmad/online-toolkit/commits/main');
        const data = await response.json();
        setCommitId(data.sha.substring(0, 7));
      } catch (err) {
        console.error('Error fetching commit ID:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommitId();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className={`flex items-center justify-center py-16 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center mb-6">
            <FaLock className={`mx-auto h-12 w-12 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
            <h2 className={`mt-4 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Admin Dashboard
            </h2>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              />
            </div>
            {error && (
              <div className="mb-4 p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200">
                {error}
              </div>
            )}
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
    <div className={`py-16 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center mb-4">
              <FaServer className={`text-2xl ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <h2 className="ml-3 text-xl font-semibold">Server Information</h2>
            </div>
            <div className="space-y-2">
              <p>Hostname: {window.location.hostname}</p>
              <p>Platform: {navigator.platform}</p>
              <p>User Agent: {navigator.userAgent}</p>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center mb-4">
              <FaMicrochip className={`text-2xl ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <h2 className="ml-3 text-xl font-semibold">CPU Information</h2>
            </div>
            <div className="space-y-2">
              <p>CPU Cores: {navigator.hardwareConcurrency}</p>
              <p>Device Memory: {navigator.deviceMemory || 'Unknown'} GB</p>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center mb-4">
              <FaNetworkWired className={`text-2xl ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <h2 className="ml-3 text-xl font-semibold">Network Information</h2>
            </div>
            <div className="space-y-2">
              <p>Connection Type: {navigator.connection?.effectiveType || 'Unknown'}</p>
              <p>Online Status: {navigator.onLine ? 'Online' : 'Offline'}</p>
            </div>
          </div>

          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center mb-4">
              <FaGithub className={`text-2xl ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
              <h2 className="ml-3 text-xl font-semibold">Version Information</h2>
            </div>
            <div className="space-y-2">
              <p>Commit ID: {loading ? 'Loading...' : commitId}</p>
              <p>Environment: {process.env.NODE_ENV}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 