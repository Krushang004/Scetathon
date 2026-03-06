import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';

/**
 * Firebase configuration
 *
 * Recommended: set these via `.env.local` (NEXT_PUBLIC_*) for each environment.
 * Do NOT hardcode project keys in the repo.
 */
const envConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  /**
   * REQUIRED for Realtime Database.
   * Find it in Firebase Console → Realtime Database → Data (URL shown at top),
   * or Project settings → General.
   *
   * Example formats:
   * - https://<project-id>-default-rtdb.firebaseio.com
   * - https://<project-id>-default-rtdb.<region>.firebasedatabase.app
   */
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

function getClientApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;
  if (!isFirebaseConfigured()) return null;

  const firebaseConfig = {
    apiKey: envConfig.apiKey!,
    authDomain: envConfig.authDomain!,
    databaseURL: envConfig.databaseURL,
    projectId: envConfig.projectId!,
    storageBucket: envConfig.storageBucket,
    messagingSenderId: envConfig.messagingSenderId,
    appId: envConfig.appId!,
    measurementId: envConfig.measurementId,
  };

  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function isFirebaseConfigured() {
  return Boolean(envConfig.apiKey && envConfig.authDomain && envConfig.projectId && envConfig.appId);
}

export function isRealtimeDbConfigured() {
  return isFirebaseConfigured() && Boolean(envConfig.databaseURL);
}

/**
 * Lazy Realtime Database getter.
 *
 * Why: Next.js may evaluate module code during prerender/build. If `databaseURL`
 * is missing in the build environment (common on Vercel), eagerly calling
 * `getDatabase()` can throw and fail the build.
 */
export async function getRealtimeDatabase() {
  if (!isRealtimeDbConfigured()) return null;
  const app = getClientApp();
  if (!app) return null;
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
  const app = getClientApp();
  if (!app) return null;
  const analyticsMod = await import('firebase/analytics');
  const supported = await analyticsMod.isSupported();
  if (!supported) return null;
  return analyticsMod.getAnalytics(app);
}

