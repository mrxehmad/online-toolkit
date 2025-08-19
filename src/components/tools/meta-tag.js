import React, { useState, useCallback } from 'react';
import { 
  Search, 
  Globe, 
  Tag, 
  FileText, 
  Image, 
  Twitter, 
  Facebook, 
  Copy, 
  Check, 
  Smartphone,
  Monitor,
  Tablet,
  Code2,
  Lightbulb,
  RefreshCw
} from 'lucide-react';

const SEOMetaGenerator = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    keywords: '',
    author: '',
    url: '',
    siteName: '',
    image: '',
    twitterHandle: '',
    locale: 'en_US',
    type: 'website',
    robots: 'index, follow'
  });

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const generateMetaTags = () => {
    const tags = [];

    // Basic Meta Tags
    if (formData.title) {
      tags.push(`<title>${formData.title}</title>`);
      tags.push(`<meta name="title" content="${formData.title}">`);
    }
    
    if (formData.description) {
      tags.push(`<meta name="description" content="${formData.description}">`);
    }
    
    if (formData.keywords) {
      tags.push(`<meta name="keywords" content="${formData.keywords}">`);
    }
    
    if (formData.author) {
      tags.push(`<meta name="author" content="${formData.author}">`);
    }
    
    tags.push(`<meta name="robots" content="${formData.robots}">`);
    tags.push(`<meta charset="UTF-8">`);
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);

    // Open Graph Tags
    if (formData.title) {
      tags.push(`<meta property="og:title" content="${formData.title}">`);
    }
    
    if (formData.description) {
      tags.push(`<meta property="og:description" content="${formData.description}">`);
    }
    
    if (formData.url) {
      tags.push(`<meta property="og:url" content="${formData.url}">`);
    }
    
    if (formData.siteName) {
      tags.push(`<meta property="og:site_name" content="${formData.siteName}">`);
    }
    
    if (formData.image) {
      tags.push(`<meta property="og:image" content="${formData.image}">`);
    }
    
    tags.push(`<meta property="og:type" content="${formData.type}">`);
    tags.push(`<meta property="og:locale" content="${formData.locale}">`);

    // Twitter Card Tags
    tags.push(`<meta name="twitter:card" content="summary_large_image">`);
    
    if (formData.title) {
      tags.push(`<meta name="twitter:title" content="${formData.title}">`);
    }
    
    if (formData.description) {
      tags.push(`<meta name="twitter:description" content="${formData.description}">`);
    }
    
    if (formData.image) {
      tags.push(`<meta name="twitter:image" content="${formData.image}">`);
    }
    
    if (formData.twitterHandle) {
      tags.push(`<meta name="twitter:site" content="@${formData.twitterHandle.replace('@', '')}">`);
    }

    return tags.join('\n');
  };

  const copyToClipboard = async () => {
    const metaTags = generateMetaTags();
    try {
      await navigator.clipboard.writeText(metaTags);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      keywords: '',
      author: '',
      url: '',
      siteName: '',
      image: '',
      twitterHandle: '',
      locale: 'en_US',
      type: 'website',
      robots: 'index, follow'
    });
  };

  const InputField = ({ icon: Icon, label, value, onChange, placeholder, multiline = false, type = "text" }) => (
    <div className="mb-4">
      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
        <Icon className="w-4 h-4 mr-2 text-blue-500" />
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
          rows={3}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
      )}
    </div>
  );

  const SelectField = ({ icon: Icon, label, value, onChange, options }) => (
    <div className="mb-4">
      <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
        <Icon className="w-4 h-4 mr-2 text-blue-500" />
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'social', label: 'Social Media', icon: Globe },
    { id: 'advanced', label: 'Advanced', icon: Code2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-500 p-3 rounded-xl">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">SEO Meta Tag Generator</h1>
                  <p className="text-gray-600">Generate optimized meta tags for better search rankings</p>
                </div>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-gray-400">
                <Monitor className="w-5 h-5" />
                <Tablet className="w-5 h-5" />
                <Smartphone className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-6">
              {/* Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-xl p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center px-4 py-2 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Basic Info Tab */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <InputField
                    icon={FileText}
                    label="Page Title"
                    value={formData.title}
                    onChange={(value) => handleInputChange('title', value)}
                    placeholder="Your awesome page title (50-60 characters)"
                  />
                  <InputField
                    icon={Tag}
                    label="Meta Description"
                    value={formData.description}
                    onChange={(value) => handleInputChange('description', value)}
                    placeholder="Brief description of your page content (150-160 characters)"
                    multiline
                  />
                  <InputField
                    icon={Search}
                    label="Keywords"
                    value={formData.keywords}
                    onChange={(value) => handleInputChange('keywords', value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <InputField
                    icon={Globe}
                    label="Page URL"
                    value={formData.url}
                    onChange={(value) => handleInputChange('url', value)}
                    placeholder="https://yourwebsite.com/page"
                    type="url"
                  />
                </div>
              )}

              {/* Social Media Tab */}
              {activeTab === 'social' && (
                <div className="space-y-4">
                  <InputField
                    icon={Globe}
                    label="Site Name"
                    value={formData.siteName}
                    onChange={(value) => handleInputChange('siteName', value)}
                    placeholder="Your Website Name"
                  />
                  <InputField
                    icon={Image}
                    label="Featured Image URL"
                    value={formData.image}
                    onChange={(value) => handleInputChange('image', value)}
                    placeholder="https://yourwebsite.com/image.jpg"
                    type="url"
                  />
                  <InputField
                    icon={Twitter}
                    label="Twitter Handle"
                    value={formData.twitterHandle}
                    onChange={(value) => handleInputChange('twitterHandle', value)}
                    placeholder="yourtwitterhandle"
                  />
                  <InputField
                    icon={FileText}
                    label="Author"
                    value={formData.author}
                    onChange={(value) => handleInputChange('author', value)}
                    placeholder="Author Name"
                  />
                </div>
              )}

              {/* Advanced Tab */}
              {activeTab === 'advanced' && (
                <div className="space-y-4">
                  <SelectField
                    icon={Globe}
                    label="Content Type"
                    value={formData.type}
                    onChange={(value) => handleInputChange('type', value)}
                    options={[
                      { value: 'website', label: 'Website' },
                      { value: 'article', label: 'Article' },
                      { value: 'blog', label: 'Blog' },
                      { value: 'product', label: 'Product' }
                    ]}
                  />
                  <SelectField
                    icon={Globe}
                    label="Language/Locale"
                    value={formData.locale}
                    onChange={(value) => handleInputChange('locale', value)}
                    options={[
                      { value: 'en_US', label: 'English (US)' },
                      { value: 'en_GB', label: 'English (UK)' },
                      { value: 'es_ES', label: 'Spanish' },
                      { value: 'fr_FR', label: 'French' },
                      { value: 'de_DE', label: 'German' },
                      { value: 'it_IT', label: 'Italian' }
                    ]}
                  />
                  <SelectField
                    icon={Search}
                    label="Robots"
                    value={formData.robots}
                    onChange={(value) => handleInputChange('robots', value)}
                    options={[
                      { value: 'index, follow', label: 'Index, Follow' },
                      { value: 'noindex, follow', label: 'No Index, Follow' },
                      { value: 'index, nofollow', label: 'Index, No Follow' },
                      { value: 'noindex, nofollow', label: 'No Index, No Follow' }
                    ]}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={copyToClipboard}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Meta Tags
                    </>
                  )}
                </button>
                <button
                  onClick={clearForm}
                  className="flex-1 sm:flex-none bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Generated Output */}
          <div className="space-y-6">
            {/* Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Globe className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Search Preview</h3>
                </div>
                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                  <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer line-clamp-1">
                    {formData.title || 'Your Page Title Will Appear Here'}
                  </div>
                  <div className="text-green-700 text-sm mt-1">
                    {formData.url || 'https://yourwebsite.com'}
                  </div>
                  <div className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {formData.description || 'Your meta description will appear here. This is what users will see in search results, so make it compelling and informative.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <Facebook className="w-5 h-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Social Media Preview</h3>
                </div>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  {formData.image && (
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="max-h-full max-w-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4 bg-white">
                    <div className="text-gray-500 text-xs uppercase mb-1">
                      {formData.siteName || 'YOUR SITE'}
                    </div>
                    <div className="font-semibold text-gray-900 line-clamp-1">
                      {formData.title || 'Your Page Title'}
                    </div>
                    <div className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {formData.description || 'Your description here...'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Code */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Code2 className="w-5 h-5 text-blue-500 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Generated Meta Tags</h3>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Place in &lt;head&gt; section
                  </div>
                </div>
                <div className="bg-gray-900 rounded-xl p-4 overflow-auto">
                  <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                    {generateMetaTags() || '<!-- Your meta tags will appear here -->'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Tips */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Lightbulb className="w-6 h-6 text-yellow-500 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">SEO Best Practices</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Title Optimization</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Keep titles under 60 characters</li>
                  <li>• Include primary keyword near the beginning</li>
                  <li>• Make it compelling and clickable</li>
                  <li>• Avoid keyword stuffing</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Meta Description</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Aim for 150-160 characters</li>
                  <li>• Include a clear call-to-action</li>
                  <li>• Summarize page content accurately</li>
                  <li>• Use active voice when possible</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Social Sharing</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Use high-quality images (1200x630px)</li>
                  <li>• Include Open Graph tags</li>
                  <li>• Add Twitter Card meta tags</li>
                  <li>• Test previews before publishing</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOMetaGenerator;