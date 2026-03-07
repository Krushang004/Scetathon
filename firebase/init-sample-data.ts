/**
 * Sample data initialization script for Firebase Realtime Database
 * 
 * This file contains sample data structure that can be used to initialize
 * your Firebase database. You can run this manually or use Firebase CLI.
 * 
 * To use with Firebase CLI:
 * 1. Install Firebase CLI: npm install -g firebase-tools
 * 2. Login: firebase login
 * 3. Initialize: firebase init database
 * 4. Copy this data to database.rules.json or use Firebase Console
 */

export const sampleDatabaseStructure = {
  classroom: {
    motion_detected: false,
    last_motion_time: Date.now(),
  },
  devices: {
    led: false,
  },
  camera: {
    live_feed_url: "http://192.168.1.100/stream", // Replace with your external camera IP
    last_snapshot: "",
  },
  manual_override: {
    led: false,
  },
  motion_logs: {
    // Logs will be added automatically by ESP32/motion server
  },
};

/**
 * Firebase Realtime Database Rules (for development)
 * 
 * WARNING: These rules allow public read/write access.
 * For production, implement proper authentication.
 */
export const databaseRules = {
  rules: {
    classroom: {
      ".read": true,
      ".write": true,
    },
    devices: {
      ".read": true,
      ".write": true,
    },
    camera: {
      ".read": true,
      ".write": true,
    },
    manual_override: {
      ".read": true,
      ".write": true,
    },
    motion_logs: {
      ".read": true,
      ".write": true,
    },
  },
};

