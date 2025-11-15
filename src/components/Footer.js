import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

function Footer() {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'} py-8`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>About Toolkit Website</h3>
            <p className="text-sm">
              Your one-stop destination for useful online tools. We provide a collection of calculators,
              formatters, and utilities to help streamline your work.
            </p>
          </div>
          
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-indigo-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-indigo-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm hover:text-indigo-500 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm hover:text-indigo-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>Connect With Us</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://ehmi.se/x"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-indigo-500 transition-colors"
                >
                  X (Twitter)
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/mrxehmad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-indigo-500 transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://ehmi.se/linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-indigo-500 transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8">
          <p className="text-sm text-center">
            © {currentYear} Toolkit Website. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 