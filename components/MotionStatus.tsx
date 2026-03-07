'use client';

import { Activity, Clock } from 'lucide-react';
import { ClassroomData } from '@/firebase/listeners';

interface MotionStatusProps {
  classroomData: ClassroomData | null;
}

export default function MotionStatus({ classroomData }: MotionStatusProps) {
  const motionDetected  = classroomData?.motion_detected || false;
  const roomStatus      = classroomData?.status || (motionDetected ? 'Occupied' : 'Empty');
  const lastMotionTime  = classroomData?.last_motion_time
    ? new Date(classroomData.last_motion_time)
    : null;
  const lastUpdated     = classroomData?.last_updated || null;

  const formatTime = (date: Date) => date.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });

  const getTimeAgo = (date: Date) => {
    const diffMins  = Math.floor((Date.now() - date.getTime()) / 60000);
    const diffHours = Math.floor(diffMins / 60);
    if (diffMins < 1)  return 'Just now';
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
        {/* Motion Status */}
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

        {/* Room Occupied/Empty */}
        <div className="flex items-center justify-between">
          <span className="text-text-secondary">Room</span>
          <span className={`font-semibold px-3 py-1 rounded-full text-sm ${
            roomStatus === 'Occupied'
              ? 'bg-green-400/20 text-green-400'
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            {roomStatus}
          </span>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <div className="flex items-center justify-between pt-2 border-t border-accent">
            <span className="text-text-secondary text-sm">Last Updated</span>
            <span className="text-text-primary text-sm">{lastUpdated}</span>
          </div>
        )}

        {/* Last Motion Time */}
        {lastMotionTime && (
          <div className="flex items-center justify-between pt-2 border-t border-accent">
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