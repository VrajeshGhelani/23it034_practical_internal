
import { ImageFile } from "../types";
import { calculateCompression, getImageType } from "./fileUtils";

export const compressImage = async (
  imageFile: ImageFile,
  quality: number
): Promise<Partial<ImageFile>> => {
  try {
    const file = imageFile.file;
    const imageType = getImageType(file);
    
    // Create canvas and load image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    if (!ctx) {
      throw new Error("Could not create canvas context");
    }
    
    // Create a promise to handle image loading
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageFile.originalUrl || URL.createObjectURL(file);
    });
    
    // Set canvas dimensions
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw image to canvas
    ctx.drawImage(img, 0, 0);
    
    // Convert canvas to compressed blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        imageType,
        quality / 100
      );
    });
    
    // Create a new File object with the compressed data
    const compressedFile = new File([blob], file.name, {
      type: imageType,
    });
    
    // Create a URL for the compressed image
    const compressedUrl = URL.createObjectURL(compressedFile);
    
    // Calculate compression stats
    const compressedSize = compressedFile.size;
    const compressionPercent = calculateCompression(
      imageFile.originalSize,
      compressedSize
    );
    
    return {
      compressedSize,
      compressedUrl,
      compressionPercent,
      status: "compressed"
    };
  } catch (error) {
    console.error("Error compressing image:", error);
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
};
