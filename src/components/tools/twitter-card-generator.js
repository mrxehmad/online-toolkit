import React, { useState, useCallback } from 'react';
import { 
  Share2, 
  Download, 
  Copy, 
  Check, 
  Image, 
  Globe, 
  Twitter, 
  Facebook,
  Eye,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

const OpenGraphGenerator = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    url: '',
    image: '',
    siteName: '',
    type: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: '',
    author: ''
  });

  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState('desktop');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateMetaTags = useCallback(() => {
    const tags = [];
    
    // Open Graph tags
    if (formData.title) tags.push(`<meta property="og:title" content="${formData.title}" />`);
    if (formData.description) tags.push(`<meta property="og:description" content="${formData.description}" />`);
    if (formData.url) tags.push(`<meta property="og:url" content="${formData.url}" />`);
    if (formData.image) tags.push(`<meta property="og:image" content="${formData.image}" />`);
    if (formData.siteName) tags.push(`<meta property="og:site_name" content="${formData.siteName}" />`);
    if (formData.type) tags.push(`<meta property="og:type" content="${formData.type}" />`);
    
    // Twitter Card tags
    if (formData.twitterCard) tags.push(`<meta name="twitter:card" content="${formData.twitterCard}" />`);
    if (formData.title) tags.push(`<meta name="twitter:title" content="${formData.title}" />`);
    if (formData.description) tags.push(`<meta name="twitter:description" content="${formData.description}" />`);
    if (formData.image) tags.push(`<meta name="twitter:image" content="${formData.image}" />`);
    if (formData.twitterSite) tags.push(`<meta name="twitter:site" content="${formData.twitterSite}" />`);
    
    // SEO tags
    if (formData.title) tags.push(`<title>${formData.title}</title>`);
    if (formData.description) tags.push(`<meta name="description" content="${formData.description}" />`);
    if (formData.author) tags.push(`<meta name="author" content="${formData.author}" />`);
    tags.push(`<meta name="robots" content="index, follow" />`);
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0" />`);
    
    return tags.join('\n');
  }, [formData]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateMetaTags());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const downloadAsFile = () => {
    const content = generateMetaTags();
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const PreviewCard = ({ platform }) => {
    const isTwitter = platform === 'twitter';
    const cardClass = isTwitter 
      ? 'bg-gray-50 border border-gray-200 rounded-xl overflow-hidden'
      : 'bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm';

    return (
      <div className={`${cardClass} transition-all duration-200 hover:shadow-md`}>
        {formData.image && (
          <div className={`w-full ${isTwitter ? 'h-48' : 'h-40'} bg-gray-100 relative overflow-hidden`}>
            <img 
              src={formData.image} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="hidden absolute inset-0 bg-gray-100 items-center justify-center">
              <Image className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        )}
        <div className="p-4">
          {formData.siteName && (
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              {formData.siteName}
            </div>
          )}
          {formData.title && (
            <h3 className={`font-semibold text-gray-900 mb-2 line-clamp-2 ${isTwitter ? 'text-lg' : 'text-base'}`}>
              {formData.title}
            </h3>
          )}
          {formData.description && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-2">
              {formData.description}
            </p>
          )}
          {formData.url && (
            <div className="text-xs text-gray-500 flex items-center">
              <Globe className="w-3 h-3 mr-1" />
              {(() => {
                try {
                  return new URL(formData.url).hostname;
                } catch {
                  return formData.url;
                }
              })()}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-500 p-3 rounded-full">
                <Share2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Open Graph & Twitter Card Generator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Create perfect social media previews for your website. Generate Open Graph and Twitter Card meta tags 
              to control how your content appears when shared on social platforms.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Image className="w-5 h-5 mr-2 text-blue-500" />
              Content Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Your awesome page title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Compelling description of your content..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => handleInputChange('url', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="https://yoursite.com/page"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="https://yoursite.com/image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 1200x630px for best results
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={formData.siteName}
                    onChange={(e) => handleInputChange('siteName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Your Site Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Twitter Handle
                  </label>
                  <input
                    type="text"
                    value={formData.twitterSite}
                    onChange={(e) => handleInputChange('twitterSite', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="@yourhandle"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  >
                    <option value="website">Website</option>
                    <option value="article">Article</option>
                    <option value="video">Video</option>
                    <option value="music">Music</option>
                    <option value="book">Book</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Author name"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-500" />
                Live Preview
              </h2>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded-md transition-colors ${
                    previewMode === 'desktop' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`p-2 rounded-md transition-colors ${
                    previewMode === 'tablet' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded-md transition-colors ${
                    previewMode === 'mobile' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className={`space-y-6 ${
              previewMode === 'mobile' ? 'max-w-sm' : 
              previewMode === 'tablet' ? 'max-w-md' : 'w-full'
            } mx-auto`}>
              {/* Facebook Preview */}
              <div>
                <div className="flex items-center mb-3">
                  <Facebook className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">Facebook</span>
                </div>
                <PreviewCard platform="facebook" />
              </div>

              {/* Twitter Preview */}
              <div>
                <div className="flex items-center mb-3">
                  <Twitter className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="font-medium text-gray-900">Twitter</span>
                </div>
                <PreviewCard platform="twitter" />
              </div>
            </div>
          </div>
        </div>

        {/* Generated Code Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Generated Meta Tags</h2>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={downloadAsFile}
                className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </button>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-4 overflow-x-auto">
            <pre className="text-sm text-green-400 whitespace-pre-wrap">
              <code>{generateMetaTags() || '<!-- Fill in the form to generate meta tags -->'}</code>
            </pre>
          </div>
        </div>

        {/* SEO Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Title Optimization</h4>
              <p className="text-sm text-gray-600">
                Keep titles under 60 characters for optimal display. Include your main keyword near the beginning.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Description Guidelines</h4>
              <p className="text-sm text-gray-600">
                Write compelling descriptions under 160 characters that encourage clicks and include relevant keywords.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Image Requirements</h4>
              <p className="text-sm text-gray-600">
                Use high-quality images (1200x630px) that are relevant to your content and load quickly.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Testing Your Tags</h4>
              <p className="text-sm text-gray-600">
                Always test your meta tags using Facebook's Sharing Debugger and Twitter's Card Validator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenGraphGenerator;