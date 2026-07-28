import { Volume2, Square } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AudioButtonProps {
  text: string;
}

export function AudioButton({ text }: AudioButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const handleToggle = () => {
    if (!speechSynthesis) return;

    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      setIsPlaying(true);
      speechSynthesis.speak(utterance);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
    };
  }, [speechSynthesis]);

  return (
    <button 
      onClick={handleToggle}
      className="flex items-center justify-center gap-2 text-sm font-medium text-foreground bg-surface hover:bg-card-hover transition-colors px-4 py-2 rounded-full shadow-sm border border-white/5 active:scale-95 min-h-[44px]"
      aria-label={isPlaying ? "Stop listening" : "Listen"}
    >
      {isPlaying ? (
        <>
          <Square className="w-4 h-4 text-primary fill-current" />
          Stop
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-primary" />
          Listen
        </>
      )}
    </button>
  );
}
