'use client';

import { useEffect, useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';
import { ClassroomData } from '@/firebase/listeners';

interface AnalyticsChartsProps {
  classroomData: ClassroomData | null;
}

interface ChartDataPoint {
  time: string;
  motion: number;
  timestamp: number;
}

export default function AnalyticsCharts({ classroomData }: AnalyticsChartsProps) {
  const [motionData, setMotionData] = useState<ChartDataPoint[]>([]);
  const motionHistoryRef = useRef<ChartDataPoint[]>([]);

  useEffect(() => {
    if (!classroomData) return;

    const now = Date.now();
    const motionDetected = classroomData.motion_detected || false;
    const timestamp = classroomData.timestamp || now;

    // Add new reading to history
    const newReading: ChartDataPoint = {
      time: new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      motion: motionDetected ? 1 : 0,
      timestamp: timestamp,
    };

    // Add to history
    motionHistoryRef.current.push(newReading);

    // Keep only last 24 hours of data (1440 minutes = 24 hours, but we'll sample every few minutes)
    const twentyFourHoursAgo = now - (24 * 60 * 60 * 1000);
    motionHistoryRef.current = motionHistoryRef.current.filter(
      (point) => point.timestamp >= twentyFourHoursAgo
    );

    // Group by hour for display (last 24 hours)
    const hourlyData: { [key: string]: { motion: number; count: number } } = {};
    
    motionHistoryRef.current.forEach((point) => {
      const hour = new Date(point.timestamp).getHours();
      const hourKey = `${hour}:00`;
      
      if (!hourlyData[hourKey]) {
        hourlyData[hourKey] = { motion: 0, count: 0 };
      }
      
      hourlyData[hourKey].motion += point.motion;
      hourlyData[hourKey].count += 1;
    });

    // Convert to chart format (average motion per hour, 0 or 1)
    const chartData: ChartDataPoint[] = [];
    const nowDate = new Date();
    
    for (let i = 23; i >= 0; i--) {
      const hourTime = new Date(nowDate.getTime() - i * 60 * 60 * 1000);
      const hour = hourTime.getHours();
      const hourKey = `${hour}:00`;
      
      const hourData = hourlyData[hourKey];
      const avgMotion = hourData && hourData.count > 0 
        ? (hourData.motion / hourData.count > 0.5 ? 1 : 0)
        : 0;
      
      chartData.push({
        time: hourTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        motion: avgMotion,
        timestamp: hourTime.getTime(),
      });
    }

    setMotionData(chartData);
  }, [classroomData]);

  return (
    <div className="bg-card-bg rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Analytics & Trends
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Motion Detection Activity */}
        <div className="bg-dark-bg rounded-lg p-4">
          <h3 className="text-text-primary font-medium mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Motion Detection Activity (24h)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={motionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5C6A" />
              <XAxis 
                dataKey="time" 
                stroke="#9BA8AB"
                tick={{ fill: '#9BA8AB', fontSize: 12 }}
              />
              <YAxis 
                stroke="#9BA8AB"
                tick={{ fill: '#9BA8AB', fontSize: 12 }}
                domain={[0, 1]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#253745', 
                  border: '1px solid #4A5C6A',
                  borderRadius: '8px',
                  color: '#CCD0CF'
                }}
              />
              <Bar 
                dataKey="motion" 
                fill="#10b981" 
                name="Motion Detected"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

