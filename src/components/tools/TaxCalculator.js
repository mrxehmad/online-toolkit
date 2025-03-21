import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import MetaTags from '../MetaTags';

function TaxCalculator() {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    income: "",
    filingStatus: "single",
    state: "none",
    deductions: "standard",
    customDeduction: "",
  });
  const [result, setResult] = useState(null);

  // 2023 Tax Brackets (Simplified)
  const taxBrackets = {
    single: [
      { rate: 0.1, limit: 11000 },
      { rate: 0.12, limit: 44725 },
      { rate: 0.22, limit: 95375 },
      { rate: 0.24, limit: 182100 },
      { rate: 0.32, limit: 231250 },
      { rate: 0.35, limit: 578125 },
      { rate: 0.37, limit: Infinity },
    ],
    married: [
      { rate: 0.1, limit: 22000 },
      { rate: 0.12, limit: 89450 },
      { rate: 0.22, limit: 190750 },
      { rate: 0.24, limit: 364200 },
      { rate: 0.32, limit: 462500 },
      { rate: 0.35, limit: 693750 },
      { rate: 0.37, limit: Infinity },
    ],
  };

  const standardDeduction = {
    single: 13850,
    married: 27700,
  };

  const states = [
    { value: "none", label: "No State Tax" },
    { value: "ca", label: "California (13.3%)" },
    { value: "ny", label: "New York (10.9%)" },
    { value: "tx", label: "Texas (No State Tax)" },
    { value: "fl", label: "Florida (No State Tax)" },
  ];

  const calculateTax = (e) => {
    e.preventDefault();
    const income = parseFloat(formData.income);
    const brackets = taxBrackets[formData.filingStatus];
    const deduction =
      formData.deductions === "standard"
        ? standardDeduction[formData.filingStatus]
        : parseFloat(formData.customDeduction) || 0;

    const taxableIncome = Math.max(0, income - deduction);
    let totalTax = 0;
    let remainingIncome = taxableIncome;
    let previousLimit = 0;

    const bracketTaxes = brackets
      .map((bracket) => {
        const taxableAmount = Math.min(
          Math.max(0, remainingIncome),
          bracket.limit - previousLimit
        );
        const taxForBracket = taxableAmount * bracket.rate;
        remainingIncome -= taxableAmount;
        previousLimit = bracket.limit;

        return {
          rate: bracket.rate * 100,
          amount: taxableAmount,
          tax: taxForBracket,
        };
      })
      .filter((bracket) => bracket.amount > 0);

    totalTax = bracketTaxes.reduce((sum, bracket) => sum + bracket.tax, 0);

    // Calculate state tax if applicable
    let stateTax = 0;
    if (formData.state === "ca") {
      stateTax = taxableIncome * 0.133;
    } else if (formData.state === "ny") {
      stateTax = taxableIncome * 0.109;
    }

    setResult({
      totalIncome: income,
      deductions: deduction,
      taxableIncome,
      federalTax: totalTax,
      stateTax,
      totalTax: totalTax + stateTax,
      effectiveRate: (((totalTax + stateTax) / income) * 100).toFixed(2),
      bracketTaxes,
      takeHome: income - totalTax - stateTax,
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
        title="Tax Calculator"
        description="Calculate your income tax and take-home pay with our comprehensive tax calculator. Supports multiple tax brackets and deductions for accurate tax estimation."
        keywords={[
          'tax calculator',
          'income tax calculator',
          'tax bracket calculator',
          'take home pay calculator',
          'salary calculator',
          'tax estimation',
          'net income calculator',
          'paycheck calculator',
          'tax deduction calculator',
          'annual tax calculator'
        ]}
        canonicalUrl="/tax-calculator"
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
              Tax Calculator
            </h1>
            <p
              className={`mt-2 text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Estimate your income tax and take-home pay
            </p>
          </div>

          <div
            className={`${
              darkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg rounded-lg p-6 mb-8`}
          >
            <form onSubmit={calculateTax} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Annual Income ($)
                </label>
                <input
                  type="number"
                  name="income"
                  value={formData.income}
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
                  Filing Status
                </label>
                <select
                  name="filingStatus"
                  value={formData.filingStatus}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  {states.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deductions
                </label>
                <select
                  name="deductions"
                  value={formData.deductions}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 rounded-md border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  <option value="standard">Standard Deduction</option>
                  <option value="itemized">Itemized Deductions</option>
                </select>
              </div>

              {formData.deductions === "itemized" && (
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Total Itemized Deductions ($)
                  </label>
                  <input
                    type="number"
                    name="customDeduction"
                    value={formData.customDeduction}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 rounded-md border ${
                      darkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                Calculate Tax
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
                className={`text-xl font-semibold mb-6 ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Tax Summary
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Take-Home Pay
                  </p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    ${result.takeHome.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Effective Tax Rate
                  </p>
                  <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {result.effectiveRate}%
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Tax Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Income</span>
                      <span>${result.totalIncome.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Deductions</span>
                      <span>${result.deductions.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxable Income</span>
                      <span>${result.taxableIncome.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Federal Tax</span>
                      <span>${result.federalTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>State Tax</span>
                      <span>${result.stateTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>Total Tax</span>
                      <span>${result.totalTax.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Tax Brackets Breakdown
                  </h3>
                  <div className="space-y-2">
                    {result.bracketTaxes.map((bracket, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{bracket.rate}% Bracket</span>
                        <span>${bracket.tax.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
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
              Maximize Your Savings with Our Online Tax Calculator
            </h2>
            <p className="mb-4">
              Understanding your tax obligations can be challenging, but with our
              easy-to-use <strong>tax calculator</strong>, you can quickly
              estimate your tax liability and plan your finances effectively.
              Whether you're a salaried employee, self-employed professional, or
              business owner, our tool simplifies complex tax calculations and
              provides a clear breakdown of your tax details.
            </p>
            <h3 className="text-xl font-semibold mb-2">
              Why Use Our Tax Calculator?
            </h3>
            <p className="mb-4">
              Our <strong>online tax calculator</strong> is designed to help you
              make informed financial decisions by providing accurate estimates
              based on the latest tax brackets, rates, and regulations. By
              entering your income, deductions, and other relevant details, you
              can:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Estimate your taxable income and total tax liability</li>
              <li>Understand your effective tax rate and take-home pay</li>
              <li>
                Identify potential deductions and credits to reduce your tax
                burden
              </li>
              <li>Plan your finances to avoid surprises during tax season</li>
            </ul>
            <h3 className="text-xl font-semibold mb-2">
              How to Use the Tax Calculator
            </h3>
            <p className="mb-4">
              Using our tax calculator is simple and intuitive:
            </p>
            <ol className="list-decimal pl-6 mb-4">
              <li>Enter your annual income (e.g., $100,000).</li>
              <li>
                Input any applicable deductions (e.g., standard deduction of
                $13,850).
              </li>
              <li>
                Review the detailed tax breakdown, including federal and state
                taxes.
              </li>
              <li>
                Use the results to plan your financial strategy and optimize your
                savings.
              </li>
            </ol>
            <p className="mb-4">
              For example, if your annual income is $100,000 and you claim the
              standard deduction of $13,850, your taxable income will be $86,150.
              Based on current tax brackets, your total tax liability would be
              approximately $23,650.85, leaving you with a take-home pay of
              $76,349.15 and an effective tax rate of 23.65%.
            </p>
            <h3 className="text-xl font-semibold mb-2">
              Related Financial Tools for Better Planning
            </h3>
            <p className="mb-4">
              To further enhance your financial planning, explore our suite of
              tools designed to help you manage your money effectively:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>
                  <a
                    href="/#/tools/investment-calculator"
                    className="text-indigo-600 hover:underline"
                  >
                    Investment Calculator
                  </a>
                </strong>{" "}
                – Calculate potential returns on your investments and plan for
                long-term growth.
              </li>
              <li>
                <strong>
                  <a
                    href="/mortgage-calculator"
                    className="text-indigo-600 hover:underline"
                  >
                    Mortgage Calculator
                  </a>
                </strong>{" "}
                – Estimate your monthly mortgage payments and evaluate different
                loan options.
              </li>
              <li>
                <strong>
                  <a
                    href="/tax-calculator"
                    className="text-indigo-600 hover:underline"
                  >
                    Tax Calculator
                  </a>
                </strong>{" "}
                – Gain insights into your tax liability and optimize your
                deductions for maximum savings.
              </li>
            </ul>
            <p className="mb-4">
              By combining these tools, you can create a comprehensive financial
              plan that minimizes your tax burden, maximizes your savings, and
              helps you achieve your financial goals.
            </p>
            <h3 className="text-xl font-semibold mb-2">
              Start Calculating Your Taxes Today!
            </h3>
            <p>
              Don't let tax season catch you off guard. Use our{" "}
              <strong>tax calculator</strong> to gain clarity on your tax
              liability, understand your take-home pay, and make smarter financial
              decisions. Try it now and explore our other tools to take full
              control of your financial future!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default TaxCalculator;
