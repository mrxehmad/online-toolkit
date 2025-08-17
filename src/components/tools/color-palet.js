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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Color Palette Generator</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={generatePalette}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Generate</span>
              </button>
              <button
                onClick={() => addToFavorites(colors)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Heart className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Palette Display */}
      <main className="flex-1">
        <div className="h-96 flex">
          {colors.map((color, index) => (
            <div
              key={index}
              className="flex-1 relative group cursor-pointer transition-all duration-300 hover:flex-grow"
              style={{ backgroundColor: color }}
              onClick={() => copyToClipboard(color, index)}
            >
              {/* Color Info Overlay */}
              <div className={`absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isLightColor(color) ? 'text-gray-800' : 'text-white'}`}>
                <div className="text-center space-y-2">
                  <div className="text-lg font-mono font-bold">{color.toUpperCase()}</div>
                  <div className="text-sm opacity-80">
                    RGB({hexToRgb(color)?.r}, {hexToRgb(color)?.g}, {hexToRgb(color)?.b})
                  </div>
                  <div className="text-sm opacity-80">
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
                className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 ${
                  lockedColors[index] 
                    ? 'bg-yellow-500 text-white' 
                    : isLightColor(color) 
                      ? 'bg-gray-800 bg-opacity-20 text-gray-800 hover:bg-opacity-30' 
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
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
                className={`absolute bottom-4 right-4 p-2 rounded-full transition-all duration-200 ${
                  isLightColor(color) 
                    ? 'bg-gray-800 bg-opacity-20 text-gray-800 hover:bg-opacity-30' 
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Instructions */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">How to Use</h2>
            <p className="text-gray-600 mb-4">
              Press <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">Space</kbd> or click Generate to create new palettes. 
              Click any color to copy its hex code. Lock colors you like to keep them while generating new palettes.
            </p>
          </div>
          
          {/* Export Options */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={exportAsCSS}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export CSS</span>
            </button>
            <button
              onClick={exportAsJSON}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Export JSON</span>
            </button>
          </div>
          
          {/* Current Palette Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Palette</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {colors.map((color, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="w-full h-20 rounded-lg border mb-2"
                    style={{ backgroundColor: color }}
                  />
                  <div className="font-mono text-sm font-bold text-gray-900">{color.toUpperCase()}</div>
                  <div className="text-xs text-gray-600">
                    RGB({hexToRgb(color)?.r}, {hexToRgb(color)?.g}, {hexToRgb(color)?.b})
                  </div>
                  <div className="text-xs text-gray-600">
                    HSL({hexToHsl(color)?.h}°, {hexToHsl(color)?.s}%, {hexToHsl(color)?.l}%)
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Favorites */}
          {favorites.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Palettes</h3>
              <div className="space-y-3">
                {favorites.map((favorite) => (
                  <div key={favorite.id} className="flex items-center space-x-2">
                    <div className="flex flex-1">
                      {favorite.colors.map((color, index) => (
                        <div
                          key={index}
                          className="flex-1 h-8 first:rounded-l last:rounded-r cursor-pointer"
                          style={{ backgroundColor: color }}
                          onClick={() => copyToClipboard(color, `fav-${favorite.id}-${index}`)}
                          title={color}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() => setColors([...favorite.colors])}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
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
      
      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 Color Palette Generator. Generate beautiful color schemes for your designs.</p>
          <p className="mt-2 text-sm">All processing happens in your browser. No data is sent to servers.</p>
        </div>
      </footer>
    </div>
  );
};

export default ColorPaletteGenerator;