import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type UploadedImage } from '../../context/ImageUploadContext';

interface ImageCarouselProps {
  images: UploadedImage[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export function ImageCarousel({ images, currentIndex, onIndexChange }: ImageCarouselProps) {
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    onIndexChange((currentIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  };

  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 100 : -100 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -100 : 100, position: 'absolute' as const })
  };

  return (
    <div className="relative w-full aspect-[3/4] bg-muted rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentIndex}
          src={currentImage.previewUrl}
          alt={currentImage.name}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full h-full object-contain"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(_, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) {
              handleNext();
            } else if (swipe > swipeConfidenceThreshold) {
              handlePrev();
            }
          }}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white/90 hover:bg-black/50 transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white/90 hover:bg-black/50 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-colors ${i === currentIndex ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};
