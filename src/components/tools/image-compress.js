import React, { useState, useCallback, useRef } from 'react';
import { 
  Upload, 
  Download,
  Zap, 
  Settings, 
  CheckCircle,
  Smartphone
} from 'lucide-react';
import imageCompression from "browser-image-compression";

// SEO Component
const SEOHead = () => (
  <>
    <title>Free Image Compressor Tool - Reduce Photo Size Online | TeaTic</title>
    <meta name="description" content="Free online image compressor tool to reduce photo file size without losing quality. Compress JPEG, PNG, WebP images instantly. Professional iOS-style interface with drag & drop support." />
    <meta name="keywords" content="image compressor, photo compressor, reduce image size, compress images online, image optimization, photo optimization, free image tool, TeaTic" />
    <meta name="author" content="TeaTic" />
    <meta property="og:title" content="Free Image Compressor Tool - Reduce Photo Size Online" />
    <meta property="og:description" content="Compress images online for free. Professional tool with iOS-style interface. Reduce file size while maintaining quality." />
    <meta property="og:type" content="website" />
  </>
);

const ImageCompressor = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [compressedFile, setCompressedFile] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionSettings, setCompressionSettings] = useState({
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    fileType: 'original'
  });
  const [compressionStats, setCompressionStats] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setCompressedFile(null);
        setCompressionStats(null);
      }
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setCompressedFile(null);
      setCompressionStats(null);
    }
  };

  const compressImage = async () => {
    if (!selectedFile) return;
    
    setIsCompressing(true);
    
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: Math.max(compressionSettings.maxWidth, compressionSettings.maxHeight),
        quality: compressionSettings.quality,
        useWebWorker: true,
        fileType: compressionSettings.fileType === 'original' ? selectedFile.type : compressionSettings.fileType
      };

      const compressedFile = await imageCompression(selectedFile, options);
      
      setCompressedFile(compressedFile);
      setCompressionStats({
        originalSize: selectedFile.size,
        compressedSize: compressedFile.size,
        compressionRatio: ((selectedFile.size - compressedFile.size) / selectedFile.size * 100).toFixed(1)
      });
    } catch (error) {
      console.error('Compression failed:', error);
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedFile) return;
    
    const url = URL.createObjectURL(compressedFile);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_${selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setSelectedFile(null);
    setCompressedFile(null);
    setCompressionStats(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <SEOHead />
      
      {/* Header
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Image className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TeaTic Compressor</h1>
                <p className="text-xs text-white/70">Professional Image Optimization</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">How it Works</a>
              <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
            </nav>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Compress Images
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Like a Pro
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Reduce image file sizes by up to 90% without losing quality. Professional-grade compression with an intuitive iOS-inspired interface.
          </p>
        </div>
      </section>

      {/* Main Compressor Tool */}
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            
            {/* Upload Area */}
            {!selectedFile && (
              <div
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-400/10' 
                    : 'border-white/30 hover:border-white/50 hover:bg-white/5'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Drop your image here</h3>
                <p className="text-white/70 mb-6">or click to browse from your device</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Choose Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <p className="text-xs text-white/50 mt-4">Supports JPEG, PNG, WebP • Max file size: 10MB</p>
              </div>
            )}

            {/* Image Preview and Settings */}
            {selectedFile && (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-white">Image Ready for Compression</h3>
                  <button
                    onClick={reset}
                    className="text-white/60 hover:text-white transition-colors"
                  >
                    ✕ Reset
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Image Preview */}
                  <div className="bg-white/5 rounded-2xl p-6">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-xl mb-4"
                    />
                    <div className="space-y-2">
                      <p className="text-white font-medium">{selectedFile.name}</p>
                      <p className="text-white/70 text-sm">
                        Size: {formatFileSize(selectedFile.size)} • Type: {selectedFile.type}
                      </p>
                    </div>
                  </div>

                  {/* Compression Settings */}
                  <div className="bg-white/5 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <Settings className="w-6 h-6 text-blue-400" />
                      <h4 className="text-xl font-bold text-white">Compression Settings</h4>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-3">
                          Quality: {Math.round(compressionSettings.quality * 100)}%
                        </label>
                        <input
                          type="range"
                          min="0.1"
                          max="1"
                          step="0.1"
                          value={compressionSettings.quality}
                          onChange={(e) => setCompressionSettings({
                            ...compressionSettings,
                            quality: parseFloat(e.target.value)
                          })}
                          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-3">
                          Max Width (px)
                        </label>
                        <input
                          type="number"
                          value={compressionSettings.maxWidth}
                          onChange={(e) => setCompressionSettings({
                            ...compressionSettings,
                            maxWidth: parseInt(e.target.value)
                          })}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-blue-400"
                        />
                      </div>

                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-3">
                          Output Format
                        </label>
                        <select
                          value={compressionSettings.fileType}
                          onChange={(e) => setCompressionSettings({
                            ...compressionSettings,
                            fileType: e.target.value
                          })}
                          className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                        >
                          <option value="original">Keep Original</option>
                          <option value="image/jpeg">JPEG</option>
                          <option value="image/png">PNG</option>
                          <option value="image/webp">WebP</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Compress Button */}
                <div className="text-center">
                  <button
                    onClick={compressImage}
                    disabled={isCompressing}
                    className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center space-x-3 mx-auto"
                  >
                    {isCompressing ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Compressing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Compress Image</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Compression Results */}
            {compressionStats && compressedFile && (
              <div className="mt-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl p-6 border border-green-500/30">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <h4 className="text-xl font-bold text-white">Compression Complete!</h4>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Original Size</p>
                    <p className="text-2xl font-bold text-white">{formatFileSize(compressionStats.originalSize)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Compressed Size</p>
                    <p className="text-2xl font-bold text-green-400">{formatFileSize(compressionStats.compressedSize)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white/70 text-sm">Size Reduction</p>
                    <p className="text-2xl font-bold text-blue-400">{compressionStats.compressionRatio}%</p>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    onClick={downloadCompressed}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 mx-auto"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Compressed Image</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose TeaTic Compressor?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Professional-grade image optimization with cutting-edge technology and user-friendly design.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Lightning Fast</h3>
              <p className="text-white/70">
                Advanced compression algorithms process your images in seconds, not minutes.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">iOS Design</h3>
              <p className="text-white/70">
                Beautiful, intuitive interface inspired by Apple's design principles for seamless experience.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 text-center hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Quality Preserved</h3>
              <p className="text-white/70">
                Reduce file size by up to 90% while maintaining exceptional visual quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer
      <footer className="bg-black/20 backdrop-blur-xl border-t border-white/20 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Image className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">TeaTic</span>
          </div>
          <p className="text-white/60 mb-6">
            Professional image compression tool built with modern web technologies.
          </p>
          <p className="text-white/40 text-sm">
            © 2025 TeaTic. All rights reserved. Built with React and modern web standards.
          </p>
        </div>
      </footer> */}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default ImageCompressor;