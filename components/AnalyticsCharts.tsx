'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Activity, Zap } from 'lucide-react';
import { ClassroomData, DevicesData } from '@/firebase/listeners';

interface AnalyticsChartsProps {
  classroomData: ClassroomData | null;
  devicesData: DevicesData | null;
}

interface ChartDataPoint {
  time: string;
  temperature: number;
  humidity: number;
  motion: number;
}

export default function AnalyticsCharts({ classroomData, devicesData }: AnalyticsChartsProps) {
  const [temperatureData, setTemperatureData] = useState<ChartDataPoint[]>([]);
  const [motionData, setMotionData] = useState<ChartDataPoint[]>([]);
  const [deviceUsageData, setDeviceUsageData] = useState<any[]>([]);

  useEffect(() => {
    // Generate sample historical data (in production, fetch from Firebase)
    const generateSampleData = () => {
      const now = new Date();
      const tempData: ChartDataPoint[] = [];
      const motionDataPoints: ChartDataPoint[] = [];

      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const hour = time.getHours();
        
        // Simulate temperature variation
        const baseTemp = classroomData?.temperature || 25;
        const temp = baseTemp + Math.sin(hour / 24 * Math.PI * 2) * 3 + (Math.random() - 0.5) * 2;
        
        // Simulate humidity variation
        const baseHumidity = classroomData?.humidity || 50;
        const humidity = baseHumidity + Math.sin(hour / 24 * Math.PI * 2) * 10 + (Math.random() - 0.5) * 5;
        
        // Simulate motion (0 or 1)
        const motion = Math.random() > 0.6 ? 1 : 0;

        tempData.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          temperature: Math.max(15, Math.min(35, temp)),
          humidity: Math.max(20, Math.min(90, humidity)),
          motion: 0,
        });

        motionDataPoints.push({
          time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          temperature: 0,
          humidity: 0,
          motion: motion,
        });
      }

      setTemperatureData(tempData);
      setMotionData(motionDataPoints);
    };

    generateSampleData();
    const interval = setInterval(generateSampleData, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [classroomData]);

  useEffect(() => {
    // Device usage data
    const usageData = [
      { device: 'Light Zone 1', usage: devicesData?.light_zone1 ? 85 : 0 },
      { device: 'Light Zone 2', usage: devicesData?.light_zone2 ? 60 : 0 },
      { device: 'Fan', usage: devicesData?.fan ? 75 : 0 },
    ];
    setDeviceUsageData(usageData);
  }, [devicesData]);

  return (
    <div className="bg-card-bg rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Analytics & Trends
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temperature & Humidity Chart */}
        <div className="bg-dark-bg rounded-lg p-4">
          <h3 className="text-text-primary font-medium mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Temperature & Humidity (24h)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={temperatureData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5C6A" />
              <XAxis 
                dataKey="time" 
                stroke="#9BA8AB"
                tick={{ fill: '#9BA8AB', fontSize: 12 }}
              />
              <YAxis 
                stroke="#9BA8AB"
                tick={{ fill: '#9BA8AB', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#253745', 
                  border: '1px solid #4A5C6A',
                  borderRadius: '8px',
                  color: '#CCD0CF'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="temperature" 
                stroke="#fbbf24" 
                fill="#fbbf24" 
                fillOpacity={0.3}
                name="Temperature (°C)"
              />
              <Area 
                type="monotone" 
                dataKey="humidity" 
                stroke="#60a5fa" 
                fill="#60a5fa" 
                fillOpacity={0.3}
                name="Humidity (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

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

        {/* Device Usage */}
        <div className="bg-dark-bg rounded-lg p-4 lg:col-span-2">
          <h3 className="text-text-primary font-medium mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Device Usage Status
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={deviceUsageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#4A5C6A" />
              <XAxis 
                type="number"
                stroke="#9BA8AB"
                tick={{ fill: '#9BA8AB', fontSize: 12 }}
                domain={[0, 100]}
              />
              <YAxis 
                dataKey="device" 
                type="category"
                stroke="#9BA8AB"
                tick={{ fill: '#9BA8AB', fontSize: 12 }}
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
                dataKey="usage" 
                fill="#4A5C6A" 
                name="Usage %"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

