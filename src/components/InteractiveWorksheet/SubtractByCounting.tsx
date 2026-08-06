import { useEffect, useState } from 'react';
import type { InteractiveData } from '../../services/homeworkService';
import { ShapeRenderer } from './ShapeRenderer';
import { X } from 'lucide-react';

interface Props {
  data: InteractiveData;
}

export function SubtractByCounting({ data }: Props) {
  const { total, subtract, shape } = data;
  const [animationStep, setAnimationStep] = useState(0);

  if (total === undefined || subtract === undefined) return null;

  const validTotal = Math.max(0, total);
  const validSubtract = Math.min(validTotal, Math.max(0, subtract));
  const remaining = validTotal - validSubtract;
  
  // Auto advance animation steps
  useEffect(() => {
    if (animationStep < validSubtract) {
      const timer = setTimeout(() => {
        setAnimationStep(prev => prev + 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [animationStep, validSubtract]);

  const items = Array.from({ length: validTotal });

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl bg-surface border border-white/5">
      
      {/* Objects Row */}
      <div className="flex flex-wrap gap-4 items-center justify-center min-h-[80px]">
        {items.map((_, i) => {
          // We cross out from the end (or from the start, let's cross out from the right)
          const isCrossedOutIndex = validTotal - 1 - i < validSubtract;
          // The specific step for this item (0-indexed based on cross-out order)
          const crossOutOrder = validSubtract - (validTotal - i);
          const isAnimatingCross = isCrossedOutIndex && animationStep > crossOutOrder;

          return (
            <div key={i} className="relative w-12 h-12 flex items-center justify-center transition-all duration-500">
              {/* The Shape */}
              <div className={`w-full h-full transition-opacity duration-500 ${isAnimatingCross ? 'opacity-20 grayscale' : 'opacity-100'}`}>
                <ShapeRenderer shape={shape || 'circle'} color="#fde047" className="w-full h-full drop-shadow-sm" />
              </div>
              
              {/* The Red Cross */}
              {isCrossedOutIndex && (
                <div 
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                    isAnimatingCross ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  }`}
                >
                  <X className="w-10 h-10 text-red-500 drop-shadow-md stroke-[3]" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="h-px w-full bg-white/10 my-2" />

      {/* Answer Area */}
      <div className={`flex flex-col items-center gap-2 transition-opacity duration-700 ${
        animationStep === validSubtract ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="text-gray-400 font-medium text-[15px] uppercase tracking-wider">
          Remaining
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: remaining }).map((_, i) => (
             <div key={`rem-${i}`} className="w-6 h-6">
                <ShapeRenderer shape={shape || 'circle'} color="#fde047" className="w-full h-full" />
             </div>
          ))}
        </div>
        <div className="text-2xl font-bold text-white mt-2">
          Answer = {remaining}
        </div>
      </div>

    </div>
  );
}
