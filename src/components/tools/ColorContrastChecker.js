import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Palette, CheckCircle, XCircle, AlertTriangle, Copy, RefreshCw } from 'lucide-react';

export default function ColorContrastChecker() {
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [contrastRatio, setContrastRatio] = useState(21);
  const [wcagResults, setWcagResults] = useState({});
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState('');

  // Calculate relative luminance
  const getLuminance = (hex) => {
    const rgb = hexToRgb(hex);
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  };

  // Calculate contrast ratio
  const calculateContrastRatio = (color1, color2) => {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  // Check WCAG compliance
  const checkWCAGCompliance = (ratio) => {
    return {
      aa_normal: ratio >= 4.5,
      aa_large: ratio >= 3,
      aaa_normal: ratio >= 7,
      aaa_large: ratio >= 4.5
    };
  };

  // Update contrast calculations
  useEffect(() => {
    const ratio = calculateContrastRatio(foregroundColor, backgroundColor);
    setContrastRatio(ratio);
    setWcagResults(checkWCAGCompliance(ratio));
  }, [foregroundColor, backgroundColor]);

  // Generate random colors
  const generateRandomColors = () => {
    const randomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setForegroundColor(randomHex());
    setBackgroundColor(randomHex());
  };

  // Swap colors
  const swapColors = () => {
    const temp = foregroundColor;
    setForegroundColor(backgroundColor);
    setBackgroundColor(temp);
  };

  // Copy to clipboard
  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(''), 2000);
  };

  // Get compliance level text
  const getComplianceText = (results) => {
    if (results.aaa_normal) return 'AAA (All text)';
    if (results.aaa_large) return 'AAA (Large text only)';
    if (results.aa_normal) return 'AA (All text)';
    if (results.aa_large) return 'AA (Large text only)';
    return 'Fails WCAG';
  };

  // Get compliance color
  const getComplianceColor = (results) => {
    if (results.aaa_normal) return 'text-green-600 dark:text-green-400';
    if (results.aaa_large || results.aa_normal) return 'text-blue-600 dark:text-blue-400';
    if (results.aa_large) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const ComplianceIndicator = ({ label, passes, description }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div>
        <div className="font-medium text-gray-900 dark:text-white">{label}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{description}</div>
      </div>
      {passes ? (
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
      ) : (
        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      {/* SEO Metadata */}
      <div style={{ display: 'none' }}>
        <title>Color Contrast Checker - WCAG Accessibility Compliance Tool</title>
        <meta name="description" content="Free WCAG color contrast checker tool. Test text and background color combinations for accessibility compliance. Supports AA and AAA standards with real-time preview." />
        <link rel="canonical" href="/tools/color-contrast-checker" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Palette className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            Color Contrast Checker
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Ensure your website meets WCAG accessibility standards with our comprehensive color contrast analyzer
          </p>
        </div>

        {/* Main Tool Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          {/* Color Inputs */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Foreground Color */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Foreground Color (Text)
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                    placeholder="#000000"
                  />
                </div>
                <button
                  onClick={() => copyToClipboard(foregroundColor, 'fg')}
                  className="h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  title="Copy color"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied === 'fg' && (
                <div className="text-sm text-green-600 dark:text-green-400">Copied!</div>
              )}
            </div>

            {/* Background Color */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Background Color
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                    placeholder="#ffffff"
                  />
                </div>
                <button
                  onClick={() => copyToClipboard(backgroundColor, 'bg')}
                  className="h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                  title="Copy color"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied === 'bg' && (
                <div className="text-sm text-green-600 dark:text-green-400">Copied!</div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={swapColors}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Swap Colors
            </button>
            <button
              onClick={generateRandomColors}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Palette className="w-4 h-4" />
              Random Colors
            </button>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>

          {/* Results Section */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contrast Ratio & Compliance */}
            <div className="space-y-6">
              {/* Contrast Ratio */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 text-center">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Contrast Ratio
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {contrastRatio.toFixed(2)}:1
                </div>
                <div className={`text-lg font-medium ${getComplianceColor(wcagResults)}`}>
                  {getComplianceText(wcagResults)}
                </div>
              </div>

              {/* WCAG Compliance Details */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  WCAG Compliance
                </h3>
                
                <ComplianceIndicator
                  label="AA Normal Text"
                  passes={wcagResults.aa_normal}
                  description="4.5:1 minimum for regular text"
                />
                
                <ComplianceIndicator
                  label="AA Large Text"
                  passes={wcagResults.aa_large}
                  description="3:1 minimum for large text (18pt+)"
                />
                
                <ComplianceIndicator
                  label="AAA Normal Text"
                  passes={wcagResults.aaa_normal}
                  description="7:1 enhanced for regular text"
                />
                
                <ComplianceIndicator
                  label="AAA Large Text"
                  passes={wcagResults.aaa_large}
                  description="4.5:1 enhanced for large text"
                />
              </div>
            </div>

            {/* Preview Section */}
            {showPreview && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Live Preview
                </h3>
                
                <div 
                  className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700"
                  style={{ backgroundColor, color: foregroundColor }}
                >
                  <h4 className="text-2xl font-bold mb-3">Sample Heading</h4>
                  <p className="text-base mb-3">
                    This is regular body text to test readability. Lorem ipsum dolor sit amet, 
                    consectetur adipiscing elit.
                  </p>
                  <p className="text-lg font-semibold mb-3">This is large text sample</p>
                  <p className="text-sm">This is small text for testing purposes.</p>
                </div>

                {/* Recommendations */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Accessibility Tip
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {wcagResults.aa_normal 
                          ? "Great! This color combination meets accessibility standards for all text sizes."
                          : wcagResults.aa_large 
                            ? "This combination works for large text only. Consider darker/lighter colors for better contrast."
                            : "This combination fails accessibility standards. Please choose colors with higher contrast."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            About Color Contrast Accessibility
          </h2>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Color contrast is crucial for web accessibility, ensuring that users with visual impairments, 
              including those with color blindness or low vision, can easily read and interact with your content. 
              Our WCAG Color Contrast Checker helps you meet the Web Content Accessibility Guidelines (WCAG) 2.1 
              standards for color contrast ratios.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              Understanding WCAG Standards
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li><strong>AA Level (Minimum):</strong> 4.5:1 for normal text, 3:1 for large text</li>
              <li><strong>AAA Level (Enhanced):</strong> 7:1 for normal text, 4.5:1 for large text</li>
              <li><strong>Large Text:</strong> Text that is 18pt (24px) or larger, or 14pt (18.66px) bold</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              Key Features
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400">
              <li>Real-time contrast ratio calculation</li>
              <li>WCAG AA and AAA compliance checking</li>
              <li>Live preview with sample text</li>
              <li>Color picker and hex input support</li>
              <li>Quick color swapping and random generation</li>
              <li>Mobile-responsive design</li>
              <li>Dark mode support</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              Best Practices
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Always aim for AA compliance at minimum, with AAA being preferred for critical content. 
              Test your color combinations early in the design process, consider users with different 
              visual abilities, and remember that good contrast benefits everyone, not just users with disabilities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}