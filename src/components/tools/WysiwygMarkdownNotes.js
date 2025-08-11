import React, { useState, useRef, useEffect } from 'react';

const NotesApp = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: 'Welcome to Notes',
      content: 'This is your first note! Tap to edit or create a new one with the + button.',
      date: new Date().toISOString(),
      preview: 'This is your first note! Tap to edit...'
    }
  ]);
  const [currentNote, setCurrentNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const createNewNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'New Note',
      content: '',
      date: new Date().toISOString(),
      preview: ''
    };
    setNotes(prev => [newNote, ...prev]);
    setCurrentNote(newNote);
    setIsEditing(true);
  };

  const updateNote = (id, updates) => {
    setNotes(prev => prev.map(note => {
      if (note.id === id) {
        const updated = { ...note, ...updates, date: new Date().toISOString() };
        // Generate title from first line if content exists
        if (updates.content !== undefined) {
          const firstLine = updates.content.split('\n')[0].trim();
          updated.title = firstLine || 'New Note';
          updated.preview = updates.content.length > 50 
            ? updates.content.substring(0, 50) + '...' 
            : updates.content;
        }
        return updated;
      }
      return note;
    }));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (currentNote?.id === id) {
      setCurrentNote(null);
      setIsEditing(false);
    }
  };

  const selectNote = (note) => {
    setCurrentNote(note);
    setIsEditing(false);
  };

  const startEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 100);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  // Notes List View
  if (!currentNote) {
    return (
      <div className="w-full bg-white min-h-screen">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-10">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
              <button
                onClick={createNewNote}
                className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-sm active:scale-95 transition-transform"
              >
                <span className="text-white text-lg font-bold">+</span>
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="px-4 py-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-2">
                <span className="text-6xl opacity-50">📝</span>
              </div>
              <p className="text-gray-500 text-lg">No notes yet</p>
              <p className="text-gray-400 text-sm mt-1">Tap + to create your first note</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => selectNote(note)}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100 active:scale-98 active:bg-gray-50 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-semibold text-gray-900 truncate flex-1 mr-2">
                    {note.title}
                  </h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatDate(note.date)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                  {note.preview || note.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Note Detail View
  return (
    <div className="w-full bg-white min-h-screen">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-xl border-b border-gray-100 z-10">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => {
              setCurrentNote(null);
              setIsEditing(false);
            }}
            className="flex items-center text-blue-500 active:text-blue-700 transition-colors"
          >
            <span className="text-xl">‹</span>
            <span className="ml-1 font-medium">Notes</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <button className="text-blue-500 active:text-blue-700 transition-colors text-lg">
              📤
            </button>
            <button
              onClick={() => deleteNote(currentNote.id)}
              className="text-red-500 active:text-red-700 transition-colors text-lg"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {/* Note Content */}
      <div className="p-4 h-full">
        <div className="mb-2 text-xs text-gray-500 text-center">
          {formatDate(currentNote.date)}
        </div>
        
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={currentNote.content}
            onChange={(e) => {
              updateNote(currentNote.id, { content: e.target.value });
              setCurrentNote(prev => ({ ...prev, content: e.target.value }));
            }}
            onBlur={() => setIsEditing(false)}
            placeholder="Start writing..."
            className="w-full h-96 resize-none border-none outline-none text-gray-900 text-lg leading-relaxed placeholder-gray-400 bg-transparent"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Text, system-ui, sans-serif' }}
          />
        ) : (
          <div
            onClick={startEditing}
            className="w-full h-96 text-gray-900 text-lg leading-relaxed cursor-text whitespace-pre-wrap"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, SF Pro Text, system-ui, sans-serif' }}
          >
            {currentNote.content || (
              <span className="text-gray-400">Tap to start writing...</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesApp;