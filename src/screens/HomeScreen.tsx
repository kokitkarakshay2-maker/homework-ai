import { useRef, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, Image as ImageIcon, ChevronRight, Clock } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';
import { validateImages } from '../utils/imageValidation';
import { useHistoryQuery } from '../hooks/useHomework';
import { AppShell, AppContent } from '../components/layout/AppShell';
import { getGreeting } from '../utils/getGreeting';

export default function HomeScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addImages, setError, error: uploadError } = useImageUpload();
  const { data: historyData, isLoading } = useHistoryQuery(0, 5);
  const [greetingInfo, setGreetingInfo] = useState(getGreeting());

  useEffect(() => {
    // Check every minute if the greeting period has changed
    const intervalId = setInterval(() => {
      setGreetingInfo(getGreeting());
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleGallerySelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { valid, files, error: validationError } = validateImages(e.target.files);
    
    if (!valid) {
      setError(validationError || "Invalid file.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    
    await addImages(files);
    if (fileInputRef.current) fileInputRef.current.value = "";
    navigate('/preview');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
  };

  const recentItems = historyData?.items 
    ? [...historyData.items]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5) 
    : [];

  return (
    <AppShell>
      <AppContent className="px-6 pt-12 pb-6 flex flex-col">
      {/* Header */}
      <header className="mb-12 flex justify-between items-center">
        <div>
          <p className="text-muted-foreground text-sm font-medium mb-1 tracking-wide uppercase">
            {greetingInfo.greeting}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Homework AI</h1>
        </div>
        <button 
          onClick={() => navigate('/settings')} 
          className="relative w-[42px] h-[42px] rounded-full bg-surface border border-white/10 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md group"
        >
          <span className="font-semibold text-[15px] text-foreground group-hover:text-primary transition-colors">A</span>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-[2.5px] border-surface" />
        </button>
      </header>

      {uploadError && (
        <div className="bg-destructive/10 text-destructive p-3 rounded-lg text-sm font-medium mb-6">
          {uploadError}
        </div>
      )}

      {/* Main Actions */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        <button 
          onClick={() => navigate('/camera')}
          className="relative overflow-hidden w-full aspect-[4/3] bg-surface border border-white/5 rounded-[16px] flex flex-col items-start justify-between p-5 hover:bg-card-hover hover:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.1)] transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white mb-2">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all">Take Photo</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Scan a problem</p>
          </div>
        </button>

        <label className="relative overflow-hidden w-full aspect-[4/3] bg-surface border border-white/5 rounded-[16px] flex flex-col items-start justify-between p-5 hover:bg-card-hover hover:border-white/10 shadow-[0_4px_20px_rgb(0,0,0,0.1)] transition-all group cursor-pointer text-left">
          <div className="w-10 h-10 rounded-full bg-card border border-white/5 flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors mb-2">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base text-foreground transition-colors">Upload Image</h3>
            <p className="text-xs text-muted-foreground mt-0.5">From gallery</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleGallerySelection}
            className="hidden"
          />
        </label>
      </div>

      {/* Recent Homework */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Recent</h3>
          <Link to="/history" className="text-xs font-medium text-primary hover:text-accent transition-colors flex items-center gap-1">
            <Clock className="w-3 h-3" />
            View All
          </Link>
        </div>
        
        <div className="space-y-3">
          {isLoading ? (
            // Loading Skeletons
            [1, 2, 3].map((i) => (
              <div key={i} className="w-full flex items-center justify-between p-4 bg-surface/50 border border-white/5 rounded-[16px] animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded-md"></div>
                  <div>
                    <div className="h-4 bg-white/10 w-32 rounded mb-2"></div>
                    <div className="h-3 bg-white/5 w-16 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : recentItems.length > 0 ? (
            recentItems.map((item) => (
              <button 
                key={item.id}
                onClick={() => navigate(`/history/${item.id}`, { state: { resultData: item } })}
                className="w-full flex items-center justify-between p-4 bg-surface border border-white/5 rounded-[16px] hover:bg-card-hover hover:border-white/10 transition-all text-left shadow-sm group"
              >
                <div className="flex items-center gap-3">
                  {item.thumbnail_url ? (
                    <img src={item.thumbnail_url} alt="Thumbnail" className="w-10 h-10 object-cover rounded-md border border-white/10 bg-card" />
                  ) : (
                    <div className="w-10 h-10 bg-card rounded-md border border-white/5 flex items-center justify-center">
                      <ImageIcon className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm text-foreground line-clamp-1">{item.processed_response?.worksheet_title || item.subject || 'Untitled Worksheet'}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(item.created_at)}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </button>
            ))
          ) : (
            <div className="py-8 text-center border border-white/5 border-dashed rounded-[16px] bg-surface/30">
              <p className="text-sm text-muted-foreground">No recent homework found.</p>
            </div>
          )}
        </div>
      </div>
      </AppContent>
    </AppShell>
  );
}
