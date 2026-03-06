import { ref, onValue, off, set, get } from 'firebase/database';
import { getRealtimeDatabase } from './config';

// Types for Firebase data
export interface ClassroomData {
  motion_detected: boolean;
  people_count: number;
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
  let classroomRef: ReturnType<typeof ref> | null = null;

  (async () => {
    const db = await getRealtimeDatabase();
    if (!db) {
      callback(null);
      return;
    }

    classroomRef = ref(db, 'classroom');

    onValue(classroomRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  })();

  return () => {
    if (classroomRef) off(classroomRef);
  };
};

// Listen to devices data changes
export const listenToDevices = (
  callback: (data: DevicesData | null) => void
) => {
  let devicesRef: ReturnType<typeof ref> | null = null;

  (async () => {
    const db = await getRealtimeDatabase();
    if (!db) {
      callback(null);
      return;
    }

    devicesRef = ref(db, 'devices');

    onValue(devicesRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  })();

  return () => {
    if (devicesRef) off(devicesRef);
  };
};

// Listen to camera data changes
export const listenToCamera = (
  callback: (data: CameraData | null) => void
) => {
  let cameraRef: ReturnType<typeof ref> | null = null;

  (async () => {
    const db = await getRealtimeDatabase();
    if (!db) {
      callback(null);
      return;
    }

    cameraRef = ref(db, 'camera');

    onValue(cameraRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
  })();

  return () => {
    if (cameraRef) off(cameraRef);
  };
};

// Update device state
export const updateDevice = async (
  device: 'light_zone1' | 'light_zone2' | 'fan',
  value: boolean
) => {
  const db = await getRealtimeDatabase();
  if (!db) throw new Error('Firebase Realtime Database is not configured (missing databaseURL).');
  const deviceRef = ref(db, `devices/${device}`);
  await set(deviceRef, value);
};

// Update manual override
export const updateManualOverride = async (
  device: 'light_zone1' | 'fan',
  value: boolean
) => {
  const db = await getRealtimeDatabase();
  if (!db) throw new Error('Firebase Realtime Database is not configured (missing databaseURL).');
  const overrideRef = ref(db, `manual_override/${device}`);
  await set(overrideRef, value);
};

// Get historical data (for analytics)
export const getHistoricalData = async (path: string) => {
  const db = await getRealtimeDatabase();
  if (!db) throw new Error('Firebase Realtime Database is not configured (missing databaseURL).');
  const dataRef = ref(db, path);
  const snapshot = await get(dataRef);
  return snapshot.val();
};

