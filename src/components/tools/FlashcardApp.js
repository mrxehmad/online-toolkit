import React, { useState, useEffect } from 'react';
import { 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiRotateCcw, 
  FiMaximize, 
  FiMinimize, 
  FiBook, 
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiSave,
  FiX
} from 'react-icons/fi';

const FlashcardApp = () => {
  const [flashcards, setFlashcards] = useState([
    {
      id: 1,
      front: "What is React?",
      back: "A JavaScript library for building user interfaces, maintained by Facebook.",
      category: "Programming",
      difficulty: "Beginner",
      starred: false
    },
    {
      id: 2,
      front: "What is useState?",
      back: "A React Hook that lets you add state to functional components.",
      category: "React",
      difficulty: "Intermediate",
      starred: true
    }
  ]);

  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [newCard, setNewCard] = useState({
    front: '',
    back: '',
    category: '',
    difficulty: 'Beginner'
  });

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {
        // Fallback to app fullscreen if browser doesn't support
        setIsFullscreen(true);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Simulate saving to localStorage (you can replace this with actual localStorage)
  const saveToStorage = (cards) => {
    // In a real app: localStorage.setItem('flashcards', JSON.stringify(cards));
    console.log('Saved to storage:', cards);
  };

  useEffect(() => {
    // In a real app: const saved = localStorage.getItem('flashcards');
    // if (saved) setFlashcards(JSON.parse(saved));
  }, []);

  const addFlashcard = (cardData) => {
    if (cardData.front.trim() && cardData.back.trim()) {
      const card = {
        ...cardData,
        id: Date.now(),
        starred: false
      };
      const updatedCards = [...flashcards, card];
      setFlashcards(updatedCards);
      saveToStorage(updatedCards);
      setShowAddModal(false);
    }
  };

  const editFlashcard = (cardData) => {
    if (cardData && cardData.front.trim() && cardData.back.trim()) {
      const updatedCards = flashcards.map(card =>
        card.id === cardData.id ? cardData : card
      );
      setFlashcards(updatedCards);
      saveToStorage(updatedCards);
      setShowEditModal(false);
      setEditingCard(null);
    }
  };

  const deleteFlashcard = (id) => {
    const updatedCards = flashcards.filter(card => card.id !== id);
    setFlashcards(updatedCards);
    saveToStorage(updatedCards);
    if (currentCard >= updatedCards.length) {
      setCurrentCard(Math.max(0, updatedCards.length - 1));
    }
  };

  const toggleStar = (id) => {
    const updatedCards = flashcards.map(card =>
      card.id === id ? { ...card, starred: !card.starred } : card
    );
    setFlashcards(updatedCards);
    saveToStorage(updatedCards);
  };

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  const CardModal = ({ show, onClose, card, onSave, title, isEdit = false }) => {
    const [localCard, setLocalCard] = useState(
      card || { front: '', back: '', category: '', difficulty: 'Beginner' }
    );

    // Only update local state when modal opens or card changes for edit mode
    useEffect(() => {
      if (show) {
        if (isEdit && card) {
          setLocalCard({ ...card });
        } else if (!isEdit) {
          setLocalCard({ front: '', back: '', category: '', difficulty: 'Beginner' });
        }
      }
    }, [show, card, isEdit]);

    const handleChange = (field, value) => {
      setLocalCard(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
      onSave(localCard);
    };

    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Front (Question)
                </label>
                <textarea
                  value={localCard.front || ''}
                  onChange={(e) => handleChange('front', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Enter your question..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Back (Answer)
                </label>
                <textarea
                  value={localCard.back || ''}
                  onChange={(e) => handleChange('back', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="3"
                  placeholder="Enter your answer..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={localCard.category || ''}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Math, Science"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={localCard.difficulty || 'Beginner'}
                    onChange={(e) => handleChange('difficulty', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 text-gray-600 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <FiSave size={16} />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <FiBook size={48} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No flashcards yet</h2>
          <p className="text-gray-500 mb-6">Create your first flashcard to start learning!</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <FiPlus size={16} />
            Create Flashcard
          </button>
        </div>
        
        <CardModal
          show={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={addFlashcard}
          title="Create New Flashcard"
          isEdit={false}
        />
      </div>
    );
  }

  const currentFlashcard = flashcards[currentCard];

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <FiBook size={16} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-800">Flashcard Learning</h1>
              <p className="text-xs text-gray-500">{flashcards.length} cards total</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <FiMinimize size={18} /> : <FiMaximize size={18} />}
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <FiPlus size={16} />
              <span className="hidden sm:inline">Add Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {/* Card Counter */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="text-sm text-gray-500">
              {currentCard + 1} of {flashcards.length}
            </span>
            <div className="flex items-center gap-1">
              {currentFlashcard.starred && <FiStar size={14} className="text-yellow-500 fill-current" />}
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                {currentFlashcard.difficulty}
              </span>
              {currentFlashcard.category && (
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                  {currentFlashcard.category}
                </span>
              )}
            </div>
          </div>
          <div className="w-32 h-1 bg-gray-200 rounded-full mx-auto">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentCard + 1) / flashcards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Flashcard */}
        <div className="w-full max-w-2xl mb-6">
          <div 
            className={`relative w-full h-80 sm:h-96 cursor-pointer transition-transform duration-500 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front */}
            <div 
              className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-2xl shadow-xl border border-gray-100 p-8 flex flex-col justify-center items-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-4 font-medium">QUESTION</div>
                <p className="text-lg sm:text-xl text-gray-800 leading-relaxed">
                  {currentFlashcard.front}
                </p>
              </div>
              <div className="absolute bottom-4 right-4 text-xs text-gray-400">
                Tap to reveal answer
              </div>
            </div>

            {/* Back */}
            <div 
              className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-8 flex flex-col justify-center items-center rotate-y-180"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="text-center">
                <div className="text-sm text-blue-100 mb-4 font-medium">ANSWER</div>
                <p className="text-lg sm:text-xl text-white leading-relaxed">
                  {currentFlashcard.back}
                </p>
              </div>
              <div className="absolute bottom-4 right-4 text-xs text-blue-200">
                Tap to see question
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={prevCard}
            className="p-3 bg-white text-gray-600 rounded-full shadow-lg hover:shadow-xl hover:text-blue-600 transition-all"
            disabled={flashcards.length <= 1}
          >
            <FiChevronLeft size={20} />
          </button>
          
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="px-6 py-3 bg-white text-gray-600 rounded-full shadow-lg hover:shadow-xl hover:text-blue-600 transition-all font-medium"
          >
            <FiRotateCcw size={16} className="inline mr-2" />
            Flip Card
          </button>
          
          <button
            onClick={nextCard}
            className="p-3 bg-white text-gray-600 rounded-full shadow-lg hover:shadow-xl hover:text-blue-600 transition-all"
            disabled={flashcards.length <= 1}
          >
            <FiChevronRight size={20} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <button
            onClick={() => toggleStar(currentFlashcard.id)}
            className={`p-2 rounded-lg transition-all ${currentFlashcard.starred 
              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            title={currentFlashcard.starred ? "Remove from favorites" : "Add to favorites"}
          >
            <FiStar size={16} className={currentFlashcard.starred ? 'fill-current' : ''} />
          </button>
          
          <button
            onClick={() => {
              setEditingCard({ ...currentFlashcard });
              setShowEditModal(true);
            }}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
            title="Edit card"
          >
            <FiEdit3 size={16} />
          </button>
          
          <button
            onClick={() => deleteFlashcard(currentFlashcard.id)}
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
            title="Delete card"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      {/* Modals */}
      <CardModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        card={newCard}
        onChange={setNewCard}
        onSave={addFlashcard}
        title="Create New Flashcard"
      />
      
      <CardModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        card={editingCard || {}}
        onChange={setEditingCard}
        onSave={editFlashcard}
        title="Edit Flashcard"
      />

      <style>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlashcardApp;