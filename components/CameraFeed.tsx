'use client';

import { Camera, Video, Image as ImageIcon } from 'lucide-react';
import { CameraData } from '@/firebase/listeners';

interface CameraFeedProps {
  cameraData: CameraData | null;
  motionDetected: boolean;
}

export default function CameraFeed({ cameraData, motionDetected }: CameraFeedProps) {

  return (
    <div className="bg-card-bg rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary flex items-center gap-2">
          <Video className="w-5 h-5" />
          Camera Feed
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          motionDetected 
            ? 'bg-green-500/20 text-green-400' 
            : 'bg-gray-500/20 text-gray-400'
        }`}>
          {motionDetected ? 'Motion Detected' : 'No Motion'}
        </div>
      </div>

      {/* Live Feed */}
      <div className="mb-4">
        <div className="relative bg-dark-bg rounded-lg overflow-hidden aspect-video">
          {cameraData?.live_feed_url ? (
            <iframe
              src={cameraData.live_feed_url}
              className="w-full h-full"
              allow="camera; microphone"
              title="Live Camera Feed"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-2 text-text-secondary" />
                <p className="text-text-secondary">No live feed available</p>
                <p className="text-sm text-text-secondary mt-1">
                  Configure ESP32-CAM stream URL in Firebase
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Last Snapshot */}
      {cameraData?.last_snapshot && (
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-4 h-4 text-text-secondary" />
            <span className="text-sm text-text-secondary">Last Motion Snapshot</span>
          </div>
          <div className="relative bg-dark-bg rounded-lg overflow-hidden">
            <img
              src={cameraData.last_snapshot}
              alt="Last motion snapshot"
              className="w-full h-auto max-h-48 object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}

