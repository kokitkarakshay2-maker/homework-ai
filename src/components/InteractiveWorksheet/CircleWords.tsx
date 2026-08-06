import type { InteractiveData } from '../../services/homeworkService';
import { mapColorName } from '../../lib/colors';

interface Props {
  data: InteractiveData;
}

export function CircleWords({ data }: Props) {
  if (!data.options) return null;
  
  return (
    <div className="flex flex-wrap gap-4 p-5 rounded-xl bg-surface border border-white/5">
      {data.options.map((opt, i) => {
        const colorHex = opt.color ? mapColorName(opt.color) : '#3b82f6'; // Blue default for circling
        return (
          <div 
            key={i} 
            className={`px-5 py-2.5 rounded-[50px] text-[17px] font-medium transition-all ${
              opt.selected 
                ? 'border-2 shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:scale-105' 
                : 'border border-white/10 text-gray-400 bg-transparent'
            }`}
            style={{
              borderColor: opt.selected ? colorHex : undefined,
              color: opt.selected ? colorHex : undefined,
              backgroundColor: opt.selected ? `${colorHex}15` : undefined, // 15% opacity
            }}
          >
            {opt.text}
          </div>
        );
      })}
    </div>
  );
}
