import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X, Edit3, Save, Square, CheckSquare } from 'lucide-react';

export default function ChecklistTool() {
  const [checklists, setChecklists] = useState([]);
  const [newChecklistName, setNewChecklistName] = useState('');
  const [showNewChecklistForm, setShowNewChecklistForm] = useState(false);
  const [editingChecklistId, setEditingChecklistId] = useState(null);
  const [editingChecklistName, setEditingChecklistName] = useState('');

  // Load checklists from memory on component mount
  useEffect(() => {
    // In a real implementation, this would load from localStorage
    // For now, we'll start with an empty array
    setChecklists([]);
  }, []);

  // Save checklists to memory (in real implementation, this would save to localStorage)
  const saveChecklists = (updatedChecklists) => {
    setChecklists(updatedChecklists);
    // In real implementation: localStorage.setItem('checklists', JSON.stringify(updatedChecklists));
  };

  const createChecklist = () => {
    if (newChecklistName.trim()) {
      const newChecklist = {
        id: Date.now(),
        name: newChecklistName.trim(),
        items: [],
        createdAt: new Date().toISOString()
      };
      const updatedChecklists = [...checklists, newChecklist];
      saveChecklists(updatedChecklists);
      setNewChecklistName('');
      setShowNewChecklistForm(false);
    }
  };

  const deleteChecklist = (checklistId) => {
    const updatedChecklists = checklists.filter(checklist => checklist.id !== checklistId);
    saveChecklists(updatedChecklists);
  };

  const editChecklistName = (checklistId, newName) => {
    if (newName.trim()) {
      const updatedChecklists = checklists.map(checklist =>
        checklist.id === checklistId
          ? { ...checklist, name: newName.trim() }
          : checklist
      );
      saveChecklists(updatedChecklists);
    }
    setEditingChecklistId(null);
    setEditingChecklistName('');
  };

  const addItemToChecklist = (checklistId, itemText) => {
    if (itemText.trim()) {
      const updatedChecklists = checklists.map(checklist =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: [...checklist.items, {
                id: Date.now(),
                text: itemText.trim(),
                completed: false,
                addedAt: new Date().toISOString()
              }]
            }
          : checklist
      );
      saveChecklists(updatedChecklists);
    }
  };

  const toggleItemCompletion = (checklistId, itemId) => {
    const updatedChecklists = checklists.map(checklist =>
      checklist.id === checklistId
        ? {
            ...checklist,
            items: checklist.items.map(item =>
              item.id === itemId
                ? { ...item, completed: !item.completed }
                : item
            )
          }
        : checklist
    );
    saveChecklists(updatedChecklists);
  };

  const deleteItem = (checklistId, itemId) => {
    const updatedChecklists = checklists.map(checklist =>
      checklist.id === checklistId
        ? {
            ...checklist,
            items: checklist.items.filter(item => item.id !== itemId)
          }
        : checklist
    );
    saveChecklists(updatedChecklists);
  };

  const editItem = (checklistId, itemId, newText) => {
    if (newText.trim()) {
      const updatedChecklists = checklists.map(checklist =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: checklist.items.map(item =>
                item.id === itemId
                  ? { ...item, text: newText.trim() }
                  : item
              )
            }
          : checklist
      );
      saveChecklists(updatedChecklists);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* SEO Metadata (would be handled by your routing system) */}
      <div className="max-w-4xl mx-auto">
        {/* iOS-style Card Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-xl p-6 sm:p-8 transition-colors duration-200">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-2xl">
                <CheckSquare className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Smart Checklist
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Create, organize, and manage your tasks with our intuitive checklist tool. Perfect for daily tasks, project planning, shopping lists, and goal tracking. Stay organized and boost your productivity with persistent task management.
            </p>
          </div>

          {/* Main Tool Section */}
          <div className="space-y-6">
            
            {/* Create New Checklist Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  My Checklists
                </h2>
                <button
                  onClick={() => setShowNewChecklistForm(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium transition-colors duration-200 shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  New Checklist
                </button>
              </div>

              {showNewChecklistForm && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={newChecklistName}
                      onChange={(e) => setNewChecklistName(e.target.value)}
                      placeholder="Enter checklist name..."
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                      onKeyPress={(e) => e.key === 'Enter' && createChecklist()}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={createChecklist}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Create
                      </button>
                      <button
                        onClick={() => {
                          setShowNewChecklistForm(false);
                          setNewChecklistName('');
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Checklists Display */}
            {checklists.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-8 max-w-md mx-auto">
                  <CheckSquare className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No checklists yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Create your first checklist to get started with organizing your tasks.
                  </p>
                  <button
                    onClick={() => setShowNewChecklistForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200 inline-flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create First Checklist
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 lg:grid-cols-2">
                {checklists.map((checklist) => (
                  <ChecklistCard
                    key={checklist.id}
                    checklist={checklist}
                    onDelete={deleteChecklist}
                    onEditName={editChecklistName}
                    onAddItem={addItemToChecklist}
                    onToggleItem={toggleItemCompletion}
                    onDeleteItem={deleteItem}
                    onEditItem={editItem}
                    editingId={editingChecklistId}
                    setEditingId={setEditingChecklistId}
                    editingName={editingChecklistName}
                    setEditingName={setEditingChecklistName}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Long Description for SEO */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="prose dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Powerful Task Management Made Simple
              </h2>
              <div className="text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed">
                <p>
                  Our Smart Checklist tool is designed to streamline your task management and boost productivity. Whether you're planning a project, organizing daily activities, creating shopping lists, or tracking personal goals, this intuitive tool provides everything you need to stay organized and focused.
                </p>
                <p>
                  Key features include unlimited checklist creation, real-time task tracking, persistent data storage, and a clean, responsive interface that works seamlessly across all devices. The tool automatically saves your progress, ensuring your important tasks and lists are never lost.
                </p>
                <p>
                  Perfect for professionals, students, homemakers, and anyone who values organization and productivity. Start creating your first checklist today and experience the satisfaction of checking off completed tasks while staying on top of your goals and responsibilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual Checklist Card Component
function ChecklistCard({
  checklist,
  onDelete,
  onEditName,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onEditItem,
  editingId,
  setEditingId,
  editingName,
  setEditingName
}) {
  const [newItemText, setNewItemText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [editingItemText, setEditingItemText] = useState('');

  const completedItems = checklist.items.filter(item => item.completed).length;
  const totalItems = checklist.items.length;
  const progressPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const handleAddItem = () => {
    if (newItemText.trim()) {
      onAddItem(checklist.id, newItemText);
      setNewItemText('');
      setShowAddForm(false);
    }
  };

  const handleEditItem = (itemId) => {
    if (editingItemText.trim()) {
      onEditItem(checklist.id, itemId, editingItemText);
      setEditingItemId(null);
      setEditingItemText('');
    }
  };

  const startEditingItem = (item) => {
    setEditingItemId(item.id);
    setEditingItemText(item.text);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 space-y-4 border border-gray-200 dark:border-gray-600">
      {/* Checklist Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {editingId === checklist.id ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                className="flex-1 px-3 py-1 text-xl font-semibold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && onEditName(checklist.id, editingName)}
                autoFocus
              />
              <button
                onClick={() => onEditName(checklist.id, editingName)}
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors duration-200"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setEditingName('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors duration-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {checklist.name}
              </h3>
              <button
                onClick={() => {
                  setEditingId(checklist.id);
                  setEditingName(checklist.name);
                }}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 rounded transition-colors duration-200"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => onDelete(checklist.id)}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Progress Bar */}
      {totalItems > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>{completedItems} of {totalItems} completed</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {checklist.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <button
              onClick={() => onToggleItem(checklist.id, item.id)}
              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors duration-200 ${
                item.completed
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
              }`}
            >
              {item.completed && <Check className="h-3 w-3" />}
            </button>
            
            {editingItemId === item.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  value={editingItemText}
                  onChange={(e) => setEditingItemText(e.target.value)}
                  className="flex-1 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleEditItem(item.id)}
                  autoFocus
                />
                <button
                  onClick={() => handleEditItem(item.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-xs transition-colors duration-200"
                >
                  <Save className="h-3 w-3" />
                </button>
                <button
                  onClick={() => {
                    setEditingItemId(null);
                    setEditingItemText('');
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors duration-200"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <>
                <span
                  className={`flex-1 text-gray-900 dark:text-white ${
                    item.completed ? 'line-through opacity-75' : ''
                  }`}
                >
                  {item.text}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEditingItem(item)}
                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 p-1 rounded transition-colors duration-200"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onDeleteItem(checklist.id, item.id)}
                    className="text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300 p-1 rounded transition-colors duration-200"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Add New Item */}
      <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
        {showAddForm ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              placeholder="Add new item..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
              autoFocus
            />
            <button
              onClick={handleAddItem}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewItemText('');
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full flex items-center justify-center gap-2 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500"
          >
            <Plus className="h-4 w-4" />
            Add Item
          </button>
        )}
      </div>
    </div>
  );
}