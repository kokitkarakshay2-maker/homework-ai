import type { InteractiveData } from '../../services/homeworkService';
import { CheckCircle2, Circle } from 'lucide-react';
import { mapColorName } from '../../lib/colors';

interface Props {
  data: InteractiveData;
}

export function MultipleChoice({ data }: Props) {
  if (!data.options) return null;
  
  return (
    <div className="flex flex-col gap-3">
      {data.options.map((opt, i) => {
        const colorHex = opt.color ? mapColorName(opt.color) : '#3b82f6';
        return (
          <div 
            key={i} 
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-default ${
              opt.selected 
                ? 'shadow-md hover:scale-[1.01]' 
                : 'bg-surface border-white/5 text-gray-400 hover:bg-white/5'
            }`}
            style={{
              backgroundColor: opt.selected ? `${colorHex}15` : undefined,
              borderColor: opt.selected ? `${colorHex}50` : undefined,
              color: opt.selected ? '#ffffff' : undefined,
            }}
          >
            {opt.selected ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: colorHex }} />
            ) : (
              <Circle className="w-5 h-5 opacity-50 shrink-0" />
            )}
            <span className="text-[17px] leading-snug">{opt.text}</span>
          </div>
        );
      })}
    </div>
  );
}
