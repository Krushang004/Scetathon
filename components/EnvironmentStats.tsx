'use client';

import { Thermometer, Droplets, Wind } from 'lucide-react';
import { ClassroomData } from '@/firebase/listeners';

interface EnvironmentStatsProps {
  classroomData: ClassroomData | null;
}

export default function EnvironmentStats({ classroomData }: EnvironmentStatsProps) {
  const temperature = classroomData?.temperature || 0;
  const humidity = classroomData?.humidity || 0;
  const motionDetected = classroomData?.motion_detected || false;

  const getTemperatureColor = (temp: number) => {
    if (temp < 20) return 'text-blue-400';
    if (temp < 25) return 'text-green-400';
    if (temp < 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getHumidityColor = (hum: number) => {
    if (hum < 30) return 'text-yellow-400';
    if (hum < 60) return 'text-green-400';
    if (hum < 80) return 'text-blue-400';
    return 'text-purple-400';
  };

  return (
    <div className="bg-card-bg rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Environment Monitoring
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Temperature Card */}
        <div className="bg-dark-bg rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Thermometer className={`w-5 h-5 ${getTemperatureColor(temperature)}`} />
            <span className="text-xs text-text-secondary">Temperature</span>
          </div>
          <div className={`text-3xl font-bold ${getTemperatureColor(temperature)}`}>
            {temperature.toFixed(1)}°C
          </div>
          <div className="text-xs text-text-secondary mt-1">
            {temperature < 20 ? 'Cold' : temperature < 25 ? 'Comfortable' : temperature < 30 ? 'Warm' : 'Hot'}
          </div>
        </div>

        {/* Humidity Card */}
        <div className="bg-dark-bg rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Droplets className={`w-5 h-5 ${getHumidityColor(humidity)}`} />
            <span className="text-xs text-text-secondary">Humidity</span>
          </div>
          <div className={`text-3xl font-bold ${getHumidityColor(humidity)}`}>
            {humidity.toFixed(0)}%
          </div>
          <div className="text-xs text-text-secondary mt-1">
            {humidity < 30 ? 'Dry' : humidity < 60 ? 'Comfortable' : humidity < 80 ? 'Humid' : 'Very Humid'}
          </div>
        </div>

        {/* Activity Status Card */}
        <div className="bg-dark-bg rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Wind className={`w-5 h-5 ${motionDetected ? 'text-green-400' : 'text-gray-400'}`} />
            <span className="text-xs text-text-secondary">Room Status</span>
          </div>
          <div className={`text-2xl font-bold ${motionDetected ? 'text-green-400' : 'text-gray-400'}`}>
            {motionDetected ? 'Active' : 'Inactive'}
          </div>
          <div className="text-xs text-text-secondary mt-1">
            {motionDetected ? 'People present' : 'Empty'}
          </div>
        </div>
      </div>
    </div>
  );
}

