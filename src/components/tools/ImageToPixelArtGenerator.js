import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Palette, Grid, Sliders, FileImage, Zap, Eye, EyeOff } from 'lucide-react';

export default function ImageToPixelArtGenerator() {
  const [image, setImage] = useState(null);
  const [pixelSize, setPixelSize] = useState(8);
  const [colorReduction, setColorReduction] = useState(16);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState(null);
  const [showOriginal, setShowOriginal] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const originalCanvasRef = useRef(null);

  // SEO metadata
  useEffect(() => {
    document.title = 'Image to Pixel Art Generator - Convert Photos to Retro Pixel Art Online';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Transform your photos into stunning pixel art with our free online converter. Adjust pixel size, colors, and download high-quality retro-style artwork instantly. No software required!');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Transform your photos into stunning pixel art with our free online converter. Adjust pixel size, colors, and download high-quality retro-style artwork instantly. No software required!';
      document.head.appendChild(meta);
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.href = window.location.href;
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = window.location.href;
      document.head.appendChild(link);
    }
  }, []);

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          drawOriginalImage(img);
          processImage(img, pixelSize, colorReduction);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const drawOriginalImage = (img) => {
    const canvas = originalCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    const maxSize = 400;
    let { width, height } = img;
    
    if (width > height) {
      if (width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }
    }
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.drawImage(img, 0, 0, width, height);
  };

  const processImage = async (img, pSize, colors) => {
    if (!img) return;
    
    setIsProcessing(true);
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setIsProcessing(false);
        return;
      }
      const ctx = canvas.getContext('2d');
      
      const maxSize = 400;
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get image data
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      // Pixelate
      for (let y = 0; y < height; y += pSize) {
        for (let x = 0; x < width; x += pSize) {
          // Get average color of pixel block
          let r = 0, g = 0, b = 0, a = 0;
          let count = 0;
          
          for (let dy = 0; dy < pSize && y + dy < height; dy++) {
            for (let dx = 0; dx < pSize && x + dx < width; dx++) {
              const i = ((y + dy) * width + (x + dx)) * 4;
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
              a += data[i + 3];
              count++;
            }
          }
          
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          a = Math.round(a / count);
          
          // Reduce colors
          const factor = 256 / colors;
          r = Math.round(Math.round(r / factor) * factor);
          g = Math.round(Math.round(g / factor) * factor);
          b = Math.round(Math.round(b / factor) * factor);
          
          // Fill pixel block
          ctx.fillStyle = `rgba(${r},${g},${b},${a/255})`;
          ctx.fillRect(x, y, Math.min(pSize, width - x), Math.min(pSize, height - y));
        }
      }
      
      setProcessedImage(canvas.toDataURL());
      setIsProcessing(false);
    }, 100);
  };

  const handlePixelSizeChange = (value) => {
    setPixelSize(value);
    if (image) {
      processImage(image, value, colorReduction);
    }
  };

  const handleColorReductionChange = (value) => {
    setColorReduction(value);
    if (image) {
      processImage(image, pixelSize, value);
    }
  };

  const downloadImage = () => {
    if (processedImage) {
      const link = document.createElement('a');
      link.download = 'pixel-art.png';
      link.href = processedImage;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Grid className="text-blue-500" size={48} />
            Image to Pixel Art Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Transform your photos into stunning retro pixel art with customizable settings
          </p>
        </div>

        {/* Main Tool Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          {/* Upload Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Upload className="text-blue-500" size={24} />
              Upload Your Image
            </h2>
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <FileImage className="mx-auto text-gray-400 dark:text-gray-500 mb-4" size={48} />
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Drag and drop your image here, or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Choose File
              </button>
            </div>
          </div>

          {/* Controls */}
          {image && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Sliders className="inline mr-1" size={16} />
                  Pixel Size: {pixelSize}px
                </label>
                <input
                  type="range"
                  min="2"
                  max="32"
                  value={pixelSize}
                  onChange={(e) => handlePixelSizeChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Fine (2px)</span>
                  <span>Chunky (32px)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Palette className="inline mr-1" size={16} />
                  Color Palette: {colorReduction} colors
                </label>
                <input
                  type="range"
                  min="4"
                  max="64"
                  value={colorReduction}
                  onChange={(e) => handleColorReductionChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Limited (4)</span>
                  <span>Rich (64)</span>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {image && (
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 sm:mb-0">
                  Preview
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowOriginal(!showOriginal)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
                  >
                    {showOriginal ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showOriginal ? 'Hide Original' : 'Show Original'}
                  </button>
                  <button
                    onClick={downloadImage}
                    disabled={isProcessing || !processedImage}
                    className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {showOriginal && (
                  <div className="text-center">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Original</h4>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 inline-block">
                      <canvas
                        ref={originalCanvasRef}
                        className="max-w-full h-auto border border-gray-200 dark:border-gray-600 rounded"
                      />
                    </div>
                  </div>
                )}
                
                <div className={`text-center ${showOriginal ? '' : 'lg:col-span-2'}`}>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-center gap-2">
                    Pixel Art
                    {isProcessing && <Zap className="animate-spin text-blue-500" size={16} />}
                  </h4>
                  <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 inline-block">
                    <canvas
                      ref={canvasRef}
                      className={`max-w-full h-auto border border-gray-200 dark:border-gray-600 rounded ${
                        isProcessing ? 'opacity-50' : ''
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Long Description */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About the Image to Pixel Art Generator
          </h2>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Transform your ordinary photos into stunning retro pixel art with our advanced online converter. 
              This powerful tool uses sophisticated algorithms to recreate the nostalgic aesthetic of classic 
              8-bit and 16-bit video games, giving your images that distinctive blocky, pixelated look that 
              defined an entire era of gaming.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              Key Features
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Our pixel art generator offers complete control over your artistic vision. Adjust the pixel size 
              from fine 2px details to chunky 32px blocks, perfect for different artistic styles and output 
              resolutions. The color reduction feature lets you limit the palette from 4 colors for a truly 
              retro feel to 64 colors for more detailed artwork. Every setting updates in real-time, so you 
              can see exactly how your changes affect the final result.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              Perfect for Creative Projects
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Whether you're creating assets for indie games, designing retro-themed graphics, or just want 
              to give your photos a unique artistic flair, this tool delivers professional results instantly. 
              The generated pixel art maintains the essential details of your original image while applying 
              the characteristic chunky, low-resolution aesthetic that makes pixel art so appealing.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              Privacy and Performance
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              All processing happens directly in your browser - your images never leave your device, ensuring 
              complete privacy and security. No uploads, no accounts required, no limitations on usage. Simply 
              select your image, adjust the settings, and download your pixel art masterpiece in high-quality 
              PNG format, ready for use in your projects or sharing on social media.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}