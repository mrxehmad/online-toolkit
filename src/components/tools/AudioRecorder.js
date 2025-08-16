import React, { useRef, useState } from 'react';

function AudioRecorder() {
  const [recording, setRecording] = useState(false);

  const [downloadUrl, setDownloadUrl] = useState(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [timer, setTimer] = useState(0);
  const [status, setStatus] = useState('Ready');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [stream, setStream] = useState(null);
  const timerInterval = useRef(null);
  const startTime = useRef(null);
  const recordedChunksRef = useRef([]);
  const previewAudioRef = useRef(null);

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(null), 4000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const updateTimer = () => {
    setTimer(Math.floor((Date.now() - startTime.current) / 1000));
  };

  const startRecording = async () => {
    setLoading(true);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(s);
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
      const options = mimeType ? { mimeType } : {};
      const mr = new window.MediaRecorder(s, options);
      setMediaRecorder(mr);
      recordedChunksRef.current = [];
      mr.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      mr.onstop = () => {

        setRecording(false);
        setStatus('Complete');
        const chunks = recordedChunksRef.current;
        if (chunks.length === 0) {
          showMessage('Recording failed - no data captured. Try a longer recording.', 'error');
          setStatus('Failed');
          return;
        }
        const finalMimeType = mr.mimeType || 'audio/webm';
        const blob = new Blob(chunks, { type: finalMimeType });
        if (blob.size === 0) {
          showMessage('Recording is empty - try recording for longer', 'error');
          setStatus('Failed');
          return;
        }
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
        setShowPreview(true);
        setDownloadUrl(url);
        setDownloadReady(true);
        showMessage('Recording ready! Click download to save.', 'success');
      };
      mr.onerror = () => {
        showMessage('Recording error occurred', 'error');
      };
      mr.start();
      startTime.current = Date.now();
      setTimer(0);
      timerInterval.current = setInterval(updateTimer, 1000);
      setRecording(true);
      
      setStatus('Recording');
      setShowPreview(false);
      setDownloadReady(false);
      setDownloadUrl(null);
      setLoading(false);
      showMessage('Recording started', 'success');
    } catch (error) {
      setLoading(false);
      let errorMessage = 'Unable to start recording. ';
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Microphone permission denied. Please allow and try again.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Audio recording not supported in this browser.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No microphone available to capture.';
      } else if (error.name === 'AbortError') {
        errorMessage = 'Microphone access was cancelled.';
      } else {
        errorMessage += 'Please check your browser settings.';
      }
      showMessage(errorMessage, 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (timerInterval.current) {
      clearInterval(timerInterval.current);
    }
    setRecording(false);
    
    setStatus('Processing...');
  };

  const handleDownload = () => {
    if (!downloadReady || !downloadUrl) {
      showMessage('No recording available to download', 'error');
      return;
    }
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `audio-recording-${Date.now()}.webm`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showMessage('Download started!', 'success');
  };

  // Improved browser support check with debug
  let debugSupport = [];
  if (navigator.mediaDevices) debugSupport.push('mediaDevices');
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) debugSupport.push('getUserMedia');
  if (window.MediaRecorder) debugSupport.push('MediaRecorder');
  if (window.MediaRecorder && window.MediaRecorder.isTypeSupported) {
    if (window.MediaRecorder.isTypeSupported('audio/webm')) debugSupport.push('audio/webm');
    if (window.MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) debugSupport.push('opus');
  }
  console.log('AudioRecorder support debug:', debugSupport);
  const isSupported = !!(
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    window.MediaRecorder &&
    (window.MediaRecorder.isTypeSupported('audio/webm') || window.MediaRecorder.isTypeSupported('audio/webm;codecs=opus'))
  );

  return (
    <div style={{
      background: '#ffffff',
      borderRadius: '20px',
      padding: '3rem 2rem',
      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
      textAlign: 'center',
      maxWidth: 400,
      width: '90%',
      border: '1px solid rgba(0, 0, 0, 0.04)',
      margin: '2rem auto',
      position: 'relative',
    }}>
      {/* iPhone-style animated recording indicator */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        width: 24,
        height: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: recording ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}>
        <span style={{
          display: 'inline-block',
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 0 0 2px #fff',
          position: 'absolute',
        }} />
        <span style={{
          display: 'inline-block',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: '#ff3b30',
          position: 'absolute',
          animation: recording ? 'pulse 1.5s infinite cubic-bezier(0.4,0,0.2,1)' : 'none',
        }} />
      </div>
      <h1 style={{ color: '#1d1d1f', fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
        Audio Recorder
      </h1>
      <p style={{ color: '#86868b', fontSize: '0.95rem', marginBottom: '2.5rem', fontWeight: 400 }}>
        Record audio from your microphone
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem', height: 24 }}>
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: recording ? '#ff3b30' : '#d1d1d6',
            transition: 'all 0.2s ease',
            animation: recording ? 'pulse 2s infinite ease-in-out' : 'none',
          }}
        />
        <span style={{ fontSize: '0.9rem', color: '#86868b', fontWeight: 500 }}>{status}</span>
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 300, color: '#1d1d1f', marginBottom: '2rem', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em', minHeight: '2.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {formatTime(timer)}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <button
          className={`btn btn-start${loading ? ' loading' : ''}`}
          style={{
            padding: '16px 24px',
            border: 'none',
            borderRadius: 14,
            fontSize: '1rem',
            fontWeight: 500,
            cursor: loading || !isSupported ? 'not-allowed' : 'pointer',
            background: '#007aff',
            color: 'white',
            borderColor: 'transparent',
            opacity: loading || !isSupported ? 0.6 : 1,
          }}
          onClick={startRecording}
          disabled={recording || loading || !isSupported}
        >
          {loading ? 'Starting...' : 'Start Recording'}
        </button>
        <button
          className="btn btn-stop"
          style={{
            padding: '16px 24px',
            border: 'none',
            borderRadius: 14,
            fontSize: '1rem',
            fontWeight: 500,
            cursor: !recording ? 'not-allowed' : 'pointer',
            background: '#ff3b30',
            color: 'white',
            borderColor: 'transparent',
            opacity: !recording ? 0.6 : 1,
          }}
          onClick={stopRecording}
          disabled={!recording}
        >
          Stop Recording
        </button>
        <button
          className={`btn btn-download${downloadReady ? ' force-enabled' : ''}`}
          style={{
            padding: '16px 24px',
            border: 'none',
            borderRadius: 14,
            fontSize: '1rem',
            fontWeight: 500,
            background: downloadReady ? '#34c759' : '#f2f2f7',
            color: downloadReady ? 'white' : '#86868b',
            borderColor: 'transparent',
            cursor: downloadReady ? 'pointer' : 'not-allowed',
            opacity: downloadReady ? 1 : 0.6,
          }}
          onClick={handleDownload}
          disabled={!downloadReady}
        >
          Download
        </button>
      </div>
      {message && (
        <div
          className={`message ${messageType}`}
          style={{
            padding: '12px 16px',
            borderRadius: 12,
            marginTop: '1rem',
            fontSize: '0.9rem',
            fontWeight: 500,
            background:
              messageType === 'error'
                ? '#fff2f2'
                : messageType === 'success'
                ? '#f0fff4'
                : '#f0f9ff',
            color:
              messageType === 'error'
                ? '#d1242f'
                : messageType === 'success'
                ? '#059669'
                : '#0369a1',
            border:
              messageType === 'error'
                ? '1px solid rgba(209, 36, 47, 0.1)'
                : messageType === 'success'
                ? '1px solid rgba(5, 150, 105, 0.1)'
                : '1px solid rgba(3, 105, 161, 0.1)',
            animation: 'fadeIn 0.3s ease-out',
          }}
        >
          {message}
        </div>
      )}
      {showPreview && previewUrl && (
        <div style={{ marginTop: '2rem', borderRadius: 12, overflow: 'hidden', background: '#f2f2f7', border: '1px solid #e5e5ea' }}>
          <audio ref={previewAudioRef} src={previewUrl} controls preload="metadata" style={{ width: '100%', maxWidth: '100%', display: 'block', background: '#000' }} />
        </div>
      )}
      {!isSupported && (
        <div style={{ marginTop: '1rem', color: '#d1242f', fontWeight: 500 }}>
          Audio recording not supported. Use Chrome, Firefox, or Edge.
        </div>
      )}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default AudioRecorder;
