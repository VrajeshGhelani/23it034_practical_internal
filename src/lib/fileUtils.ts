
import { ImageFile } from "../types";

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const calculateCompression = (
  originalSize: number,
  compressedSize: number
): number => {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
};

export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const getImageType = (file: File): string => {
  return file.type || "image/jpeg";
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/");
};

export const createObjectURL = (file: File): string => {
  return URL.createObjectURL(file);
};

export const revokeObjectURL = (url: string | undefined): void => {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
};

export const preprocessImageFile = (file: File): ImageFile => {
  return {
    id: generateUniqueId(),
    file,
    originalSize: file.size,
    originalUrl: createObjectURL(file),
    status: "idle",
    quality: 80
  };
};
