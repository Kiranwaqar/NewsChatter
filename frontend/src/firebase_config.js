// firebase_config.js - Sets up Firebase connection using admin SDK credentials

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Important: For client-side (browser) Firebase usage, we need a different approach than server-side admin SDK
// The firebase_adminsdk.json file is typically used for server-side applications
// For client-side apps, we need to use the public Firebase config

// Your Firebase project configuration
// Replace these values with the ones from your Firebase project settings
// You can find these in your Firebase console → Project settings → General → Your apps → SDK setup and configuration
const firebaseConfig = {
    apiKey: "AIzaSyDHg0fD6AJAkWdMB74k5C7SEk1vjr3f8NQ",
    authDomain: "newschatter-a4810.firebaseapp.com",
    databaseURL: "https://newschatter-a4810-default-rtdb.firebaseio.com",
    projectId: "newschatter-a4810",
    storageBucket: "newschatter-a4810.firebasestorage.app",
    messagingSenderId: "385944410692",
    appId: "1:385944410692:web:742ca4bd97af3e991b3a11",
    measurementId: "G-YXS7480L06"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };