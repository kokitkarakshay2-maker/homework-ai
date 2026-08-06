import { mapColorName } from '../../lib/colors';
import type { LegendItem } from '../../services/homeworkService';


interface Props {
  legend: LegendItem[];
}

export function WorksheetLegend({ legend }: Props) {
  if (!legend || !Array.isArray(legend) || legend.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 mb-4 p-4 bg-surface border border-white/5 rounded-xl shadow-sm">
      <div className="text-sm font-semibold text-gray-400 w-full mb-1 uppercase tracking-wider">Legend</div>
      {legend.map((item, index) => {
        const colorHex = mapColorName(item.color);
        return (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full border border-black/10 shadow-sm"
              style={{ backgroundColor: colorHex }}
            />
            <span className="text-[15px] font-medium text-gray-200">{item.concept}</span>
          </div>
        );
      })}
    </div>
  );
}
