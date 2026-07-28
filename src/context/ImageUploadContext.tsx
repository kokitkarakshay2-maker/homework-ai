import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
}

interface ImageUploadContextType {
  images: UploadedImage[];
  loading: boolean;
  error: string | null;
  addImages: (files: File[]) => Promise<void>;
  removeImage: (id: string) => void;
  clearImages: () => void;
  setError: (error: string | null) => void;
}

export const ImageUploadContext = createContext<ImageUploadContextType | undefined>(undefined);

export const ImageUploadProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addImages = useCallback(async (files: File[]) => {
    setLoading(true);
    setError(null);
    try {
      const newImages = files.map(file => {
        // Create an object URL for immediate preview without reading the whole file via FileReader
        const previewUrl = URL.createObjectURL(file);
        return {
          id: Math.random().toString(36).substring(7) + Date.now().toString(36),
          file,
          previewUrl,
          name: file.name,
          size: file.size,
        };
      });
      setImages(prev => [...prev, ...newImages]);
    } catch (err: any) {
      setError(err.message || "Failed to process images.");
    } finally {
      setLoading(false);
    }
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const imgToRemove = prev.find(img => img.id === id);
      if (imgToRemove) {
        URL.revokeObjectURL(imgToRemove.previewUrl);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const clearImages = useCallback(() => {
    images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setError(null);
  }, [images]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ImageUploadContext.Provider value={{ images, loading, error, addImages, removeImage, clearImages, setError }}>
      {children}
    </ImageUploadContext.Provider>
  );
};
