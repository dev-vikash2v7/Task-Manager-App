import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth , getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyByN6o1a4Q-XGaurkB4gh9f_Xis3ICtQEQ",
  authDomain: "gigstaskmanager.firebaseapp.com",
  projectId: "gigstaskmanager",
  storageBucket: "gigstaskmanager.firebasestorage.app",
  messagingSenderId: "387521966166",
  appId: "1:387521966166:web:a821aeb510961a3245cbf7",
  measurementId: "G-2YGTR0H72B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app; 