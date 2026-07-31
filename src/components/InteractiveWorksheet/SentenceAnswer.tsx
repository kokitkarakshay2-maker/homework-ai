import type { InteractiveData } from '../../services/homeworkService';
import { Pencil } from 'lucide-react';

interface Props {
  data: InteractiveData;
}

export function SentenceAnswer({ data }: Props) {
  if (!data.answer_text) return null;
  
  return (
    <div className="p-5 rounded-xl bg-surface/50 border border-white/5 flex gap-4">
      <Pencil className="w-5 h-5 text-primary/70 shrink-0 mt-0.5" />
      <p className="text-[17px] leading-relaxed text-white font-medium">
        {data.answer_text}
      </p>
    </div>
  );
}
