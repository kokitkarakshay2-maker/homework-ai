import { parseList } from './utils';

export function FillBlankCard({ answer, answersArray }: { answer: string; answersArray?: string[] }) {
  const items = parseList(answer, answersArray);

  return (
    <div className="bg-surface/30 p-6 rounded-3xl border border-white/5">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
        <span className="text-xl">✍️</span> Fill these blanks
      </h3>
      <ol className="space-y-4">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-4 bg-background/50 p-4 rounded-2xl border border-white/5 shadow-sm">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold shrink-0">
              {idx + 1}
            </span>
            <span className="text-xl font-bold text-foreground underline decoration-primary/50 decoration-2 underline-offset-4">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
