import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface Props {
  previewUrl?: string;
  statusMessage: string;
  isSuccess: boolean;
}

export function AIWorksheetScanner({ previewUrl, statusMessage, isSuccess }: Props) {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto p-4 select-none">
      
      {/* Scanner Animation Container */}
      <div className="relative w-full aspect-[3/4] max-w-[280px] mb-12 flex items-center justify-center">
        
        {/* Background Glow Effect */}
        <motion.div 
          animate={{ opacity: isSuccess ? 0 : [0.4, 0.6, 0.4], scale: isSuccess ? 0.9 : [0.95, 1.05, 0.95] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"
        />

        {/* Floating Document */}
        <motion.div
          animate={isSuccess ? { y: 0, scale: 1.05 } : { y: [-5, 5, -5] }}
          transition={{ 
            y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.5, type: "spring", bounce: 0.4 }
          }}
          className={`relative w-full h-full rounded-2xl border-2 overflow-hidden shadow-2xl z-10 flex items-center justify-center bg-surface transition-colors duration-500 ${
            isSuccess ? 'border-success/50 shadow-success/20' : 'border-white/10'
          }`}
        >
          {previewUrl ? (
            <div className="absolute inset-0 z-0">
              <img 
                src={previewUrl} 
                alt="Scanning worksheet" 
                className={`w-full h-full object-cover transition-all duration-700 ${
                  isSuccess ? 'opacity-40 grayscale-0 blur-sm' : 'opacity-30 grayscale blur-[2px]'
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20 pointer-events-none">
              <div className="w-2/3 h-2 bg-white/20 rounded mb-4" />
              <div className="w-1/2 h-2 bg-white/20 rounded mb-8" />
              <div className="w-3/4 h-2 bg-white/20 rounded mb-4" />
              <div className="w-2/3 h-2 bg-white/20 rounded mb-4" />
            </div>
          )}

          {/* Success Checkmark overlay */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-30 text-success drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]"
              >
                <CheckCircle2 className="w-20 h-20" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scanning Beam (only shown when not success) */}
          <AnimatePresence>
            {!isSuccess && (
              <motion.div
                initial={{ top: "-10%" }}
                animate={{ top: "110%" }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-0 right-0 h-1 bg-primary/80 z-20 shadow-[0_0_20px_4px_rgba(var(--primary),0.8)]"
              >
                {/* Scanner Trail Gradient */}
                <div className="absolute bottom-full left-0 right-0 h-24 bg-gradient-to-t from-primary/30 to-transparent" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Subtle AI Sparkles floating around */}
          <AnimatePresence>
            {!isSuccess && (
              <>
                <motion.div 
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute top-[20%] left-[10%] text-cyan-400/50 z-20"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <motion.div 
                  animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
                  className="absolute bottom-[30%] right-[15%] text-primary/50 z-20"
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
              </>
            )}
          </AnimatePresence>

        </motion.div>
      </div>

      {/* Text Info */}
      <div className="text-center h-24 flex flex-col items-center">
        <h2 className="text-xl font-bold tracking-wide text-foreground mb-1 flex items-center gap-2">
          Homework AI
        </h2>
        
        <div className="relative w-full mt-2" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={isSuccess ? "success" : statusMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className={`text-base font-medium ${isSuccess ? 'text-success' : 'text-gray-400'}`}
            >
              {isSuccess ? "Homework ready!" : statusMessage}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
