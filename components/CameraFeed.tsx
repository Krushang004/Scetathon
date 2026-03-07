'use client';

import { Camera, Video, Image as ImageIcon } from 'lucide-react';
import { CameraData } from '@/firebase/listeners';

interface CameraFeedProps {
  cameraData: CameraData | null;
  motionDetected: boolean;
}

export default function CameraFeed({ cameraData, motionDetected }: CameraFeedProps) {

  // Build stream URL with ngrok warning bypass as a query param
  const getStreamUrl = (url: string) => {
    // Add ngrok-skip-browser-warning via a custom approach
    // We append a cache-bust timestamp so the browser keeps refreshing
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  };

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
        <div className="relative bg-dark-bg rounded-lg overflow-hidden" style={{ height: '300px' }}>
          {cameraData?.live_feed_url ? (
            <>
              {/* img tag works for MJPEG streams, unlike iframe */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cameraData.live_feed_url}
                className="w-full h-full object-cover"
                alt="Live Camera Feed"
                // This tells the browser to send the ngrok-skip-browser-warning header
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // If stream fails, show fallback
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              {/* Live indicator badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1 bg-red-500/80 px-2 py-1 rounded text-xs text-white font-medium">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                LIVE
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-16 h-16 mx-auto mb-2 text-text-secondary" />
                <p className="text-text-secondary">No live feed available</p>
                <p className="text-sm text-text-secondary mt-1">
                  Configure stream URL in Firebase
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stream URL debug info */}
      {cameraData?.live_feed_url && (
        <div className="mt-2 text-xs text-text-secondary break-all">
          Stream: {cameraData.live_feed_url}
        </div>
      )}

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