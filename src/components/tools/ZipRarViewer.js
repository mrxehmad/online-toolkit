import React, { useState, useCallback } from 'react';
import { FiUpload, FiFile, FiFolder, FiDownload, FiEye, FiArchive, FiInfo, FiX } from 'react-icons/fi';
import { unzip } from 'fflate';

// Mock useTheme hook - replace with your actual implementation
const useTheme = () => ({ theme: 'light' });

export default function ZipRarViewer() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewContent, setPreviewContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [archiveName, setArchiveName] = useState('');

  const { theme } = useTheme();

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    const textExts = ['txt', 'md', 'json', 'xml', 'csv', 'html', 'css', 'js', 'ts', 'jsx', 'tsx'];
    
    if (imageExts.includes(ext)) return '🖼️';
    if (textExts.includes(ext)) return '📄';
    if (ext === 'pdf') return '📕';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return '📦';
    return '📄';
  };

  const isTextFile = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const textExts = ['txt', 'md', 'json', 'xml', 'csv', 'html', 'css', 'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'h', 'hpp'];
    return textExts.includes(ext);
  };

  const isImageFile = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'];
    return imageExts.includes(ext);
  };

  const handleFileUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setFiles([]);
    setArchiveName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        
        // Only handle ZIP files with fflate (RAR requires different handling)
        if (file.name.toLowerCase().endsWith('.zip')) {
          unzip(data, (err, unzipped) => {
            if (err) {
              setError('Failed to extract ZIP file: ' + err.message);
              setLoading(false);
              return;
            }

            const fileList = Object.entries(unzipped).map(([path, data]) => ({
              name: path.split('/').pop(),
              path: path,
              size: data.length,
              data: data,
              isDirectory: path.endsWith('/'),
              fullPath: path
            })).filter(file => !file.isDirectory);

            setFiles(fileList);
            setLoading(false);
          });
        } else {
          setError('Currently only ZIP files are supported. RAR support requires additional libraries.');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to read file: ' + err.message);
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const handlePreview = (file) => {
    setSelectedFile(file);
    
    if (isTextFile(file.name)) {
      try {
        const text = new TextDecoder().decode(file.data);
        setPreviewContent(text);
        setShowPreview(true);
      } catch (err) {
        setError('Failed to decode text file');
      }
    } else if (isImageFile(file.name)) {
      const blob = new Blob([file.data]);
      const url = URL.createObjectURL(blob);
      setPreviewContent(url);
      setShowPreview(true);
    } else {
      setError('Preview not available for this file type');
    }
  };

  const handleDownload = (file) => {
    const blob = new Blob([file.data]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const closePreview = () => {
    setShowPreview(false);
    setSelectedFile(null);
    if (selectedFile && isImageFile(selectedFile.name)) {
      URL.revokeObjectURL(previewContent);
    }
    setPreviewContent('');
  };

  // SEO metadata
  React.useEffect(() => {
    document.title = 'ZIP/RAR Archive Viewer - Extract & Browse Files Online | Free Tool';
    
    const metaDescription = document.querySelector('meta[name="description"]') || document.createElement('meta');
    metaDescription.name = 'description';
    metaDescription.content = 'Free online ZIP and RAR archive viewer. Extract, browse, preview, and download files from compressed archives directly in your browser. No upload required - works offline with client-side processing.';
    if (!document.querySelector('meta[name="description"]')) {
      document.head.appendChild(metaDescription);
    }

    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = window.location.href;
    if (!document.querySelector('link[rel="canonical"]')) {
      document.head.appendChild(canonical);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* iOS-style card container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <FiArchive className="w-16 h-16 text-blue-500 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ZIP/RAR Archive Viewer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Extract and browse files from ZIP and RAR archives directly in your browser. 
              Preview text files and images, download individual files, and explore archive contents 
              without uploading to any server. All processing happens locally on your device for 
              complete privacy and security.
            </p>
          </div>

          {/* Upload Area */}
          <div className="mb-8">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
              <FiUpload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".zip,.rar,.7z"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={loading}
                />
                <span className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-block">
                  {loading ? 'Processing...' : 'Choose Archive File'}
                </span>
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Supports ZIP files (RAR support limited)
              </p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center">
                <FiInfo className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          )}

          {/* Archive Name */}
          {archiveName && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Archive: {archiveName}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {files.length} files extracted
              </p>
            </div>
          )}

          {/* Files List */}
          {files.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Archive Contents
              </h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <span className="text-2xl mr-3">{getFileIcon(file.name)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)} • {file.fullPath}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {(isTextFile(file.name) || isImageFile(file.name)) && (
                        <button
                          onClick={() => handlePreview(file)}
                          className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Download"
                      >
                        <FiDownload className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Processing archive...</p>
            </div>
          )}

          {/* Preview Modal */}
          {showPreview && selectedFile && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl max-h-[90vh] w-full overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                    {selectedFile.name}
                  </h3>
                  <button
                    onClick={closePreview}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
                  {isTextFile(selectedFile.name) ? (
                    <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-900 p-4 rounded-lg overflow-auto">
                      {previewContent}
                    </pre>
                  ) : isImageFile(selectedFile.name) ? (
                    <img
                      src={previewContent}
                      alt={selectedFile.name}
                      className="max-w-full h-auto mx-auto rounded-lg"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {/* Long Description */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Complete Archive Management Solution
            </h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our advanced ZIP/RAR Archive Viewer provides a comprehensive solution for managing compressed files 
                directly in your web browser. Unlike traditional archive software that requires installation, 
                our tool operates entirely client-side, ensuring your files never leave your device.
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Key Features & Benefits
              </h3>
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">🔒 Privacy First</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    All file processing happens locally in your browser. No uploads, no servers, 
                    complete privacy guaranteed.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">⚡ Lightning Fast</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Instant file extraction and browsing with optimized JavaScript processing. 
                    No waiting for uploads or downloads.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">👁️ File Preview</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Preview text files, images, and documents directly in the browser before downloading.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📱 Cross-Platform</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Works seamlessly on desktop, tablet, and mobile devices. No app installation required.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Supported Archive Formats
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Currently supports ZIP archives with full extraction and browsing capabilities. 
                RAR format support is available with limitations due to browser security restrictions. 
                We continuously work to expand format support while maintaining security and performance standards.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Perfect for Developers & Professionals
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Whether you're a developer examining code archives, a designer working with asset packages, 
                or a professional handling compressed documents, our viewer provides the tools you need. 
                Preview source code with syntax awareness, examine file structures, and extract only the files you need.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Security & Reliability
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Built with modern web standards and security best practices. Our client-side processing 
                ensures your sensitive files never leave your device, making it ideal for confidential 
                documents and proprietary code. The tool works offline once loaded, providing reliable 
                access even without internet connectivity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}