import { parseList } from './utils';

export function MCQCard({ answer, answersArray }: { answer: string; answersArray?: string[] }) {
  const items = parseList(answer, answersArray);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, idx) => (
        <div key={idx} className="bg-primary/20 p-5 rounded-2xl border-2 border-primary/40 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/10 animate-pulse pointer-events-none" />
          <span className="relative z-10 text-xl font-bold text-primary tracking-wide">
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}
