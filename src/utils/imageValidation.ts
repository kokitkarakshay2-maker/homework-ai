export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export interface ValidationResult {
  valid: boolean;
  error?: string;
  files: File[];
}

export function validateImages(files: FileList | File[] | null): ValidationResult {
  if (!files || files.length === 0) {
    return { valid: false, error: "No image selected.", files: [] };
  }

  const validFiles: File[] = [];
  const fileArray = Array.from(files);

  for (const file of fileArray) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { 
        valid: false, 
        error: `Invalid file type: ${file.name}. Only JPG, PNG, and WebP are allowed.`,
        files: [] 
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { 
        valid: false, 
        error: `File too large: ${file.name}. Maximum size is ${MAX_FILE_SIZE_MB}MB.`,
        files: []
      };
    }
    
    validFiles.push(file);
  }

  return { valid: true, files: validFiles };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Utility to get image dimensions
export function getImageDimensions(file: File): Promise<{width: number, height: number}> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}
