/**
 * Firestore Database Helper Functions
 * Type-safe database operations with error handling
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  type DocumentData,
  type QueryConstraint,
} from 'firebase/firestore';
import { db } from './config';
import {
  User,
  UserSchema,
  DebtItem,
  DebtItemSchema,
  FinancialGoal,
  FinancialGoalSchema,
  BudgetCategory,
  BudgetCategorySchema,
  Transaction,
  TransactionSchema,
  COLLECTIONS,
} from '@/types/database';

// ==========================================
// HELPER TYPES
// ==========================================

type FirestoreData = DocumentData;

// Helper to ensure db is initialized
function getDb() {
  if (!db) {
    throw new Error('Firestore is not initialized');
  }
  return db;
}

// Convert Date to Timestamp for Firestore
function toTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

// Convert Timestamp to Date
function fromTimestamp(timestamp: Timestamp): Date {
  return timestamp.toDate();
}

// ==========================================
// USER OPERATIONS
// ==========================================

export async function createUser(
  userId: string,
  userData: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>
): Promise<void> {
  const now = new Date();
  const user: User = {
    ...userData,
    uid: userId,
    createdAt: now,
    updatedAt: now,
  };

  // Validate with Zod
  const validated = UserSchema.parse(user);

  await setDoc(doc(getDb(), COLLECTIONS.USERS, userId), {
    ...validated,
    createdAt: toTimestamp(validated.createdAt),
    updatedAt: toTimestamp(validated.updatedAt),
    lastLoginAt: validated.lastLoginAt ? toTimestamp(validated.lastLoginAt) : null,
  });
}

export async function getUser(userId: string): Promise<User | null> {
  const docRef = doc(getDb(), COLLECTIONS.USERS, userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    ...data,
    uid: userId,
    createdAt: data['createdAt'] ? fromTimestamp(data['createdAt']) : new Date(),
    updatedAt: data['updatedAt'] ? fromTimestamp(data['updatedAt']) : new Date(),
    lastLoginAt: data['lastLoginAt'] ? fromTimestamp(data['lastLoginAt']) : undefined,
  } as User;
}

export async function updateUser(
  userId: string,
  updates: Partial<Omit<User, 'uid' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(getDb(), COLLECTIONS.USERS, userId);
  const updateData: FirestoreData = {
    ...updates,
    updatedAt: toTimestamp(new Date()),
  };

  // Convert dates to timestamps
  if (updates.lastLoginAt) {
    updateData['lastLoginAt'] = toTimestamp(updates.lastLoginAt);
  }

  await updateDoc(docRef, updateData);
}

export async function updateLastLogin(userId: string): Promise<void> {
  await updateUser(userId, { lastLoginAt: new Date() });
}

// ==========================================
// DEBT OPERATIONS
// ==========================================

export async function createDebt(
  userId: string,
  debtData: Omit<DebtItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const debtId = doc(collection(getDb(), COLLECTIONS.DEBTS(userId))).id;
  const now = new Date();

  const debt: DebtItem = {
    ...debtData,
    id: debtId,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  // Validate
  const validated = DebtItemSchema.parse(debt);

  await setDoc(doc(getDb(), COLLECTIONS.DEBTS(userId), debtId), {
    ...validated,
    createdAt: toTimestamp(validated.createdAt),
    updatedAt: toTimestamp(validated.updatedAt),
    startDate: validated.startDate ? toTimestamp(validated.startDate) : null,
    targetPayoffDate: validated.targetPayoffDate ? toTimestamp(validated.targetPayoffDate) : null,
  });

  return debtId;
}

export async function getDebts(userId: string): Promise<DebtItem[]> {
  const querySnapshot = await getDocs(collection(getDb(), COLLECTIONS.DEBTS(userId)));
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data['createdAt'] ? fromTimestamp(data['createdAt']) : new Date(),
      updatedAt: data['updatedAt'] ? fromTimestamp(data['updatedAt']) : new Date(),
      startDate: data['startDate'] ? fromTimestamp(data['startDate']) : undefined,
      targetPayoffDate: data['targetPayoffDate'] ? fromTimestamp(data['targetPayoffDate']) : undefined,
    } as DebtItem;
  });
}

export async function getDebt(userId: string, debtId: string): Promise<DebtItem | null> {
  const docRef = doc(getDb(), COLLECTIONS.DEBTS(userId), debtId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    ...data,
    id: debtId,
    createdAt: data['createdAt'] ? fromTimestamp(data['createdAt']) : new Date(),
    updatedAt: data['updatedAt'] ? fromTimestamp(data['updatedAt']) : new Date(),
    startDate: data['startDate'] ? fromTimestamp(data['startDate']) : undefined,
    targetPayoffDate: data['targetPayoffDate'] ? fromTimestamp(data['targetPayoffDate']) : undefined,
  } as DebtItem;
}

export async function updateDebt(
  userId: string,
  debtId: string,
  updates: Partial<Omit<DebtItem, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(getDb(), COLLECTIONS.DEBTS(userId), debtId);
  const updateData: FirestoreData = {
    ...updates,
    updatedAt: toTimestamp(new Date()),
  };

  if (updates.startDate) {
    updateData['startDate'] = toTimestamp(updates.startDate);
  }
  if (updates.targetPayoffDate) {
    updateData['targetPayoffDate'] = toTimestamp(updates.targetPayoffDate);
  }

  await updateDoc(docRef, updateData);
}

export async function deleteDebt(userId: string, debtId: string): Promise<void> {
  await deleteDoc(doc(getDb(), COLLECTIONS.DEBTS(userId), debtId));
}

// ==========================================
// GOAL OPERATIONS
// ==========================================

export async function createGoal(
  userId: string,
  goalData: Omit<FinancialGoal, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const goalId = doc(collection(getDb(), COLLECTIONS.GOALS(userId))).id;
  const now = new Date();

  const goal: FinancialGoal = {
    ...goalData,
    id: goalId,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  const validated = FinancialGoalSchema.parse(goal);

  await setDoc(doc(getDb(), COLLECTIONS.GOALS(userId), goalId), {
    ...validated,
    createdAt: toTimestamp(validated.createdAt),
    updatedAt: toTimestamp(validated.updatedAt),
    targetDate: toTimestamp(validated.targetDate),
    completedAt: validated.completedAt ? toTimestamp(validated.completedAt) : null,
  });

  return goalId;
}

export async function getGoals(userId: string): Promise<FinancialGoal[]> {
  const querySnapshot = await getDocs(
    query(collection(getDb(), COLLECTIONS.GOALS(userId)), orderBy('priority', 'desc'))
  );

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data['createdAt'] ? fromTimestamp(data['createdAt']) : new Date(),
      updatedAt: data['updatedAt'] ? fromTimestamp(data['updatedAt']) : new Date(),
      targetDate: data['targetDate'] ? fromTimestamp(data['targetDate']) : new Date(),
      completedAt: data['completedAt'] ? fromTimestamp(data['completedAt']) : undefined,
    } as FinancialGoal;
  });
}

export async function updateGoal(
  userId: string,
  goalId: string,
  updates: Partial<Omit<FinancialGoal, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(getDb(), COLLECTIONS.GOALS(userId), goalId);
  const updateData: FirestoreData = {
    ...updates,
    updatedAt: toTimestamp(new Date()),
  };

  if (updates.targetDate) {
    updateData['targetDate'] = toTimestamp(updates.targetDate);
  }
  if (updates.completedAt) {
    updateData['completedAt'] = toTimestamp(updates.completedAt);
  }

  await updateDoc(docRef, updateData);
}

export async function deleteGoal(userId: string, goalId: string): Promise<void> {
  await deleteDoc(doc(getDb(), COLLECTIONS.GOALS(userId), goalId));
}

// ==========================================
// BUDGET OPERATIONS
// ==========================================

export async function createBudgetCategory(
  userId: string,
  categoryData: Omit<BudgetCategory, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const categoryId = doc(collection(getDb(), COLLECTIONS.BUDGETS(userId))).id;
  const now = new Date();

  const category: BudgetCategory = {
    ...categoryData,
    id: categoryId,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  const validated = BudgetCategorySchema.parse(category);

  await setDoc(doc(getDb(), COLLECTIONS.BUDGETS(userId), categoryId), {
    ...validated,
    createdAt: toTimestamp(validated.createdAt),
    updatedAt: toTimestamp(validated.updatedAt),
  });

  return categoryId;
}

export async function getBudgetsByMonth(userId: string, month: string): Promise<BudgetCategory[]> {
  const querySnapshot = await getDocs(
    query(collection(getDb(), COLLECTIONS.BUDGETS(userId)), where('month', '==', month))
  );

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data['createdAt'] ? fromTimestamp(data['createdAt']) : new Date(),
      updatedAt: data['updatedAt'] ? fromTimestamp(data['updatedAt']) : new Date(),
    } as BudgetCategory;
  });
}

export async function updateBudgetCategory(
  userId: string,
  categoryId: string,
  updates: Partial<Omit<BudgetCategory, 'id' | 'userId' | 'createdAt'>>
): Promise<void> {
  const docRef = doc(getDb(), COLLECTIONS.BUDGETS(userId), categoryId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: toTimestamp(new Date()),
  });
}

export async function deleteBudgetCategory(userId: string, categoryId: string): Promise<void> {
  await deleteDoc(doc(getDb(), COLLECTIONS.BUDGETS(userId), categoryId));
}

// ==========================================
// TRANSACTION OPERATIONS (Premium)
// ==========================================

export async function createTransaction(
  userId: string,
  transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const transactionId = doc(collection(getDb(), COLLECTIONS.TRANSACTIONS(userId))).id;
  const now = new Date();

  const transaction: Transaction = {
    ...transactionData,
    id: transactionId,
    userId,
    createdAt: now,
    updatedAt: now,
  };

  const validated = TransactionSchema.parse(transaction);

  await setDoc(doc(getDb(), COLLECTIONS.TRANSACTIONS(userId), transactionId), {
    ...validated,
    createdAt: toTimestamp(validated.createdAt),
    updatedAt: toTimestamp(validated.updatedAt),
    date: toTimestamp(validated.date),
  });

  return transactionId;
}

export async function getTransactions(
  userId: string,
  limitCount: number = 50
): Promise<Transaction[]> {
  const querySnapshot = await getDocs(
    query(
      collection(getDb(), COLLECTIONS.TRANSACTIONS(userId)),
      orderBy('date', 'desc'),
      limit(limitCount)
    )
  );

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data['createdAt'] ? fromTimestamp(data['createdAt']) : new Date(),
      updatedAt: data['updatedAt'] ? fromTimestamp(data['updatedAt']) : new Date(),
      date: data['date'] ? fromTimestamp(data['date']) : new Date(),
    } as Transaction;
  });
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export async function getTotalDebt(userId: string): Promise<number> {
  const debts = await getDebts(userId);
  return debts.reduce((total, debt) => total + debt.currentBalance, 0);
}

export async function getActiveGoalsCount(userId: string): Promise<number> {
  const goals = await getGoals(userId);
  return goals.filter((g) => g.status === 'in_progress').length;
}

// ==========================================
// ASSESSMENT OPERATIONS
// ==========================================

export interface AssessmentResult {
  id: string;
  userId: string;
  type: 'quick' | 'comprehensive';
  answers: Record<string, unknown>;
  scores: {
    overall: number;
    income: number;
    expenses: number;
    savings: number;
    debts: number;
    goals: number;
  };
  recommendations: string[];
  createdAt: Date;
}

export async function saveAssessmentResult(
  userId: string,
  assessmentData: Omit<AssessmentResult, 'id' | 'userId' | 'createdAt'>
): Promise<string> {
  const assessmentId = doc(collection(getDb(), `users/${userId}/assessments`)).id;
  const now = new Date();

  const assessment: AssessmentResult = {
    ...assessmentData,
    id: assessmentId,
    userId,
    createdAt: now,
  };

  await setDoc(doc(getDb(), `users/${userId}/assessments`, assessmentId), {
    ...assessment,
    createdAt: toTimestamp(assessment.createdAt),
  });

  return assessmentId;
}

export async function getLatestAssessment(userId: string): Promise<AssessmentResult | null> {
  const querySnapshot = await getDocs(
    query(collection(getDb(), `users/${userId}/assessments`), orderBy('createdAt', 'desc'), limit(1))
  );

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  if (!doc) {
    return null;
  }

  const data = doc.data();

  return {
    ...data,
    id: doc.id,
    createdAt: data['createdAt'] ? fromTimestamp(data['createdAt']) : new Date(),
  } as AssessmentResult;
}

export async function getAllAssessments(userId: string): Promise<AssessmentResult[]> {
  const querySnapshot = await getDocs(
    query(collection(getDb(), `users/${userId}/assessments`), orderBy('createdAt', 'desc'))
  );

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data['createdAt'] ? fromTimestamp(data['createdAt']) : new Date(),
    } as AssessmentResult;
  });
}

// ==========================================
// CALCULATION OPERATIONS (Tool Results)
// ==========================================

export interface CalculationData {
  id: string;
  userId: string;
  toolId: string;
  toolName: string;
  data: Record<string, unknown>;
  createdAt: Date;
}

export async function saveCalculation(
  userId: string,
  toolId: string,
  toolName: string,
  data: Record<string, unknown>
): Promise<string> {
  const calculationId = doc(collection(getDb(), `users/${userId}/calculations`)).id;
  const now = new Date();

  const calculation: CalculationData = {
    id: calculationId,
    userId,
    toolId,
    toolName,
    data,
    createdAt: now,
  };

  await setDoc(doc(getDb(), `users/${userId}/calculations`, calculationId), {
    ...calculation,
    createdAt: toTimestamp(calculation.createdAt),
  });

  return calculationId;
}

export async function getCalculations(userId: string, toolId?: string): Promise<CalculationData[]> {
  const constraints: QueryConstraint[] = [orderBy('createdAt', 'desc'), limit(50)];

  if (toolId) {
    constraints.unshift(where('toolId', '==', toolId));
  }

  const querySnapshot = await getDocs(
    query(collection(getDb(), `users/${userId}/calculations`), ...constraints)
  );

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data['createdAt'] ? fromTimestamp(data['createdAt']) : new Date(),
    } as CalculationData;
  });
}

export async function getLatestCalculation(
  userId: string,
  toolId: string
): Promise<CalculationData | null> {
  const querySnapshot = await getDocs(
    query(
      collection(getDb(), `users/${userId}/calculations`),
      where('toolId', '==', toolId),
      orderBy('createdAt', 'desc'),
      limit(1)
    )
  );

  if (querySnapshot.empty) {
    return null;
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();

  return {
    ...data,
    id: doc.id,
    createdAt: data['createdAt'] ? fromTimestamp(data['createdAt']) : new Date(),
  } as CalculationData;
}
