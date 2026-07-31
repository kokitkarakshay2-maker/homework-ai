import type { InteractiveData } from '../../services/homeworkService';
import { Check, X } from 'lucide-react';

interface Props {
  data: InteractiveData;
}

export function TrueFalse({ data }: Props) {
  if (data.state === undefined) return null;
  
  return (
    <div className="flex gap-4">
      <div className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
        data.state === true
          ? 'bg-[#4ade80]/20 border-[#4ade80]/40 text-[#4ade80]'
          : 'bg-surface border-white/5 text-gray-500'
      }`}>
        <Check className="w-5 h-5" />
        <span className="font-semibold">True</span>
      </div>
      
      <div className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
        data.state === false
          ? 'bg-[#f87171]/20 border-[#f87171]/40 text-[#f87171]'
          : 'bg-surface border-white/5 text-gray-500'
      }`}>
        <X className="w-5 h-5" />
        <span className="font-semibold">False</span>
      </div>
    </div>
  );
}
