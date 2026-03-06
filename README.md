# Smart Classroom Dashboard

A modern IoT monitoring dashboard for a Smart Classroom Automation System using ESP32-CAM with external camera and sensors. The dashboard displays real-time sensor data, camera feeds, and allows administrators to control classroom devices.

## Features

- 🎥 **Live Camera Feed** - Real-time video stream from ESP32-CAM
- 🔍 **Motion Detection** - Real-time motion status with people count
- 💡 **Device Control** - Remote control of lights and fans
- 📊 **Analytics** - Charts showing motion activity, people count, and device usage
- ⚡ **Real-time Updates** - Automatic updates via Firebase Realtime Database

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Backend**: Firebase Realtime Database

## Prerequisites

- Node.js 18+ and npm/yarn
- Firebase project with Realtime Database enabled
- ESP32-CAM device configured to send data to Firebase

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**

   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

   You can find these values in your Firebase project settings:
   - Go to Firebase Console → Project Settings → General
   - Scroll down to "Your apps" section
   - Copy the config values

4. **Configure Firebase Realtime Database**

   Set up your database rules in Firebase Console:
   ```json
   {
     "rules": {
       "classroom": {
         ".read": true,
         ".write": true
       },
       "devices": {
         ".read": true,
         ".write": true
       },
       "camera": {
         ".read": true,
         ".write": true
       },
       "manual_override": {
         ".read": true,
         ".write": true
       }
     }
   }
   ```

   **Note**: For production, implement proper authentication and security rules.

5. **Set up Firebase Database Structure**

   Initialize your Firebase Realtime Database with this structure:
   ```json
   {
     "classroom": {
       "motion_detected": false,
       "people_count": 0,
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

## Running the Project

1. **Development mode**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## ESP32-CAM Integration

Your ESP32-CAM should send data to Firebase in the following format:

### Classroom Data
```cpp
Firebase.setBool("/classroom/motion_detected", motionDetected);
Firebase.setInt("/classroom/people_count", peopleCount);
Firebase.setInt("/classroom/last_motion_time", timestamp);
```

### Device Control Reading
```cpp
// Read device states from Firebase
bool lightZone1 = Firebase.getBool("/devices/light_zone1");
bool lightZone2 = Firebase.getBool("/devices/light_zone2");
bool fan = Firebase.getBool("/devices/fan");
```

### Camera Feed
- Set `live_feed_url` to your ESP32-CAM stream URL (e.g., `http://esp32-cam-ip/stream`)
- Update `last_snapshot` with the URL of the latest motion snapshot image

## Project Structure

```
dashboard/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main dashboard page
├── components/
│   ├── CameraFeed.tsx       # Camera feed component
│   ├── MotionStatus.tsx     # Motion detection status
│   ├── EnvironmentStats.tsx # Classroom activity summary (no env sensors)
│   ├── DeviceControls.tsx   # Device control panel
│   └── AnalyticsCharts.tsx  # Analytics charts
├── firebase/
│   ├── config.ts            # Firebase configuration
│   └── listeners.ts         # Firebase real-time listeners
├── public/                  # Static assets
└── package.json
```

## Dashboard Components

### 1. Camera Feed
- Displays live video stream from ESP32-CAM
- Shows last motion snapshot
- Motion detection indicator

### 2. Motion Status
- Real-time motion detection status
- People count display
- Last motion timestamp

### 3. Environment Stats
- Classroom activity summary (motion / people count / last motion)

### 4. Device Controls
- Toggle lights (Zone 1 & Zone 2)
- Control fan
- Real-time state updates

### 5. Analytics Charts
- People count trend (24h)
- Motion detection activity (24h)
- Device usage status

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```js
colors: {
  'dark-bg': '#06141B',
  'card-bg': '#253745',
  'text-primary': '#CCD0CF',
  'text-secondary': '#9BA8AB',
  'accent': '#4A5C6A',
}
```

### Adding New Sensors
1. Update Firebase database structure
2. Add new fields to `ClassroomData` interface in `firebase/listeners.ts`
3. Create new components or extend existing ones
4. Add listeners in `app/page.tsx`

## Troubleshooting

### Firebase Connection Issues
- Verify your `.env.local` file has correct Firebase credentials
- Check Firebase Realtime Database rules allow read/write
- Ensure your Firebase project has Realtime Database enabled

### Camera Feed Not Showing
- Verify ESP32-CAM stream URL is correct
- Check CORS settings if accessing from different domain
- Ensure ESP32-CAM is accessible from your network

### Real-time Updates Not Working
- Check browser console for errors
- Verify Firebase listeners are properly set up
- Ensure database structure matches expected format

## Security Notes

⚠️ **Important**: The current Firebase rules allow public read/write access. For production:

1. Implement Firebase Authentication
2. Set up proper security rules based on user roles
3. Use environment variables for sensitive data
4. Enable Firebase App Check for additional security

## License

MIT License - feel free to use this project for your IoT applications.

## Support

For issues or questions, please open an issue on the repository.

