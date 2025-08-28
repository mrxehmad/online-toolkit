import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calculator, Activity, Heart, TrendingUp, User, Scale, Info } from 'lucide-react';

const BMICalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState('metric');
  const [bmi, setBMI] = useState(null);
  const [category, setCategory] = useState('');
  const [idealWeight, setIdealWeight] = useState(null);

  const bmiCategories = [
    { name: 'Underweight', min: 0, max: 18.5, color: '#3B82F6', risk: 'Low' },
    { name: 'Normal', min: 18.5, max: 25, color: '#10B981', risk: 'Low' },
    { name: 'Overweight', min: 25, max: 30, color: '#F59E0B', risk: 'Moderate' },
    { name: 'Obese', min: 30, max: 100, color: '#EF4444', risk: 'High' }
  ];

  const chartData = bmiCategories.map(cat => ({
    category: cat.name,
    range: `${cat.min}-${cat.max === 100 ? '40+' : cat.max}`,
    color: cat.color,
    risk: cat.risk
  }));

  const calculateBMI = () => {
    let weightKg = parseFloat(weight);
    let heightM = parseFloat(height);

    if (!weightKg || !heightM) return;

    if (unit === 'imperial') {
      weightKg = weightKg * 0.453592;
      heightM = heightM * 0.0254;
    } else {
      heightM = heightM / 100;
    }

    const bmiValue = weightKg / (heightM * heightM);
    setBMI(parseFloat(bmiValue.toFixed(1)));

    const cat = bmiCategories.find(c => bmiValue >= c.min && bmiValue < c.max);
    setCategory(cat ? cat.name : 'Unknown');

    // Calculate ideal weight range (Normal BMI: 18.5-24.9)
    const minIdeal = 18.5 * (heightM * heightM);
    const maxIdeal = 24.9 * (heightM * heightM);
    
    if (unit === 'imperial') {
      setIdealWeight({
        min: (minIdeal * 2.20462).toFixed(1),
        max: (maxIdeal * 2.20462).toFixed(1)
      });
    } else {
      setIdealWeight({
        min: minIdeal.toFixed(1),
        max: maxIdeal.toFixed(1)
      });
    }
  };

  useEffect(() => {
    if (weight && height) {
      calculateBMI();
    }
  }, [weight, height, unit]);

  const getBMIColor = () => {
    const cat = bmiCategories.find(c => bmi >= c.min && bmi < c.max);
    return cat ? cat.color : '#6B7280';
  };

  const getBodyFigureHighlight = () => {
    if (!bmi) return '#E5E7EB';
    if (bmi < 18.5) return '#3B82F6';
    if (bmi < 25) return '#10B981';
    if (bmi < 30) return '#F59E0B';
    return '#EF4444';
  };

  const pieData = bmi ? [
    { name: 'Current BMI', value: bmi, color: getBMIColor() },
    { name: 'Remaining', value: Math.max(0, 40 - bmi), color: '#F3F4F6' }
  ] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* SEO Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Professional BMI Calculator - Body Mass Index Calculator
          </h1>
          <p className="text-gray-600 text-lg">
            Calculate your BMI instantly with our free, accurate Body Mass Index calculator. 
            Get personalized health insights, ideal weight recommendations, and track your fitness journey.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Main Calculator Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Calculator className="text-white" size={28} />
              <h2 className="text-2xl font-bold text-white">BMI Calculator</h2>
            </div>
            <p className="text-blue-100">Enter your details to calculate your Body Mass Index</p>
          </div>

          <div className="p-8">
            {/* Unit Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-2xl p-1 flex">
                <button
                  onClick={() => setUnit('metric')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    unit === 'metric'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Metric (kg/cm)
                </button>
                <button
                  onClick={() => setUnit('imperial')}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                    unit === 'imperial'
                      ? 'bg-white text-blue-600 shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Imperial (lbs/in)
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    <Scale className="inline mr-2" size={20} />
                    Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={unit === 'metric' ? 'Enter weight in kg' : 'Enter weight in lbs'}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none text-lg transition-colors bg-gray-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-3">
                    <User className="inline mr-2" size={20} />
                    Height ({unit === 'metric' ? 'cm' : 'inches'})
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={unit === 'metric' ? 'Enter height in cm' : 'Enter height in inches'}
                    className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none text-lg transition-colors bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* BMI Result */}
                {bmi && (
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2" style={{ color: getBMIColor() }}>
                        {bmi}
                      </div>
                      <div className="text-lg font-semibold text-gray-700 mb-2">
                        {category}
                      </div>
                      <div className="text-sm text-gray-600">
                        BMI Category
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Body Figure Visualization */}
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Body Visualization</h3>
                <div className="relative bg-gray-50 rounded-2xl p-6">
                  <svg width="140" height="220" viewBox="0 0 140 220" className="drop-shadow-lg">
                    {/* Head */}
                    <circle 
                      cx="70" 
                      cy="30" 
                      r="18" 
                      fill={getBodyFigureHighlight()} 
                      stroke="#1F2937" 
                      strokeWidth="2.5"
                    />
                    {/* Neck */}
                    <rect 
                      x="65" 
                      y="45" 
                      width="10" 
                      height="8" 
                      fill={getBodyFigureHighlight()} 
                      stroke="#1F2937" 
                      strokeWidth="2"
                    />
                    {/* Torso - adjusted based on BMI */}
                    <ellipse 
                      cx="70" 
                      cy="90" 
                      rx={bmi ? Math.min(Math.max(22, bmi * 0.8), 35) : 22} 
                      ry="40" 
                      fill={getBodyFigureHighlight()} 
                      stroke="#1F2937" 
                      strokeWidth="2.5"
                    />
                    {/* Left Arm */}
                    <ellipse 
                      cx="40" 
                      cy="70" 
                      rx={bmi ? Math.min(Math.max(8, bmi * 0.3), 12) : 8} 
                      ry="25" 
                      fill={getBodyFigureHighlight()} 
                      stroke="#1F2937" 
                      strokeWidth="2"
                      transform="rotate(-15 40 70)"
                    />
                    {/* Right Arm */}
                    <ellipse 
                      cx="100" 
                      cy="70" 
                      rx={bmi ? Math.min(Math.max(8, bmi * 0.3), 12) : 8} 
                      ry="25" 
                      fill={getBodyFigureHighlight()} 
                      stroke="#1F2937" 
                      strokeWidth="2"
                      transform="rotate(15 100 70)"
                    />
                    {/* Waist/Hip area */}
                    <ellipse 
                      cx="70" 
                      cy="135" 
                      rx={bmi ? Math.min(Math.max(18, bmi * 0.7), 28) : 18} 
                      ry="15" 
                      fill={getBodyFigureHighlight()} 
                      stroke="#1F2937" 
                      strokeWidth="2"
                    />
                    {/* Left Leg */}
                    <ellipse 
                      cx="58" 
                      cy="170" 
                      rx={bmi ? Math.min(Math.max(10, bmi * 0.4), 15) : 10} 
                      ry="35" 
                      fill={getBodyFigureHighlight()} 
                      stroke="#1F2937" 
                      strokeWidth="2.5"
                    />
                    {/* Right Leg */}
                    <ellipse 
                      cx="82" 
                      cy="170" 
                      rx={bmi ? Math.min(Math.max(10, bmi * 0.4), 15) : 10} 
                      ry="35" 
                      fill={getBodyFigureHighlight()} 
                      stroke="#1F2937" 
                      strokeWidth="2.5"
                    />
                    {/* Feet */}
                    <ellipse 
                      cx="53" 
                      cy="210" 
                      rx="12" 
                      ry="6" 
                      fill={getBodyFigureHighlight()} 
                      stroke="#1F2937" 
                      strokeWidth="2"
                    />
                    <ellipse 
                      cx="87" 
                      cy="210" 
                      rx="12" 
                      ry="6" 
                      fill={getBodyFigureHighlight()} 
                      stroke="#1F2937" 
                      strokeWidth="2"
                    />
                    {/* Face features for more realism */}
                    <circle cx="65" cy="27" r="2" fill="#1F2937" />
                    <circle cx="75" cy="27" r="2" fill="#1F2937" />
                    <path d="M 65 35 Q 70 38 75 35" stroke="#1F2937" strokeWidth="1.5" fill="none" />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 mt-3 text-center max-w-xs">
                  Body figure adjusts based on your BMI category
                </p>
              </div>
            </div>

            {/* Ideal Weight Range */}
            {idealWeight && (
              <div className="mt-8 bg-green-50 rounded-2xl p-6 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="text-green-600" size={20} />
                  <h3 className="text-lg font-semibold text-green-800">Ideal Weight Range</h3>
                </div>
                <p className="text-green-700">
                  For your height, a healthy weight range is <span className="font-bold">
                  {idealWeight.min} - {idealWeight.max} {unit === 'metric' ? 'kg' : 'lbs'}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* BMI Categories Chart */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <BarChart className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">BMI Categories</h3>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="category" stroke="#6B7280" fontSize={12} />
                <YAxis stroke="#6B7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#F9FAFB',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px'
                  }}
                />
                <Bar dataKey="range" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* BMI Progress Pie Chart */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-purple-600" size={24} />
              <h3 className="text-xl font-bold text-gray-900">Your BMI Progress</h3>
            </div>
            {bmi ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <TrendingUp size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Enter your details to see progress visualization</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BMI Categories Information */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Info className="text-blue-600" size={24} />
            <h3 className="text-xl font-bold text-gray-900">Understanding BMI Categories</h3>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {bmiCategories.map((cat, index) => (
              <div key={index} className="border-l-4 pl-4" style={{ borderColor: cat.color }}>
                <h4 className="font-semibold text-gray-900 mb-2">{cat.name}</h4>
                <p className="text-sm text-gray-600 mb-1">
                  BMI: {cat.min} - {cat.max === 100 ? '40+' : cat.max}
                </p>
                <p className="text-sm font-medium" style={{ color: cat.color }}>
                  Health Risk: {cat.risk}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Complete Guide to BMI Calculator and Body Mass Index
          </h2>
          
          <div className="prose max-w-none text-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What is BMI?</h3>
            <p className="mb-6">
              Body Mass Index (BMI) is a widely used health indicator that measures body fat based on height and weight. 
              Our free BMI calculator helps you determine if you're in a healthy weight range and provides personalized 
              recommendations for maintaining optimal health.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use Our BMI Calculator</h3>
            <p className="mb-6">
              Simply enter your weight and height using either metric (kg/cm) or imperial (lbs/inches) units. 
              Our calculator instantly computes your BMI and displays your category with visual representations 
              including body figure visualization and interactive charts.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">BMI Categories Explained</h3>
            <div className="mb-6">
              <p className="mb-3"><strong>Underweight (BMI less than 18.5):</strong> May indicate insufficient body weight for health.</p>
              <p className="mb-3"><strong>Normal Weight (BMI 18.5-24.9):</strong> Indicates healthy weight range with lowest health risks.</p>
              <p className="mb-3"><strong>Overweight (BMI 25-29.9):</strong> Above normal weight, may increase health risks.</p>
              <p className="mb-3"><strong>Obese (BMI 30 and above):</strong> Significantly above healthy weight, associated with higher health risks.</p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Why Choose Our BMI Calculator?</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold mb-2">✓ Accurate Calculations</h4>
                <p className="text-sm">Precise BMI calculations using WHO standards</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">✓ Visual Representations</h4>
                <p className="text-sm">Body figure and interactive charts for better understanding</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">✓ Mobile Responsive</h4>
                <p className="text-sm">Works perfectly on phones, tablets, and computers</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">✓ Instant Results</h4>
                <p className="text-sm">Real-time calculations as you type</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-4">Health Tips Based on Your BMI</h3>
            <p className="mb-4">
              Remember that BMI is just one health indicator. Consult healthcare professionals for personalized 
              advice. Maintain a balanced diet, regular exercise, and healthy lifestyle regardless of your BMI category.
            </p>

            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">Disclaimer</h4>
              <p className="text-blue-800 text-sm">
                This BMI calculator is for educational purposes only and should not replace professional medical advice. 
                BMI may not accurately reflect health status for athletes, pregnant women, or elderly individuals. 
                Always consult healthcare providers for personalized health assessments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 BMI Calculator. Free BMI Calculator for health and fitness tracking.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Keywords: BMI calculator, body mass index, health calculator, weight calculator, 
            fitness tracker, healthy weight, BMI chart, obesity calculator
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BMICalculator;