import { ref, onValue, off, set, get } from 'firebase/database';
import { database } from './config';

// Types for Firebase data
export interface ClassroomData {
  motion_detected: boolean;
  people_count: number;
  temperature: number;
  humidity: number;
  last_motion_time: number;
}

export interface DevicesData {
  light_zone1: boolean;
  light_zone2: boolean;
  fan: boolean;
}

export interface CameraData {
  live_feed_url: string;
  last_snapshot: string;
}

export interface ManualOverrideData {
  light_zone1: boolean;
  fan: boolean;
}

// Listen to classroom data changes
export const listenToClassroom = (
  callback: (data: ClassroomData | null) => void
) => {
  const classroomRef = ref(database, 'classroom');
  
  onValue(classroomRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  return () => {
    off(classroomRef);
  };
};

// Listen to devices data changes
export const listenToDevices = (
  callback: (data: DevicesData | null) => void
) => {
  const devicesRef = ref(database, 'devices');
  
  onValue(devicesRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  return () => {
    off(devicesRef);
  };
};

// Listen to camera data changes
export const listenToCamera = (
  callback: (data: CameraData | null) => void
) => {
  const cameraRef = ref(database, 'camera');
  
  onValue(cameraRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });

  return () => {
    off(cameraRef);
  };
};

// Update device state
export const updateDevice = async (
  device: 'light_zone1' | 'light_zone2' | 'fan',
  value: boolean
) => {
  const deviceRef = ref(database, `devices/${device}`);
  await set(deviceRef, value);
};

// Update manual override
export const updateManualOverride = async (
  device: 'light_zone1' | 'fan',
  value: boolean
) => {
  const overrideRef = ref(database, `manual_override/${device}`);
  await set(overrideRef, value);
};

// Get historical data (for analytics)
export const getHistoricalData = async (path: string) => {
  const dataRef = ref(database, path);
  const snapshot = await get(dataRef);
  return snapshot.val();
};

