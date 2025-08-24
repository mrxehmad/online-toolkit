import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, BarChart3, Info, Zap } from 'lucide-react';

const ProfitCalculator = () => {
  const [activeTab, setActiveTab] = useState('profit');
  const [profitInputs, setProfitInputs] = useState({
    revenue: '',
    costs: ''
  });
  const [breakEvenInputs, setBreakEvenInputs] = useState({
    fixedCosts: '',
    variableCostPerUnit: '',
    pricePerUnit: ''
  });
  const [profitResults, setProfitResults] = useState(null);
  const [breakEvenResults, setBreakEvenResults] = useState(null);

  // Calculate profit margin in real-time
  useEffect(() => {
    const revenue = parseFloat(profitInputs.revenue) || 0;
    const costs = parseFloat(profitInputs.costs) || 0;
    
    if (revenue > 0 && costs >= 0) {
      const profit = revenue - costs;
      const margin = ((profit / revenue) * 100);
      const markup = costs > 0 ? ((profit / costs) * 100) : 0;
      
      setProfitResults({
        profit: profit.toFixed(2),
        margin: margin.toFixed(2),
        markup: markup.toFixed(2),
        roi: costs > 0 ? ((profit / costs) * 100).toFixed(2) : '0.00'
      });
    } else {
      setProfitResults(null);
    }
  }, [profitInputs]);

  // Calculate break-even in real-time
  useEffect(() => {
    const fixedCosts = parseFloat(breakEvenInputs.fixedCosts) || 0;
    const variableCost = parseFloat(breakEvenInputs.variableCostPerUnit) || 0;
    const price = parseFloat(breakEvenInputs.pricePerUnit) || 0;
    
    if (fixedCosts > 0 && price > variableCost && price > 0) {
      const contributionMargin = price - variableCost;
      const breakEvenUnits = Math.ceil(fixedCosts / contributionMargin);
      const breakEvenRevenue = breakEvenUnits * price;
      const contributionMarginPercent = (contributionMargin / price) * 100;
      
      setBreakEvenResults({
        units: breakEvenUnits,
        revenue: breakEvenRevenue.toFixed(2),
        contributionMargin: contributionMargin.toFixed(2),
        contributionMarginPercent: contributionMarginPercent.toFixed(2)
      });
    } else {
      setBreakEvenResults(null);
    }
  }, [breakEvenInputs]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      {/* SEO Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Profit Margin & Break-Even Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Free online tool to calculate profit margins, break-even points, and financial metrics. 
            Perfect for businesses, entrepreneurs, and financial planning.
          </p>
        </div>
      </div>

      {/* Main Calculator */}
      <div className="max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="flex">
            <button
              onClick={() => setActiveTab('profit')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                activeTab === 'profit'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>Profit Margin</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('breakeven')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-200 ${
                activeTab === 'breakeven'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BarChart3 className="w-5 h-5" />
                <span>Break-Even</span>
              </div>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              {activeTab === 'profit' ? 'Profit Margin Calculator' : 'Break-Even Calculator'}
            </h2>

            {activeTab === 'profit' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Revenue ($)
                  </label>
                  <input
                    type="number"
                    value={profitInputs.revenue}
                    onChange={(e) => setProfitInputs({...profitInputs, revenue: e.target.value})}
                    placeholder="Enter total revenue"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Costs ($)
                  </label>
                  <input
                    type="number"
                    value={profitInputs.costs}
                    onChange={(e) => setProfitInputs({...profitInputs, costs: e.target.value})}
                    placeholder="Enter total costs"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fixed Costs ($)
                  </label>
                  <input
                    type="number"
                    value={breakEvenInputs.fixedCosts}
                    onChange={(e) => setBreakEvenInputs({...breakEvenInputs, fixedCosts: e.target.value})}
                    placeholder="Rent, salaries, utilities..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variable Cost per Unit ($)
                  </label>
                  <input
                    type="number"
                    value={breakEvenInputs.variableCostPerUnit}
                    onChange={(e) => setBreakEvenInputs({...breakEvenInputs, variableCostPerUnit: e.target.value})}
                    placeholder="Materials, labor per unit..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selling Price per Unit ($)
                  </label>
                  <input
                    type="number"
                    value={breakEvenInputs.pricePerUnit}
                    onChange={(e) => setBreakEvenInputs({...breakEvenInputs, pricePerUnit: e.target.value})}
                    placeholder="Price you sell each unit for"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              Results
            </h2>

            {activeTab === 'profit' ? (
              profitResults ? (
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="text-sm font-medium text-green-800 mb-1">Net Profit</div>
                    <div className="text-2xl font-bold text-green-900">
                      ${formatNumber(profitResults.profit)}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="text-sm font-medium text-blue-800 mb-1">Profit Margin</div>
                      <div className="text-xl font-bold text-blue-900">
                        {profitResults.margin}%
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                      <div className="text-sm font-medium text-purple-800 mb-1">Markup</div>
                      <div className="text-xl font-bold text-purple-900">
                        {profitResults.markup}%
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                    <div className="text-sm font-medium text-orange-800 mb-1">Return on Investment (ROI)</div>
                    <div className="text-xl font-bold text-orange-900">
                      {profitResults.roi}%
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>Enter revenue and costs to see your profit calculations</p>
                </div>
              )
            ) : (
              breakEvenResults ? (
                <div className="space-y-4">
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <div className="text-sm font-medium text-red-800 mb-1">Break-Even Point</div>
                    <div className="text-2xl font-bold text-red-900">
                      {formatNumber(breakEvenResults.units)} units
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="text-sm font-medium text-green-800 mb-1">Break-Even Revenue</div>
                    <div className="text-xl font-bold text-green-900">
                      ${formatNumber(breakEvenResults.revenue)}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="text-sm font-medium text-blue-800 mb-1">Contribution Margin</div>
                      <div className="text-lg font-bold text-blue-900">
                        ${breakEvenResults.contributionMargin}
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                      <div className="text-sm font-medium text-purple-800 mb-1">Margin %</div>
                      <div className="text-lg font-bold text-purple-900">
                        {breakEvenResults.contributionMarginPercent}%
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p>Enter your costs and pricing to calculate break-even point</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Understanding Your Financial Metrics
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Profit Margin Calculations</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Profit Margin:</strong> Shows what percentage of revenue becomes profit. Higher margins indicate better efficiency.</p>
                <p><strong>Markup:</strong> Shows how much you've marked up your costs. Essential for pricing strategies.</p>
                <p><strong>ROI:</strong> Return on investment shows how much profit you make for every dollar invested in costs.</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Break-Even Analysis</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p><strong>Break-Even Point:</strong> The number of units you must sell to cover all costs and achieve zero profit/loss.</p>
                <p><strong>Contribution Margin:</strong> The amount each unit contributes to covering fixed costs after variable costs.</p>
                <p><strong>Fixed vs Variable Costs:</strong> Fixed costs remain constant regardless of production volume, while variable costs change with production.</p>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use a Profit Margin Calculator?</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 leading-relaxed mb-4">
              Our free profit margin and break-even calculator helps businesses make informed financial decisions. 
              Whether you're launching a startup, evaluating product profitability, or planning business expansion, 
              understanding your profit margins and break-even points is crucial for success.
            </p>
            
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Key Benefits:</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="space-y-2">
                <p>• Instant profit margin calculations</p>
                <p>• Break-even analysis for business planning</p>
                <p>• ROI and markup calculations</p>
                <p>• Mobile-friendly interface</p>
              </div>
              <div className="space-y-2">
                <p>• No registration required</p>
                <p>• Real-time calculations</p>
                <p>• Multiple financial metrics</p>
                <p>• Perfect for small businesses</p>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed mt-6">
              Use this calculator for product pricing, investment analysis, business valuation, 
              and financial forecasting. All calculations are performed locally in your browser 
              for privacy and speed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitCalculator;