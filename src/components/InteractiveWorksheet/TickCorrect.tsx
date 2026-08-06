import type { InteractiveData } from '../../services/homeworkService';
import { Check, Square } from 'lucide-react';
import { mapColorName } from '../../lib/colors';

interface Props {
  data: InteractiveData;
}

export function TickCorrect({ data }: Props) {
  if (!data.options) return null;
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {data.options.map((opt, i) => {
        const colorHex = opt.color ? mapColorName(opt.color) : '#3b82f6'; // Neutral blue default
        return (
          <div 
            key={i} 
            className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-surface transition-all cursor-default"
          >
            <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
              {opt.selected ? (
                <Check 
                  className="w-10 h-10 absolute z-10 drop-shadow-md animate-in zoom-in duration-300" 
                  style={{ color: colorHex }} 
                />
              ) : (
                <Square className="w-6 h-6 opacity-30" />
              )}
            </div>
            <span className={`text-[16px] font-medium transition-colors ${opt.selected ? 'text-gray-100' : 'text-gray-400'}`}>
              {opt.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
