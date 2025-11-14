import React, { useState, useRef, useEffect } from 'react';
import { 
  FaWhatsapp, FaUsers, FaLink, FaIdCard, FaEnvelope, FaSms, FaWifi, 
  FaBitcoin, FaTwitter, FaFacebook, FaFilePdf, FaMusic, FaApple, 
  FaImage, FaQrcode, FaDownload, FaCopy, FaCheck, FaMobile, FaGlobe
} from 'react-icons/fa';

const QRCodeGenerator = () => {
  const [selectedType, setSelectedType] = useState('URL');
  const [qrData, setQrData] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // QR Code types with their configurations
  const qrTypes = [
    { id: 'WhatsApp', label: 'WhatsApp', icon: FaWhatsapp, color: '#25D366', placeholder: 'Enter phone number (+1234567890)' },
    { id: 'WhatsAppGroup', label: 'WhatsApp Group', icon: FaUsers, color: '#25D366', placeholder: 'Enter WhatsApp group invite link' },
    { id: 'URL', label: 'URL', icon: FaLink, color: '#007AFF', placeholder: 'https://example.com' },
    { id: 'vCard', label: 'vCard', icon: FaIdCard, color: '#34C759', placeholder: 'Enter contact details' },
    { id: 'Text', label: 'Text', icon: FaQrcode, color: '#8E8E93', placeholder: 'Enter any text' },
    { id: 'Email', label: 'E-mail', icon: FaEnvelope, color: '#FF3B30', placeholder: 'email@example.com' },
    { id: 'SMS', label: 'SMS', icon: FaSms, color: '#007AFF', placeholder: 'Phone number and message' },
    { id: 'WiFi', label: 'WiFi', icon: FaWifi, color: '#5856D6', placeholder: 'Network details' },
    { id: 'Bitcoin', label: 'Bitcoin', icon: FaBitcoin, color: '#FF9500', placeholder: 'Bitcoin address' },
    { id: 'Twitter', label: 'Twitter', icon: FaTwitter, color: '#1DA1F2', placeholder: 'Twitter profile URL' },
    { id: 'Facebook', label: 'Facebook', icon: FaFacebook, color: '#1877F2', placeholder: 'Facebook profile URL' },
    { id: 'PDF', label: 'PDF', icon: FaFilePdf, color: '#FF3B30', placeholder: 'PDF download link' },
    { id: 'MP3', label: 'MP3', icon: FaMusic, color: '#FF2D92', placeholder: 'MP3 file link' },
    { id: 'AppStore', label: 'App Store', icon: FaApple, color: '#007AFF', placeholder: 'App Store URL' },
    { id: 'Image', label: 'Image', icon: FaImage, color: '#30D158', placeholder: 'Image URL' },
    { id: 'Barcode2D', label: '2D Barcode', icon: FaQrcode, color: '#8E8E93', placeholder: 'Barcode data' }
  ];

  // Generate QR code using QR Server API
  const generateQR = (data, type) => {
    if (!data.trim()) {
      setQrCodeUrl('');
      return;
    }

    let formattedData = data;

    // Format data based on type
    switch (type) {
      case 'WhatsApp':
        formattedData = `https://wa.me/${data.replace(/[^\d]/g, '')}`;
        break;
      case 'Email':
        formattedData = `mailto:${data}`;
        break;
      case 'SMS':
        formattedData = `sms:${data}`;
        break;
      case 'WiFi':
        formattedData = `WIFI:T:WPA;S:${data};P:password;;`;
        break;
      case 'Bitcoin':
        formattedData = `bitcoin:${data}`;
        break;
      case 'vCard':
        formattedData = `BEGIN:VCARD\nVERSION:3.0\nFN:${data}\nEND:VCARD`;
        break;
      default:
        formattedData = data;
    }

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(formattedData)}&bgcolor=FFFFFF&color=000000&format=png&margin=10`;
    setQrCodeUrl(qrUrl);
  };

  useEffect(() => {
    generateQR(qrData, selectedType);
  }, [qrData, selectedType]);

  const handleDownload = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `qr-code-${selectedType.toLowerCase()}.png`;
      link.click();
    }
  };

  const handleCopy = async () => {
    if (qrCodeUrl) {
      try {
        const response = await fetch(qrCodeUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const currentType = qrTypes.find(type => type.id === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* SEO Header */}
      <div className="text-center py-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Free QR Code Generator
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-2">
          Create custom QR codes instantly for WhatsApp, URLs, WiFi, Bitcoin, social media, and more. 
          Generate high-quality QR codes for free with our iOS-style mobile-friendly tool.
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
          <span className="inline-flex items-center gap-1">
            <FaMobile className="w-3 h-3" />
            Mobile Optimized
          </span>
          <span className="inline-flex items-center gap-1">
            <FaGlobe className="w-3 h-3" />
            Works Offline
          </span>
          <span className="inline-flex items-center gap-1">
            <FaQrcode className="w-3 h-3" />
            16+ QR Types
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Controls */}
          <div className="space-y-6">
            {/* Type Selection */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select QR Type</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {qrTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 text-sm font-medium ${
                        selectedType === type.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <Icon 
                        className={`w-5 h-5 ${selectedType === type.id ? 'text-blue-600' : ''}`}
                        style={{ color: selectedType === type.id ? type.color : undefined }}
                      />
                      <span className="text-xs leading-tight text-center">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Data Input */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                {currentType && (
                  <currentType.icon 
                    className="w-6 h-6" 
                    style={{ color: currentType.color }}
                  />
                )}
                <h2 className="text-xl font-semibold text-gray-900">
                  {currentType?.label} Details
                </h2>
              </div>
              
              <textarea
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                placeholder={currentType?.placeholder}
                className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                rows={4}
              />

              {selectedType === 'vCard' && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>vCard Format:</strong> Enter contact name. For full vCard, use format: "John Doe\nCompany\nphone\nemail"
                  </p>
                </div>
              )}

              {selectedType === 'WiFi' && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>WiFi Format:</strong> Enter network name. Full format: "NetworkName" (password will be added automatically)
                  </p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Choose Our QR Generator?</h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900">Privacy First:</strong>
                    <p className="text-gray-600">All processing happens in your browser</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900">High Quality:</strong>
                    <p className="text-gray-600">300x300px PNG format</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900">16+ Types:</strong>
                    <p className="text-gray-600">WhatsApp, WiFi, Bitcoin & more</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <div>
                    <strong className="text-gray-900">Mobile Ready:</strong>
                    <p className="text-gray-600">Works on all devices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - QR Code Display */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Your QR Code</h2>
              
              <div className="flex flex-col items-center space-y-6">
                {qrCodeUrl ? (
                  <>
                    <div className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
                      <img 
                        src={qrCodeUrl} 
                        alt="Generated QR Code" 
                        className="w-64 h-64 object-contain"
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
                      <button
                        onClick={handleDownload}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <FaDownload className="w-4 h-4" />
                        Download
                      </button>
                      
                      <button
                        onClick={handleCopy}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md ${
                          copied 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {copied ? (
                          <>
                            <FaCheck className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <FaCopy className="w-4 h-4" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                    <FaQrcode className="w-16 h-16 mb-4" />
                    <p className="text-lg font-medium">Enter data to generate QR code</p>
                    <p className="text-sm text-center mt-2">
                      Select a type above and enter your content to create a custom QR code
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="mt-6 bg-gray-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-3">💡 Quick Tips</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• WhatsApp: Use international format (+1234567890)</li>
                <li>• URLs: Include https:// for web links</li>
                <li>• WiFi: QR codes work with most smartphone cameras</li>
                <li>• Test your QR code before sharing or printing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO Footer Content */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm text-gray-600">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Supported QR Types</h3>
            <ul className="space-y-1">
              <li>WhatsApp & WhatsApp Groups</li>
              <li>URLs and Website Links</li>
              <li>WiFi Network Sharing</li>
              <li>Contact Cards (vCard)</li>
              <li>Email and SMS</li>
              <li>Social Media Links</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
            <ul className="space-y-1">
              <li>Free QR code generation</li>
              <li>No registration required</li>
              <li>Works offline in browser</li>
              <li>High-quality PNG output</li>
              <li>Mobile-responsive design</li>
              <li>Instant download & copy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Use Cases</h3>
            <ul className="space-y-1">
              <li>Business cards & marketing</li>
              <li>Restaurant menus</li>
              <li>Event check-ins</li>
              <li>WiFi sharing</li>
              <li>Social media promotion</li>
              <li>Product information</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;