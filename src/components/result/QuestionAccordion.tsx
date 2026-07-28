import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface QuestionAccordionProps {
  id: number;
  questionNumber: number;
  questionText: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function QuestionAccordion({ 
  id,
  questionNumber, 
  questionText, 
  isExpanded, 
  onToggle, 
  children 
}: QuestionAccordionProps) {
  const accordionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && accordionRef.current) {
      // Small timeout to allow layout to settle before smooth scrolling
      const timeoutId = setTimeout(() => {
        accordionRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isExpanded]);

  return (
    <div 
      ref={accordionRef}
      className="shrink-0 bg-surface border border-white/5 rounded-[24px] overflow-hidden shadow-lg transition-all"
    >
      <div 
        role="button"
        tabIndex={0}
        id={`accordion-button-${id}`}
        aria-expanded={isExpanded}
        aria-controls={`accordion-content-${id}`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
        className="w-full flex items-start gap-4 p-5 bg-white/5 hover:bg-white/10 transition-colors text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
      >
        <div className="flex flex-col flex-1 gap-1.5 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-widest text-[#94A3B8] font-semibold">
              Question {questionNumber}
            </span>
            <span className="text-[12px] text-muted-foreground/50 italic">
              Tap to {isExpanded ? 'hide' : 'view'}
            </span>
          </div>
          <p className="text-[18px] font-semibold text-[#F8FAFC] leading-snug mt-0.5">
            {questionText}
          </p>
        </div>
        <div className="shrink-0 w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mt-0.5">
          {isExpanded ? <ChevronUp className="w-5 h-5 text-foreground" /> : <ChevronDown className="w-5 h-5 text-foreground" />}
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`accordion-content-${id}`}
            role="region"
            aria-labelledby={`accordion-button-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="border-t border-white/5"
          >
            <div 
              className="p-5 md:p-6 pb-2 focus:outline-none" 
              tabIndex={0}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
