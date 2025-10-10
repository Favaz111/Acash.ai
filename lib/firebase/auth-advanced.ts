/**
 * Advanced Firebase Authentication
 * Complete auth system with all features
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { auth } from './config';
import { createUser, updateUser as updateUserDb, updateLastLogin, getUser } from './db';

// ==========================================
// REGISTER & LOGIN
// ==========================================

export async function registerUserAdvanced(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }

  // Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update display name
  await updateProfile(user, { displayName });

  // Send verification email
  await sendEmailVerification(user);

  // Create user in Firestore
  await createUser(user.uid, {
    email: user.email!,
    displayName,
    emailVerified: false,
    // Phase One: No subscription fields
  });

  return user;
}

export async function loginUserAdvanced(email: string, password: string): Promise<User> {
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update last login time
  await updateLastLogin(user.uid);

  return user;
}

export async function logoutUserAdvanced(): Promise<void> {
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }

  await signOut(auth);
}

// ==========================================
// PASSWORD MANAGEMENT
// ==========================================

export async function sendPasswordReset(email: string): Promise<void> {
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }

  await sendPasswordResetEmail(auth, email);
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  if (!auth || !auth.currentUser) {
    throw new Error('No user signed in');
  }

  const user = auth.currentUser;
  const email = user.email;

  if (!email) {
    throw new Error('User email not found');
  }

  // Re-authenticate first
  const credential = EmailAuthProvider.credential(email, currentPassword);
  await reauthenticateWithCredential(user, credential);

  // Update password
  await updatePassword(user, newPassword);
}

// ==========================================
// EMAIL MANAGEMENT
// ==========================================

export async function changeEmail(newEmail: string, password: string): Promise<void> {
  if (!auth || !auth.currentUser) {
    throw new Error('No user signed in');
  }

  const user = auth.currentUser;
  const currentEmail = user.email;

  if (!currentEmail) {
    throw new Error('User email not found');
  }

  // Re-authenticate first
  const credential = EmailAuthProvider.credential(currentEmail, password);
  await reauthenticateWithCredential(user, credential);

  // Update email
  await updateEmail(user, newEmail);

  // Send verification to new email
  await sendEmailVerification(user);

  // Update in Firestore
  await updateUserDb(user.uid, { email: newEmail });
}

export async function resendVerificationEmail(): Promise<void> {
  if (!auth || !auth.currentUser) {
    throw new Error('No user signed in');
  }

  await sendEmailVerification(auth.currentUser);
}

// ==========================================
// PROFILE MANAGEMENT
// ==========================================

export async function updateDisplayName(newDisplayName: string): Promise<void> {
  if (!auth || !auth.currentUser) {
    throw new Error('No user signed in');
  }

  const user = auth.currentUser;

  // Update in Firebase Auth
  await updateProfile(user, { displayName: newDisplayName });

  // Update in Firestore
  await updateUserDb(user.uid, { displayName: newDisplayName });
}

export async function updatePhotoURL(photoURL: string): Promise<void> {
  if (!auth || !auth.currentUser) {
    throw new Error('No user signed in');
  }

  const user = auth.currentUser;

  // Update in Firebase Auth
  await updateProfile(user, { photoURL });

  // Update in Firestore
  await updateUserDb(user.uid, { photoURL });
}

// ==========================================
// ACCOUNT DELETION
// ==========================================

export async function deleteAccount(password: string): Promise<void> {
  if (!auth || !auth.currentUser) {
    throw new Error('No user signed in');
  }

  const user = auth.currentUser;
  const email = user.email;

  if (!email) {
    throw new Error('User email not found');
  }

  // Re-authenticate first (security requirement)
  const credential = EmailAuthProvider.credential(email, password);
  await reauthenticateWithCredential(user, credential);

  // const userId = user.uid; // Not needed in Phase One

  // Delete user from Firebase Auth
  await deleteUser(user);

  // Note: Firestore deletion should be handled by Cloud Functions or backend
  // For now, we'll leave the data (can be marked as deleted)
  // In production, implement proper data deletion according to GDPR
}

// ==========================================
// AUTH STATE OBSERVER
// ==========================================

export function onAuthStateChange(callback: (user: User | null) => void): Unsubscribe {
  if (!auth) {
    throw new Error('Firebase Auth not initialized');
  }

  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser(): User | null {
  if (!auth) {
    return null;
  }

  return auth.currentUser;
}

export async function waitForAuthReady(): Promise<User | null> {
  if (!auth) {
    return null;
  }

  if (!auth) return Promise.resolve(null);
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth!, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export async function isEmailVerified(): Promise<boolean> {
  if (!auth || !auth.currentUser) {
    return false;
  }

  // Reload user to get fresh data
  await auth.currentUser.reload();
  return auth.currentUser.emailVerified;
}

export async function getUserRole(): Promise<'free' | 'premium' | 'enterprise' | null> {
  if (!auth || !auth.currentUser) {
    return null;
  }

  const userData = await getUser(auth.currentUser.uid);
  return (userData as any)?.subscriptionTier || 'free';
}

export async function isPremiumUser(): Promise<boolean> {
  const role = await getUserRole();
  return role === 'premium' || role === 'enterprise';
}

export function isUserLoggedIn(): boolean {
  return !!auth?.currentUser;
}

// ==========================================
// ERROR MESSAGES (Arabic)
// ==========================================

export function getAuthErrorMessage(error: any): string {
  const code = error?.code || '';

  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'البريد الإلكتروني مستخدم بالفعل',
    'auth/invalid-email': 'البريد الإلكتروني غير صحيح',
    'auth/weak-password': 'كلمة المرور ضعيفة جداً',
    'auth/user-not-found': 'المستخدم غير موجود',
    'auth/wrong-password': 'كلمة المرور خاطئة',
    'auth/too-many-requests': 'محاولات كثيرة جداً. حاول لاحقاً',
    'auth/network-request-failed': 'خطأ في الاتصال بالشبكة',
    'auth/requires-recent-login': 'يجب تسجيل الدخول مرة أخرى',
    'auth/invalid-credential': 'بيانات الدخول غير صحيحة',
  };

  return errorMessages[code] || 'حدث خطأ غير متوقع. حاول مرة أخرى';
}
