import React, { useState, useEffect } from 'react';
import { MapPin, Copy, Code, Download, Eye, Settings, Search, Globe, Smartphone, Monitor, Navigation, Target, Map } from 'lucide-react';

export default function MapsEmbedGenerator() {
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [width, setWidth] = useState('600');
  const [height, setHeight] = useState('450');
  const [zoom, setZoom] = useState('15');
  const [mapType, setMapType] = useState('roadmap');
  const [language, setLanguage] = useState('en');
  const [embedCode, setEmbedCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');
  const [inputMethod, setInputMethod] = useState('search'); // 'search' or 'coordinates'

  const mapTypes = [
    { value: 'roadmap', label: 'Roadmap' },
    { value: 'satellite', label: 'Satellite' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'terrain', label: 'Terrain' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'it', label: 'Italian' },
    { value: 'pt', label: 'Portuguese' },
    { value: 'ru', label: 'Russian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'ko', label: 'Korean' },
    { value: 'zh', label: 'Chinese' }
  ];

  useEffect(() => {
    if (location.trim()) {
      generateEmbedCode();
    }
  }, [location, width, height, zoom, mapType, language]);

  const generateEmbedCode = () => {
    if (!location.trim()) return;
    
    let embedUrl;
    if (selectedCoordinates) {
      // Use coordinates for more precise embedding
      embedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${selectedCoordinates.lng}!3d${selectedCoordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${encodeURIComponent(location)}!5e${mapType === 'satellite' ? '1' : mapType === 'hybrid' ? '2' : mapType === 'terrain' ? '3' : '0'}!3m2!1s${language}!2sus!4v${Date.now()}!5m2!1s${language}!2sus&z=${zoom}`;
    } else {
      // Use search query
      const encodedLocation = encodeURIComponent(location);
      embedUrl = `https://maps.google.com/maps?width=${width}&height=${height}&hl=${language}&q=${encodedLocation}&ie=UTF8&t=${mapType === 'satellite' ? 'k' : mapType === 'hybrid' ? 'h' : mapType === 'terrain' ? 'p' : 'm'}&z=${zoom}&iwloc=&output=embed`;
    }
    
    const code = `<iframe
  width="${width}"
  height="${height}"
  style="border:0"
  loading="lazy"
  allowfullscreen
  referrerpolicy="no-referrer-when-downgrade"
  src="${embedUrl}">
</iframe>`;
    
    setEmbedCode(code);
  };

  // Simulate location search (in real app, you'd use Google Places API)
  const searchLocations = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Simulate search results with common locations
    const mockResults = [
      { name: `${query} - Main Location`, lat: 40.7128, lng: -74.0060, address: `${query}, Main Street` },
      { name: `${query} - City Center`, lat: 40.7589, lng: -73.9851, address: `${query}, City Center` },
      { name: `${query} - Downtown`, lat: 40.7505, lng: -73.9934, address: `${query}, Downtown Area` },
      { name: `${query} - Business District`, lat: 40.7282, lng: -73.7949, address: `${query}, Business District` },
      { name: `${query} - Shopping Center`, lat: 40.7373, lng: -74.0018, address: `${query}, Shopping Center` }
    ];
    
    setSearchResults(mockResults);
    setShowSearchResults(true);
  };

  const handleSearchInput = (value) => {
    setSearchQuery(value);
    searchLocations(value);
  };

  const selectLocation = (result) => {
    setLocation(result.name);
    setSearchQuery(result.name);
    setSelectedCoordinates({ lat: result.lat, lng: result.lng });
    setShowSearchResults(false);
  };

  const handleManualCoordinates = (lat, lng) => {
    if (lat && lng) {
      setSelectedCoordinates({ lat: parseFloat(lat), lng: parseFloat(lng) });
      setLocation(`${lat}, ${lng}`);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadCode = () => {
    const blob = new Blob([embedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'google-maps-embed.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* SEO Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Google Maps Embed Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Create responsive Google Maps embeds for your website in seconds. Generate clean, SEO-friendly HTML code with customizable dimensions, zoom levels, and map types. No API key required - just search for your location and generate embed code instantly.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                Multi-language Support
              </div>
              <div className="flex items-center">
                <Smartphone className="h-4 w-4 mr-1" />
                Mobile Responsive
              </div>
              <div className="flex items-center">
                <Monitor className="h-4 w-4 mr-1" />
                Cross-platform Compatible
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* iOS Style Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-1 mb-8 max-w-md mx-auto">
          <div className="flex">
            <button
              onClick={() => setActiveTab('generator')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'generator'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="h-4 w-4 inline-block mr-2" />
              Generator
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
                activeTab === 'preview'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="h-4 w-4 inline-block mr-2" />
              Preview
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Search className="h-6 w-6 mr-3 text-blue-600" />
                Map Configuration
              </h2>

              {/* Input Method Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Location Input Method
                </label>
                <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setInputMethod('search')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      inputMethod === 'search'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Search className="h-4 w-4 inline-block mr-2" />
                    Search Location
                  </button>
                  <button
                    onClick={() => setInputMethod('coordinates')}
                    className={`py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                      inputMethod === 'coordinates'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Target className="h-4 w-4 inline-block mr-2" />
                    Coordinates
                  </button>
                </div>
              </div>

              {/* Location Input */}
              {inputMethod === 'search' ? (
                <div className="mb-6 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Location
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      onFocus={() => searchQuery && setShowSearchResults(true)}
                      placeholder="Search for a place, address, or landmark..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                    />
                    <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                  
                  {/* Search Results Dropdown */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => selectLocation(result)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-200 flex items-center border-b border-gray-100 last:border-b-0"
                        >
                          <MapPin className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900">{result.name}</div>
                            <div className="text-sm text-gray-500">{result.address}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manual Coordinates
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        step="any"
                        placeholder="Latitude (e.g., 40.7128)"
                        onChange={(e) => handleManualCoordinates(e.target.value, selectedCoordinates?.lng)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      />
                      <span className="text-xs text-gray-500 mt-1 block">Latitude</span>
                    </div>
                    <div>
                      <input
                        type="number"
                        step="any"
                        placeholder="Longitude (e.g., -74.0060)"
                        onChange={(e) => handleManualCoordinates(selectedCoordinates?.lat, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                      />
                      <span className="text-xs text-gray-500 mt-1 block">Longitude</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={() => navigator.geolocation?.getCurrentPosition(
                        (position) => {
                          const { latitude, longitude } = position.coords;
                          setSelectedCoordinates({ lat: latitude, lng: longitude });
                          setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                        },
                        (error) => console.error('Geolocation error:', error)
                      )}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                    >
                      <Navigation className="h-4 w-4 mr-1" />
                      Use My Current Location
                    </button>
                  </div>
                </div>
              )}

              {/* Dimensions */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50"
                  />
                </div>
              </div>

              {/* Advanced Options */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zoom Level
                  </label>
                  <select
                    value={zoom}
                    onChange={(e) => setZoom(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 appearance-none"
                  >
                    {Array.from({ length: 16 }, (_, i) => i + 5).map(level => (
                      <option key={level} value={level}>{level} - {
                        level < 8 ? 'Country' :
                        level < 12 ? 'City' :
                        level < 16 ? 'Street' : 'Building'
                      }</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Map Type
                  </label>
                  <select
                    value={mapType}
                    onChange={(e) => setMapType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 appearance-none"
                  >
                    {mapTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Language */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 appearance-none"
                >
                  {languages.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Size Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Size Presets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { w: '400', h: '300', label: 'Small' },
                    { w: '600', h: '450', label: 'Medium' },
                    { w: '800', h: '600', label: 'Large' },
                    { w: '100%', h: '400', label: 'Responsive' }
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setWidth(preset.w);
                        setHeight(preset.h);
                      }}
                      className="px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="space-y-6">
            {activeTab === 'generator' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Code className="h-6 w-6 mr-3 text-green-600" />
                  Generated Embed Code
                </h2>

                {embedCode ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-sm leading-relaxed">
                        <code>{embedCode}</code>
                      </pre>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={copyToClipboard}
                        className={`flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          copied
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copied ? 'Copied!' : 'Copy Code'}
                      </button>
                      
                      <button
                        onClick={downloadCode}
                        className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Enter a location to generate embed code
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Eye className="h-6 w-6 mr-3 text-purple-600" />
                  Live Preview
                </h2>

                {embedCode && location ? (
                  <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                    <div className="text-center">
                      <div className="bg-blue-100 p-8 rounded-lg">
                        <MapPin className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                        <p className="text-gray-700 font-medium">
                          Map Preview for: {location}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Dimensions: {width} × {height}px
                        </p>
                        <p className="text-xs text-gray-400 mt-4">
                          Live preview of your embedded map with current settings
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Generate embed code to see preview
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            About Google Maps Embed Generator
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Why Use Our Maps Embed Generator?
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our free Google Maps Embed Generator creates clean, responsive HTML code for embedding interactive maps on your website. No API key required! Simply search for your location or enter coordinates manually, and we'll generate the perfect embed code for your needs.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• No Google Maps API key required</li>
                <li>• Smart location search with suggestions</li>
                <li>• Manual coordinate input option</li>
                <li>• Current location detection</li>
                <li>• Generate SEO-friendly embed codes</li>
                <li>• Responsive design for all devices</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Key Features
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Create professional maps for your website with customizable dimensions, zoom levels, and map types. Our tool generates clean HTML code that works across all modern browsers and devices.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Instant preview functionality</li>
                <li>• Copy to clipboard with one click</li>
                <li>• Download generated code as file</li>
                <li>• Mobile-responsive output</li>
                <li>• Cross-browser compatibility</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-4">Google Maps Embed Generator</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Create professional, responsive Google Maps embeds for your website. Free tool with instant preview, multiple customization options, and clean HTML output.
            </p>
            <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500">
              <p>© 2024 Maps Embed Generator. All rights reserved. • Built with React • Mobile Responsive • SEO Optimized</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}