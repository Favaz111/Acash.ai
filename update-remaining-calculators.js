const fs = require('fs');

// Update ROI Calculator
const roiPath = 'c:\\acash.ai\\app\\[locale]\\tools\\roi\\page.tsx';
let roiContent = fs.readFileSync(roiPath, 'utf8');

if (!roiContent.includes('ROICalculatorSchema')) {
  roiContent = roiContent.replace(
    "import { formatCurrency } from '@/lib/utils';",
    "import { formatCurrency } from '@/lib/utils';\nimport { ROICalculatorSchema } from '@/lib/validations/calculators';\nimport { generateROIPDF } from '@/lib/utils/pdf-generator';"
  );
}

if (!roiContent.includes('const [errors, setErrors]')) {
  roiContent = roiContent.replace(
    "const [email, setEmail] = useState('');",
    "const [email, setEmail] = useState('');\n  const [errors, setErrors] = useState<Record<string, string>>({});"
  );
}

if (!roiContent.includes('handleDownloadPDF')) {
  const roiPdfHandler = `
  const handleDownloadPDF = () => {
    if (!results) return;
    try {
      generateROIPDF({
        initialInvestment: results.initialInvestment,
        finalValue: results.finalValue,
        timePeriod: results.timePeriod,
        roiPercentage: results.roiPercentage,
        profit: results.profit,
        annualizedReturn: results.annualizedReturn,
        status: results.status,
        recommendations,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('حدث خطأ في إنشاء التقرير');
    }
  };
`;
  roiContent = roiContent.replace(
    'const getStatusInfo = (status: string) => {',
    roiPdfHandler + '\n  const getStatusInfo = (status: string) => {'
  );
}

// Add PDF button onClick
roiContent = roiContent.replace(
  '<Button className="sm:w-auto bg-green-600 hover:bg-green-700">',
  '<Button onClick={handleDownloadPDF} className="sm:w-auto bg-green-600 hover:bg-green-700">'
);

fs.writeFileSync(roiPath, roiContent);
console.log('✓ Updated ROI calculator');

// Update Retirement Calculator
const retirementPath = 'c:\\acash.ai\\app\\[locale]\\tools\\retirement\\page.tsx';
let retirementContent = fs.readFileSync(retirementPath, 'utf8');

if (!retirementContent.includes('RetirementCalculatorSchema')) {
  retirementContent = retirementContent.replace(
    "import { formatCurrency } from '@/lib/utils';",
    "import { formatCurrency } from '@/lib/utils';\nimport { RetirementCalculatorSchema } from '@/lib/validations/calculators';\nimport { generateRetirementPDF } from '@/lib/utils/pdf-generator';"
  );
}

if (!retirementContent.includes('const [errors, setErrors]')) {
  retirementContent = retirementContent.replace(
    "const [email, setEmail] = useState('');",
    "const [email, setEmail] = useState('');\n  const [errors, setErrors] = useState<Record<string, string>>({});"
  );
}

if (!retirementContent.includes('handleDownloadPDF')) {
  const retirementPdfHandler = `
  const handleDownloadPDF = () => {
    if (!results) return;
    try {
      generateRetirementPDF({
        currentAge: results.currentAge,
        retirementAge: results.retirementAge,
        currentSavings: results.currentSavings,
        monthlyContribution: results.monthlyContribution,
        yearsToRetirement: results.yearsToRetirement,
        projectedFund: results.projectedFund,
        monthlyRetirementIncome: results.monthlyRetirementIncome,
        gap: results.gap,
        feasibilityScore: results.feasibilityScore,
        status: results.status,
        recommendations,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('حدث خطأ في إنشاء التقرير');
    }
  };
`;
  retirementContent = retirementContent.replace(
    'const getStatusInfo = (status: string) => {',
    retirementPdfHandler + '\n  const getStatusInfo = (status: string) => {'
  );
}

// Add PDF button onClick
retirementContent = retirementContent.replace(
  '<Button className="sm:w-auto bg-green-600 hover:bg-green-700">',
  '<Button onClick={handleDownloadPDF} className="sm:w-auto bg-green-600 hover:bg-green-700">'
);

fs.writeFileSync(retirementPath, retirementContent);
console.log('✓ Updated Retirement calculator');

// Update Zakat Calculator
const zakatPath = 'c:\\acash.ai\\app\\[locale]\\tools\\zakat\\page.tsx';
let zakatContent = fs.readFileSync(zakatPath, 'utf8');

if (!zakatContent.includes('ZakatCalculatorSchema')) {
  zakatContent = zakatContent.replace(
    "import { Input } from '@/components/ui/input';",
    "import { Input } from '@/components/ui/input';\nimport { ZakatCalculatorSchema } from '@/lib/validations/calculators';\nimport { generateZakatPDF } from '@/lib/utils/pdf-generator';\nimport { formatCurrency } from '@/lib/utils';"
  );
}

if (!zakatContent.includes('const [errors, setErrors]')) {
  zakatContent = zakatContent.replace(
    'const [zakatAmount, setZakatAmount] = useState(0);',
    'const [zakatAmount, setZakatAmount] = useState(0);\n  const [errors, setErrors] = useState<Record<string, string>>({});'
  );
}

// Add validation to calculateZakat
zakatContent = zakatContent.replace(
  'const calculateZakat = () => {',
  `const calculateZakat = () => {
    setErrors({});
    const totalWealth =
      parseFloat(cash || '0') +
      parseFloat(gold || '0') * 2000 +
      parseFloat(silver || '0') * 25 +
      parseFloat(stocks || '0') +
      parseFloat(business || '0');

    const validation = ZakatCalculatorSchema.safeParse({
      cash: parseFloat(cash || '0'),
      gold: parseFloat(gold || '0'),
      silver: parseFloat(silver || '0'),
      investments: parseFloat(stocks || '0'),
      businessAssets: parseFloat(business || '0'),
      liabilities: 0,
    });

    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        newErrors[err.path.join('.')] = err.message;
      });
      setErrors(newErrors);
      return;
    }
    calculateZakatOld();
  };

  const calculateZakatOld = () => {`
);

if (!zakatContent.includes('handleDownloadPDF')) {
  const zakatPdfHandler = `
  const handleDownloadPDF = () => {
    if (zakatAmount === 0) return;
    const totalWealth =
      parseFloat(cash || '0') +
      parseFloat(gold || '0') * 2000 +
      parseFloat(silver || '0') * 25 +
      parseFloat(stocks || '0') +
      parseFloat(business || '0');

    try {
      generateZakatPDF({
        cash: parseFloat(cash || '0'),
        gold: parseFloat(gold || '0') * 2000,
        silver: parseFloat(silver || '0') * 25,
        investments: parseFloat(stocks || '0'),
        businessAssets: parseFloat(business || '0'),
        liabilities: 0,
        totalWealth,
        zakatAmount,
        nisab: 85 * 2000,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('حدث خطأ في إنشاء التقرير');
    }
  };
`;
  // Find a good place to insert the handler
  zakatContent = zakatContent.replace(
    'return (',
    zakatPdfHandler + '\n  return ('
  );
}

fs.writeFileSync(zakatPath, zakatContent);
console.log('✓ Updated Zakat calculator');

console.log('\nAll remaining calculators updated successfully!');
