import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useImageUpload } from '../hooks/useImageUpload';
import { AppShell, AppContent } from '../components/layout/AppShell';
import { useAnalyzeHomework } from '../hooks/useHomework';
import ErrorCard from '../components/ErrorCard';

const messages = [
  "Reading image...",
  "Understanding worksheet...",
  "Checking answers...",
  "Preparing response..."
];

export default function AIProcessingScreen() {
  const navigate = useNavigate();
  const { images, clearImages } = useImageUpload();
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTakingLong, setIsTakingLong] = useState(false);
  const mutation = useAnalyzeHomework();

  useEffect(() => {
    console.log("[Frontend] useEffect triggered. images:", images.length);
    if (images.length === 0) return;

    const abortController = new AbortController();
    const file = images[0].file;
    
    console.log("[Frontend] Starting React Query mutation.mutate()...");
    mutation.mutate({ file, signal: abortController.signal }, {
      onSuccess: (data) => {
        console.log("[Frontend] React Query onSuccess callback fired!", data);
        console.log("[Frontend] Navigating to /history/:id...");
        navigate(`/history/${data.id}`, { state: { resultData: data } });
      },
      onError: (error) => {
        console.error("[Frontend] React Query onError callback fired!", error);
      }
    });

    return () => {
      console.log("[Frontend] useEffect cleanup function running! Aborting request...");
      abortController.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Removed mutation from deps so it doesn't clean up (abort) on every React Query state change

  useEffect(() => {
    if (mutation.isError || mutation.isSuccess) return;

    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev < messages.length - 1 ? prev + 1 : 0));
    }, 2500);

    const longTimeout = setTimeout(() => {
      setIsTakingLong(true);
    }, 20000);

    return () => {
      clearInterval(messageInterval);
      clearTimeout(longTimeout);
    };
  }, [mutation.isError, mutation.isSuccess]);

  if (mutation.isError) {
    let errorMessage = "An error occurred while analyzing your homework.";
    let errorTitle = "Analysis Failed";
    
    // Attempt to extract specific API error messages
    const error: any = mutation.error;
    if (!navigator.onLine) {
       errorMessage = "Please check your internet connection.";
       errorTitle = "No Internet";
    } else if (error?.response?.status === 429) {
       errorMessage = "Too many requests. Please try again in a minute.";
       errorTitle = "Rate Limited";
    } else if (error?.response?.status === 413) {
       errorMessage = "The image file is too large. Please upload a smaller image.";
       errorTitle = "File Too Large";
    } else if (error?.response?.status === 415) {
       errorMessage = "Unsupported image format. Please use JPG, PNG, or WebP.";
       errorTitle = "Invalid Format";
    } else if (error?.response?.status === 502) {
       errorMessage = "AI service is currently overwhelmed or down. Please try again.";
       errorTitle = "AI Service Error";
    }

    return (
      <AppShell>
        <AppContent className="flex flex-col items-center justify-center px-6">
          <ErrorCard 
            title={errorTitle}
            message={errorMessage} 
            onBack={() => {
              clearImages();
              navigate('/home');
            }}
            onRetry={() => {
              mutation.reset();
              setIsTakingLong(false);
              navigate('/home');
            }}
          />
        </AppContent>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <AppContent className="flex flex-col items-center justify-center px-6 text-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-8 mx-auto" />
        
        <div className="h-8 relative w-full mb-4">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-lg font-medium text-foreground absolute w-full left-0"
            >
              {messages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isTakingLong && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-muted-foreground mt-4"
            >
              This is taking longer than usual...
            </motion.p>
          )}
        </AnimatePresence>
      </AppContent>
    </AppShell>
  );
}
