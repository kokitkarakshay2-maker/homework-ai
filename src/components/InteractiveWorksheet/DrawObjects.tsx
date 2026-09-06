import type { InteractiveData } from '../../services/homeworkService';
import { Volume2 } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

interface Props {
  data: InteractiveData;
}

const ObjectVisual = ({ name, className }: { name: string, className?: string }) => {
  const normalized = name.toLowerCase().trim();
  
  if (normalized.includes('mango')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M14 4C10 4 6 7 5 11C4 16 7 20 12 20C17 20 20 16 19 11C18 7 16 4 14 4Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5"/>
        <path d="M14 4C14 2 12 1 12 1" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    );
  }
  if (normalized.includes('flower')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="3" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5" />
        <circle cx="12" cy="5" r="3" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
        <circle cx="12" cy="19" r="3" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
        <circle cx="5" cy="12" r="3" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
        <circle cx="19" cy="12" r="3" fill="#F472B6" stroke="#DB2777" strokeWidth="1.5" />
      </svg>
    );
  }
  if (normalized.includes('ball') && !normalized.includes('balloon')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="8" fill="#F87171" stroke="#DC2626" strokeWidth="1.5" />
        <path d="M6 8C9 10 15 10 18 8" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 16C9 14 15 14 18 16" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (normalized.includes('balloon')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2C9 2 7 5 7 9C7 13 10 16 12 18C14 16 17 13 17 9C17 5 15 2 12 2Z" fill="#3B82F6" stroke="#2563EB" strokeWidth="1.5" />
        <path d="M12 18L11 20H13L12 18Z" fill="#2563EB" />
        <path d="M12 20V23" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (normalized.includes('star')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2L15 8L21 9L16.5 13.5L18 20L12 17L6 20L7.5 13.5L3 9L9 8L12 2Z" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }
  if (normalized.includes('apple')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 7C9 4 4 6 4 12C4 18 8 22 12 22C16 22 20 18 20 12C20 6 15 4 12 7Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
        <path d="M12 7V3M12 7C14 5 16 4 16 4" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  
  // Generic Fallback (a simple dot/circle if nothing else matches)
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="8" fill="#8B5CF6" stroke="#7C3AED" strokeWidth="1.5" />
    </svg>
  );
}

const DrawObjectCard = ({ quantity, objectName }: { quantity: number, objectName: string }) => {
  const { speak, isPlaying } = useSpeech(`Draw ${quantity} ${objectName}`);

  return (
    <div className="flex flex-col p-5 bg-black/20 rounded-xl border border-white/5 gap-4">
      {/* Visual Grid */}
      <div 
        className={`flex flex-wrap gap-2 ${quantity > 10 ? 'justify-start items-center' : 'justify-center'} bg-black/30 p-4 rounded-xl`}
        aria-label={`${quantity} ${objectName}`}
      >
        {quantity > 30 ? (
          <div className="flex items-center gap-3">
            <ObjectVisual name={objectName} className="w-10 h-10 drop-shadow-md" />
            <span className="text-2xl font-black text-white/80 tracking-widest">× {quantity}</span>
          </div>
        ) : (
          Array.from({ length: quantity }).map((_, i) => (
            <ObjectVisual key={i} name={objectName} className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md transition-transform hover:scale-110" />
          ))
        )}
      </div>
      
      {/* Text Instruction & TTS */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-gray-200 capitalize flex items-center gap-2">
            <span className="text-primary">{quantity}</span> {objectName}
          </span>
          <span className="text-sm text-gray-400 mt-1">
            Draw <strong className="text-white">{quantity}</strong> {objectName} in your physical worksheet.
          </span>
        </div>
        
        <button
          onClick={() => speak()}
          className={`shrink-0 ml-4 p-3 rounded-full transition-colors ${
            isPlaying ? 'bg-primary/20 text-primary' : 'bg-surface hover:bg-surface-highlight text-gray-400'
          }`}
          aria-label={`Listen to instruction`}
        >
          <Volume2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export function DrawObjects({ data }: Props) {
  if (!data.draw_items || data.draw_items.length === 0) return null;

  // Validation: If any item is missing essential fields, fallback to generic renderer
  const isValid = data.draw_items.every(i => 
    typeof i.quantity === 'number' && 
    i.quantity > 0 && 
    typeof i.object === 'string' && 
    i.object.trim().length > 0
  );
  if (!isValid) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-sm font-semibold tracking-wider text-gray-500 uppercase px-1">
        Correct Answer
      </h3>
      <div className="bg-surface/50 rounded-2xl p-5 border border-white/5 flex flex-col gap-6">
        {data.draw_items.map((item, index) => (
          <DrawObjectCard 
            key={index} 
            quantity={item.quantity} 
            objectName={item.object} 
          />
        ))}
      </div>
    </div>
  );
}
