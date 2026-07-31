import type { InteractiveData } from '../../services/homeworkService';

interface Props {
  data: InteractiveData;
}

export function ShortAnswer({ data }: Props) {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-xl bg-surface border border-white/5">
      {data.question_text && (
        <p className="text-gray-400 text-[15px] mb-2">{data.question_text}</p>
      )}
      <div className="border-b border-white/20 pb-2 relative">
        <span className="text-[17px] font-medium text-white pl-2">
          {data.answer_text}
        </span>
        <div className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary/50" />
      </div>
    </div>
  );
}
