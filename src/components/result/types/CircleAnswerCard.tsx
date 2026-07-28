import { parseList } from './utils';

export function CircleAnswerCard({ answer, answersArray }: { answer: string; answersArray?: string[] }) {
  const items = parseList(answer, answersArray);

  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item, idx) => (
        <div key={idx} className="relative inline-block px-6 py-3">
          <div className="absolute inset-0 border-[3px] border-primary rounded-[50%] rotate-[-2deg] opacity-80" />
          <div className="absolute inset-0 border-[2px] border-primary rounded-[50%] rotate-[1deg] scale-105 opacity-50" />
          <span className="relative z-10 text-2xl font-bold text-foreground">
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}
