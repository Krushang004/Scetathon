import { ref, onValue, off, set, get } from 'firebase/database';
import { getRealtimeDatabase } from './config';

export interface ClassroomData {
  motion: boolean;           // matches Python's push
  motion_detected: boolean;  // alias for compatibility
  status: string;            // 'Occupied' or 'Empty'
  last_motion_time: number;
  last_updated: string;
  timestamp: number;
}

export interface DevicesData {
  led: boolean;
}

export interface CameraData {
  live_feed_url: string;
  last_snapshot: string;
}

export interface ManualOverrideData {
  led: boolean;
}

// Listen to classroom motion data
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

    // Listen to /classroom/motion — matches what Python pushes
    classroomRef = ref(db, 'classroom/motion');

    onValue(classroomRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback(null);
        return;
      }
      // Normalize: support both 'motion' and 'motion_detected' fields
      callback({
        ...data,
        motion_detected: data.motion ?? data.motion_detected ?? false,
        last_motion_time: data.timestamp ?? Date.now(),
      });
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
      callback(snapshot.val());
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
      callback(snapshot.val());
    });
  })();

  return () => {
    if (cameraRef) off(cameraRef);
  };
};

// Update device state
export const updateDevice = async (
  device: 'led',
  value: boolean
) => {
  const db = await getRealtimeDatabase();
  if (!db) throw new Error('Firebase not configured');
  await set(ref(db, `devices/${device}`), value);
};

// Update manual override
export const updateManualOverride = async (
  device: 'led',
  value: boolean
) => {
  const db = await getRealtimeDatabase();
  if (!db) throw new Error('Firebase not configured');
  await set(ref(db, `manual_override/${device}`), value);
};

// Get historical data
export const getHistoricalData = async (path: string) => {
  const db = await getRealtimeDatabase();
  if (!db) throw new Error('Firebase not configured');
  const snapshot = await get(ref(db, path));
  return snapshot.val();
};

// Listen to motion logs
export const listenToMotionLogs = (
  callback: (logs: MotionLogEntry[] | null) => void
) => {
  let logsRef: ReturnType<typeof ref> | null = null;

  (async () => {
    const db = await getRealtimeDatabase();
    if (!db) {
      callback(null);
      return;
    }
    logsRef = ref(db, 'motion_logs');
    onValue(logsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        callback([]);
        return;
      }
      // Convert object to array and sort by timestamp (newest first)
      const logs = Object.entries(data)
        .map(([id, entry]: [string, any]) => ({
          id,
          ...entry,
        }))
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 50); // Keep last 50 entries
      callback(logs);
    });
  })();

  return () => {
    if (logsRef) off(logsRef);
  };
};

export interface MotionLogEntry {
  id: string;
  motion: boolean;
  timestamp: number;
  last_updated?: string;
}