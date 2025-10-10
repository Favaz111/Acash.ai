/**
 * Generate Sample PDFs for Budget and Loan Calculators
 * Day 4 - Sample PDF Generation Script
 */

const fs = require('fs');
const path = require('path');

// Sample data for Budget Calculator
const budgetSampleData = {
  monthlyIncome: 15000,
  monthlyExpenses: 10000,
  balance: 5000,
  savingsRate: 33.33,
  healthScore: 85,
  status: 'excellent',
  recommendations: [
    'حالتك المالية ممتازة! استمر في الادخار',
    'فكر في استثمار الفائض الشهري',
    'حافظ على نسبة الادخار الحالية (33%)'
  ]
};

// Sample data for Loan Calculator
const loanSampleData = {
  principal: 200000,
  interestRate: 5.5,
  termYears: 15,
  monthlyPayment: 1634.17,
  totalPaid: 294150.60,
  totalInterest: 94150.60,
  debtToIncomeRatio: 16.34,
  status: 'good',
  recommendations: [
    'نسبة الدين إلى الدخل (16%) ممتازة',
    'يمكنك توفير 28,000 ريال بدفعة إضافية 500 ريال شهرياً',
    'معدل الفائدة جيد - لا حاجة لإعادة التمويل'
  ]
};

console.log('📄 Generating sample PDFs...\n');

console.log('Budget Calculator Sample Data:');
console.log(JSON.stringify(budgetSampleData, null, 2));
console.log('\nLoan Calculator Sample Data:');
console.log(JSON.stringify(loanSampleData, null, 2));

console.log('\n✅ Sample data prepared.');
console.log('📝 Note: PDF generation requires browser environment (jsPDF).');
console.log('   Manual generation via browser console recommended for Day 4.');
console.log('\n   Instructions:');
console.log('   1. Open Budget Calculator in browser');
console.log('   2. Enter sample values and click "احسب الميزانية"');
console.log('   3. Click "تحميل PDF" - save as budget-sample.pdf');
console.log('   4. Repeat for Loan Calculator - save as loan-sample.pdf');
console.log('   5. Move PDFs to public/samples/ directory');
