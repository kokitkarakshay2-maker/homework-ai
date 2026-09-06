import { useMemo } from 'react';
import { Volume2, Square } from 'lucide-react';
import type { InteractiveData } from '../../services/homeworkService';
import { mapColorName } from '../../lib/colors';
import { useSpeech } from '../../hooks/useSpeech';

interface Props {
  data: InteractiveData;
  questionText: string;
  thumbnailUrl?: string;
}

export function ColoringWorksheet({ data, questionText, thumbnailUrl }: Props) {
  const { speak, isPlaying } = useSpeech(questionText);

  // Group options by color for the fallback list
  const groupedOptions = useMemo(() => {
    const groups: Record<string, NonNullable<InteractiveData['options']>> = {};
    if (data.options) {
      data.options.forEach(opt => {
        if (!opt.selected) return; // Only show words that actually need to be colored
        const color = opt.color || 'gray';
        if (!groups[color]) groups[color] = [];
        groups[color].push(opt);
      });
    }
    return groups;
  }, [data.options]);

  const hasGroups = Object.keys(groupedOptions).length > 0;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* 1. Instruction & Audio */}
      <div className="flex items-start justify-between bg-surface/50 p-4 rounded-2xl border border-white/5">
        <p className="text-[17px] font-medium leading-relaxed flex-1">{questionText}</p>
        <button
          onClick={() => speak()}
          className={`shrink-0 ml-4 p-3 rounded-full transition-colors ${
            isPlaying ? 'bg-primary/20 text-primary' : 'bg-surface hover:bg-surface-highlight text-gray-400'
          }`}
          aria-label="Listen to instruction"
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>

      {/* 2. CORRECT ANSWER - Original Image with Overlays */}
      {thumbnailUrl && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase px-1">Correct Answer</h3>
          <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black/20">
            <img 
              src={thumbnailUrl} 
              alt="Worksheet Answer Guide" 
              className="w-full h-auto object-contain block"
            />
            {/* Overlays */}
            {data.options?.map((opt, i) => {
              if (!opt.selected || !opt.box || opt.box.length !== 4) return null;
              const [ymin, xmin, ymax, xmax] = opt.box;
              const colorHex = mapColorName(opt.color);
              
              // opt.box is [ymin, xmin, ymax, xmax] scaled 0-1000
              const top = `${(ymin / 10)}%`;
              const left = `${(xmin / 10)}%`;
              const height = `${((ymax - ymin) / 10)}%`;
              const width = `${((xmax - xmin) / 10)}%`;

              return (
                <div
                  key={`box-${i}`}
                  className="absolute mix-blend-multiply border-[2px] sm:border-[3px]"
                  style={{
                    top, left, width, height,
                    backgroundColor: `${colorHex}66`, // ~40% opacity
                    borderColor: colorHex,
                    borderRadius: '6px'
                  }}
                  title={opt.text}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Word List by Color (Detailed Guide) */}
      {hasGroups && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase px-1">Answer Guide List</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(groupedOptions).map(([color, items]) => {
              const colorHex = mapColorName(color);
              // Find legend label if available
              const legendItem = data.legend?.find(l => l.color.toLowerCase() === color.toLowerCase());
              const label = legendItem ? legendItem.concept : `Colour ${color}`;

              return (
                <div key={color} className="bg-surface/50 rounded-2xl p-4 border border-white/5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <Square className="w-5 h-5 drop-shadow-sm" fill={colorHex} color={colorHex} />
                    <span className="font-semibold text-gray-200">{label}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {items.map((item, i) => (
                      <span key={i} className="px-3 py-1.5 bg-surface text-gray-300 rounded-lg text-sm border border-white/10 shadow-sm">
                        {item.text}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
