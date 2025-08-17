import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Unlock, Copy, RefreshCw, Heart, Download, Palette } from 'lucide-react';

// SEO Head component for meta tags
const SEOHead = ({ colors }) => {
  useEffect(() => {
    // Update document title
    document.title = `Color Palette Generator - ${colors.join('-')} | Free Color Tool`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = `Generate beautiful color palettes instantly. Current palette: ${colors.join(', ')}. Free color palette generator with export options.`;
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]') || document.createElement('meta');
    metaKeywords.name = 'keywords';
    metaKeywords.content = 'color palette generator, color schemes, hex colors, design tools, color picker, palette creator';
    if (!document.querySelector('meta[name="keywords"]')) {
      document.head.appendChild(metaKeywords);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]') || document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.content = 'Color Palette Generator - Create Beautiful Color Schemes';
    if (!document.querySelector('meta[property="og:title"]')) {
      document.head.appendChild(ogTitle);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]') || document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.content = `Beautiful color palette: ${colors.join(', ')}. Generate and export color schemes instantly.`;
    if (!document.querySelector('meta[property="og:description"]')) {
      document.head.appendChild(ogDescription);
    }
    
    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = `${window.location.origin}${window.location.pathname}`;
    if (!document.querySelector('link[rel="canonical"]')) {
      document.head.appendChild(canonical);
    }
  }, [colors]);
  
  return null;
};

const ColorPaletteGenerator = () => {
  // Generate random hex color
  const generateRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
  };
  
  // Initial state
  const [colors, setColors] = useState(() => 
    Array(5).fill(null).map(() => generateRandomColor())
  );
  const [lockedColors, setLockedColors] = useState(Array(5).fill(false));
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [favorites, setFavorites] = useState([]);
  
  // Generate new palette
  const generatePalette = useCallback(() => {
    setColors(prevColors => 
      prevColors.map((color, index) => 
        lockedColors[index] ? color : generateRandomColor()
      )
    );
  }, [lockedColors]);
  
  // Toggle lock for a color
  const toggleLock = (index) => {
    setLockedColors(prev => {
      const newLocked = [...prev];
      newLocked[index] = !newLocked[index];
      return newLocked;
    });
  };
  
  // Copy color to clipboard
  const copyToClipboard = async (color, index) => {
    try {
      await navigator.clipboard.writeText(color);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  // Convert hex to HSL
  const hexToHsl = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };
  
  // Check if color is light or dark
  const isLightColor = (hex) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128;
  };
  
  // Add to favorites
  const addToFavorites = (palette) => {
    const newFavorite = {
      id: Date.now(),
      colors: [...palette],
      timestamp: new Date().toISOString()
    };
    setFavorites(prev => [newFavorite, ...prev.slice(0, 9)]); // Keep only 10 favorites
  };
  
  // Export palette as CSS
  const exportAsCSS = () => {
    const css = `:root {
${colors.map((color, index) => `  --color-${index + 1}: ${color};`).join('\n')}
}

.palette {
${colors.map((color, index) => `  --primary-${index + 1}: ${color};`).join('\n')}
}`;
    
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${colors.join('-').replace(/#/g, '')}.css`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Export palette as JSON
  const exportAsJSON = () => {
    const paletteData = {
      colors: colors,
      rgb: colors.map(color => hexToRgb(color)),
      hsl: colors.map(color => hexToHsl(color)),
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(paletteData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `palette-${colors.join('-').replace(/#/g, '')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        generatePalette();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [generatePalette]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead colors={colors} />
      
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Palette className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                <span className="hidden sm:inline">Color Palette Generator</span>
                <span className="sm:hidden">Coolors</span>
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={generatePalette}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
              >
                <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-sm sm:text-base">Generate</span>
              </button>
              <button
                onClick={() => addToFavorites(colors)}
                className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 active:bg-red-700 transition-colors touch-manipulation"
              >
                <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline text-sm sm:text-base">Save</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Palette Display */}
      <main className="flex-1">
        {/* Desktop/Tablet Landscape - Horizontal Layout */}
        <div className="hidden sm:block">
          <div className="h-64 sm:h-80 lg:h-96 flex">
            {colors.map((color, index) => (
              <div
                key={index}
                className="flex-1 relative group cursor-pointer transition-all duration-300 hover:flex-grow touch-manipulation"
                style={{ backgroundColor: color }}
                onClick={() => copyToClipboard(color, index)}
              >
                {/* Color Info Overlay */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-200 ${isLightColor(color) ? 'text-gray-800' : 'text-white'}`}>
                  <div className="text-center space-y-1 sm:space-y-2 px-2">
                    <div className="text-sm sm:text-base lg:text-lg font-mono font-bold">{color.toUpperCase()}</div>
                    <div className="text-xs sm:text-sm opacity-80">
                      RGB({hexToRgb(color)?.r}, {hexToRgb(color)?.g}, {hexToRgb(color)?.b})
                    </div>
                    <div className="text-xs sm:text-sm opacity-80">
                      HSL({hexToHsl(color)?.h}°, {hexToHsl(color)?.s}%, {hexToHsl(color)?.l}%)
                    </div>
                    {copiedIndex === index && (
                      <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        Copied!
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Lock Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLock(index);
                  }}
                  className={`absolute top-2 sm:top-4 right-2 sm:right-4 p-2 sm:p-2 rounded-full transition-all duration-200 touch-manipulation ${
                    lockedColors[index] 
                      ? 'bg-yellow-500 text-white' 
                      : isLightColor(color) 
                        ? 'bg-gray-800 bg-opacity-20 text-gray-800 hover:bg-opacity-30 active:bg-opacity-40' 
                        : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30 active:bg-opacity-40'
                  }`}
                >
                  {lockedColors[index] ? <Lock className="h-3 w-3 sm:h-4 sm:w-4" /> : <Unlock className="h-3 w-3 sm:h-4 sm:w-4" />}
                </button>
                
                {/* Copy Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(color, index);
                  }}
                  className={`absolute bottom-2 sm:bottom-4 right-2 sm:right-4 p-2 sm:p-2 rounded-full transition-all duration-200 touch-manipulation ${
                    isLightColor(color) 
                      ? 'bg-gray-800 bg-opacity-20 text-gray-800 hover:bg-opacity-30 active:bg-opacity-40' 
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30 active:bg-opacity-40'
                  }`}
                >
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobile Portrait - Vertical Layout */}
        <div className="sm:hidden">
          <div className="flex flex-col">
            {colors.map((color, index) => (
              <div
                key={index}
                className="h-32 relative group cursor-pointer transition-all duration-300 active:h-40 touch-manipulation"
                style={{ backgroundColor: color }}
                onClick={() => copyToClipboard(color, index)}
              >
                {/* Color Info - Always Visible on Mobile */}
                <div className={`absolute inset-0 flex items-center justify-between px-4 ${isLightColor(color) ? 'text-gray-800' : 'text-white'}`}>
                  <div className="flex-1">
                    <div className="text-lg font-mono font-bold">{color.toUpperCase()}</div>
                    <div className="text-sm opacity-80">
                      RGB({hexToRgb(color)?.r}, {hexToRgb(color)?.g}, {hexToRgb(color)?.b})
                    </div>
                    {copiedIndex === index && (
                      <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs mt-1 inline-block">
                        Copied!
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    {/* Lock Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLock(index);
                      }}
                      className={`p-3 rounded-full transition-all duration-200 touch-manipulation ${
                        lockedColors[index] 
                          ? 'bg-yellow-500 text-white' 
                          : isLightColor(color) 
                            ? 'bg-gray-800 bg-opacity-20 text-gray-800 active:bg-opacity-40' 
                            : 'bg-white bg-opacity-20 text-white active:bg-opacity-40'
                      }`}
                    >
                      {lockedColors[index] ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </button>
                    
                    {/* Copy Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(color, index);
                      }}
                      className={`p-3 rounded-full transition-all duration-200 touch-manipulation ${
                        isLightColor(color) 
                          ? 'bg-gray-800 bg-opacity-20 text-gray-800 active:bg-opacity-40' 
                          : 'bg-white bg-opacity-20 text-white active:bg-opacity-40'
                      }`}
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8">
          <div className="text-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">How to Use</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 px-2">
              <span className="hidden sm:inline">Press <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Space</kbd> or click Generate to create new palettes.</span>
              <span className="sm:hidden">Tap Generate to create new palettes.</span>
              {' '}Click any color to copy its hex code. Lock colors you like to keep them while generating new palettes.
            </p>
          </div>
          
          {/* Export Options */}
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
            <button
              onClick={exportAsCSS}
              className="flex items-center justify-center space-x-2 px-4 py-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors touch-manipulation"
            >
              <Download className="h-4 w-4" />
              <span>Export CSS</span>
            </button>
            <button
              onClick={exportAsJSON}
              className="flex items-center justify-center space-x-2 px-4 py-3 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors touch-manipulation"
            >
              <Download className="h-4 w-4" />
              <span>Export JSON</span>
            </button>
          </div>
          
          {/* Current Palette Info */}
          <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Current Palette</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {colors.map((color, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="w-full h-16 sm:h-20 rounded-lg border mb-2 cursor-pointer touch-manipulation active:scale-95 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color, index)}
                  />
                  <div className="font-mono text-xs sm:text-sm font-bold text-gray-900">{color.toUpperCase()}</div>
                  <div className="text-xs text-gray-600 hidden sm:block">
                    RGB({hexToRgb(color)?.r}, {hexToRgb(color)?.g}, {hexToRgb(color)?.b})
                  </div>
                  <div className="text-xs text-gray-600 hidden sm:block">
                    HSL({hexToHsl(color)?.h}°, {hexToHsl(color)?.s}%, {hexToHsl(color)?.l}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Saved Palettes</h3>
              <div className="space-y-3">
                {favorites.map((favorite) => (
                  <div key={favorite.id} className="flex items-center space-x-2">
                    <div className="flex flex-1 h-8 sm:h-10">
                      {favorite.colors.map((color, index) => (
                        <div
                          key={index}
                          className="flex-1 first:rounded-l last:rounded-r cursor-pointer touch-manipulation active:scale-95 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => copyToClipboard(color, `fav-${favorite.id}-${index}`)}
                          title={color}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setColors([...favorite.colors])}
                      className="px-3 py-2 sm:py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation whitespace-nowrap"
                    >
                      Load
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      
    </div>
  );
};

export default ColorPaletteGenerator;