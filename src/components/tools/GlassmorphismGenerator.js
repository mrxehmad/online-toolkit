import React, { useState, useRef, useEffect } from 'react';
import { Copy, Download, Palette, Layers, Sparkles, Eye, Code, RefreshCw } from 'lucide-react';

export default function GlassmorphismGenerator() {
  const [config, setConfig] = useState({
    // Glassmorphism settings
    backdropBlur: 10,
    backgroundOpacity: 0.25,
    borderOpacity: 0.18,
    borderWidth: 1,
    borderRadius: 16,
    shadowBlur: 40,
    shadowOpacity: 0.5,
    shadowX: 8,
    shadowY: 8,
    
    // Neumorphism settings
    neuEnabled: false,
    neuDistance: 20,
    neuIntensity: 0.15,
    neuLightColor: '#ffffff',
    neuDarkColor: '#000000',
    
    // Colors
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
    
    // Content
    width: 320,
    height: 200,
    padding: 24
  });

  const [activeTab, setActiveTab] = useState('glassmorphism');
  const [copied, setCopied] = useState(false);
  const previewRef = useRef(null);
  const resultRef = useRef(null);

  const scrollToResult = () => {
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 1200);
  };

  useEffect(() => {
    scrollToResult();
  }, [config]);

  const generateGlassmorphismCSS = () => {
    const { backdropBlur, backgroundOpacity, borderOpacity, borderWidth, borderRadius, shadowBlur, shadowOpacity, shadowX, shadowY, backgroundColor, borderColor } = config;
    
    const bgColorRgb = hexToRgb(backgroundColor);
    const borderColorRgb = hexToRgb(borderColor);
    
    return `.glassmorphism {
  backdrop-filter: blur(${backdropBlur}px);
  background: rgba(${bgColorRgb.r}, ${bgColorRgb.g}, ${bgColorRgb.b}, ${backgroundOpacity});
  border: ${borderWidth}px solid rgba(${borderColorRgb.r}, ${borderColorRgb.g}, ${borderColorRgb.b}, ${borderOpacity});
  border-radius: ${borderRadius}px;
  box-shadow: ${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity});
}`;
  };

  const generateNeumorphismCSS = () => {
    const { neuDistance, neuIntensity, neuLightColor, neuDarkColor, borderRadius, backgroundColor } = config;
    
    const lightRgb = hexToRgb(neuLightColor);
    const darkRgb = hexToRgb(neuDarkColor);
    
    return `.neumorphism {
  background: ${backgroundColor};
  border-radius: ${borderRadius}px;
  box-shadow: 
    ${neuDistance}px ${neuDistance}px ${neuDistance * 2}px rgba(${darkRgb.r}, ${darkRgb.g}, ${darkRgb.b}, ${neuIntensity}),
    -${neuDistance}px -${neuDistance}px ${neuDistance * 2}px rgba(${lightRgb.r}, ${lightRgb.g}, ${lightRgb.b}, ${neuIntensity});
}`;
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 255, g: 255, b: 255 };
  };

  const getPreviewStyle = () => {
    if (activeTab === 'neumorphism' && config.neuEnabled) {
      const { neuDistance, neuIntensity, neuLightColor, neuDarkColor, borderRadius, backgroundColor, width, height, padding } = config;
      const lightRgb = hexToRgb(neuLightColor);
      const darkRgb = hexToRgb(neuDarkColor);
      
      return {
        background: backgroundColor,
        borderRadius: `${borderRadius}px`,
        boxShadow: `${neuDistance}px ${neuDistance}px ${neuDistance * 2}px rgba(${darkRgb.r}, ${darkRgb.g}, ${darkRgb.b}, ${neuIntensity}), -${neuDistance}px -${neuDistance}px ${neuDistance * 2}px rgba(${lightRgb.r}, ${lightRgb.g}, ${lightRgb.b}, ${neuIntensity})`,
        width: `${width}px`,
        height: `${height}px`,
        padding: `${padding}px`
      };
    } else {
      const { backdropBlur, backgroundOpacity, borderOpacity, borderWidth, borderRadius, shadowBlur, shadowOpacity, shadowX, shadowY, backgroundColor, borderColor, width, height, padding } = config;
      const bgColorRgb = hexToRgb(backgroundColor);
      const borderColorRgb = hexToRgb(borderColor);
      
      return {
        backdropFilter: `blur(${backdropBlur}px)`,
        background: `rgba(${bgColorRgb.r}, ${bgColorRgb.g}, ${bgColorRgb.b}, ${backgroundOpacity})`,
        border: `${borderWidth}px solid rgba(${borderColorRgb.r}, ${borderColorRgb.g}, ${borderColorRgb.b}, ${borderOpacity})`,
        borderRadius: `${borderRadius}px`,
        boxShadow: `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowOpacity})`,
        width: `${width}px`,
        height: `${height}px`,
        padding: `${padding}px`
      };
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCSS = () => {
    const css = activeTab === 'neumorphism' && config.neuEnabled ? generateNeumorphismCSS() : generateGlassmorphismCSS();
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-styles.css`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetSettings = () => {
    setConfig({
      backdropBlur: 10,
      backgroundOpacity: 0.25,
      borderOpacity: 0.18,
      borderWidth: 1,
      borderRadius: 16,
      shadowBlur: 40,
      shadowOpacity: 0.5,
      shadowX: 8,
      shadowY: 8,
      neuEnabled: false,
      neuDistance: 20,
      neuIntensity: 0.15,
      neuLightColor: '#ffffff',
      neuDarkColor: '#000000',
      backgroundColor: '#ffffff',
      borderColor: '#ffffff',
      width: 320,
      height: 200,
      padding: 24
    });
  };

  const SliderControl = ({ label, value, onChange, min, max, step = 1, unit = '' }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-sm text-gray-500 dark:text-gray-400">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
      />
    </div>
  );

  const ColorControl = ({ label, value, onChange }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <div className="flex items-center space-x-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      {/* SEO Metadata */}
      <head>
        <title>Glassmorphism & Neumorphism CSS Generator - Create Modern UI Effects</title>
        <meta name="description" content="Generate beautiful glassmorphism and neumorphism CSS effects for modern web design. Create glass-like transparent elements and soft UI components with our interactive CSS generator tool." />
        <link rel="canonical" href="/tools/glassmorphism-generator" />
        <meta name="keywords" content="glassmorphism, neumorphism, CSS generator, glass effect, modern UI, web design, CSS tools" />
      </head>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Glassmorphism & Neumorphism CSS Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Create stunning modern UI effects with our interactive CSS generator. Design glass-like transparent elements and soft neumorphic components for contemporary web interfaces.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Palette className="w-6 h-6 mr-2" />
                Controls
              </h2>
              <button
                onClick={resetSettings}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center text-sm"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Reset
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
              <button
                onClick={() => setActiveTab('glassmorphism')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'glassmorphism'
                    ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Layers className="w-4 h-4 inline mr-1" />
                Glassmorphism
              </button>
              <button
                onClick={() => {
                  setActiveTab('neumorphism');
                  setConfig(prev => ({ ...prev, neuEnabled: true }));
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'neumorphism'
                    ? 'bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-1" />
                Neumorphism
              </button>
            </div>

            <div className="space-y-6">
              {/* Common Controls */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">Dimensions</h3>
                <SliderControl
                  label="Width"
                  value={config.width}
                  onChange={(val) => setConfig(prev => ({ ...prev, width: val }))}
                  min={200}
                  max={600}
                  unit="px"
                />
                <SliderControl
                  label="Height"
                  value={config.height}
                  onChange={(val) => setConfig(prev => ({ ...prev, height: val }))}
                  min={100}
                  max={400}
                  unit="px"
                />
                <SliderControl
                  label="Padding"
                  value={config.padding}
                  onChange={(val) => setConfig(prev => ({ ...prev, padding: val }))}
                  min={8}
                  max={48}
                  unit="px"
                />
                <SliderControl
                  label="Border Radius"
                  value={config.borderRadius}
                  onChange={(val) => setConfig(prev => ({ ...prev, borderRadius: val }))}
                  min={0}
                  max={50}
                  unit="px"
                />
              </div>

              {activeTab === 'glassmorphism' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Glassmorphism Settings</h3>
                  <SliderControl
                    label="Backdrop Blur"
                    value={config.backdropBlur}
                    onChange={(val) => setConfig(prev => ({ ...prev, backdropBlur: val }))}
                    min={0}
                    max={40}
                    unit="px"
                  />
                  <SliderControl
                    label="Background Opacity"
                    value={config.backgroundOpacity}
                    onChange={(val) => setConfig(prev => ({ ...prev, backgroundOpacity: val }))}
                    min={0}
                    max={1}
                    step={0.01}
                  />
                  <SliderControl
                    label="Border Opacity"
                    value={config.borderOpacity}
                    onChange={(val) => setConfig(prev => ({ ...prev, borderOpacity: val }))}
                    min={0}
                    max={1}
                    step={0.01}
                  />
                  <SliderControl
                    label="Border Width"
                    value={config.borderWidth}
                    onChange={(val) => setConfig(prev => ({ ...prev, borderWidth: val }))}
                    min={0}
                    max={5}
                    unit="px"
                  />
                  <SliderControl
                    label="Shadow Blur"
                    value={config.shadowBlur}
                    onChange={(val) => setConfig(prev => ({ ...prev, shadowBlur: val }))}
                    min={0}
                    max={80}
                    unit="px"
                  />
                  <SliderControl
                    label="Shadow Opacity"
                    value={config.shadowOpacity}
                    onChange={(val) => setConfig(prev => ({ ...prev, shadowOpacity: val }))}
                    min={0}
                    max={1}
                    step={0.01}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <SliderControl
                      label="Shadow X"
                      value={config.shadowX}
                      onChange={(val) => setConfig(prev => ({ ...prev, shadowX: val }))}
                      min={-20}
                      max={20}
                      unit="px"
                    />
                    <SliderControl
                      label="Shadow Y"
                      value={config.shadowY}
                      onChange={(val) => setConfig(prev => ({ ...prev, shadowY: val }))}
                      min={-20}
                      max={20}
                      unit="px"
                    />
                  </div>
                  <ColorControl
                    label="Background Color"
                    value={config.backgroundColor}
                    onChange={(val) => setConfig(prev => ({ ...prev, backgroundColor: val }))}
                  />
                  <ColorControl
                    label="Border Color"
                    value={config.borderColor}
                    onChange={(val) => setConfig(prev => ({ ...prev, borderColor: val }))}
                  />
                </div>
              )}

              {activeTab === 'neumorphism' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Neumorphism Settings</h3>
                  <SliderControl
                    label="Shadow Distance"
                    value={config.neuDistance}
                    onChange={(val) => setConfig(prev => ({ ...prev, neuDistance: val }))}
                    min={1}
                    max={50}
                    unit="px"
                  />
                  <SliderControl
                    label="Shadow Intensity"
                    value={config.neuIntensity}
                    onChange={(val) => setConfig(prev => ({ ...prev, neuIntensity: val }))}
                    min={0}
                    max={0.5}
                    step={0.01}
                  />
                  <ColorControl
                    label="Background Color"
                    value={config.backgroundColor}
                    onChange={(val) => setConfig(prev => ({ ...prev, backgroundColor: val }))}
                  />
                  <ColorControl
                    label="Light Shadow Color"
                    value={config.neuLightColor}
                    onChange={(val) => setConfig(prev => ({ ...prev, neuLightColor: val }))}
                  />
                  <ColorControl
                    label="Dark Shadow Color"
                    value={config.neuDarkColor}
                    onChange={(val) => setConfig(prev => ({ ...prev, neuDarkColor: val }))}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Preview & Result */}
          <div className="space-y-8">
            {/* Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Eye className="w-6 h-6 mr-2" />
                Live Preview
              </h2>
              <div 
                className="min-h-[300px] bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center relative overflow-hidden"
                style={{
                  backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0,0,0,0.1) 0%, transparent 50%)'
                }}
              >
                <div
                  ref={previewRef}
                  style={getPreviewStyle()}
                  className="flex items-center justify-center transition-all duration-300 ease-out"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-3 mx-auto">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Preview Element</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your {activeTab} effect</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CSS Result */}
            <div ref={resultRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Code className="w-6 h-6 mr-2" />
                  Generated CSS
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(activeTab === 'neumorphism' && config.neuEnabled ? generateNeumorphismCSS() : generateGlassmorphismCSS())}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadCSS}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {activeTab === 'neumorphism' && config.neuEnabled ? generateNeumorphismCSS() : generateGlassmorphismCSS()}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-16 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Glassmorphism & Neumorphism</h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Create stunning modern user interfaces with our advanced CSS generator tool. Whether you're designing glassmorphism effects or neumorphic elements, our interactive generator helps you craft the perfect visual aesthetic for contemporary web applications.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-blue-500" />
                  Glassmorphism
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Glassmorphism is a design trend that creates frosted-glass effects using transparency, blur, and subtle borders. This technique adds depth and visual hierarchy while maintaining a clean, modern aesthetic.
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Backdrop blur effects for depth</li>
                  <li>• Translucent backgrounds with opacity control</li>
                  <li>• Subtle borders and shadows</li>
                  <li>• Perfect for cards, modals, and overlays</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                  Neumorphism
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Neumorphism (or soft UI) creates elements that appear to be extruded from the background, using carefully crafted shadows to simulate physical depth and tactile interfaces.
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Soft, extruded appearance</li>
                  <li>• Dual-tone shadow effects</li>
                  <li>• Minimalist color schemes</li>
                  <li>• Great for buttons and interactive elements</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Features</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Real-time preview updates
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Responsive design controls
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  CSS copy and download
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Color customization
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Shadow and blur controls
                </div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Cross-browser compatibility
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400">
              Our CSS generator produces clean, optimized code that works across modern browsers. Use the generated CSS classes in your projects to create visually appealing interfaces that enhance user experience and add professional polish to your web applications. Perfect for designers, developers, and anyone looking to implement cutting-edge UI trends.
            </p>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}