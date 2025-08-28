import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Calculator, Plus, Receipt, Split, PiggyBank, CreditCard, Trash2, Edit3 } from 'lucide-react';

// Mock useTheme hook - replace with your actual theme implementation
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  return { theme, setTheme };
};

const ExpenseSplitterTool = () => {
  const { theme } = useTheme();
  const [people, setPeople] = useState([
    { id: 1, name: 'Person 1', paid: 0 },
    { id: 2, name: 'Person 2', paid: 0 }
  ]);
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', paidBy: 1 });
  const [editingPerson, setEditingPerson] = useState(null);
  const [editName, setEditName] = useState('');

  // SEO metadata effect
  useEffect(() => {
    document.title = 'Expense Splitter Tool - Split Bills & Share Costs Fairly | Free Calculator';
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Free expense splitter tool to split bills, share costs, and calculate who owes what. Perfect for roommates, trips, dinners, and group expenses. Easy-to-use bill splitting calculator.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Free expense splitter tool to split bills, share costs, and calculate who owes what. Perfect for roommates, trips, dinners, and group expenses. Easy-to-use bill splitting calculator.';
      document.head.appendChild(meta);
    }

    // Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', window.location.href);
    } else {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = window.location.href;
      document.head.appendChild(link);
    }
  }, []);

  const addPerson = () => {
    const newId = Math.max(...people.map(p => p.id), 0) + 1;
    setPeople([...people, { id: newId, name: `Person ${newId}`, paid: 0 }]);
  };

  const removePerson = (id) => {
    if (people.length <= 2) return;
    setPeople(people.filter(p => p.id !== id));
    setExpenses(expenses.filter(e => e.paidBy !== id));
    if (newExpense.paidBy === id) {
      setNewExpense({ ...newExpense, paidBy: people.find(p => p.id !== id)?.id || 1 });
    }
  };

  const startEditingPerson = (person) => {
    setEditingPerson(person.id);
    setEditName(person.name);
  };

  const savePersonName = () => {
    setPeople(people.map(p => 
      p.id === editingPerson ? { ...p, name: editName } : p
    ));
    setEditingPerson(null);
    setEditName('');
  };

  const addExpense = () => {
    if (!newExpense.description || !newExpense.amount) return;
    
    const expense = {
      id: Date.now(),
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      paidBy: newExpense.paidBy,
      date: new Date().toLocaleDateString()
    };
    
    setExpenses([...expenses, expense]);
    setNewExpense({ description: '', amount: '', paidBy: newExpense.paidBy });
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const calculateSplit = () => {
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const perPersonShare = totalAmount / people.length;
    
    const balances = people.map(person => {
      const totalPaid = expenses
        .filter(expense => expense.paidBy === person.id)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      return {
        ...person,
        totalPaid,
        owes: perPersonShare - totalPaid,
        shouldReceive: totalPaid - perPersonShare
      };
    });

    return { totalAmount, perPersonShare, balances };
  };

  const { totalAmount, perPersonShare, balances } = calculateSplit();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-2xl">
              <Split className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Expense Splitter
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Split bills and expenses fairly among friends, roommates, or groups. 
            Calculate who owes what with our easy-to-use expense sharing tool.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            {/* People Management */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-200">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">People</h2>
              </div>
              
              <div className="space-y-3">
                {people.map(person => (
                  <div key={person.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {editingPerson === person.id ? (
                      <>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-900 dark:text-white"
                          onKeyPress={(e) => e.key === 'Enter' && savePersonName()}
                          autoFocus
                        />
                        <button
                          onClick={savePersonName}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1 text-gray-900 dark:text-white font-medium">
                          {person.name}
                        </span>
                        <button
                          onClick={() => startEditingPerson(person)}
                          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        {people.length > 2 && (
                          <button
                            onClick={() => removePerson(person.id)}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                ))}
                
                <button
                  onClick={addPerson}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-400 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Person
                </button>
              </div>
            </div>

            {/* Add Expense */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-200">
              <div className="flex items-center gap-3 mb-4">
                <Receipt className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Expense</h2>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Description (e.g., Dinner at restaurant)"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                
                <div className="flex gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                      <input
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={newExpense.paidBy}
                    onChange={(e) => setNewExpense({ ...newExpense, paidBy: parseInt(e.target.value) })}
                    className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                  >
                    {people.map(person => (
                      <option key={person.id} value={person.id}>
                        Paid by {person.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={addExpense}
                  disabled={!newExpense.description || !newExpense.amount}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Add Expense
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {/* Expenses List */}
            {expenses.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Expenses</h2>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {expenses.map(expense => (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {expense.description}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Paid by {people.find(p => p.id === expense.paidBy)?.name} • {expense.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600 dark:text-green-400">
                          ${expense.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeExpense(expense.id)}
                          className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition-colors duration-200">
              <div className="flex items-center gap-3 mb-4">
                <Calculator className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Summary</h2>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${totalAmount.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Expenses</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${perPersonShare.toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Per Person</div>
                  </div>
                </div>
                
                {totalAmount > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Who Owes What:</h3>
                    {balances.map(person => (
                      <div key={person.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {person.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Paid ${person.totalPaid.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          {person.owes > 0 ? (
                            <div className="text-red-600 dark:text-red-400 font-semibold">
                              Owes ${person.owes.toFixed(2)}
                            </div>
                          ) : person.shouldReceive > 0 ? (
                            <div className="text-green-600 dark:text-green-400 font-semibold">
                              Gets ${person.shouldReceive.toFixed(2)}
                            </div>
                          ) : (
                            <div className="text-gray-600 dark:text-gray-400 font-semibold">
                              Even
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Long Description */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 transition-colors duration-200">
          <div className="flex items-center gap-3 mb-6">
            <PiggyBank className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              About the Expense Splitter Tool
            </h2>
          </div>
          
          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Our free expense splitter tool makes it easy to split bills, share costs, and calculate who owes what in any group setting. 
              Whether you're planning a trip with friends, sharing household expenses with roommates, or splitting dinner bills, 
              this calculator ensures everyone pays their fair share.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Perfect For:</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Group trips and vacations</li>
                  <li>• Roommate expense sharing</li>
                  <li>• Restaurant bill splitting</li>
                  <li>• Party and event costs</li>
                  <li>• Office lunch orders</li>
                  <li>• Shared grocery shopping</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Key Features:</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>• Add unlimited people and expenses</li>
                  <li>• Real-time calculation updates</li>
                  <li>• Track who paid for what</li>
                  <li>• Clear summary of who owes whom</li>
                  <li>• Mobile-friendly design</li>
                  <li>• No registration required</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">How to Use:</h3>
              <ol className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>1. Add all people who will share the expenses</li>
                <li>2. Enter each expense with description, amount, and who paid</li>
                <li>3. View the automatic calculation showing who owes what</li>
                <li>4. Share the results with your group for easy settlement</li>
              </ol>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300">
              This expense sharing calculator automatically divides all costs equally among group members and shows the net amount 
              each person owes or should receive. It's the fastest way to ensure fair cost splitting without the hassle of 
              manual calculations or awkward money conversations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseSplitterTool;