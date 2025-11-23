import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Percent, Calendar, TrendingUp, Info, ChevronDown, Globe } from 'lucide-react';

const LoanEMICalculator = () => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [tenureType, setTenureType] = useState('years');
  const [currency, setCurrency] = useState('INR');
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const currencies = [
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  ];

  // Calculate EMI and other values
  useEffect(() => {
    const principal = parseFloat(loanAmount) || 0;
    const rate = (parseFloat(interestRate) || 0) / 12 / 100;
    const tenure = tenureType === 'years' ? 
      (parseFloat(loanTenure) || 0) * 12 : 
      parseFloat(loanTenure) || 0;

    if (principal > 0 && rate > 0 && tenure > 0) {
      const emiValue = (principal * rate * Math.pow(1 + rate, tenure)) / 
                      (Math.pow(1 + rate, tenure) - 1);
      
      const totalAmountValue = emiValue * tenure;
      const totalInterestValue = totalAmountValue - principal;

      setEmi(emiValue);
      setTotalAmount(totalAmountValue);
      setTotalInterest(totalInterestValue);
    } else {
      setEmi(0);
      setTotalAmount(0);
      setTotalInterest(0);
    }
  }, [loanAmount, interestRate, loanTenure, tenureType]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const InputField = ({ label, value, onChange, type = 'number', suffix, icon: Icon, min, max, step = 1 }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center mb-4">
        <Icon className="w-5 h-5 text-blue-500 mr-3" />
        <label className="text-gray-700 font-medium">{label}</label>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={min}
            max={max}
            step={step}
            className="w-full text-2xl font-semibold text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none"
            placeholder="Enter amount"
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
              {suffix}
            </span>
          )}
        </div>
        {min && max && (
          <p className="text-xs text-gray-400 mt-1">
            Range: {min} - {max}{suffix}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Description Component */}
      <div className="sr-only">
        <h1>Free Multi-Currency EMI Calculator - Calculate Loan EMI in USD, EUR, GBP, INR</h1>
        <p>Calculate your loan EMI in multiple currencies with our advanced EMI calculator. Get detailed breakdowns of monthly payments, total interest, and repayment schedules for home loans, car loans, personal loans in USD, EUR, GBP, INR and more. Free, accurate, and easy to use.</p>
      </div>

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <Calculator className="w-8 h-8 text-blue-500 mr-3" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Multi-Currency EMI Calculator</h1>
          </div>
          <p className="text-center text-gray-600 mt-2 max-w-2xl mx-auto">
            Calculate EMI in multiple currencies - USD, EUR, GBP, INR, AUD, CAD, JPY, CNY, SGD, AED
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Currency Selector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <Globe className="w-5 h-5 text-blue-500 mr-3" />
                <label className="text-gray-700 font-medium">Currency</label>
              </div>
              <div className="relative">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-lg font-medium text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none appearance-none cursor-pointer"
                >
                  {currencies.map((curr) => (
                    <option key={curr.code} value={curr.code}>
                      {curr.symbol} {curr.name} ({curr.code})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <InputField
              label="Loan Amount"
              value={loanAmount}
              onChange={setLoanAmount}
              min={1000}
              max={100000000}
              step={1000}
              icon={DollarSign}
            />

            <InputField
              label="Interest Rate (Annual)"
              value={interestRate}
              onChange={setInterestRate}
              min={0.1}
              max={50}
              step={0.1}
              suffix="%"
              icon={Percent}
            />

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <Calendar className="w-5 h-5 text-blue-500 mr-3" />
                <label className="text-gray-700 font-medium">Loan Tenure</label>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <input
                      type="number"
                      value={loanTenure}
                      onChange={(e) => setLoanTenure(e.target.value)}
                      min={tenureType === 'years' ? 1 : 1}
                      max={tenureType === 'years' ? 50 : 600}
                      className="w-full text-2xl font-semibold text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none"
                      placeholder="Enter tenure"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={tenureType}
                      onChange={(e) => setTenureType(e.target.value)}
                      className="w-full text-lg font-medium text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:bg-white transition-all duration-200 outline-none appearance-none cursor-pointer"
                    >
                      <option value="years">Years</option>
                      <option value="months">Months</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  Range: {tenureType === 'years' ? '1 - 50 Years' : '1 - 600 Months'}
                </p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 mr-3" />
                <h3 className="text-lg font-semibold">Monthly EMI</h3>
              </div>
              <div className="text-3xl font-bold mb-2">
                {formatCurrency(emi)}
              </div>
              <p className="text-blue-100 text-sm">
                Amount payable every month
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Loan Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Principal Amount</span>
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(loanAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Interest</span>
                  <span className="font-semibold text-red-500">
                    {formatCurrency(totalInterest)}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Total Amount</span>
                    <span className="font-bold text-gray-800 text-lg">
                      {formatCurrency(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center"
            >
              <Info className="w-5 h-5 mr-2" />
              {showBreakdown ? 'Hide' : 'Show'} Detailed Breakdown
            </button>
          </div>
        </div>

        {/* Detailed Breakdown */}
        {showBreakdown && (
          <div className="mt-12 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Payment Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Principal vs Interest</h4>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full"
                    style={{ width: `${(loanAmount / totalAmount) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    Principal: {formatCurrency(loanAmount)} ({((loanAmount / totalAmount) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
                    Interest: {formatCurrency(totalInterest)} ({((totalInterest / totalAmount) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate (Annual)</span>
                  <span className="font-medium">{interestRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Tenure</span>
                  <span className="font-medium">
                    {tenureType === 'years' ? `${loanTenure} Years` : `${loanTenure} Months`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Payments</span>
                  <span className="font-medium">
                    {tenureType === 'years' ? loanTenure * 12 : loanTenure} payments
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Selected Currency</span>
                  <span className="font-medium">{currency}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Content Section */}
        <section className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About Multi-Currency EMI Calculator</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">What is EMI?</h3>
              <p className="text-gray-600 mb-4">
                EMI (Equated Monthly Installment) is a fixed payment amount made by a borrower to a lender at a specified date each month. EMIs consist of both principal and interest components, calculated using a specific formula.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-4">EMI Formula</h3>
              <p className="text-gray-600 mb-4">
                EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]
              </p>
              <ul className="text-gray-600 space-y-1 text-sm">
                <li>• P = Principal loan amount</li>
                <li>• R = Monthly interest rate</li>
                <li>• N = Number of monthly installments</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Benefits of Using EMI Calculator</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• <strong>Multi-Currency Support:</strong> Calculate EMI in 10+ currencies</li>
                <li>• <strong>Quick Planning:</strong> Instantly calculate monthly payments</li>
                <li>• <strong>Budget Management:</strong> Plan your finances effectively</li>
                <li>• <strong>Compare Options:</strong> Evaluate different loan scenarios</li>
                <li>• <strong>Interest Analysis:</strong> Understand total interest payable</li>
                <li>• <strong>Tenure Planning:</strong> Choose optimal repayment period</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Multi-Currency Support</h3>
            <p className="text-gray-600 mb-4">
              Our EMI calculator supports multiple currencies including USD, EUR, GBP, INR, AUD, CAD, JPY, CNY, SGD, and AED. 
              Select your preferred currency from the dropdown to get accurate calculations in your local currency.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Factors Affecting EMI</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800">Loan Amount</h4>
                <p className="text-sm text-gray-600 mt-1">Higher principal increases EMI</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Percent className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800">Interest Rate</h4>
                <p className="text-sm text-gray-600 mt-1">Higher rate increases EMI</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800">Loan Tenure</h4>
                <p className="text-sm text-gray-600 mt-1">Longer tenure reduces EMI</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              Multi-Currency EMI Calculator - Calculate loan EMI in USD, EUR, GBP, INR, AUD, CAD, JPY, CNY, SGD, AED and more. 
              Perfect for international loans, home loans, car loans, personal loans with accurate currency formatting.
            </p>
            <div className="mt-4 flex justify-center space-x-6 text-sm text-gray-500 flex-wrap">
              <span>USD EMI Calculator</span>
              <span>•</span>
              <span>EUR Loan Calculator</span>
              <span>•</span>
              <span>GBP EMI Calculator</span>
              <span>•</span>
              <span>Multi-Currency Support</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS for inputs */}
      <style jsx>{`
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        
        input[type="number"] {
          -moz-appearance: textfield;
        }
        
        select::-ms-expand {
          display: none;
        }
        
        @media (max-width: 768px) {
          input, select {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoanEMICalculator;