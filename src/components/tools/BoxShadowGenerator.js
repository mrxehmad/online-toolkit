import React, { useState, useEffect, useRef } from 'react';
import { Copy, Download, Palette, Zap, RefreshCw, Eye, Code, Smartphone, Tablet, Monitor } from 'lucide-react';

export default function BoxShadowGenerator() {
  const [selectedStyle, setSelectedStyle] = useState(0);
  const [customShadow, setCustomShadow] = useState({
    horizontal: 0,
    vertical: 8,
    blur: 25,
    spread: 0,
    color: '#000000',
    opacity: 15,
    inset: false
  });
  const [activeTab, setActiveTab] = useState('presets');
  const [copySuccess, setCopySuccess] = useState('');
  const [viewMode, setViewMode] = useState('desktop');
  
  const resultRef = useRef(null);

  // 25 predefined shadow styles
  const shadowStyles = [
    { name: 'Soft Glow', shadow: '0 8px 25px rgba(0, 0, 0, 0.15)', description: 'Gentle elevated appearance' },
    { name: 'Sharp Drop', shadow: '0 4px 8px rgba(0, 0, 0, 0.25)', description: 'Clean, defined shadow' },
    { name: 'Floating Card', shadow: '0 12px 40px rgba(0, 0, 0, 0.12)', description: 'Material Design inspired' },
    { name: 'Deep Shadow', shadow: '0 20px 50px rgba(0, 0, 0, 0.3)', description: 'Strong depth effect' },
    { name: 'Subtle Lift', shadow: '0 2px 10px rgba(0, 0, 0, 0.08)', description: 'Minimal elevation' },
    { name: 'Neon Glow', shadow: '0 0 20px rgba(59, 130, 246, 0.6)', description: 'Blue neon effect' },
    { name: 'Inner Shadow', shadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.15)', description: 'Pressed/inset appearance' },
    { name: 'Multi-Layer', shadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)', description: 'Complex layered shadow' },
    { name: 'Neumorphism', shadow: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff', description: 'Soft UI trend' },
    { name: 'Retro Box', shadow: '8px 8px 0px rgba(0, 0, 0, 0.2)', description: '8-bit style shadow' },
    { name: 'Colored Drop', shadow: '0 8px 25px rgba(255, 99, 71, 0.3)', description: 'Tomato colored shadow' },
    { name: 'Spread Wide', shadow: '0 0 0 8px rgba(59, 130, 246, 0.1)', description: 'Wide spread effect' },
    { name: 'Bottom Heavy', shadow: '0 15px 35px rgba(0, 0, 0, 0.2)', description: 'Shadow below only' },
    { name: 'Left Skew', shadow: '-10px 10px 20px rgba(0, 0, 0, 0.15)', description: 'Skewed to left' },
    { name: 'Right Skew', shadow: '10px 10px 20px rgba(0, 0, 0, 0.15)', description: 'Skewed to right' },
    { name: 'Purple Haze', shadow: '0 10px 30px rgba(147, 51, 234, 0.4)', description: 'Purple tinted shadow' },
    { name: 'Green Glow', shadow: '0 0 25px rgba(34, 197, 94, 0.5)', description: 'Green ambient glow' },
    { name: 'Double Layer', shadow: '0 4px 14px rgba(0, 0, 0, 0.09), 0 2px 6px rgba(0, 0, 0, 0.12)', description: 'Two-tier shadow' },
    { name: 'Harsh Light', shadow: '0 25px 50px rgba(0, 0, 0, 0.4)', description: 'Strong directional shadow' },
    { name: 'Ambient Light', shadow: '0 0 50px rgba(0, 0, 0, 0.1)', description: 'All-around glow' },
    { name: 'Press Effect', shadow: 'inset 0 4px 8px rgba(0, 0, 0, 0.2)', description: 'Button press illusion' },
    { name: 'Orange Burst', shadow: '0 8px 32px rgba(255, 165, 0, 0.35)', description: 'Orange colored shadow' },
    { name: 'Cyan Pop', shadow: '0 6px 20px rgba(6, 182, 212, 0.4)', description: 'Cyan accent shadow' },
    { name: 'Pink Dreams', shadow: '0 10px 25px rgba(236, 72, 153, 0.3)', description: 'Pink fantasy shadow' },
    { name: 'Ultra Minimal', shadow: '0 1px 3px rgba(0, 0, 0, 0.05)', description: 'Barely there shadow' }
  ];

  // Generate custom shadow CSS
  const generateCustomShadow = () => {
    const { horizontal, vertical, blur, spread, color, opacity, inset } = customShadow;
    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
    };
    
    const shadowColor = hexToRgba(color, opacity);
    const insetText = inset ? 'inset ' : '';
    return `${insetText}${horizontal}px ${vertical}px ${blur}px ${spread}px ${shadowColor}`;
  };

  const getCurrentShadow = () => {
    return activeTab === 'presets' ? shadowStyles[selectedStyle].shadow : generateCustomShadow();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  const generateCSS = () => {
    const shadow = getCurrentShadow();
    return `box-shadow: ${shadow};
-webkit-box-shadow: ${shadow};
-moz-box-shadow: ${shadow};`;
  };

  const scrollToResult = () => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 1200);
  };

  useEffect(() => {
    if (activeTab === 'custom') {
      scrollToResult();
    }
  }, [customShadow]);

  useEffect(() => {
    if (activeTab === 'presets') {
      scrollToResult();
    }
  }, [selectedStyle]);

  const getViewModeClass = () => {
    switch (viewMode) {
      case 'mobile': return 'w-32 h-32';
      case 'tablet': return 'w-48 h-48';
      default: return 'w-64 h-64';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      {/* SEO Metadata */}
      <div style={{ display: 'none' }}>
        <title>Box Shadow Generator - Create Beautiful CSS Shadows | Free Online Tool</title>
        <meta name="description" content="Generate stunning CSS box shadows with our free online tool. 25+ preset styles, custom controls, and instant code generation. Perfect for web designers and developers." />
        <link rel="canonical" href="/box-shadow-generator" />
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Palette className="w-12 h-12 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
              Box Shadow Generator
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Create stunning CSS box shadows with our comprehensive online tool. Choose from 25+ carefully crafted preset styles 
            or build your own custom shadows with intuitive controls. Generate clean, cross-browser compatible CSS code instantly. 
            Perfect for web designers, developers, and anyone looking to add depth and visual appeal to their projects. 
            Features real-time preview, responsive design testing, and one-click code copying for seamless workflow integration.
          </p>
        </div>

        {/* Main Tool Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          {/* Tab Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('presets')}
                className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'presets' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Zap className="w-4 h-4 mr-2" />
                Presets
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`flex items-center px-4 py-2 rounded-md transition-all duration-200 ${
                  activeTab === 'custom' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Custom
              </button>
            </div>
            
            {/* View Mode Selector */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 ml-auto">
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'mobile' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('tablet')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'tablet' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === 'desktop' 
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preset Styles Grid */}
          {activeTab === 'presets' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {shadowStyles.map((style, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedStyle(index)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    selectedStyle === index
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div
                    className="w-full h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-3 transition-all duration-300"
                    style={{ boxShadow: style.shadow }}
                  ></div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{style.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{style.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Custom Controls */}
          {activeTab === 'custom' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Horizontal Offset: {customShadow.horizontal}px
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={customShadow.horizontal}
                    onChange={(e) => setCustomShadow({...customShadow, horizontal: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vertical Offset: {customShadow.vertical}px
                  </label>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={customShadow.vertical}
                    onChange={(e) => setCustomShadow({...customShadow, vertical: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blur Radius: {customShadow.blur}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={customShadow.blur}
                    onChange={(e) => setCustomShadow({...customShadow, blur: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Spread Radius: {customShadow.spread}px
                  </label>
                  <input
                    type="range"
                    min="-20"
                    max="20"
                    value={customShadow.spread}
                    onChange={(e) => setCustomShadow({...customShadow, spread: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Shadow Color
                  </label>
                  <input
                    type="color"
                    value={customShadow.color}
                    onChange={(e) => setCustomShadow({...customShadow, color: e.target.value})}
                    className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Opacity: {customShadow.opacity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={customShadow.opacity}
                    onChange={(e) => setCustomShadow({...customShadow, opacity: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={customShadow.inset}
                      onChange={(e) => setCustomShadow({...customShadow, inset: e.target.checked})}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Inset Shadow</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div ref={resultRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Preview & Code</h2>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Viewing: {viewMode} size
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-8 flex items-center justify-center min-h-[300px]">
              <div
                className={`bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl transition-all duration-300 ${getViewModeClass()}`}
                style={{ boxShadow: getCurrentShadow() }}
              ></div>
            </div>

            {/* Code Output */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Code className="w-4 h-4 text-gray-600 dark:text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS Code</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(generateCSS())}
                    className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copySuccess || 'Copy'}
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{generateCSS()}</code>
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Box Shadow Value</span>
                  <button
                    onClick={() => copyToClipboard(getCurrentShadow())}
                    className="flex items-center px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                  </button>
                </div>
                <pre className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{getCurrentShadow()}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Why Use Our Box Shadow Generator?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <Zap className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">25+ Presets</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Carefully crafted shadow styles for every design need, from subtle to dramatic effects.
              </p>
            </div>
            <div className="text-center p-4">
              <RefreshCw className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Custom Controls</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Fine-tune every aspect with intuitive sliders and controls for perfect customization.
              </p>
            </div>
            <div className="text-center p-4">
              <Eye className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Live Preview</h3>
              <p className="text-gray-600 dark:text-gray-300">
                See your shadows in real-time across different device sizes and viewports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}