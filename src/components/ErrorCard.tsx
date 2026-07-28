import { RefreshCw, XCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorCardProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
}

export default function ErrorCard({ title = "Something went wrong", message, onRetry, onBack }: ErrorCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6 flex flex-col items-center text-center max-w-sm mx-auto shadow-sm"
    >
      <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center mb-4">
        <XCircle className="w-6 h-6 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
        {message}
      </p>
      
      <div className="flex gap-3 w-full">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-surface border border-white/5 hover:bg-white/5 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        )}
        {onRetry && (
          <button 
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-medium shadow-[0_2px_10px_rgba(59,130,246,0.2)]"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        )}
      </div>
    </motion.div>
  );
}
