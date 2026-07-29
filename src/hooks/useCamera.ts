import { useState, useCallback, useRef, useEffect } from 'react';

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [streamState, setStreamState] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStreamState(null);
    }
  }, []); // No dependencies, prevents infinite loops!

  const startCamera = useCallback(async (mode: 'environment' | 'user' = facingMode) => {
    stopCamera();
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported by this browser. HTTPS is required.');
      }

      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (window.location.protocol !== 'https:' && !isLocalhost) {
        throw new Error('Camera requires HTTPS.');
      }

      let newStream: MediaStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: mode },
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false
        });
      } catch (err: any) {
        console.warn("Primary camera request failed, attempting fallback.", err);
        if (mode === 'environment') {
          newStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'user',
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            },
            audio: false
          });
          mode = 'user';
        } else {
          throw err;
        }
      }

      streamRef.current = newStream;
      setStreamState(newStream);
      setFacingMode(mode);

      console.log("Permission granted. Media stream received.");
      console.log("Tracks:", newStream.getTracks());
      console.log("Camera label:", newStream.getVideoTracks()[0]?.label);

      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = newStream;
        
        video.onloadedmetadata = async () => {
          console.log("Metadata loaded. videoWidth:", video.videoWidth, "videoHeight:", video.videoHeight);
          try {
            await video.play();
            console.log("play() success", "readyState:", video.readyState, "networkState:", video.networkState);
          } catch (e) {
            console.error("Play failed", e);
          }
        };
      }

      const track = newStream.getVideoTracks()[0];
      const capabilities = track.getCapabilities ? track.getCapabilities() : {};
      // @ts-ignore
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
  }, [stopCamera, facingMode]); // safe dependencies

  const toggleCamera = useCallback(() => {
    startCamera(facingMode === 'environment' ? 'user' : 'environment');
  }, [facingMode, startCamera]);

  const toggleTorch = useCallback(async () => {
    if (!streamRef.current || !hasTorch) return;
    const track = streamRef.current.getVideoTracks()[0];
    try {
      // @ts-ignore
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn(!torchOn);
    } catch (err) {
      console.error('Failed to toggle torch', err);
    }
  }, [hasTorch, torchOn]);

  const capturePhoto = useCallback((): Promise<File | null> => {
    return new Promise((resolve) => {
      if (!videoRef.current || !streamRef.current) {
        resolve(null);
        return;
      }

      const video = videoRef.current;
      
      // Wait for stream to become active if dimensions are zero
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.warn("Video dimensions are 0. Camera may not be fully initialized.");
        resolve(null);
        return;
      }

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
  }, []);

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
    isReady: !!streamState
  };
}
