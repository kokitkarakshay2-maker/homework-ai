export function CrosswordCard({ answer }: { answer: string }) {
  // Basic parsing for Across and Down if present
  const isSeparated = answer.toLowerCase().includes('across') && answer.toLowerCase().includes('down');
  
  if (!isSeparated) {
    // Fallback if the AI just gave a list
    const items = answer.split('\n').map(s => s.trim()).filter(Boolean);
    return (
      <div className="bg-surface/30 p-6 rounded-3xl border border-white/5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="text-xl">🧩</span> Crossword Answers
        </h3>
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="text-lg font-medium text-foreground bg-white/5 px-4 py-2 rounded-xl">
              {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Parse "Across" and "Down"
  // Assuming format like:
  // Across:
  // 1. Apple
  // 2. Banana
  // Down:
  // 3. Cherry
  // Usually this splits into parts: [before across, across list, down list] depending on order.
  // A safer parsing:
  const lines = answer.split('\n').map(s => s.trim()).filter(Boolean);
  const across: string[] = [];
  const down: string[] = [];
  let currentMode: 'across' | 'down' | null = null;

  lines.forEach(line => {
    const l = line.toLowerCase();
    if (l.includes('across')) {
      currentMode = 'across';
      return;
    }
    if (l.includes('down')) {
      currentMode = 'down';
      return;
    }
    if (currentMode === 'across') {
      across.push(line);
    } else if (currentMode === 'down') {
      down.push(line);
    }
  });

  return (
    <div className="bg-surface/30 p-6 rounded-3xl border border-white/5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
        <span className="text-xl">🧩</span> Crossword Answers
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {across.length > 0 && (
          <div>
            <h4 className="font-bold text-primary mb-3 uppercase tracking-wider text-sm">➔ Across</h4>
            <ul className="space-y-2">
              {across.map((item, idx) => (
                <li key={idx} className="text-base font-medium text-foreground bg-background/50 px-4 py-3 rounded-xl border border-white/5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {down.length > 0 && (
          <div>
            <h4 className="font-bold text-accent mb-3 uppercase tracking-wider text-sm">⬇ Down</h4>
            <ul className="space-y-2">
              {down.map((item, idx) => (
                <li key={idx} className="text-base font-medium text-foreground bg-background/50 px-4 py-3 rounded-xl border border-white/5">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
