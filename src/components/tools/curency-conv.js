import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
import { FiSun, FiMoon, FiRefreshCw, FiTrendingUp, FiDollarSign, FiInfo, FiGlobe } from 'react-icons/fi';
import { BsCurrencyExchange } from 'react-icons/bs';
import { LuArrowUpDown } from "react-icons/lu";

// Theme Context
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Currency data with flags and names
const currencies = {
  USD: { name: 'US Dollar', flag: '🇺🇸' },
  EUR: { name: 'Euro', flag: '🇪🇺' },
  GBP: { name: 'British Pound', flag: '🇬🇧' },
  JPY: { name: 'Japanese Yen', flag: '🇯🇵' },
  AUD: { name: 'Australian Dollar', flag: '🇦🇺' },
  CAD: { name: 'Canadian Dollar', flag: '🇨🇦' },
  CHF: { name: 'Swiss Franc', flag: '🇨🇭' },
  CNY: { name: 'Chinese Yuan', flag: '🇨🇳' },
  INR: { name: 'Indian Rupee', flag: '🇮🇳' },
  KRW: { name: 'South Korean Won', flag: '🇰🇷' },
  PKR: { name: 'Pakistani Rupee', flag: '🇵🇰' },
  SGD: { name: 'Singapore Dollar', flag: '🇸🇬' },
  HKD: { name: 'Hong Kong Dollar', flag: '🇭🇰' },
  NZD: { name: 'New Zealand Dollar', flag: '🇳🇿' },
  SEK: { name: 'Swedish Krona', flag: '🇸🇪' },
  NOK: { name: 'Norwegian Krone', flag: '🇳🇴' },
  MXN: { name: 'Mexican Peso', flag: '🇲🇽' },
  BRL: { name: 'Brazilian Real', flag: '🇧🇷' },
  RUB: { name: 'Russian Ruble', flag: '🇷🇺' },
  ZAR: { name: 'South African Rand', flag: '🇿🇦' }
};

const CurrencyConverter = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  const [convertedAmount, setConvertedAmount] = useState(null);

  // Fetch exchange rates
  const fetchExchangeRates = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      if (!response.ok) throw new Error('Failed to fetch exchange rates');
      const data = await response.json();
      setExchangeRates(data.rates);
      setLastUpdated(new Date(data.date));
    } catch (err) {
      setError('Unable to fetch current exchange rates. Please try again later.');
      console.error('Exchange rate fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [fromCurrency]);

  // Convert currency
  const convertCurrency = useCallback(() => {
    if (!exchangeRates[toCurrency] || !amount) {
      setConvertedAmount(null);
      return;
    }
    const rate = exchangeRates[toCurrency];
    const result = (parseFloat(amount) * rate).toFixed(2);
    setConvertedAmount(result);
  }, [exchangeRates, toCurrency, amount]);

  // Swap currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  useEffect(() => {
    convertCurrency();
  }, [convertCurrency]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`${darkMode ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-lg border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} sticky top-0 z-50`}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
              <BsCurrencyExchange className="text-white text-xl" />
            </div>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Currency Converter
            </h1>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-2.5 rounded-xl transition-all duration-300 ${darkMode 
              ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            {darkMode ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* SEO Description */}
        <div className="text-center mb-8">
          <h2 className={`text-2xl md:text-3xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Free Real-Time Currency Exchange Calculator
          </h2>
          <p className={`text-sm md:text-base max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Convert currencies instantly with live exchange rates. Support for 20+ major currencies including USD, EUR, GBP, JPY, and more. 
            Perfect for travelers, traders, and international business. Updated rates from reliable financial APIs.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <FiGlobe className={darkMode ? 'text-blue-400' : 'text-blue-500'} />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>20+ Currencies</span>
            </div>
            <div className="flex items-center gap-1">
              <FiTrendingUp className={darkMode ? 'text-green-400' : 'text-green-500'} />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Live Rates</span>
            </div>
            <div className="flex items-center gap-1">
              <FiDollarSign className={darkMode ? 'text-yellow-400' : 'text-yellow-500'} />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>100% Free</span>
            </div>
          </div>
        </div>

        {/* Main Converter Card */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 md:p-8 mb-6`}>
          {/* Amount Input */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className={`w-full px-4 py-3 rounded-xl border text-lg font-medium transition-all duration-200 ${darkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-650' 
                : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* From Currency */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                From
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-lg transition-all duration-200 ${darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                {Object.entries(currencies).map(([code, { name, flag }]) => (
                  <option key={code} value={code}>
                    {flag} {code} - {name}
                  </option>
                ))}
              </select>
            </div>

            {/* To Currency */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                To
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border text-lg transition-all duration-200 ${darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              >
                {Object.entries(currencies).map(([code, { name, flag }]) => (
                  <option key={code} value={code}>
                    {flag} {code} - {name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={swapCurrencies}
              className={`p-3 rounded-xl transition-all duration-200 ${darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800'
              }`}
            >
            <LuArrowUpDown className="text-lg" />
            </button>
          </div>

          {/* Result */}
          {convertedAmount && (
            <div className={`text-center p-6 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-blue-50'} mb-6`}>
              <div className="text-3xl md:text-4xl font-bold mb-2">
                <span className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {currencies[toCurrency].flag} {convertedAmount}
                </span>
                <span className={`text-lg ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {toCurrency}
                </span>
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {amount} {fromCurrency} = {convertedAmount} {toCurrency}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={fetchExchangeRates}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${darkMode 
                ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600' 
                : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400'
              } disabled:cursor-not-allowed`}
            >
              <FiRefreshCw className={`${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Updating...' : 'Refresh Rates'}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`mt-4 p-4 rounded-xl ${darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-700'} flex items-start gap-2`}>
              <FiInfo className="flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Last Updated */}
          {lastUpdated && (
            <div className={`mt-4 text-center text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Rates last updated: {lastUpdated.toLocaleString()}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
            <div className={`inline-flex p-3 rounded-xl ${darkMode ? 'bg-green-600' : 'bg-green-500'} mb-4`}>
              <FiTrendingUp className="text-white text-xl" />
            </div>
            <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Real-Time Rates</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Get the most accurate and up-to-date exchange rates from reliable financial data sources.
            </p>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
            <div className={`inline-flex p-3 rounded-xl ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} mb-4`}>
              <FiGlobe className="text-white text-xl" />
            </div>
            <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>20+ Currencies</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Support for major world currencies including USD, EUR, GBP, JPY, CNY, INR, and many more.
            </p>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 rounded-2xl shadow-lg`}>
            <div className={`inline-flex p-3 rounded-xl ${darkMode ? 'bg-purple-600' : 'bg-purple-500'} mb-4`}>
              <FiDollarSign className="text-white text-xl" />
            </div>
            <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Completely Free</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No registration, no hidden fees, no limits. Convert currencies as many times as you need.
            </p>
          </div>
        </div>

        {/* SEO Footer */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg p-6 md:p-8`}>
          <h3 className={`font-bold text-xl mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            About Our Currency Converter
          </h3>
          <div className={`prose max-w-none ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <p className="mb-4">
              Our free currency converter provides real-time exchange rates for over 20 major world currencies. 
              Whether you're traveling abroad, making international business transactions, or simply curious about 
              currency values, our tool gives you accurate, up-to-date conversion rates.
            </p>
            <p className="mb-4">
              The converter supports popular currencies including US Dollar (USD), Euro (EUR), British Pound (GBP), 
              Japanese Yen (JPY), Chinese Yuan (CNY), Indian Rupee (INR), Pakistani Rupee (PKR), and many more. 
              All calculations are performed locally in your browser for fast, secure conversions.
            </p>
            <p>
              Perfect for international travelers, forex traders, e-commerce businesses, and anyone dealing with 
              multiple currencies. Our responsive design works seamlessly on desktop, tablet, and mobile devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <CurrencyConverter />
    </ThemeProvider>
  );
}