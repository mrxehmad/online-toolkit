import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import MetaTags from '../MetaTags';

function SocialMediaAnalyzer() {
  const { darkMode } = useTheme();
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [analysis, setAnalysis] = useState(null);

  const platforms = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'linkedin', label: 'LinkedIn' },
  ];

  const analyzePost = (e) => {
    e.preventDefault();
    // Simulated analysis - in a real app, this would call an API
    const mockAnalysis = {
      engagement: Math.floor(Math.random() * 1000) / 10,
      reach: Math.floor(Math.random() * 10000),
      sentiment: ['Positive', 'Neutral', 'Negative'][Math.floor(Math.random() * 3)],
      bestTimeToPost: `${Math.floor(Math.random() * 12) + 1}:00 ${Math.random() > 0.5 ? 'AM' : 'PM'}`,
      hashtags: ['#trending', '#viral', '#content', '#socialmedia'].slice(0, Math.floor(Math.random() * 3) + 2),
      recommendations: [
        'Try posting at different times',
        'Use more engaging hashtags',
        'Include a call to action',
        'Add more visual content'
      ].slice(0, Math.floor(Math.random() * 2) + 2)
    };

    setAnalysis(mockAnalysis);
  };

  return (
    <>
      <MetaTags
        title="Social Media Analytics Tool"
        description="Analyze your social media performance with our comprehensive analytics tool. Track engagement metrics, audience insights, and content performance across multiple platforms."
        keywords={[
          'social media analytics',
          'social media metrics',
          'engagement analysis',
          'audience insights',
          'content performance',
          'social media tracking',
          'social media statistics',
          'social media dashboard',
          'social media monitoring',
          'social media reporting'
        ]}
        canonicalUrl="/social-media-analyzer"
      />
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Social Media Analyzer
            </h1>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Analyze your social media posts for better engagement
            </p>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6 mb-8`}>
            <form onSubmit={analyzePost} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  {platforms.map(p => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Post URL
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                  className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Analyze Post
              </button>
            </form>
          </div>

          {analysis && (
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
              <h2 className={`text-xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Analysis Results
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Engagement Rate</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{analysis.engagement}%</p>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Potential Reach</p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{analysis.reach}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Sentiment Analysis</h3>
                  <p className={`inline-block px-3 py-1 rounded-full text-sm
                    ${analysis.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                      analysis.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'}`}>
                    {analysis.sentiment}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Best Time to Post</h3>
                  <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{analysis.bestTimeToPost}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Recommended Hashtags</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.hashtags.map((tag, index) => (
                      <span
                        key={index}
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Recommendations</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SocialMediaAnalyzer; 