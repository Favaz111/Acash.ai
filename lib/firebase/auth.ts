import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

// Export for use in other modules
export { onAuthStateChanged };
export type { User, Unsubscribe };

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

// تسجيل مستخدم جديد
export async function registerUser(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  if (!auth || !db) {
    throw new Error(
      'Firebase is not configured. Please check your .env.local file and restart the server.\n' +
        'Make sure all NEXT_PUBLIC_FIREBASE_* variables are set correctly.'
    );
  }

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // تحديث الملف الشخصي
  await updateProfile(user, { displayName });

  // إنشاء مستند المستخدم في Firestore
  const userProfile: UserProfile = {
    uid: user.uid,
    email: user.email!,
    emailVerified: false,
    displayName,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(doc(db, 'users', user.uid), userProfile);

  return user;
}

// تسجيل الدخول
export async function loginUser(email: string, password: string): Promise<User> {
  if (!auth) {
    throw new Error('Firebase is not configured. Please add Firebase config to .env.local');
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Create session cookie
  try {
    const idToken = await user.getIdToken();
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
  } catch (error) {
    console.error('Failed to create session:', error);
  }

  return user;
}

// تسجيل الخروج
export async function logoutUser(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase is not configured. Please add Firebase config to .env.local');
  }

  // Delete session cookie
  try {
    await fetch('/api/auth/session', {
      method: 'DELETE',
    });
  } catch (error) {
    console.error('Failed to delete session:', error);
  }

  await signOut(auth);
}

// إعادة تعيين كلمة المرور
export async function resetPassword(email: string): Promise<void> {
  if (!auth) {
    throw new Error('Firebase is not configured. Please add Firebase config to .env.local');
  }

  await sendPasswordResetEmail(auth, email);
}

// تسجيل الدخول بجوجل
export async function loginWithGoogle(): Promise<User> {
  if (!auth) {
    throw new Error('Firebase is not configured. Please add Firebase config to .env.local');
  }

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });

  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;

  // Check if user exists in Firestore, create if not
  if (db) {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        emailVerified: user.emailVerified,
        displayName: user.displayName || 'مستخدم',
        ...(user.photoURL ? { photoURL: user.photoURL } : {}),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(userDocRef, userProfile);
    }
  }

  // Create session cookie
  try {
    const idToken = await user.getIdToken();
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
  } catch (error) {
    console.error('Failed to create session:', error);
  }

  return user;
}

// إرسال رابط تسجيل الدخول السحري
export async function sendMagicLink(email: string): Promise<void> {
  if (!auth) {
    throw new Error('Firebase is not configured. Please add Firebase config to .env.local');
  }

  const actionCodeSettings = {
    url: `${window.location.origin}/auth/verify-email`,
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);

  // Save email to localStorage for verification
  window.localStorage.setItem('emailForSignIn', email);
}

// التحقق من رابط تسجيل الدخول وإكمال العملية
export async function verifyMagicLink(url: string): Promise<User> {
  if (!auth) {
    throw new Error('Firebase is not configured. Please add Firebase config to .env.local');
  }

  if (!isSignInWithEmailLink(auth, url)) {
    throw new Error('Invalid sign-in link');
  }

  let email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    email = window.prompt('يرجى تأكيد بريدك الإلكتروني للمتابعة') || '';
  }

  const userCredential = await signInWithEmailLink(auth, email, url);
  const user = userCredential.user;

  window.localStorage.removeItem('emailForSignIn');

  // Check if user exists in Firestore, create if not
  if (db) {
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      const userProfile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        emailVerified: user.emailVerified,
        displayName: user.email!.split('@')[0] || 'مستخدم',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(userDocRef, userProfile);
    }
  }

  // Create session cookie
  try {
    const idToken = await user.getIdToken();
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
  } catch (error) {
    console.error('Failed to create session:', error);
  }

  return user;
}

// جلب ملف المستخدم
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) {
    throw new Error('Firebase is not configured. Please add Firebase config to .env.local');
  }

  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserProfile;
  }

  return null;
}
