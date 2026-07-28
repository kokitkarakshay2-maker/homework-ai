import { ArrowRight } from 'lucide-react';

export function MatchingCard({ answer }: { answer: string }) {
  // Try to parse pairs. Assume pairs are separated by newlines and mapped with "-" or ":" or "->" or "to"
  const lines = answer.split('\n').map(s => s.trim()).filter(Boolean);
  
  const pairs = lines.map(line => {
    // Regex to split by common separators: "->", "-", ":", " to "
    const match = line.split(/\s*(?:->|-|:|\bto\b)\s*/);
    if (match.length >= 2) {
      return { left: match[0].trim(), right: match.slice(1).join(' ').trim() };
    }
    // Fallback if not matched cleanly
    return { left: line, right: '' };
  });

  return (
    <div className="bg-surface/30 p-6 rounded-3xl border border-white/5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
        <span className="text-xl">🔗</span> Match the following
      </h3>
      <div className="flex flex-col gap-4">
        {pairs.map((pair, idx) => (
          <div key={idx} className="flex items-center gap-4 w-full">
            <div className="flex-1 bg-background/50 px-4 py-4 rounded-2xl border border-white/5 text-center shadow-sm">
              <span className="font-semibold text-foreground text-lg">{pair.left}</span>
            </div>
            {pair.right && (
              <>
                <ArrowRight className="w-5 h-5 text-primary shrink-0 opacity-70" />
                <div className="flex-1 bg-primary/10 px-4 py-4 rounded-2xl border border-primary/20 text-center shadow-sm">
                  <span className="font-semibold text-primary text-lg">{pair.right}</span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
