import { useState, useEffect, useCallback, useRef } from 'react';

export function useSpeech(text?: string) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  
  // Use ref to keep track of the current utterance so we can pause/resume properly
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false);
    }
    
    // Stop speech when component unmounts
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, [isSupported]);

  const pause = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSupported]);

  const resume = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isSupported]);

  const speak = useCallback((textToSpeak?: string) => {
    if (!isSupported) return;
    
    const targetText = textToSpeak || text;
    if (!targetText) return;

    // Clean text: remove markdown and normalize whitespace
    const cleanText = targetText
      .replace(/[*_#`~[\]]/g, '')
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    stop(); // cancel any ongoing speech

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Voice selection logic (en-IN, en-US, en-GB)
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = voices.filter(v => 
      v.lang.startsWith('en-IN') || 
      v.lang.startsWith('en-US') || 
      v.lang.startsWith('en-GB')
    );
    if (preferredVoices.length > 0) {
      utterance.voice = preferredVoices[0];
    }

    utterance.rate = 0.9; // slightly slower for children
    
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    
    utterance.onerror = (e) => {
      // Ignore 'interrupted' errors caused by cancel()
      if (e.error !== 'interrupted') {
        setIsPlaying(false);
        setIsPaused(false);
      }
    };

    utteranceRef.current = utterance;
    setIsPlaying(true);
    setIsPaused(false);
    window.speechSynthesis.speak(utterance);
    
  }, [text, isSupported, stop]);

  return {
    speak,
    pause,
    resume,
    stop,
    isPlaying,
    isPaused,
    isSupported
  };
}
