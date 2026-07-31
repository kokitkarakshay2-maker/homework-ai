import type { InteractiveData } from '../../services/homeworkService';
import { PaintBucket } from 'lucide-react';

interface Props {
  data: InteractiveData;
}

export function ColorObjects({ data }: Props) {
  if (!data.options) return null;
  
  return (
    <div className="flex flex-wrap gap-4">
      {data.options.map((opt, i) => (
        <div 
          key={i} 
          className={`flex flex-col items-center gap-3 p-4 rounded-xl min-w-[100px] border transition-all ${
            opt.selected 
              ? 'bg-[#4ade80]/20 border-[#4ade80]/40 text-[#4ade80] shadow-[0_0_20px_rgba(74,222,128,0.15)]' 
              : 'bg-surface border-white/5 text-gray-500'
          }`}
        >
          <PaintBucket className={`w-8 h-8 ${opt.selected ? 'text-[#4ade80]' : 'opacity-30'}`} />
          <span className="font-medium text-[15px]">{opt.text}</span>
        </div>
      ))}
    </div>
  );
}
