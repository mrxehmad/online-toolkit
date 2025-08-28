import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, ImageIcon, Zap, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function ImageFormatConverter() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('jpg');
  const [quality, setQuality] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedImage, setConvertedImage] = useState(null);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const fileInputRef = useRef(null);
  const resultSectionRef = useRef(null);

  // Simulate theme detection
  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(darkMode);
    };
    
    checkDarkMode();
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', checkDarkMode);
    
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', checkDarkMode);
    };
  }, []);

  // SEO metadata setup
  useEffect(() => {
    document.title = 'Image Format Converter - PNG to JPG, WebP Converter Online';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Free online image format converter. Convert PNG to JPG, JPG to WebP, WebP to PNG instantly. High-quality image conversion tool with adjustable quality settings.';
    
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;
    
    return () => {
      document.title = 'Image Format Converter';
    };
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
      if (validTypes.includes(file.type.toLowerCase()) || file.name.match(/\.(jpg|jpeg|png|webp|gif|bmp)$/i)) {
        setSelectedFile(file);
        setError('');
        setConvertedImage(null);
      } else {
        setError('Please select a valid image file (JPG, PNG, WebP, GIF, BMP)');
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'];
      if (validTypes.includes(file.type.toLowerCase()) || file.name.match(/\.(jpg|jpeg|png|webp|gif|bmp)$/i)) {
        setSelectedFile(file);
        setError('');
        setConvertedImage(null);
      } else {
        setError('Please drop a valid image file (JPG, PNG, WebP, GIF, BMP)');
      }
    }
  };

  const convertImage = () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError('');

    // Create image element
    const img = new Image();
    
    img.onload = () => {
      try {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match image
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        
        // For JPG, fill with white background first
        if (outputFormat === 'jpg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        // Draw image onto canvas
        ctx.drawImage(img, 0, 0);
        
        // Convert to blob
        const mimeType = outputFormat === 'jpg' ? 'image/jpeg' : 
                        outputFormat === 'png' ? 'image/png' : 'image/webp';
        
        const qualityValue = outputFormat === 'png' ? undefined : quality / 100;
        
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setConvertedImage({
              url,
              blob,
              filename: `converted.${outputFormat}`,
              size: blob.size
            });
            
            setIsProcessing(false);
            
            // Scroll to result section after 1.2 seconds
            setTimeout(() => {
              resultSectionRef.current?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
              });
            }, 1200);
          } else {
            setError('Failed to convert image. Please try again.');
            setIsProcessing(false);
          }
        }, mimeType, qualityValue);
        
      } catch (err) {
        console.error('Canvas error:', err);
        setError('Image processing failed. Please try again.');
        setIsProcessing(false);
      }
    };
    
    img.onerror = () => {
      setError('Failed to load image. Please try a different file.');
      setIsProcessing(false);
    };
    
    // Load image from file
    img.src = URL.createObjectURL(selectedFile);
  };

  const downloadImage = () => {
    if (convertedImage) {
      const link = document.createElement('a');
      link.href = convertedImage.url;
      link.download = convertedImage.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateCompression = () => {
    if (!selectedFile || !convertedImage) return 0;
    const originalSize = selectedFile.size;
    const newSize = convertedImage.size;
    
    if (newSize >= originalSize) {
      return `+${(((newSize - originalSize) / originalSize) * 100).toFixed(1)}% larger`;
    } else {
      return `${(((originalSize - newSize) / originalSize) * 100).toFixed(1)}% smaller`;
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setConvertedImage(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`min-h-screen py-8 px-4 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <ImageIcon className="inline-block mr-3 mb-2" size={48} />
            Image Format Converter
          </h1>
          <p className={`text-lg md:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Convert between PNG, JPG, and WebP formats instantly
          </p>
        </div>

        {/* Main Tool Card */}
        <div className={`rounded-2xl shadow-lg p-6 md:p-8 mb-8 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 shadow-gray-900/20' : 'bg-white shadow-gray-200'
        }`}>
          
          {/* Upload Section */}
          <div className="mb-8">
            <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Upload Image
            </h2>
            
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-blue-400 ${
                isDarkMode 
                  ? 'border-gray-600 hover:bg-gray-700/50 bg-gray-700/20' 
                  : 'border-gray-300 hover:bg-blue-50 bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
              <p className={`text-lg mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {selectedFile ? selectedFile.name : 'Drag & drop an image or click to browse'}
              </p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                Supports PNG, JPG, JPEG, WebP, GIF, and BMP files
              </p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
              />
            </div>

            {selectedFile && (
              <div className={`mt-4 p-4 rounded-lg flex items-center justify-between ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
              }`}>
                <div className="flex items-center">
                  <CheckCircle className="text-green-500 mr-3" size={20} />
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedFile.name}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Conversion Options */}
          {selectedFile && (
            <div className="mb-8">
              <h3 className={`text-xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Conversion Settings
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Output Format
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value)}
                    className={`w-full p-3 rounded-lg border transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                        : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                  >
                    <option value="jpg">JPG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>
                
                {outputFormat !== 'png' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Quality: {quality}%
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={quality}
                      onChange={(e) => setQuality(e.target.value)}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Convert Button */}
          {selectedFile && (
            <div className="text-center mb-8">
              <button
                onClick={convertImage}
                disabled={isProcessing}
                className={`inline-flex items-center px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105'
                } text-white shadow-lg`}
              >
                {isProcessing ? (
                  <RefreshCw className="animate-spin mr-3" size={20} />
                ) : (
                  <Zap className="mr-3" size={20} />
                )}
                {isProcessing ? 'Converting...' : 'Convert Image'}
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className={`p-4 rounded-lg mb-6 flex items-center ${
              isDarkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-700'
            }`}>
              <AlertCircle className="mr-3" size={20} />
              {error}
            </div>
          )}

          {/* Result Section */}
          {convertedImage && (
            <div ref={resultSectionRef} className={`p-6 rounded-xl ${
              isDarkMode ? 'bg-gray-700/50' : 'bg-green-50'
            }`}>
              <h3 className={`text-xl font-semibold mb-4 flex items-center ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <CheckCircle className="text-green-500 mr-3" size={24} />
                Conversion Complete!
              </h3>
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className={`font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Output: {convertedImage.filename}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Size: {formatFileSize(convertedImage.size)}
                  </p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Size change: {calculateCompression()}
                  </p>
                </div>
                
                <button
                  onClick={downloadImage}
                  className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-300"
                >
                  <Download className="mr-2" size={20} />
                  Download
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className={`rounded-2xl shadow-lg p-6 md:p-8 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-800 shadow-gray-900/20' : 'bg-white shadow-gray-200'
        }`}>
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Professional Image Format Converter
          </h2>
          
          <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''}`}>
            <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Transform your images between popular formats with our advanced online converter. Whether you need to convert PNG to JPG for smaller file sizes, JPG to WebP for better compression, or PNG for transparency support, our tool handles it all with professional-grade quality.
            </p>
            
            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Key Features
            </h3>
            <ul className={`space-y-2 mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                <span><strong>Universal Format Support:</strong> Convert between PNG, JPG, JPEG, and WebP formats seamlessly</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                <span><strong>Adjustable Quality:</strong> Fine-tune compression levels from 1-100% for optimal file size vs quality balance</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                <span><strong>Client-Side Processing:</strong> Your images never leave your device - complete privacy and security</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                <span><strong>Drag & Drop Interface:</strong> Intuitive design with drag and drop support for effortless uploads</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-green-500 mr-2 mt-0.5 flex-shrink-0" size={16} />
                <span><strong>Instant Results:</strong> Fast conversion with real-time compression statistics and file size comparison</span>
              </li>
            </ul>

            <h3 className={`text-xl font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Perfect for Web Developers & Content Creators
            </h3>
            <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Optimize your website's loading speed by converting images to the most suitable format. Use WebP for modern browsers with superior compression, JPG for photographs with smaller file sizes, or PNG when you need transparency support. Our converter helps you make the right choice for your specific use case.
            </p>

            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <strong>SEO Optimized:</strong> Smaller image files mean faster page loads, improved Core Web Vitals, and better search engine rankings. Convert your images today and see the difference in your website's performance metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}