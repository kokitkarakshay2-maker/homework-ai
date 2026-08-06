import type { InteractiveData } from '../../services/homeworkService';
import { ArrowRight } from 'lucide-react';

interface Props {
  data: InteractiveData;
}

export function Matching({ data }: Props) {
  if (!data.matches) return null;
  
  return (
    <div className="flex flex-col gap-5">
      {data.matches.map((match, i) => (
        <div key={i} className="flex items-center justify-between gap-2 w-full group">
          <div className="w-[40%] p-4 rounded-xl bg-surface border border-white/10 text-center font-medium text-gray-100 shadow-sm transition-transform group-hover:-translate-y-0.5">
            {match.left}
          </div>
          
          <div className="flex-1 flex items-center justify-center px-2">
            <svg className="w-full h-2 text-[#3b82f6]/50" preserveAspectRatio="none" viewBox="0 0 100 8">
              <line x1="0" y1="4" x2="100" y2="4" stroke="currentColor" strokeWidth="2" strokeDasharray="6,6" className="animate-[dash_1s_linear_infinite]" />
            </svg>
            <div className="w-2 h-2 rounded-full bg-[#3b82f6]/70 shrink-0" />
          </div>

          <div className="w-[40%] p-4 rounded-xl bg-surface border border-white/10 text-center font-medium text-gray-100 shadow-sm transition-transform group-hover:-translate-y-0.5">
            {match.right}
          </div>
        </div>
      ))}
    </div>
  );
}
