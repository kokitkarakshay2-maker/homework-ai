import type { InteractiveData } from '../../services/homeworkService';
import { ShapeRenderer } from './ShapeRenderer';
import { mapColorName, getContrastTextColor } from '../../lib/colors';

interface Props {
  data: InteractiveData;
}

export function ColorObjects({ data }: Props) {
  if (!data.options) return null;
  
  return (
    <div className="flex flex-col gap-2 w-full">
      {data.options.map((opt, i) => {
        const shape = opt.shape || 'square';
        const colorHex = opt.color ? mapColorName(opt.color) : '#f3f4f6';

        return (
          <div 
            key={i} 
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all cursor-default border ${
              opt.selected 
                ? 'bg-surface/80 shadow-sm border-white/5 hover:bg-surface' 
                : 'bg-transparent border-transparent text-gray-500'
            }`}
          >
            <div className={`w-10 h-10 shrink-0 flex items-center justify-center transition-transform ${opt.selected ? 'scale-110' : 'opacity-40'}`}>
              <ShapeRenderer shape={shape} color={opt.selected ? colorHex : '#4b5563'} className="w-full h-full drop-shadow-sm" />
            </div>
            <span className={`font-medium text-[17px] ${opt.selected ? 'text-gray-100' : ''}`}>
              {opt.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}
