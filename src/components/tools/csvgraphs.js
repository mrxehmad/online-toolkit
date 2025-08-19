import React, { useState, useCallback, useMemo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Papa from 'papaparse';

const DataVisualizationPlayground = () => {
  const [csvData, setCsvData] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [selectedChart, setSelectedChart] = useState('line');
  const [selectedXAxis, setSelectedXAxis] = useState('');
  const [selectedYAxis, setSelectedYAxis] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const chartTypes = [
    { id: 'line', name: 'Line Chart', icon: '📈' },
    { id: 'area', name: 'Area Chart', icon: '📊' },
    { id: 'bar', name: 'Bar Chart', icon: '📊' },
    { id: 'pie', name: 'Pie Chart', icon: '🥧' }
  ];

  const colors = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#AF52DE', '#5AC8FA', '#FFCC02', '#FF2D92'];

  const handleFileUpload = useCallback((file) => {
    if (!file || file.type !== 'text/csv') {
      alert('Please upload a valid CSV file');
      return;
    }

    setIsLoading(true);
    Papa.parse(file, {
      complete: (result) => {
        if (result.data && result.data.length > 0) {
          const cleanHeaders = result.meta.fields || Object.keys(result.data[0]);
          setHeaders(cleanHeaders);
          setCsvData(result.data);
          if (cleanHeaders.length > 0) {
            setSelectedXAxis(cleanHeaders[0]);
            setSelectedYAxis(cleanHeaders[1] || cleanHeaders[0]);
          }
        }
        setIsLoading(false);
      },
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const processedData = useMemo(() => {
    if (!csvData || !selectedXAxis || !selectedYAxis) return [];
    
    return csvData.filter(row => 
      row[selectedXAxis] !== null && 
      row[selectedXAxis] !== undefined && 
      row[selectedYAxis] !== null && 
      row[selectedYAxis] !== undefined
    ).map(row => ({
      ...row,
      [selectedXAxis]: row[selectedXAxis],
      [selectedYAxis]: typeof row[selectedYAxis] === 'string' ? 
        parseFloat(row[selectedYAxis]) || 0 : row[selectedYAxis]
    }));
  }, [csvData, selectedXAxis, selectedYAxis]);

  const renderChart = () => {
    if (!processedData.length) return null;

    const commonProps = {
      width: '100%',
      height: 400,
      data: processedData,
      margin: { top: 20, right: 30, left: 20, bottom: 60 }
    };

    switch (selectedChart) {
      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
              <XAxis 
                dataKey={selectedXAxis} 
                stroke="#8E8E93"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#8E8E93" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={selectedYAxis} 
                stroke="#007AFF" 
                strokeWidth={3}
                dot={{ fill: '#007AFF', r: 4 }}
                activeDot={{ r: 6, fill: '#007AFF' }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer {...commonProps}>
            <AreaChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
              <XAxis 
                dataKey={selectedXAxis} 
                stroke="#8E8E93"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#8E8E93" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey={selectedYAxis} 
                stroke="#007AFF" 
                fill="rgba(0, 122, 255, 0.3)"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={processedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5EA" />
              <XAxis 
                dataKey={selectedXAxis} 
                stroke="#8E8E93"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="#8E8E93" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Bar 
                dataKey={selectedYAxis} 
                fill="#007AFF"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart>
              <Pie
                data={processedData.slice(0, 10)} // Limit to 10 items for pie chart
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey={selectedYAxis}
                nameKey={selectedXAxis}
              >
                {processedData.slice(0, 10).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* SEO Meta Description */}
      <div className="hidden">
        <h1>Data Visualization Playground - Interactive CSV Chart Generator</h1>
        <meta name="description" content="Free online data visualization tool with iOS design. Upload CSV files and create beautiful interactive charts with Recharts. Line charts, bar charts, pie charts, and area charts. Mobile responsive design for tablets and desktop. Process data securely in your browser - no server uploads required." />
        <meta name="keywords" content="data visualization, CSV charts, interactive charts, recharts, d3.js, data analysis, chart generator, iOS design, responsive charts, mobile charts" />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Transform Your Data Into Beautiful Charts
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your CSV files and create stunning, interactive visualizations instantly. 
            All processing happens securely in your browser - no data leaves your device.
          </p>
        </div>

        {/* Upload Section */}
        {!csvData && (
          <div className="mb-8">
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                isDragOver 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {isLoading ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                  <p className="text-gray-600">Processing your CSV...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <span className="text-white text-2xl">📈</span>
                  </div>
                  <div>
                    <p className="text-xl font-medium text-gray-900 mb-2">
                      Drop your CSV file here or click to browse
                    </p>
                    <p className="text-gray-500">
                      Supports CSV files up to 10MB. Data is processed locally in your browser.
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                    Choose File
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Charts Section */}
        {csvData && (
          <div className="space-y-8">
            {/* Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Chart Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Chart Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Chart Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {chartTypes.map((chart) => (
                      <button
                        key={chart.id}
                        onClick={() => setSelectedChart(chart.id)}
                        className={`p-3 rounded-xl text-left transition-all ${
                          selectedChart === chart.id
                            ? 'bg-blue-500 text-white shadow-md'
                            : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{chart.icon}</span>
                          <span className="text-sm font-medium">{chart.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* X-Axis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">X-Axis</label>
                  <select
                    value={selectedXAxis}
                    onChange={(e) => setSelectedXAxis(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {headers.map((header) => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>

                {/* Y-Axis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Y-Axis</label>
                  <select
                    value={selectedYAxis}
                    onChange={(e) => setSelectedYAxis(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {headers.map((header) => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reset Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setCsvData(null);
                    setHeaders([]);
                    setSelectedXAxis('');
                    setSelectedYAxis('');
                  }}
                  className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl font-medium transition-colors"
                >
                  🗑️ Clear Data
                </button>
              </div>
            </div>

            {/* Chart Display */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {chartTypes.find(chart => chart.id === selectedChart)?.name}
                </h3>
                <div className="text-sm text-gray-500">
                  {processedData.length} data points
                </div>
              </div>
              
              {processedData.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  {renderChart()}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No valid data to display. Please check your CSV file and column selections.</p>
                </div>
              )}
            </div>

            {/* Data Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Preview</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {headers.slice(0, 5).map((header) => (
                        <th key={header} className="text-left py-2 px-4 font-medium text-gray-700">
                          {header}
                        </th>
                      ))}
                      {headers.length > 5 && <th className="text-left py-2 px-4 text-gray-500">...</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {csvData.slice(0, 5).map((row, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        {headers.slice(0, 5).map((header) => (
                          <td key={header} className="py-2 px-4 text-gray-600">
                            {String(row[header] || '').substring(0, 50)}
                            {String(row[header] || '').length > 50 && '...'}
                          </td>
                        ))}
                        {headers.length > 5 && <td className="py-2 px-4 text-gray-400">...</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {csvData.length > 5 && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Showing 5 of {csvData.length} rows
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 text-xl">🔒</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
            <p className="text-gray-600 text-sm">
              All data processing happens in your browser. Nothing is uploaded to our servers.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-green-600 text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600 text-sm">
              Instant chart generation with smooth interactions and responsive design.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-600 text-xl">📱</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Mobile Optimized</h3>
            <p className="text-gray-600 text-sm">
              Works perfectly on phones, tablets, and desktop. Touch-friendly interface.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600 text-sm">
            <p className="mt-2">Open source • Privacy focused • No data collection</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DataVisualizationPlayground;