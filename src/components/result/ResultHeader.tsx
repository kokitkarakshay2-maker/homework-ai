import { ArrowLeft } from 'lucide-react';

interface ResultHeaderProps {
  subject: string;
  worksheetTitle?: string;
  onBack: () => void;
}

export function ResultHeader({ subject, worksheetTitle, onBack }: ResultHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl h-16 flex items-center px-4 border-b border-white/5">
      <button 
        onClick={onBack}
        className="w-12 h-12 -ml-2 rounded-full flex items-center justify-center hover:bg-white/5 active:bg-white/10 transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <div className="ml-2 flex-1 min-w-0">
        <h1 className="text-base font-semibold text-foreground truncate">{subject || "Solution"}</h1>
        {worksheetTitle && (
          <p className="text-xs text-muted-foreground truncate">{worksheetTitle}</p>
        )}
      </div>
    </header>
  );
}
