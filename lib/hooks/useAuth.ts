/**
 * useAuth Hook
 * React hook for authentication state management
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from 'firebase/auth';
import {
  onAuthStateChange,
  registerUserAdvanced,
  loginUserAdvanced,
  logoutUserAdvanced,
  sendPasswordReset,
  changePassword,
  changeEmail,
  updateDisplayName,
  isEmailVerified,
  isPremiumUser,
  getAuthErrorMessage,
} from '@/lib/firebase/auth-advanced';

export interface AuthUser extends User {
  isPremium?: boolean;
  emailVerified: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  updateEmail: (newEmail: string, password: string) => Promise<void>;
  updateName: (newName: string) => Promise<void>;
  checkEmailVerified: () => Promise<boolean>;
  checkPremium: () => Promise<boolean>;
}

export function useAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  const router = useRouter();

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        const isPremium = await isPremiumUser();
        const user: AuthUser = {
          ...firebaseUser,
          isPremium,
          emailVerified: firebaseUser.emailVerified,
        };

        setState({ user, loading: false, error: null });
      } else {
        setState({ user: null, loading: false, error: null });
      }
    });

    return () => unsubscribe();
  }, []);

  // Register
  const register = async (email: string, password: string, displayName: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await registerUserAdvanced(email, password, displayName);
      // User state will be updated by onAuthStateChange
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error);
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await loginUserAdvanced(email, password);
      // User state will be updated by onAuthStateChange
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error);
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      await logoutUserAdvanced();
      router.push('/');
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error);
      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  // Reset Password
  const resetPassword = async (email: string) => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      await sendPasswordReset(email);
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error);
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  // Update Password
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      await changePassword(currentPassword, newPassword);
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error);
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  // Update Email
  const updateEmail = async (newEmail: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      await changeEmail(newEmail, password);
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error);
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  // Update Name
  const updateName = async (newName: string) => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      await updateDisplayName(newName);
      // Update local state
      if (state.user) {
        setState((prev) => ({
          ...prev,
          user: prev.user ? { ...prev.user, displayName: newName } : null,
        }));
      }
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error);
      setState((prev) => ({ ...prev, error: errorMessage }));
      throw new Error(errorMessage);
    }
  };

  // Check Email Verified
  const checkEmailVerified = async (): Promise<boolean> => {
    return await isEmailVerified();
  };

  // Check Premium
  const checkPremium = async (): Promise<boolean> => {
    return await isPremiumUser();
  };

  return {
    ...state,
    register,
    login,
    logout,
    resetPassword,
    updatePassword,
    updateEmail,
    updateName,
    checkEmailVerified,
    checkPremium,
  };
}

// Helper hook for protected routes
export function useRequireAuth(redirectTo: string = '/auth/login') {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
}

// Helper hook for premium features
export function useRequirePremium(redirectTo: string = '/pricing') {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !user.isPremium) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading, isPremium: user?.isPremium || false };
}
