import type { ReactNode } from 'react';

export const AppShell = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
  return (
    <div className={`flex flex-col flex-1 h-full w-full overflow-hidden relative bg-surface ${className}`}>
      {children}
    </div>
  );
};

export const AppContent = ({ children, className = "", bottomSpacing = "32px" }: { children: ReactNode, className?: string, bottomSpacing?: string }) => {
  return (
    <main 
      className={`flex-1 w-full overflow-y-auto overscroll-contain ${className}`}
      style={{ paddingBottom: `calc(env(safe-area-inset-bottom) + ${bottomSpacing})` }}
    >
      {children}
    </main>
  );
};

export const AppFooter = ({ children, className = "" }: { children: ReactNode, className?: string }) => {
  return (
    <footer 
      className={`shrink-0 w-full z-20 bg-surface/90 backdrop-blur-xl border-t border-white/5 pb-[env(safe-area-inset-bottom)] ${className}`}
    >
      {children}
    </footer>
  );
};
