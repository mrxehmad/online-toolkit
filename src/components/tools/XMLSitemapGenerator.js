import React, { useState, useRef } from 'react';
import { 
  FiPlus, 
  FiTrash2, 
  FiDownload, 
  FiGlobe, 
  FiBarChart,
  FiRefreshCw,
  FiCheck,
  FiCopy,
  FiInfo
} from 'react-icons/fi';

const XMLSitemapGenerator = () => {
  const [urls, setUrls] = useState([
    { 
      url: '', 
      priority: '0.8', 
      changefreq: 'weekly', 
      lastmod: new Date().toISOString().split('T')[0] 
    }
  ]);
  const [sitemap, setSitemap] = useState('');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef(null);

  const priorityOptions = [
    '0.0', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1.0'
  ];

  const changefreqOptions = [
    'always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'
  ];

  const addUrl = () => {
    setUrls([...urls, { 
      url: '', 
      priority: '0.8', 
      changefreq: 'weekly', 
      lastmod: new Date().toISOString().split('T')[0] 
    }]);
  };

  const removeUrl = (index) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
    }
  };

  const updateUrl = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const generateSitemap = () => {
    const validUrls = urls.filter(item => item.url.trim() !== '');
    
    if (validUrls.length === 0) {
      alert('Please add at least one URL to generate the sitemap.');
      return;
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    validUrls.forEach(item => {
      xml += `
  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`;
    });

    xml += `
</urlset>`;

    setSitemap(xml);
  };

  const downloadSitemap = () => {
    if (!sitemap) {
      alert('Please generate the sitemap first.');
      return;
    }

    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copySitemap = async () => {
    if (!sitemap) {
      alert('Please generate the sitemap first.');
      return;
    }

    try {
      await navigator.clipboard.writeText(sitemap);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      if (textareaRef.current) {
        textareaRef.current.select();
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <FiGlobe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                XML Sitemap Generator
              </h1>
              <p className="text-gray-600 mt-1">
                Create professional XML sitemaps for better SEO rankings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* SEO Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiInfo className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Why XML Sitemaps Matter for SEO
              </h2>
              <p className="text-gray-600 mb-3">
                XML sitemaps help search engines discover, crawl, and index your website pages more efficiently. 
                They provide crucial metadata about your URLs including last modification dates, update frequency, 
                and page priority, leading to better search rankings and visibility.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="flex items-center space-x-2">
                  <FiCheck className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Faster indexing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCheck className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Better crawl efficiency</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiCheck className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Improved SEO rankings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* URL Input Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FiGlobe className="w-5 h-5 mr-2 text-blue-500" />
                Add Your URLs
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Enter your website URLs with SEO parameters
              </p>
            </div>
            
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {urls.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      URL #{index + 1}
                    </span>
                    {urls.length > 1 && (
                      <button
                        onClick={() => removeUrl(index)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove URL"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <input
                    type="url"
                    placeholder="https://example.com/page"
                    value={item.url}
                    onChange={(e) => updateUrl(index, 'url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Priority
                      </label>
                      <select
                        value={item.priority}
                        onChange={(e) => updateUrl(index, 'priority', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {priorityOptions.map(priority => (
                          <option key={priority} value={priority}>{priority}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Change Frequency
                      </label>
                      <select
                        value={item.changefreq}
                        onChange={(e) => updateUrl(index, 'changefreq', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {changefreqOptions.map(freq => (
                          <option key={freq} value={freq}>{freq}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Last Modified
                      </label>
                      <input
                        type="date"
                        value={item.lastmod}
                        onChange={(e) => updateUrl(index, 'lastmod', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={addUrl}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium"
              >
                <FiPlus className="w-4 h-4 mr-2" />
                Add Another URL
              </button>
            </div>
          </div>

          {/* Generated Sitemap Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <FiBarChart className="w-5 h-5 mr-2 text-green-500" />
                Generated XML Sitemap
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Your professional XML sitemap ready for search engines
              </p>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button
                  onClick={generateSitemap}
                  className="flex items-center justify-center px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors font-medium"
                >
                  <FiRefreshCw className="w-4 h-4 mr-2" />
                  Generate Sitemap
                </button>
                
                {sitemap && (
                  <>
                    <button
                      onClick={copySitemap}
                      className="flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors font-medium"
                    >
                      {copied ? (
                        <>
                          <FiCheck className="w-4 h-4 mr-2 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FiCopy className="w-4 h-4 mr-2" />
                          Copy XML
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={downloadSitemap}
                      className="flex items-center justify-center px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-colors font-medium"
                    >
                      <FiDownload className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </>
                )}
              </div>
              
              {sitemap ? (
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={sitemap}
                    readOnly
                    className="w-full h-80 p-4 text-sm font-mono bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your generated XML sitemap will appear here..."
                  />
                  <div className="absolute top-3 right-3 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                    Ready to use
                  </div>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                  <div className="text-center">
                    <FiGlobe className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">
                      Add URLs and click "Generate Sitemap" to create your XML sitemap
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SEO Tips */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FiBarChart className="w-5 h-5 mr-2 text-purple-500" />
            SEO Best Practices for XML Sitemaps
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Priority Settings</h4>
              <p className="text-sm text-gray-600">
                Use 1.0 for your homepage, 0.8-0.9 for important pages, 0.5-0.7 for regular content, 
                and 0.1-0.4 for less important pages.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Update Frequency</h4>
              <p className="text-sm text-gray-600">
                Set "daily" for news/blogs, "weekly" for product pages, "monthly" for general content, 
                and "yearly" for static pages like about/contact.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Submission Tips</h4>
              <p className="text-sm text-gray-600">
                Submit your sitemap to Google Search Console, Bing Webmaster Tools, and add the 
                sitemap URL to your robots.txt file.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Generate professional XML sitemaps instantly • Free SEO tool for better search rankings
          </p>
        </div>
      </div>
    </div>
  );
};

export default XMLSitemapGenerator;