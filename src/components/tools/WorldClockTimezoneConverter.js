import React, { useState, useEffect } from 'react';
import { Clock, Globe, Plus, X, Calendar, MapPin } from 'lucide-react';

// Mock useTheme hook - replace with your actual theme hook
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  return { theme, setTheme };
};

export default function WorldClockTimezoneConverter() {
  const { theme } = useTheme();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezones, setSelectedTimezones] = useState([
    'America/New_York',
    'Europe/London', 
    'Asia/Tokyo',
    'Australia/Sydney'
  ]);
  const [newTimezone, setNewTimezone] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Popular timezones list
  const popularTimezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'America/Denver',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Australia/Sydney',
    'Australia/Melbourne',
    'Pacific/Auckland',
    'America/Sao_Paulo',
    'America/Mexico_City',
    'Africa/Cairo',
    'Asia/Singapore',
    'Asia/Hong_Kong'
  ];

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time for timezone
  const formatTimeForTimezone = (timezone) => {
    try {
      const date = new Date();
      const timeString = date.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit'
      });
      
      const dateString = date.toLocaleDateString('en-US', {
        timeZone: timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });

      return { timeString, dateString };
    } catch (error) {
      return { timeString: 'Invalid', dateString: 'Invalid' };
    }
  };

  // Get timezone display name
  const getTimezoneDisplayName = (timezone) => {
    try {
      const date = new Date();
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        timeZoneName: 'long'
      });
      const parts = formatter.formatToParts(date);
      const timeZoneName = parts.find(part => part.type === 'timeZoneName')?.value || timezone;
      
      // Create a cleaner display name
      const cityName = timezone.split('/').pop().replace(/_/g, ' ');
      return `${cityName} (${timeZoneName})`;
    } catch (error) {
      return timezone.replace(/_/g, ' ');
    }
  };

  // Add new timezone
  const addTimezone = () => {
    if (newTimezone && !selectedTimezones.includes(newTimezone)) {
      setSelectedTimezones([...selectedTimezones, newTimezone]);
      setNewTimezone('');
      setShowAddForm(false);
    }
  };

  // Remove timezone
  const removeTimezone = (timezone) => {
    setSelectedTimezones(selectedTimezones.filter(tz => tz !== timezone));
  };

  // Get UTC offset
  const getUTCOffset = (timezone) => {
    try {
      const date = new Date();
      const utc = new Date(date.getTime() + (date.getTimezoneOffset() * 60000));
      const targetTime = new Date(utc.toLocaleString('en-US', { timeZone: timezone }));
      const offset = (targetTime.getTime() - utc.getTime()) / (1000 * 60 * 60);
      return offset >= 0 ? `+${offset}` : `${offset}`;
    } catch (error) {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-300">
      {/* SEO Metadata */}
      <div className="hidden">
        <title>World Clock & Timezone Converter - Real-time Global Time Tool</title>
        <meta 
          name="description" 
          content="Free world clock and timezone converter tool. View real-time clocks for multiple cities worldwide, convert between timezones, and manage global schedules. Perfect for remote work, international meetings, and travel planning."
        />
        <link rel="canonical" href="/tools/world-clock-timezone-converter" />
        <meta name="keywords" content="world clock, timezone converter, time zones, global time, UTC converter, international time, world time, timezone calculator" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-700/30 p-6 md:p-8 transition-all duration-300">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
                <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              World Clock & Timezone Converter
            </h1>
          </div>

          {/* Current Local Time Display */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-8 text-center border dark:border-gray-700">
            <div className="flex justify-center items-center mb-2">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Your Local Time</span>
            </div>
            <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: true,
                hour: 'numeric',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Timezone Clocks Grid */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                World Clocks
              </h2>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center text-sm font-medium transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add City
              </button>
            </div>

            {/* Add Timezone Form */}
            {showAddForm && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6 border dark:border-gray-600">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <select
                      value={newTimezone}
                      onChange={(e) => setNewTimezone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    >
                      <option value="">Select a timezone...</option>
                      {popularTimezones
                        .filter(tz => !selectedTimezones.includes(tz))
                        .map(timezone => (
                          <option key={timezone} value={timezone}>
                            {getTimezoneDisplayName(timezone)}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addTimezone}
                      disabled={!newTimezone}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(false);
                        setNewTimezone('');
                      }}
                      className="bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Timezone Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {selectedTimezones.map(timezone => {
                const { timeString, dateString } = formatTimeForTimezone(timezone);
                const displayName = getTimezoneDisplayName(timezone);
                const utcOffset = getUTCOffset(timezone);
                
                return (
                  <div 
                    key={timezone}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-5 border dark:border-gray-600 relative group hover:shadow-md dark:hover:shadow-gray-600/20 transition-all duration-200"
                  >
                    <button
                      onClick={() => removeTimezone(timezone)}
                      className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-all duration-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    
                    <div className="pr-8">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 truncate">
                        {timezone.split('/').pop().replace(/_/g, ' ')}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        UTC {utcOffset}
                      </p>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {timeString}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {dateString}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedTimezones.length === 0 && (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 mb-4">No timezones added yet</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Add Your First City
                </button>
              </div>
            )}
          </div>

          {/* Long Description */}
          <div className="border-t dark:border-gray-700 pt-8">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                About World Clock & Timezone Converter
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                Our comprehensive World Clock and Timezone Converter tool helps you stay connected with people across the globe by providing real-time clock displays for multiple cities and countries. Whether you're coordinating international business meetings, planning travel itineraries, or staying in touch with friends and family worldwide, this tool makes time zone management effortless.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                The tool features an intuitive interface that displays accurate local times for your selected cities, complete with date information and UTC offset indicators. You can easily add or remove cities from your world clock dashboard, making it perfect for remote workers, international businesses, global teams, and frequent travelers who need to coordinate across multiple time zones.
              </p>

              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Key features include real-time clock updates, support for all major world cities and time zones, daylight saving time automatic adjustments, clean responsive design that works on all devices, and the ability to customize your timezone selection based on your specific needs. The tool is completely free to use and requires no registration or installation.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Perfect For:</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Remote team coordination</li>
                    <li>• International business meetings</li>
                    <li>• Travel planning and scheduling</li>
                    <li>• Global project management</li>
                    <li>• Staying connected with family abroad</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Features:</h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                    <li>• Real-time clock updates</li>
                    <li>• 20+ major world cities</li>
                    <li>• Automatic DST handling</li>
                    <li>• Mobile-responsive design</li>
                    <li>• Dark/light theme support</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}