import React, { useState, useCallback } from 'react';
import { Upload, Download, FileText, Database, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import * as Papa from 'papaparse';

const CSVConverter = () => {
  const [file, setFile] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [jsonData, setJsonData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = useCallback((event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile && uploadedFile.type === 'text/csv') {
      setFile(uploadedFile);
      setError(null);
      setSuccess(false);
      processCSV(uploadedFile);
    } else {
      setError('Please select a valid CSV file');
    }
  }, []);

  const processCSV = (file) => {
    setIsProcessing(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (result) => {
        if (result.errors.length > 0) {
          setError('Error parsing CSV: ' + result.errors[0].message);
        } else {
          setCsvData(result.data);
          setJsonData(JSON.stringify(result.data, null, 2));
          setSuccess(true);
        }
        setIsProcessing(false);
      },
      error: (error) => {
        setError('Failed to parse CSV file: ' + error.message);
        setIsProcessing(false);
      }
    });
  };

  const downloadJSON = () => {
    if (!jsonData) return;
    
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace('.csv', '.json');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadExcel = () => {
    if (!csvData) return;
    
    // Create CSV content for Excel compatibility
    const csvContent = Papa.unparse(csvData, {
      quotes: true,
      header: true
    });
    
    const blob = new Blob(['\uFEFF' + csvContent], { 
      type: 'application/vnd.ms-excel;charset=utf-8' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace('.csv', '.xlsx');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setFile(null);
    setCsvData(null);
    setJsonData(null);
    setError(null);
    setSuccess(false);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            CSV to JSON & Excel Converter
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Free online tool to convert CSV files to JSON or Excel format instantly. 
            Process files securely in your browser with no server uploads required.
          </p>
          <div className="flex flex-wrap gap-2 text-sm text-gray-500">
            <span className="bg-gray-100 px-3 py-1 rounded-full">#CSV</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">#JSON</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">#Excel</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">#DataConverter</span>
            <span className="bg-gray-100 px-3 py-1 rounded-full">#OnlineTool</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Upload Your CSV File
            </h2>
            <p className="text-gray-600 mb-6">
              Select a CSV file to convert to JSON or Excel format
            </p>
            
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isProcessing}
              />
              <div className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-8 py-4 rounded-xl font-medium transition-colors duration-200 inline-flex items-center gap-3">
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Choose CSV File
                  </>
                )}
              </div>
            </div>
          </div>

          {file && (
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-700">
                File processed successfully! {csvData?.length} rows converted.
              </p>
            </div>
          )}
        </div>

        {/* Download Section */}
        {success && csvData && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Download Converted Files
            </h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={downloadJSON}
                className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-xl font-medium transition-colors duration-200"
              >
                <Database className="w-5 h-5" />
                Download JSON
              </button>
              
              <button
                onClick={downloadExcel}
                className="flex items-center justify-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-xl font-medium transition-colors duration-200"
              >
                <Download className="w-5 h-5" />
                Download Excel
              </button>
            </div>

            <button
              onClick={reset}
              className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors duration-200"
            >
              Convert Another File
            </button>
          </div>
        )}

        {/* Preview Section */}
        {jsonData && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              JSON Preview
            </h3>
            <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-auto">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                {jsonData.substring(0, 2000)}
                {jsonData.length > 2000 && '...'}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* SEO Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About CSV to JSON/Excel Converter
              </h3>
              <p className="text-gray-600 mb-4">
                Our free online CSV converter helps you transform CSV (Comma-Separated Values) 
                files into JSON (JavaScript Object Notation) or Excel-compatible formats. 
                Perfect for developers, data analysts, and anyone working with structured data.
              </p>
              <p className="text-gray-600">
                All processing happens locally in your browser - your data never leaves your device, 
                ensuring complete privacy and security.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Key Features
              </h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Convert CSV to JSON instantly</li>
                <li>• Export to Excel-compatible format</li>
                <li>• 100% client-side processing</li>
                <li>• No file size limits</li>
                <li>• Mobile-friendly interface</li>
                <li>• Free and no registration required</li>
                <li>• Support for large datasets</li>
                <li>• Real-time preview</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
            <p>
              CSV to JSON & Excel Converter - Free Online Data Conversion Tool | 
              Convert CSV files to JSON or Excel format securely in your browser
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CSVConverter;