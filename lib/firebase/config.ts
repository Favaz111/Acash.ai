import {
  initializeApp,
  getApps,
  getApp,
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Build Firebase config with proper typing
const buildFirebaseConfig = (): FirebaseOptions | null => {
  // Use direct process.env access for Next.js to inline values at build time
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

  // Check if all required fields are present
  if (!apiKey || !projectId || !appId) {
    console.error(
      '❌ Firebase configuration is incomplete!\n' +
        '   Missing required environment variables.\n' +
        '   Please check .env.local file and ensure all NEXT_PUBLIC_FIREBASE_* variables are set.\n' +
        '   Required: API_KEY, PROJECT_ID, APP_ID\n' +
        `   Found: apiKey=${!!apiKey}, projectId=${!!projectId}, appId=${!!appId}`
    );
    return null;
  }

  const config: FirebaseOptions = {
    apiKey,
    projectId,
    appId,
  };

  // Add optional fields only if they exist
  if (authDomain) config.authDomain = authDomain;
  if (storageBucket) config.storageBucket = storageBucket;
  if (messagingSenderId) config.messagingSenderId = messagingSenderId;

  return config;
};

const firebaseConfig = buildFirebaseConfig();

// Initialize Firebase only if config is valid
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (firebaseConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
  }
} else {
  console.error('❌ Firebase config is null - check environment variables');
}

// Helper functions to ensure Firebase is initialized
export function getAuthInstance(): Auth {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Check your environment variables.');
  }
  return auth;
}

export function getDbInstance(): Firestore {
  if (!db) {
    throw new Error('Firebase Firestore is not initialized. Check your environment variables.');
  }
  return db;
}

export function getStorageInstance(): FirebaseStorage {
  if (!storage) {
    throw new Error('Firebase Storage is not initialized. Check your environment variables.');
  }
  return storage;
}

export { auth, db, storage };
export default app;
