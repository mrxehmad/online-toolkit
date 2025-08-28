import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, RotateCcw } from 'lucide-react';

// Mock useTheme hook for demo purposes
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  return { theme, setTheme };
};

export default function DateDifferenceCalculator() {
  const { theme } = useTheme();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeEndDate, setIncludeEndDate] = useState(false);
  const [results, setResults] = useState(null);

  // SEO metadata
  useEffect(() => {
    document.title = 'Date Difference Calculator - Calculate Days, Months, Years Between Dates';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Free online date difference calculator. Calculate exact number of days, weeks, months, and years between two dates. Perfect for age calculation, project planning, and date arithmetic.'
      );
    }
    
    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', window.location.href);
    }
  }, []);

  const calculateDifference = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Adjust end date if including it
    const adjustedEnd = includeEndDate ? new Date(end.getTime() + 24 * 60 * 60 * 1000) : end;
    
    // Ensure start is before end
    const earlierDate = start <= end ? start : end;
    const laterDate = start <= end ? adjustedEnd : new Date(start.getTime() + (includeEndDate ? 24 * 60 * 60 * 1000 : 0));
    
    // Calculate differences
    const timeDiff = laterDate.getTime() - earlierDate.getTime();
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const weeksDiff = Math.floor(daysDiff / 7);
    const monthsDiff = getMonthsDifference(earlierDate, laterDate);
    const yearsDiff = Math.floor(monthsDiff / 12);
    
    // Calculate detailed breakdown
    const years = Math.floor(monthsDiff / 12);
    const remainingMonths = monthsDiff % 12;
    const tempDate = new Date(earlierDate);
    tempDate.setFullYear(tempDate.getFullYear() + years);
    tempDate.setMonth(tempDate.getMonth() + remainingMonths);
    const remainingDays = Math.floor((laterDate.getTime() - tempDate.getTime()) / (1000 * 60 * 60 * 24));

    setResults({
      totalDays: daysDiff,
      totalWeeks: weeksDiff,
      totalMonths: monthsDiff,
      totalYears: yearsDiff,
      breakdown: {
        years,
        months: remainingMonths,
        days: remainingDays
      },
      startDate: earlierDate,
      endDate: laterDate,
      isReversed: start > end
    });
  };

  const getMonthsDifference = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
  };

  const resetCalculator = () => {
    setStartDate('');
    setEndDate('');
    setIncludeEndDate(false);
    setResults(null);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-300">
      {/* Main Container */}
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <Calendar className="w-12 h-12 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Date Difference Calculator
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Calculate the exact difference between two dates with precision and ease
          </p>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8 transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Start Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 inline mr-2" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={today}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                <Calendar className="w-4 h-4 inline mr-2" />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all duration-200"
              />
            </div>
          </div>

          {/* Include End Date Option */}
          <div className="mb-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEndDate}
                onChange={(e) => setIncludeEndDate(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 
                         border-gray-300 dark:border-gray-600 rounded
                         focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Include end date in calculation
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={calculateDifference}
              disabled={!startDate || !endDate}
              className="flex-1 flex items-center justify-center px-6 py-3 
                       bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400
                       text-white font-medium rounded-lg transition-all duration-200
                       disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Clock className="w-5 h-5 mr-2" />
              Calculate Difference
            </button>
            
            <button
              onClick={resetCalculator}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600
                       text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                       font-medium rounded-lg transition-all duration-200 flex items-center justify-center
                       transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </button>
          </div>
        </div>

        {/* Results Card */}
        {results && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8 
                         animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Calculation Results
              </h2>
              {results.isReversed && (
                <p className="text-amber-600 dark:text-amber-400 text-sm">
                  Note: Dates were automatically reordered for calculation
                </p>
              )}
              <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span>{formatDate(results.startDate)}</span>
                <ArrowRight className="w-4 h-4 mx-2" />
                <span>{formatDate(new Date(results.endDate.getTime() - (includeEndDate ? 24 * 60 * 60 * 1000 : 0)))}</span>
              </div>
            </div>

            {/* Main Result */}
            <div className="text-center mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {results.breakdown.years > 0 && `${results.breakdown.years} years, `}
                {results.breakdown.months > 0 && `${results.breakdown.months} months, `}
                {results.breakdown.days} days
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Exact difference between the selected dates
              </p>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {results.totalDays.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Days</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {results.totalWeeks.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Weeks</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {results.totalMonths.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Months</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.floor(results.totalYears).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Years</div>
              </div>
            </div>
          </div>
        )}

        {/* Description Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About This Date Difference Calculator
          </h2>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Our comprehensive date difference calculator helps you determine the exact time span between any two dates. 
              Whether you're calculating your age, planning a project timeline, determining employment duration, or simply 
              curious about the time that has passed between significant events, this tool provides accurate and detailed results.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
              Key Features:
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Precise Calculations</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get exact results in years, months, days, weeks, and total days between any two dates.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Flexible Date Input</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose any start and end date, with automatic date reordering for convenience.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Include End Date Option</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Toggle whether to include the end date in your calculations for complete accuracy.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Responsive Design</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Works perfectly on desktop, tablet, and mobile devices with dark/light mode support.
                </p>
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
              Common Use Cases:
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This date calculator is perfect for calculating ages, determining project durations, measuring employment 
              periods, planning events, calculating loan terms, measuring relationship milestones, academic semester 
              lengths, travel planning, retirement countdown, and historical research. The tool handles leap years 
              and varying month lengths automatically for maximum accuracy.
            </p>
            
            <p className="text-gray-600 dark:text-gray-400">
              All calculations are performed client-side for privacy and speed, with no data stored or transmitted. 
              The results include both a human-readable breakdown and precise numerical values for all your date 
              calculation needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}