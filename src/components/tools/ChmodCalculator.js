import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaCopy } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function ChmodCalculator() {
  const { darkMode } = useTheme();
  const [permissions, setPermissions] = useState({
    owner: { r: true, w: true, x: true },
    group: { r: true, w: false, x: true },
    others: { r: true, w: false, x: false }
  });
  const [chmodValue, setChmodValue] = useState('755');
  const [symbolicNotation, setSymbolicNotation] = useState('rwxr-xr--');
  const [copied, setCopied] = useState(false);

  const calculateChmod = useCallback(() => {
    const calculateNumericValue = (perms) => {
      let value = 0;
      if (perms.r) value += 4;
      if (perms.w) value += 2;
      if (perms.x) value += 1;
      return value;
    };

    const ownerValue = calculateNumericValue(permissions.owner);
    const groupValue = calculateNumericValue(permissions.group);
    const othersValue = calculateNumericValue(permissions.others);

    setChmodValue(`${ownerValue}${groupValue}${othersValue}`);

    // Calculate symbolic notation
    const getSymbolic = (perms) => {
      return `${perms.r ? 'r' : '-'}${perms.w ? 'w' : '-'}${perms.x ? 'x' : '-'}`;
    };

    setSymbolicNotation(
      `${getSymbolic(permissions.owner)}${getSymbolic(permissions.group)}${getSymbolic(permissions.others)}`
    );
  }, [permissions]);

  useEffect(() => {
    calculateChmod();
  }, [calculateChmod]);

  const handlePermissionChange = (category, permission) => {
    setPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: !prev[category][permission]
      }
    }));
  };

  const copyToClipboard = () => {
    if (chmodValue) {
      navigator.clipboard.writeText(`chmod ${chmodValue}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Chmod Calculator</h1>
        
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Set Permissions</h2>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="font-semibold">Category</div>
              <div className="text-center">Read (r)</div>
              <div className="text-center">Write (w)</div>
              <div className="text-center">Execute (x)</div>
              
              {['owner', 'group', 'others'].map((category) => (
                <React.Fragment key={category}>
                  <div className="font-semibold capitalize">{category}</div>
                  {['r', 'w', 'x'].map((permission) => (
                    <div key={permission} className="flex justify-center">
                      <input
                        type="checkbox"
                        checked={permissions[category][permission]}
                        onChange={() => handlePermissionChange(category, permission)}
                        className={`w-5 h-5 rounded ${
                          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                        }`}
                      />
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Numeric Value</h3>
                <div className={`p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center justify-between">
                    <code className="text-lg">chmod {chmodValue}</code>
                    <button
                      onClick={copyToClipboard}
                      className={`p-2 rounded-lg ${
                        darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      <FaCopy className={copied ? 'text-green-500' : ''} />
                    </button>
                  </div>
                </div>
                {copied && (
                  <p className="text-green-500 mt-2 text-sm">Copied to clipboard!</p>
                )}
              </div>
              <div>
                <h3 className="font-semibold mb-2">Symbolic Notation</h3>
                <div className={`p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}>
                  <code className="text-lg">{symbolicNotation}</code>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About This Tool</h2>
            <p className="mb-4">
              The <strong>Chmod Calculator</strong> is a simple yet powerful tool designed to help you calculate and understand Linux file permissions using the <code>chmod</code> (change mode) command. Whether you're managing files on a server, setting up a development environment, or learning about Linux permissions, this tool makes it easy to determine the correct numeric or symbolic <code>chmod</code> value for your files and directories.
            </p>

            <h3 className="text-lg font-semibold mb-2">How It Works:</h3>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                <strong>Set Permissions</strong>:
                <ul className="list-disc pl-6 mt-2">
                  <li>Use the checkboxes to specify the read (<code>r</code>), write (<code>w</code>), and execute (<code>x</code>) permissions for the <strong>owner</strong>, <strong>group</strong>, and <strong>others</strong></li>
                  <li>As you adjust the permissions, the tool automatically calculates the corresponding numeric <code>chmod</code> value (e.g., <code>754</code>)</li>
                </ul>
              </li>
              <li className="mb-2">
                <strong>View Results</strong>:
                <ul className="list-disc pl-6 mt-2">
                  <li>The calculated <code>chmod</code> value is displayed in real-time, making it easy to apply the desired permissions to your files or directories</li>
                </ul>
              </li>
              <li>
                <strong>Use the Cheat Sheet</strong>:
                <ul className="list-disc pl-6 mt-2">
                  <li>A handy <strong>chmod cheat sheet</strong> is included below the calculator to help you understand how permissions are represented numerically and symbolically</li>
                </ul>
              </li>
            </ol>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Chmod Cheat Sheet</h2>
            
            <div className="overflow-x-auto">
              <table className={`w-full border-collapse ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <thead>
                  <tr className={`${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}>
                    <th className="p-3 border">Permission</th>
                    <th className="p-3 border">Symbolic Notation</th>
                    <th className="p-3 border">Numeric Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-3 border">Read</td>
                    <td className="p-3 border"><code>r</code></td>
                    <td className="p-3 border">4</td>
                  </tr>
                  <tr>
                    <td className="p-3 border">Write</td>
                    <td className="p-3 border"><code>w</code></td>
                    <td className="p-3 border">2</td>
                  </tr>
                  <tr>
                    <td className="p-3 border">Execute</td>
                    <td className="p-3 border"><code>x</code></td>
                    <td className="p-3 border">1</td>
                  </tr>
                  <tr>
                    <td className="p-3 border">No Access</td>
                    <td className="p-3 border"><code>-</code></td>
                    <td className="p-3 border">0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-2">Common Numeric Values</h3>
              <div className="overflow-x-auto">
                <table className={`w-full border-collapse ${
                  darkMode ? 'border-gray-600' : 'border-gray-300'
                }`}>
                  <thead>
                    <tr className={`${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      <th className="p-3 border">Numeric Value</th>
                      <th className="p-3 border">Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border"><code>7</code></td>
                      <td className="p-3 border">Full access (<code>rwx</code>)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border"><code>6</code></td>
                      <td className="p-3 border">Read and write (<code>rw-</code>)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border"><code>5</code></td>
                      <td className="p-3 border">Read and execute (<code>r-x</code>)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border"><code>4</code></td>
                      <td className="p-3 border">Read-only (<code>r--</code>)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border"><code>3</code></td>
                      <td className="p-3 border">Write and execute (<code>-wx</code>)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border"><code>2</code></td>
                      <td className="p-3 border">Write-only (<code>-w-</code>)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border"><code>1</code></td>
                      <td className="p-3 border">Execute-only (<code>--x</code>)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border"><code>0</code></td>
                      <td className="p-3 border">No permissions (<code>---</code>)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Example Use Cases</h2>
            <ul className="list-disc pl-6 mb-4">
              <li><strong>File Security</strong>: Restrict access to sensitive files by setting appropriate permissions for the owner, group, and others</li>
              <li><strong>Web Server Configuration</strong>: Ensure that web server files have the correct permissions for execution and access</li>
              <li><strong>Learning Linux</strong>: Understand how <code>chmod</code> works and practice calculating permissions without manually running commands</li>
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Explore More Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Social Media Tools</h3>
                <ul className="space-y-1">
                  <li><Link to="/social-media-analyzer" className="text-indigo-500 hover:underline">Social Media Analyzer</Link> - Gain insights into social media trends</li>
                  <li><Link to="/hashtag-generator" className="text-indigo-500 hover:underline">Hashtag Generator</Link> - Create optimized hashtags</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Finance Tools</h3>
                <ul className="space-y-1">
                  <li><Link to="/mortgage-calculator" className="text-indigo-500 hover:underline">Mortgage Calculator</Link> - Plan your home loan payments</li>
                  <li><Link to="/investment-calculator" className="text-indigo-500 hover:underline">Investment Calculator</Link> - Estimate investment growth</li>
                  <li><Link to="/tax-calculator" className="text-indigo-500 hover:underline">Tax Calculator</Link> - Calculate tax liabilities</li>
                  <li><Link to="/net-income-tax-calculator" className="text-indigo-500 hover:underline">Net Income Tax Calculator</Link> - Determine take-home pay</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Cryptographic Tools</h3>
                <ul className="space-y-1">
                  <li><Link to="/crypto-converter" className="text-indigo-500 hover:underline">Crypto Converter</Link> - Convert cryptocurrencies</li>
                  <li><Link to="/base64-converter" className="text-indigo-500 hover:underline">Base64 Converter</Link> - Encode/decode text</li>
                  <li><Link to="/string-obfuscator" className="text-indigo-500 hover:underline">String Obfuscator</Link> - Protect sensitive strings</li>
                  <li><Link to="/uuid-generator" className="text-indigo-500 hover:underline">UUID Generator</Link> - Generate unique identifiers</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Developer Tools</h3>
                <ul className="space-y-1">
                  <li><Link to="/browser-info-detector" className="text-indigo-500 hover:underline">Browser Info Detector</Link> - Get browser details</li>
                  <li><Link to="/code-formatter" className="text-indigo-500 hover:underline">Code Formatter</Link> - Beautify your code</li>
                  <li><Link to="/json-validator" className="text-indigo-500 hover:underline">JSON Validator</Link> - Validate JSON data</li>
                  <li><Link to="/curl-generator" className="text-indigo-500 hover:underline">cURL Generator</Link> - Generate API requests</li>
                  <li><Link to="/markdown-to-html" className="text-indigo-500 hover:underline">Markdown to HTML</Link> - Convert Markdown</li>
                  <li><Link to="/pihole-regex-generator" className="text-indigo-500 hover:underline">Pi-hole Regex Generator</Link> - Create ad-blocking patterns</li>
                  <li><Link to="/crontab-generator" className="text-indigo-500 hover:underline">Crontab Generator</Link> - Schedule tasks</li>
                  <li><Link to="/yaml-formatter" className="text-indigo-500 hover:underline">YAML Formatter</Link> - Format YAML files</li>
                  <li><Link to="/port-generator" className="text-indigo-500 hover:underline">Port Generator</Link> - Generate random ports</li>
                  <li><Link to="/docker-converter" className="text-indigo-500 hover:underline">Docker Converter</Link> - Simplify Dockerfile creation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChmodCalculator; 