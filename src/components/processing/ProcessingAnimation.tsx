import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './FunLoaders.css';

interface Props {
  stageIndex: number;
  statusMessage: string;
  isSuccess: boolean;
}

export function ProcessingAnimation({ stageIndex, statusMessage, isSuccess }: Props) {
  const shouldReduceMotion = useReducedMotion();

  // For reduced motion, we disable the complex exit/enter shifts.
  const variants = shouldReduceMotion 
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      }
    : {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 }
      };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto p-4 select-none">
      
      {/* Loaders Container */}
      <div className="relative w-full h-40 mb-8 flex items-center justify-center">
        
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-center justify-center relative w-24 h-24"
            >
              {/* Subtle green pulse */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 1.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                className="absolute inset-0 rounded-full bg-success/30 blur-xl"
              />
              
              <svg className="w-full h-full text-success drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]" viewBox="0 0 50 50">
                {/* Circular Outline */}
                <motion.circle
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
                {/* Checkmark Path */}
                <motion.path
                  d="M15 25 L22 32 L35 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
                />
              </svg>
            </motion.div>
          ) : (
            <motion.div 
              key={`stage-${stageIndex}`}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex items-center justify-center w-full h-full absolute inset-0"
            >
              {stageIndex === 0 && (
                <div className="transform scale-125 sm:scale-150">
                  <motion.div
                    animate={shouldReduceMotion ? {} : { y: [0, -6, 0], x: [0, 3, -3, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="loader-cloud" />
                  </motion.div>
                </div>
              )}
              {stageIndex === 1 && (
                <div className="transform scale-125 sm:scale-150">
                  <motion.div
                    animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="loader-chocolate" />
                  </motion.div>
                </div>
              )}
              {stageIndex === 2 && (
                <div className="transform scale-125 sm:scale-150">
                  <motion.div
                    animate={shouldReduceMotion ? {} : { scale: [1, 1.05, 1], y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <div className="loader-watermelon" />
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Text Info */}
      <div className="text-center h-24 flex flex-col items-center">
        <div className="relative w-full mt-2" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.p
              key={isSuccess ? "success" : statusMessage}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
              transition={{ duration: 0.4 }}
              className={`text-lg font-medium tracking-wide ${isSuccess ? 'text-success' : 'text-gray-300'}`}
            >
              {isSuccess ? "Homework ready" : statusMessage}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
