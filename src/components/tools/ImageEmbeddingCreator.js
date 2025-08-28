import React, { useState, useRef } from 'react';
import { Upload, Download, Copy, Image as ImageIcon, Settings, Eye, Code, Palette, Zap } from 'lucide-react';

const useTheme = () => {
  const [theme, setTheme] = useState('light');
  return { theme, setTheme };
};

export default function ImageEmbeddingCreator() {
  const { theme } = useTheme();
  const [selectedFile, setSelectedFile] = useState(null);
  const [embedCode, setEmbedCode] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [embedType, setEmbedType] = useState('base64');
  const [outputFormat, setOutputFormat] = useState('html');
  const [showResult, setShowResult] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const fileInputRef = useRef(null);

  // SEO metadata
  React.useEffect(() => {
    document.title = 'Image Embedding Creator - Convert Images to Embeddable Code | Free Online Tool';
    
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', 'Free online image embedding creator tool. Convert images to base64, data URLs, or HTML/CSS embed codes. Perfect for web developers, bloggers, and designers. No upload required - works entirely in your browser.');
    document.head.appendChild(metaDescription);

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    canonical.setAttribute('href', window.location.href);
    document.head.appendChild(canonical);
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target.result;
        setPreviewUrl(result);
        generateEmbedCode(result, file);
        setShowResult(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateEmbedCode = (dataUrl, file) => {
    const fileName = file.name;
    const fileSize = (file.size / 1024).toFixed(2);
    
    let code = '';
    
    switch (embedType) {
      case 'base64':
        if (outputFormat === 'html') {
          code = `<img src="${dataUrl}" alt="${fileName}" width="auto" height="auto" />`;
        } else if (outputFormat === 'css') {
          code = `.image-embed {
  background-image: url('${dataUrl}');
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 200px;
}`;
        } else if (outputFormat === 'markdown') {
          code = `![${fileName}](${dataUrl})`;
        } else if (outputFormat === 'json') {
          code = JSON.stringify({
            name: fileName,
            size: fileSize + 'KB',
            dataUrl: dataUrl,
            type: file.type
          }, null, 2);
        }
        break;
      
      case 'responsive':
        code = `<picture>
  <source media="(min-width: 768px)" srcset="${dataUrl}">
  <img src="${dataUrl}" alt="${fileName}" class="responsive-image" />
</picture>

<style>
.responsive-image {
  width: 100%;
  height: auto;
  max-width: 100%;
  object-fit: cover;
}
</style>`;
        break;
        
      case 'lazy':
        code = `<img 
  src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiLz48L3N2Zz4="
  data-src="${dataUrl}"
  alt="${fileName}"
  loading="lazy"
  class="lazy-image"
  onload="this.classList.add('loaded')"
/>

<style>
.lazy-image {
  transition: opacity 0.3s;
  opacity: 0.5;
}
.lazy-image.loaded {
  opacity: 1;
}
</style>`;
        break;
    }
    
    setEmbedCode(code);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      const event = { target: { files: [files[0]] } };
      handleFileSelect(event);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(embedCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadCode = () => {
    const extension = outputFormat === 'json' ? 'json' : outputFormat === 'css' ? 'css' : outputFormat === 'markdown' ? 'md' : 'html';
    const blob = new Blob([embedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `embed-code.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetTool = () => {
    setSelectedFile(null);
    setEmbedCode('');
    setPreviewUrl('');
    setShowResult(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            Image Embedding Creator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Transform your images into embeddable code instantly. Convert images to base64, generate responsive HTML, 
            create lazy-loading implementations, or export as CSS, Markdown, and JSON formats. Perfect for developers, 
            bloggers, and designers who need quick image embedding solutions without external hosting.
          </p>
        </div>

        {/* Main Tool Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-200">
          
          {/* Controls */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Settings className="w-4 h-4 inline mr-1" />
                  Embed Type
                </label>
                <select
                  value={embedType}
                  onChange={(e) => {
                    setEmbedType(e.target.value);
                    if (selectedFile && previewUrl) {
                      generateEmbedCode(previewUrl, selectedFile);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="base64">Base64 Data URL</option>
                  <option value="responsive">Responsive Image</option>
                  <option value="lazy">Lazy Loading</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Code className="w-4 h-4 inline mr-1" />
                  Output Format
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => {
                    setOutputFormat(e.target.value);
                    if (selectedFile && previewUrl) {
                      generateEmbedCode(previewUrl, selectedFile);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="markdown">Markdown</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200 cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {!selectedFile ? (
                <div>
                  <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supports PNG, JPG, GIF, WebP, SVG
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                    <div className="text-left">
                      <p className="font-medium text-gray-800 dark:text-gray-200">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      resetTool();
                    }}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
                  >
                    Remove Image
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          {showResult && embedCode && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Generated Code
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1 ${
                      copySuccess
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={downloadCode}
                    className="px-3 py-1.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors duration-200 flex items-center space-x-1"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 max-h-96 overflow-auto">
                <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all">
                  {embedCode}
                </pre>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="text-md font-medium text-gray-800 dark:text-white mb-3">Preview:</h4>
                  <div className="flex justify-center">
                    <img
                      src={previewUrl}
                      alt="Full preview"
                      className="max-w-full max-h-64 object-contain rounded-lg shadow-md border border-gray-200 dark:border-gray-600"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feature highlights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Instant Processing</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Convert images to embeddable code instantly without any server uploads. Everything runs in your browser.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Multiple Formats</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Export as HTML, CSS, Markdown, or JSON. Perfect for any project or platform you're working with.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Advanced Options</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Generate responsive images, lazy-loading code, and optimized implementations for better performance.
            </p>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Why Use Our Image Embedding Creator?
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Our Image Embedding Creator is the ultimate tool for web developers, content creators, and designers who need to quickly convert images into embeddable code formats. Whether you're building a website, creating documentation, or sharing images in a blog post, this tool provides everything you need without requiring external image hosting services.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              <strong>Key Features:</strong> Base64 encoding for inline images, responsive image generation with modern HTML5 picture elements, lazy loading implementation for better page performance, multiple export formats including HTML, CSS, Markdown, and JSON, drag-and-drop file upload with instant preview, completely client-side processing for privacy and speed, and mobile-responsive design that works on all devices.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Perfect for developers who want to embed images directly in their code, bloggers who need reliable image hosting alternatives, email marketers creating HTML newsletters, and anyone who wants to ensure their images are always available without depending on external services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}