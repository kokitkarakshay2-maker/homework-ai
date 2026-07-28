import { getColorClass, parseList } from './utils';

export function ColorBoxCard({ answer, color, answersArray }: { answer: string; color?: string; answersArray?: string[] }) {
  const items = parseList(answer, answersArray);
  const colorClass = getColorClass(color);

  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item, idx) => (
        <div key={idx} className={`px-6 py-4 rounded-xl border-2 shadow-sm flex items-center justify-center min-w-[80px] ${colorClass}`}>
          <span className="text-xl font-bold">{item}</span>
        </div>
      ))}
    </div>
  );
}
