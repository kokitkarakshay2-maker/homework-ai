import { useContext } from 'react';
import { ImageUploadContext } from '../context/ImageUploadContext';

export function useImageUpload() {
  const context = useContext(ImageUploadContext);
  if (context === undefined) {
    throw new Error('useImageUpload must be used within an ImageUploadProvider');
  }
  return context;
}
