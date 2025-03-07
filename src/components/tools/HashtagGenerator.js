import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

function HashtagGenerator() {
  const { darkMode } = useTheme();
  const [caption, setCaption] = useState('');
  const [niche, setNiche] = useState('general');
  const [generatedHashtags, setGeneratedHashtags] = useState(null);

  const niches = [
    { value: 'general', label: 'General' },
    { value: 'fashion', label: 'Fashion & Style' },
    { value: 'food', label: 'Food & Cooking' },
    { value: 'travel', label: 'Travel' },
    { value: 'fitness', label: 'Fitness & Health' },
    { value: 'tech', label: 'Technology' },
    { value: 'business', label: 'Business' },
  ];

  const hashtagsByNiche = {
    general: ['#trending', '#viral', '#instagood', '#photooftheday', '#love', '#follow', '#like', '#share'],
    fashion: ['#fashion', '#style', '#ootd', '#fashionblogger', '#streetstyle', '#fashionista', '#outfit'],
    food: ['#foodie', '#foodporn', '#instafood', '#cooking', '#chef', '#delicious', '#yummy', '#recipes'],
    travel: ['#travel', '#wanderlust', '#adventure', '#explore', '#travelgram', '#vacation', '#holiday'],
    fitness: ['#fitness', '#gym', '#workout', '#health', '#fitnessmotivation', '#training', '#healthy'],
    tech: ['#technology', '#tech', '#innovation', '#coding', '#programming', '#developer', '#software'],
    business: ['#business', '#entrepreneur', '#success', '#motivation', '#marketing', '#startup', '#goals'],
  };

  const generateHashtags = (e) => {
    e.preventDefault();
    
    // Get niche-specific hashtags
    const nicheHashtags = hashtagsByNiche[niche] || hashtagsByNiche.general;
    
    // Generate some hashtags from the caption
    const captionWords = caption
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3)
      .map(word => `#${word}`);

    // Combine and shuffle hashtags
    const allHashtags = [...new Set([...nicheHashtags, ...captionWords])];
    const shuffled = allHashtags.sort(() => 0.5 - Math.random());
    
    // Group hashtags by popularity
    setGeneratedHashtags({
      top: shuffled.slice(0, 5),
      medium: shuffled.slice(5, 15),
      niche: shuffled.slice(15, 20),
    });
  };

  const copyToClipboard = (hashtags) => {
    navigator.clipboard.writeText(hashtags.join(' '));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Hashtag Generator
          </h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Generate relevant hashtags for your social media posts
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6 mb-8`}>
          <form onSubmit={generateHashtags} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Content Niche
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                {niches.map(n => (
                  <option key={n.value} value={n.value}>
                    {n.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Post Caption or Keywords
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className={`w-full h-32 px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder="Enter your post caption or relevant keywords..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Generate Hashtags
            </button>
          </form>
        </div>

        {generatedHashtags && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6 space-y-6`}>
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Top Hashtags</h3>
                <button
                  onClick={() => copyToClipboard(generatedHashtags.top)}
                  className="text-xs text-indigo-600 hover:text-indigo-500"
                >
                  Copy
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {generatedHashtags.top.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      darkMode ? 'bg-indigo-900 text-indigo-200' : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Popular Hashtags</h3>
                <button
                  onClick={() => copyToClipboard(generatedHashtags.medium)}
                  className="text-xs text-indigo-600 hover:text-indigo-500"
                >
                  Copy
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {generatedHashtags.medium.map((tag, index) => (
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
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium">Niche Hashtags</h3>
                <button
                  onClick={() => copyToClipboard(generatedHashtags.niche)}
                  className="text-xs text-indigo-600 hover:text-indigo-500"
                >
                  Copy
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {generatedHashtags.niche.map((tag, index) => (
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

            <button
              onClick={() => copyToClipboard([
                ...generatedHashtags.top,
                ...generatedHashtags.medium,
                ...generatedHashtags.niche
              ])}
              className="w-full mt-4 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
            >
              Copy All Hashtags
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HashtagGenerator; 