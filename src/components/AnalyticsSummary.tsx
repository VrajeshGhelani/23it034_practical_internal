
import React from "react";
import { BarChart, ChartContainer, ChartTooltip, ChartBar } from "@/components/ui/chart";
import { AnalyticsData } from "@/types";
import { formatBytes } from "@/lib/fileUtils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAnalytics } from "@/lib/analytics";
import { toast } from "sonner";

interface AnalyticsSummaryProps {
  data: AnalyticsData;
  onDataCleared: () => void;
}

const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ 
  data, 
  onDataCleared 
}) => {
  const handleClearData = () => {
    const confirm = window.confirm(
      "Are you sure you want to clear all analytics data? This action cannot be undone."
    );
    
    if (confirm) {
      clearAnalytics();
      onDataCleared();
      toast.success("Analytics data cleared");
    }
  };
  
  // Prepare chart data by grouping compressions by day
  const chartData = React.useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });
    
    const dailyCompressions = data.compressionHistory.reduce((acc, record) => {
      const date = new Date(record.timestamp).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { 
          day: date, 
          totalSaved: 0, 
          compressionCount: 0 
        };
      }
      acc[date].totalSaved += (record.originalSize - record.compressedSize);
      acc[date].compressionCount += 1;
      return acc;
    }, {} as Record<string, { day: string; totalSaved: number; compressionCount: number }>);
    
    return last7Days.map(day => ({
      day: day.split('-').slice(1).join('/'), // Format as MM/DD
      saved: (dailyCompressions[day]?.totalSaved || 0) / (1024 * 1024), // Convert to MB
      count: dailyCompressions[day]?.compressionCount || 0
    }));
  }, [data.compressionHistory]);
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Compression Analytics</h2>
        <Button 
          variant="outline" 
          onClick={handleClearData}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Total Files Compressed</p>
          <p className="text-2xl font-bold">{data.totalCompressed}</p>
        </div>
        
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Storage Saved</p>
          <p className="text-2xl font-bold">{formatBytes(data.sizeSaved)}</p>
        </div>
        
        <div className="stat-card">
          <p className="text-sm font-medium text-muted-foreground">Average Compression</p>
          <p className="text-2xl font-bold">{data.averageCompression}%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Compression History (Last 7 days)</h3>
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <BarChart
              data={chartData}
              categories={["saved"]}
              colors={["#00B0FF"]}
              valueFormatter={(value) => `${value.toFixed(2)} MB`}
              showAnimation
              showXAxis
              showYAxis
              showLegend={false}
            >
              <ChartTooltip>
                {({ category, value, itemData }) => (
                  <div className="p-2">
                    <div className="text-sm font-medium">{itemData.day}</div>
                    <div className="text-sm">Saved: {value.toFixed(2)} MB</div>
                    <div className="text-sm">Files: {itemData.count}</div>
                  </div>
                )}
              </ChartTooltip>
            </BarChart>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No compression data available yet
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Usage Statistics</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Uploads</p>
              <p className="text-xl font-medium">{data.totalUploads}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-xl font-medium">
                {data.totalUploads > 0
                  ? `${Math.round((data.totalCompressed / data.totalUploads) * 100)}%`
                  : "0%"}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Original Size (Total)</p>
              <p className="text-xl font-medium">{formatBytes(data.totalSizeBefore)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Compressed Size (Total)</p>
              <p className="text-xl font-medium">{formatBytes(data.totalSizeAfter)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSummary;
