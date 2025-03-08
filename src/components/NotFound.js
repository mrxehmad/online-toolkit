import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const NotFound = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`flex flex-col items-center justify-center h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <h1 className="text-2xl">
        404 - Page Not Found
      </h1>
      
      <Link to="/" className="justify-center mt-6 text-indigo-600 hover:underline">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
