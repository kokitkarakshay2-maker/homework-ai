import { Volume2, Square } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

interface AudioButtonProps {
  text: string;
}

export function AudioButton({ text }: AudioButtonProps) {
  const { speak, stop, isPlaying, isSupported } = useSpeech(text);

  if (!isSupported) {
    return null;
  }

  const handleToggle = () => {
    if (isPlaying) {
      stop();
    } else {
      speak();
    }
  };

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
