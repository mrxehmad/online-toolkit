import React, { useState, useEffect } from 'react';
import { Type, Copy, Download, RefreshCw, Palette, Settings } from 'lucide-react';

export default function AsciiArtGenerator() {
  const [inputText, setInputText] = useState('HELLO');
  const [asciiArt, setAsciiArt] = useState('');
  const [fontSize, setFontSize] = useState('medium');
  const [artStyle, setArtStyle] = useState('block');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // ASCII character sets for different styles
  const charSets = {
    block: {
      A: ["  █████  ", " ██   ██ ", " ███████ ", " ██   ██ ", " ██   ██ "],
      B: ["██████  ", "██   ██ ", "██████  ", "██   ██ ", "██████  "],
      C: [" ██████ ", "██      ", "██      ", "██      ", " ██████ "],
      D: ["██████  ", "██   ██ ", "██   ██ ", "██   ██ ", "██████  "],
      E: ["███████ ", "██      ", "█████   ", "██      ", "███████ "],
      F: ["███████ ", "██      ", "█████   ", "██      ", "██      "],
      G: [" ██████ ", "██      ", "██   ██ ", "██   ██ ", " ██████ "],
      H: ["██   ██ ", "██   ██ ", "███████ ", "██   ██ ", "██   ██ "],
      I: ["███████ ", "   ██   ", "   ██   ", "   ██   ", "███████ "],
      J: ["███████ ", "     ██ ", "     ██ ", "██   ██ ", " ██████ "],
      K: ["██   ██ ", "██  ██  ", "█████   ", "██  ██  ", "██   ██ "],
      L: ["██      ", "██      ", "██      ", "██      ", "███████ "],
      M: ["███    ███ ", "████  ████ ", "██ ████ ██ ", "██  ██  ██ ", "██      ██ "],
      N: ["███    ██ ", "████   ██ ", "██ ██  ██ ", "██  ██ ██ ", "██   ████ "],
      O: [" ██████ ", "██    ██", "██    ██", "██    ██", " ██████ "],
      P: ["██████  ", "██   ██ ", "██████  ", "██      ", "██      "],
      Q: [" ██████ ", "██    ██", "██ ██ ██", "██  ████", " ███████"],
      R: ["██████  ", "██   ██ ", "██████  ", "██   ██ ", "██   ██ "],
      S: [" ██████ ", "██      ", " ██████ ", "      ██", " ██████ "],
      T: ["███████ ", "   ██   ", "   ██   ", "   ██   ", "   ██   "],
      U: ["██   ██ ", "██   ██ ", "██   ██ ", "██   ██ ", " ██████ "],
      V: ["██   ██ ", "██   ██ ", "██   ██ ", " ██ ██  ", "  ███   "],
      W: ["██      ██ ", "██  ██  ██ ", "██ ████ ██ ", "████  ████ ", "███    ███ "],
      X: ["██   ██ ", " ██ ██  ", "  ███   ", " ██ ██  ", "██   ██ "],
      Y: ["██   ██ ", " ██ ██  ", "  ███   ", "   ██   ", "   ██   "],
      Z: ["███████ ", "    ██  ", "   ██   ", "  ██    ", "███████ "],
      ' ': ["        ", "        ", "        ", "        ", "        "]
    },
    thin: {
      A: [" ▄▀█ ", "█▀█ ", "▀ █▄", "  █ ", "  ▀ "],
      B: ["█▀▄ ", "█▀▄ ", "█▄▀ ", "█▄▀ ", "▀▀▀ "],
      C: [" ▄▀█ ", "█▄▄ ", "█▄▄ ", "█▄▄ ", " ▀▀ "],
      D: ["█▀▄ ", "█ █ ", "█ █ ", "█▄▀ ", "▀▀▀ "],
      E: ["█▀▀ ", "█▀▀ ", "█▄▄ ", "█▄▄ ", "▀▀▀ "],
      F: ["█▀▀ ", "█▀▀ ", "█   ", "█   ", "▀   "],
      G: [" ▄▀█ ", "█▄▄ ", "█▄█ ", " ▀█ ", " ▀▀ "],
      H: ["█ █ ", "█▀█ ", "█ █ ", "█ █ ", "▀ ▀ "],
      I: ["█▀▀ ", " █  ", " █  ", "▄█▄ ", "▀▀▀ "],
      J: ["▀▀█ ", "  █ ", "█ █ ", " █  ", " ▀  "],
      K: ["█ █ ", "██  ", "██  ", "█ █ ", "▀ ▀ "],
      L: ["█   ", "█   ", "█   ", "█▄▄ ", "▀▀▀ "],
      M: ["█▄█ ", "███ ", "█▀█ ", "█ █ ", "▀ ▀ "],
      N: ["█▄█ ", "███ ", "█▀█ ", "█ █ ", "▀ ▀ "],
      O: [" █  ", "█ █ ", "█ █ ", " █  ", " ▀  "],
      P: ["█▀▄ ", "█▀  ", "█   ", "█   ", "▀   "],
      Q: [" █  ", "█ █ ", "███ ", " ██ ", " ▀▀ "],
      R: ["█▀▄ ", "█▀▄ ", "█ █ ", "█ █ ", "▀ ▀ "],
      S: [" ▄▀ ", "▀▀▄ ", "▄▄▀ ", "▀▀▀ ", "▀▀▀ "],
      T: ["▀█▀ ", " █  ", " █  ", " █  ", " ▀  "],
      U: ["█ █ ", "█ █ ", "█ █ ", " █  ", " ▀  "],
      V: ["█ █ ", "█ █ ", "█ █ ", " █  ", " ▀  "],
      W: ["█ █ ", "█ █ ", "███ ", "█▄█ ", "▀ ▀ "],
      X: ["█ █ ", " █  ", " █  ", "█ █ ", "▀ ▀ "],
      Y: ["█ █ ", " █  ", " █  ", " █  ", " ▀  "],
      Z: ["▀▀▀ ", " ▄▀ ", "▀▄  ", "▀▀▀ ", "▀▀▀ "],
      ' ': ["    ", "    ", "    ", "    ", "    "]
    }
  };

  const generateAsciiArt = () => {
    setIsGenerating(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const text = inputText.toUpperCase();
      const selectedCharSet = charSets[artStyle];
      const lines = ['', '', '', '', ''];
      
      for (let char of text) {
        if (selectedCharSet[char]) {
          for (let i = 0; i < 5; i++) {
            lines[i] += selectedCharSet[char][i] + '  ';
          }
        }
      }
      
      setAsciiArt(lines.join('\n'));
      setIsGenerating(false);
    }, 500);
  };

  useEffect(() => {
    generateAsciiArt();
  }, [inputText, artStyle]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(asciiArt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadAsciiArt = () => {
    const element = document.createElement('a');
    const file = new Blob([asciiArt], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `ascii-art-${inputText.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const clearAll = () => {
    setInputText('');
    setAsciiArt('');
  };

  return (
    <>
      {/* SEO Metadata */}
      <div style={{ display: 'none' }}>
        <title>ASCII Art Generator - Convert Text to ASCII Art Online Free</title>
        <meta 
          name="description" 
          content="Create stunning ASCII art from text instantly. Free online ASCII art generator with multiple font styles and formats. Convert any text to beautiful ASCII characters for social media, websites, and creative projects."
        />
        <link rel="canonical" href="/tools/ascii-art-generator" />
        <meta name="keywords" content="ASCII art generator, text to ASCII, ASCII converter, ASCII text art, online ASCII generator, free ASCII art tool" />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center mb-4">
              <div className="bg-blue-500 dark:bg-blue-600 p-3 rounded-2xl shadow-lg">
                <Type className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              ASCII Art Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform your text into stunning ASCII art instantly. Create eye-catching text art for social media, 
              websites, email signatures, and creative projects with our powerful online generator.
            </p>
          </div>

          {/* Main Tool Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8">
            
            {/* Input Section */}
            <div className="mb-8">
              <label htmlFor="textInput" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter your text
              </label>
              <div className="relative">
                <input
                  id="textInput"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your text here..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                           bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           placeholder-gray-500 dark:placeholder-gray-400 text-lg"
                  maxLength={50}
                />
                <span className="absolute right-3 top-3 text-sm text-gray-400 dark:text-gray-500">
                  {inputText.length}/50
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <select
                  value={artStyle}
                  onChange={(e) => setArtStyle(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="block">Block Style</option>
                  <option value="thin">Thin Style</option>
                </select>
              </div>
              
              <button
                onClick={generateAsciiArt}
                disabled={isGenerating || !inputText.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         text-white rounded-lg transition-colors duration-200"
              >
                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? 'Generating...' : 'Regenerate'}
              </button>

              <button
                onClick={clearAll}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 
                         text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                         rounded-lg transition-colors duration-200"
              >
                Clear All
              </button>
            </div>

            {/* Output Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Generated ASCII Art
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    disabled={!asciiArt}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700
                             hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50
                             text-gray-700 dark:text-gray-300 rounded-md transition-colors duration-200"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadAsciiArt}
                    disabled={!asciiArt}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700
                             hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50
                             text-gray-700 dark:text-gray-300 rounded-md transition-colors duration-200"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <pre className="w-full h-64 p-4 border border-gray-300 dark:border-gray-600 rounded-xl
                               bg-gray-900 dark:bg-black text-green-400 dark:text-green-300
                               font-mono text-xs sm:text-sm overflow-auto
                               scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
                  {isGenerating ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
                    </div>
                  ) : (
                    asciiArt || "Your ASCII art will appear here..."
                  )}
                </pre>
              </div>
            </div>
          </div>

          {/* Long Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                About ASCII Art Generator
              </h2>
            </div>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Our ASCII Art Generator is a powerful, free online tool that instantly converts regular text into beautiful ASCII art. 
                ASCII art is a form of text-based visual art that uses printable characters from the ASCII character set to create images, 
                designs, and stylized text. This art form has been popular since the early days of computing and remains widely used today 
                for creative expression, social media posts, email signatures, and website design.
              </p>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                Whether you're a developer looking to create eye-catching console output, a social media enthusiast wanting to make your 
                posts stand out, or an artist exploring digital creativity, our ASCII art generator provides the perfect solution. The tool 
                supports multiple font styles including bold block letters and elegant thin designs, ensuring your text art matches your 
                creative vision.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Features:</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-4">
                <li>• <strong>Instant Generation:</strong> Real-time ASCII art creation as you type</li>
                <li>• <strong>Multiple Styles:</strong> Choose from block and thin character sets</li>
                <li>• <strong>Easy Export:</strong> Copy to clipboard or download as text file</li>
                <li>• <strong>Mobile Friendly:</strong> Works perfectly on all devices and screen sizes</li>
                <li>• <strong>No Registration:</strong> Free to use without any account requirements</li>
                <li>• <strong>Privacy Focused:</strong> All processing happens in your browser</li>
              </ul>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                ASCII art has applications across many fields including programming documentation, terminal applications, email signatures, 
                forum posts, social media content, and artistic projects. Our generator makes it easy to create professional-looking text 
                art that can be used anywhere plain text is supported. The generated ASCII art is compatible with all text editors, 
                messaging platforms, and programming environments.
              </p>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Start creating your own ASCII art today! Simply enter your text above, choose your preferred style, and watch as your 
                words transform into stunning visual art. Perfect for developers, designers, social media users, and anyone looking to 
                add a creative touch to their text-based content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}