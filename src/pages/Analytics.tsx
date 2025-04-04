
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import AnalyticsSummary from "@/components/AnalyticsSummary";
import { getStoredAnalytics } from "@/lib/analytics";
import { AnalyticsData } from "@/types";

const Analytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>(() => getStoredAnalytics());
  
  const handleDataCleared = () => {
    setAnalyticsData(getStoredAnalytics());
  };
  
  // Refresh data when component mounts
  useEffect(() => {
    setAnalyticsData(getStoredAnalytics());
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <AnalyticsSummary 
          data={analyticsData} 
          onDataCleared={handleDataCleared} 
        />
      </main>
      
      <footer className="py-6 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PixelPress. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Analytics;
