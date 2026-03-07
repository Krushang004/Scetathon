'use client';

import { Activity, Clock } from 'lucide-react';
import { ClassroomData } from '@/firebase/listeners';

interface EnvironmentStatsProps {
  classroomData: ClassroomData | null;
}

export default function EnvironmentStats({ classroomData }: EnvironmentStatsProps) {
  const motionDetected = classroomData?.motion_detected || false;
  const lastMotionTime = classroomData?.last_motion_time
    ? new Date(classroomData.last_motion_time)
    : null;

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  return (
    <div className="bg-card-bg rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-text-primary mb-4">
        Classroom Activity
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Activity Card */}
        <div className="bg-dark-bg rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Activity className={`w-5 h-5 ${motionDetected ? 'text-green-400' : 'text-gray-400'}`} />
            <span className="text-xs text-text-secondary">Motion</span>
          </div>
          <div className={`text-2xl font-bold ${motionDetected ? 'text-green-400' : 'text-gray-400'}`}>
            {motionDetected ? 'Detected' : 'None'}
          </div>
          <div className="text-xs text-text-secondary mt-1">
            {motionDetected ? 'Activity in classroom' : 'No recent motion'}
          </div>
        </div>

        {/* Last Motion Card */}
        <div className="bg-dark-bg rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-text-secondary" />
            <span className="text-xs text-text-secondary">Last Motion</span>
          </div>
          <div className="text-lg font-bold text-text-primary">
            {lastMotionTime ? formatTime(lastMotionTime) : '—'}
          </div>
          <div className="text-xs text-text-secondary mt-1">
            {lastMotionTime ? 'Timestamp from Firebase' : 'No motion yet'}
          </div>
        </div>
      </div>
    </div>
  );
}

