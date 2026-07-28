export function NotebookCard({ answer }: { answer: string }) {
  return (
    <div className="bg-[#1e1e1e] p-6 rounded-2xl border-2 border-white/10 shadow-lg relative overflow-hidden">
      {/* Notebook line styling effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_27px,#ffffff08_28px)] bg-[size:100%_28px] pointer-events-none opacity-50" />
      
      <p className="font-mono text-xl md:text-2xl leading-[28px] text-green-400 whitespace-pre-wrap relative z-10 font-medium">
        {answer}
      </p>
    </div>
  );
}
