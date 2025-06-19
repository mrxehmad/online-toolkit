import React, { useState } from 'react';
import { Input, Button, Upload, message, Radio } from 'antd';
import { UploadOutlined, CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { useTheme } from '../../context/ThemeContext';

const { TextArea } = Input;
// const { Text } = Typography;

const Base64FileConverter = () => {
  const { darkMode } = useTheme();
  const [inputText, setInputText] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
  const [fileName, setFileName] = useState('');

  const handleTextToBase64 = () => {
    try {
      if (!inputText.trim()) {
        setError('Please enter some text or upload a file');
        return;
      }
      if (mode === 'encode') {
        const base64 = btoa(unescape(encodeURIComponent(inputText)));
        setBase64Output(base64);
      } else {
        try {
          const decoded = decodeURIComponent(escape(atob(inputText)));
          setBase64Output(decoded);
        } catch (err) {
          setError('Invalid Base64 input');
          return;
        }
      }
      setError('');
    } catch (err) {
      setError('Error converting: ' + err.message);
    }
  };

  const handleFileUpload = async (file) => {
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (mode === 'encode') {
          const base64 = e.target.result.split(',')[1];
          setBase64Output(base64);
          setFileName(file.name);
        } else {
          try {
            const base64Data = e.target.result.split(',')[1];
            const binary = atob(base64Data);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) {
              bytes[i] = binary.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: file.type });
            const url = URL.createObjectURL(blob);
            setBase64Output(url);
            setFileName(file.name);
          } catch (err) {
            setError('Invalid Base64 file');
            return;
          }
        }
        setError('');
      };
      reader.readAsDataURL(file);
      return false;
    } catch (err) {
      setError('Error processing file: ' + err.message);
    }
  };

  const copyToClipboard = () => {
    if (mode === 'encode') {
      navigator.clipboard.writeText(base64Output);
      message.success('Copied to clipboard!');
    }
  };

  const downloadFile = () => {
    if (mode === 'decode' && base64Output.startsWith('blob:')) {
      const link = document.createElement('a');
      link.href = base64Output;
      link.download = fileName || 'decoded_file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Base64 File Converter</h1>
        
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Select Mode</label>
              <Radio.Group 
                value={mode} 
                onChange={(e) => {
                  setMode(e.target.value);
                  setBase64Output('');
                  setInputText('');
                  setError('');
                }}
                className="flex space-x-4"
              >
                <Radio.Button 
                  value="encode"
                  className={`${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  Encode
                </Radio.Button>
                <Radio.Button 
                  value="decode"
                  className={`${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  Decode
                </Radio.Button>
              </Radio.Group>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {mode === 'encode' ? 'Input Text' : 'Base64 Input'}
              </label>
              <TextArea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={mode === 'encode' ? 'Enter text to encode' : 'Enter base64 to decode'}
                className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Or Upload a File</label>
              <Upload
                beforeUpload={handleFileUpload}
                showUploadList={false}
                accept="*/*"
              >
                <Button 
                  icon={<UploadOutlined />}
                  className={`${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
                >
                  Upload File
                </Button>
              </Upload>
            </div>

            <Button 
              type="primary" 
              onClick={handleTextToBase64}
              className={`w-full ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
            >
              {mode === 'encode' ? 'Convert to Base64' : 'Convert from Base64'}
            </Button>

            {error && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
                {error}
              </div>
            )}

            {base64Output && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  {mode === 'encode' ? 'Base64 Output' : 'Decoded Output'}
                </label>
                <div className="space-y-4">
                  {mode === 'encode' ? (
                    <>
                      <TextArea
                        value={base64Output}
                        readOnly
                        className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                        autoSize={{ minRows: 3, maxRows: 6 }}
                      />
                      <Button
                        icon={<CopyOutlined />}
                        onClick={copyToClipboard}
                        className={`${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
                      >
                        Copy
                      </Button>
                    </>
                  ) : (
                    <>
                      {base64Output.startsWith('blob:') ? (
                        <Button
                          icon={<DownloadOutlined />}
                          onClick={downloadFile}
                          className={`${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
                        >
                          Download File
                        </Button>
                      ) : (
                        <TextArea
                          value={base64Output}
                          readOnly
                          className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                          autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Base64FileConverter; 