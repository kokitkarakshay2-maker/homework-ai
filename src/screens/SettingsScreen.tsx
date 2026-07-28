import { useState, useEffect } from 'react';
import { Moon, LogOut, ChevronRight, Globe, Lock, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { AppShell, AppContent } from '../components/layout/AppShell';

export default function SettingsScreen() {
  const { isInstallable, promptInstall } = usePWAInstall();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <AppShell>
      {/* Header */}
      <header className="px-6 pt-12 pb-4 border-b border-border/50">
        <h1 className="text-2xl font-bold">Settings</h1>
      </header>

      {/* Main Settings List */}
      <AppContent className="px-6 py-6">
        
        {/* Section: Install App */}
        {isInstallable && (
          <div className="mb-8">
            <button 
              onClick={promptInstall}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-3 hover:bg-primary/90 transition-colors"
            >
              <Download className="w-5 h-5" />
              Install Homework AI
            </button>
          </div>
        )}

        {/* Section: App Settings */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">App</h2>
          <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm">Dark Mode</span>
              </div>
              <button 
                onClick={toggleDarkMode}
                className={`w-11 h-6 rounded-full transition-colors relative ${isDarkMode ? 'bg-primary' : 'bg-muted'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-background transition-all shadow-sm ${isDarkMode ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm">Language</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">English</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Account */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Account</h2>
          <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm">Privacy & Security</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-destructive/10 transition-colors text-destructive">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Sign Out</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground mt-12">
          Homework AI v2.0.0 (Minimal Build)
        </div>
      </AppContent>
    </AppShell>
  );
}
