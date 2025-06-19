import React, { useState } from 'react';
import { Input, Select, Button, Divider } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import { useTheme } from '../../context/ThemeContext';

const { TextArea } = Input;
const { Option } = Select;

const GoogleDorkGenerator = () => {
  const { darkMode } = useTheme();
  const [site, setSite] = useState('');
  const [filetype, setFiletype] = useState('');
  const [intitle, setIntitle] = useState('');
  const [inurl, setInurl] = useState('');
  const [intext, setIntext] = useState('');
  const [dorkQuery, setDorkQuery] = useState('');

  const fileTypes = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
    'csv',
    'xml',
    'json',
    'sql',
    'php',
    'asp',
    'aspx',
    'jsp',
    'html',
    'htm',
    'log'
  ];

  const generateDork = () => {
    let query = '';
    const parts = [];

    if (site) parts.push(`site:${site}`);
    if (filetype) parts.push(`filetype:${filetype}`);
    if (intitle) parts.push(`intitle:${intitle}`);
    if (inurl) parts.push(`inurl:${inurl}`);
    if (intext) parts.push(`intext:${intext}`);

    query = parts.join(' ');
    setDorkQuery(query);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(dorkQuery);
  };

  return (
    <div className={`min-h-screen p-8 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Google Dork Generator</h1>
        
        <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Site</label>
              <Input
                value={site}
                onChange={(e) => setSite(e.target.value)}
                placeholder="example.com"
                className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">File Type</label>
              <Select
                value={filetype}
                onChange={setFiletype}
                style={{ width: '100%' }}
                placeholder="Select file type"
                className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              >
                {fileTypes.map(type => (
                  <Option key={type} value={type}>
                    {type}
                  </Option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title Contains</label>
              <Input
                value={intitle}
                onChange={(e) => setIntitle(e.target.value)}
                placeholder="Keywords in title"
                className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">URL Contains</label>
              <Input
                value={inurl}
                onChange={(e) => setInurl(e.target.value)}
                placeholder="Keywords in URL"
                className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Text Contains</label>
              <Input
                value={intext}
                onChange={(e) => setIntext(e.target.value)}
                placeholder="Keywords in text"
                className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
              />
            </div>

            <Button 
              type="primary" 
              onClick={generateDork}
              className={`w-full ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
            >
              Generate Dork Query
            </Button>

            {dorkQuery && (
              <div>
                <Divider />
                <label className="block text-sm font-medium mb-2">Generated Dork Query</label>
                <div className="space-y-4">
                  <TextArea
                    value={dorkQuery}
                    readOnly
                    className={`${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                  />
                  <Button
                    icon={<CopyOutlined />}
                    onClick={copyToClipboard}
                    className={`${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleDorkGenerator; 