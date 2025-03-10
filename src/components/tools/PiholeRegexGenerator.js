import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaRegCopy, FaInfoCircle } from 'react-icons/fa';

function PiholeRegexGenerator() {
  const { darkMode } = useTheme();
  const [domainInput, setDomainInput] = useState('');
  const [generatedRegex, setGeneratedRegex] = useState('');
  const [regexType, setRegexType] = useState('exact');
  const [copySuccess, setCopySuccess] = useState('');
  const [error, setError] = useState('');
  const [multiDomainInput, setMultiDomainInput] = useState('');
  const [tldInput, setTldInput] = useState('com,org,net');
  const [queryType, setQueryType] = useState('');
  const [caseInsensitive, setCaseInsensitive] = useState(false);

  const regexTypes = [
    { value: 'exact', label: 'Exact Match', description: 'Match only the exact domain' },
    { value: 'subdomains', label: 'Include Subdomains', description: 'Match the domain and all its subdomains' },
    { value: 'tld', label: 'TLD Variants', description: 'Match the domain across different TLDs (.com, .org, etc.)' },
    { value: 'keyword', label: 'Keyword Match', description: 'Match any domain containing the keyword' },
    { value: 'multi-domain-tld', label: 'Multi-Domain with TLDs', description: 'Block multiple domains with various TLDs (e.g., facebook, instagram across multiple TLDs)' },
    { value: 'case-insensitive', label: 'Case Insensitive Match', description: 'Match domains regardless of case (e.g., TikTok, tiktok, TIKTOK)' },
    { value: 'query-type', label: 'Query Type Filter', description: 'Filter by DNS query type (e.g., block HTTPS queries for specific domains)' },
    { value: 'wildcard', label: 'Wildcard Match', description: 'Use wildcard pattern for matching domains' },
  ];

  const generateRegex = () => {
    setError('');
    setCopySuccess('');
    
    if (regexType === 'multi-domain-tld' && !multiDomainInput.trim()) {
      setError('Please enter comma-separated domains');
      return;
    } else if (regexType !== 'multi-domain-tld' && !domainInput.trim()) {
      setError('Please enter a domain or keyword');
      return;
    }

    try {
      let result = '';
      
      switch (regexType) {
        case 'exact':
          // Exact match
          let domain = domainInput.trim().toLowerCase();
          domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/^www\./, '');
          result = domain; // Pi-hole exact matches don't need regex syntax
          break;
          
        case 'subdomains':
          // Match domain and all subdomains
          let subDomain = domainInput.trim().toLowerCase();
          subDomain = subDomain.replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/^www\./, '');
          const domainParts = subDomain.split('.');
          if (domainParts.length < 2) {
            setError('Please enter a valid domain with at least one dot (e.g., example.com)');
            return;
          }
          const escapedDomainForSub = subDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          result = `(^|\\.)${escapedDomainForSub}$`;
          break;
          
        case 'tld':
          // Match domain across different TLDs
          let tldDomain = domainInput.trim().toLowerCase();
          tldDomain = tldDomain.replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/^www\./, '');
          const baseDomain = tldDomain.split('.')[0];
          if (!baseDomain) {
            setError('Unable to extract base domain name');
            return;
          }
          const escapedBaseDomain = baseDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          result = `^${escapedBaseDomain}\\.[a-z]{2,}$`;
          break;
          
        case 'keyword':
          // Match any domain containing the keyword
          const keyword = domainInput.trim().toLowerCase();
          const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          result = `${escapedKeyword}`;
          break;
          
        case 'multi-domain-tld':
          // Multi-domain with TLDs pattern (like social media platforms)
          const domains = multiDomainInput.trim().split(',').map(d => d.trim()).filter(d => d);
          if (domains.length === 0) {
            setError('Please enter at least one domain');
            return;
          }
          
          const tlds = tldInput.trim().split(',').map(t => t.trim()).filter(t => t);
          if (tlds.length === 0) {
            setError('Please enter at least one TLD');
            return;
          }
          
          const escapedDomains = domains.map(d => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
          const escapedTlds = tlds.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
          
          result = `^(.+\\.)??(${escapedDomains})\\.(${escapedTlds})$`;
          break;
          
        case 'case-insensitive':
          // Case insensitive match
          const caseKeyword = domainInput.trim();
          result = `(?i)${caseKeyword}`;
          break;
          
        case 'query-type':
          // Query type filter
          let queryDomain = domainInput.trim().toLowerCase();
          queryDomain = queryDomain.replace(/^https?:\/\//, '').replace(/\/$/, '').replace(/^www\./, '');
          const escapedQueryDomain = queryDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          
          if (queryType) {
            result = `^.*\\.${escapedQueryDomain}$;querytype=${queryType}`;
          } else {
            result = `^.*\\.${escapedQueryDomain}$`;
          }
          break;
          
        case 'wildcard':
          // Wildcard match
          let wildcardDomain = domainInput.trim().toLowerCase();
          wildcardDomain = wildcardDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
          
          // Convert * to regex pattern
          if (wildcardDomain.startsWith('*.')) {
            // Convert *.example.com to regex
            const basePart = wildcardDomain.substring(2);
            const escapedBasePart = basePart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            result = `^.*\\.${escapedBasePart}$`;
          } else {
            // Just escape the domain
            const escapedWildcardDomain = wildcardDomain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            result = escapedWildcardDomain;
          }
          break;
          
        default:
          result = domainInput.trim();
      }
      
      // Add case insensitive flag if selected (except for case-insensitive type which already has it)
      if (caseInsensitive && regexType !== 'case-insensitive' && result.indexOf('(?i)') !== 0) {
        result = `(?i)${result}`;
      }
      
      setGeneratedRegex(result);
    } catch (err) {
      setError('Error generating regex pattern. Please check your input.');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedRegex);
    setCopySuccess('Copied!');
    setTimeout(() => setCopySuccess(''), 2000);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Pi-hole Regex Generator
          </h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Generate regex patterns for Pi-hole domain blocking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Regex Pattern Type
              </label>
              <select
                value={regexType}
                onChange={(e) => setRegexType(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                {regexTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {regexTypes.find(type => type.value === regexType)?.description}
              </p>
            </div>

            {regexType === 'multi-domain-tld' ? (
              <>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Domains (comma-separated)
                  </label>
                  <textarea
                    value={multiDomainInput}
                    onChange={(e) => setMultiDomainInput(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="facebook,fb,instagram,tiktok"
                    rows={3}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    TLDs (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tldInput}
                    onChange={(e) => setTldInput(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    placeholder="com,org,net,io,co"
                  />
                </div>
              </>
            ) : (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Domain or Keyword
                </label>
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder={regexType === 'wildcard' ? "*.example.com or example.org" : "Enter domain (e.g., example.com) or keyword"}
                />
              </div>
            )}

            {regexType === 'query-type' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Query Type
                </label>
                <select
                  value={queryType}
                  onChange={(e) => setQueryType(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="">Any</option>
                  <option value="A">A (IPv4)</option>
                  <option value="AAAA">AAAA (IPv6)</option>
                  <option value="HTTPS">HTTPS</option>
                  <option value="TXT">TXT</option>
                  <option value="SRV">SRV</option>
                  <option value="PTR">PTR</option>
                  <option value="MX">MX</option>
                </select>
              </div>
            )}

            {regexType !== 'case-insensitive' && (
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="caseInsensitive"
                  checked={caseInsensitive}
                  onChange={(e) => setCaseInsensitive(e.target.checked)}
                  className={`mr-2 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                />
                <label htmlFor="caseInsensitive" className="text-sm">
                  Make pattern case-insensitive
                </label>
              </div>
            )}

            <button
              onClick={generateRegex}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Generate Regex
            </button>

            {error && (
              <p className="mt-2 text-red-500 text-sm">
                {error}
              </p>
            )}
          </div>

          {/* Output Section */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">
                Generated Pattern
              </label>
              {generatedRegex && (
                <button
                  onClick={copyToClipboard}
                  className="flex items-center text-sm text-indigo-500 hover:text-indigo-600"
                >
                  <FaRegCopy className="mr-1" />
                  {copySuccess || 'Copy'}
                </button>
              )}
            </div>
            <div className={`w-full px-3 py-2 rounded-md border font-mono text-sm min-h-[100px] ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'}`}>
              {generatedRegex}
            </div>

            {generatedRegex && (
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <FaInfoCircle className="mr-2 text-indigo-500" />
                  <h3 className="text-sm font-medium">How to use this in Pi-hole</h3>
                </div>
                <ol className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} list-decimal pl-5 space-y-1`}>
                  <li>Log in to your Pi-hole admin interface</li>
                  <li>Navigate to "Domains" under "Group Management"</li>
                  <li>Select the "RegEx filter" tab</li>
                  <li>Add the generated pattern</li>
                  <li>Select whether to blacklist (deny) or whitelist (allow)</li>
                  <li>Add an optional comment to remember what this filter does</li>
                  <li>Click "Add to list"</li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Example Patterns Section */}
        <div className={`mt-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
          <h2 className="text-xl font-semibold mb-4">Example Pi-hole Regex Patterns</h2>
          <div className="overflow-x-auto">
            <table className={`min-w-full ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <thead>
                <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <th className="py-2 px-4 text-left">Pattern</th>
                  <th className="py-2 px-4 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <td className="py-2 px-4 font-mono text-sm">^(.+\.)??(facebook|fb|instagram)\.(com|net|org)$</td>
                  <td className="py-2 px-4">Block Facebook and Instagram domains with subdomains across multiple TLDs</td>
                </tr>
                <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <td className="py-2 px-4 font-mono text-sm">(?i)tiktok</td>
                  <td className="py-2 px-4">Block any domain containing "tiktok" (case insensitive)</td>
                </tr>
                <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <td className="py-2 px-4 font-mono text-sm">(^|\.)(cn)$</td>
                  <td className="py-2 px-4">Block all .cn domains (Chinese TLD)</td>
                </tr>
                <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <td className="py-2 px-4 font-mono text-sm">^.*\.example\.com$;querytype=HTTPS</td>
                  <td className="py-2 px-4">Block only HTTPS queries to example.com and subdomains</td>
                </tr>
                <tr className={`${darkMode ? 'border-gray-700' : 'border-gray-200'} border-b`}>
                  <td className="py-2 px-4 font-mono text-sm">^graph\.(facebook|instagram)\.com$</td>
                  <td className="py-2 px-4">Block graph.facebook.com and graph.instagram.com</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Informational Content */}
        <div className={`mt-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
          <h2 className="text-2xl font-semibold mb-4">Enhance Your Pi-hole Blocking with Regex Patterns</h2>
          <p className="mb-4">
            Pi-hole is a powerful network-level ad and tracker blocking application that acts as a DNS sinkhole. While Pi-hole comes with pre-configured blocklists, using <strong>regex patterns</strong> can significantly enhance your blocking capabilities.
          </p>
          
          <h3 className="text-xl font-semibold mb-2">What is Pi-hole Regex?</h3>
          <p className="mb-4">
            Regular expressions (regex) in Pi-hole allow you to create flexible pattern matching rules for domain blocking. Instead of adding hundreds of individual domains to your blocklist, you can use a single regex pattern to block multiple related domains.
          </p>
          
          <h3 className="text-xl font-semibold mb-2">Benefits of Using Regex in Pi-hole</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Block entire categories of domains with a single rule</li>
            <li>Catch new subdomains automatically without updating your blocklist</li>
            <li>Create more precise blocking rules for specific patterns</li>
            <li>Reduce the size and improve the performance of your blocklist</li>
          </ul>
          
          <h3 className="text-xl font-semibold mb-2">Common Regex Pattern Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h4 className="font-medium mb-2">Exact Domain Match</h4>
              <p className="text-sm">Blocks only the specific domain exactly as entered.</p>
              <p className="text-sm font-mono mt-1">Example: ^example\\.com$</p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h4 className="font-medium mb-2">Subdomain Blocking</h4>
              <p className="text-sm">Blocks a domain and all its subdomains.</p>
              <p className="text-sm font-mono mt-1">Example: (^|\\.)example\\.com$</p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h4 className="font-medium mb-2">TLD Variants</h4>
              <p className="text-sm">Blocks a domain across different top-level domains.</p>
              <p className="text-sm font-mono mt-1">Example: ^example\\.[a-z]&#123;2,&#125;$</p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h4 className="font-medium mb-2">Keyword Blocking</h4>
              <p className="text-sm">Blocks any domain containing the specified keyword.</p>
              <p className="text-sm font-mono mt-1">Example: adserver</p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h4 className="font-medium mb-2">Multi-Domain with TLDs</h4>
              <p className="text-sm">Block multiple domains with various TLDs in one rule.</p>
              <p className="text-sm font-mono mt-1">Example: ^(.+\\.)??(facebook|instagram)\\.(com|net)$</p>
            </div>
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <h4 className="font-medium mb-2">Case Insensitive Match</h4>
              <p className="text-sm">Match domains regardless of letter case.</p>
              <p className="text-sm font-mono mt-1">Example: (?i)tiktok</p>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold mb-2">Tips for Effective Pi-hole Regex</h3>
          <ul className="list-disc pl-6 mb-4">
            <li>Start with specific patterns and test before implementing broader ones</li>
            <li>Be careful with keyword patterns as they may cause false positives</li>
            <li>Use Pi-hole's query log to identify domains that need blocking</li>
            <li>Regularly review your regex filters to ensure they're not blocking legitimate content</li>
            <li>Consider using the whitelist (allow) feature for exceptions to your regex rules</li>
            <li>Add comments to your regex filters to remember their purpose</li>
          </ul>
          
          <p className="mb-4">
            Our <strong>Pi-hole Regex Generator</strong> simplifies the process of creating effective regex patterns, allowing you to enhance your Pi-hole's blocking capabilities without needing to be a regex expert.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PiholeRegexGenerator; 