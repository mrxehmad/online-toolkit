import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

function MortgageCalculator() {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    principal: '',
    interestRate: '',
    loanTerm: '',
    downPayment: '',
  });
  const [result, setResult] = useState(null);

  const calculateMortgage = (e) => {
    e.preventDefault();
    const p = parseFloat(formData.principal) - parseFloat(formData.downPayment || 0);
    const r = parseFloat(formData.interestRate) / 100 / 12;
    const n = parseFloat(formData.loanTerm) * 12;

    const monthlyPayment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - p;

    setResult({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Mortgage Calculator
          </h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Calculate your monthly mortgage payments and total interest
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6 mb-8`}>
          <form onSubmit={calculateMortgage} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Home Price ($)
              </label>
              <input
                type="number"
                name="principal"
                value={formData.principal}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Down Payment ($)
              </label>
              <input
                type="number"
                name="downPayment"
                value={formData.downPayment}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                name="interestRate"
                value={formData.interestRate}
                onChange={handleInputChange}
                step="0.01"
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Loan Term (years)
              </label>
              <input
                type="number"
                name="loanTerm"
                value={formData.loanTerm}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Calculate
            </button>
          </form>
        </div>

        {result && (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
            <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Results
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Monthly Payment</p>
                <p className="text-2xl font-bold text-indigo-600">${result.monthlyPayment}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Payment</p>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>${result.totalPayment}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Interest</p>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>${result.totalInterest}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MortgageCalculator; 