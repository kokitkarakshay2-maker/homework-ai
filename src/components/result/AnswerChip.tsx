import { Check } from 'lucide-react';

interface AnswerChipProps {
  text: string;
}

export function AnswerChip({ text }: AnswerChipProps) {
  return (
    <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2.5 rounded-2xl border border-primary/20 shadow-sm">
      <Check className="w-4 h-4 shrink-0" />
      <span className="text-lg font-bold">{text}</span>
    </div>
  );
}
