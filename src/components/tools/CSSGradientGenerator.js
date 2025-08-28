import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Copy, 
  Download, 
  Plus, 
  Trash2, 
  RotateCcw,
  Eye,
  Code,
  Smartphone,
  Tablet,
  Monitor,
  Sun,
  Moon
} from 'lucide-react';

// Mock useTheme hook for demo - replace with your actual implementation
const useTheme = () => {
  const [isDark, setIsDark] = useState(false);
  return { isDark, toggleTheme: () => setIsDark(!isDark) };
};

export default function CSSGradientGenerator() {
  const { isDark, toggleTheme } = useTheme();
  const [gradientType, setGradientType] = useState('linear');
  const [direction, setDirection] = useState('to right');
  const [radialShape, setRadialShape] = useState('ellipse');
  const [radialSize, setRadialSize] = useState('closest-side');
  const [radialPosition, setRadialPosition] = useState('center');
  const [colors, setColors] = useState([
    { color: '#ff6b6b', position: 0 },
    { color: '#4ecdc4', position: 100 }
  ]);
  const [activeTab, setActiveTab] = useState('generator');
  const [copiedText, setCopiedText] = useState('');
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const resultRef = useRef(null);

  // SEO Metadata (in real implementation, you'd use Next.js Head or similar)
  useEffect(() => {
    document.title = 'CSS Gradient Generator - Create Beautiful Linear, Radial & Text Gradients';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Professional CSS gradient generator tool. Create stunning linear, radial, and text gradients with live preview. Export CSS code instantly. Perfect for web designers and developers.');
    }
  }, []);

  const generateGradientCSS = () => {
    const colorStops = colors
      .sort((a, b) => a.position - b.position)
      .map(c => `${c.color} ${c.position}%`)
      .join(', ');

    switch (gradientType) {
      case 'linear':
        return `linear-gradient(${direction}, ${colorStops})`;
      case 'radial':
        return `radial-gradient(${radialShape} ${radialSize} at ${radialPosition}, ${colorStops})`;
      case 'text':
        return `linear-gradient(${direction}, ${colorStops})`;
      default:
        return '';
    }
  };

  const addColor = () => {
    const newPosition = colors.length > 0 ? Math.max(...colors.map(c => c.position)) + 10 : 50;
    setColors([...colors, { color: '#ffffff', position: Math.min(newPosition, 100) }]);
  };

  const removeColor = (index) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const updateColor = (index, field, value) => {
    const newColors = [...colors];
    newColors[index] = { ...newColors[index], [field]: value };
    setColors(newColors);
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(''), 2000);
      
      // Scroll to result section with delay
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 1000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const resetGradient = () => {
    setColors([
      { color: '#ff6b6b', position: 0 },
      { color: '#4ecdc4', position: 100 }
    ]);
    setDirection('to right');
    setGradientType('linear');
  };

  const gradientCSS = generateGradientCSS();

  const previewStyles = {
    desktop: 'w-full h-64',
    tablet: 'w-96 h-64 mx-auto',
    mobile: 'w-80 h-48 mx-auto'
  };

  const directionOptions = [
    { value: 'to right', label: 'To Right' },
    { value: 'to left', label: 'To Left' },
    { value: 'to bottom', label: 'To Bottom' },
    { value: 'to top', label: 'To Top' },
    { value: 'to bottom right', label: 'To Bottom Right' },
    { value: 'to bottom left', label: 'To Bottom Left' },
    { value: 'to top right', label: 'To Top Right' },
    { value: 'to top left', label: 'To Top Left' },
    { value: '45deg', label: '45°' },
    { value: '90deg', label: '90°' },
    { value: '180deg', label: '180°' },
    { value: '270deg', label: '270°' }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          className={`p-3 rounded-full shadow-lg transition-all duration-300 ${
            isDark 
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palette className={`w-12 h-12 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
            <h1 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              CSS Gradient Generator
            </h1>
          </div>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Create stunning CSS gradients with our professional gradient generator tool
          </p>
        </div>

        {/* Main Tool Card */}
        <div className={`rounded-2xl shadow-xl p-6 md:p-8 mb-12 transition-all duration-300 ${
          isDark ? 'bg-gray-800 shadow-2xl' : 'bg-white shadow-lg'
        }`}>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'generator', label: 'Generator', icon: Palette },
              { id: 'preview', label: 'Preview', icon: Eye },
              { id: 'code', label: 'Code', icon: Code }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-medium transition-all duration-200 ${
                  activeTab === id
                    ? isDark
                      ? 'bg-purple-600 text-white border-b-2 border-purple-400'
                      : 'bg-purple-100 text-purple-700 border-b-2 border-purple-500'
                    : isDark
                      ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>

          {/* Generator Tab */}
          {activeTab === 'generator' && (
            <div className="space-y-8">
              {/* Gradient Type Selection */}
              <div>
                <label className={`block text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Gradient Type
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { value: 'linear', label: 'Linear' },
                    { value: 'radial', label: 'Radial' },
                    { value: 'text', label: 'Text' }
                  ].map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setGradientType(value)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                        gradientType === value
                          ? isDark
                            ? 'bg-purple-600 text-white shadow-lg'
                            : 'bg-purple-600 text-white shadow-lg'
                          : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Direction/Shape Controls */}
              {gradientType === 'linear' || gradientType === 'text' ? (
                <div>
                  <label className={`block text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Direction
                  </label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                    className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                      isDark
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-400'
                        : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                    } focus:outline-none`}
                  >
                    {directionOptions.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              ) : gradientType === 'radial' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className={`block text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Shape
                    </label>
                    <select
                      value={radialShape}
                      onChange={(e) => setRadialShape(e.target.value)}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-400'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                      } focus:outline-none`}
                    >
                      <option value="ellipse">Ellipse</option>
                      <option value="circle">Circle</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Size
                    </label>
                    <select
                      value={radialSize}
                      onChange={(e) => setRadialSize(e.target.value)}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-400'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                      } focus:outline-none`}
                    >
                      <option value="closest-side">Closest Side</option>
                      <option value="closest-corner">Closest Corner</option>
                      <option value="farthest-side">Farthest Side</option>
                      <option value="farthest-corner">Farthest Corner</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Position
                    </label>
                    <select
                      value={radialPosition}
                      onChange={(e) => setRadialPosition(e.target.value)}
                      className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-400'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                      } focus:outline-none`}
                    >
                      <option value="center">Center</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="top left">Top Left</option>
                      <option value="top right">Top Right</option>
                      <option value="bottom left">Bottom Left</option>
                      <option value="bottom right">Bottom Right</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Color Controls */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Colors ({colors.length})
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={addColor}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isDark
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <Plus size={16} />
                      Add Color
                    </button>
                    <button
                      onClick={resetGradient}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        isDark
                          ? 'bg-gray-600 text-white hover:bg-gray-700'
                          : 'bg-gray-500 text-white hover:bg-gray-600'
                      }`}
                    >
                      <RotateCcw size={16} />
                      Reset
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {colors.map((colorObj, index) => (
                    <div
                      key={index}
                      className={`flex flex-col sm:flex-row gap-4 p-4 rounded-lg border-2 ${
                        isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="relative">
                          <input
                            type="color"
                            value={colorObj.color}
                            onChange={(e) => updateColor(index, 'color', e.target.value)}
                            className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={colorObj.color}
                          onChange={(e) => updateColor(index, 'color', e.target.value)}
                          className={`flex-1 p-3 rounded-lg border-2 transition-all duration-200 ${
                            isDark
                              ? 'bg-gray-800 border-gray-600 text-white focus:border-purple-400'
                              : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                          } focus:outline-none`}
                          placeholder="#ffffff"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Position:
                          </span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={colorObj.position}
                            onChange={(e) => updateColor(index, 'position', parseInt(e.target.value))}
                            className="w-20"
                          />
                          <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} min-w-[3rem]`}>
                            {colorObj.position}%
                          </span>
                        </div>
                        {colors.length > 2 && (
                          <button
                            onClick={() => removeColor(index)}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              isDark
                                ? 'text-red-400 hover:bg-red-600 hover:text-white'
                                : 'text-red-600 hover:bg-red-100'
                            }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="space-y-6">
              {/* Device Selection */}
              <div className="flex items-center gap-4 justify-center">
                {[
                  { device: 'mobile', icon: Smartphone, label: 'Mobile' },
                  { device: 'tablet', icon: Tablet, label: 'Tablet' },
                  { device: 'desktop', icon: Monitor, label: 'Desktop' }
                ].map(({ device, icon: Icon, label }) => (
                  <button
                    key={device}
                    onClick={() => setPreviewDevice(device)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      previewDevice === device
                        ? isDark
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-600 text-white'
                        : isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Preview */}
              <div className="flex justify-center">
                <div
                  className={`${previewStyles[previewDevice]} rounded-xl border-2 border-gray-300 dark:border-gray-600 transition-all duration-300`}
                  style={{
                    background: gradientType === 'text' ? '#f3f4f6' : gradientCSS,
                    ...(gradientType === 'text' && {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    })
                  }}
                >
                  {gradientType === 'text' && (
                    <div
                      className="text-6xl font-bold bg-clip-text text-transparent"
                      style={{
                        background: gradientCSS,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      Sample Text
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Code Tab */}
          {activeTab === 'code' && (
            <div className="space-y-6" ref={resultRef}>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Generated CSS
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(gradientCSS)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        copiedText === gradientCSS
                          ? isDark
                            ? 'bg-green-600 text-white'
                            : 'bg-green-600 text-white'
                          : isDark
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <Copy size={16} />
                      {copiedText === gradientCSS ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className={`p-4 rounded-lg border-2 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
                  <code className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'} break-all`}>
                    background: {gradientCSS};
                  </code>
                </div>
              </div>

              {/* Usage Examples */}
              <div>
                <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Usage Examples
                </h3>
                <div className="space-y-4">
                  {/* CSS Class */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        CSS Class
                      </h4>
                      <button
                        onClick={() => copyToClipboard(`.gradient-bg {\n  background: ${gradientCSS};\n}`)}
                        className={`text-sm px-3 py-1 rounded transition-colors ${
                          isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-200'
                        }`}
                      >
                        <Copy size={14} className="inline mr-1" />
                        Copy
                      </button>
                    </div>
                    <div className={`p-3 rounded border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
                      <code className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                        .gradient-bg {'{'}
                        <br />
                        &nbsp;&nbsp;background: {gradientCSS};
                        <br />
                        {'}'}
                      </code>
                    </div>
                  </div>

                  {/* Inline Style */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Inline Style
                      </h4>
                      <button
                        onClick={() => copyToClipboard(`style="background: ${gradientCSS}"`)}
                        className={`text-sm px-3 py-1 rounded transition-colors ${
                          isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-200'
                        }`}
                      >
                        <Copy size={14} className="inline mr-1" />
                        Copy
                      </button>
                    </div>
                    <div className={`p-3 rounded border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
                      <code className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'} break-all`}>
                        style="background: {gradientCSS}"
                      </code>
                    </div>
                  </div>

                  {gradientType === 'text' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Text Gradient CSS
                        </h4>
                        <button
                          onClick={() => copyToClipboard(`.gradient-text {\n  background: ${gradientCSS};\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  background-clip: text;\n}`)}
                          className={`text-sm px-3 py-1 rounded transition-colors ${
                            isDark ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-200'
                          }`}
                        >
                          <Copy size={14} className="inline mr-1" />
                          Copy
                        </button>
                      </div>
                      <div className={`p-3 rounded border ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-300'}`}>
                        <code className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                          .gradient-text {'{'}
                          <br />
                          &nbsp;&nbsp;background: {gradientCSS};
                          <br />
                          &nbsp;&nbsp;-webkit-background-clip: text;
                          <br />
                          &nbsp;&nbsp;-webkit-text-fill-color: transparent;
                          <br />
                          &nbsp;&nbsp;background-clip: text;
                          <br />
                          {'}'}
                        </code>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Long Description */}
        <div className={`rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300 ${
          isDark ? 'bg-gray-800 shadow-2xl' : 'bg-white shadow-lg'
        }`}>
          <div className="max-w-4xl mx-auto">
            <h2 className={`text-3xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Professional CSS Gradient Generator Tool
            </h2>
            
            <div className={`prose prose-lg ${isDark ? 'prose-invert' : ''} max-w-none`}>
              <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                Create stunning CSS gradients effortlessly with our comprehensive gradient generator. Whether you're designing modern websites, creating eye-catching backgrounds, or adding visual flair to your text elements, our tool provides everything you need to generate professional-quality gradients.
              </p>

              <h3 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Features & Capabilities
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h4 className={`text-xl font-semibold mb-3 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    Linear Gradients
                  </h4>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Generate smooth linear gradients with customizable directions, including diagonal angles, cardinal directions, and precise degree control. Perfect for backgrounds, headers, and modern UI elements.
                  </p>
                </div>
                
                <div>
                  <h4 className={`text-xl font-semibold mb-3 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    Radial Gradients
                  </h4>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Create beautiful radial gradients with elliptical or circular shapes, adjustable sizing options, and flexible positioning. Ideal for spotlight effects, buttons, and artistic backgrounds.
                  </p>
                </div>
                
                <div>
                  <h4 className={`text-xl font-semibold mb-3 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    Text Gradients
                  </h4>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Apply stunning gradient effects directly to text elements using CSS background-clip. Create eye-catching headings, logos, and call-to-action text that stands out.
                  </p>
                </div>
                
                <div>
                  <h4 className={`text-xl font-semibold mb-3 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                    Multi-Color Support
                  </h4>
                  <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>
                    Add unlimited colors to your gradients with precise position control. Create complex, multi-stop gradients with smooth transitions between any number of colors.
                  </p>
                </div>
              </div>

              <h3 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                How to Use the CSS Gradient Generator
              </h3>
              
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-4 mb-8`}>
                <p>
                  Our gradient generator is designed for both beginners and professional developers. Simply select your gradient type (linear, radial, or text), choose your colors, adjust the direction or positioning, and watch the live preview update in real-time.
                </p>
                
                <p>
                  Use the color picker to select colors visually, or input hex codes directly for precise color matching. Adjust the position of each color stop using the slider controls to create the perfect gradient transition.
                </p>
                
                <p>
                  Once you're satisfied with your gradient, copy the generated CSS code and paste it directly into your stylesheet or HTML. The tool provides multiple format options including CSS classes, inline styles, and specialized text gradient code.
                </p>
              </div>

              <h3 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Browser Compatibility & Best Practices
              </h3>
              
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                All generated gradients are compatible with modern browsers including Chrome, Firefox, Safari, and Edge. For text gradients, we include both standard and webkit-prefixed properties to ensure maximum compatibility across different rendering engines.
              </p>

              <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'} mb-6`}>
                <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  Pro Tips for Better Gradients
                </h4>
                <ul className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-2 list-disc list-inside`}>
                  <li>Use complementary colors for smooth, natural-looking transitions</li>
                  <li>Avoid high contrast color combinations that may cause visual strain</li>
                  <li>Test your gradients on different screen sizes and devices</li>
                  <li>Consider accessibility by ensuring sufficient contrast for text overlays</li>
                  <li>Use subtle gradients for backgrounds and bold ones for accent elements</li>
                </ul>
              </div>

              <h3 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Advanced Gradient Techniques
              </h3>
              
              <div className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-4 mb-8`}>
                <p>
                  <strong>Color Theory Application:</strong> Understanding color theory can dramatically improve your gradient designs. Analogous colors (colors next to each other on the color wheel) create harmonious, peaceful gradients, while complementary colors create vibrant, dynamic effects.
                </p>
                
                <p>
                  <strong>Multiple Background Layers:</strong> You can layer multiple gradients using CSS to create complex, multi-dimensional effects. This technique is particularly useful for creating depth and sophisticated visual hierarchies.
                </p>
                
                <p>
                  <strong>Animation and Transitions:</strong> CSS gradients can be animated using keyframes or transitions, creating dynamic backgrounds that respond to user interactions or automatically cycle through different color schemes.
                </p>
              </div>

              <h3 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                SEO and Performance Considerations
              </h3>
              
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
                CSS gradients offer significant advantages over image-based backgrounds in terms of performance and SEO. They're vector-based, meaning they scale perfectly on all devices and screen densities without increasing file size. This results in faster loading times and better user experience across all devices.
              </p>

              <div className={`p-6 rounded-lg ${isDark ? 'bg-blue-900 bg-opacity-20 border border-blue-500' : 'bg-blue-50 border border-blue-200'} mb-6`}>
                <h4 className={`text-lg font-semibold mb-3 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                  Why Choose CSS Gradients?
                </h4>
                <ul className={`${isDark ? 'text-gray-300' : 'text-gray-600'} space-y-2 list-disc list-inside`}>
                  <li><strong>Zero HTTP Requests:</strong> No additional image files to download</li>
                  <li><strong>Perfect Scalability:</strong> Look crisp on all screen sizes and resolutions</li>
                  <li><strong>Easy Maintenance:</strong> Change colors instantly without editing image files</li>
                  <li><strong>Smaller File Sizes:</strong> Typically much smaller than equivalent image files</li>
                  <li><strong>Better Accessibility:</strong> Can be modified by user stylesheets for accessibility needs</li>
                </ul>
              </div>

              <h3 className={`text-2xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Design Trends and Inspiration
              </h3>
              
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Modern web design trends heavily feature gradients, from subtle background washes to bold, vibrant overlays. Popular trends include:
              </p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Duotone Gradients
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Two-color gradients that create striking, minimalist designs popular in modern branding and UI design.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Mesh Gradients
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Complex, multi-point gradients that create organic, flowing color transitions reminiscent of natural phenomena.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Glass Morphism
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Subtle gradients combined with transparency and blur effects to create glass-like UI elements.
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Neon Gradients
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Bright, saturated color combinations that evoke digital and cyberpunk aesthetics.
                  </p>
                </div>
              </div>

              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} text-lg`}>
                Whether you're creating a modern landing page, designing a mobile app interface, or adding visual interest to your web components, our CSS gradient generator provides the tools and flexibility you need to create professional-quality gradients that enhance your design aesthetic and improve user engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}