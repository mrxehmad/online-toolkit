import React, { useState, useEffect, useMemo } from 'react';
import { 
  Copy, 
  Download, 
  FileText, 
  GitCompare, 
  Code, 
  Smartphone,
  Monitor,
  Tablet,
  Check,
  X,
  Plus,
  Minus,
  RotateCcw,
  Share2,
  Eye,
  EyeOff
} from 'lucide-react';

const CodeDiffTool = () => {
  const [leftCode, setLeftCode] = useState('');
  const [rightCode, setRightCode] = useState('');
  const [leftTitle, setLeftTitle] = useState('Original Code');
  const [rightTitle, setRightTitle] = useState('Modified Code');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [copySuccess, setCopySuccess] = useState('');
  const [viewMode, setViewMode] = useState('split'); // split, unified

  // Sample data for demo
  const loadSample = () => {
    setLeftCode(`function calculateSum(a, b) {
  return a + b;
}

const numbers = [1, 2, 3, 4, 5];
let sum = 0;

for (let i = 0; i < numbers.length; i++) {
  sum += numbers[i];
}

console.log("Total sum:", sum);`);

    setRightCode(`function calculateSum(a, b) {
  // Added input validation
  if (typeof a !== 'number' || typeof b !== 'number') {
    throw new Error('Both parameters must be numbers');
  }
  return a + b;
}

const numbers = [1, 2, 3, 4, 5, 6]; // Added new number
let sum = 0;

// Using modern array methods instead of for loop
numbers.forEach(num => {
  sum += num;
});

console.log("Total sum:", sum);
console.log("Average:", sum / numbers.length); // Added average calculation`);
  };

  // Diff calculation
  const diffLines = useMemo(() => {
    const leftLines = leftCode.split('\n');
    const rightLines = rightCode.split('\n');
    const maxLines = Math.max(leftLines.length, rightLines.length);
    const diffs = [];

    for (let i = 0; i < maxLines; i++) {
      const leftLine = leftLines[i] || '';
      const rightLine = rightLines[i] || '';
      
      if (leftLine === rightLine) {
        diffs.push({
          type: 'unchanged',
          leftLine,
          rightLine,
          leftNum: i + 1,
          rightNum: i + 1
        });
      } else if (leftLine && !rightLine) {
        diffs.push({
          type: 'removed',
          leftLine,
          rightLine: '',
          leftNum: i + 1,
          rightNum: null
        });
      } else if (!leftLine && rightLine) {
        diffs.push({
          type: 'added',
          leftLine: '',
          rightLine,
          leftNum: null,
          rightNum: i + 1
        });
      } else {
        diffs.push({
          type: 'modified',
          leftLine,
          rightLine,
          leftNum: i + 1,
          rightNum: i + 1
        });
      }
    }

    return diffs;
  }, [leftCode, rightCode]);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${type} copied!`);
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('Copy failed');
      setTimeout(() => setCopySuccess(''), 2000);
    }
  };

  const downloadDiff = () => {
    const diffText = diffLines.map(line => {
      if (line.type === 'added') return `+ ${line.rightLine}`;
      if (line.type === 'removed') return `- ${line.leftLine}`;
      if (line.type === 'modified') return `- ${line.leftLine}\n+ ${line.rightLine}`;
      return `  ${line.leftLine}`;
    }).join('\n');

    const blob = new Blob([diffText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code-diff.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setLeftCode('');
    setRightCode('');
    setLeftTitle('Original Code');
    setRightTitle('Modified Code');
  };

  const stats = useMemo(() => {
    const added = diffLines.filter(line => line.type === 'added').length;
    const removed = diffLines.filter(line => line.type === 'removed').length;
    const modified = diffLines.filter(line => line.type === 'modified').length;
    return { added, removed, modified };
  }, [diffLines]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Description Component */}
      <div className="hidden">
        <h1>Free Online Code Diff Tool - Compare Code Side by Side</h1>
        <p>Professional code diff tool with iOS design. Compare code files, view differences, and analyze changes instantly. Works on mobile, tablet, and desktop. No signup required.</p>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 p-2 rounded-xl shadow-lg">
                <GitCompare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Code Diff Tool</h1>
                <p className="text-sm text-gray-500">Compare & analyze code differences</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {copySuccess && (
                <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {copySuccess}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Description Section */}
        <section className="mb-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Professional Code Diff & Comparison Tool
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Compare code files side-by-side with our advanced diff tool. Perfect for developers, code reviewers, and teams. 
              Highlight additions, deletions, and modifications instantly. Works on all devices - desktop, tablet, and mobile.
            </p>
          </div>
          
          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-xl">
              <Monitor className="w-8 h-8 text-blue-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Desktop Optimized</h3>
                <p className="text-sm text-gray-600">Full-featured experience</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-green-50 p-4 rounded-xl">
              <Tablet className="w-8 h-8 text-green-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Tablet Friendly</h3>
                <p className="text-sm text-gray-600">Touch-optimized interface</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 bg-purple-50 p-4 rounded-xl">
              <Smartphone className="w-8 h-8 text-purple-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Mobile Ready</h3>
                <p className="text-sm text-gray-600">Works on smartphones</p>
              </div>
            </div>
          </div> */}
        </section>

        {/* Controls */}
        <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-200">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={loadSample}
                className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Load Sample</span>
              </button>
              
              <button
                onClick={clearAll}
                className="flex items-center space-x-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-colors ${
                  showLineNumbers 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {showLineNumbers ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="hidden sm:inline">Line Numbers</span>
              </button>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'split' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Split
                </button>
                <button
                  onClick={() => setViewMode('unified')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'unified' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Unified
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        {(stats.added > 0 || stats.removed > 0 || stats.modified > 0) && (
          <div className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-200">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-900">{stats.added} additions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Minus className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-gray-900">{stats.removed} deletions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-900">{stats.modified} modifications</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={downloadDiff}
                  className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download</span>
                </button>
                
                <button
                  onClick={() => copyToClipboard(
                    diffLines.map(line => {
                      if (line.type === 'added') return `+ ${line.rightLine}`;
                      if (line.type === 'removed') return `- ${line.leftLine}`;
                      if (line.type === 'modified') return `- ${line.leftLine}\n+ ${line.rightLine}`;
                      return `  ${line.leftLine}`;
                    }).join('\n'),
                    'Diff'
                  )}
                  className="flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg font-medium transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy Diff</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <input
                type="text"
                value={leftTitle}
                onChange={(e) => setLeftTitle(e.target.value)}
                className="w-full bg-transparent font-medium text-gray-900 placeholder-gray-500 focus:outline-none"
                placeholder="Enter title for original code..."
              />
            </div>
            <div className="relative">
              <textarea
                value={leftCode}
                onChange={(e) => setLeftCode(e.target.value)}
                placeholder="Paste your original code here..."
                className="w-full h-64 sm:h-80 p-4 font-mono text-sm text-gray-900 placeholder-gray-400 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                spellCheck="false"
              />
              <button
                onClick={() => copyToClipboard(leftCode, 'Original code')}
                className="absolute top-2 right-2 p-2 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 transition-colors"
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <input
                type="text"
                value={rightTitle}
                onChange={(e) => setRightTitle(e.target.value)}
                className="w-full bg-transparent font-medium text-gray-900 placeholder-gray-500 focus:outline-none"
                placeholder="Enter title for modified code..."
              />
            </div>
            <div className="relative">
              <textarea
                value={rightCode}
                onChange={(e) => setRightCode(e.target.value)}
                placeholder="Paste your modified code here..."
                className="w-full h-64 sm:h-80 p-4 font-mono text-sm text-gray-900 placeholder-gray-400 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                spellCheck="false"
              />
              <button
                onClick={() => copyToClipboard(rightCode, 'Modified code')}
                className="absolute top-2 right-2 p-2 bg-white hover:bg-gray-50 rounded-lg shadow-sm border border-gray-200 transition-colors"
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Diff Display */}
        {(leftCode || rightCode) && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="font-medium text-gray-900">Code Comparison Results</h3>
            </div>
            
            {viewMode === 'split' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="border-r border-gray-200">
                  <div className="bg-red-50 px-4 py-2 text-sm font-medium text-red-800 border-b border-gray-200">
                    {leftTitle}
                  </div>
                  <div className="overflow-x-auto">
                    <pre className="text-sm font-mono">
                      {diffLines.map((line, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            line.type === 'removed' ? 'bg-red-50' :
                            line.type === 'modified' ? 'bg-red-50' : ''
                          }`}
                        >
                          {showLineNumbers && (
                            <div className="w-12 px-2 py-1 bg-gray-100 text-gray-500 text-right border-r border-gray-200 select-none">
                              {line.leftNum || ''}
                            </div>
                          )}
                          <div className="flex-1 px-4 py-1 whitespace-pre-wrap break-all">
                            {line.type === 'removed' && <span className="text-red-600">- </span>}
                            {line.type === 'modified' && <span className="text-red-600">- </span>}
                            {line.leftLine}
                          </div>
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
                
                <div>
                  <div className="bg-green-50 px-4 py-2 text-sm font-medium text-green-800 border-b border-gray-200">
                    {rightTitle}
                  </div>
                  <div className="overflow-x-auto">
                    <pre className="text-sm font-mono">
                      {diffLines.map((line, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            line.type === 'added' ? 'bg-green-50' :
                            line.type === 'modified' ? 'bg-green-50' : ''
                          }`}
                        >
                          {showLineNumbers && (
                            <div className="w-12 px-2 py-1 bg-gray-100 text-gray-500 text-right border-r border-gray-200 select-none">
                              {line.rightNum || ''}
                            </div>
                          )}
                          <div className="flex-1 px-4 py-1 whitespace-pre-wrap break-all">
                            {line.type === 'added' && <span className="text-green-600">+ </span>}
                            {line.type === 'modified' && <span className="text-green-600">+ </span>}
                            {line.rightLine}
                          </div>
                        </div>
                      ))}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <pre className="text-sm font-mono">
                  {diffLines.map((line, index) => (
                    <div key={index}>
                      {line.type === 'removed' && (
                        <div className="flex bg-red-50">
                          {showLineNumbers && (
                            <div className="w-12 px-2 py-1 bg-gray-100 text-gray-500 text-right border-r border-gray-200 select-none">
                              {line.leftNum}
                            </div>
                          )}
                          <div className="flex-1 px-4 py-1 whitespace-pre-wrap break-all">
                            <span className="text-red-600">- {line.leftLine}</span>
                          </div>
                        </div>
                      )}
                      {line.type === 'added' && (
                        <div className="flex bg-green-50">
                          {showLineNumbers && (
                            <div className="w-12 px-2 py-1 bg-gray-100 text-gray-500 text-right border-r border-gray-200 select-none">
                              {line.rightNum}
                            </div>
                          )}
                          <div className="flex-1 px-4 py-1 whitespace-pre-wrap break-all">
                            <span className="text-green-600">+ {line.rightLine}</span>
                          </div>
                        </div>
                      )}
                      {line.type === 'modified' && (
                        <>
                          <div className="flex bg-red-50">
                            {showLineNumbers && (
                              <div className="w-12 px-2 py-1 bg-gray-100 text-gray-500 text-right border-r border-gray-200 select-none">
                                {line.leftNum}
                              </div>
                            )}
                            <div className="flex-1 px-4 py-1 whitespace-pre-wrap break-all">
                              <span className="text-red-600">- {line.leftLine}</span>
                            </div>
                          </div>
                          <div className="flex bg-green-50">
                            {showLineNumbers && (
                              <div className="w-12 px-2 py-1 bg-gray-100 text-gray-500 text-right border-r border-gray-200 select-none">
                                {line.rightNum}
                              </div>
                            )}
                            <div className="flex-1 px-4 py-1 whitespace-pre-wrap break-all">
                              <span className="text-green-600">+ {line.rightLine}</span>
                            </div>
                          </div>
                        </>
                      )}
                      {line.type === 'unchanged' && (
                        <div className="flex">
                          {showLineNumbers && (
                            <div className="w-12 px-2 py-1 bg-gray-100 text-gray-500 text-right border-r border-gray-200 select-none">
                              {line.leftNum}
                            </div>
                          )}
                          <div className="flex-1 px-4 py-1 whitespace-pre-wrap break-all text-gray-700">
                            {line.leftLine}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        <section className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Choose Our Code Diff Tool?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <GitCompare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Side-by-Side Comparison</h3>
              <p className="text-gray-600 text-sm">Compare code files with clear visual highlighting of additions, deletions, and modifications.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Mobile Responsive</h3>
              <p className="text-gray-600 text-sm">Works perfectly on all devices - smartphones, tablets, and desktop computers.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">No Installation Required</h3>
              <p className="text-gray-600 text-sm">Browser-based tool with no downloads or installations needed. Start comparing code instantly.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Export & Share</h3>
              <p className="text-gray-600 text-sm">Download diff results or copy to clipboard for easy sharing with team members.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Privacy Focused</h3>
              <p className="text-gray-600 text-sm">All processing happens in your browser. Your code never leaves your device.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-indigo-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Multiple View Modes</h3>
              <p className="text-gray-600 text-sm">Choose between split view and unified diff view based on your preferences.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Free online code diff tool for developers. Compare, analyze, and understand code changes efficiently.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span>✓ No Registration Required</span>
              <span>✓ Completely Free</span>
              <span>✓ Works Offline</span>
              <span>✓ Mobile Friendly</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CodeDiffTool;