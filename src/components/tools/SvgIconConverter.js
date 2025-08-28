import React, { useState, useRef } from 'react';
import { Upload, Download, Settings, Eye, Code, Palette, RotateCw, Square, Circle } from 'lucide-react';

// Mock useTheme hook - replace with your actual implementation
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  return { theme, setTheme };
};

export default function SvgIconConverter() {
  const { theme } = useTheme();
  const [svgContent, setSvgContent] = useState('');
  const [convertedCode, setConvertedCode] = useState('');
  const [outputFormat, setOutputFormat] = useState('react');
  const [iconName, setIconName] = useState('MyIcon');
  const [size, setSize] = useState('24');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState('2');
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  // SEO metadata
  React.useEffect(() => {
    document.title = 'SVG Icon Converter - Convert SVG to React Components, CSS, and More';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = 'Free online SVG icon converter tool. Transform SVG files into React components, CSS data URIs, optimized code, and multiple formats. Perfect for developers and designers.';
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Free online SVG icon converter tool. Transform SVG files into React components, CSS data URIs, optimized code, and multiple formats. Perfect for developers and designers.';
      document.head.appendChild(meta);
    }

    // Update canonical URL
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

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setSvgContent(content);
        convertSvg(content);
      };
      reader.readAsText(file);
    }
  };

  const handleTextInput = (content) => {
    setSvgContent(content);
    convertSvg(content);
  };

  const convertSvg = (content) => {
    if (!content) return;

    let converted = '';
    
    switch (outputFormat) {
      case 'react':
        converted = convertToReact(content);
        break;
      case 'css':
        converted = convertToCSS(content);
        break;
      case 'datauri':
        converted = convertToDataURI(content);
        break;
      case 'optimized':
        converted = optimizeSvg(content);
        break;
      default:
        converted = content;
    }
    
    setConvertedCode(converted);
  };

  const convertToReact = (svg) => {
    let reactSvg = svg
      .replace(/stroke-width/g, 'strokeWidth')
      .replace(/fill-rule/g, 'fillRule')
      .replace(/clip-rule/g, 'clipRule')
      .replace(/stroke-linecap/g, 'strokeLinecap')
      .replace(/stroke-linejoin/g, 'strokeLinejoin')
      .replace(/class=/g, 'className=')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/^\s*<\?xml.*?\?>\s*/g, '')
      .replace(/^\s*<!DOCTYPE.*?>\s*/g, '');

    // Add props for customization
    reactSvg = reactSvg.replace(
      /<svg([^>]*)>/,
      `<svg$1 width={size} height={size} fill={color} stroke="currentColor" strokeWidth={strokeWidth}>`
    );

    return `import React from 'react';

const ${iconName} = ({ size = ${size}, color = "${color}", strokeWidth = ${strokeWidth}, ...props }) => (
  ${reactSvg}
);

export default ${iconName};`;
  };

  const convertToCSS = (svg) => {
    const encoded = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22');
    return `.${iconName.toLowerCase()}-icon {
  background-image: url("data:image/svg+xml,${encoded}");
  background-repeat: no-repeat;
  background-size: contain;
  width: ${size}px;
  height: ${size}px;
  display: inline-block;
}`;
  };

  const convertToDataURI = (svg) => {
    const encoded = encodeURIComponent(svg).replace(/'/g, '%27').replace(/"/g, '%22');
    return `data:image/svg+xml,${encoded}`;
  };

  const optimizeSvg = (svg) => {
    return svg
      .replace(/\s+/g, ' ')
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/>\s+</g, '><')
      .trim();
  };

  const downloadFile = () => {
    if (!convertedCode) return;
    
    const extension = outputFormat === 'react' ? 'jsx' : outputFormat === 'css' ? 'css' : 'txt';
    const filename = `${iconName.toLowerCase()}.${extension}`;
    
    const blob = new Blob([convertedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedCode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            SVG Icon Converter
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transform your SVG icons into production-ready code. Convert SVG files to React components, 
            CSS data URIs, optimized SVG code, and more. Perfect for developers and designers who need 
            flexible, scalable icon solutions for web projects. Features real-time preview, 
            customizable properties, and instant download capabilities.
          </p>
        </div>

        {/* Main Tool Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Upload className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Input SVG
                </h2>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 transition-colors text-center"
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Click to upload SVG file
                  </p>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".svg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Or paste SVG code:
                </label>
                <textarea
                  value={svgContent}
                  onChange={(e) => handleTextInput(e.target.value)}
                  placeholder="<svg>...</svg>"
                  className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-gray-500" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Settings
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Icon Name
                    </label>
                    <input
                      type="text"
                      value={iconName}
                      onChange={(e) => setIconName(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Output Format
                    </label>
                    <select
                      value={outputFormat}
                      onChange={(e) => {
                        setOutputFormat(e.target.value);
                        if (svgContent) convertSvg(svgContent);
                      }}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                      <option value="react">React Component</option>
                      <option value="css">CSS Background</option>
                      <option value="datauri">Data URI</option>
                      <option value="optimized">Optimized SVG</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Size
                    </label>
                    <input
                      type="number"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color
                    </label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stroke Width
                    </label>
                    <input
                      type="number"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-green-500" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Generated Code
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                    title="Toggle Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Preview */}
              {showPreview && svgContent && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Preview
                    </span>
                  </div>
                  <div className="flex justify-center p-4 bg-white dark:bg-gray-800 rounded border">
                    <div
                      dangerouslySetInnerHTML={{ __html: svgContent }}
                      style={{ width: size + 'px', height: size + 'px' }}
                    />
                  </div>
                </div>
              )}

              {/* Code Output */}
              <div className="relative">
                <textarea
                  value={convertedCode}
                  readOnly
                  placeholder="Generated code will appear here..."
                  className="w-full h-80 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm resize-none"
                />
                
                {convertedCode && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                      title="Copy to Clipboard"
                    >
                      <Square className="w-4 h-4" />
                    </button>
                    <button
                      onClick={downloadFile}
                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <RotateCw className="w-8 h-8 text-blue-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Multiple Formats
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Convert to React components, CSS data URIs, optimized SVG, and more formats.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <Eye className="w-8 h-8 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Preview
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              See your icons instantly with customizable size, color, and stroke properties.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <Download className="w-8 h-8 text-purple-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Instant Download
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Download your converted icons as files or copy to clipboard with one click.
            </p>
          </div>
        </div>

        {/* SEO Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Professional SVG Icon Conversion Tool
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our SVG Icon Converter is the ultimate tool for developers and designers who need to transform 
              SVG icons into various code formats. Whether you're building React applications, styling with CSS, 
              or optimizing SVG files for production, this tool handles all your conversion needs with precision and ease.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Key Features:
            </h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-1 mb-4">
              <li>• Convert SVG to React components with customizable props</li>
              <li>• Generate CSS data URI backgrounds for any SVG icon</li>
              <li>• Optimize and minify SVG code for better performance</li>
              <li>• Real-time preview with adjustable size, color, and stroke width</li>
              <li>• Instant file download or clipboard copying</li>
              <li>• Dark and light mode support</li>
              <li>• Fully responsive design for all devices</li>
            </ul>
            
            <p className="text-gray-600 dark:text-gray-300">
              Perfect for web developers, UI/UX designers, and anyone working with scalable vector graphics. 
              Save time and streamline your workflow with our intuitive, client-side processing that keeps 
              your SVG files secure and private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}