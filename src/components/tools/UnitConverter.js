import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRightLeft, Ruler, Weight, Thermometer, Square, Droplets } from 'lucide-react';

// SEO Component
const SEO = () => {
  useEffect(() => {
    // Set page title
    document.title = 'Unit Converter Tool - Length, Weight, Temperature & More | Free Online Calculator';
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', 'Free online unit converter tool for length, weight, temperature, area, and volume measurements. Convert between metric, imperial, and other unit systems instantly. Mobile-friendly and accurate.');
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }
    
    // Set canonical URL
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.href);
    if (!document.querySelector('link[rel="canonical"]')) {
      document.head.appendChild(canonical);
    }
  }, []);
  
  return null;
};

const UnitConverter = () => {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState('');

  // Conversion data
  const conversions = {
    length: {
      name: 'Length',
      icon: Ruler,
      units: {
        meters: { name: 'Meters', factor: 1 },
        feet: { name: 'Feet', factor: 3.28084 },
        inches: { name: 'Inches', factor: 39.3701 },
        centimeters: { name: 'Centimeters', factor: 100 },
        millimeters: { name: 'Millimeters', factor: 1000 },
        kilometers: { name: 'Kilometers', factor: 0.001 },
        miles: { name: 'Miles', factor: 0.000621371 },
        yards: { name: 'Yards', factor: 1.09361 }
      }
    },
    weight: {
      name: 'Weight',
      icon: Weight,
      units: {
        kilograms: { name: 'Kilograms', factor: 1 },
        pounds: { name: 'Pounds', factor: 2.20462 },
        grams: { name: 'Grams', factor: 1000 },
        ounces: { name: 'Ounces', factor: 35.274 },
        tons: { name: 'Tons (Metric)', factor: 0.001 },
        stones: { name: 'Stones', factor: 0.157473 }
      }
    },
    temperature: {
      name: 'Temperature',
      icon: Thermometer,
      units: {
        celsius: { name: 'Celsius (°C)' },
        fahrenheit: { name: 'Fahrenheit (°F)' },
        kelvin: { name: 'Kelvin (K)' }
      }
    },
    area: {
      name: 'Area',
      icon: Square,
      units: {
        square_meters: { name: 'Square Meters', factor: 1 },
        square_feet: { name: 'Square Feet', factor: 10.7639 },
        square_inches: { name: 'Square Inches', factor: 1550 },
        square_centimeters: { name: 'Square Centimeters', factor: 10000 },
        acres: { name: 'Acres', factor: 0.000247105 },
        hectares: { name: 'Hectares', factor: 0.0001 }
      }
    },
    volume: {
      name: 'Volume',
      icon: Droplets,
      units: {
        liters: { name: 'Liters', factor: 1 },
        gallons: { name: 'Gallons (US)', factor: 0.264172 },
        milliliters: { name: 'Milliliters', factor: 1000 },
        cubic_meters: { name: 'Cubic Meters', factor: 0.001 },
        cups: { name: 'Cups (US)', factor: 4.22675 },
        pints: { name: 'Pints (US)', factor: 2.11338 },
        quarts: { name: 'Quarts (US)', factor: 1.05669 }
      }
    }
  };

  // Temperature conversion functions
  const convertTemperature = (value, from, to) => {
    let celsius;
    
    // Convert to Celsius first
    switch (from) {
      case 'fahrenheit':
        celsius = (value - 32) * 5/9;
        break;
      case 'kelvin':
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }
    
    // Convert from Celsius to target
    switch (to) {
      case 'fahrenheit':
        return celsius * 9/5 + 32;
      case 'kelvin':
        return celsius + 273.15;
      default:
        return celsius;
    }
  };

  // General conversion function
  const convertValue = (value, from, to, category) => {
    if (!value || value === '') return '';
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    
    if (category === 'temperature') {
      return convertTemperature(numValue, from, to);
    }
    
    const units = conversions[category].units;
    const fromFactor = units[from].factor;
    const toFactor = units[to].factor;
    
    // Convert to base unit, then to target unit
    const baseValue = numValue / fromFactor;
    return baseValue * toFactor;
  };

  // Update result when inputs change
  useEffect(() => {
    const converted = convertValue(inputValue, fromUnit, toUnit, category);
    if (converted !== '') {
      setResult(converted.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      setResult('');
    }
  }, [inputValue, fromUnit, toUnit, category]);

  // Update units when category changes
  useEffect(() => {
    const units = Object.keys(conversions[category].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setInputValue('');
    setResult('');
  }, [category]);

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    
    if (inputValue && result) {
      setInputValue(result);
    }
  };

  const currentCategory = conversions[category];
  const CategoryIcon = currentCategory.icon;

  return (
    <>
      <SEO />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Calculator className="w-12 h-12 text-blue-600 dark:text-blue-400 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Unit Converter
              </h1>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Convert between different units of measurement instantly and accurately
            </p>
          </div>

          {/* Main Tool Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8 transition-colors duration-300">
            {/* Category Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Select Category
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(conversions).map(([key, cat]) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => setCategory(key)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${
                        category === key
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm font-medium">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conversion Interface */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* From Unit */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    From
                  </label>
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {Object.entries(currentCategory.units).map(([key, unit]) => (
                      <option key={key} value={key}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter value"
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {/* To Unit */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To
                  </label>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    {Object.entries(currentCategory.units).map(([key, unit]) => (
                      <option key={key} value={key}>
                        {unit.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={result}
                    readOnly
                    placeholder="Result"
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-white text-xl transition-colors"
                  />
                  {result && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center mb-6">
              <button
                onClick={swapUnits}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
              >
                <ArrowRightLeft className="w-4 h-4" />
                Swap Units
              </button>
            </div>

            {/* Current Conversion Display */}
            {inputValue && result && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center justify-center">
                  <CategoryIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-blue-900 dark:text-blue-100 font-medium text-lg">
                    {inputValue} {currentCategory.units[fromUnit].name} = {result} {currentCategory.units[toUnit].name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About Our Unit Converter Tool
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our comprehensive unit converter tool provides accurate and instant conversions between different units of measurement. 
                Whether you're working with length, weight, temperature, area, or volume measurements, this tool makes it easy to convert 
                between metric, imperial, and other unit systems.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Supported Conversion Categories
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li><strong>Length:</strong> Convert between meters, feet, inches, centimeters, millimeters, kilometers, miles, and yards</li>
                <li><strong>Weight:</strong> Convert between kilograms, pounds, grams, ounces, metric tons, and stones</li>
                <li><strong>Temperature:</strong> Convert between Celsius, Fahrenheit, and Kelvin</li>
                <li><strong>Area:</strong> Convert between square meters, square feet, square inches, acres, and hectares</li>
                <li><strong>Volume:</strong> Convert between liters, gallons, milliliters, cubic meters, cups, pints, and quarts</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Features
              </h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>✓ Real-time conversion as you type</li>
                <li>✓ High precision calculations with up to 6 decimal places</li>
                <li>✓ Easy unit swapping with one click</li>
                <li>✓ Mobile-responsive design for use on any device</li>
                <li>✓ Dark and light mode support</li>
                <li>✓ No registration required - completely free to use</li>
              </ul>
              
              <p className="text-gray-600 dark:text-gray-300">
                Perfect for students, engineers, scientists, cooks, travelers, and anyone who needs quick and accurate unit conversions. 
                All calculations are performed client-side, ensuring your data remains private and the tool works offline once loaded.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnitConverter;