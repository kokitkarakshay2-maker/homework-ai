import { getColorClass } from './types/utils';

interface ColourKeyCardProps {
  colorMapping: Record<string, string>; // e.g. { 'Red': '2', 'Blue': '3' }
}

export function ColourKeyCard({ colorMapping }: ColourKeyCardProps) {
  const entries = Object.entries(colorMapping);
  
  if (entries.length === 0) return null;

  return (
    <div className="bg-surface/30 p-4 rounded-3xl border border-white/5 mb-6">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="text-xl">🎨</span> Colour Key
      </h3>
      <div className="flex flex-wrap gap-3">
        {entries.map(([color, answer], idx) => {
          const colorClass = getColorClass(color);
          return (
            <div key={idx} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 shadow-sm ${colorClass}`}>
              <div className="w-3 h-3 rounded-full bg-current opacity-80" />
              <span className="font-bold">{answer}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
