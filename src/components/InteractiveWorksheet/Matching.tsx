import type { InteractiveData } from '../../services/homeworkService';
import { ArrowRight } from 'lucide-react';

interface Props {
  data: InteractiveData;
}

export function Matching({ data }: Props) {
  if (!data.matches) return null;
  
  return (
    <div className="flex flex-col gap-4">
      {data.matches.map((match, i) => (
        <div key={i} className="flex items-center justify-between gap-4 w-full">
          <div className="flex-1 p-4 rounded-xl bg-surface border border-white/10 text-center font-medium text-white shadow-sm">
            {match.left}
          </div>
          <ArrowRight className="w-6 h-6 text-primary/70 shrink-0" />
          <div className="flex-1 p-4 rounded-xl bg-primary/10 border border-primary/20 text-center font-medium text-primary shadow-sm">
            {match.right}
          </div>
        </div>
      ))}
    </div>
  );
}
