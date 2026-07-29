import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Zap, ZapOff, X } from 'lucide-react';
import { useCamera } from '../hooks/useCamera';
import { useImageUpload } from '../hooks/useImageUpload';
import { AppShell } from '../components/layout/AppShell';

export default function CameraScreen() {
  const navigate = useNavigate();
  const { addImages } = useImageUpload();
  const {
    videoRef,
    startCamera,
    stopCamera,
    toggleCamera,
    capturePhoto,
    toggleTorch,
    hasTorch,
    torchOn,
    error,
    isReady
  } = useCamera();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleCapture = async () => {
    const file = await capturePhoto();
    if (file) {
      await addImages([file]);
      navigate('/preview');
    }
  };

  const handleCancel = () => {
    stopCamera();
    navigate('/home');
  };

  return (
    <AppShell className="bg-black">
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
        <button 
          onClick={handleCancel}
          className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white"
        >
          <X className="w-6 h-6" />
        </button>
        {hasTorch && (
          <button 
            onClick={toggleTorch}
            className="w-10 h-10 bg-black/40 rounded-full flex items-center justify-center text-white"
          >
            {torchOn ? <Zap className="w-6 h-6" /> : <ZapOff className="w-6 h-6" />}
          </button>
        )}
      </div>

      {/* Camera Viewfinder */}
      <div className="flex-1 w-full bg-black flex items-center justify-center relative">
        {error ? (
          <div className="text-white text-center p-6">
            <p className="mb-4">{error}</p>
            <button 
              onClick={() => startCamera()}
              className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="absolute w-full h-full object-cover block opacity-100 visible z-0"
          />
        )}
      </div>

      {/* Bottom Controls */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-8 flex justify-around items-center bg-gradient-to-t from-black/80 to-transparent z-10"
        style={{ paddingBottom: 'calc(32px + env(safe-area-inset-bottom))' }}
      >
        <div className="w-12 h-12" /> {/* Placeholder for alignment */}
        
        {/* Shutter Button */}
        <button 
          onClick={handleCapture}
          disabled={!isReady}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center disabled:opacity-50"
        >
          <div className="w-16 h-16 bg-white rounded-full active:scale-90 transition-transform" />
        </button>

        {/* Switch Camera */}
        <button 
          onClick={toggleCamera}
          className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center text-white active:scale-95 transition-transform"
        >
          <RefreshCw className="w-6 h-6" />
        </button>
      </div>
    </AppShell>
  );
}
