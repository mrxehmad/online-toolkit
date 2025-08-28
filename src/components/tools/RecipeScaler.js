import React, { useState, useEffect } from 'react';
import { Plus, Minus, ChefHat, Users, Calculator, Trash2, Copy, Check } from 'lucide-react';

// Mock useTheme hook for demonstration
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  return { theme };
};

export default function RecipeScaler() {
  const { theme } = useTheme();
  const [originalServings, setOriginalServings] = useState(4);
  const [targetServings, setTargetServings] = useState(6);
  const [ingredients, setIngredients] = useState([
    { id: 1, amount: 2, unit: 'cups', ingredient: 'flour' },
    { id: 2, amount: 1, unit: 'tsp', ingredient: 'salt' },
    { id: 3, amount: 0.5, unit: 'cup', ingredient: 'sugar' }
  ]);
  const [copied, setCopied] = useState(false);

  // SEO metadata
  useEffect(() => {
    document.title = 'Recipe Scaler - Adjust Serving Sizes & Ingredient Quantities';
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Easily scale recipe ingredients up or down for any number of servings. Perfect for meal planning, batch cooking, or adjusting recipes for dinner parties and gatherings.';

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}/tools/recipe-scaler`;
  }, []);

  const scalingFactor = targetServings / originalServings;

  const addIngredient = () => {
    const newId = Math.max(...ingredients.map(i => i.id), 0) + 1;
    setIngredients([...ingredients, { 
      id: newId, 
      amount: 1, 
      unit: 'cup', 
      ingredient: 'new ingredient' 
    }]);
  };

  const removeIngredient = (id) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const updateIngredient = (id, field, value) => {
    setIngredients(ingredients.map(ing => 
      ing.id === id 
        ? { ...ing, [field]: field === 'amount' ? parseFloat(value) || 0 : value }
        : ing
    ));
  };

  const formatAmount = (amount) => {
    const scaled = amount * scalingFactor;
    if (scaled % 1 === 0) return scaled.toString();
    if (scaled < 1) return (Math.round(scaled * 16) / 16).toString(); // For fractions
    return scaled.toFixed(2).replace(/\.?0+$/, '');
  };

  const copyRecipe = async () => {
    const recipe = ingredients.map(ing => 
      `${formatAmount(ing.amount)} ${ing.unit} ${ing.ingredient}`
    ).join('\n');
    
    const fullText = `Recipe for ${targetServings} servings:\n\n${recipe}`;
    
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy recipe');
    }
  };

  const adjustServings = (type, isOriginal) => {
    if (isOriginal) {
      if (type === 'increase' && originalServings < 50) {
        setOriginalServings(prev => prev + 1);
      } else if (type === 'decrease' && originalServings > 1) {
        setOriginalServings(prev => prev - 1);
      }
    } else {
      if (type === 'increase' && targetServings < 50) {
        setTargetServings(prev => prev + 1);
      } else if (type === 'decrease' && targetServings > 1) {
        setTargetServings(prev => prev - 1);
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900' 
        : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className={`w-12 h-12 mr-3 ${
              theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
            }`} />
            <h1 className={`text-4xl md:text-5xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Recipe Scaler
            </h1>
          </div>
          <p className={`text-lg md:text-xl ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Adjust ingredient quantities for any number of servings
          </p>
        </div>

        {/* Main Tool Card */}
        <div className={`rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-gray-800/90 border-gray-700 shadow-2xl'
            : 'bg-white/90 border-white/20 shadow-xl'
        }`}>
          <div className="p-6 md:p-8">
            {/* Serving Controls */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Original Servings */}
              <div className={`p-6 rounded-xl border-2 transition-all ${
                theme === 'dark'
                  ? 'bg-gray-700/50 border-gray-600'
                  : 'bg-orange-50 border-orange-200'
              }`}>
                <div className="flex items-center mb-4">
                  <Users className={`w-5 h-5 mr-2 ${
                    theme === 'dark' ? 'text-orange-400' : 'text-orange-600'
                  }`} />
                  <h3 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Original Recipe
                  </h3>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => adjustServings('decrease', true)}
                    disabled={originalServings <= 1}
                    className={`p-2 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 text-white'
                        : 'bg-orange-200 hover:bg-orange-300 disabled:bg-gray-200 text-gray-900'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className={`text-3xl font-bold px-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {originalServings}
                  </div>
                  <button
                    onClick={() => adjustServings('increase', true)}
                    disabled={originalServings >= 50}
                    className={`p-2 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 text-white'
                        : 'bg-orange-200 hover:bg-orange-300 disabled:bg-gray-200 text-gray-900'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Target Servings */}
              <div className={`p-6 rounded-xl border-2 transition-all ${
                theme === 'dark'
                  ? 'bg-blue-900/30 border-blue-600'
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center mb-4">
                  <Calculator className={`w-5 h-5 mr-2 ${
                    theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                  }`} />
                  <h3 className={`text-lg font-semibold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    Target Servings
                  </h3>
                </div>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => adjustServings('decrease', false)}
                    disabled={targetServings <= 1}
                    className={`p-2 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white'
                        : 'bg-blue-200 hover:bg-blue-300 disabled:bg-gray-200 text-gray-900'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className={`text-3xl font-bold px-4 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {targetServings}
                  </div>
                  <button
                    onClick={() => adjustServings('increase', false)}
                    disabled={targetServings >= 50}
                    className={`p-2 rounded-lg transition-all ${
                      theme === 'dark'
                        ? 'bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white'
                        : 'bg-blue-200 hover:bg-blue-300 disabled:bg-gray-200 text-gray-900'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scaling Factor Display */}
            <div className={`text-center mb-8 p-4 rounded-lg ${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Scaling Factor: <span className={`font-bold text-lg ${
                  theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                  {scalingFactor.toFixed(2)}x
                </span>
              </p>
            </div>

            {/* Ingredients Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  Ingredients
                </h3>
                <button
                  onClick={addIngredient}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'bg-green-600 hover:bg-green-500 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ingredient
                </button>
              </div>

              <div className="space-y-4">
                {ingredients.map((ingredient) => (
                  <div key={ingredient.id} className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${
                    theme === 'dark'
                      ? 'bg-gray-700/30 border-gray-600'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    {/* Original Amount */}
                    <div className="flex-1">
                      <input
                        type="number"
                        step="0.125"
                        value={ingredient.amount}
                        onChange={(e) => updateIngredient(ingredient.id, 'amount', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-all ${
                          theme === 'dark'
                            ? 'bg-gray-600 border-gray-500 text-white focus:border-blue-400'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="Amount"
                      />
                    </div>

                    {/* Unit */}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={ingredient.unit}
                        onChange={(e) => updateIngredient(ingredient.id, 'unit', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-all ${
                          theme === 'dark'
                            ? 'bg-gray-600 border-gray-500 text-white focus:border-blue-400'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="Unit"
                      />
                    </div>

                    {/* Ingredient Name */}
                    <div className="flex-2">
                      <input
                        type="text"
                        value={ingredient.ingredient}
                        onChange={(e) => updateIngredient(ingredient.id, 'ingredient', e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border transition-all ${
                          theme === 'dark'
                            ? 'bg-gray-600 border-gray-500 text-white focus:border-blue-400'
                            : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                        placeholder="Ingredient"
                      />
                    </div>

                    {/* Scaled Amount Display */}
                    <div className={`flex-1 text-center font-bold ${
                      theme === 'dark' ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {formatAmount(ingredient.amount)} {ingredient.unit}
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeIngredient(ingredient.id)}
                      className={`p-2 rounded-lg transition-all ${
                        theme === 'dark'
                          ? 'text-red-400 hover:bg-red-900/30'
                          : 'text-red-500 hover:bg-red-50'
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy Recipe Button */}
            <div className="text-center">
              <button
                onClick={copyRecipe}
                className={`flex items-center justify-center mx-auto px-6 py-3 rounded-lg font-semibold transition-all ${
                  theme === 'dark'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5 mr-2" />
                    Copy Scaled Recipe
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className={`mt-12 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-gray-800/90 border-gray-700'
            : 'bg-white/90 border-white/20'
        }`}>
          <div className="p-6 md:p-8">
            <h2 className={`text-2xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              About Recipe Scaler
            </h2>
            <div className={`prose max-w-none ${
              theme === 'dark' ? 'prose-invert' : ''
            }`}>
              <p className={`text-lg leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                The Recipe Scaler is an essential kitchen tool for home cooks, professional chefs, and anyone who loves to cook. Whether you're hosting a dinner party for 12 or cooking for just yourself, this tool makes it effortless to adjust ingredient quantities to match your exact serving needs.
              </p>
              
              <p className={`leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Perfect for meal planning, batch cooking, or when you find the perfect recipe but need to adjust it for your family size. Simply input your original recipe's serving size and ingredients, then specify how many servings you actually need. The tool automatically calculates the precise measurements for each ingredient, maintaining the perfect balance of flavors in your dish.
              </p>

              <p className={`leading-relaxed mb-4 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Features include support for fractional measurements, multiple unit types (cups, teaspoons, ounces, grams, etc.), and the ability to copy your scaled recipe for easy reference while cooking. Whether you're doubling a cookie recipe for a bake sale or halving a soup recipe for a quiet night in, this tool ensures your proportions are always perfect.
              </p>

              <p className={`leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Save time, reduce food waste, and cook with confidence knowing your ingredient ratios are mathematically precise. Great for cooking enthusiasts, culinary students, restaurant professionals, and anyone who wants to master the art of recipe scaling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}