import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import HomeScreen from './screens/HomeScreen';
import CameraScreen from './screens/CameraScreen';
import PreviewScreen from './screens/PreviewScreen';
import AIProcessingScreen from './screens/AIProcessingScreen';
import ResultScreen from './screens/ResultScreen';
import HistoryScreen from './screens/HistoryScreen';
import SettingsScreen from './screens/SettingsScreen';
import OfflineScreen from './screens/OfflineScreen';
import SplashScreen from './screens/SplashScreen';

import BottomNavigation from './components/layout/BottomNavigation';
import { ImageUploadProvider } from './context/ImageUploadContext';
import { useNetworkState } from './hooks/useNetworkState';

import { AppFooter } from './components/layout/AppShell';

// Layout wrapper for screens that should have the bottom navigation
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <AppFooter>
        <BottomNavigation />
      </AppFooter>
    </>
  );
};

// Simplified Route transition animation
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="flex-1 w-full flex flex-col relative overflow-hidden"
    >
      {children}
    </motion.div>
  );
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Splash Route */}
        <Route path="/" element={<SplashScreen />} />
        
        {/* Routes with Bottom Navigation */}
        <Route path="/home" element={<AppLayout><PageTransition><HomeScreen /></PageTransition></AppLayout>} />
        <Route path="/history" element={<AppLayout><PageTransition><HistoryScreen /></PageTransition></AppLayout>} />
        <Route path="/settings" element={<AppLayout><PageTransition><SettingsScreen /></PageTransition></AppLayout>} />
        
        {/* Full screen routes (no bottom nav) */}
        <Route path="/camera" element={<PageTransition><CameraScreen /></PageTransition>} />
        <Route path="/preview" element={<PageTransition><PreviewScreen /></PageTransition>} />
        <Route path="/processing" element={<PageTransition><AIProcessingScreen /></PageTransition>} />
        <Route path="/result" element={<PageTransition><ResultScreen /></PageTransition>} />
        <Route path="/history/:id" element={<PageTransition><ResultScreen /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const { isOnline } = useNetworkState();

  return (
    <ImageUploadProvider>
      <Router>
        <div className="w-full h-[100dvh] max-w-[430px] mx-auto bg-surface text-foreground shadow-2xl relative overflow-hidden flex flex-col border-x border-white/5">
          {!isOnline ? <OfflineScreen /> : <AnimatedRoutes />}
        </div>
      </Router>
    </ImageUploadProvider>
  );
}

export default App;
