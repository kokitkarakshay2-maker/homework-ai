import type { InteractiveData } from '../../services/homeworkService';

interface Props {
  data: InteractiveData;
}

export function FillBlank({ data }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[17px] leading-relaxed text-white bg-surface p-5 rounded-xl border border-white/5">
      {data.text && <span>{data.text}</span>}
      {data.blank && (
        <span className="px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-xl font-medium shadow-sm">
          {data.blank}
        </span>
      )}
    </div>
  );
}
