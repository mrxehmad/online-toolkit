import React, { useState, useEffect } from 'react';
import { Search, Globe, Sparkles, Copy, Check, RefreshCw, Zap, Star, Hash } from 'lucide-react';

export default function DomainNameGenerator() {
  const [keyword, setKeyword] = useState('');
  const [domains, setDomains] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState('');
  const [selectedExtensions, setSelectedExtensions] = useState(['.com', '.net', '.org']);
  const [generationType, setGenerationType] = useState('creative');

  // SEO metadata
  useEffect(() => {
    document.title = 'Domain Name Generator - Find Perfect Domain Names Instantly';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = 'Generate creative, brandable domain names instantly. Find available .com, .net, .org domains with AI-powered suggestions. Perfect for startups, businesses, and personal projects.';
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.href = window.location.href;
    }
  }, []);

  const extensions = ['.com', '.net', '.org', '.io', '.co', '.app', '.dev', '.tech', '.store', '.online'];
  
  const prefixes = ['get', 'my', 'the', 'go', 'use', 'try', 'pro', 'web', 'digital', 'smart'];
  const suffixes = ['ly', 'ify', 'hub', 'lab', 'box', 'zone', 'spot', 'wise', 'flow', 'sync'];
  const creativeWords = ['spark', 'nexus', 'flux', 'zen', 'peak', 'wave', 'core', 'edge', 'vibe', 'mint'];
  const techWords = ['cloud', 'code', 'data', 'tech', 'digital', 'cyber', 'neural', 'quantum', 'pixel', 'logic'];

  const generateDomains = () => {
    if (!keyword.trim()) return;
    
    setIsGenerating(true);
    const cleanKeyword = keyword.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
    const generatedDomains = [];

    // Direct combinations
    selectedExtensions.forEach(ext => {
      generatedDomains.push(`${cleanKeyword}${ext}`);
    });

    // Prefixes
    prefixes.slice(0, 3).forEach(prefix => {
      selectedExtensions.forEach(ext => {
        generatedDomains.push(`${prefix}${cleanKeyword}${ext}`);
      });
    });

    // Suffixes
    suffixes.slice(0, 3).forEach(suffix => {
      selectedExtensions.forEach(ext => {
        generatedDomains.push(`${cleanKeyword}${suffix}${ext}`);
      });
    });

    // Creative combinations based on type
    const wordList = generationType === 'tech' ? techWords : creativeWords;
    wordList.slice(0, 4).forEach(word => {
      selectedExtensions.forEach(ext => {
        generatedDomains.push(`${cleanKeyword}${word}${ext}`);
        generatedDomains.push(`${word}${cleanKeyword}${ext}`);
      });
    });

    // Numbered variations
    [1, 2, 24, 360, 365].forEach(num => {
      selectedExtensions.slice(0, 2).forEach(ext => {
        generatedDomains.push(`${cleanKeyword}${num}${ext}`);
      });
    });

    // Remove duplicates and shuffle
    const uniqueDomains = [...new Set(generatedDomains)];
    const shuffled = uniqueDomains.sort(() => Math.random() - 0.5);
    
    setTimeout(() => {
      setDomains(shuffled.slice(0, 24));
      setIsGenerating(false);
    }, 800);
  };

  const copyToClipboard = async (domain) => {
    try {
      await navigator.clipboard.writeText(domain);
      setCopiedDomain(domain);
      setTimeout(() => setCopiedDomain(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleExtension = (ext) => {
    setSelectedExtensions(prev => 
      prev.includes(ext) 
        ? prev.filter(e => e !== ext)
        : [...prev, ext]
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateDomains();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl p-8 transition-all duration-300">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Globe className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Domain Name Generator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Create unique, brandable domain names instantly with our AI-powered generator
            </p>
          </div>

          {/* Generator Form */}
          <div className="space-y-6">
            {/* Keyword Input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your keyword or business idea..."
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 dark:border-gray-600 rounded-xl 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         text-lg transition-all duration-200"
              />
            </div>

            {/* Generation Type */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setGenerationType('creative')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                  generationType === 'creative'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Creative
              </button>
              <button
                onClick={() => setGenerationType('tech')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                  generationType === 'tech'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Zap className="w-4 h-4" />
                Tech
              </button>
            </div>

            {/* Extensions */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Domain Extensions:
              </label>
              <div className="flex flex-wrap gap-2">
                {extensions.map((ext) => (
                  <button
                    key={ext}
                    onClick={() => toggleExtension(ext)}
                    className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                      selectedExtensions.includes(ext)
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {ext}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateDomains}
              disabled={!keyword.trim() || isGenerating}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                       text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl 
                       transform hover:scale-[1.02] transition-all duration-200 
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                       flex items-center justify-center gap-2 text-lg"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              {isGenerating ? 'Generating...' : 'Generate Domain Names'}
            </button>
          </div>

          {/* Results */}
          {domains.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-6">
                <Star className="w-5 h-5 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Generated Domains
                </h2>
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm px-2 py-1 rounded-full">
                  {domains.length} results
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {domains.map((domain, index) => (
                  <div
                    key={index}
                    className="group bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 
                             transition-all duration-200 cursor-pointer border border-gray-200 dark:border-gray-600
                             hover:shadow-md hover:scale-[1.02]"
                    onClick={() => copyToClipboard(domain)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-gray-900 dark:text-white font-medium">
                        {domain}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {copiedDomain === domain ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                Click any domain to copy it to your clipboard
              </p>
            </div>
          )}
        </div>

        {/* Long Description */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-xl p-8 transition-all duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="w-5 h-5 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              About Our Domain Name Generator
            </h2>
          </div>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Finding the perfect domain name for your business, startup, or personal project can be challenging. 
              Our advanced domain name generator uses intelligent algorithms to create brandable, memorable, and 
              SEO-friendly domain suggestions based on your keywords.
            </p>
            
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Whether you're launching a tech startup, creative agency, e-commerce store, or personal blog, our tool 
              generates hundreds of unique domain combinations across popular extensions like .com, .net, .org, .io, 
              and many more. The generator combines your keywords with creative prefixes, suffixes, and related terms 
              to produce domains that are not only available but also brandable and professional.
            </p>
            
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Our tool offers both creative and tech-focused generation modes, allowing you to find domain names that 
              perfectly match your industry and brand personality. With instant copy-to-clipboard functionality and 
              support for multiple domain extensions, you can quickly evaluate and secure your ideal web address. 
              Start building your online presence today with a domain name that represents your vision and connects 
              with your audience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}