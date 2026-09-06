import type { InteractiveData } from '../../services/homeworkService';

interface Props {
  data: InteractiveData;
}

export function FillSequence({ data }: Props) {
  if (!data.subquestions || data.subquestions.length === 0) return null;

  return (
    <div className="flex flex-col gap-6 w-full">
      <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase px-1">
        Correct Answer
      </h3>
      
      {data.subquestions.map((subq, index) => (
        <div key={index} className="bg-surface/50 rounded-2xl border border-white/5 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white/5 px-4 py-3 flex items-center gap-3 border-b border-white/5">
            <div className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold uppercase shrink-0">
              {subq.id || String.fromCharCode(97 + index)}
            </div>
            <span className="font-medium text-gray-300">
              {subq.instruction || 'Complete the sequence'}
            </span>
          </div>

          {/* Sequence rendering */}
          <div className="p-4 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {subq.sequence.map((num, i) => {
                const isBlank = subq.blanks.includes(num);
                const isLast = i === subq.sequence.length - 1;
                
                return (
                  <div key={i} className="flex items-center gap-2">
                    {isBlank ? (
                      <div className="px-3 py-1.5 min-w-[3rem] text-center rounded-lg bg-primary/20 border-2 border-primary/50 text-primary font-bold shadow-[0_0_10px_rgba(var(--primary),0.2)]">
                        {num}
                      </div>
                    ) : (
                      <div className="px-3 py-1.5 min-w-[3rem] text-center rounded-lg bg-white/5 text-gray-300 font-medium">
                        {num}
                      </div>
                    )}
                    {!isLast && (
                      <span className="text-white/20 font-bold">→</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Explicit answer instruction */}
            <div className="mt-2 bg-black/20 p-3 rounded-xl border border-white/5">
              <span className="text-sm text-gray-400 block mb-1">Write in the blanks:</span>
              <span className="text-lg font-bold tracking-wider text-white">
                {subq.blanks.join(', ')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
