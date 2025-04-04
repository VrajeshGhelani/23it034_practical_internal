
import React, { useCallback, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageFile } from "@/types";
import { preprocessImageFile, isImageFile } from "@/lib/fileUtils";
import { recordUpload } from "@/lib/analytics";
import { toast } from "sonner";

interface UploadAreaProps {
  onFilesUploaded: (files: ImageFile[]) => void;
}

const UploadArea: React.FC<UploadAreaProps> = ({ onFilesUploaded }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  
  const processFiles = useCallback((fileList: FileList) => {
    const validFiles: ImageFile[] = [];
    
    Array.from(fileList).forEach((file) => {
      if (isImageFile(file)) {
        validFiles.push(preprocessImageFile(file));
        recordUpload();
      } else {
        toast.error(`${file.name} is not a valid image file`);
      }
    });
    
    if (validFiles.length > 0) {
      onFilesUploaded(validFiles);
      toast.success(`${validFiles.length} ${validFiles.length === 1 ? 'file' : 'files'} uploaded`);
    }
  }, [onFilesUploaded]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      processFiles(event.target.files);
      // Reset input value to allow uploading the same file again
      event.target.value = "";
    }
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  }, []);
  
  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
  }, []);
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFiles(event.dataTransfer.files);
    }
  }, [processFiles]);
  
  return (
    <div
      className={`border-2 border-dashed border-primary/50 rounded-lg p-4 ${isDragActive ? "bg-primary/5 border-primary" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center py-6">
        <Upload className="h-10 w-10 text-primary mb-4" />
        <p className="text-lg font-medium mb-2">Drag & Drop Images Here</p>
        <p className="text-sm text-muted-foreground mb-4">
          Or click the button below
        </p>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button variant="default" className="cursor-pointer">
            Select Images
          </Button>
        </label>
      </div>
    </div>
  );
};

export default UploadArea;
