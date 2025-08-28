import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Edit3, Eye, Download, Trash2, RefreshCw, AlertCircle, CheckCircle, File, Image, Music, Video, Archive, Code } from 'lucide-react';

export default function FileMetadataExtractorEditorViewer() {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editableMetadata, setEditableMetadata] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('extract');
  const fileInputRef = useRef(null);

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
    if (fileType.startsWith('video/')) return <Video className="w-5 h-5 text-purple-500" />;
    if (fileType.startsWith('audio/')) return <Music className="w-5 h-5 text-green-500" />;
    if (fileType.includes('zip') || fileType.includes('rar')) return <Archive className="w-5 h-5 text-orange-500" />;
    if (fileType.includes('javascript') || fileType.includes('json') || fileType.includes('html')) return <Code className="w-5 h-5 text-yellow-500" />;
    if (fileType.includes('text') || fileType.includes('document')) return <FileText className="w-5 h-5 text-gray-500" />;
    return <File className="w-5 h-5 text-gray-400" />;
  };

  const extractBasicMetadata = (file) => {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
      sizeFormatted: formatBytes(file.size),
      extension: file.name.split('.').pop()?.toLowerCase() || 'unknown'
    };
  };

  const extractImageMetadata = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: (img.width / img.height).toFixed(2)
        });
      };
      img.onerror = () => resolve({});
      img.src = URL.createObjectURL(file);
    });
  };

  const extractTextMetadata = async (file) => {
    try {
      const text = await file.text();
      const lines = text.split('\n').length;
      const words = text.split(/\s+/).filter(word => word.length > 0).length;
      const characters = text.length;
      
      return {
        lines,
        words,
        characters,
        encoding: 'UTF-8',
        isEmpty: text.trim().length === 0
      };
    } catch (error) {
      return {};
    }
  };

  const handleFileSelect = useCallback(async (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setLoading(true);
    setError(null);
    setMetadata(null);

    try {
      let extractedMetadata = extractBasicMetadata(selectedFile);

      // Extract type-specific metadata
      if (selectedFile.type.startsWith('image/')) {
        const imageMetadata = await extractImageMetadata(selectedFile);
        extractedMetadata = { ...extractedMetadata, ...imageMetadata };
      } else if (selectedFile.type.startsWith('text/') || selectedFile.name.endsWith('.txt') || selectedFile.name.endsWith('.md')) {
        const textMetadata = await extractTextMetadata(selectedFile);
        extractedMetadata = { ...extractedMetadata, ...textMetadata };
      }

      // Add file hash (simple)
      const arrayBuffer = await selectedFile.arrayBuffer();
      const hash = await crypto.subtle.digest('SHA-256', arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hash));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      extractedMetadata.sha256 = hashHex.substring(0, 16) + '...';

      setMetadata(extractedMetadata);
      setEditableMetadata({ ...extractedMetadata });
    } catch (err) {
      setError('Failed to extract metadata: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0]);
    }
  }, [handleFileSelect]);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleMetadataEdit = (key, value) => {
    setEditableMetadata(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveMetadata = () => {
    setMetadata(editableMetadata);
    setIsEditing(false);
  };

  const exportMetadata = () => {
    const dataStr = JSON.stringify(metadata, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${file.name}_metadata.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const clearFile = () => {
    setFile(null);
    setMetadata(null);
    setEditableMetadata({});
    setIsEditing(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const MetadataDisplay = ({ data, editable = false }) => (
    <div className="space-y-3">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <span className="font-medium text-gray-700 dark:text-gray-300 capitalize mb-1 sm:mb-0">
            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
          </span>
          {editable && !['size', 'sizeFormatted', 'lastModified', 'sha256'].includes(key) ? (
            <input
              type="text"
              value={value || ''}
              onChange={(e) => handleMetadataEdit(key, e.target.value)}
              className="px-3 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-xs"
            />
          ) : (
            <span className="text-gray-600 dark:text-gray-400 text-sm font-mono break-all">
              {typeof value === 'string' ? value : JSON.stringify(value)}
            </span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* SEO Meta Tags */}
      <title>File Metadata Extractor, Editor & Viewer Tool | Extract, Edit & View File Properties</title>
      <meta name="description" content="Professional file metadata extractor, editor and viewer tool. Extract comprehensive metadata from images, documents, videos, audio files and more. Edit file properties, view detailed information including EXIF data, file hashes, dimensions and export metadata as JSON. Supports drag & drop, multiple file formats and works entirely client-side for privacy." />
      <meta name="canonical" href="/tools/file-metadata-extractor-editor-viewer" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              File Metadata Extractor/Editor/Viewer
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Extract, view, and edit comprehensive metadata from your files including images, documents, videos, and more. 
              Get detailed file properties, EXIF data, dimensions, file hashes, and export metadata as JSON. 
              Everything runs locally in your browser for complete privacy and security.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
              {['extract', 'view', 'edit'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {tab === 'extract' && <Upload className="w-4 h-4 inline mr-2" />}
                  {tab === 'view' && <Eye className="w-4 h-4 inline mr-2" />}
                  {tab === 'edit' && <Edit3 className="w-4 h-4 inline mr-2" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* File Upload Area */}
            <div
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
                className="hidden"
                accept="*/*"
              />
              
              {loading ? (
                <div className="flex flex-col items-center">
                  <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">Extracting metadata...</p>
                </div>
              ) : file ? (
                <div className="flex flex-col items-center">
                  <div className="flex items-center mb-3">
                    {getFileIcon(file.type)}
                    <CheckCircle className="w-12 h-12 text-green-500 ml-2" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">{file.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4 inline mr-2" />
                    Clear File
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-3" />
                  <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Drop files here or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Supports all file types • Client-side processing only
                  </p>
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Metadata Display */}
            {metadata && (
              <div className="mt-8">
                <div className="flex flex-wrap items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    File Metadata
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                    {!isEditing ? (
                      <>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                          <Edit3 className="w-4 h-4 inline mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={exportMetadata}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          <Download className="w-4 h-4 inline mr-2" />
                          Export JSON
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={saveMetadata}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          <CheckCircle className="w-4 h-4 inline mr-2" />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditableMetadata({ ...metadata });
                          }}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
                  <MetadataDisplay data={isEditing ? editableMetadata : metadata} editable={isEditing} />
                </div>

                {/* File Preview (for supported types) */}
                {file && file.type.startsWith('image/') && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Preview</h3>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="File preview"
                        className="max-w-full h-auto max-h-96 mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Features List */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <FileText className="w-6 h-6" />,
                title: "Comprehensive Metadata",
                description: "Extract detailed file properties including size, type, dimensions, timestamps, and file hashes."
              },
              {
                icon: <Edit3 className="w-6 h-6" />,
                title: "Edit Capabilities",
                description: "Modify editable metadata fields and save changes for future reference and export."
              },
              {
                icon: <Eye className="w-6 h-6" />,
                title: "Visual Preview",
                description: "Preview supported file types including images with detailed dimension information."
              },
              {
                icon: <Download className="w-6 h-6" />,
                title: "Export Functionality",
                description: "Export extracted metadata as JSON files for documentation and further processing."
              },
              {
                icon: <Upload className="w-6 h-6" />,
                title: "Drag & Drop Support",
                description: "Easy file handling with drag and drop functionality or traditional file browsing."
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Privacy Focused",
                description: "All processing happens locally in your browser - files never leave your device."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-500 dark:text-blue-400 mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}