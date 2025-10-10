const fs = require('fs');
const path = require('path');

// Emergency Fund Calculator
const emergencyPath = 'c:\\acash.ai\\app\\tools\\emergency\\page.tsx';
let emergencyContent = fs.readFileSync(emergencyPath, 'utf8');

// Add imports
if (!emergencyContent.includes('EmergencyFundCalculatorSchema')) {
  emergencyContent = emergencyContent.replace(
    "import { formatCurrency } from '@/lib/utils';",
    "import { formatCurrency } from '@/lib/utils';\nimport { EmergencyFundCalculatorSchema } from '@/lib/validations/calculators';\nimport { generateEmergencyPDF } from '@/lib/utils/pdf-generator';"
  );
}

// Add errors state
if (!emergencyContent.includes('const [errors, setErrors]')) {
  emergencyContent = emergencyContent.replace(
    "const [email, setEmail] = useState('');",
    "const [email, setEmail] = useState('');\n  const [errors, setErrors] = useState<Record<string, string>>({});"
  );
}

// Add validation to calculateEmergencyFund
if (!emergencyContent.includes('EmergencyFundCalculatorSchema.safeParse')) {
  emergencyContent = emergencyContent.replace(
    'const calculateEmergencyFund = () => {\n    if (!monthlyExpenses) return;',
    `const calculateEmergencyFund = () => {
    setErrors({});
    const validation = EmergencyFundCalculatorSchema.safeParse({
      monthlyExpenses,
      targetMonths: 6,
      currentSavings,
    });
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        newErrors[err.path.join('.')] = err.message;
      });
      setErrors(newErrors);
      return;
    }
    if (!monthlyExpenses) return;`
  );
}

// Add PDF handler
if (!emergencyContent.includes('handleDownloadPDF')) {
  const pdfHandler = `
  const handleDownloadPDF = () => {
    if (!results) return;
    try {
      generateEmergencyPDF({
        monthlyExpenses,
        targetAmount: results.targetAmount,
        currentSavings,
        monthsNeeded: results.monthsNeeded,
        monthlySavings: results.monthlySavings,
        healthScore: results.healthScore,
        status: results.status,
        recommendations,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('حدث خطأ في إنشاء التقرير');
    }
  };
`;
  emergencyContent = emergencyContent.replace(
    'const getStatusInfo = (status: string) => {',
    pdfHandler + '\n  const getStatusInfo = (status: string) => {'
  );
}

fs.writeFileSync(emergencyPath, emergencyContent);
console.log('✓ Updated Emergency Fund calculator');

console.log('All calculators updated successfully!');
