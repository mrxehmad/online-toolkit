import React, { useEffect, useRef, useState } from "react";
import TurndownService from "turndown";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Single-file WYSIWYG Markdown Notes App (React + Tailwind)
// Features:
// - ContentEditable WYSIWYG editor (format toolbar using document.execCommand)
// - Converts the editor's HTML to Markdown using turndown for export/preview
// - Live preview rendered with react-markdown
// - Notes list (localStorage) with autosave and export (.md download)
// - Search, rename, delete, keyboard shortcuts (Cmd/Ctrl+S to save)

export default function WysiwygMarkdownNotes() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wm_notes_v1")) || [];
    } catch (e) {
      return [];
    }
  });

  const [activeId, setActiveId] = useState(() => {
    const raw = localStorage.getItem("wm_active_id_v1");
    return raw || (notes[0] && notes[0].id) || null;
  });

  const [query, setQuery] = useState("");
  const editorRef = useRef(null);
  const turndownRef = useRef(null);

  useEffect(() => {
    turndownRef.current = new TurndownService({ headingStyle: "atx" });
  }, []);

  useEffect(() => {
    localStorage.setItem("wm_notes_v1", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    if (activeId) localStorage.setItem("wm_active_id_v1", activeId);
  }, [activeId]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveActiveNote();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notes, activeId]);

  function createNote() {
    const id = String(Date.now());
    const newNote = {
      id,
      title: "Untitled",
      html: "<p><br></p>",
      updatedAt: new Date().toISOString(),
    };
    setNotes((s) => [newNote, ...s]);
    setActiveId(id);
    // focus editor next tick
    setTimeout(() => placeCaretAtEnd(editorRef.current), 50);
  }

  function placeCaretAtEnd(el) {
    if (!el) return;
    el.focus();
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function updateActiveHtml(html) {
    setNotes((old) =>
      old.map((n) => (n.id === activeId ? { ...n, html, updatedAt: new Date().toISOString() } : n))
    );
  }

  function getActive() {
    return notes.find((n) => n.id === activeId) || null;
  }

  function saveActiveNote() {
    const html = editorRef.current?.innerHTML || "<p><br></p>";
    updateActiveHtml(html);
    // quick toast-like feedback
    flashSaved();
  }

  function flashSaved() {
    const el = document.getElementById("save-pulse");
    if (!el) return;
    el.classList.remove("opacity-0");
    setTimeout(() => el.classList.add("opacity-0"), 900);
  }

  function applyCommand(cmd, value = null) {
    document.execCommand(cmd, false, value);
    // sync to state
    const html = editorRef.current?.innerHTML || "<p><br></p>";
    updateActiveHtml(html);
  }

  function exportMarkdown() {
    const html = editorRef.current?.innerHTML || "";
    const md = turndownRef.current.turndown(html);
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (getActive()?.title || "note") + ".md";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportHTML() {
    const html = editorRef.current?.innerHTML || "";
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = (getActive()?.title || "note") + ".html";
    a.click();
    URL.revokeObjectURL(url);
  }

  function deleteNote(id) {
    const idx = notes.findIndex((n) => n.id === id);
    if (idx === -1) return;
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    if (activeId === id) setActiveId(next[0]?.id || null);
  }

  function renameActive(newTitle) {
    setNotes((old) => old.map((n) => (n.id === activeId ? { ...n, title: newTitle } : n)));
  }

  const filtered = notes.filter((n) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (n.title || "").toLowerCase().includes(q) || (n.html || "").toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-3 bg-white rounded-2xl shadow-sm p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">Notes</h2>
            <div id="save-pulse" className="ml-auto transition-opacity opacity-0 text-sm text-green-600">Saved ✓</div>
          </div>

          <div className="flex gap-2 mb-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="flex-1 px-3 py-2 rounded-lg border" />
            <button onClick={createNote} className="px-3 py-2 rounded-lg bg-indigo-600 text-white">New</button>
          </div>

          <div className="overflow-auto flex-1">
            {filtered.length === 0 && <div className="text-sm text-neutral-500">No notes</div>}
            <ul className="space-y-2">
              {filtered.map((n) => (
                <li key={n.id} className={`p-2 rounded-lg cursor-pointer flex items-start gap-2 ${n.id === activeId ? "bg-indigo-50 border border-indigo-100" : "hover:bg-neutral-50"}`} onClick={() => { setActiveId(n.id); setTimeout(()=>{ if(editorRef.current) editorRef.current.innerHTML = n.html; },20); }}>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{n.title}</div>
                    <div className="text-xs text-neutral-500 line-clamp-2" dangerouslySetInnerHTML={{ __html: n.html }} />
                  </div>
                  <div className="text-xs text-neutral-400">{new Date(n.updatedAt).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 flex gap-2">
            <button onClick={() => { navigator.clipboard.writeText(JSON.stringify(notes, null, 2)); }} className="flex-1 px-3 py-2 border rounded-lg text-sm">Copy JSON</button>
            <button onClick={() => { localStorage.removeItem("wm_notes_v1"); setNotes([]); setActiveId(null); }} className="px-3 py-2 rounded-lg border text-sm">Clear</button>
          </div>
        </aside>

        {/* Main editor area */}
        <main className="col-span-9 grid grid-rows-[auto_1fr] gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
            <input
              value={getActive()?.title || ""}
              onChange={(e) => renameActive(e.target.value)}
              placeholder="Untitled"
              className="text-xl font-semibold flex-1 bg-transparent outline-none"
            />

            <div className="flex items-center gap-2">
              <button onClick={() => applyCommand("bold")} className="px-3 py-2 rounded-lg border">B</button>
              <button onClick={() => applyCommand("italic")} className="px-3 py-2 rounded-lg border">I</button>
              <button onClick={() => applyCommand("insertUnorderedList")} className="px-3 py-2 rounded-lg border">• List</button>
              <button onClick={() => applyCommand("formatBlock", "H2")} className="px-3 py-2 rounded-lg border">H2</button>
              <button onClick={() => applyCommand("createLink", prompt("URL"))} className="px-3 py-2 rounded-lg border">Link</button>

              <div className="border-l h-6" />

              <button onClick={saveActiveNote} className="px-3 py-2 rounded-lg bg-green-600 text-white">Save</button>
              <button onClick={exportMarkdown} className="px-3 py-2 rounded-lg border">Export .md</button>
              <button onClick={exportHTML} className="px-3 py-2 rounded-lg border">Export .html</button>
              <button onClick={() => deleteNote(activeId)} className="px-3 py-2 rounded-lg border text-red-600">Delete</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <section className="bg-white p-4 rounded-2xl shadow-sm">
              <div className="text-xs text-neutral-500 mb-2">Editor (WYSIWYG)</div>
              <div
                ref={editorRef}
                className="min-h-[420px] outline-none leading-relaxed prose max-w-none"
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => updateActiveHtml(e.currentTarget.innerHTML)}
                onBlur={() => saveActiveNote()}
                dangerouslySetInnerHTML={{ __html: getActive()?.html || "<p><br></p>" }}
                style={{ whiteSpace: "pre-wrap" }}
              />
            </section>

            <section className="bg-white p-4 rounded-2xl shadow-sm overflow-auto">
              <div className="text-xs text-neutral-500 mb-2">Markdown preview (generated from editor HTML)</div>
              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{turndownRef.current?.turndown(getActive()?.html || "") || ""}</ReactMarkdown>
              </div>
            </section>
          </div>
        </main>
      </div>

      <div className="fixed bottom-6 right-6"> 
        <button onClick={() => { alert('Keyboard shortcuts:\n - Cmd/Ctrl+S = Save'); }} className="px-3 py-2 rounded-full bg-neutral-100 border">?</button>
      </div>
    </div>
  );
}


