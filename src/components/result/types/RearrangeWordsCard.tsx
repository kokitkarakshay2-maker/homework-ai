import { parseList } from './utils';

export function RearrangeWordsCard({ answer, answersArray }: { answer: string; answersArray?: string[] }) {
  const items = parseList(answer, answersArray);

  return (
    <div className="bg-surface/30 p-6 rounded-3xl border border-white/5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="text-xl">✍️</span> Write these words
      </h3>
      <div className="flex flex-col gap-3">
        {items.map((item, idx) => (
          <div key={idx} className="bg-background/80 px-6 py-4 rounded-2xl border border-white/5 shadow-sm flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary/50 shrink-0" />
            <span className="text-xl font-bold text-foreground tracking-wide">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
