/**
 * Data Export/Import System
 * Complete data portability for users
 */

import {
  User,
  DebtItem,
  FinancialGoal,
  BudgetCategory,
  Transaction,
  AssessmentResult,
} from '@/types/database';

export interface ExportData {
  version: string;
  exportDate: string;
  user: {
    uid: string;
    email: string;
    displayName: string;
  };
  debts: DebtItem[];
  goals: FinancialGoal[];
  budgets: BudgetCategory[];
  transactions: Transaction[];
  assessments: AssessmentResult[];
  metadata: {
    totalDebts: number;
    totalGoals: number;
    totalBudgets: number;
    totalTransactions: number;
    exportFormat: 'json' | 'csv' | 'excel';
  };
}

export type ExportFormat = 'json' | 'csv' | 'excel' | 'pdf';

class DataExportService {
  // Export all user data to JSON
  async exportToJSON(
    userId: string,
    data: Omit<ExportData, 'version' | 'exportDate' | 'metadata'>
  ): Promise<string> {
    const exportData: ExportData = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      ...data,
      metadata: {
        totalDebts: data.debts.length,
        totalGoals: data.goals.length,
        totalBudgets: data.budgets.length,
        totalTransactions: data.transactions.length,
        exportFormat: 'json',
      },
    };

    return JSON.stringify(exportData, null, 2);
  }

  // Export debts to CSV
  exportDebtsToCSV(debts: DebtItem[]): string {
    const headers = [
      'Name',
      'Type',
      'Total Amount',
      'Interest Rate',
      'Minimum Payment',
      'Current Balance',
      'Next Payment Date',
      'Status',
    ];

    const rows = debts.map((debt) => [
      debt.name,
      debt.type,
      debt.totalAmount.toString(),
      debt.interestRate.toString(),
      debt.minimumPayment.toString(),
      debt.currentBalance?.toString() || debt.totalAmount.toString(),
      debt.nextPaymentDate?.toISOString().split('T')[0] || '',
      debt.status || 'active',
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    return csv;
  }

  // Export budgets to CSV
  exportBudgetsToCSV(budgets: BudgetCategory[]): string {
    const headers = ['Category', 'Name', 'Allocated', 'Spent', 'Remaining', 'Month', 'Year'];

    const rows = budgets.map((budget) => [
      budget.category,
      budget.name,
      budget.allocated.toString(),
      budget.spent.toString(),
      (budget.allocated - budget.spent).toString(),
      budget.month.toString(),
      budget.year.toString(),
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    return csv;
  }

  // Export transactions to CSV
  exportTransactionsToCSV(transactions: Transaction[]): string {
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Payment Method', 'Tags'];

    const rows = transactions.map((txn) => [
      new Date(txn.date).toISOString().split('T')[0],
      txn.type,
      txn.category || '',
      txn.description || '',
      txn.amount.toString(),
      txn.paymentMethod || '',
      txn.tags?.join(';') || '',
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    return csv;
  }

  // Export goals to CSV
  exportGoalsToCSV(goals: FinancialGoal[]): string {
    const headers = [
      'Name',
      'Category',
      'Target Amount',
      'Current Amount',
      'Start Date',
      'Deadline',
      'Priority',
      'Status',
    ];

    const rows = goals.map((goal) => [
      goal.name,
      goal.category,
      goal.targetAmount.toString(),
      goal.currentAmount.toString(),
      new Date(goal.startDate).toISOString().split('T')[0],
      new Date(goal.deadline).toISOString().split('T')[0],
      goal.priority,
      goal.status,
    ]);

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    return csv;
  }

  // Download file to user's device
  downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Export complete data package
  async exportCompleteData(
    userId: string,
    userData: Omit<ExportData, 'version' | 'exportDate' | 'metadata'>,
    format: 'json' | 'csv' = 'json'
  ) {
    const timestamp = new Date().toISOString().split('T')[0];

    if (format === 'json') {
      const json = await this.exportToJSON(userId, userData);
      this.downloadFile(json, `acash-data-export-${timestamp}.json`, 'application/json');
    } else {
      // Create a zip-like structure with multiple CSVs
      const debtsCSV = this.exportDebtsToCSV(userData.debts);
      const budgetsCSV = this.exportBudgetsToCSV(userData.budgets);
      const transactionsCSV = this.exportTransactionsToCSV(userData.transactions);
      const goalsCSV = this.exportGoalsToCSV(userData.goals);

      // Download each separately
      this.downloadFile(debtsCSV, `acash-debts-${timestamp}.csv`, 'text/csv');
      this.downloadFile(budgetsCSV, `acash-budgets-${timestamp}.csv`, 'text/csv');
      this.downloadFile(transactionsCSV, `acash-transactions-${timestamp}.csv`, 'text/csv');
      this.downloadFile(goalsCSV, `acash-goals-${timestamp}.csv`, 'text/csv');
    }
  }

  // Import data from JSON
  async importFromJSON(jsonString: string): Promise<ExportData> {
    try {
      const data: ExportData = JSON.parse(jsonString);

      // Validate version
      if (!data.version) {
        throw new Error('Invalid export file: missing version');
      }

      // Validate structure
      if (!data.user || !data.debts || !data.goals || !data.budgets) {
        throw new Error('Invalid export file: missing required data');
      }

      // Convert date strings back to Date objects
      data.debts = data.debts.map((debt) => ({
        ...debt,
        nextPaymentDate: debt.nextPaymentDate ? new Date(debt.nextPaymentDate) : undefined,
        createdAt: new Date(debt.createdAt),
        updatedAt: new Date(debt.updatedAt),
      }));

      data.goals = data.goals.map((goal) => ({
        ...goal,
        startDate: new Date(goal.startDate),
        deadline: new Date(goal.deadline),
        createdAt: new Date(goal.createdAt),
        updatedAt: new Date(goal.updatedAt),
      }));

      data.budgets = data.budgets.map((budget) => ({
        ...budget,
        createdAt: new Date(budget.createdAt),
        updatedAt: new Date(budget.updatedAt),
      }));

      data.transactions = data.transactions.map((txn) => ({
        ...txn,
        date: new Date(txn.date),
        createdAt: new Date(txn.createdAt),
      }));

      return data;
    } catch (error) {
      throw new Error(`Failed to import data: ${(error as Error).message}`);
    }
  }

  // Import debts from CSV
  async importDebtsFromCSV(csvString: string): Promise<Partial<DebtItem>[]> {
    const lines = csvString.trim().split('\n');
    const headers = lines[0].split(',');

    const debts: Partial<DebtItem>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length !== headers.length) continue;

      const debt: Partial<DebtItem> = {
        name: values[0],
        type: values[1] as any,
        totalAmount: parseFloat(values[2]),
        interestRate: parseFloat(values[3]),
        minimumPayment: parseFloat(values[4]),
        currentBalance: parseFloat(values[5]) || parseFloat(values[2]),
        nextPaymentDate: values[6] ? new Date(values[6]) : undefined,
        status: (values[7] as any) || 'active',
      };

      debts.push(debt);
    }

    return debts;
  }

  // Import transactions from CSV
  async importTransactionsFromCSV(csvString: string): Promise<Partial<Transaction>[]> {
    const lines = csvString.trim().split('\n');
    const headers = lines[0].split(',');

    const transactions: Partial<Transaction>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length !== headers.length) continue;

      const txn: Partial<Transaction> = {
        date: new Date(values[0]),
        type: values[1] as 'income' | 'expense',
        category: values[2] || undefined,
        description: values[3] || undefined,
        amount: parseFloat(values[4]),
        paymentMethod: values[5] || undefined,
        tags: values[6] ? values[6].split(';') : undefined,
      };

      transactions.push(txn);
    }

    return transactions;
  }

  // Validate imported data
  validateImportData(data: ExportData): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check version compatibility
    if (data.version !== '1.0.0') {
      warnings.push(`Data version ${data.version} may not be fully compatible`);
    }

    // Validate debts
    data.debts.forEach((debt, index) => {
      if (!debt.name) errors.push(`Debt ${index + 1}: Missing name`);
      if (!debt.totalAmount || debt.totalAmount <= 0)
        errors.push(`Debt ${index + 1}: Invalid amount`);
      if (debt.interestRate < 0) errors.push(`Debt ${index + 1}: Invalid interest rate`);
    });

    // Validate goals
    data.goals.forEach((goal, index) => {
      if (!goal.name) errors.push(`Goal ${index + 1}: Missing name`);
      if (!goal.targetAmount || goal.targetAmount <= 0)
        errors.push(`Goal ${index + 1}: Invalid target amount`);
      if (new Date(goal.deadline) < new Date(goal.startDate))
        errors.push(`Goal ${index + 1}: Deadline before start date`);
    });

    // Validate budgets
    data.budgets.forEach((budget, index) => {
      if (!budget.name) errors.push(`Budget ${index + 1}: Missing name`);
      if (!budget.allocated || budget.allocated <= 0)
        errors.push(`Budget ${index + 1}: Invalid allocated amount`);
    });

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Generate financial report PDF (placeholder)
  async generatePDFReport(
    userData: Omit<ExportData, 'version' | 'exportDate' | 'metadata'>
  ): Promise<Blob> {
    // This would use a library like jsPDF or pdfmake
    // For now, return a simple text-based PDF structure
    const reportContent = `
      ACASH.AI FINANCIAL REPORT
      ========================

      User: ${userData.user.displayName}
      Date: ${new Date().toLocaleDateString('ar-SA')}

      SUMMARY
      -------
      Total Debts: ${userData.debts.length}
      Total Goals: ${userData.goals.length}
      Total Budgets: ${userData.budgets.length}
      Total Transactions: ${userData.transactions.length}

      DEBTS
      -----
      ${userData.debts
        .map(
          (d) => `${d.name}: ${d.totalAmount.toLocaleString()} SAR @ ${d.interestRate}% interest`
        )
        .join('\n')}

      GOALS
      -----
      ${userData.goals
        .map(
          (g) =>
            `${g.name}: ${g.currentAmount.toLocaleString()} / ${g.targetAmount.toLocaleString()} SAR`
        )
        .join('\n')}
    `;

    return new Blob([reportContent], { type: 'application/pdf' });
  }
}

// Export singleton instance
export const dataExportService = new DataExportService();

// Helper functions
export async function exportUserData(
  userId: string,
  data: Omit<ExportData, 'version' | 'exportDate' | 'metadata'>,
  format: 'json' | 'csv' = 'json'
) {
  await dataExportService.exportCompleteData(userId, data, format);
}

export async function importUserData(file: File): Promise<ExportData> {
  const text = await file.text();

  if (file.name.endsWith('.json')) {
    return dataExportService.importFromJSON(text);
  } else if (file.name.endsWith('.csv')) {
    throw new Error('CSV import requires specifying data type (debts, transactions, etc.)');
  } else {
    throw new Error('Unsupported file format. Please use JSON or CSV.');
  }
}

export function getExportFormats(): { value: ExportFormat; label: string; labelAr: string }[] {
  return [
    { value: 'json', label: 'JSON (Complete Data)', labelAr: 'JSON (بيانات كاملة)' },
    { value: 'csv', label: 'CSV (Spreadsheet)', labelAr: 'CSV (جدول بيانات)' },
    { value: 'excel', label: 'Excel (Advanced)', labelAr: 'Excel (متقدم)' },
    { value: 'pdf', label: 'PDF (Report)', labelAr: 'PDF (تقرير)' },
  ];
}

export function estimateExportSize(data: ExportData): string {
  const jsonStr = JSON.stringify(data);
  const bytes = new Blob([jsonStr]).size;

  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
