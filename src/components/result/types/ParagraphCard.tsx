export function ParagraphCard({ answer }: { answer: string }) {
  return (
    <div className="bg-[#1a1a1a] p-8 md:p-10 rounded-3xl border-2 border-white/10 shadow-xl relative overflow-hidden">
      {/* Wider notebook line styling effect for paragraphs */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_31px,#ffffff08_32px)] bg-[size:100%_32px] pointer-events-none opacity-60" />
      
      <div className="relative z-10">
        <p className="font-serif text-lg md:text-xl leading-[32px] text-foreground/90 whitespace-pre-wrap">
          {answer}
        </p>
      </div>
    </div>
  );
}
