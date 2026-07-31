import type { InteractiveData } from '../../services/homeworkService';
import { CheckSquare, Square } from 'lucide-react';

interface Props {
  data: InteractiveData;
}

export function TickCorrect({ data }: Props) {
  if (!data.options) return null;
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {data.options.map((opt, i) => (
        <div 
          key={i} 
          className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
            opt.selected 
              ? 'bg-primary/10 border-primary/30 text-white' 
              : 'bg-surface border-white/5 text-gray-400'
          }`}
        >
          {opt.selected ? (
            <CheckSquare className="w-5 h-5 text-primary shrink-0" />
          ) : (
            <Square className="w-5 h-5 opacity-50 shrink-0" />
          )}
          <span className="text-[15px] font-medium">{opt.text}</span>
        </div>
      ))}
    </div>
  );
}
