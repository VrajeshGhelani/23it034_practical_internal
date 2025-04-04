
import React from "react";
import Navbar from "@/components/Navbar";
import ImageCompressor from "@/components/ImageCompressor";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Image Compression Made Easy</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your images, compress them to reduce file size while maintaining quality,
            and download the optimized versions for faster websites and apps.
          </p>
        </div>
        
        <ImageCompressor />
      </main>
      
      <footer className="py-6 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PixelPress. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
