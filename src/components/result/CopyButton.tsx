import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface CopyButtonProps {
  textToCopy: string;
}

export function CopyButton({ textToCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="flex items-center justify-center gap-2 text-sm font-medium text-foreground bg-white/5 hover:bg-white/10 transition-colors px-4 py-2 rounded-full border border-white/5 active:scale-95 min-h-[44px]"
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 text-success" />
          Copied
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 text-muted-foreground" />
          Copy
        </>
      )}
    </button>
  );
}
