'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import CameraFeed from '@/components/CameraFeed';
import MotionStatus from '@/components/MotionStatus';
import EnvironmentStats from '@/components/EnvironmentStats';
import DeviceControls from '@/components/DeviceControls';
import AnalyticsCharts from '@/components/AnalyticsCharts';
import { isRealtimeDbConfigured } from '@/firebase/config';
import {
  listenToClassroom,
  listenToDevices,
  listenToCamera,
  ClassroomData,
  DevicesData,
  CameraData,
} from '@/firebase/listeners';

export default function Dashboard() {
  const [classroomData, setClassroomData] = useState<ClassroomData | null>(null);
  const [devicesData, setDevicesData] = useState<DevicesData | null>(null);
  const [cameraData, setCameraData] = useState<CameraData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to classroom data
    const unsubscribeClassroom = listenToClassroom((data) => {
      setClassroomData(data);
      // If Firebase is configured, any callback implies the client is running and listener is active.
      setIsConnected(isRealtimeDbConfigured());
      setLoading(false);
    });

    // Listen to devices data
    const unsubscribeDevices = listenToDevices((data) => {
      setDevicesData(data);
    });

    // Listen to camera data
    const unsubscribeCamera = listenToCamera((data) => {
      setCameraData(data);
    });

    // Cleanup listeners on unmount
    return () => {
      unsubscribeClassroom();
      unsubscribeDevices();
      unsubscribeCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="bg-card-bg border-b border-accent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                Smart Classroom Dashboard
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                IoT Monitoring & Control System
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
              }`} />
              <span className="text-sm text-text-secondary flex items-center gap-2">
                {isConnected ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    Connected
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4" />
                    Disconnected
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {process.env.NODE_ENV !== 'production' && !isRealtimeDbConfigured() && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <div className="text-yellow-200 font-medium">Firebase Realtime Database is not configured</div>
            <div className="text-sm text-text-secondary mt-1">
              Set <code className="text-yellow-200">NEXT_PUBLIC_FIREBASE_DATABASE_URL</code> in your environment
              (Vercel Project → Settings → Environment Variables) and redeploy.
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-text-primary mx-auto mb-4"></div>
              <p className="text-text-secondary">Connecting to Firebase...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top Section - System Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MotionStatus classroomData={classroomData} />
              <EnvironmentStats classroomData={classroomData} />
            </div>

            {/* Middle Section - Camera Feed */}
            <CameraFeed 
              cameraData={cameraData} 
              motionDetected={classroomData?.motion_detected || false}
            />

            {/* Bottom Section - Controls */}
            <DeviceControls devicesData={devicesData} />

            {/* Analytics Section */}
            <AnalyticsCharts 
              classroomData={classroomData}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card-bg border-t border-accent mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-text-secondary">
            Smart Classroom Automation System • Powered by ESP32-CAM & Firebase
          </p>
        </div>
      </footer>
    </div>
  );
}

