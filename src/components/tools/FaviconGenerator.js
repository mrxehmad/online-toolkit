import React, { useState, useRef, useCallback } from 'react';

// Custom icon components to avoid lucide-react issues
const Upload = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const Download = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const Image = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const Settings = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="m12 1 2.75 6.5L22 10l-6.5 2.75L13 22l-2.75-6.5L2 13l6.5-2.75L12 1Z" />
  </svg>
);

const Type = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="4,7 4,4 20,4 20,7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

const Smartphone = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <path d="M12 18h0" />
  </svg>
);

const Monitor = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const Tablet = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12" y2="18" />
  </svg>
);

const Star = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const Zap = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  </svg>
);

const Shield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
);

const Palette = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="13.5" cy="6.5" r=".5" />
    <circle cx="17.5" cy="10.5" r=".5" />
    <circle cx="8.5" cy="7.5" r=".5" />
    <circle cx="6.5" cy="12.5" r=".5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2Z" />
  </svg>
);

const FaviconGenerator = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [generatedFavicons, setGeneratedFavicons] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('image');
  
  // Letter favicon options
  const [letterText, setLetterText] = useState('');
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [backgroundColor, setBackgroundColor] = useState('#3B82F6');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [fontWeight, setFontWeight] = useState('bold');
  
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const faviconSizes = [
    { size: 16, name: 'favicon-16x16.png', desc: 'Browser Tab' },
    { size: 32, name: 'favicon-32x32.png', desc: 'Browser Tab HD' },
    { size: 180, name: 'apple-touch-icon.png', desc: 'iOS Home Screen' },
    { size: 192, name: 'android-chrome-192x192.png', desc: 'Android Home Screen' },
    { size: 512, name: 'android-chrome-512x512.png', desc: 'Android Splash Screen' },
    { size: 96, name: 'favicon-96x96.png', desc: 'Desktop Shortcut' }
  ];

  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 
    'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Courier New', 
    'Palatino', 'Garamond', 'Bookman', 'Arial Black'
  ];

  const backgroundColors = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Green', value: '#10B981' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Teal', value: '#14B8A6' },
    { name: 'Gray', value: '#6B7280' },
    { name: 'Black', value: '#1F2937' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Yellow', value: '#F59E0B' }
  ];

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setGeneratedFavicons([]);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const generateFromImage = useCallback(async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const favicons = faviconSizes.map(({ size, name, desc }) => {
        canvas.width = size;
        canvas.height = size;
        
        ctx.clearRect(0, 0, size, size);
        
        // Create clipping mask for rounded corners
        const radius = size * 0.175;
        drawRoundedRect(ctx, 0, 0, size, size, radius);
        ctx.clip();
        
        // Draw the image
        ctx.drawImage(img, 0, 0, size, size);
        
        const dataURL = canvas.toDataURL('image/png');
        
        // Reset clipping
        ctx.restore();
        ctx.save();
        
        return {
          size,
          name,
          desc,
          dataURL,
          blob: null
        };
      });
      
      Promise.all(
        favicons.map(async (favicon) => {
          const response = await fetch(favicon.dataURL);
          const blob = await response.blob();
          return { ...favicon, blob };
        })
      ).then((faviconData) => {
        setGeneratedFavicons(faviconData);
        setIsGenerating(false);
      });
    };
    
    img.src = uploadedImage;
  }, [uploadedImage]);

  const generateFromText = useCallback(async () => {
    if (!letterText.trim()) return;

    setIsGenerating(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const favicons = faviconSizes.map(({ size, name, desc }) => {
      canvas.width = size;
      canvas.height = size;
      
      ctx.clearRect(0, 0, size, size);
      
      // Draw background with rounded corners
      const radius = size * 0.175;
      drawRoundedRect(ctx, 0, 0, size, size, radius);
      ctx.fillStyle = backgroundColor;
      ctx.fill();
      
      // Draw text
      const fontSize = size * 0.5;
      ctx.font = `${fontWeight} ${fontSize}px ${selectedFont}`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const text = letterText.slice(0, 2).toUpperCase(); // Max 2 characters
      ctx.fillText(text, size / 2, size / 2);
      
      const dataURL = canvas.toDataURL('image/png');
      
      return {
        size,
        name,
        desc,
        dataURL,
        blob: null
      };
    });
    
    Promise.all(
      favicons.map(async (favicon) => {
        const response = await fetch(favicon.dataURL);
        const blob = await response.blob();
        return { ...favicon, blob };
      })
    ).then((faviconData) => {
      setGeneratedFavicons(faviconData);
      setIsGenerating(false);
    });
  }, [letterText, selectedFont, backgroundColor, textColor, fontWeight]);

  const downloadFavicon = (favicon) => {
    const url = URL.createObjectURL(favicon.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = favicon.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    generatedFavicons.forEach((favicon, index) => {
      setTimeout(() => downloadFavicon(favicon), index * 100);
    });
  };

  const generateManifest = () => {
    const manifest = {
      name: "Your App Name",
      short_name: "App",
      description: "Your app description",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ],
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone"
    };

    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site.webmanifest';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const htmlCode = `<!-- Favicon HTML Code -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileColor" content="#da532c">
<meta name="theme-color" content="#ffffff">`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* SEO Meta Information */}
      <div className="hidden">
        <h1>Free Favicon Generator - Create iOS & Android App Icons Online</h1>
        <p>Generate high-quality favicons for your website instantly. Create iOS app icons, Android chrome icons, and browser favicons from any image. Free, fast, and no registration required.</p>
        <meta name="description" content="Free online favicon generator tool. Create iOS app icons, Android icons, and browser favicons instantly. Generate all sizes from 16x16 to 512x512 pixels. No registration required." />
        <meta name="keywords" content="favicon generator, iOS app icon, Android icon, browser icon, free favicon maker, online icon generator, web icon creator" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-white rounded-full p-4 shadow-lg mr-4">
              <Image />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Favicon Generator
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create professional iOS-styled favicons and app icons for all devices. Generate from images or create letter-based icons with custom fonts and colors.
          </p>
          
          {/* Feature badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
              <Zap />
              <span className="text-sm font-medium ml-2">Instant Generation</span>
            </div>
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
              <Shield />
              <span className="text-sm font-medium ml-2">100% Private</span>
            </div>
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
              <Star />
              <span className="text-sm font-medium ml-2">All Sizes Included</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Creation Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {/* Tab Navigation */}
            <div className="flex mb-6 bg-gray-100 rounded-2xl p-1">
              <button
                onClick={() => setActiveTab('image')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'image'
                    ? 'bg-white shadow-md text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Image className="inline w-5 h-5 mr-2" />
                From Image
              </button>
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'text'
                    ? 'bg-white shadow-md text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Type className="inline w-5 h-5 mr-2" />
                From Letters
              </button>
            </div>

            {activeTab === 'image' ? (
              /* Image Upload Tab */
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Upload className="mr-3 text-blue-600" />
                  Upload Your Image
                </h2>
                
                <div 
                  className="border-3 border-dashed border-blue-300 rounded-2xl p-12 text-center transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadedImage ? (
                    <div className="space-y-4">
                      <img 
                        src={uploadedImage} 
                        alt="Uploaded" 
                        className="w-32 h-32 object-cover rounded-2xl mx-auto shadow-lg"
                      />
                      <p className="text-gray-600">Click to change image</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                        <Upload />
                      </div>
                      <div>
                        <p className="text-xl font-medium text-gray-700">Drop your image here</p>
                        <p className="text-gray-500 mt-2">or click to browse</p>
                        <p className="text-sm text-gray-400 mt-1">Supports PNG, JPG, JPEG formats</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {uploadedImage && (
                  <button
                    onClick={generateFromImage}
                    disabled={isGenerating}
                    className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Favicons'}
                  </button>
                )}
              </div>
            ) : (
              /* Letter Creation Tab */
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <Type className="mr-3 text-blue-600" />
                  Create Letter Icon
                </h2>

                {/* Text Input */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Text (1-2 characters)
                  </label>
                  <input
                    type="text"
                    value={letterText}
                    onChange={(e) => setLetterText(e.target.value.slice(0, 2))}
                    placeholder="AB"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg font-semibold text-center"
                  />
                </div>

                {/* Font Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    {fonts.map((font) => (
                      <option key={font} value={font} style={{ fontFamily: font }}>
                        {font}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Font Weight */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Font Weight
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['normal', 'bold', 'bolder'].map((weight) => (
                      <button
                        key={weight}
                        onClick={() => setFontWeight(weight)}
                        className={`py-2 px-3 rounded-lg transition-all ${
                          fontWeight === weight
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {weight === 'normal' ? 'Regular' : weight.charAt(0).toUpperCase() + weight.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Color */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {backgroundColors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setBackgroundColor(color.value)}
                        className={`w-12 h-12 rounded-lg border-2 transition-all ${
                          backgroundColor === color.value
                            ? 'border-gray-800 scale-110'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                </div>

                {/* Text Color */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Text Color
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => setTextColor('#FFFFFF')}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        textColor === '#FFFFFF' ? 'border-gray-800 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: '#FFFFFF' }}
                      title="White"
                    />
                    <button
                      onClick={() => setTextColor('#000000')}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        textColor === '#000000' ? 'border-gray-800 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: '#000000' }}
                      title="Black"
                    />
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Preview */}
                {letterText && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preview
                    </label>
                    <div className="flex justify-center">
                      <div
                        className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg"
                        style={{
                          backgroundColor: backgroundColor,
                          color: textColor,
                          fontFamily: selectedFont,
                          fontWeight: fontWeight
                        }}
                      >
                        {letterText.slice(0, 2).toUpperCase()}
                      </div>
                    </div>
                  </div>
                )}

                {letterText.trim() && (
                  <button
                    onClick={generateFromText}
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Letter Favicons'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Preview and Download Section */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Download className="mr-3 text-blue-600" />
              Generated Favicons
            </h2>

            {generatedFavicons.length > 0 ? (
              <div className="space-y-6">
                {/* Device Preview */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <Settings className="mr-2" />
                    Preview on Devices
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Smartphone className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <div className="w-12 h-12 bg-black rounded-lg mx-auto flex items-center justify-center">
                        <img 
                          src={generatedFavicons.find(f => f.size === 180)?.dataURL} 
                          alt="iOS Icon" 
                          className="w-10 h-10 rounded-lg"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">iOS</p>
                    </div>
                    <div className="text-center">
                      <Tablet className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <div className="w-12 h-12 bg-gray-200 rounded mx-auto flex items-center justify-center">
                        <img 
                          src={generatedFavicons.find(f => f.size === 192)?.dataURL} 
                          alt="Android Icon" 
                          className="w-10 h-10 rounded"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Android</p>
                    </div>
                    <div className="text-center">
                      <Monitor className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <div className="w-12 h-12 bg-blue-600 rounded mx-auto flex items-center justify-center">
                        <img 
                          src={generatedFavicons.find(f => f.size === 32)?.dataURL} 
                          alt="Browser Icon" 
                          className="w-8 h-8"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Browser</p>
                    </div>
                  </div>
                </div>

                {/* Download Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {generatedFavicons.map((favicon) => (
                    <div
                      key={favicon.size}
                      className="bg-gray-50 rounded-xl p-4 flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <img 
                          src={favicon.dataURL} 
                          alt={favicon.name}
                          className="w-10 h-10 rounded-lg shadow-sm"
                        />
                        <div>
                          <p className="font-medium text-sm">{favicon.size}×{favicon.size}</p>
                          <p className="text-xs text-gray-500">{favicon.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadFavicon(favicon)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>

                {/* Bulk Actions */}
                <div className="space-y-3">
                  <button
                    onClick={downloadAll}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  >
                    Download All Favicons
                  </button>
                  <button
                    onClick={generateManifest}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
                  >
                    Download Web Manifest
                  </button>
                </div>

                {/* HTML Code */}
                <div className="bg-gray-900 rounded-2xl p-6">
                  <h3 className="text-white font-semibold mb-3">HTML Code</h3>
                  <pre className="text-green-400 text-xs overflow-x-auto">
                    <code>{htmlCode}</code>
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Image />
                </div>
                <p className="text-gray-500">Upload an image or create letter icon to generate favicons</p>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Why Choose Our Favicon Generator?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap />
              </div>
              <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
              <p className="text-gray-600">Generate all favicon sizes instantly with our optimized browser-based processing. No server delays or waiting times.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield />
              </div>
              <h3 className="text-xl font-semibold mb-3">100% Private</h3>
              <p className="text-gray-600">Your images never leave your device. Everything is processed locally in your browser for maximum privacy and security.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star />
              </div>
              <h3 className="text-xl font-semibold mb-3">Professional Quality</h3>
              <p className="text-gray-600">Generate iOS-styled icons with perfect rounded corners and all the sizes you need for modern websites and apps.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette />
              </div>
              <h3 className="text-xl font-semibold mb-3">Letter Icons</h3>
              <p className="text-gray-600">Create stunning letter-based favicons with custom fonts, colors, and styles. Perfect for brand initials and monograms.</p>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-16 bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Complete Favicon Solution for Modern Websites
          </h2>
          <div className="prose max-w-none text-gray-600 space-y-4">
            <p>
              Create professional favicons and app icons for your website with our free online favicon generator. 
              Our tool generates all the essential sizes needed for modern web browsers, iOS devices, and Android platforms.
            </p>
            <p>
              Generate high-quality icons in sizes ranging from 16x16 pixels for browser tabs to 512x512 pixels for 
              Android splash screens. Each favicon is optimized with iOS-style rounded corners for a modern, 
              professional appearance across all devices.
            </p>
            <p>
              Choose between uploading your own image or creating beautiful letter-based icons with custom fonts, 
              colors, and styles. Our letter favicon feature is perfect for creating brand monograms, initials, 
              or simple text-based icons that look professional across all platforms.
            </p>
            <p>
              Perfect for web developers, designers, and business owners who need quick, professional favicon 
              generation without compromising on quality or privacy. All processing happens in your browser, 
              ensuring your images remain completely private and secure.
            </p>
          </div>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default FaviconGenerator;