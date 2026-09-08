import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProcessingAnimation } from '../components/processing/ProcessingAnimation';
import { useImageUpload } from '../hooks/useImageUpload';
import { AppShell, AppContent } from '../components/layout/AppShell';
import { useAnalyzeHomework } from '../hooks/useHomework';
import ErrorCard from '../components/ErrorCard';

const stages = [
  "Reading your worksheet...",
  "Understanding the questions...",
  "Preparing your answers..."
];

export default function AIProcessingScreen() {
  const navigate = useNavigate();
  const { images, clearImages } = useImageUpload();
  const [stageIndex, setStageIndex] = useState(0);
  const [isTakingLong, setIsTakingLong] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
        setIsSuccess(true);
        setTimeout(() => {
          console.log("[Frontend] Navigating to /history/:id...");
          navigate(`/history/${data.id}`, { state: { resultData: data } });
        }, 1200);
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
    // Only stop rotating messages if there's an error, or if success happened AND we want to freeze.
    // Actually, letting it show "Homework ready!" is handled by the Scanner component, 
    // so we can let the index increment safely.
    if (mutation.isError) return;

    const messageInterval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length);
    }, 3000);

    const longTimeout = setTimeout(() => {
      setIsTakingLong(true);
    }, 25000);

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
      <AppContent className="flex flex-col items-center justify-center px-6">
        
        <ProcessingAnimation 
          stageIndex={stageIndex}
          statusMessage={stages[stageIndex]}
          isSuccess={isSuccess}
        />

        <AnimatePresence>
          {isTakingLong && !isSuccess && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-primary/80 mt-8 text-center font-medium"
            >
              AI is analyzing complex questions, please wait...
            </motion.p>
          )}
        </AnimatePresence>
      </AppContent>
    </AppShell>
  );
}
