import { CopyButton } from './CopyButton';

interface WriteThisCardProps {
  textToWrite: string;
}

export function WriteThisCard({ textToWrite }: WriteThisCardProps) {
  if (!textToWrite) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[12px] uppercase tracking-widest text-[#94A3B8] font-semibold flex items-center gap-2">
          WRITE THIS
        </h2>
        <CopyButton textToCopy={textToWrite} />
      </div>
      
      <div className="bg-[#FDFBF7] p-6 rounded-2xl border border-white/5 shadow-md relative overflow-hidden">
        {/* Notebook line styling effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_27px,#1E1B1620_28px)] bg-[size:100%_28px] pointer-events-none opacity-50" />
        
        <p className="font-mono text-[22px] leading-[28px] text-[#1E1B16] whitespace-pre-wrap relative z-10 font-medium">
          {textToWrite}
        </p>
      </div>
    </div>
  );
}
