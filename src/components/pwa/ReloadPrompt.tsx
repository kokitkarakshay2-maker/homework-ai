import { useRegisterSW } from 'virtual:pwa-register/react';

export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      // eslint-disable-next-line prefer-template
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!needRefresh && !offlineReady) return null;

  return (
    <div className="fixed bottom-24 sm:bottom-6 right-4 left-4 sm:left-auto z-50 animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-card border border-border shadow-lg rounded-xl p-4 sm:w-80 flex flex-col gap-3">
        {needRefresh ? (
          <>
            <div>
              <h3 className="font-semibold text-foreground">New version available</h3>
              <p className="text-sm text-muted-foreground">A newer version of Homework AI is ready.</p>
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                onClick={close}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted/50 rounded-lg transition-colors"
              >
                Later
              </button>
              <button 
                onClick={() => updateServiceWorker(true)}
                className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Update
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">App ready to work offline</span>
            <button onClick={close} className="p-2 text-muted-foreground hover:bg-muted/50 rounded-lg">
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
