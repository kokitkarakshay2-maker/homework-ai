import { Languages } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' }
];

interface TranslateButtonProps {
  currentLang: string;
  onLanguageChange: (langCode: string) => void;
}

export function TranslateButton({ currentLang, onLanguageChange }: TranslateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 text-sm font-medium text-foreground bg-surface hover:bg-card-hover transition-colors px-4 py-2 rounded-full shadow-sm border border-white/5 active:scale-95 min-h-[44px]"
        aria-label="Translate explanation"
      >
        <Languages className="w-4 h-4 text-primary" />
        Translate
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full left-0 mb-2 w-32 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 origin-bottom-left"
          >
            <div className="py-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onLanguageChange(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    currentLang === lang.code 
                      ? 'bg-primary/20 text-primary font-medium' 
                      : 'text-foreground hover:bg-white/5'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
