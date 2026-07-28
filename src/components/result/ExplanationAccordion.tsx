import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { TranslateButton } from './TranslateButton';

interface ExplanationAccordionProps {
  steps: string[];
}

export function ExplanationAccordion({ steps }: ExplanationAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [lang, setLang] = useState('en'); // Mock translation state for now

  const safeSteps = Array.isArray(steps) 
    ? steps 
    : typeof steps === 'string' && (steps as string).trim() 
      ? [(steps as string).trim()] 
      : [];

  if (safeSteps.length === 0) return null;

  return (
    <div className="mb-8 border border-white/10 rounded-2xl overflow-hidden bg-surface/30">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors text-left"
      >
        <h2 className="text-[12px] uppercase tracking-widest text-[#94A3B8] font-semibold flex items-center gap-2">
          EXPLANATION
        </h2>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/5"
          >
            <div className="p-5">
              <div className="flex justify-end mb-6">
                <TranslateButton currentLang={lang} onLanguageChange={setLang} />
              </div>

              <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:left-[11px] before:w-[2px] before:bg-white/10">
                {safeSteps.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-[30px] top-1 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    </div>
                    <div className="bg-surface/50 border border-white/5 rounded-2xl p-5 shadow-sm hover:bg-surface/80 transition-colors">
                      <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                        <span className="text-primary text-xs uppercase tracking-wider font-bold">Step {index + 1}</span>
                      </h4>
                      <div className="text-base text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {/* If we had a real translation API, we would show translated text here based on 'lang' */}
                        {lang !== 'en' ? `[Translated to ${lang}] ${step}` : step}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="relative pt-4">
                  <div className="absolute -left-[32px] top-5 w-6 h-6 rounded-full bg-background flex items-center justify-center z-10">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  </div>
                  <div className="pl-2">
                    <p className="text-sm font-semibold text-foreground">
                      {lang !== 'en' ? `[Translated] Solution verified` : `Solution verified`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
