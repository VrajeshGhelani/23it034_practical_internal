
export interface ImageFile {
  id: string;
  file: File;
  originalSize: number;
  compressedSize?: number;
  originalUrl?: string;
  compressedUrl?: string;
  compressionPercent?: number;
  status: 'idle' | 'compressing' | 'compressed' | 'error';
  quality: number;
  error?: string;
}

export interface AnalyticsData {
  totalUploads: number;
  totalCompressed: number;
  totalSizeBefore: number;
  totalSizeAfter: number;
  sizeSaved: number;
  averageCompression: number;
  compressionHistory: CompressionRecord[];
}

export interface CompressionRecord {
  timestamp: number;
  originalSize: number;
  compressedSize: number;
  compressionPercent: number;
}
