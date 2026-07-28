import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight, RotateCcw } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';
import { AppShell, AppContent, AppFooter } from '../components/layout/AppShell';
import { ImageCarousel } from '../components/upload/ImageCarousel';

export default function PreviewScreen() {
  const navigate = useNavigate();
  const { images, removeImage, clearImages } = useImageUpload();

  useEffect(() => {
    if (images.length === 0) {
      navigate('/home');
    } else {
      console.log(`[${performance.now().toFixed(0)}ms] [Frontend] Image selected`);
    }
  }, [images, navigate]);

  if (images.length === 0) return null;

  const handleRetake = () => {
    clearImages();
    navigate('/camera');
  };

  const handleRemove = () => {
    removeImage(images[images.length - 1].id);
    if (images.length === 1) {
      navigate('/home');
    }
  };

  return (
    <AppShell>
      {/* Header */}
      <header className="shrink-0 h-16 flex items-center justify-between px-4 border-b border-border/50">
        <button 
          onClick={handleRetake}
          className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Retake
        </button>
        <h1 className="text-sm font-semibold">Preview</h1>
        <button 
          onClick={handleRemove}
          className="px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Remove
        </button>
      </header>

      {/* Main Preview Area */}
      <AppContent className="flex flex-col items-center justify-center p-4 bg-muted/30">
        <div className="w-full h-full max-h-[70vh] rounded-xl overflow-hidden bg-muted border border-border/50">
          <ImageCarousel 
            images={images} 
            currentIndex={0} 
            onIndexChange={() => {}} 
          />
        </div>
      </AppContent>

      {/* Bottom Action */}
      <AppFooter className="p-4 bg-background border-t border-border/50">
        <button 
          onClick={() => {
            console.log(`[${performance.now().toFixed(0)}ms] [Frontend] Navigate to processing`);
            navigate('/processing');
          }}
          className="w-full h-14 bg-primary text-primary-foreground font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
        >
          Analyze Homework
          <ArrowRight className="w-5 h-5" />
        </button>
      </AppFooter>
    </AppShell>
  );
}
