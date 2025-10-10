/**
 * حسابات إدارة الديون المتقدمة
 */

export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

export interface DebtPaymentPlan {
  month: number;
  debts: {
    id: string;
    payment: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }[];
  totalPayment: number;
  totalPrincipal: number;
  totalInterest: number;
}

export interface DebtStrategy {
  strategy: 'snowball' | 'avalanche';
  totalMonthlyPayment: number;
  payoffMonths: number;
  totalInterestPaid: number;
  totalPaid: number;
  monthlyPlan: DebtPaymentPlan[];
  debtOrder: string[]; // ترتيب سداد الديون
}

/**
 * استراتيجية كرة الثلج (Snowball)
 * نبدأ بأصغر دين أولاً لبناء الزخم النفسي
 */
export function calculateSnowballStrategy(
  debts: Debt[],
  extraMonthlyPayment: number = 0
): DebtStrategy {
  const sortedDebts = [...debts].sort((a, b) => a.balance - b.balance);
  return calculateDebtStrategy(sortedDebts, extraMonthlyPayment, 'snowball');
}

/**
 * استراتيجية الانهيار الجليدي (Avalanche)
 * نبدأ بأعلى فائدة أولاً لتوفير أكبر قدر من المال
 */
export function calculateAvalancheStrategy(
  debts: Debt[],
  extraMonthlyPayment: number = 0
): DebtStrategy {
  const sortedDebts = [...debts].sort((a, b) => b.interestRate - a.interestRate);
  return calculateDebtStrategy(sortedDebts, extraMonthlyPayment, 'avalanche');
}

/**
 * محرك حساب استراتيجية الديون
 */
function calculateDebtStrategy(
  sortedDebts: Debt[],
  extraMonthlyPayment: number,
  strategy: 'snowball' | 'avalanche'
): DebtStrategy {
  const debts = sortedDebts.map((d) => ({ ...d }));
  const debtOrder = debts.map((d) => d.id);
  const monthlyPlan: DebtPaymentPlan[] = [];

  let month = 0;
  let totalInterestPaid = 0;
  let availableExtra = extraMonthlyPayment;

  const minimumPayments = debts.reduce((sum, d) => sum + d.minimumPayment, 0);
  const totalMonthlyPayment = minimumPayments + extraMonthlyPayment;

  while (debts.some((d) => d.balance > 0) && month < 600) {
    month++;
    const planMonth: DebtPaymentPlan = {
      month,
      debts: [],
      totalPayment: 0,
      totalPrincipal: 0,
      totalInterest: 0,
    };

    // حساب الفائدة لكل الديون
    debts.forEach((debt) => {
      if (debt.balance <= 0) {
        planMonth.debts.push({
          id: debt.id,
          payment: 0,
          principalPaid: 0,
          interestPaid: 0,
          remainingBalance: 0,
        });
        return;
      }

      const monthlyRate = debt.interestRate / 100 / 12;
      const interest = debt.balance * monthlyRate;
      let payment = debt.minimumPayment;

      // إذا كان هذا الدين الأول في القائمة، أضف المبلغ الإضافي
      const isTargetDebt = debts.findIndex((d) => d.balance > 0) === debts.indexOf(debt);
      if (isTargetDebt) {
        payment += availableExtra;
      }

      // التأكد من عدم الدفع أكثر من الرصيد المتبقي
      payment = Math.min(payment, debt.balance + interest);

      const principal = payment - interest;

      debt.balance -= principal;
      if (debt.balance < 0.01) debt.balance = 0; // تقريب للصفر

      totalInterestPaid += interest;

      planMonth.debts.push({
        id: debt.id,
        payment,
        principalPaid: principal,
        interestPaid: interest,
        remainingBalance: debt.balance,
      });

      planMonth.totalPayment += payment;
      planMonth.totalPrincipal += principal;
      planMonth.totalInterest += interest;

      // إذا تم سداد هذا الدين، أضف دفعته الشهرية للمبلغ الإضافي
      if (debt.balance === 0 && isTargetDebt) {
        availableExtra += debt.minimumPayment;
      }
    });

    monthlyPlan.push(planMonth);

    // إذا تم سداد جميع الديون
    if (debts.every((d) => d.balance === 0)) break;
  }

  const totalPaid = monthlyPlan.reduce((sum, p) => sum + p.totalPayment, 0);

  return {
    strategy,
    totalMonthlyPayment,
    payoffMonths: month,
    totalInterestPaid,
    totalPaid,
    monthlyPlan,
    debtOrder,
  };
}

/**
 * مقارنة بين الاستراتيجيتين
 */
export function compareStrategies(debts: Debt[], extraMonthlyPayment: number = 0) {
  const snowball = calculateSnowballStrategy(debts, extraMonthlyPayment);
  const avalanche = calculateAvalancheStrategy(debts, extraMonthlyPayment);

  const savings = snowball.totalInterestPaid - avalanche.totalInterestPaid;
  const monthsDifference = snowball.payoffMonths - avalanche.payoffMonths;

  return {
    snowball,
    avalanche,
    comparison: {
      interestSavings: savings,
      monthsDifference,
      recommendation:
        Math.abs(savings) < 1000
          ? 'snowball' // إذا كان الفرق قليل، اختر كرة الثلج للزخم النفسي
          : savings > 0
            ? 'avalanche' // إذا كان التوفير كبير، اختر الانهيار
            : 'snowball',
    },
  };
}

/**
 * حساب دين واحد بسيط
 */
export function calculateSingleDebt(balance: number, interestRate: number, monthlyPayment: number) {
  // التحقق من صحة المدخلات
  if (balance <= 0) {
    return { error: 'مبلغ الدين يجب أن يكون أكبر من صفر' };
  }

  if (interestRate < 0) {
    return { error: 'نسبة الفائدة يجب أن تكون صفر أو أكبر' };
  }

  if (monthlyPayment <= 0) {
    return { error: 'الدفعة الشهرية يجب أن تكون أكبر من صفر' };
  }

  const monthlyRate = interestRate / 100 / 12;
  let currentBalance = balance;
  let months = 0;
  let totalInterest = 0;

  if (monthlyRate > 0 && monthlyPayment <= balance * monthlyRate) {
    return {
      error: 'الدفعة الشهرية أقل من أو تساوي الفائدة المستحقة. لن يتم سداد الدين!',
    };
  }

  while (currentBalance > 0 && months < 600) {
    const interest = currentBalance * monthlyRate;
    const principal = monthlyPayment - interest;

    totalInterest += interest;
    currentBalance -= principal;
    months++;

    if (currentBalance < 0.01) currentBalance = 0;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  return {
    months,
    years,
    remainingMonths,
    totalPaid: monthlyPayment * months,
    totalInterest,
    principalPaid: balance,
  };
}

/**
 * حساب الدفعة الشهرية المطلوبة لسداد دين في فترة محددة
 */
export function calculateRequiredPayment(
  balance: number,
  interestRate: number,
  targetMonths: number
): number {
  const monthlyRate = interestRate / 100 / 12;

  if (monthlyRate === 0) {
    return balance / targetMonths;
  }

  // صيغة حساب القسط الشهري
  const payment =
    (balance * (monthlyRate * Math.pow(1 + monthlyRate, targetMonths))) /
    (Math.pow(1 + monthlyRate, targetMonths) - 1);

  return payment;
}
