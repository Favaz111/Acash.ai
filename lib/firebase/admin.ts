/**
 * Firebase Admin SDK Configuration
 * Used for server-side operations (API routes, middleware, etc.)
 *
 * IMPORTANT: For production, you need to set FIREBASE_ADMIN_SERVICE_ACCOUNT environment variable
 * with your service account JSON credentials.
 *
 * For development, this file provides mock implementations that use the client SDK
 * to avoid permission issues.
 */

import { initializeApp, getApps, cert, type App, applicationDefault } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

let app: App | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

/**
 * Initialize Firebase Admin SDK
 * Only initializes once (singleton pattern)
 */
function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    try {
      const serviceAccountKey = process.env['FIREBASE_ADMIN_SERVICE_ACCOUNT'];
      if (serviceAccountKey && serviceAccountKey.trim()) {
        // Production: Use service account JSON from environment variable
        try {
          const serviceAccount = JSON.parse(serviceAccountKey);
          app = initializeApp({
            credential: cert(serviceAccount),
            projectId: serviceAccount.project_id,
          });
          console.log('✅ Firebase Admin initialized with service account');
        } catch (parseError) {
          console.error('❌ Failed to parse FIREBASE_ADMIN_SERVICE_ACCOUNT:', parseError);
          throw new Error('Invalid FIREBASE_ADMIN_SERVICE_ACCOUNT JSON format');
        }
      } else if (process.env['GOOGLE_APPLICATION_CREDENTIALS']) {
        // Alternative: Use application default credentials (for Cloud environments)
        app = initializeApp({
          credential: applicationDefault(),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
        console.log('✅ Firebase Admin initialized with application default credentials');
      } else {
        // Development fallback: Initialize with project ID only
        // Note: This will work for some operations but may have limited permissions
        console.warn(
          '⚠️ Firebase Admin initialized without credentials - some features may be limited'
        );
        console.warn(
          '⚠️ For full functionality, set FIREBASE_ADMIN_SERVICE_ACCOUNT environment variable'
        );

        app = initializeApp({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        });
      }
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Admin:', error);
      // Don't throw - allow app to continue with limited functionality
      console.warn('⚠️ Continuing without Firebase Admin - API routes may not work');
      return { app: null, auth: null, db: null };
    }
  } else {
    app = getApps()[0] || null;
  }

  try {
    auth = app ? getAuth(app) : null;
    db = app ? getFirestore(app) : null;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin services:', error);
    return { app, auth: null, db: null };
  }

  return { app, auth, db };
}

// Initialize on module load
const { app: adminApp, auth: adminAuth, db: adminDb } = initializeFirebaseAdmin();

export { adminApp as app, adminAuth as auth, adminDb as db };
export default { app: adminApp, auth: adminAuth, db: adminDb };
