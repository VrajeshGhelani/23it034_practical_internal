
import React, { useState } from "react";
import { ImageFile } from "@/types";
import UploadArea from "./UploadArea";
import FileItem from "./FileItem";
import ComparisonView from "./ComparisonView";
import { revokeObjectURL } from "@/lib/fileUtils";

const ImageCompressor: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  
  const handleFilesUploaded = (newFiles: ImageFile[]) => {
    setImageFiles((prev) => [...prev, ...newFiles]);
    
    if (newFiles.length > 0 && !selectedImage) {
      setSelectedImage(newFiles[0]);
    }
  };
  
  const handleCompressImage = (id: string, updatedData: Partial<ImageFile>) => {
    setImageFiles((prev) =>
      prev.map((file) => {
        if (file.id === id) {
          const updatedFile = { ...file, ...updatedData };
          
          // If this is the selected image, update selected image too
          if (selectedImage && selectedImage.id === id) {
            setSelectedImage(updatedFile);
          }
          
          return updatedFile;
        }
        return file;
      })
    );
  };
  
  const handleRemoveImage = (id: string) => {
    setImageFiles((prev) => {
      const imageToRemove = prev.find((file) => file.id === id);
      
      if (imageToRemove) {
        // Clean up object URLs to prevent memory leaks
        if (imageToRemove.originalUrl) revokeObjectURL(imageToRemove.originalUrl);
        if (imageToRemove.compressedUrl) revokeObjectURL(imageToRemove.compressedUrl);
      }
      
      return prev.filter((file) => file.id !== id);
    });
    
    if (selectedImage && selectedImage.id === id) {
      setSelectedImage(null);
    }
  };
  
  const handleSelectImage = (imageFile: ImageFile) => {
    setSelectedImage(imageFile);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Images</h2>
          <UploadArea onFilesUploaded={handleFilesUploaded} />
          
          {selectedImage && selectedImage.status === "compressed" && (
            <ComparisonView imageFile={selectedImage} />
          )}
        </div>
      </div>
      
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 h-full">
          <h2 className="text-xl font-semibold mb-4">Your Images</h2>
          
          {imageFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No images uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {imageFiles.map((imageFile) => (
                <div
                  key={imageFile.id}
                  onClick={() => handleSelectImage(imageFile)}
                  className={`cursor-pointer ${
                    selectedImage?.id === imageFile.id
                      ? "ring-2 ring-primary rounded-lg"
                      : ""
                  }`}
                >
                  <FileItem
                    imageFile={imageFile}
                    onCompress={handleCompressImage}
                    onRemove={handleRemoveImage}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCompressor;
