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
   ```bash
   cp .env.example .env.local
   ```

5. Fill in your Firebase credentials in `.env.local`

## Step 3: Initialize Database Structure

1. Go to Firebase Console → Realtime Database → Data

2. Add the following structure manually or use the sample data from `firebase/init-sample-data.ts`:

```json
{
  "classroom": {
    "motion_detected": false,
    "people_count": 0,
    "temperature": 25,
    "humidity": 50,
    "last_motion_time": 0
  },
  "devices": {
    "light_zone1": false,
    "light_zone2": false,
    "fan": false
  },
  "camera": {
    "live_feed_url": "",
    "last_snapshot": ""
  },
  "manual_override": {
    "light_zone1": false,
    "fan": false
  }
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
Firebase.setFloat("/classroom/temperature", temp);
Firebase.setFloat("/classroom/humidity", humidity);
Firebase.setBool("/classroom/motion_detected", motion);
Firebase.setInt("/classroom/people_count", count);
Firebase.setInt("/classroom/last_motion_time", timestamp);

// Read device control
bool lightOn = Firebase.getBool("/devices/light_zone1");
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

