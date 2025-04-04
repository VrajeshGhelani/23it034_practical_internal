
import { CompressionRecord, AnalyticsData, ImageFile } from "../types";

const STORAGE_KEY = "image-compressor-analytics";

export const getInitialAnalytics = (): AnalyticsData => {
  return {
    totalUploads: 0,
    totalCompressed: 0,
    totalSizeBefore: 0,
    totalSizeAfter: 0,
    sizeSaved: 0,
    averageCompression: 0,
    compressionHistory: []
  };
};

export const getStoredAnalytics = (): AnalyticsData => {
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error("Error retrieving analytics data:", error);
  }
  
  return getInitialAnalytics();
};

export const saveAnalytics = (data: AnalyticsData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving analytics data:", error);
  }
};

export const recordCompression = (image: ImageFile): void => {
  if (image.status !== "compressed" || !image.compressedSize || !image.compressionPercent) {
    return;
  }
  
  const analytics = getStoredAnalytics();
  
  // Create new compression record
  const record: CompressionRecord = {
    timestamp: Date.now(),
    originalSize: image.originalSize,
    compressedSize: image.compressedSize,
    compressionPercent: image.compressionPercent
  };
  
  // Update statistics
  analytics.totalCompressed += 1;
  analytics.totalSizeBefore += image.originalSize;
  analytics.totalSizeAfter += image.compressedSize;
  analytics.sizeSaved = analytics.totalSizeBefore - analytics.totalSizeAfter;
  
  // Add to history
  analytics.compressionHistory.push(record);
  
  // Limit history to most recent 100 items
  if (analytics.compressionHistory.length > 100) {
    analytics.compressionHistory = analytics.compressionHistory.slice(-100);
  }
  
  // Calculate average compression
  if (analytics.totalCompressed > 0) {
    analytics.averageCompression = Math.round(
      analytics.sizeSaved / analytics.totalSizeBefore * 100
    );
  }
  
  // Save updated analytics
  saveAnalytics(analytics);
};

export const recordUpload = (): void => {
  const analytics = getStoredAnalytics();
  
  analytics.totalUploads += 1;
  
  saveAnalytics(analytics);
};

export const clearAnalytics = (): void => {
  saveAnalytics(getInitialAnalytics());
};
