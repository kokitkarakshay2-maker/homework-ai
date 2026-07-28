import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import type { QuestionSchema } from '../../services/homeworkService';
import { detectQuestionType } from '../../lib/questionDetector';
import { getColorClass } from './types/utils';

interface ActivitySummaryCardProps {
  questions: QuestionSchema[];
  renderDetail: (question: QuestionSchema, index: number) => React.ReactNode;
}

export function ActivitySummaryCard({ questions, renderDetail }: ActivitySummaryCardProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {questions.map((question, index) => {
        const isExpanded = expandedId === question.id;
        const detection = detectQuestionType(question.question, question.answer);
        const colorClass = detection.color ? getColorClass(detection.color) : null;
        
        // Strip numbering from question if it exists for cleaner display
        const cleanQuestion = question.question.replace(/^\d+[\.\)]\s*/, '');

        return (
          <div 
            key={question.id} 
            className="bg-surface/30 rounded-3xl border border-white/5 overflow-hidden transition-all duration-300"
          >
            {/* Compact Row Header */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setExpandedId(isExpanded ? null : question.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setExpandedId(isExpanded ? null : question.id);
                }
              }}
              className="w-full flex items-center justify-between p-4 text-left cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset active:bg-white/5 transition-colors"
            >
              <div className="flex flex-col flex-1 gap-1.5 pr-2">
                <span className="text-[12px] uppercase tracking-widest text-[#94A3B8] font-semibold">
                  Question {index + 1}
                </span>
                
                <div className="flex items-start gap-4 w-full">
                  <div className="w-[65%]">
                    <p className="text-[18px] font-semibold text-[#F8FAFC] line-clamp-2 leading-snug">
                      {cleanQuestion}
                    </p>
                  </div>
                  
                  <div className="w-[35%] flex items-center justify-end gap-2">
                    <p className="text-[20px] font-bold text-[#22C55E] truncate">
                      {question.answers && question.answers.length > 0 ? question.answers.join(', ') : question.answer}
                    </p>
                    {detection.color && colorClass && (
                      <div className={`hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full border shadow-sm text-xs capitalize shrink-0 ${colorClass}`}>
                        <div className="w-2 h-2 rounded-full bg-current opacity-80" />
                        <span className="font-bold">{detection.color}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <motion.div
                initial={false}
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-10 h-10 flex items-center justify-center shrink-0 text-muted-foreground"
              >
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            </div>

            {/* Expanded Detail View */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  {/* Divider */}
                  <div className="h-px bg-white/5 mx-4" />
                  
                  <div className="p-4 pt-6 pb-6">
                    {renderDetail(question, index)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
