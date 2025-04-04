
import React, { useState, useRef, useEffect } from "react";
import { ImageFile } from "@/types";

interface ComparisonViewProps {
  imageFile: ImageFile;
}

const ComparisonView: React.FC<ComparisonViewProps> = ({ imageFile }) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  
  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchend", handleMouseUp);
    
    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, []);
  
  const handleMouseDown = () => {
    isDragging.current = true;
  };
  
  const handleTouchStart = () => {
    isDragging.current = true;
  };
  
  const calculatePosition = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const containerWidth = rect.width;
    
    // Calculate position as percentage
    let newPosition = (x / containerWidth) * 100;
    
    // Clamp between 0 and 100
    newPosition = Math.max(0, Math.min(100, newPosition));
    
    setPosition(newPosition);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    calculatePosition(e.clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const touch = e.touches[0];
    calculatePosition(touch.clientX);
  };
  
  // If we don't have both URLs, don't render the comparison
  if (!imageFile.originalUrl || !imageFile.compressedUrl) {
    return null;
  }
  
  return (
    <div className="mt-6 mb-4">
      <h3 className="text-lg font-medium mb-3">Before & After Comparison</h3>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border border-gray-200"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        <div
          className="absolute top-0 left-0 bottom-0 right-0 z-0"
          style={{
            backgroundImage: `url(${imageFile.originalUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        
        <div
          className="absolute top-0 left-0 bottom-0 z-10 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <div
            className="absolute top-0 left-0 bottom-0 right-0 w-auto"
            style={{
              backgroundImage: `url(${imageFile.compressedUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: `${100 / (position / 100)}%`
            }}
          ></div>
        </div>
        
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white z-20 cursor-ew-resize"
          style={{ left: `${position}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-primary"></div>
          </div>
        </div>
        
        <div className="w-full pt-[75%] relative">
          {/* This div maintains the aspect ratio */}
        </div>
        
        <div className="flex justify-between mt-2 px-2 text-xs font-medium">
          <span>Compressed</span>
          <span>Original</span>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
