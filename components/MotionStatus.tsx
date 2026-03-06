'use client';

import { Activity, Users, Clock } from 'lucide-react';
import { ClassroomData } from '@/firebase/listeners';

interface MotionStatusProps {
  classroomData: ClassroomData | null;
}

export default function MotionStatus({ classroomData }: MotionStatusProps) {
  const motionDetected = classroomData?.motion_detected || false;
  const peopleCount = classroomData?.people_count || 0;
  const lastMotionTime = classroomData?.last_motion_time 
    ? new Date(classroomData.last_motion_time) 
    : null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="bg-card-bg rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Motion Detection Status
      </h2>

      <div className="space-y-4">
        {/* Motion Status Indicator */}
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Status</span>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${
              motionDetected ? 'bg-green-400 animate-pulse' : 'bg-gray-500'
            }`} />
            <span className={`font-semibold ${
              motionDetected ? 'text-green-400' : 'text-gray-400'
            }`}>
              {motionDetected ? 'Motion Detected' : 'No Motion'}
            </span>
          </div>
        </div>

        {/* People Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-text-secondary">
            <Users className="w-4 h-4" />
            <span>People Count</span>
          </div>
          <span className="text-text-primary font-semibold text-lg">
            {peopleCount}
          </span>
        </div>

        {/* Last Motion Time */}
        {lastMotionTime && (
          <div className="flex items-center justify-between pt-4 border-t border-accent">
            <div className="flex items-center gap-2 text-text-secondary">
              <Clock className="w-4 h-4" />
              <span>Last Motion</span>
            </div>
            <div className="text-right">
              <div className="text-text-primary font-medium">
                {formatTime(lastMotionTime)}
              </div>
              <div className="text-sm text-text-secondary">
                {getTimeAgo(lastMotionTime)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

