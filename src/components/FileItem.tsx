
import React, { useState } from "react";
import { Trash2, Download, Image, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ImageFile } from "@/types";
import { formatBytes } from "@/lib/fileUtils";
import { compressImage } from "@/lib/compression";
import { recordCompression } from "@/lib/analytics";
import { toast } from "sonner";

interface FileItemProps {
  imageFile: ImageFile;
  onCompress: (id: string, updatedData: Partial<ImageFile>) => void;
  onRemove: (id: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({
  imageFile,
  onCompress,
  onRemove,
}) => {
  const [quality, setQuality] = useState(imageFile.quality);
  
  const handleQualityChange = (value: number[]) => {
    setQuality(value[0]);
  };
  
  const handleCompress = async () => {
    try {
      // Update status to compressing
      onCompress(imageFile.id, { status: "compressing", quality });
      
      // Compress the image
      const result = await compressImage(imageFile, quality);
      
      // Update with compression results
      onCompress(imageFile.id, result);
      
      // Record in analytics if successful
      if (result.status === "compressed") {
        recordCompression({
          ...imageFile,
          ...result,
          quality
        } as ImageFile);
        
        toast.success("Image compressed successfully");
      }
    } catch (error) {
      console.error("Compression error:", error);
      onCompress(imageFile.id, {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error occurred"
      });
      toast.error("Failed to compress image");
    }
  };
  
  const handleDownload = () => {
    if (!imageFile.compressedUrl) return;
    
    const link = document.createElement("a");
    link.href = imageFile.compressedUrl;
    link.download = `compressed-${imageFile.file.name}`;
    link.click();
    
    toast.success("Download started");
  };
  
  const renderStatus = () => {
    switch (imageFile.status) {
      case "idle":
        return (
          <Button onClick={handleCompress} className="w-full">
            Compress
          </Button>
        );
      case "compressing":
        return (
          <Button disabled className="w-full">
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Compressing...
          </Button>
        );
      case "compressed":
        return (
          <div className="flex flex-col w-full gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                <Check className="h-4 w-4 inline-block mr-1 text-green-500" />
                Compressed • {imageFile.compressionPercent}% smaller
              </span>
              <Button size="sm" onClick={handleDownload} variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              {formatBytes(imageFile.originalSize)} → {formatBytes(imageFile.compressedSize || 0)}
            </div>
          </div>
        );
      case "error":
        return (
          <div className="text-sm text-destructive">
            Error: {imageFile.error || "Failed to compress"}
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="file-item">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center overflow-hidden">
          {imageFile.originalUrl ? (
            <img
              src={imageFile.originalUrl}
              alt={imageFile.file.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-medium text-sm truncate" title={imageFile.file.name}>
            {imageFile.file.name}
          </h3>
          <p className="text-xs text-muted-foreground">
            {formatBytes(imageFile.originalSize)}
          </p>
        </div>
        
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => onRemove(imageFile.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      
      {imageFile.status !== "compressed" && (
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Quality</span>
            <span className="text-sm">{quality}%</span>
          </div>
          <Slider
            defaultValue={[quality]}
            min={1}
            max={100}
            step={1}
            onValueChange={handleQualityChange}
            disabled={imageFile.status === "compressing"}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Lower quality = smaller file size
          </p>
        </div>
      )}
      
      {renderStatus()}
    </div>
  );
};

export default FileItem;
