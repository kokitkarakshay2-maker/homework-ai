import { PenTool } from 'lucide-react';

export function InstructionCard({ answer }: { answer: string }) {
  return (
    <div className="border-2 border-dashed border-primary/40 rounded-3xl p-8 bg-primary/5 text-center relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <PenTool className="w-24 h-24 text-primary" />
      </div>
      
      <div className="relative z-10">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
          <PenTool className="w-5 h-5" />
          Drawing Instructions
        </h3>
        <p className="text-xl md:text-2xl font-medium leading-relaxed text-foreground/90 max-w-lg mx-auto">
          {answer}
        </p>
      </div>
    </div>
  );
}
