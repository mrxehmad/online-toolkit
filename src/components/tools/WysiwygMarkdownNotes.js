import React, { useEffect, useRef, useState, useCallback } from "react";

// iOS-Style WYSIWYG Markdown Notes App
// Features:
// - ContentEditable WYSIWYG editor with formatting toolbar
// - Converts HTML to Markdown for export/preview
// - Live preview rendered with custom markdown parser
// - Notes list with search, rename, delete
// - iOS-inspired design with blur effects and smooth animations
// - Keyboard shortcuts (Cmd/Ctrl+S to save)

// Simple markdown converter (replacement for turndown)
function htmlToMarkdown(html) {
  if (!html) return '';
  
  return html
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
    .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
    .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
    .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, content) => {
      const items = content.match(/<li[^>]*>(.*?)<\/li>/gi) || [];
      return items.map(item => `- ${item.replace(/<li[^>]*>(.*?)<\/li>/gi, '$1')}`).join('\n') + '\n\n';
    })
    .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

// Simple markdown to HTML converter
function markdownToHtml(markdown) {
  if (!markdown) return '';
  
  return markdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^- (.*$)/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.*)$/gm, '<p>$1</p>')
    .replace(/<p><\/p>/g, '')
    .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1')
    .replace(/<p>(<ul>.*<\/ul>)<\/p>/g, '$1');
}

export default function IOSNotesApp() {
  const [notes, setNotes] = useState([
    {
      id: '1',
      title: 'Welcome to iOS Notes',
      html: '<h2>Welcome!</h2><p>This is a beautiful iOS-inspired notes app with WYSIWYG editing.</p><ul><li>Rich text formatting</li><li>Markdown export</li><li>Search functionality</li></ul>',
      updatedAt: new Date().toISOString(),
    }
  ]);

  const [activeId, setActiveId] = useState('1');
  const [query, setQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const editorRef = useRef(null);

  // Save the active note's HTML content
  const updateActiveNote = useCallback((html) => {
    if (!activeId) return;
    setNotes(prev => prev.map(note =>
      note.id === activeId
        ? { ...note, html, updatedAt: new Date().toISOString() }
        : note
    ));
  }, [activeId]);

  // Save the active note (used in effects and toolbar)
  const saveActiveNote = useCallback(() => {
    if (!editorRef.current || !activeId) return;
    const html = editorRef.current.innerHTML;
    updateActiveNote(html);
    setSaveStatus('Saved');
    setTimeout(() => setSaveStatus(''), 2000);
  }, [activeId, updateActiveNote]);

  // Rename note title
  const renameNote = (newTitle) => {
    setNotes(prev => prev.map(note =>
      note.id === activeId ? { ...note, title: newTitle, updatedAt: new Date().toISOString() } : note
    ));
  };

  // Apply formatting to selected text in the editor
  const applyFormat = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      saveActiveNote();
    }
  };

  // Export current note as Markdown file
  const exportMarkdown = () => {
    const note = getActiveNote();
    if (!note) return;
    const markdown = htmlToMarkdown(note.html);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${note.title || 'note'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Delete a note by id
  const deleteNote = (id) => {
    setNotes(prev => {
      const filtered = prev.filter(note => note.id !== id);
      // If the active note is deleted, switch to the first note if available
      if (id === activeId && filtered.length > 0) {
        setActiveId(filtered[0].id);
      } else if (filtered.length === 0) {
        // If no notes left, create a new one
        createNote();
      }
      return filtered;
    });
  };

  // Auto-save effect
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      if (activeId && editorRef.current) {
        saveActiveNote();
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [notes, activeId, saveActiveNote]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveActiveNote();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [saveActiveNote]);

  const createNote = useCallback(() => {
    const id = Date.now().toString();
    const newNote = {
      id,
      title: 'New Note',
      html: '<p>Start typing...</p>',
      updatedAt: new Date().toISOString(),
    };
    
    setNotes(prev => [newNote, ...prev]);
    setActiveId(id);
    
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }, 100);
  }, []);

  const getActiveNote = useCallback(() => {
    return notes.find(note => note.id === activeId) || null;
  }, [notes, activeId]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('ios_notes');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setNotes(parsed);
          setActiveId(parsed[0].id);
        }
      } catch {}
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('ios_notes', JSON.stringify(notes));
  }, [notes]);


  const filteredNotes = notes.filter(note => {
    if (!query.trim()) return true;
    const searchTerm = query.toLowerCase();
    return note.title.toLowerCase().includes(searchTerm) || 
           note.html.toLowerCase().includes(searchTerm);
  });

  const activeNote = getActiveNote();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-12 gap-6 min-h-screen">
        {/* Sidebar */}
        <aside className="col-span-4 lg:col-span-3">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-6 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Notes
              </h1>
              <div className="flex items-center gap-2">
                {saveStatus && (
                  <span className="text-sm text-green-600 font-medium animate-fade-in">
                    {saveStatus}
                  </span>
                )}
                <button
                  onClick={createNote}
                  className="p-2 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all duration-200 hover:scale-105"
                >
                  +
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50/50 rounded-2xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => setActiveId(note.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                    note.id === activeId
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-50/50 hover:bg-gray-100/70 text-gray-800'
                  }`}
                >
                  <div className="font-semibold text-sm mb-1 truncate">
                    {note.title}
                  </div>
                  <div 
                    className={`text-xs line-clamp-2 ${
                      note.id === activeId ? 'text-white/80' : 'text-gray-500'
                    }`}
                    dangerouslySetInnerHTML={{ __html: note.html }}
                  />
                  <div className={`text-xs mt-2 ${
                    note.id === activeId ? 'text-white/60' : 'text-gray-400'
                  }`}>
                    {new Date(note.updatedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Editor */}
        <main className="col-span-8 lg:col-span-9">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 h-full flex flex-col">
            {/* Title Bar */}
            <div className="p-6 border-b border-gray-100">
              <input
                type="text"
                value={activeNote?.title || ''}
                onChange={(e) => renameNote(e.target.value)}
                placeholder="Note title..."
                className="text-2xl font-bold w-full bg-transparent border-0 focus:outline-none text-gray-800 placeholder-gray-400"
              />
              
              {/* Toolbar */}
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => applyFormat('bold')}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors font-bold text-sm"
                >
                  B
                </button>
                <button
                  onClick={() => applyFormat('italic')}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors italic text-sm"
                >
                  I
                </button>
                <button
                  onClick={() => applyFormat('insertUnorderedList')}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                >
                  • List
                </button>
                <button
                  onClick={() => applyFormat('formatBlock', 'h2')}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-bold"
                >
                  H2
                </button>
                <button
                  onClick={() => {
                    const url = prompt('Enter URL:');
                    if (url) applyFormat('createLink', url);
                  }}
                  className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm"
                >
                  🔗
                </button>
                
                <div className="h-4 w-px bg-gray-300 mx-2" />
                
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    showPreview ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  👁 Preview
                </button>
                
                <button
                  onClick={saveActiveNote}
                  className="p-2 rounded-xl bg-green-100 hover:bg-green-200 text-green-600 transition-colors text-sm"
                >
                  💾
                </button>
                
                <button
                  onClick={exportMarkdown}
                  className="p-2 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-600 transition-colors text-sm"
                >
                  📥
                </button>
                
                <button
                  onClick={() => deleteNote(activeId)}
                  className="p-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 transition-colors ml-auto text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Editor/Preview */}
            <div className="flex-1 p-6">
              {!showPreview ? (
                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => updateActiveNote(e.currentTarget.innerHTML)}
                  onBlur={saveActiveNote}
                  dangerouslySetInnerHTML={{ __html: activeNote?.html || '<p>Start typing...</p>' }}
                  className="w-full h-full outline-none prose prose-lg max-w-none focus:prose-blue prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-800 prose-em:text-gray-600 prose-ul:text-gray-700"
                  style={{ minHeight: '400px' }}
                />
              ) : (
                <div className="h-full overflow-y-auto">
                  <div className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700">
                    <div dangerouslySetInnerHTML={{ 
                      __html: markdownToHtml(htmlToMarkdown(activeNote?.html || '')) 
                    }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Help Button */}
      <button
        onClick={() => alert('Keyboard shortcuts:\n• Cmd/Ctrl+S - Save note\n• Use toolbar for formatting')}
        className="fixed bottom-6 right-6 w-12 h-12 bg-white/80 backdrop-blur-xl rounded-full shadow-xl border border-white/20 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
      >
        ?
      </button>
    </div>
  );
}