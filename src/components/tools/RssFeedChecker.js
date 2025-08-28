import React, { useState } from 'react';
import { Rss, Search, CheckCircle, XCircle, AlertTriangle, Calendar, User, ExternalLink, Copy, RefreshCw } from 'lucide-react';

function RssFeedChecker() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const parseXML = (xmlString) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      // Check for parsing errors
      const parserError = xmlDoc.getElementsByTagName('parsererror');
      if (parserError.length > 0) {
        throw new Error('Invalid XML format');
      }
      
      return xmlDoc;
    } catch (err) {
      throw new Error('Failed to parse XML: ' + err.message);
    }
  };

  const extractFeedData = (xmlDoc) => {
    const feedData = {
      type: '',
      title: '',
      description: '',
      link: '',
      lastBuildDate: '',
      items: [],
      isValid: false,
      version: ''
    };

    // Check for RSS format
    const rssElement = xmlDoc.getElementsByTagName('rss')[0];
    const channelElement = xmlDoc.getElementsByTagName('channel')[0];
    
    // Check for Atom format
    const atomElement = xmlDoc.getElementsByTagName('feed')[0];

    if (rssElement && channelElement) {
      // RSS Feed
      feedData.type = 'RSS';
      feedData.version = rssElement.getAttribute('version') || '2.0';
      feedData.isValid = true;

      feedData.title = channelElement.getElementsByTagName('title')[0]?.textContent || 'No title';
      feedData.description = channelElement.getElementsByTagName('description')[0]?.textContent || 'No description';
      feedData.link = channelElement.getElementsByTagName('link')[0]?.textContent || '';
      feedData.lastBuildDate = channelElement.getElementsByTagName('lastBuildDate')[0]?.textContent || 
                              channelElement.getElementsByTagName('pubDate')[0]?.textContent || '';

      // Extract items
      const items = channelElement.getElementsByTagName('item');
      for (let i = 0; i < Math.min(items.length, 10); i++) {
        const item = items[i];
        feedData.items.push({
          title: item.getElementsByTagName('title')[0]?.textContent || 'No title',
          link: item.getElementsByTagName('link')[0]?.textContent || '',
          description: item.getElementsByTagName('description')[0]?.textContent || '',
          pubDate: item.getElementsByTagName('pubDate')[0]?.textContent || '',
          author: item.getElementsByTagName('author')[0]?.textContent || 
                 item.getElementsByTagNameNS('http://purl.org/dc/elements/1.1/', 'creator')[0]?.textContent || ''
        });
      }
    } else if (atomElement) {
      // Atom Feed
      feedData.type = 'Atom';
      feedData.version = atomElement.getAttribute('version') || '1.0';
      feedData.isValid = true;

      feedData.title = atomElement.getElementsByTagName('title')[0]?.textContent || 'No title';
      feedData.description = atomElement.getElementsByTagName('subtitle')[0]?.textContent || 'No description';
      
      const linkElements = atomElement.getElementsByTagName('link');
      for (let link of linkElements) {
        if (link.getAttribute('rel') === 'alternate' || !link.getAttribute('rel')) {
          feedData.link = link.getAttribute('href') || '';
          break;
        }
      }

      feedData.lastBuildDate = atomElement.getElementsByTagName('updated')[0]?.textContent || '';

      // Extract entries
      const entries = atomElement.getElementsByTagName('entry');
      for (let i = 0; i < Math.min(entries.length, 10); i++) {
        const entry = entries[i];
        const entryLinks = entry.getElementsByTagName('link');
        let entryLink = '';
        
        for (let link of entryLinks) {
          if (link.getAttribute('rel') === 'alternate' || !link.getAttribute('rel')) {
            entryLink = link.getAttribute('href') || '';
            break;
          }
        }

        feedData.items.push({
          title: entry.getElementsByTagName('title')[0]?.textContent || 'No title',
          link: entryLink,
          description: entry.getElementsByTagName('summary')[0]?.textContent || 
                      entry.getElementsByTagName('content')[0]?.textContent || '',
          pubDate: entry.getElementsByTagName('published')[0]?.textContent || 
                  entry.getElementsByTagName('updated')[0]?.textContent || '',
          author: entry.getElementsByTagName('author')[0]?.getElementsByTagName('name')[0]?.textContent || ''
        });
      }
    } else {
      throw new Error('Invalid feed format. Not a valid RSS or Atom feed.');
    }

    return feedData;
  };

  const checkFeed = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Use a CORS proxy for client-side requests
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl, {
        headers: {
          'Accept': 'application/rss+xml, application/xml, text/xml'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.contents) {
        throw new Error('No content received from the URL');
      }

      const xmlDoc = parseXML(data.contents);
      const feedData = extractFeedData(xmlDoc);
      
      setResult(feedData);
    } catch (err) {
      setError(err.message || 'Failed to fetch or parse the RSS feed');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // SEO metadata
  React.useEffect(() => {
    document.title = 'RSS Feed Checker Tool - Validate & Test RSS/Atom Feeds Online';
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Free online RSS feed checker and validator. Test RSS and Atom feeds, verify feed structure, preview content, and troubleshoot feed issues instantly.';
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* iOS-style card container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/20 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-8 sm:px-8 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                <Rss className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
              RSS Feed Checker
            </h1>
            
            <p className="text-lg text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Validate and analyze RSS and Atom feeds instantly. Check feed structure, preview content, 
              verify formatting, and troubleshoot feed issues with our comprehensive feed validator.
            </p>
          </div>

          {/* Main Tool */}
          <div className="px-6 py-8 sm:px-8">
            <div className="space-y-6">
              {/* URL Input */}
              <div>
                <label htmlFor="feedUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  RSS/Atom Feed URL
                </label>
                <div className="flex gap-3">
                  <input
                    id="feedUrl"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/feed.xml"
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             placeholder-gray-500 dark:placeholder-gray-400
                             focus:ring-2 focus:ring-orange-500 focus:border-transparent
                             transition-all duration-200"
                    onKeyDown={(e) => e.key === 'Enter' && checkFeed()}
                  />
                  <button
                    onClick={checkFeed}
                    disabled={isLoading}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400
                             text-white font-medium rounded-xl transition-all duration-200
                             flex items-center gap-2 min-w-[120px] justify-center"
                  >
                    {isLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    {isLoading ? 'Checking...' : 'Check Feed'}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 
                               rounded-xl p-4 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800 dark:text-red-200">Error</h3>
                    <p className="text-red-700 dark:text-red-300 text-sm mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Results */}
              {result && (
                <div className="space-y-6">
                  {/* Feed Status */}
                  <div className={`border rounded-xl p-4 ${
                    result.isValid 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}>
                    <div className="flex items-center gap-3">
                      {result.isValid ? (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                      )}
                      <div>
                        <h3 className={`font-semibold ${
                          result.isValid 
                            ? 'text-green-800 dark:text-green-200' 
                            : 'text-red-800 dark:text-red-200'
                        }`}>
                          {result.isValid ? 'Valid Feed' : 'Invalid Feed'}
                        </h3>
                        <p className={`text-sm ${
                          result.isValid 
                            ? 'text-green-700 dark:text-green-300' 
                            : 'text-red-700 dark:text-red-300'
                        }`}>
                          {result.type} {result.version} format detected
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Feed Information */}
                  {result.isValid && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Rss className="w-5 h-5" />
                        Feed Information
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                            Title
                          </label>
                          <p className="text-gray-900 dark:text-white break-words">
                            {result.title || 'Not specified'}
                          </p>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                            Type & Version
                          </label>
                          <p className="text-gray-900 dark:text-white">
                            {result.type} {result.version}
                          </p>
                        </div>
                        
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                            Description
                          </label>
                          <p className="text-gray-900 dark:text-white break-words">
                            {result.description || 'Not specified'}
                          </p>
                        </div>
                        
                        {result.link && (
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                              Website
                            </label>
                            <a 
                              href={result.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1 break-all"
                            >
                              {result.link}
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                            </a>
                          </div>
                        )}
                        
                        {result.lastBuildDate && (
                          <div>
                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-1">
                              Last Updated
                            </label>
                            <p className="text-gray-900 dark:text-white flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {formatDate(result.lastBuildDate)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Feed Items */}
                  {result.isValid && result.items.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          Recent Feed Items ({result.items.length})
                        </h3>
                      </div>
                      
                      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-96 overflow-y-auto">
                        {result.items.map((item, index) => (
                          <div key={index} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <div className="flex justify-between items-start gap-4 mb-2">
                              <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 flex-1">
                                {item.title}
                              </h4>
                              {item.link && (
                                <button
                                  onClick={() => copyToClipboard(item.link)}
                                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors flex-shrink-0"
                                  title="Copy link"
                                >
                                  <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                </button>
                              )}
                            </div>
                            
                            {item.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                                {truncateText(item.description.replace(/<[^>]*>/g, ''))}
                              </p>
                            )}
                            
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
                              {item.pubDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(item.pubDate)}
                                </span>
                              )}
                              {item.author && (
                                <span className="flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  {item.author}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Items Message */}
                  {result.isValid && result.items.length === 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 
                                   rounded-xl p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-800 dark:text-yellow-200">No Feed Items</h3>
                        <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                          The feed is valid but contains no items.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Long Description */}
          <div className="px-6 py-8 sm:px-8 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About RSS Feed Checker Tool
            </h2>
            
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-base leading-relaxed">
                Our comprehensive RSS Feed Checker is a powerful online tool designed to help developers, 
                content creators, and website administrators validate, analyze, and troubleshoot RSS and Atom feeds. 
                Whether you're setting up a new feed, debugging existing issues, or simply want to verify your 
                feed's structure and content, this tool provides instant, detailed analysis.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Key Features
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Feed Validation</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Instantly validate RSS 2.0, RSS 1.0, and Atom 1.0 feeds. Detect formatting errors, 
                    missing required elements, and structural issues that could prevent proper feed consumption.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Content Preview</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Preview the latest feed items with titles, descriptions, publication dates, and author information. 
                    Perfect for verifying that your content is being syndicated correctly.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Feed Information</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Extract comprehensive metadata including feed title, description, website link, 
                    last update timestamp, and feed format version for complete feed analysis.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Cross-Origin Support</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Check feeds from any domain with built-in CORS proxy support. No server-side setup required - 
                    everything runs directly in your browser for maximum privacy and convenience.
                  </p>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                Who Can Use This Tool?
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-base leading-relaxed">
                This RSS feed validator is perfect for bloggers setting up syndication, developers integrating 
                feed readers, content managers troubleshooting feed issues, SEO professionals optimizing content 
                distribution, and anyone working with RSS or Atom feeds. The tool supports all major feed formats 
                and provides detailed error reporting to help you quickly identify and resolve any issues.
              </p>
              
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                Simply paste your feed URL above and get instant validation results, complete with feed preview, 
                metadata extraction, and actionable insights to ensure your RSS or Atom feed is working perfectly 
                across all feed readers and aggregators.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RssFeedChecker;