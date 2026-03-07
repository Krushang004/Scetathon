# Quick Setup Guide

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Configure Firebase

1. Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)

2. Enable **Realtime Database**:
   - Go to Firebase Console → Build → Realtime Database
   - Click "Create Database"
   - Choose your region
   - Start in **test mode** (for development)

3. Get your Firebase configuration:
   - Go to Project Settings → General
   - Scroll to "Your apps" section
   - Click the web icon (`</>`) to add a web app
   - Copy the `firebaseConfig` values

4. Create `.env.local` file:
   Create `D:\krushang\projects\dashboard\.env.local` (manually) with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://YOUR_PROJECT-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID
```

**Important**: `NEXT_PUBLIC_FIREBASE_DATABASE_URL` is required for Realtime Database. Find it in Firebase Console → **Realtime Database → Data** (shown at the top).

## Step 3: Initialize Database Structure

1. Go to Firebase Console → Realtime Database → Data

2. Add the following structure manually or use the sample data from `firebase/init-sample-data.ts`:

```json
{
  "classroom": {
    "motion_detected": false,
    "last_motion_time": 0
  },
  "devices": {
    "led": false
  },
  "camera": {
    "live_feed_url": "",
    "last_snapshot": ""
  },
  "manual_override": {
    "led": false
  },
  "motion_logs": {}
}
```

## Step 4: Configure Database Rules

Go to Firebase Console → Realtime Database → Rules

For development, use:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **Warning**: This allows public access. For production, implement authentication.

## Step 5: Run the Dashboard

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Connect ESP32-CAM

Your ESP32-CAM should send data to Firebase using the Firebase Arduino library:

```cpp
#include <FirebaseESP32.h>

// Initialize Firebase
FirebaseData fbdo;
Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);

// Send sensor data
Firebase.setBool("/classroom/motion_detected", motion);
Firebase.setInt("/classroom/last_motion_time", timestamp);

// Read device control
bool ledOn = Firebase.getBool("/devices/led");
```

## Testing Without ESP32-CAM

You can manually update values in Firebase Console to test the dashboard:

1. Go to Firebase Console → Realtime Database
2. Click on a value to edit it
3. Watch the dashboard update in real-time!

## Troubleshooting

### Dashboard shows "Disconnected"
- Check `.env.local` has correct Firebase credentials
- Verify Realtime Database is enabled
- Check browser console for errors

### Camera feed not showing
- Update `camera/live_feed_url` in Firebase with your ESP32-CAM stream URL
- Ensure ESP32-CAM is accessible from your network
- Check CORS settings if needed

### Changes not reflecting
- Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check Firebase Console to verify data is updating
- Check browser console for Firebase errors

