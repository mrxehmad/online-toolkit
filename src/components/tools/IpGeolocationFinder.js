import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Globe, Wifi, Search, Loader2, Info, Shield, Clock, Navigation } from 'lucide-react';

export default function IpGeolocationFinder() {
  const [ipAddress, setIpAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [userIp, setUserIp] = useState('');
  const resultRef = useRef(null);

  // Get user's IP on component mount
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(response => response.json())
      .then(data => setUserIp(data.ip))
      .catch(() => {});
  }, []);

  // SEO metadata effect
  useEffect(() => {
    document.title = 'IP Geolocation Finder - Find Location of Any IP Address | Free Tool';
    
    // Create or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Free IP Geolocation Finder tool to discover location, ISP, timezone, and detailed information for any IP address. Fast, accurate, and privacy-focused geolocation lookup service.';

    // Create or update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;

    return () => {
      document.title = 'Your Site';
      if (metaDescription) metaDescription.content = '';
    };
  }, []);

  const validateIP = (ip) => {
    const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  const scrollToResult = () => {
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }, 1200);
  };

  const lookupIP = async (ip) => {
    if (!validateIP(ip)) {
      setError('Please enter a valid IP address');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch IP information');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.reason || 'Invalid IP address');
      }

      setResult(data);
      scrollToResult();
    } catch (err) {
      setError(err.message || 'Failed to lookup IP address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (ipAddress.trim()) {
      lookupIP(ipAddress.trim());
    }
  };

  const lookupMyIP = () => {
    if (userIp) {
      setIpAddress(userIp);
      lookupIP(userIp);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              IP Geolocation Finder
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover the geographic location, ISP information, and network details of any IP address instantly
            </p>
          </div>

          {/* Search Form */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Enter IP address (e.g., 8.8.8.8)"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !ipAddress.trim()}
                  className="flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 min-w-[120px]"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Lookup
                    </>
                  )}
                </button>
                {userIp && (
                  <button
                    type="button"
                    onClick={lookupMyIP}
                    disabled={loading}
                    className="flex items-center justify-center px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200"
                    title="Lookup my IP"
                  >
                    <Navigation className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <Info className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div ref={resultRef} className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                Geolocation Results
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Navigation className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                    Location Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">IP Address:</span>
                      <span className="font-mono text-gray-900 dark:text-white">{result.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Country:</span>
                      <span className="text-gray-900 dark:text-white">{result.country_name} {result.country_code && `(${result.country_code})`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Region:</span>
                      <span className="text-gray-900 dark:text-white">{result.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">City:</span>
                      <span className="text-gray-900 dark:text-white">{result.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Postal Code:</span>
                      <span className="text-gray-900 dark:text-white">{result.postal || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Coordinates:</span>
                      <span className="font-mono text-gray-900 dark:text-white">
                        {result.latitude}, {result.longitude}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Network Information */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Wifi className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    Network Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">ISP:</span>
                      <span className="text-gray-900 dark:text-white text-right">{result.org || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">ASN:</span>
                      <span className="font-mono text-gray-900 dark:text-white">{result.asn || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Timezone:</span>
                      <span className="text-gray-900 dark:text-white flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {result.timezone || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Currency:</span>
                      <span className="text-gray-900 dark:text-white">{result.currency || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Languages:</span>
                      <span className="text-gray-900 dark:text-white">{result.languages || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
            <div className="flex items-start">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Privacy & Security</h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                  All IP lookups are performed directly in your browser using third-party APIs. We don't store or log any IP addresses you search. 
                  This tool is designed to respect your privacy while providing accurate geolocation information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Description Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            About IP Geolocation Finder
          </h2>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our <strong>IP Geolocation Finder</strong> is a powerful, free online tool that helps you discover the geographic location and network information of any IP address. Whether you're a network administrator, cybersecurity professional, web developer, or just curious about IP addresses, this tool provides comprehensive geolocation data in seconds.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Key Features</h3>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
              <li><strong>Instant Geolocation:</strong> Get precise location data including country, region, city, and coordinates</li>
              <li><strong>Network Details:</strong> View ISP information, ASN, and organization data</li>
              <li><strong>Privacy-Focused:</strong> All lookups are performed client-side with no data storage</li>
              <li><strong>Support for IPv4 & IPv6:</strong> Compatible with both IP address formats</li>
              <li><strong>Timezone & Currency Info:</strong> Additional contextual data about the location</li>
              <li><strong>Mobile-Friendly:</strong> Responsive design that works on all devices</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Common Use Cases</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              IP geolocation has numerous practical applications in today's digital world:
            </p>
            <ul className="text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside mb-6">
              <li><strong>Cybersecurity Analysis:</strong> Investigate suspicious IP addresses and potential threats</li>
              <li><strong>Web Analytics:</strong> Understand your website visitors' geographic distribution</li>
              <li><strong>Content Localization:</strong> Serve region-appropriate content based on user location</li>
              <li><strong>Fraud Prevention:</strong> Detect unusual login locations and prevent unauthorized access</li>
              <li><strong>Network Troubleshooting:</strong> Identify network routes and diagnose connectivity issues</li>
              <li><strong>Marketing Research:</strong> Analyze traffic sources and target specific regions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">How It Works</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our IP geolocation tool uses advanced database lookups to provide accurate location information. The process involves querying multiple data sources that maintain comprehensive IP address registries, including Regional Internet Registries (RIRs) and ISP databases. The tool cross-references this data to provide you with the most accurate and up-to-date information available.
            </p>

            <p className="text-gray-600 dark:text-gray-300">
              Start using our IP Geolocation Finder today to unlock valuable insights about IP addresses. Simply enter any valid IPv4 or IPv6 address in the search field above and get instant, detailed geolocation results. The tool is completely free to use and requires no registration or downloads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}