import React, { useEffect, useState } from 'react';
import type { InteractiveData } from '../../services/homeworkService';
import { Check } from 'lucide-react';

interface Props {
  data: InteractiveData;
  questionStr?: string;
}

export function NumberLine({ data, questionStr }: Props) {
  let { start, steps, result, operation, max = 10 } = data;

  // Fallback Parser
  if (start === undefined || steps === undefined || result === undefined) {
    if (questionStr) {
      // Regex to match "6 - 2" or "4 + 3" or "3+5"
      const match = questionStr.match(/(\d+)\s*([\+\-])\s*(\d+)/);
      if (match) {
        start = parseInt(match[1], 10);
        operation = match[2] === '+' ? 'add' : 'subtract';
        steps = parseInt(match[3], 10);
        result = operation === 'add' ? start + steps : start - steps;
        max = Math.max(10, result + 2, start + 2);
        console.log("NumberLine fallback parsed:", { start, operation, steps, result, max });
      } else {
        console.warn("NumberLine fallback parsing failed for:", questionStr);
      }
    }
  }

  // Final check
  if (start === undefined || steps === undefined || result === undefined) {
    return (
      <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-center font-medium">
        ⚠️ Developer Warning: Interactive worksheet contains zero items.
      </div>
    );
  }

  const isAdd = operation === 'add';
  const end_value = result;
  
  // Create state to avoid hydration mismatch, though this is client-side only anyway.
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    if (animationStep < steps!) {
      const timer = setTimeout(() => {
        setAnimationStep(prev => prev + 1);
      }, 500); // 500ms per jump
      return () => clearTimeout(timer);
    }
  }, [animationStep, steps]);

  const line_start = 0;
  const line_end = max!;
  const numTicks = line_end - line_start + 1;
  
  // SVG Coordinates
  const width = 1000;
  const height = 120;
  const paddingX = 40;
  const usableWidth = width - paddingX * 2;
  const tickSpacing = usableWidth / (numTicks - 1 || 1);
  const baselineY = 80;

  const getX = (val: number) => paddingX + (val - line_start) * tickSpacing;

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl bg-surface border border-white/5 overflow-hidden">
      <div className="w-full overflow-x-auto pb-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-auto drop-shadow-sm">
          
          {/* Main Line */}
          <line x1={paddingX - 10} y1={baselineY} x2={width - paddingX + 10} y2={baselineY} stroke="#4b5563" strokeWidth="3" />
          
          {/* Ticks and Numbers */}
          {Array.from({ length: numTicks }).map((_, i) => {
            const val = line_start + i;
            const x = getX(val);
            const isLanded = animationStep === steps && val === end_value;
            
            return (
              <g key={val} className="transition-all duration-300">
                <line x1={x} y1={baselineY - 8} x2={x} y2={baselineY + 8} stroke="#4b5563" strokeWidth="3" />
                
                {isLanded ? (
                  <>
                    <circle cx={x} cy={baselineY + 24} r="14" fill="#22c55e" opacity="0.2" className="animate-ping" />
                    <circle cx={x} cy={baselineY + 24} r="14" fill="#22c55e" />
                    {/* SVG Checkmark */}
                    <path d="M x-5 y+24 L x-1 y+28 L x+5 y+20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" transform={`translate(${x - 12}, ${baselineY + 12})`} />
                    <svg x={x - 10} y={baselineY + 14} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </>
                ) : (
                  <text 
                    x={x} 
                    y={baselineY + 29} 
                    textAnchor="middle" 
                    fill="#9ca3af" 
                    fontSize="15"
                  >
                    {val}
                  </text>
                )}
              </g>
            );
          })}

          {/* Start Marker */}
          <circle cx={getX(start!)} cy={baselineY} r="6" fill="#f87171" />

          {/* Jumps */}
          {Array.from({ length: steps! }).map((_, i) => {
            const jumpStartVal = isAdd ? start! + i : start! - i;
            const jumpEndVal = isAdd ? jumpStartVal + 1 : jumpStartVal - 1;
            
            // Only render if the animation step has reached this jump
            if (animationStep <= i) return null;

            const x1 = getX(jumpStartVal);
            const x2 = getX(jumpEndVal);
            const midX = (x1 + x2) / 2;
            const controlY = baselineY - 40; // Arc height

            // Draw arrow head correctly based on direction
            // arrow pointing left if subtracting, right if adding
            // For left pointing: triangle tip at x2, pointing left.
            // For right pointing: triangle tip at x2, pointing right.
            const arrowHead = isAdd 
              ? `${x2 - 10},${baselineY - 14} ${x2},${baselineY - 2} ${x2 - 14},${baselineY - 4}`
              : `${x2 + 10},${baselineY - 14} ${x2},${baselineY - 2} ${x2 + 14},${baselineY - 4}`;

            const arrowRotation = isAdd ? "rotate(12)" : "rotate(-12)";

            return (
              <g key={`jump-${i}`} className="animate-in fade-in zoom-in duration-300">
                <path 
                  d={`M ${x1} ${baselineY - 2} Q ${midX} ${controlY} ${x2 + (isAdd ? -4 : 4)} ${baselineY - 6}`}
                  fill="none"
                  stroke={isAdd ? "#a855f7" : "#3b82f6"} // purple for add, blue for sub
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Arrow head */}
                <polygon 
                  points={arrowHead}
                  fill={isAdd ? "#a855f7" : "#3b82f6"}
                  style={{ transformOrigin: isAdd ? `${x2 - 10}px ${baselineY - 10}px` : `${x2 + 10}px ${baselineY - 10}px`, transform: arrowRotation }}
                />
              </g>
            );
          })}
        </svg>
      </div>

      <div className={`text-center text-xl font-bold transition-opacity duration-700 ${
        animationStep === steps! ? 'opacity-100 text-white' : 'opacity-0'
      }`}>
        {start} {isAdd ? '+' : '-'} {steps} = <span className={isAdd ? "text-[#a855f7]" : "text-[#60a5fa]"}>{end_value}</span>
      </div>
    </div>
  );
}
