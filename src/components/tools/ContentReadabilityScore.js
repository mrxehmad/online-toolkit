import React, { useState, useEffect } from 'react';
import { BookOpen, FileText, TrendingUp, Users, Eye, X, Info, Target, BarChart3, CheckCircle } from 'lucide-react';

// Mock useTheme hook since it's not available
const useTheme = () => ({ theme: 'light' });

export default function ContentReadabilityScore() {
  const [text, setText] = useState('');
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const { theme } = useTheme();

  // SEO metadata effect
  useEffect(() => {
    document.title = 'Content Readability Score Calculator - Flesch-Kincaid Reading Level Tool';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Free online readability calculator using Flesch-Kincaid formula. Analyze text difficulty, reading level, and audience suitability. Perfect for content creators, educators, and writers.');
    }
    
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', window.location.href);
    }
  }, []);

  const calculateReadabilityScores = (inputText) => {
    if (!inputText.trim()) return null;

    // Clean text and basic counts
    const cleanText = inputText.replace(/[^\w\s.!?]/g, ' ').replace(/\s+/g, ' ').trim();
    
    // Count sentences (simple approach)
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;
    
    // Count words
    const words = cleanText.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;
    
    // Count syllables (approximate method)
    const countSyllables = (word) => {
      word = word.toLowerCase();
      if (word.length <= 3) return 1;
      word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
      word = word.replace(/^y/, '');
      const matches = word.match(/[aeiouy]{1,2}/g);
      return matches ? matches.length : 1;
    };
    
    const totalSyllables = words.reduce((sum, word) => sum + countSyllables(word), 0);
    
    // Flesch Reading Ease Score
    const fleschScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * (wordCount / sentenceCount)) - (84.6 * (totalSyllables / wordCount))
    ));
    
    // Flesch-Kincaid Grade Level
    const gradeLevel = Math.max(0, 
      (0.39 * (wordCount / sentenceCount)) + (11.8 * (totalSyllables / wordCount)) - 15.59
    );
    
    // Determine reading level and audience
    const getReadingLevel = (score) => {
      if (score >= 90) return { level: 'Very Easy', audience: '5th grade', color: 'text-green-600 dark:text-green-400' };
      if (score >= 80) return { level: 'Easy', audience: '6th grade', color: 'text-green-500 dark:text-green-300' };
      if (score >= 70) return { level: 'Fairly Easy', audience: '7th grade', color: 'text-yellow-600 dark:text-yellow-400' };
      if (score >= 60) return { level: 'Standard', audience: '8th-9th grade', color: 'text-yellow-500 dark:text-yellow-300' };
      if (score >= 50) return { level: 'Fairly Difficult', audience: '10th-12th grade', color: 'text-orange-600 dark:text-orange-400' };
      if (score >= 30) return { level: 'Difficult', audience: 'College level', color: 'text-red-500 dark:text-red-400' };
      return { level: 'Very Difficult', audience: 'Graduate level', color: 'text-red-600 dark:text-red-500' };
    };
    
    const readingInfo = getReadingLevel(fleschScore);
    
    return {
      fleschScore: Math.round(fleschScore * 10) / 10,
      gradeLevel: Math.round(gradeLevel * 10) / 10,
      readingLevel: readingInfo.level,
      targetAudience: readingInfo.audience,
      levelColor: readingInfo.color,
      wordCount,
      sentenceCount,
      syllableCount: totalSyllables,
      avgWordsPerSentence: Math.round((wordCount / sentenceCount) * 10) / 10,
      avgSyllablesPerWord: Math.round((totalSyllables / wordCount) * 10) / 10
    };
  };

  const handleAnalyze = () => {
    const scores = calculateReadabilityScores(text);
    setResults(scores);
    setShowResults(!!scores);
  };

  const handleClear = () => {
    setText('');
    setResults(null);
    setShowResults(false);
  };

  const closeResults = () => {
    setShowResults(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <BookOpen className="w-12 h-12 text-blue-600 dark:text-blue-400 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Content Readability Score
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Analyze your content's readability using the Flesch-Kincaid formula. 
            Get instant feedback on reading difficulty and target audience suitability.
          </p>
        </div>

        {/* Main Tool Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <div className="space-y-6">
            {/* Text Input */}
            <div>
              <label htmlFor="text-input" className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                <FileText className="w-5 h-5 inline mr-2" />
                Paste Your Content
              </label>
              <textarea
                id="text-input"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here to analyze its readability. The tool will calculate Flesch-Kincaid scores, grade level, and provide detailed insights about your content's accessibility..."
                className="w-full h-40 sm:h-48 p-4 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base"
              />
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {text.length} characters • {text.trim() ? text.trim().split(/\s+/).length : 0} words
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAnalyze}
                disabled={!text.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Analyze Readability
              </button>
              <button
                onClick={handleClear}
                className="flex-1 sm:flex-none bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
              >
                Clear Text
              </button>
            </div>
          </div>
        </div>

        {/* Results Modal Overlay */}
        {showResults && results && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Results Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2" />
                  Readability Analysis
                </h2>
                <button
                  onClick={closeResults}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Results Content */}
              <div className="p-6 space-y-6">
                {/* Primary Scores */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                      Flesch Reading Ease
                    </div>
                    <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                      {results.fleschScore}
                    </div>
                    <div className={`text-sm font-medium mt-1 ${results.levelColor}`}>
                      {results.readingLevel}
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                    <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                      Grade Level
                    </div>
                    <div className="text-3xl font-bold text-green-700 dark:text-green-300">
                      {results.gradeLevel}
                    </div>
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mt-1">
                      Flesch-Kincaid
                    </div>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                    <span className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                      Target Audience
                    </span>
                  </div>
                  <div className="text-xl font-bold text-purple-800 dark:text-purple-200">
                    {results.targetAudience}
                  </div>
                </div>

                {/* Detailed Statistics */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Text Statistics
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Words</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {results.wordCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Sentences</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {results.sentenceCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Syllables</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {results.syllableCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Avg Words/Sentence</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {results.avgWordsPerSentence}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">Avg Syllables/Word</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {results.avgSyllablesPerWord}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                  <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center">
                    <Target className="w-5 h-5 mr-2" />
                    Recommendations
                  </h3>
                  <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
                    {results.fleschScore < 50 && (
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" />
                        <span>Consider using shorter sentences and simpler words to improve readability.</span>
                      </div>
                    )}
                    {results.avgWordsPerSentence > 20 && (
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" />
                        <span>Try breaking long sentences into shorter ones (aim for 15-20 words per sentence).</span>
                      </div>
                    )}
                    {results.fleschScore >= 70 && (
                      <div className="flex items-start">
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5" />
                        <span>Great! Your content is easily readable by most audiences.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Long Description */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex items-center mb-4">
            <Eye className="w-6 h-6 text-gray-600 dark:text-gray-400 mr-3" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              About Content Readability Analysis
            </h2>
          </div>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-4">
              The Content Readability Score tool uses the scientifically-validated Flesch-Kincaid formula to evaluate 
              how easy your text is to read and understand. This comprehensive analysis helps content creators, educators, 
              marketers, and writers optimize their content for specific audiences and improve overall accessibility.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
              How Readability Scoring Works
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our tool calculates two primary metrics: the Flesch Reading Ease Score (0-100 scale) and the 
              Flesch-Kincaid Grade Level. These formulas consider sentence length, word complexity, and syllable 
              count to determine reading difficulty. Higher Flesch scores indicate easier reading, while grade 
              levels correspond to educational requirements.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
              Why Readability Matters
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Readable content improves user engagement, SEO performance, and accessibility compliance. Whether 
              you're writing blog posts, marketing copy, educational materials, or technical documentation, 
              understanding your content's readability helps ensure your message reaches and resonates with 
              your intended audience effectively.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 mt-6">
              Perfect for Various Content Types
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              This tool is ideal for analyzing website content, email campaigns, academic papers, training materials, 
              product descriptions, social media posts, and any text where clarity and accessibility are important. 
              The instant analysis provides actionable insights to help you refine your writing for maximum impact 
              and comprehension across different reading levels and demographics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}