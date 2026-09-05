import { useSpeech } from '../../hooks/useSpeech';
import type { InteractiveData } from '../../services/homeworkService';
import { Volume2, Square, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';

interface Props {
  data: InteractiveData;
}

export function ListenAndArrange({ data }: Props) {
  const { options = [], correct_order = [], listening_text } = data;
  const { speak, pause, resume, stop, isPlaying, isPaused, isSupported } = useSpeech(listening_text);

  const handleToggleAudio = () => {
    if (isPlaying) {
      if (isPaused) {
        resume();
      } else {
        pause();
      }
    } else {
      speak();
    }
  };

  // Validate that we have a reliable mapping between options and correct_order
  const isValidMapping = 
    options.length > 0 && 
    correct_order.length === options.length && 
    options.every(opt => opt.id && correct_order.includes(opt.id));

  const getSequenceNumber = (id: string) => {
    const index = correct_order.indexOf(id);
    return index !== -1 ? index + 1 : null;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Audio Card */}
      {isSupported && listening_text && (
        <div className="p-4 rounded-2xl bg-surface border border-white/10 shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <Volume2 className="w-5 h-5 text-primary" />
            <span>Listen to the story</span>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleToggleAudio}
              variant={isPlaying && !isPaused ? "default" : "secondary"}
              className="flex-1 rounded-full"
            >
              {isPlaying && !isPaused ? (
                <>
                  <Square className="w-4 h-4 mr-2 fill-current" />
                  Pause
                </>
              ) : isPaused ? (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 mr-2" />
                  Listen to Story
                </>
              )}
            </Button>
            {(isPlaying || isPaused) && (
              <Button onClick={stop} variant="outline" size="icon" className="rounded-full flex-shrink-0" aria-label="Stop">
                <Square className="w-4 h-4 fill-current" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Answer Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold tracking-tight text-foreground/90 uppercase text-sm">Correct Order</h3>
        </div>

        {!isValidMapping ? (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>Correct picture order could not be determined.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {options.map((opt) => {
              if (!opt.id) return null;
              const seqNum = getSequenceNumber(opt.id);

              return (
                <div
                  key={opt.id}
                  className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-white/10 overflow-hidden bg-surface aspect-square"
                >
                  {/* Number Badge */}
                  {seqNum && (
                    <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center shadow-lg border-2 border-background z-10">
                      {seqNum}
                    </div>
                  )}

                  {/* Image */}
                  {opt.image ? (
                    <img
                      src={opt.image}
                      alt={opt.text || "Worksheet picture"}
                      loading="lazy"
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-card">
                      <span className="text-muted-foreground text-xs">{opt.text}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
