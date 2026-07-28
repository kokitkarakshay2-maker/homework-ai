import { AlertTriangle } from 'lucide-react';

interface WarningCardProps {
  warnings: string[];
}

export function WarningCard({ warnings }: WarningCardProps) {
  if (!warnings || warnings.length === 0) return null;

  return (
    <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-3">
      <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
      <div className="text-sm text-destructive font-medium leading-relaxed">
        {warnings.map((warn, i) => (
          <p key={i} className="mb-1 last:mb-0">{warn}</p>
        ))}
      </div>
    </div>
  );
}
