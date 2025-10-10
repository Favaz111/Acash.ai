/**
 * Data Service Abstraction Layer
 *
 * Purpose: Provides a unified interface for all database operations,
 * allowing seamless transition from Firebase to Supabase in Phase Two
 * without modifying application code.
 *
 * Architecture Pattern: Repository Pattern + Adapter Pattern
 *
 * Phase One: Firebase Implementation
 * Phase Two: Switch to Supabase by changing the implementation
 *
 * @version 1.0.0 - Phase One (Firebase)
 */

import type { User } from '@/types/database';

// ==========================================
// CORE INTERFACES
// ==========================================

/**
 * Main data service interface
 * All database operations MUST go through this interface
 */
export interface IDataService {
  // ==========================================
  // USER OPERATIONS
  // ==========================================

  /**
   * Get user by ID
   * @returns User object or null if not found
   */
  getUser(userId: string): Promise<User | null>;

  /**
   * Create a new user
   */
  createUser(userId: string, userData: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>): Promise<void>;

  /**
   * Update user data
   */
  updateUser(userId: string, updates: Partial<Omit<User, 'uid' | 'createdAt'>>): Promise<void>;

  /**
   * Update user's last login timestamp
   */
  updateLastLogin(userId: string): Promise<void>;

  // ==========================================
  // CALCULATION OPERATIONS
  // ==========================================

  /**
   * Save a calculation result
   * @returns The ID of the saved calculation
   */
  saveCalculation(
    userId: string,
    toolId: string,
    toolName: string,
    data: Record<string, unknown>
  ): Promise<string>;

  /**
   * Get all calculations for a user, optionally filtered by tool
   */
  getUserCalculations(userId: string, toolId?: string): Promise<CalculationData[]>;

  /**
   * Get the most recent calculation for a specific tool
   */
  getLatestCalculation(userId: string, toolId: string): Promise<CalculationData | null>;

  /**
   * Delete a calculation
   */
  deleteCalculation(userId: string, calculationId: string): Promise<void>;

  // ==========================================
  // CONTENT OPERATIONS (Future)
  // ==========================================

  /**
   * Get articles for learning hub
   * @param locale - Language code ('ar' or 'en')
   */
  getArticles(locale: string, limit?: number): Promise<Article[]>;

  /**
   * Get a single article by slug
   */
  getArticle(slug: string, locale: string): Promise<Article | null>;

  /**
   * Get financial tips
   */
  getTips(locale: string, limit?: number): Promise<Tip[]>;

  // ==========================================
  // ANALYTICS OPERATIONS
  // ==========================================

  /**
   * Track a user event
   */
  trackEvent(userId: string | null, event: AnalyticsEvent): Promise<void>;
}

// ==========================================
// DATA TYPES
// ==========================================

export interface CalculationData {
  id: string;
  userId: string;
  toolId: string;
  toolName: string;
  data: Record<string, unknown>;
  createdAt: Date;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  views: number;
  locale: 'ar' | 'en';
}

export interface Tip {
  id: string;
  content: string;
  category: string;
  locale: 'ar' | 'en';
  publishedAt: Date;
}

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
}

// ==========================================
// FIREBASE IMPLEMENTATION (Phase One)
// ==========================================

import * as FirebaseDB from '@/lib/firebase/db';

class FirebaseDataService implements IDataService {
  // ==========================================
  // USER OPERATIONS
  // ==========================================

  async getUser(userId: string): Promise<User | null> {
    return FirebaseDB.getUser(userId);
  }

  async createUser(
    userId: string,
    userData: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    return FirebaseDB.createUser(userId, userData);
  }

  async updateUser(
    userId: string,
    updates: Partial<Omit<User, 'uid' | 'createdAt'>>
  ): Promise<void> {
    return FirebaseDB.updateUser(userId, updates);
  }

  async updateLastLogin(userId: string): Promise<void> {
    return FirebaseDB.updateLastLogin(userId);
  }

  // ==========================================
  // CALCULATION OPERATIONS
  // ==========================================

  async saveCalculation(
    userId: string,
    toolId: string,
    toolName: string,
    data: Record<string, unknown>
  ): Promise<string> {
    return FirebaseDB.saveCalculation(userId, toolId, toolName, data);
  }

  async getUserCalculations(userId: string, toolId?: string): Promise<CalculationData[]> {
    return FirebaseDB.getCalculations(userId, toolId);
  }

  async getLatestCalculation(userId: string, toolId: string): Promise<CalculationData | null> {
    return FirebaseDB.getLatestCalculation(userId, toolId);
  }

  async deleteCalculation(userId: string, calculationId: string): Promise<void> {
    // TODO: Implement in FirebaseDB if needed
    throw new Error('deleteCalculation not yet implemented');
  }

  // ==========================================
  // CONTENT OPERATIONS
  // ==========================================

  async getArticles(locale: string, limit: number = 10): Promise<Article[]> {
    // TODO: Implement when content system is ready
    // For now, return empty array
    return [];
  }

  async getArticle(slug: string, locale: string): Promise<Article | null> {
    // TODO: Implement when content system is ready
    return null;
  }

  async getTips(locale: string, limit: number = 10): Promise<Tip[]> {
    // TODO: Implement when content system is ready
    return [];
  }

  // ==========================================
  // ANALYTICS OPERATIONS
  // ==========================================

  async trackEvent(userId: string | null, event: AnalyticsEvent): Promise<void> {
    // TODO: Implement Firebase Analytics tracking
    // For now, just log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event.name, event.properties);
    }
  }
}

// ==========================================
// SUPABASE IMPLEMENTATION (Phase Two - Placeholder)
// ==========================================

/**
 * Supabase implementation for Phase Two
 *
 * This will be implemented when we migrate to Supabase.
 * The interface remains the same, ensuring zero changes to app code.
 */
class SupabaseDataService implements IDataService {
  async getUser(userId: string): Promise<User | null> {
    throw new Error('Supabase implementation - Phase Two');
  }

  async createUser(
    userId: string,
    userData: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>
  ): Promise<void> {
    throw new Error('Supabase implementation - Phase Two');
  }

  async updateUser(
    userId: string,
    updates: Partial<Omit<User, 'uid' | 'createdAt'>>
  ): Promise<void> {
    throw new Error('Supabase implementation - Phase Two');
  }

  async updateLastLogin(userId: string): Promise<void> {
    throw new Error('Supabase implementation - Phase Two');
  }

  async saveCalculation(
    userId: string,
    toolId: string,
    toolName: string,
    data: Record<string, unknown>
  ): Promise<string> {
    throw new Error('Supabase implementation - Phase Two');
  }

  async getUserCalculations(userId: string, toolId?: string): Promise<CalculationData[]> {
    throw new Error('Supabase implementation - Phase Two');
  }

  async getLatestCalculation(userId: string, toolId: string): Promise<CalculationData | null> {
    throw new Error('Supabase implementation - Phase Two');
  }

  async deleteCalculation(userId: string, calculationId: string): Promise<void> {
    throw new Error('Supabase implementation - Phase Two');
  }

  async getArticles(locale: string, limit?: number): Promise<Article[]> {
    throw new Error('Supabase implementation - Phase Two');
  }

  async getArticle(slug: string, locale: string): Promise<Article | null> {
    throw new Error('Supabase implementation - Phase Two');
  }

  async getTips(locale: string, limit?: number): Promise<Tip[]> {
    throw new Error('Supabase implementation - Phase Two');
  }

  async trackEvent(userId: string | null, event: AnalyticsEvent): Promise<void> {
    throw new Error('Supabase implementation - Phase Two');
  }
}

// ==========================================
// SERVICE FACTORY & EXPORT
// ==========================================

/**
 * Service Factory
 *
 * Determines which implementation to use based on environment variable.
 *
 * Phase One: Always returns Firebase implementation
 * Phase Two: Can return Supabase implementation via env variable
 */
function createDataService(): IDataService {
  const provider = process.env.NEXT_PUBLIC_DATA_PROVIDER || 'firebase';

  switch (provider) {
    case 'supabase':
      return new SupabaseDataService();
    case 'firebase':
    default:
      return new FirebaseDataService();
  }
}

/**
 * Singleton instance of the data service
 *
 * IMPORTANT: ALL application code must use this export
 * Never import Firebase or Supabase directly in application code
 *
 * Example usage:
 * ```typescript
 * import { dataService } from '@/lib/services/dataService';
 *
 * const user = await dataService.getUser(userId);
 * ```
 */
export const dataService = createDataService();

/**
 * Export the interface for type checking
 */
export type DataService = IDataService;

/**
 * Version and metadata
 */
export const DATA_SERVICE_VERSION = '1.0.0';
export const DATA_SERVICE_PROVIDER = process.env.NEXT_PUBLIC_DATA_PROVIDER || 'firebase';
