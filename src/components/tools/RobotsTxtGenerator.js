import React, { useState, useEffect } from 'react';
import {  
  FiDownload, 
  FiCopy, 
  FiPlus, 
  FiTrash2, 
  FiInfo,
  FiGlobe,
  FiSearch,
  FiShield,
  FiFileText,
  FiSettings,
  FiCheckCircle
} from 'react-icons/fi';
import { RiRobot2Line } from "react-icons/ri";

const RobotsTxtGenerator = () => {
  const [userAgents, setUserAgents] = useState([
    { id: 1, name: '*', allow: [''], disallow: ['/admin', '/private'] }
  ]);
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [crawlDelay, setCrawlDelay] = useState('');
  const [host, setHost] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');

  useEffect(() => {
    generateRobotsTxt();
  }, [userAgents, sitemapUrl, crawlDelay, host]);

  const generateRobotsTxt = () => {
    let content = '';
    
    userAgents.forEach(agent => {
      content += `User-agent: ${agent.name}\n`;
      
      agent.allow.forEach(path => {
        if (path.trim()) content += `Allow: ${path}\n`;
      });
      
      agent.disallow.forEach(path => {
        if (path.trim()) content += `Disallow: ${path}\n`;
      });
      
      if (crawlDelay) {
        content += `Crawl-delay: ${crawlDelay}\n`;
      }
      
      content += '\n';
    });
    
    if (sitemapUrl) {
      content += `Sitemap: ${sitemapUrl}\n`;
    }
    
    if (host) {
      content += `Host: ${host}\n`;
    }
    
    setGeneratedContent(content.trim());
  };

  const addUserAgent = () => {
    const newAgent = {
      id: Date.now(),
      name: '*',
      allow: [''],
      disallow: ['']
    };
    setUserAgents([...userAgents, newAgent]);
  };

  const removeUserAgent = (id) => {
    setUserAgents(userAgents.filter(agent => agent.id !== id));
  };

  const updateUserAgent = (id, field, value) => {
    setUserAgents(userAgents.map(agent => 
      agent.id === id ? { ...agent, [field]: value } : agent
    ));
  };

  const addPath = (id, type) => {
    setUserAgents(userAgents.map(agent => 
      agent.id === id ? { ...agent, [type]: [...agent[type], ''] } : agent
    ));
  };

  const updatePath = (id, type, index, value) => {
    setUserAgents(userAgents.map(agent => 
      agent.id === id ? {
        ...agent,
        [type]: agent[type].map((path, i) => i === index ? value : path)
      } : agent
    ));
  };

  const removePath = (id, type, index) => {
    setUserAgents(userAgents.map(agent => 
      agent.id === id ? {
        ...agent,
        [type]: agent[type].filter((_, i) => i !== index)
      } : agent
    ));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedContent);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadFile = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'robots.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
        isActive 
          ? 'bg-blue-500 text-white shadow-lg' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* SEO Meta Information */}
      <div className="hidden">
        <h1>Free Robots.txt Generator Tool - SEO Optimization Made Easy</h1>
        <p>Generate professional robots.txt files instantly with our free online tool. Perfect for SEO, website crawling control, and search engine optimization. Mobile-friendly and easy to use.</p>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <RiRobot2Line className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Robots.txt Generator</h1>
                <p className="text-sm text-gray-600">Free SEO Tool</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <TabButton
                id="generator"
                label="Generator"
                icon={FiSettings}
                isActive={activeTab === 'generator'}
                onClick={() => setActiveTab('generator')}
              />
              <TabButton
                id="guide"
                label="SEO Guide"
                icon={FiInfo}
                isActive={activeTab === 'guide'}
                onClick={() => setActiveTab('guide')}
              />
            </div>
          </div>
          
          {/* Mobile Tabs */}
          <div className="md:hidden mt-4 flex space-x-2">
            <TabButton
              id="generator"
              label="Generator"
              icon={FiSettings}
              isActive={activeTab === 'generator'}
              onClick={() => setActiveTab('generator')}
            />
            <TabButton
              id="guide"
              label="Guide"
              icon={FiInfo}
              isActive={activeTab === 'guide'}
              onClick={() => setActiveTab('guide')}
            />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === 'generator' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FiSettings className="w-5 h-5 mr-2 text-blue-500" />
                  Configuration
                </h2>

                {/* Global Settings */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiGlobe className="w-4 h-4 inline mr-1" />
                      Sitemap URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={sitemapUrl}
                      onChange={(e) => setSitemapUrl(e.target.value)}
                      placeholder="https://example.com/sitemap.xml"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Crawl Delay (seconds)
                      </label>
                      <input
                        type="number"
                        value={crawlDelay}
                        onChange={(e) => setCrawlDelay(e.target.value)}
                        placeholder="10"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Host (Optional)
                      </label>
                      <input
                        type="text"
                        value={host}
                        onChange={(e) => setHost(e.target.value)}
                        placeholder="example.com"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* User Agents */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-800">User Agents</h3>
                    <button
                      onClick={addUserAgent}
                      className="flex items-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                    >
                      <FiPlus className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>

                  {userAgents.map((agent) => (
                    <div key={agent.id} className="bg-gray-50 rounded-xl p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={agent.name}
                          onChange={(e) => updateUserAgent(agent.id, 'name', e.target.value)}
                          placeholder="User-agent name"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {userAgents.length > 1 && (
                          <button
                            onClick={() => removeUserAgent(agent.id)}
                            className="ml-3 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Allow Rules */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Allow</label>
                          <button
                            onClick={() => addPath(agent.id, 'allow')}
                            className="text-xs text-blue-500 hover:text-blue-600"
                          >
                            + Add Allow Rule
                          </button>
                        </div>
                        <div className="space-y-2">
                          {agent.allow.map((path, index) => (
                            <div key={index} className="flex space-x-2">
                              <input
                                type="text"
                                value={path}
                                onChange={(e) => updatePath(agent.id, 'allow', index, e.target.value)}
                                placeholder="/path"
                                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              {agent.allow.length > 1 && (
                                <button
                                  onClick={() => removePath(agent.id, 'allow', index)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <FiTrash2 className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Disallow Rules */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">Disallow</label>
                          <button
                            onClick={() => addPath(agent.id, 'disallow')}
                            className="text-xs text-blue-500 hover:text-blue-600"
                          >
                            + Add Disallow Rule
                          </button>
                        </div>
                        <div className="space-y-2">
                          {agent.disallow.map((path, index) => (
                            <div key={index} className="flex space-x-2">
                              <input
                                type="text"
                                value={path}
                                onChange={(e) => updatePath(agent.id, 'disallow', index, e.target.value)}
                                placeholder="/admin"
                                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                onClick={() => removePath(agent.id, 'disallow', index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <FiTrash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                      <FiFileText className="w-5 h-5 mr-2 text-green-500" />
                      Generated robots.txt
                    </h2>
                    <div className="flex space-x-2">
                      <button
                        onClick={copyToClipboard}
                        className="flex items-center space-x-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      >
                        {copySuccess ? <FiCheckCircle className="w-4 h-4" /> : <FiCopy className="w-4 h-4" />}
                        <span>{copySuccess ? 'Copied!' : 'Copy'}</span>
                      </button>
                      <button
                        onClick={downloadFile}
                        className="flex items-center space-x-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                      >
                        <FiDownload className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <pre className="bg-gray-50 rounded-xl p-4 text-sm text-gray-800 whitespace-pre-wrap break-all font-mono min-h-[300px] overflow-auto">
                    {generatedContent || '# Your robots.txt will appear here'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <FiShield className="w-6 h-6 mr-3 text-blue-500" />
              Robots.txt SEO Guide
            </h2>

            <div className="prose max-w-none space-y-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <FiSearch className="w-5 h-5 mr-2 text-green-500" />
                  What is robots.txt?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  The robots.txt file is a simple text file placed in your website's root directory that tells search engine crawlers which pages or sections of your site they can or cannot access. It's an essential tool for SEO and website management.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-xl p-6">
                  <h4 className="font-semibold text-green-800 mb-3">✅ Best Practices</h4>
                  <ul className="text-green-700 space-y-2 text-sm">
                    <li>• Place robots.txt in your root directory</li>
                    <li>• Use specific paths for better control</li>
                    <li>• Include your sitemap URL</li>
                    <li>• Test your robots.txt file regularly</li>
                    <li>• Keep it simple and readable</li>
                  </ul>
                </div>

                <div className="bg-red-50 rounded-xl p-6">
                  <h4 className="font-semibold text-red-800 mb-3">❌ Common Mistakes</h4>
                  <ul className="text-red-700 space-y-2 text-sm">
                    <li>• Blocking important pages by accident</li>
                    <li>• Using robots.txt for security (it's public)</li>
                    <li>• Forgetting to test after changes</li>
                    <li>• Not including sitemap reference</li>
                    <li>• Blocking CSS/JS files unnecessarily</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Common User-Agents</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: '*', desc: 'All crawlers' },
                    { name: 'Googlebot', desc: 'Google Search' },
                    { name: 'Bingbot', desc: 'Bing Search' },
                    { name: 'Slurp', desc: 'Yahoo Search' },
                    { name: 'DuckDuckBot', desc: 'DuckDuckGo' },
                    { name: 'Twitterbot', desc: 'Twitter Cards' }
                  ].map((bot) => (
                    <div key={bot.name} className="bg-gray-50 rounded-lg p-3">
                      <div className="font-mono text-sm text-blue-600">{bot.name}</div>
                      <div className="text-xs text-gray-600">{bot.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Example Usage</h3>
                <div className="bg-gray-900 rounded-xl p-4 text-green-400 font-mono text-sm overflow-x-auto">
                  <div className="whitespace-pre">{`# Allow all crawlers to access everything
User-agent: *
Allow: /

# Block admin area from all crawlers
User-agent: *
Disallow: /admin/
Disallow: /private/

# Specific rules for Google
User-agent: Googlebot
Allow: /special-google-content/

# Include sitemap
Sitemap: https://example.com/sitemap.xml`}</div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6">
                <h4 className="font-semibold text-blue-800 mb-3">💡 Pro Tips for SEO</h4>
                <ul className="text-blue-700 space-y-2 text-sm">
                  <li>• Use robots.txt to prevent duplicate content indexing</li>
                  <li>• Block search result pages and filter URLs</li>
                  <li>• Don't block important CSS and JavaScript files</li>
                  <li>• Consider crawl budget for large websites</li>
                  <li>• Monitor crawl errors in Google Search Console</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-600 mb-4">
            Free robots.txt generator for SEO optimization. Generate, download, and optimize your website's robots.txt file instantly.
          </p>
          <div className="flex flex-wrap justify-center items-center space-x-6 text-sm text-gray-500">
            <span>✓ Free to use</span>
            <span>✓ No registration required</span>
            <span>✓ Mobile responsive</span>
            <span>✓ SEO optimized</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RobotsTxtGenerator;