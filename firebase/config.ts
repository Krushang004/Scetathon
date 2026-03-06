import { initializeApp, getApp, getApps } from 'firebase/app';

/**
 * Firebase configuration
 *
 * Recommended: set these via `.env.local` (NEXT_PUBLIC_*) for each environment.
 * The defaults below match your `scetathon-ss` Firebase web config (except databaseURL).
 *
 * Note: `apiKey` is not a secret in Firebase web apps; it identifies the project.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyAFEHMiGCuwzzsSbUza9YEco4vGzqpsD0k',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'scetathon-ss.firebaseapp.com',
  /**
   * REQUIRED for Realtime Database.
   * Find it in Firebase Console → Realtime Database → Data (URL shown at top),
   * or Project settings → General.
   *
   * Example formats:
   * - https://<project-id>-default-rtdb.firebaseio.com
   * - https://<project-id>-default-rtdb.<region>.firebasedatabase.app
   */
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'scetathon-ss',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'scetathon-ss.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '619210846571',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:619210846571:web:a9d9d2e2ffd9dc3313dc2e',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-QER9S1PS2C',
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export function isRealtimeDbConfigured() {
  return Boolean(firebaseConfig.databaseURL);
}

/**
 * Lazy Realtime Database getter.
 *
 * Why: Next.js may evaluate module code during prerender/build. If `databaseURL`
 * is missing in the build environment (common on Vercel), eagerly calling
 * `getDatabase()` can throw and fail the build.
 */
export async function getRealtimeDatabase() {
  if (typeof window === 'undefined') return null;
  if (!isRealtimeDbConfigured()) return null;
  const dbMod = await import('firebase/database');
  return dbMod.getDatabase(app);
}

/**
 * Optional: Firebase Analytics (only works in the browser).
 * Use this from client components if you want analytics:
 *
 *   import { initAnalytics } from '@/firebase/config'
 *   useEffect(() => { initAnalytics() }, [])
 */
export async function initAnalytics() {
  if (typeof window === 'undefined') return null;
  const analyticsMod = await import('firebase/analytics');
  const supported = await analyticsMod.isSupported();
  if (!supported) return null;
  return analyticsMod.getAnalytics(app);
}

export default app;

