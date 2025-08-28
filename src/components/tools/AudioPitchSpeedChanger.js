import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Pause, Download, RotateCcw, Volume2, Settings } from 'lucide-react';
import * as Tone from 'tone';

export default function AudioPitchSpeedChanger() {
  const [audioFile, setAudioFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitch, setPitch] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const fileInputRef = useRef(null);
  const playerRef = useRef(null);
  const pitchShiftRef = useRef(null);
  const playbackRateRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Initialize Tone.js effects
    pitchShiftRef.current = new Tone.PitchShift({ pitch: 0 });
    playbackRateRef.current = new Tone.Player();
    
    // Connect effects chain
    pitchShiftRef.current.toDestination();
    
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
      if (pitchShiftRef.current) {
        pitchShiftRef.current.dispose();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Please select a valid audio file');
      return;
    }

    setIsProcessing(true);
    setIsLoaded(false);
    
    try {
      // Start audio context if needed
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

      // Dispose previous player if exists
      if (playerRef.current) {
        playerRef.current.dispose();
      }

      // Create buffer from file
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await Tone.context.decodeAudioData(arrayBuffer);
      
      // Create new player with the audio buffer
      playerRef.current = new Tone.Player(audioBuffer);
      playerRef.current.connect(pitchShiftRef.current);
      
      setAudioFile(file);
      setDuration(audioBuffer.duration);
      setCurrentTime(0);
      setIsLoaded(true);
      
      // Set up player callbacks
      playerRef.current.onstop = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
      
    } catch (error) {
      console.error('Error loading audio file:', error);
      alert('Error loading audio file. Please try a different file.');
    }
    
    setIsProcessing(false);
  };

  const togglePlayback = async () => {
    if (!playerRef.current || !isLoaded) return;

    try {
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

      if (isPlaying) {
        playerRef.current.stop();
        setIsPlaying(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      } else {
        playerRef.current.start();
        setIsPlaying(true);
        
        // Update progress
        intervalRef.current = setInterval(() => {
          if (playerRef.current && playerRef.current.state === 'started') {
            setCurrentTime(prev => {
              const newTime = prev + 0.1;
              if (newTime >= duration) {
                setIsPlaying(false);
                clearInterval(intervalRef.current);
                return 0;
              }
              return newTime;
            });
          }
        }, 100);
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  };

  const handlePitchChange = (value) => {
    const newPitch = parseFloat(value);
    setPitch(newPitch);
    if (pitchShiftRef.current) {
      pitchShiftRef.current.pitch = newPitch;
    }
  };

  const handleSpeedChange = (value) => {
    const newSpeed = parseFloat(value);
    setSpeed(newSpeed);
    if (playerRef.current) {
      playerRef.current.playbackRate = newSpeed;
    }
  };

  const resetSettings = () => {
    setPitch(0);
    setSpeed(1);
    if (pitchShiftRef.current) {
      pitchShiftRef.current.pitch = 0;
    }
    if (playerRef.current) {
      playerRef.current.playbackRate = 1;
    }
  };

  const downloadProcessedAudio = async () => {
    if (!playerRef.current || !audioFile) return;
    
    alert('Download functionality requires server-side processing. This is a client-side demo.');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* SEO Metadata */}
        <div className="hidden">
          <title>Audio Pitch & Speed Changer - Free Online Audio Editor</title>
          <meta name="description" content="Change audio pitch and speed online for free. Professional audio editing tool with real-time preview. Upload MP3, WAV, and other audio formats. No registration required." />
          <link rel="canonical" href="/tools/audio-pitch-speed-changer" />
        </div>

        {/* Main Tool Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Volume2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Audio Pitch & Speed Changer
            </h1>
          </div>

          {/* File Upload */}
          <div className="mb-8">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 hover:border-blue-500 dark:hover:border-blue-400 transition-colors disabled:opacity-50"
            >
              <div className="flex flex-col items-center">
                <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4" />
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {isProcessing ? 'Processing...' : 'Upload Audio File'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Supports MP3, WAV, OGG, M4A and other audio formats
                </p>
              </div>
            </button>
          </div>

          {/* Audio Controls */}
          {audioFile && isLoaded && (
            <div className="space-y-6">
              {/* File Info */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {audioFile.name}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Duration: {formatTime(duration)}</span>
                  <span>Size: {(audioFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={togglePlayback}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                
                <button
                  onClick={resetSettings}
                  className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
                
                <button
                  onClick={downloadProcessedAudio}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
              </div>

              {/* Audio Settings */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pitch Control */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <label className="text-lg font-medium text-gray-900 dark:text-white">
                      Pitch Shift
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>-12 semitones</span>
                      <span className="font-medium">{pitch > 0 ? '+' : ''}{pitch}</span>
                      <span>+12 semitones</span>
                    </div>
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="0.1"
                      value={pitch}
                      onChange={(e) => handlePitchChange(e.target.value)}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none slider"
                    />
                  </div>
                </div>

                {/* Speed Control */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <label className="text-lg font-medium text-gray-900 dark:text-white">
                      Playback Speed
                    </label>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span>0.5x</span>
                      <span className="font-medium">{speed.toFixed(1)}x</span>
                      <span>2.0x</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={speed}
                      onChange={(e) => handleSpeedChange(e.target.value)}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Professional Audio Pitch & Speed Editor
          </h2>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-4 text-gray-700 dark:text-gray-300">
            <p className="text-lg leading-relaxed">
              Transform your audio files with our advanced pitch and speed changer tool. Whether you're a musician, podcaster, content creator, or audio enthusiast, this professional-grade tool lets you modify audio characteristics with precision and real-time preview.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Real-time pitch shifting (-12 to +12 semitones)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Variable speed control (0.5x to 2.0x)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Support for multiple audio formats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Instant preview without rendering</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Perfect For</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Music production and remixing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Podcast and voice editing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Educational content creation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>Audio restoration and correction</span>
                  </li>
                </ul>
              </div>
            </div>

            <p className="leading-relaxed">
              Our tool uses advanced Web Audio API technology to process your audio files entirely in your browser. This means your audio never leaves your device, ensuring complete privacy and security. The intuitive interface makes it easy to fine-tune your audio with professional results.
            </p>

            <p className="leading-relaxed">
              Simply upload your audio file, adjust the pitch and speed controls to your preference, and preview the changes in real-time. The tool maintains high audio quality throughout the processing, making it suitable for both casual use and professional audio production workflows.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}