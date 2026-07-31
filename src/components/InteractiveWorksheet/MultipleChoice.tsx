import type { InteractiveData } from '../../services/homeworkService';
import { CheckCircle2, Circle } from 'lucide-react';

interface Props {
  data: InteractiveData;
}

export function MultipleChoice({ data }: Props) {
  if (!data.options) return null;
  
  return (
    <div className="flex flex-col gap-3">
      {data.options.map((opt, i) => (
        <div 
          key={i} 
          className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
            opt.selected 
              ? 'bg-primary/10 border-primary/30 text-white' 
              : 'bg-surface border-white/5 text-gray-400'
          }`}
        >
          {opt.selected ? (
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          ) : (
            <Circle className="w-5 h-5 opacity-50 shrink-0" />
          )}
          <span className="text-[17px]">{opt.text}</span>
        </div>
      ))}
    </div>
  );
}
