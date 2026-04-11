import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const cleanEnv = (value: string | undefined) => {
  if (!value) {
    return '';
  }

  // Handles common copy/paste mistakes from config snippets: "value",
  const trimmed = value.trim().replace(/,$/, '');
  return trimmed.replace(/^['"]|['"]$/g, '');
};

// config from env:
const firebaseConfig = {
  apiKey: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

const missingFirebaseVars = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingFirebaseVars.length > 0) {
  throw new Error(`Missing Firebase env vars: ${missingFirebaseVars.join(', ')}`);
}

if (!firebaseConfig.apiKey.startsWith('AIza')) {
  throw new Error('Invalid NEXT_PUBLIC_FIREBASE_API_KEY format. Expected a key that starts with "AIza".');
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
