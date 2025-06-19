import React, { useRef, useState } from 'react';

const initialInfo = {
  webcamName: 'Not selected',
  qualityRating: '—',
  builtInMicrophone: '—',
  builtInSpeaker: '—',
  frameRate: '—',
  streamType: '—',
  imageMode: '—',
  webcamMegaPixels: '—',
  webcamResolution: '—',
  videoStandard: '—',
  aspectRatio: '—',
  pngFileSize: '—',
  jpegFileSize: '—',
  bitrate: '—',
  numberOfColors: '—',
  averageRGBColor: '—',
  lightness: '—',
  luminosity: '—',
  brightness: '—',
  hue: '—',
  saturation: '—',
};

function getAverageRGB(imgEl) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = imgEl.width;
  canvas.height = imgEl.height;
  context.drawImage(imgEl, 0, 0, imgEl.width, imgEl.height);
  const imageData = context.getImageData(0, 0, imgEl.width, imgEl.height);
  let r = 0, g = 0, b = 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    r += imageData.data[i];
    g += imageData.data[i + 1];
    b += imageData.data[i + 2];
  }
  const pixelCount = imageData.data.length / 4;
  return `rgb(${Math.round(r / pixelCount)}, ${Math.round(g / pixelCount)}, ${Math.round(b / pixelCount)})`;
}

const WebcamTester = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recording, setRecording] = useState(false);
  const [info, setInfo] = useState(initialInfo);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [error, setError] = useState('');
  const [videoDimensions, setVideoDimensions] = useState({ width: 320, height: 180 });

  const getWebcamInfo = async (stream) => {
    const videoTrack = stream.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    setInfo((prev) => ({
      ...prev,
      webcamName: videoTrack.label || 'Unknown',
      frameRate: settings.frameRate || '—',
      webcamResolution: settings.width && settings.height ? `${settings.width}x${settings.height}` : '—',
      aspectRatio: settings.aspectRatio || (settings.width && settings.height ? (settings.width/settings.height).toFixed(2) : '—'),
      streamType: videoTrack.kind || 'video',
      videoStandard: settings.resizeMode || '—',
      imageMode: settings.displaySurface || '—',
      webcamMegaPixels: settings.width && settings.height ? (settings.width * settings.height / 1e6).toFixed(2) : '—',
      bitrate: settings.bitrate || '—',
    }));
  };

  const startCamera = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setError('');
    try {
      const constraints = {
        video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      // Set video dimensions to actual stream size if available
      const videoTrack = newStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      if (settings.width && settings.height) {
        setVideoDimensions({ width: settings.width, height: settings.height });
      } else {
        setVideoDimensions({ width: 320, height: 180 });
      }
      getWebcamInfo(newStream);
      // Get audio info
      const audioTrack = newStream.getAudioTracks()[0];
      setInfo((prev) => ({
        ...prev,
        builtInMicrophone: audioTrack ? audioTrack.label : '—',
      }));
    } catch (err) {
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera access was denied. Please allow camera permissions in your browser settings and reload the page.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera device found. Please connect a camera and try again.');
      } else {
        setError('Could not access webcam: ' + err.message);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
    setCapturedVideo(null);
    setRecording(false);
    setMediaRecorder(null);
    setInfo(initialInfo);
    setError('');
    setVideoDimensions({ width: 320, height: 180 });
  };

  const takePicture = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const pngData = canvas.toDataURL('image/png');
    const jpegData = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(pngData);
    // Calculate file sizes
    const pngSize = Math.round((pngData.length * 3) / 4 / 1024);
    const jpegSize = Math.round((jpegData.length * 3) / 4 / 1024);
    // Calculate average color
    const img = new window.Image();
    img.src = pngData;
    img.onload = () => {
      const avgColor = getAverageRGB(img);
      setInfo((prev) => ({
        ...prev,
        pngFileSize: pngSize + ' KB',
        jpegFileSize: jpegSize + ' KB',
        averageRGBColor: avgColor,
      }));
    };
  };

  const startRecording = () => {
    if (!stream) return;
    const recorder = new window.MediaRecorder(stream);
    let chunks = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setCapturedVideo(URL.createObjectURL(blob));
      setInfo((prev) => ({
        ...prev,
        bitrate: Math.round(blob.size / 1024) + ' KB',
      }));
      chunks = [];
    };
    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  React.useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setDevices(devices.filter((d) => d.kind === 'videoinput'));
      if (devices.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(devices[0].deviceId);
      }
    });
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="webcam-tester max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Webcam Tester</h2>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex flex-col gap-2">
          <label className="font-semibold">Available Cameras:</label>
          <select
            className="border rounded px-2 py-1"
            value={selectedDeviceId}
            onChange={e => setSelectedDeviceId(e.target.value)}
            disabled={!!stream}
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>{d.label || 'Camera'}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2 justify-center md:justify-end">
          <button onClick={startCamera} disabled={!!stream} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">Start Camera</button>
          <button onClick={stopCamera} disabled={!stream} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50">Stop Camera</button>
          <button onClick={takePicture} disabled={!stream} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50">Take Picture</button>
          <button
            onClick={recording ? stopRecording : startRecording}
            disabled={!stream}
            className={`px-4 py-2 rounded text-white ${recording ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'} disabled:opacity-50`}
          >
            {recording ? 'Stop Recording' : 'Record Video'}
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center mb-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded border bg-black"
          style={{ width: videoDimensions.width, height: videoDimensions.height, background: '#000', objectFit: 'cover' }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      {capturedImage && (
        <div className="mb-4 text-center">
          <h4 className="font-semibold mb-2">Captured Image</h4>
          <img src={capturedImage} alt="Captured" className="mx-auto rounded border" style={{ maxWidth: 320 }} />
        </div>
      )}
      {capturedVideo && (
        <div className="mb-4 text-center">
          <h4 className="font-semibold mb-2">Captured Video</h4>
          <video src={capturedVideo} controls className="mx-auto rounded border" style={{ maxWidth: 320 }} />
        </div>
      )}
      <h3 className="text-xl font-bold mt-6 mb-2">Webcam Information</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <tbody>
            <tr><td className="font-semibold">Webcam Name:</td><td>{info.webcamName}</td></tr>
            <tr><td className="font-semibold">Quality Rating:</td><td>{info.qualityRating}</td></tr>
            <tr><td className="font-semibold">Built-in Microphone:</td><td>{info.builtInMicrophone}</td></tr>
            <tr><td className="font-semibold">Built-in Speaker:</td><td>{info.builtInSpeaker}</td></tr>
            <tr><td className="font-semibold">Frame rate:</td><td>{info.frameRate}</td></tr>
            <tr><td className="font-semibold">Stream Type:</td><td>{info.streamType}</td></tr>
            <tr><td className="font-semibold">Image Mode:</td><td>{info.imageMode}</td></tr>
            <tr><td className="font-semibold">Webcam MegaPixels:</td><td>{info.webcamMegaPixels}</td></tr>
            <tr><td className="font-semibold">Webcam Resolution:</td><td>{info.webcamResolution}</td></tr>
            <tr><td className="font-semibold">Video Standard:</td><td>{info.videoStandard}</td></tr>
            <tr><td className="font-semibold">Aspect Ratio:</td><td>{info.aspectRatio}</td></tr>
            <tr><td className="font-semibold">PNG File Size:</td><td>{info.pngFileSize}</td></tr>
            <tr><td className="font-semibold">JPEG File Size:</td><td>{info.jpegFileSize}</td></tr>
            <tr><td className="font-semibold">Bitrate:</td><td>{info.bitrate}</td></tr>
            <tr><td className="font-semibold">Number of Colors:</td><td>{info.numberOfColors}</td></tr>
            <tr><td className="font-semibold">Average RGB Color:</td><td>{info.averageRGBColor}</td></tr>
            <tr><td className="font-semibold">Lightness:</td><td>{info.lightness}</td></tr>
            <tr><td className="font-semibold">Luminosity:</td><td>{info.luminosity}</td></tr>
            <tr><td className="font-semibold">Brightness:</td><td>{info.brightness}</td></tr>
            <tr><td className="font-semibold">Hue:</td><td>{info.hue}</td></tr>
            <tr><td className="font-semibold">Saturation:</td><td>{info.saturation}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WebcamTester; 