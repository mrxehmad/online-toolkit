import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Snowflake, 
  Zap, 
  Droplets,
  Wind,
  Gauge,
  Thermometer,
  Eye,
  MapPin,
  RefreshCw,
  Navigation,
  Sunrise,
  Sunset
} from 'lucide-react';

const WeatherDashboard = () => {
  // Embedded API key for production use
  const API_KEY = '966b592071198a6441f0b247963aa57a';

  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState('');

  // Weather icon mapping with Lucide icons
  const getWeatherIcon = (code, size = 32) => {
    const iconProps = { size, className: "text-blue-500" };
    
    if (code >= 200 && code < 300) return <Zap {...iconProps} />;
    if (code >= 300 && code < 600) return <CloudRain {...iconProps} />;
    if (code >= 600 && code < 700) return <Snowflake {...iconProps} />;
    if (code >= 700 && code < 800) return <Cloud {...iconProps} />;
    if (code === 800) return <Sun {...iconProps} />;
    if (code > 800) return <Cloud {...iconProps} />;
    return <Sun {...iconProps} />;
  };

  // Fetch weather data
  const fetchWeather = async (city) => {
    setLoading(true);
    setError('');

    try {
      // Current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      if (!currentResponse.ok) {
        throw new Error('Weather data not found. Please check the city name.');
      }
      
      const currentData = await currentResponse.json();
      setWeather(currentData);

      // 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      
      const forecastData = await forecastResponse.json();
      // Get daily forecasts (every 8th item represents roughly 24 hours)
      const dailyForecasts = forecastData.list.filter((item, index) => index % 8 === 0).slice(0, 5);
      setForecast(dailyForecasts);
      
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast([]);
    } finally {
      setLoading(false);
    }
  };

  // Get user's location
  const getCurrentLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          const data = await response.json();
          setLocation(data.name);
          fetchWeather(data.name);
        } catch (err) {
          setError('Unable to fetch weather for your location');
          setLoading(false);
        }
      },
      () => {
        setError('Location access denied. Please search for a city manually.');
        setLoading(false);
      }
    );
  };

  // Handle search
  const handleSearch = () => {
    if (location.trim()) {
      fetchWeather(location.trim());
    }
  };

  // Format time
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Format date
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString([], { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Auto-load weather for a default city on first load
  useEffect(() => {
    setLocation('London');
    fetchWeather('London');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sun className="w-8 h-8 text-blue-500" />
              <h1 className="text-xl font-semibold text-gray-800">Weather Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500 hidden sm:block">Powered by OpenWeather</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">


        {/* Search Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Enter city name (e.g., London, New York, Tokyo)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-800 placeholder-gray-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Search</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={loading}
                className="px-6 py-4 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center space-x-2"
              >
                <Navigation className="w-4 h-4" />
                <span className="hidden sm:inline">My Location</span>
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className={`mb-6 p-4 border-l-4 rounded-r-2xl ${
            error.includes('Demo mode') ? 'bg-blue-50 border-blue-400' : 'bg-red-50 border-red-400'
          }`}>
            <p className={`font-medium ${
              error.includes('Demo mode') ? 'text-blue-700' : 'text-red-700'
            }`}>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && !weather && (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">Loading weather data...</p>
          </div>
        )}

        {/* Weather Content */}
        {weather && (
          <div className="space-y-6">
            {/* Current Weather Card */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-1">{weather.name}, {weather.sys.country}</h2>
                    <p className="text-blue-100 capitalize text-lg">{weather.weather[0].description}</p>
                    <p className="text-blue-200 text-sm">{new Date().toLocaleDateString([], { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                  <div className="text-right">
                    {getWeatherIcon(weather.weather[0].id, 64)}
                  </div>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-6xl font-light mb-2">
                      {Math.round(weather.main.temp)}°
                    </div>
                    <p className="text-blue-100">Feels like {Math.round(weather.main.feels_like)}°C</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-100">High: {Math.round(weather.main.temp_max)}°C</p>
                    <p className="text-blue-100">Low: {Math.round(weather.main.temp_min)}°C</p>
                  </div>
                </div>
              </div>

              {/* Weather Details Grid */}
              <div className="p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Weather Details</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center">
                    <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">Humidity</p>
                    <p className="font-bold text-lg text-gray-800">{weather.main.humidity}%</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center">
                    <Wind className="w-6 h-6 text-green-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">Wind Speed</p>
                    <p className="font-bold text-lg text-gray-800">{Math.round(weather.wind.speed * 3.6)} km/h</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center">
                    <Gauge className="w-6 h-6 text-purple-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">Pressure</p>
                    <p className="font-bold text-lg text-gray-800">{weather.main.pressure}</p>
                    <p className="text-xs text-gray-500">hPa</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 text-center">
                    <Eye className="w-6 h-6 text-orange-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">Visibility</p>
                    <p className="font-bold text-lg text-gray-800">{(weather.visibility / 1000).toFixed(1)}</p>
                    <p className="text-xs text-gray-500">km</p>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4 text-center">
                    <Sunrise className="w-6 h-6 text-yellow-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">Sunrise</p>
                    <p className="font-bold text-lg text-gray-800">{formatTime(weather.sys.sunrise)}</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-4 text-center">
                    <Sunset className="w-6 h-6 text-red-500 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 mb-1">Sunset</p>
                    <p className="font-bold text-lg text-gray-800">{formatTime(weather.sys.sunset)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            {forecast.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">5-Day Forecast</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  {forecast.map((day, index) => (
                    <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-200 hover:scale-105">
                      <p className="font-semibold text-gray-800 mb-3">
                        {index === 0 ? 'Today' : formatDate(day.dt)}
                      </p>
                      <div className="mb-4 flex justify-center">
                        {getWeatherIcon(day.weather[0].id, 32)}
                      </div>
                      <p className="text-sm text-gray-600 mb-3 capitalize font-medium">
                        {day.weather[0].description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-gray-800">{Math.round(day.main.temp_max)}°</span>
                        <span className="text-gray-500 font-medium">{Math.round(day.main.temp_min)}°</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 flex items-center justify-center">
                        <Droplets className="w-3 h-3 mr-1" />
                        {day.main.humidity}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Weather Tips */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-4">Weather Insight</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Thermometer className="w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Temperature</h4>
                    <p className="text-sm opacity-90">
                      {weather.main.temp > 25 ? "Perfect weather for outdoor activities!" : 
                       weather.main.temp > 15 ? "Mild temperature, great for walking!" : 
                       "Cool weather, consider wearing layers."}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Droplets className="w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Humidity</h4>
                    <p className="text-sm opacity-90">
                      {weather.main.humidity > 70 ? "High humidity, stay hydrated!" : 
                       weather.main.humidity > 40 ? "Comfortable humidity levels." : 
                       "Low humidity, consider using moisturizer."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <Sun className="text-blue-500 w-6 h-6" />
              <span className="font-semibold text-gray-800">Weather Dashboard</span>
            </div>
            <p className="text-gray-600 text-sm mb-2">
              Real-time weather information powered by OpenWeatherMap API
            </p>
            <p className="text-gray-500 text-xs max-w-2xl mx-auto">
              Professional weather dashboard providing accurate forecasts, current conditions, and detailed weather metrics. 
              Perfect for planning your day with comprehensive weather insights including temperature, humidity, wind speed, 
              pressure, visibility, and sunrise/sunset times.
            </p>
            <div className="flex justify-center items-center space-x-4 mt-4 text-xs text-gray-400">
              <span>Mobile Responsive</span>
              <span>•</span>
              <span>Real-time Data</span>
              <span>•</span>
              <span>Global Coverage</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WeatherDashboard;