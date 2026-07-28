interface QuestionCardProps {
  questionNumber: number;
  questionText: string;
}

export function QuestionCard({ questionText }: QuestionCardProps) {
  return (
    <div className="mb-6">
      <h2 className="text-[12px] uppercase tracking-widest text-[#94A3B8] font-semibold mb-3 flex items-center gap-2">
        QUESTION
      </h2>
      <div className="text-[18px] font-semibold leading-relaxed text-[#F8FAFC] bg-surface/50 p-5 rounded-2xl border border-[rgba(255,255,255,0.08)]">
        {questionText}
      </div>
    </div>
  );
}
