import React, { useState, useRef } from 'react';
import { FileText, Upload, Download, Scissors, Merge, Trash2, Eye, AlertCircle, CheckCircle, Loader } from 'lucide-react';

// SEO metadata (would be handled by your site's head management)
export const metadata = {
  title: 'PDF Split & Merge Tool - Free Online PDF Editor | Split & Combine PDFs',
  description: 'Free online PDF split and merge tool. Split large PDFs into separate pages or combine multiple PDFs into one file. Works entirely in your browser - no uploads required. Fast, secure, and easy to use.',
  canonical: '/tools/pdf-split-merge'
};

export default function PDFSplitMergeTool() {
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState('split'); // 'split' or 'merge'
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [splitRanges, setSplitRanges] = useState('');
  const fileInputRef = useRef(null);
  const resultRef = useRef(null);

  const handleFileUpload = async (uploadedFiles) => {
    const newFiles = [];
    
    for (const file of uploadedFiles) {
      if (file.type === 'application/pdf') {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const { PDFDocument } = await import('pdf-lib');
          const pdfDoc = await PDFDocument.load(arrayBuffer);
          const pageCount = pdfDoc.getPageCount();
          
          newFiles.push({
            id: Date.now() + Math.random(),
            file,
            name: file.name,
            size: file.size,
            pageCount,
            arrayBuffer
          });
        } catch (err) {
          setError(`Failed to load ${file.name}: Invalid PDF file`);
        }
      } else {
        setError(`${file.name} is not a PDF file`);
      }
    }
    
    setFiles(prev => [...prev, ...newFiles]);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(droppedFiles);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const moveFile = (fromIndex, toIndex) => {
    const newFiles = [...files];
    const [movedFile] = newFiles.splice(fromIndex, 1);
    newFiles.splice(toIndex, 0, movedFile);
    setFiles(newFiles);
  };

  const parseRanges = (rangesStr, totalPages) => {
    const ranges = [];
    const parts = rangesStr.split(',').map(s => s.trim());
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(s => parseInt(s.trim()));
        if (start >= 1 && end <= totalPages && start <= end) {
          ranges.push({ start: start - 1, end: end - 1 });
        }
      } else {
        const page = parseInt(part);
        if (page >= 1 && page <= totalPages) {
          ranges.push({ start: page - 1, end: page - 1 });
        }
      }
    }
    
    return ranges;
  };

  const splitPDF = async () => {
    if (files.length !== 1) {
      setError('Please select exactly one PDF file for splitting');
      return;
    }

    const file = files[0];
    const ranges = parseRanges(splitRanges, file.pageCount);
    
    if (ranges.length === 0) {
      setError('Please enter valid page ranges (e.g., "1-3, 5, 7-10")');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const originalDoc = await PDFDocument.load(file.arrayBuffer);
      const results = [];

      for (let i = 0; i < ranges.length; i++) {
        const { start, end } = ranges[i];
        const newDoc = await PDFDocument.create();
        
        for (let pageIndex = start; pageIndex <= end; pageIndex++) {
          const [copiedPage] = await newDoc.copyPages(originalDoc, [pageIndex]);
          newDoc.addPage(copiedPage);
        }
        
        const pdfBytes = await newDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const pageRange = start === end ? `page-${start + 1}` : `pages-${start + 1}-to-${end + 1}`;
        const filename = `${file.name.replace('.pdf', '')}-${pageRange}.pdf`;
        
        results.push({
          blob,
          filename,
          pageCount: end - start + 1
        });
      }

      setResult({ type: 'split', files: results });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setError('Failed to split PDF: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files for merging');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const mergedDoc = await PDFDocument.create();
      
      for (const file of files) {
        const doc = await PDFDocument.load(file.arrayBuffer);
        const pageIndices = Array.from(Array(doc.getPageCount()).keys());
        const copiedPages = await mergedDoc.copyPages(doc, pageIndices);
        copiedPages.forEach(page => mergedDoc.addPage(page));
      }
      
      const pdfBytes = await mergedDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const totalPages = files.reduce((sum, f) => sum + f.pageCount, 0);
      
      setResult({
        type: 'merge',
        blob,
        filename: `merged-document-${Date.now()}.pdf`,
        pageCount: totalPages
      });
      
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (err) {
      setError('Failed to merge PDFs: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const downloadFile = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            PDF Split & Merge
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Split large PDF files into separate documents or merge multiple PDFs into one file. 
            Everything happens in your browser - no uploads, completely secure and private.
          </p>
        </div>

        {/* Main Tool Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          {/* Mode Selection */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={() => {setMode('split'); setFiles([]); setResult(null); setError(null);}}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                mode === 'split'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Scissors className="h-6 w-6" />
                <span className="font-semibold">Split PDF</span>
              </div>
              <p className="text-sm opacity-75">Extract specific pages from a PDF</p>
            </button>
            
            <button
              onClick={() => {setMode('merge'); setFiles([]); setResult(null); setError(null);}}
              className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                mode === 'merge'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-center gap-3 mb-2">
                <Merge className="h-6 w-6" />
                <span className="font-semibold">Merge PDFs</span>
              </div>
              <p className="text-sm opacity-75">Combine multiple PDFs into one</p>
            </button>
          </div>

          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors mb-6"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <Upload className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Drop PDF files here or click to browse
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {mode === 'split' ? 'Select one PDF file to split' : 'Select multiple PDF files to merge'}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple={mode === 'merge'}
              onChange={(e) => handleFileUpload(Array.from(e.target.files))}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Choose Files
            </button>
          </div>

          {/* Split Options */}
          {mode === 'split' && files.length === 1 && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Page Ranges (e.g., "1-3, 5, 7-10")
              </label>
              <input
                type="text"
                value={splitRanges}
                onChange={(e) => setSplitRanges(e.target.value)}
                placeholder="Enter page ranges to extract"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Total pages in PDF: {files[0].pageCount}
              </p>
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Selected Files:</h3>
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 dark:text-white truncate">{file.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatFileSize(file.size)} • {file.pageCount} pages
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {mode === 'merge' && files.length > 1 && (
                        <>
                          <button
                            onClick={() => index > 0 && moveFile(index, index - 1)}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => index < files.length - 1 && moveFile(index, index + 1)}
                            disabled={index === files.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                          >
                            ↓
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Process Button */}
          <button
            onClick={mode === 'split' ? splitPDF : mergePDFs}
            disabled={processing || files.length === 0 || (mode === 'split' && (!splitRanges || files.length !== 1)) || (mode === 'merge' && files.length < 2)}
            className={`w-full py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-3 ${
              processing || files.length === 0 || (mode === 'split' && (!splitRanges || files.length !== 1)) || (mode === 'merge' && files.length < 2)
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : mode === 'split'
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {processing ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {mode === 'split' ? <Scissors className="h-5 w-5" /> : <Merge className="h-5 w-5" />}
                {mode === 'split' ? 'Split PDF' : 'Merge PDFs'}
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {result && (
          <div ref={resultRef} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {result.type === 'split' ? 'PDF Split Complete!' : 'PDF Merge Complete!'}
              </h2>
            </div>

            {result.type === 'split' ? (
              <div className="space-y-3">
                {result.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{file.filename}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{file.pageCount} pages</p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadFile(file.blob, file.filename)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{result.filename}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{result.pageCount} total pages</p>
                  </div>
                </div>
                <button
                  onClick={() => downloadFile(result.blob, result.filename)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl"
                >
                  <Download className="h-5 w-5" />
                  Download Merged PDF
                </button>
              </div>
            )}
          </div>
        )}

        {/* SEO Description */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            About PDF Split & Merge Tool
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Our free PDF Split & Merge tool provides a powerful, secure solution for managing your PDF documents directly in your browser. 
              Whether you need to extract specific pages from large documents or combine multiple PDFs into a single file, our tool handles 
              everything client-side without requiring uploads to external servers.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">Key Features:</h3>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2 mb-6">
              <li><strong>Split PDFs:</strong> Extract specific pages or page ranges from any PDF document</li>
              <li><strong>Merge PDFs:</strong> Combine multiple PDF files into a single document with custom order</li>
              <li><strong>100% Client-Side:</strong> Your files never leave your computer - complete privacy and security</li>
              <li><strong>No File Size Limits:</strong> Process PDFs of any size without restrictions</li>
              <li><strong>Batch Processing:</strong> Handle multiple files efficiently</li>
              <li><strong>Mobile Friendly:</strong> Works perfectly on phones, tablets, and desktop computers</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">How to Use:</h3>
            <div className="text-gray-600 dark:text-gray-300 space-y-2 mb-6">
              <p><strong>For Splitting:</strong> Upload one PDF, specify page ranges (e.g., "1-3, 5, 7-10"), and download individual files.</p>
              <p><strong>For Merging:</strong> Upload multiple PDFs, arrange them in your desired order, and download the combined document.</p>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Perfect for students, professionals, and anyone who works with PDF documents regularly. Split large presentations, 
              combine reports, or reorganize document pages with ease. Our tool uses advanced PDF processing libraries to ensure 
              your documents maintain their quality and formatting throughout the process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}