import type { InteractiveData } from '../../services/homeworkService';

interface Props {
  data: InteractiveData;
}

export function CircleWords({ data }: Props) {
  if (!data.options) return null;
  
  return (
    <div className="flex flex-wrap gap-4 p-5 rounded-xl bg-surface border border-white/5">
      {data.options.map((opt, i) => (
        <div 
          key={i} 
          className={`px-5 py-2.5 rounded-full text-[17px] font-medium transition-all ${
            opt.selected 
              ? 'border-2 border-primary text-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.2)]' 
              : 'border border-white/10 text-gray-400 bg-surface'
          }`}
        >
          {opt.text}
        </div>
      ))}
    </div>
  );
}
