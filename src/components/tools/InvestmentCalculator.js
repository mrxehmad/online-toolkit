import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

function InvestmentCalculator() {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    initialInvestment: '',
    monthlyContribution: '',
    annualReturn: '',
    timeframe: '',
  });
  const [result, setResult] = useState(null);

  const calculateInvestment = (e) => {
    e.preventDefault();
    const P = parseFloat(formData.initialInvestment);
    const PMT = parseFloat(formData.monthlyContribution);
    const r = parseFloat(formData.annualReturn) / 100 / 12;
    const t = parseFloat(formData.timeframe) * 12;

    // Calculate future value with monthly contributions
    const FV = P * Math.pow(1 + r, t) + 
               PMT * ((Math.pow(1 + r, t) - 1) / r);

    const totalContributions = P + (PMT * t);
    const totalInterest = FV - totalContributions;

    setResult({
      futureValue: FV.toFixed(2),
      totalContributions: totalContributions.toFixed(2),
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
            Investment Calculator
          </h1>
          <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Calculate your potential investment returns over time
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6 mb-8`}>
          <form onSubmit={calculateInvestment} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Initial Investment ($)
              </label>
              <input
                type="number"
                name="initialInvestment"
                value={formData.initialInvestment}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Monthly Contribution ($)
              </label>
              <input
                type="number"
                name="monthlyContribution"
                value={formData.monthlyContribution}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Expected Annual Return (%)
              </label>
              <input
                type="number"
                name="annualReturn"
                value={formData.annualReturn}
                onChange={handleInputChange}
                step="0.1"
                className={`w-full px-3 py-2 rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Investment Timeframe (years)
              </label>
              <input
                type="number"
                name="timeframe"
                value={formData.timeframe}
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
              Investment Projection
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Future Value</p>
                <p className="text-2xl font-bold text-indigo-600">${result.futureValue}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Contributions</p>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>${result.totalContributions}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Total Interest Earned</p>
                <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>${result.totalInterest}</p>
              </div>
            </div>
          </div>
        )}
                {/* Informational Content */}
                <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg p-6`}>
          <h2 className="text-2xl font-semibold mb-4">Maximize Your Wealth with Our Investment Calculator</h2>
          <p className="mb-4">
            Investing is a powerful way to grow your wealth over time, but understanding potential returns is essential for making informed financial decisions. Our <strong>investment calculator</strong> helps you estimate the future value of your investments based on your contributions, expected returns, and investment timeframe.
          </p>
          <h3 className="text-xl font-semibold mb-2">Why Use Our Investment Calculator?</h3>
          <p className="mb-4">
            Our <strong>return-on-investment calculator</strong> allows you to project how your money can grow over time. By entering key financial details, you can:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>See how your initial investment and monthly contributions accumulate</li>
            <li>Understand the impact of compound interest</li>
            <li>Compare different investment scenarios to make the best decision</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">How to Use the Investment Calculator</h3>
          <p className="mb-4">
            Using our investment calculator is simple:
          </p>
          <ol className="list-decimal pl-6 mb-4">
            <li>Enter your <strong>initial investment</strong> amount.</li>
            <li>Input your <strong>monthly contribution</strong>.</li>
            <li>Specify your <strong>expected annual return</strong> percentage.</li>
            <li>Select your <strong>investment timeframe</strong> in years.</li>
            <li>The calculator will instantly estimate your potential investment growth.</li>
          </ol>
          <p className="mb-4">
            With this tool, you can visualize how your money works for you and create a long-term financial plan.
          </p>
          <h3 className="text-xl font-semibold mb-2">Plan Your Finances with Additional Tools</h3>
          <p className="mb-4">
            For a complete financial strategy, try our other helpful calculators:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong><a href="/#/tools/tax-calculator" className="text-indigo-600 hover:underline">Tax Calculator</a></strong> – Estimate your tax liability and optimize your savings.</li>
            <li><strong><a href="/#/tools/mortgage-calculator" className="text-indigo-600 hover:underline">Mortgage Calculator</a></strong> – Plan your home loan and monthly payments effectively.</li>
          </ul>
          <p className="mb-4">
            By using these tools together, you can create a well-rounded financial plan that maximizes your investments and minimizes financial risks.
          </p>
          <h3 className="text-xl font-semibold mb-2">Start Growing Your Investments Today!</h3>
          <p>
            Take control of your financial future. Use our <strong>investment calculator</strong> to estimate your potential returns and make smarter investment decisions. Try it now and explore our other financial planning tools!
          </p>
        </div>
      </div>
    </div>
  );
}

export default InvestmentCalculator; 