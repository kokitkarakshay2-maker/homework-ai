import { WifiOff, RefreshCcw } from 'lucide-react';
import { AppShell, AppContent } from '../components/layout/AppShell';

export default function OfflineScreen() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <AppShell>
      <AppContent className="flex flex-col items-center justify-center px-6 text-center h-full">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
        <WifiOff className="w-8 h-8 text-muted-foreground" />
      </div>
      <h2 className="text-xl font-bold mb-2">You are offline</h2>
      <p className="text-muted-foreground mb-8 text-sm">
        Homework AI requires an active internet connection to analyze images and generate answers. Please check your network and try again.
      </p>
      
      <button 
        onClick={handleRetry}
        className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center gap-2 hover:bg-primary/90 transition-colors"
      >
        <RefreshCcw className="w-4 h-4" />
        Retry Connection
      </button>
      </AppContent>
    </AppShell>
  );
}
