import { Check } from 'lucide-react';
import { parseList } from './utils';

export function TickAnswerCard({ answer, answersArray }: { answer: string; answersArray?: string[] }) {
  const items = parseList(answer, answersArray);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center shrink-0 border border-success/30">
            <Check className="w-6 h-6 text-success" strokeWidth={3} />
          </div>
          <span className="text-2xl font-bold text-foreground">
            {item}
          </span>
        </div>
      ))}
    </div>
  );
}
