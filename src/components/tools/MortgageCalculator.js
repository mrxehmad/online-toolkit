import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import MetaTags from '../MetaTags';

function MortgageCalculator() {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    principal: "",
    interestRate: "",
    loanTerm: "",
    downPayment: "",
  });
  const [result, setResult] = useState(null);

  const calculateMortgage = (e) => {
    e.preventDefault();
    const p =
      parseFloat(formData.principal) - parseFloat(formData.downPayment || 0);
    const r = parseFloat(formData.interestRate) / 100 / 12;
    const n = parseFloat(formData.loanTerm) * 12;

    const monthlyPayment =
      (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <MetaTags
        title="Mortgage Calculator"
        description="Calculate your monthly mortgage payments, total interest, and amortization schedule with our easy-to-use mortgage calculator. Make informed decisions about your home loan."
        keywords={[
          'mortgage calculator',
          'home loan calculator',
          'mortgage payment calculator',
          'amortization calculator',
          'house payment calculator',
          'loan calculator',
          'mortgage interest calculator',
          'home mortgage calculator',
          'monthly payment calculator',
          'mortgage amortization'
        ]}
        canonicalUrl="/mortgage-calculator"
      />
      <div
        className={`min-h-screen ${
          darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        } py-12 px-4 sm:px-6 lg:px-8`}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1
              className={`text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Mortgage Calculator
            </h1>
            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Calculate your monthly mortgage payments and total interest
            </p>
          </div>
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg rounded-lg p-6 mb-8`}
          >
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
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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
            <div
              className={`${
                darkMode ? "bg-gray-800" : "bg-white"
              } shadow-lg rounded-lg p-6`}
            >
              <h2
                className={`text-xl font-semibold mb-4 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Results
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Monthly Payment</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    ${result.monthlyPayment}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Payment</p>
                  <p
                    className={`text-lg ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    ${result.totalPayment}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Interest</p>
                  <p
                    className={`text-lg ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    ${result.totalInterest}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Informational Content */}
          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg rounded-lg p-6`}
          >
            <h2 className="text-2xl font-semibold mb-4">
              Easily Estimate Your Home Loan with Our Mortgage Calculator
            </h2>
            <p className="mb-4">
              Buying a home is one of the biggest financial decisions you'll make,
              and understanding your mortgage payments is crucial. Our{" "}
              <strong>mortgage calculator</strong> helps you estimate your monthly
              payments, including principal and interest, so you can plan your
              budget effectively.
            </p>
            <h3 className="text-xl font-semibold mb-2">
              Why Use Our Mortgage Calculator?
            </h3>
            <p className="mb-4">
              Our <strong>home loan calculator</strong> is designed to provide
              accurate estimates based on your loan details. With just a few
              inputs, you can:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Calculate your monthly mortgage payments</li>
              <li>See how interest rates impact your loan</li>
              <li>Plan ahead for down payments and closing costs</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">
              How to Use the Mortgage Calculator
            </h3>
            <p className="mb-4">Using our mortgage calculator is simple:</p>
            <ol className="list-decimal pl-6 mb-4">
              <li>Enter your loan amount.</li>
              <li>Input your interest rate and loan term.</li>
              <li>
                The calculator will instantly estimate your monthly payment.
              </li>
            </ol>
            <p className="mb-4">
              This tool allows you to compare different loan scenarios and choose
              the best option for your financial goals.
            </p>
            <h3 className="text-xl font-semibold mb-2">
              Explore More Financial Planning Tools
            </h3>
            <p className="mb-4">
              To gain a better understanding of your finances, check out our other
              helpful tools:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>
                  <a
                    href="/tax-calculator"
                    className="text-indigo-600 hover:underline"
                  >
                    Tax Calculator
                  </a>
                </strong>{" "}
                – Estimate your tax liability and maximize savings.
              </li>
              <li>
                <strong>
                  <a
                    href="/investment-calculator"
                    className="text-indigo-600 hover:underline"
                  >
                    Investment Calculator
                  </a>
                </strong>{" "}
                – Plan your investments and track potential returns.
              </li>
            </ul>
            <p className="mb-4">
              Using these tools together, you can make informed decisions about
              your home purchase and overall financial strategy.
            </p>
            <h3 className="text-xl font-semibold mb-2">
              Start Planning Your Home Purchase Today!
            </h3>
            <p>
              Take the guesswork out of mortgage planning. Use our{" "}
              <strong>mortgage calculator</strong> to estimate your payments and
              confidently move forward with your home-buying journey. Try it now
              and explore our other financial tools for better financial
              management.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default MortgageCalculator;
