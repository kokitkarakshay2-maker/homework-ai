import { getColorClass, parseList } from './utils';

export function ColorCircleCard({ answer, color, answersArray }: { answer: string; color?: string; answersArray?: string[] }) {
  const items = parseList(answer, answersArray);
  const colorClass = getColorClass(color);

  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item, idx) => (
        <div key={idx} className={`w-24 h-24 rounded-full border-2 shadow-sm flex items-center justify-center text-center p-2 ${colorClass}`}>
          <span className="text-lg font-bold break-words">{item}</span>
        </div>
      ))}
    </div>
  );
}
