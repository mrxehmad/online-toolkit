import React, { useState, useRef } from 'react';
import { Volume2, Copy, RotateCcw, Play, Pause, Download } from 'lucide-react';

function MorseCodeTranslator() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState('textToMorse'); // 'textToMorse' or 'morseToText'
  const [isPlaying, setIsPlaying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const audioContextRef = useRef(null);
  const isPlayingRef = useRef(false);

  // Morse code mapping
  const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
    '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
    '8': '---..', '9': '----.', '.': '.-.-.-', ',': '--..--', '?': '..--..',
    "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
    '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.',
    '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
    ' ': '/'
  };

  const reverseMorseCode = Object.fromEntries(
    Object.entries(morseCode).map(([key, value]) => [value, key])
  );

  const textToMorse = (text) => {
    return text.toUpperCase().split('').map(char => morseCode[char] || char).join(' ');
  };

  const morseToText = (morse) => {
    return morse.split(' ').map(code => reverseMorseCode[code] || code).join('');
  };

  const handleTranslate = () => {
    if (mode === 'textToMorse') {
      setOutputText(textToMorse(inputText));
    } else {
      setOutputText(morseToText(inputText));
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
  };

  const switchMode = () => {
    setMode(mode === 'textToMorse' ? 'morseToText' : 'textToMorse');
    setInputText(outputText);
    setOutputText('');
  };

  const playMorseAudio = async () => {
    if (isPlaying || !outputText || mode !== 'textToMorse') return;

    setIsPlaying(true);
    isPlayingRef.current = true;

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      const audioContext = audioContextRef.current;
      const dotDuration = 100; // milliseconds
      const dashDuration = dotDuration * 3;
      const gapDuration = dotDuration;
      const letterGapDuration = dotDuration * 3;
      const wordGapDuration = dotDuration * 7;
      const frequency = 600; // Hz

      let currentTime = audioContext.currentTime;

      for (let i = 0; i < outputText.length; i++) {
        if (!isPlayingRef.current) break;

        const char = outputText[i];
        
        if (char === '.') {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, currentTime);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + dotDuration / 1000);
          
          currentTime += (dotDuration + gapDuration) / 1000;
        } else if (char === '-') {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0.3, currentTime);
          oscillator.start(currentTime);
          oscillator.stop(currentTime + dashDuration / 1000);
          
          currentTime += (dashDuration + gapDuration) / 1000;
        } else if (char === ' ') {
          currentTime += letterGapDuration / 1000;
        } else if (char === '/') {
          currentTime += wordGapDuration / 1000;
        }
      }

      setTimeout(() => {
        setIsPlaying(false);
        isPlayingRef.current = false;
      }, (currentTime - audioContext.currentTime) * 1000);

    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  };

  const stopAudio = () => {
    setIsPlaying(false);
    isPlayingRef.current = false;
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  React.useEffect(() => {
    if (inputText) {
      handleTranslate();
    } else {
      setOutputText('');
    }
  }, [inputText, mode]);

  return (
    <>
      {/* SEO Metadata */}
      <title>Morse Code Translator - Convert Text to Morse Code & Play Audio | Free Online Tool</title>
      <meta name="description" content="Free online Morse Code translator. Convert text to Morse code and vice versa. Play Morse code audio, copy results, and learn telegraphy. Perfect for ham radio operators, students, and enthusiasts." />
      <meta name="canonical" content="/tools/morse-code-translator" />
      <meta name="keywords" content="morse code translator, text to morse, morse to text, morse code audio, telegraphy, ham radio, SOS morse code" />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              🔊 Morse Code Translator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Convert text to Morse code and vice versa. Listen to authentic Morse code audio and copy results instantly.
            </p>
          </div>

          {/* Main Tool Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 mb-8">
            
            {/* Mode Toggle */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-1 flex">
                <button
                  onClick={() => setMode('textToMorse')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    mode === 'textToMorse'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Text → Morse
                </button>
                <button
                  onClick={() => setMode('morseToText')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    mode === 'morseToText'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Morse → Text
                </button>
              </div>
            </div>

            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {mode === 'textToMorse' ? 'Enter Text' : 'Enter Morse Code'}
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={mode === 'textToMorse' ? 'Type your message here...' : 'Enter morse code (use spaces between letters, / between words)...'}
                className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={switchMode}
                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Switch Mode
              </button>
              
              <button
                onClick={handleClear}
                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Clear All
              </button>

              {outputText && mode === 'textToMorse' && (
                <button
                  onClick={isPlaying ? stopAudio : playMorseAudio}
                  disabled={!outputText}
                  className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isPlaying ? 'Stop Audio' : 'Play Audio'}
                </button>
              )}
            </div>

            {/* Output Section */}
            {outputText && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {mode === 'textToMorse' ? 'Morse Code Output' : 'Text Output'}
                  </label>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center px-3 py-1 rounded-lg text-sm transition-colors ${
                      copySuccess
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800'
                    }`}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {copySuccess ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
                  <p className={`${mode === 'textToMorse' ? 'font-mono text-lg' : 'text-base'} text-gray-900 dark:text-white break-all`}>
                    {outputText}
                  </p>
                </div>
              </div>
            )}

            {/* Quick Reference */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Reference</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                  <span className="font-mono">A .-</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                  <span className="font-mono">S ...</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                  <span className="font-mono">O ---</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded">
                  <span className="font-mono">SOS ...---...</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              About Morse Code Translation
            </h2>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Morse code is a method of transmitting text information using standardized sequences of short and long signals called dots and dashes. Developed by Samuel Morse in the 1830s, it revolutionized long-distance communication and remains essential in amateur radio, aviation, and emergency communications.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Features</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">🔤 Bidirectional Translation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Convert text to Morse code and decode Morse back to readable text instantly.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">🔊 Audio Playback</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Listen to authentic Morse code audio with proper timing and tone frequency.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">📋 Easy Copy</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">One-click copying of translated results for use in other applications.</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">📱 Responsive Design</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Works seamlessly on desktop, tablet, and mobile devices with dark/light theme support.</p>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Perfect For</h3>
              <ul className="text-gray-600 dark:text-gray-300 space-y-2 mb-6">
                <li>• <strong>Ham Radio Operators:</strong> Practice and decode CW (continuous wave) transmissions</li>
                <li>• <strong>Students & Educators:</strong> Learn telecommunications history and coding principles</li>
                <li>• <strong>Emergency Preparedness:</strong> Master essential survival communication skills</li>
                <li>• <strong>Aviation Professionals:</strong> Navigate using radio beacons and identifiers</li>
                <li>• <strong>Puzzle Enthusiasts:</strong> Solve cryptographic challenges and escape rooms</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Morse Code Basics</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Each letter and number has a unique combination of dots (short signals) and dashes (long signals). The international standard defines a dash as three times longer than a dot, with specific spacing between elements, letters, and words for clear communication.
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  <strong>Pro Tip:</strong> The famous distress signal "SOS" (···---···) was chosen not because it stands for "Save Our Ship," but because it's easily recognizable and difficult to mistake for other signals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MorseCodeTranslator;