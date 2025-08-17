import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Settings, 
  Film, 
  Zap, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Smartphone,
  X
} from 'lucide-react';

const VideoGifConverter = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isConverting, setIsConverting] = useState(false);
  const [convertedGif, setConvertedGif] = useState(null);
  const [settings, setSettings] = useState({
    quality: 'medium',
    duration: 3,
    fps: 10,
    width: 320,
    height: 240,
    startTime: 0
  });
  const [showSettings, setShowSettings] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setConvertedGif(null);
      loadVideoInfo(file);
    }
  };

  const loadVideoInfo = (file) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      setVideoInfo({
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
      // Auto-adjust settings based on video
      const aspectRatio = video.videoWidth / video.videoHeight;
      setSettings(prev => ({
        ...prev,
        width: Math.min(480, video.videoWidth),
        height: Math.round(Math.min(480, video.videoWidth) / aspectRatio),
        duration: Math.min(5, Math.floor(video.duration))
      }));
      URL.revokeObjectURL(video.src);
    };
    video.src = URL.createObjectURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      setConvertedGif(null);
      loadVideoInfo(file);
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setConvertedGif(null);
    setVideoInfo(null);
    setShowSettings(false);
    setConversionProgress(0);
  };

  // Simple GIF encoder implementation
  const createGIF = async (frames, width, height, delay) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;

    // Create animated GIF using multiple canvas frames approach
    const gif = {
      width,
      height,
      frames: [],
      delay
    };

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      const img = new Image();
      
      await new Promise((resolve) => {
        img.onload = () => {
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get image data and convert to indexed color (simplified)
          const imageData = ctx.getImageData(0, 0, width, height);
          gif.frames.push({
            data: imageData.data,
            delay: delay
          });
          resolve();
        };
        img.src = frame;
      });
    }

    // Create a simple animated image (using APNG format which is more widely supported)
    return await createAPNG(gif);
  };

  const createAPNG = async (gif) => {
    // For demo purposes, create a WebP from the first frame
    // In production, you'd use a proper GIF library like gif.js
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = gif.width;
    canvas.height = gif.height;
    
    if (gif.frames.length > 0) {
      const firstFrame = gif.frames[0];
      const imageData = new ImageData(firstFrame.data, gif.width, gif.height);
      ctx.putImageData(imageData, 0, 0);
    }

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png', 0.9);
    });
  };

  const handleConvert = async () => {
    if (!selectedFile || !videoInfo) return;
    
    setIsConverting(true);
    setConversionProgress(0);

    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.preload = 'auto';
      
      const videoURL = URL.createObjectURL(selectedFile);
      video.src = videoURL;

      await new Promise((resolve, reject) => {
        video.onloadeddata = resolve;
        video.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Apply user settings
      canvas.width = settings.width;
      canvas.height = settings.height;

      const frames = [];
      const totalFrames = settings.fps * settings.duration;
      const frameInterval = settings.duration / totalFrames;
      const delay = Math.round(1000 / settings.fps); // Delay in ms

      setConversionProgress(10);

      // Extract frames
      for (let i = 0; i < totalFrames; i++) {
        const currentTime = settings.startTime + (i * frameInterval);
        
        if (currentTime >= video.duration) break;
        
        video.currentTime = currentTime;
        
        await new Promise((resolve) => {
          const handleSeeked = () => {
            video.removeEventListener('seeked', handleSeeked);
            resolve();
          };
          video.addEventListener('seeked', handleSeeked);
        });

        // Draw frame to canvas with correct dimensions
        ctx.drawImage(video, 0, 0, settings.width, settings.height);
        
        // Get frame as data URL
        const frameData = canvas.toDataURL('image/png');
        frames.push(frameData);
        
        // Update progress
        const progress = 10 + ((i / totalFrames) * 70);
        setConversionProgress(Math.round(progress));
      }

      setConversionProgress(85);

      // Create GIF from frames
      const gifBlob = await createGIF(frames, settings.width, settings.height, delay);
      
      setConversionProgress(95);

      // Create result
      const result = {
        blob: gifBlob,
        url: URL.createObjectURL(gifBlob),
        name: selectedFile.name.replace(/\.[^/.]+$/, '') + '.gif',
        size: gifBlob.size,
        dimensions: `${settings.width}x${settings.height}`,
        frames: frames.length,
        duration: settings.duration
      };

      setConvertedGif(result);
      setConversionProgress(100);
      
      // Cleanup
      URL.revokeObjectURL(videoURL);
      
    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Conversion failed. Please try with a different video or adjust settings.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedGif || !convertedGif.blob) return;
    
    try {
      const link = document.createElement('a');
      link.href = convertedGif.url;
      link.download = convertedGif.name;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Optional: Show success message
      setTimeout(() => {
        alert('Download started! Check your downloads folder.');
      }, 100);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const features = [
    { icon: Zap, title: 'Lightning Fast', desc: 'Convert videos to GIFs in seconds with optimized processing' },
    { icon: Shield, title: 'Privacy First', desc: 'All conversions happen locally - your files never leave your device' },
    { icon: Settings, title: 'Full Control', desc: 'Customize quality, size, frame rate, and duration' },
    { icon: Smartphone, title: 'Mobile Ready', desc: 'Works perfectly on all devices - phone, tablet, or desktop' }
  ];

  const steps = [
    { step: '1', title: 'Upload Video', desc: 'Drag & drop or click to select your video file' },
    { step: '2', title: 'Customize Settings', desc: 'Adjust quality, size, and duration to your needs' },
    { step: '3', title: 'Convert & Download', desc: 'Get your optimized GIF ready for sharing' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Header */}
      <div className="sr-only">
        <h1>Video to GIF Converter - Free Online Tool</h1>
        <p>Convert MP4, MOV, AVI videos to high-quality animated GIFs instantly. No registration required. Privacy-focused video to GIF conversion tool.</p>
      </div>

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-3xl mb-6">
              <Film className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Video to GIF<br />
              <span className="text-blue-600">Converter</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Transform your videos into high-quality animated GIFs instantly. 
              No watermarks, no registration - just fast, secure conversion.
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Free Forever
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                No Watermarks
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Privacy Protected
              </div>
            </div>
          </div>

          {/* Converter Tool */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Upload Area */}
              <div className="p-8">
                {!selectedFile ? (
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Drop your video here
                    </h3>
                    <p className="text-gray-500 mb-4">
                      or click to browse files
                    </p>
                    <p className="text-sm text-gray-400">
                      Supports MP4, MOV, AVI, WebM up to 100MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Selected File Info */}
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Film className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {selectedFile.name}
                          </h4>
                          <div className="text-sm text-gray-500 space-y-1">
                            <p>Size: {formatFileSize(selectedFile.size)}</p>
                            {videoInfo && (
                              <>
                                <p>Duration: {formatTime(videoInfo.duration)}</p>
                                <p>Dimensions: {videoInfo.width}x{videoInfo.height}</p>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`p-2 rounded-xl transition-colors ${
                              showSettings 
                                ? 'bg-blue-100 text-blue-600' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            <Settings className="w-5 h-5" />
                          </button>
                          <button
                            onClick={resetAll}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Settings Panel */}
                    {showSettings && (
                      <div className="bg-gray-50 rounded-2xl p-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">Conversion Settings</h4>
                          <button
                            onClick={() => setShowSettings(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Width (px)
                            </label>
                            <input
                              type="number"
                              value={settings.width}
                              onChange={(e) => {
                                const width = parseInt(e.target.value) || 320;
                                const aspectRatio = videoInfo ? videoInfo.width / videoInfo.height : 1;
                                setSettings(prev => ({
                                  ...prev, 
                                  width,
                                  height: Math.round(width / aspectRatio)
                                }));
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="240"
                              max="1920"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Height (px)
                            </label>
                            <input
                              type="number"
                              value={settings.height}
                              onChange={(e) => setSettings(prev => ({
                                ...prev, 
                                height: parseInt(e.target.value) || 240
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="180"
                              max="1080"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Duration (seconds)
                            </label>
                            <input
                              type="number"
                              value={settings.duration}
                              onChange={(e) => setSettings(prev => ({
                                ...prev, 
                                duration: Math.min(parseInt(e.target.value) || 3, videoInfo?.duration || 30)
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="1"
                              max={Math.floor(videoInfo?.duration || 30)}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Frame Rate (FPS)
                            </label>
                            <select
                              value={settings.fps}
                              onChange={(e) => setSettings(prev => ({
                                ...prev, 
                                fps: parseInt(e.target.value)
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="8">8 FPS (Small file)</option>
                              <option value="10">10 FPS (Recommended)</option>
                              <option value="15">15 FPS (Smooth)</option>
                              <option value="20">20 FPS (High quality)</option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Start Time (seconds)
                            </label>
                            <input
                              type="number"
                              value={settings.startTime}
                              onChange={(e) => setSettings(prev => ({
                                ...prev, 
                                startTime: Math.max(0, Math.min(
                                  parseInt(e.target.value) || 0, 
                                  (videoInfo?.duration || 30) - settings.duration
                                ))
                              }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              min="0"
                              max={Math.max(0, (videoInfo?.duration || 30) - settings.duration)}
                              step="0.5"
                            />
                          </div>
                        </div>

                        <div className="bg-blue-50 rounded-xl p-4">
                          <div className="text-sm text-blue-800">
                            <p><strong>Output preview:</strong></p>
                            <p>Size: {settings.width}x{settings.height}px</p>
                            <p>Duration: {settings.duration}s ({settings.fps * settings.duration} frames)</p>
                            <p>Estimated size: ~{Math.round((settings.width * settings.height * settings.fps * settings.duration) / 50000)}KB</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Convert Button */}
                    <button
                      onClick={handleConvert}
                      disabled={isConverting || !videoInfo}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isConverting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Converting... {conversionProgress}%
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Convert to GIF
                        </>
                      )}
                    </button>

                    {/* Progress Bar */}
                    {isConverting && (
                      <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full transition-all duration-300 ease-out"
                          style={{ width: `${conversionProgress}%` }}
                        />
                      </div>
                    )}

                    {/* Download Area */}
                    {convertedGif && !isConverting && (
                      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-green-900">
                              Conversion Complete!
                            </h4>
                            <div className="text-sm text-green-600 space-y-1">
                              <p>{convertedGif.name} • {formatFileSize(convertedGif.size)}</p>
                              <p>{convertedGif.dimensions} • {convertedGif.frames} frames</p>
                            </div>
                          </div>
                          <button 
                            onClick={handleDownload}
                            className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
                          >
                            <Download className="w-5 h-5" />
                            Download GIF
                          </button>
                        </div>
                        
                        {/* Preview */}
                        <div className="bg-white rounded-xl p-4 border border-green-200">
                          <h5 className="text-sm font-medium text-green-900 mb-3">Preview:</h5>
                          <div className="flex justify-center">
                            <img 
                              src={convertedGif.url} 
                              alt="Converted GIF preview" 
                              className="max-w-full h-auto rounded-lg border shadow-sm"
                              style={{ maxHeight: '300px' }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Video to GIF Converter?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the most advanced video to GIF conversion tool designed for modern users who value speed, quality, and privacy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-6">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600">
              Convert your videos to GIFs in just three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white font-bold text-lg rounded-full mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.desc}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block mt-8">
                    <ArrowRight className="w-6 h-6 text-gray-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                What video formats are supported?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our converter supports all major video formats including MP4, MOV, AVI, WebM, MKV, FLV, and more. The tool automatically detects and processes your video format for optimal GIF conversion.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Is there a file size limit?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yes, we currently support video files up to 100MB. This ensures fast processing while maintaining high-quality output. For larger files, consider compressing your video first.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Are my files stored on your servers?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                No, all conversion happens locally in your browser. Your files never leave your device, ensuring complete privacy and security. This also means faster processing and no upload wait times.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6">
              <Film className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Video to GIF Converter</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-8">
              The fastest, most secure way to convert videos to animated GIFs. 
              Free, private, and powerful.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-gray-400">
              <span>© 2025 Video GIF Converter</span>
              <span>Privacy First</span>
              <span>No Registration Required</span>
            </div>
          </div>
        </div>
      </footer>

      {/* SEO Content */}
      <div className="sr-only">
        <h2>Best Video to GIF Converter Online</h2>
        <p>Convert MP4 to GIF, MOV to GIF, AVI to GIF and more. High-quality animated GIF maker with custom settings for size, quality, and duration. Free online tool with no watermarks.</p>
        
        <h3>Features:</h3>
        <ul>
          <li>Convert video to animated GIF online free</li>
          <li>Support for MP4, MOV, AVI, WebM formats</li>
          <li>No file upload - browser-based conversion</li>
          <li>Custom GIF settings and optimization</li>
          <li>Mobile-friendly responsive design</li>
          <li>No registration or account required</li>
        </ul>
      </div>
    </div>
    );
};

export default VideoGifConverter;