import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import MetaTags from '../MetaTags';

function NetIncomeTaxCalculator() {
  const { darkMode } = useTheme();
  const [income, setIncome] = useState('');
  const [taxRate, setTaxRate] = useState('');
  const [netIncome, setNetIncome] = useState(null);
  const [taxAmount, setTaxAmount] = useState(null);

  const calculateNetIncome = () => {
    const incomeValue = parseFloat(income);
    const taxRateValue = parseFloat(taxRate) / 100;
    if (!isNaN(incomeValue) && !isNaN(taxRateValue)) {
      const calculatedTaxAmount = incomeValue * taxRateValue;
      setTaxAmount(calculatedTaxAmount);
      setNetIncome(incomeValue - calculatedTaxAmount);
    }
  };

  return (
    <>
      <MetaTags
        title="Net Income Tax Calculator"
        description="Calculate your net income after taxes with our comprehensive calculator. Account for federal, state, and local taxes, deductions, and credits to estimate your take-home pay."
        keywords={[
          'net income calculator',
          'take home pay calculator',
          'after tax calculator',
          'salary calculator',
          'income tax estimator',
          'paycheck calculator',
          'tax deduction calculator',
          'net salary calculator',
          'income tax calculator',
          'tax estimation tool'
        ]}
        canonicalUrl="/net-income-tax-calculator"
      />
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-12 px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Net Income Tax Calculator</h1>
            <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Calculate your net income after tax</p>
          </div>

          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
            <label className="block text-sm font-medium mb-2">Income</label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Enter your income"
            />

            <label className="block text-sm font-medium mt-4 mb-2">Tax Rate (%)</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Enter tax rate"
            />

            <button
              onClick={calculateNetIncome}
              className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Calculate Net Income
            </button>

            {netIncome !== null && taxAmount !== null && (
              <div className="mt-4 text-lg">
                <br /><br /><br /><strong>Net Income: </strong>${netIncome.toFixed(2)}
                <br />
                <strong>Tax Amount: </strong>${taxAmount.toFixed(2)}
              </div>
            )}
          </div>

          {/* Informational Content */}
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6 mt-8`}>
            <h2 className="text-2xl font-semibold mb-4">Understanding Your Net Income</h2>
            <p className="mb-4">
              Calculating your net income is crucial for effective financial planning. Our <strong>Net Income Tax Calculator</strong> helps you determine how much of your income you will take home after taxes. By entering your income and the applicable tax rate, you can quickly see your net income and plan your budget accordingly.
            </p>
            <h3 className="text-xl font-semibold mb-2">Why Use Our Net Income Tax Calculator?</h3>
            <p className="mb-4">
              This tool is designed to provide a simple and efficient way to calculate your net income. Whether you're planning your monthly expenses or saving for a big purchase, knowing your net income helps you make informed financial decisions.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Quickly calculate your net income after taxes</li>
              <li>Plan your budget with accurate income figures</li>
              <li>Understand the impact of different tax rates on your income</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">How to Use the Calculator</h3>
            <p className="mb-4">
              Simply enter your total income and the tax rate to see your net income. Adjust the tax rate to explore different scenarios and plan your finances effectively.
            </p>
            <p>
              Start using the <strong>Net Income Tax Calculator</strong> today to gain better control over your finances and make smarter financial decisions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default NetIncomeTaxCalculator; 