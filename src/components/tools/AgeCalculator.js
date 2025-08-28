import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Calculator, Heart } from 'lucide-react';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [currentAge, setCurrentAge] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // SEO Metadata (would be handled by your site's head management)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Age Calculator - Calculate Your Exact Age in Years, Months, Days, Hours, Minutes & Seconds';
      
      // Create or update meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = 'Free online age calculator tool. Calculate your exact age in years, months, days, hours, minutes, and seconds from your date of birth. Accurate, fast, and easy to use.';
      
      // Canonical URL
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.appendChild(canonical);
      }
      canonical.href = window.location.href;
    }
  }, []);

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return null;
    
    setIsCalculating(true);
    
    setTimeout(() => {
      const birth = new Date(birthDateString);
      const now = new Date();
      
      if (birth > now) {
        setCurrentAge({ error: 'Birth date cannot be in the future!' });
        setIsCalculating(false);
        return;
      }
      
      // Calculate differences
      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();
      let hours = now.getHours() - birth.getHours();
      let minutes = now.getMinutes() - birth.getMinutes();
      let seconds = now.getSeconds() - birth.getSeconds();
      
      // Adjust for negative values
      if (seconds < 0) {
        seconds += 60;
        minutes--;
      }
      if (minutes < 0) {
        minutes += 60;
        hours--;
      }
      if (hours < 0) {
        hours += 24;
        days--;
      }
      if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }
      
      // Calculate total values
      const totalDays = Math.floor((now - birth) / (1000 * 60 * 60 * 24));
      const totalHours = Math.floor((now - birth) / (1000 * 60 * 60));
      const totalMinutes = Math.floor((now - birth) / (1000 * 60));
      const totalSeconds = Math.floor((now - birth) / 1000);
      const totalWeeks = Math.floor(totalDays / 7);
      
      setCurrentAge({
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds,
        totalWeeks,
        birthDate: birth.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      });
      setIsCalculating(false);
    }, 300);
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setBirthDate(value);
    if (value) {
      calculateAge(value);
    } else {
      setCurrentAge(null);
    }
  };

  const resetCalculator = () => {
    setBirthDate('');
    setCurrentAge(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-500 dark:bg-blue-600 p-3 rounded-full shadow-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            Age Calculator
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Calculate your exact age in years, months, days, hours, minutes, and seconds from your date of birth
          </p>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <User className="h-6 w-6 text-blue-500 dark:text-blue-400 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Enter Your Birth Date
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="birthdate"
                  value={birthDate}
                  onChange={handleDateChange}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg transition-all duration-200"
                />
              </div>

              {birthDate && (
                <button
                  onClick={resetCalculator}
                  className="w-full md:w-auto px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Calculator className="h-5 w-5" />
                  Reset Calculator
                </button>
              )}
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {isCalculating && (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              )}

              {currentAge && !currentAge.error && !isCalculating && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-6 border border-blue-100 dark:border-gray-600">
                  <div className="flex items-center mb-4">
                    <Heart className="h-5 w-5 text-red-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Age</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentAge.years}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Years</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{currentAge.months}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Months</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{currentAge.days}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Days</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{currentAge.hours}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Hours</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">{currentAge.minutes}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Minutes</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{currentAge.seconds}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Seconds</div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <p><strong>Born on:</strong> {currentAge.birthDate}</p>
                    <p><strong>Total Days Lived:</strong> {currentAge.totalDays.toLocaleString()}</p>
                    <p><strong>Total Hours:</strong> {currentAge.totalHours.toLocaleString()}</p>
                    <p><strong>Total Minutes:</strong> {currentAge.totalMinutes.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {currentAge && currentAge.error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <p className="text-red-700 dark:text-red-400 text-center">{currentAge.error}</p>
                </div>
              )}

              {!birthDate && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center">
                  <Clock className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Select your birth date above to calculate your exact age
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEO Description */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
            About Our Age Calculator Tool
          </h2>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Our precise Age Calculator is a comprehensive tool designed to calculate your exact age down to the second. 
              Unlike simple age calculators that only show years, our advanced calculator provides detailed breakdown including 
              years, months, days, hours, minutes, and seconds since your birth date.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Key Features:</h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-6">
              <li>• <strong>Precise Calculations:</strong> Get your age calculated down to the exact second</li>
              <li>• <strong>Multiple Time Units:</strong> View your age in years, months, days, hours, minutes, and seconds</li>
              <li>• <strong>Total Statistics:</strong> See total days lived, hours experienced, and minutes of life</li>
              <li>• <strong>Birth Day Information:</strong> Display the exact day of the week you were born</li>
              <li>• <strong>Real-time Updates:</strong> Age updates automatically as time passes</li>
              <li>• <strong>Mobile Responsive:</strong> Works perfectly on all devices and screen sizes</li>
            </ul>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">How to Use:</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Simply select your birth date using the date picker above. The calculator will instantly compute and display 
              your exact age in multiple formats. The tool automatically handles leap years, different month lengths, and 
              time zone considerations to provide the most accurate age calculation possible.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Applications:</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This age calculator is perfect for various purposes including filling out forms that require exact age, 
              celebrating milestones, planning events, legal documentation, medical appointments, insurance applications, 
              and satisfying curiosity about your life statistics. Whether you need your age for professional or personal 
              reasons, our tool provides the precision you need.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">Privacy & Security:</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your privacy is important to us. All calculations are performed entirely in your browser - no data is sent to 
              our servers or stored anywhere. Your birth date and age information remain completely private and secure on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}