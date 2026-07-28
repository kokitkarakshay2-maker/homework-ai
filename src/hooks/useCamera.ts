import { useState, useCallback, useRef, useEffect } from 'react';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(async (mode: 'environment' | 'user' = facingMode) => {
    stopCamera();
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported by this browser. HTTPS is required.');
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode }
      });
      setStream(newStream);
      setFacingMode(mode);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      // Check for torch capability
      const track = newStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      // @ts-ignore - torch is not strictly typed in standard lib yet
      setHasTorch(!!capabilities.torch);
      setTorchOn(false);

    } catch (err: any) {
      console.error("Camera error:", err);
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is already in use by another application.');
      } else if (err.name === 'OverconstrainedError') {
        setError('Requested camera mode is not available.');
      } else {
        setError(err.message || 'Failed to access camera.');
      }
    }
  }, [stopCamera, facingMode]);

  const toggleCamera = useCallback(() => {
    startCamera(facingMode === 'environment' ? 'user' : 'environment');
  }, [facingMode, startCamera]);

  const toggleTorch = useCallback(async () => {
    if (!stream || !hasTorch) return;
    const track = stream.getVideoTracks()[0];
    try {
      // @ts-ignore
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn(!torchOn);
    } catch (err) {
      console.error('Failed to toggle torch', err);
    }
  }, [stream, hasTorch, torchOn]);

  const capturePhoto = useCallback((): Promise<File | null> => {
    return new Promise((resolve) => {
      if (!videoRef.current || !stream) {
        resolve(null);
        return;
      }

      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(null);
        return;
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve(null);
          return;
        }
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg', 0.95);
    });
  }, [stream]);

  // Clean up on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return {
    videoRef,
    startCamera,
    stopCamera,
    toggleCamera,
    capturePhoto,
    toggleTorch,
    hasTorch,
    torchOn,
    error,
    isReady: !!stream
  };
}
