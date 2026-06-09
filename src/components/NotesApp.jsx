import { useState, useEffect } from 'react';

const CATEGORIES = ['Semua', 'Pribadi', 'Kerja', 'Belajar', 'Lainnya'];
const CATEGORY_COLORS = {
  Pribadi: { bg: '#FFF0F3', text: '#C0395A', border: '#F4A0B5' },
  Kerja:   { bg: '#EEF2FF', text: '#4338CA', border: '#A5B4FC' },
  Belajar: { bg: '#F0FDF4', text: '#15803D', border: '#86EFAC' },
  Lainnya: { bg: '#FFF7ED', text: '#C2410C', border: '#FDBA74' },
};

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function CharCounter({ value, max }) {
  const pct = value / max;
  const color = pct > 0.9 ? '#E24B4A' : pct > 0.7 ? '#EF9F27' : '#1D9E75';
  return (
    <span style={{ fontSize: '12px', color, fontFamily: 'monospace', userSelect: 'none' }}>
      {value}/{max}
    </span>
  );
}

function EmptyState({ search, category }) {
  return (
    <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--text-muted)' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>
        <i className="fas fa-note-sticky"></i>
      </div>
      <p style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 8px', color: 'var(--text-primary)' }}>
        {search ? 'Tidak ada catatan ditemukan' : category !== 'Semua' ? `Belum ada catatan ${category}` : 'Belum ada catatan'}
      </p>
      <p style={{ fontSize: '14px', margin: 0 }}>
        {search ? `Coba kata kunci lain untuk "${search}"` : 'Buat catatan baru dengan tombol + di atas'}
      </p>
    </div>
  );
}

function NoteCard({ note, onEdit, onDelete, onTogglePin, onToggleImportant }) {
  const catStyle = CATEGORY_COLORS[note.category] || {};
  return (
    <div style={{
      background: 'var(--card-bg)',
      border: '1px solid var(--card-border)',
      borderRadius: '16px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      position: 'relative',
      transition: 'box-shadow 0.2s, transform 0.15s',
      cursor: 'default',
      boxShadow: note.isPinned ? '0 0 0 2px #7F77DD' : '0 1px 3px rgba(0,0,0,0.06)',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = note.isPinned ? '0 4px 16px rgba(127,119,221,0.25)' : '0 4px 16px rgba(0,0,0,0.10)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = note.isPinned ? '0 0 0 2px #7F77DD' : '0 1px 3px rgba(0,0,0,0.06)'; }}
    >
      {note.isPinned && (
        <span style={{ position: 'absolute', top: '12px', right: '12px', color: '#7F77DD', fontSize: '14px' }}>
          <i className="fas fa-thumbtack"></i>
        </span>
      )}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', paddingRight: note.isPinned ? '28px' : '0' }}>
        <button onClick={() => onToggleImportant(note.id)} title="Tandai penting"
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '0', lineHeight: 1, flexShrink: 0, color: note.isImportant ? '#EF9F27' : '#ccc', transition: 'color 0.15s' }}>
          <i className="fas fa-star"></i>
        </button>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, flex: 1 }}>
          {note.title}
        </h3>
      </div>

      <p style={{
        margin: 0, fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.6,
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
      }}>
        {note.content}
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <span style={{
          fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '20px',
          background: catStyle.bg || '#F1EFE8', color: catStyle.text || '#5F5E5A',
          border: `1px solid ${catStyle.border || '#D3D1C7'}`,
        }}>
          {note.category}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {formatDate(note.updatedAt)}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginTop: '4px', borderTop: '1px solid var(--card-border)', paddingTop: '10px' }}>
        <button onClick={() => onTogglePin(note.id)}
          style={{ flex: 1, padding: '7px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: note.isPinned ? '#EEEDFE' : 'transparent', color: note.isPinned ? '#534AB7' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          <i className="fas fa-thumbtack" style={{ fontSize: '11px' }}></i>
          {note.isPinned ? 'Unpin' : 'Pin'}
        </button>
        <button onClick={() => onEdit(note)}
          style={{ flex: 1, padding: '7px', fontSize: '12px', borderRadius: '8px', border: '1px solid var(--card-border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          <i className="fas fa-pen" style={{ fontSize: '11px' }}></i>
          Edit
        </button>
        <button onClick={() => onDelete(note.id)}
          style={{ flex: 1, padding: '7px', fontSize: '12px', borderRadius: '8px', border: '1px solid #F7C1C1', background: 'transparent', color: '#A32D2D', cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
          <i className="fas fa-trash" style={{ fontSize: '11px' }}></i>
          Hapus
        </button>
      </div>
    </div>
  );
}

export default function NotesApp() {
  const [notes, setNotes] = useState(() => {
    try { const s = localStorage.getItem('notes_app_v2'); return s ? JSON.parse(s) : []; }
    catch { return []; }
  });
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('notes_darkmode') === 'true');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [form, setForm] = useState({ title: '', content: '', category: 'Pribadi', isImportant: false });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filterImportant, setFilterImportant] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const TITLE_MAX = 60;
  const CONTENT_MAX = 500;

  useEffect(() => {
    localStorage.setItem('notes_app_v2', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('notes_darkmode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.title = `Notes App — ${notes.length} catatan`;
    return () => { document.title = 'Notes App'; };
  }, [notes.length]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    const now = new Date().toISOString();
    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === editingNote.id
        ? { ...n, ...form, updatedAt: now }
        : n
      ));
    } else {
      const newNote = { id: Date.now(), ...form, isPinned: false, createdAt: now, updatedAt: now };
      setNotes(prev => [newNote, ...prev]);
    }
    handleCloseForm();
  }

  function handleDelete(id) {
    setNotes(prev => prev.filter(n => n.id !== id));
    setDeleteConfirm(null);
  }

  function handleEdit(note) {
    setEditingNote(note);
    setForm({ title: note.title, content: note.content, category: note.category, isImportant: note.isImportant });
    setShowForm(true);
    setSidebarOpen(false);
  }

  function handleCloseForm() {
    setShowForm(false);
    setEditingNote(null);
    setForm({ title: '', content: '', category: 'Pribadi', isImportant: false });
  }

  function togglePin(id) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n));
  }

  function toggleImportant(id) {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isImportant: !n.isImportant } : n));
  }

  const filtered = notes
    .filter(n => {
      const matchCat = activeCategory === 'Semua' || n.category === activeCategory;
      const matchSearch = search === '' || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase());
      const matchImportant = !filterImportant || n.isImportant;
      return matchCat && matchSearch && matchImportant;
    })
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (a.isImportant !== b.isImportant) return a.isImportant ? -1 : 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });

  const stats = {
    total: notes.length,
    pinned: notes.filter(n => n.isPinned).length,
    important: notes.filter(n => n.isImportant).length,
  };

  function exportNotes() {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'catatan.json'; a.click();
    URL.revokeObjectURL(url);
  }

  function importNotes(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (Array.isArray(data)) setNotes(prev => [...data, ...prev]);
      } catch { alert('File JSON tidak valid'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  const theme = darkMode ? {
    '--bg': '#111317', '--sidebar-bg': '#1A1D23', '--card-bg': '#1E2128',
    '--card-border': '#2D3139', '--text-primary': '#F0F2F5', '--text-secondary': '#9DA5B4',
    '--text-muted': '#636B7A', '--input-bg': '#1E2128', '--input-border': '#2D3139',
    '--accent': '#7F77DD', '--header-bg': '#1A1D23', '--overlay': 'rgba(0,0,0,0.6)',
  } : {
    '--bg': '#F3F4F8', '--sidebar-bg': '#FFFFFF', '--card-bg': '#FFFFFF',
    '--card-border': '#E8EAF0', '--text-primary': '#1A1D23', '--text-secondary': '#555C6E',
    '--text-muted': '#9DA5B4', '--input-bg': '#FFFFFF', '--input-border': '#DDE0E8',
    '--accent': '#534AB7', '--header-bg': '#FFFFFF', '--overlay': 'rgba(0,0,0,0.3)',
  };

  const css = `
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', 'Inter', sans-serif; }
    .notes-app { display: flex; height: 100vh; background: var(--bg); color: var(--text-primary); overflow: hidden; }
    .sidebar { width: 260px; background: var(--sidebar-bg); border-right: 1px solid var(--card-border); display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto; z-index: 10; }
    .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .topbar { background: var(--header-bg); border-bottom: 1px solid var(--card-border); padding: 14px 20px; display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
    .notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; padding: 20px; overflow-y: auto; flex: 1; align-content: start; }
    .form-overlay { position: fixed; inset: 0; background: var(--overlay); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .form-card { background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 20px; padding: 28px; width: 100%; max-width: 520px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
    input, textarea, select { background: var(--input-bg); border: 1px solid var(--input-border); border-radius: 10px; padding: 10px 14px; font-size: 14px; color: var(--text-primary); width: 100%; outline: none; font-family: inherit; transition: border-color 0.2s; }
    input:focus, textarea:focus, select:focus { border-color: var(--accent); }
    textarea { resize: vertical; line-height: 1.6; }
    button { font-family: inherit; cursor: pointer; }
    .btn-primary { background: var(--accent); color: #fff; border: none; border-radius: 10px; padding: 10px 20px; font-size: 14px; font-weight: 700; transition: opacity 0.15s, transform 0.1s; }
    .btn-primary:hover { opacity: 0.88; }
    .btn-primary:active { transform: scale(0.97); }
    .btn-ghost { background: transparent; border: 1px solid var(--card-border); border-radius: 10px; padding: 10px 16px; font-size: 14px; color: var(--text-secondary); transition: background 0.15s; }
    .btn-ghost:hover { background: var(--card-border); }
    .cat-btn { width: 100%; text-align: left; background: transparent; border: none; padding: 9px 16px; border-radius: 10px; font-size: 14px; color: var(--text-secondary); transition: all 0.15s; display: flex; align-items: center; justify-content: space-between; }
    .cat-btn.active { background: #EEEDFE; color: #534AB7; font-weight: 700; }
    .delete-modal { position: fixed; inset: 0; background: var(--overlay); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
    .delete-card { background: var(--card-bg); border-radius: 16px; padding: 24px; max-width: 340px; width: 100%; text-align: center; }
    .search-wrap { position: relative; flex: 1; }
    .search-wrap input { padding-left: 36px; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 14px; pointer-events: none; color: var(--text-muted); }
    @media (max-width: 768px) {
      .sidebar { position: fixed; top: 0; left: 0; bottom: 0; transform: translateX(-100%); transition: transform 0.3s; z-index: 50; }
      .sidebar.open { transform: translateX(0); box-shadow: 4px 0 24px rgba(0,0,0,0.15); }
      .sidebar-overlay { display: block !important; }
      .notes-grid { grid-template-columns: 1fr; padding: 14px; gap: 12px; }
      .topbar { padding: 12px 14px; }
      .menu-btn { display: flex !important; }
    }
    @media (min-width: 769px) {
      .menu-btn { display: none !important; }
      .sidebar-overlay { display: none !important; }
    }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }
    .form-card, .delete-card { animation: fadeIn 0.2s ease; }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="notes-app" style={theme}>

        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}
            style={{ display: 'none', position: 'fixed', inset: 0, background: theme['--overlay'], zIndex: 40 }} />
        )}

        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div style={{ padding: '13px 13px', borderBottom: `1px solid ${theme['--card-border']}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-book" style={{ fontSize: '22px', color: theme['--accent'] }}></i>
              <span style={{ fontWeight: 800, fontSize: '17px', color: theme['--accent'] }}>Notes App</span>
            </div>
            <p style={{ fontSize: '12px', color: theme['--text-muted'], marginTop: '4px' }}>Simpan ide & catatan kamu</p>
          </div>

          <div style={{ padding: '12px 16px', display: 'flex', gap: '8px', borderBottom: `1px solid ${theme['--card-border']}` }}>
            {[
              ['fa-file-lines', stats.total, 'Total'],
              ['fa-thumbtack', stats.pinned, 'Pin'],
              ['fa-star', stats.important, 'Penting']
            ].map(([icon, val, label]) => (
              <div key={label} style={{ flex: 1, background: darkMode ? '#252830' : '#F8F9FF', borderRadius: '10px', padding: '8px 6px', textAlign: 'center' }}>
                <i className={`fas ${icon}`} style={{ fontSize: '14px', color: theme['--accent'] }}></i>
                <div style={{ fontWeight: 800, fontSize: '16px', color: theme['--accent'] }}>{val}</div>
                <div style={{ fontSize: '10px', color: theme['--text-muted'] }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ padding: '12px 8px', flex: 1 }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: theme['--text-muted'], padding: '0 8px 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Kategori</p>
            {CATEGORIES.map(cat => {
              const count = cat === 'Semua' ? notes.length : notes.filter(n => n.category === cat).length;
              return (
                <button key={cat} className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => { setActiveCategory(cat); setSidebarOpen(false); }}>
                  <span>{cat}</span>
                  <span style={{ fontSize: '12px', background: activeCategory === cat ? 'rgba(83,74,183,0.15)' : darkMode ? '#2D3139' : '#F1EFE8', borderRadius: '20px', padding: '2px 8px', fontWeight: 700 }}>{count}</span>
                </button>
              );
            })}

            <div style={{ height: '1px', background: theme['--card-border'], margin: '12px 8px' }} />
            <p style={{ fontSize: '11px', fontWeight: 700, color: theme['--text-muted'], padding: '0 8px 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Filter</p>
            <button className={`cat-btn ${filterImportant ? 'active' : ''}`} onClick={() => setFilterImportant(p => !p)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-star" style={{ fontSize: '13px', color: '#EF9F27' }}></i>
                Hanya Penting
              </span>
            </button>

            <div style={{ height: '1px', background: theme['--card-border'], margin: '12px 8px' }} />
            <p style={{ fontSize: '11px', fontWeight: 700, color: theme['--text-muted'], padding: '0 8px 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Data</p>
            <button className="cat-btn" onClick={exportNotes}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-file-export" style={{ fontSize: '13px' }}></i>
                Export JSON
            </span>
            </button>
            <label className="cat-btn" style={{ cursor: 'pointer' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-file-import" style={{ fontSize: '13px' }}></i>
                Import JSON
            </span>
            <input type="file" accept=".json" onChange={importNotes} style={{ display: 'none' }} />
            </label>
          </div>

          <div style={{ padding: '12px 16px', borderTop: `1px solid ${theme['--card-border']}` }}>
            <button onClick={() => setDarkMode(p => !p)}
              style={{ width: '100%', padding: '10px', borderRadius: '10px', border: `1px solid ${theme['--card-border']}`, background: 'transparent', color: theme['--text-secondary'], fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.15s' }}>
              <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`}></i>
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="main">
          <div className="topbar">
            <button className="menu-btn" onClick={() => setSidebarOpen(p => !p)}
              style={{ background: 'none', border: `1px solid ${theme['--card-border']}`, borderRadius: '8px', padding: '8px 10px', fontSize: '16px', color: theme['--text-secondary'], display: 'none' }}>
              <i className="fas fa-bars"></i>
            </button>
            <div className="search-wrap">
              <i className="fas fa-magnifying-glass search-icon"></i>
              <input type="text" placeholder="Cari catatan..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn-primary" onClick={() => { handleCloseForm(); setShowForm(true); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', padding: '10px 16px' }}>
              <i className="fas fa-plus"></i>
              Baru
            </button>
          </div>

          <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: theme['--text-primary'] }}>
                {filterImportant ? 'Catatan Penting' : activeCategory === 'Semua' ? 'Semua Catatan' : activeCategory}
              </h2>
              <p style={{ fontSize: '13px', color: theme['--text-muted'], marginTop: '2px' }}>
                {filtered.length} catatan{search && ` · pencarian "${search}"`}
              </p>
            </div>
          </div>

          <div className="notes-grid">
            {filtered.length === 0
              ? <div style={{ gridColumn: '1 / -1' }}><EmptyState search={search} category={activeCategory} /></div>
              : filtered.map(note => (
                <NoteCard key={note.id} note={note}
                  onEdit={handleEdit}
                  onDelete={(id) => setDeleteConfirm(id)}
                  onTogglePin={togglePin}
                  onToggleImportant={toggleImportant}
                />
              ))
            }
          </div>
        </main>

        {/* Form Modal */}
        {showForm && (
          <div className="form-overlay" onClick={e => { if (e.target === e.currentTarget) handleCloseForm(); }}>
            <div className="form-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: theme['--text-primary'] }}>
                  <i className="fas fa-pen-to-square" style={{ marginRight: '8px', color: theme['--accent'] }}></i>
                  {editingNote ? 'Edit Catatan' : 'Catatan Baru'}
                </h2>
                <button onClick={handleCloseForm}
                  style={{ background: 'none', border: 'none', fontSize: '18px', color: theme['--text-muted'], cursor: 'pointer' }}>
                  <i className="fas fa-xmark"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: theme['--text-secondary'] }}>Judul Catatan</label>
                    <CharCounter value={form.title.length} max={TITLE_MAX} />
                  </div>
                  <input type="text" placeholder="Judul catatan..." value={form.title} maxLength={TITLE_MAX}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: theme['--text-secondary'] }}>Isi Catatan</label>
                    <CharCounter value={form.content.length} max={CONTENT_MAX} />
                  </div>
                  <textarea placeholder="Tulis catatan di sini..." value={form.content} maxLength={CONTENT_MAX} rows={5}
                    onChange={e => setForm(p => ({ ...p, content: e.target.value }))} required />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: theme['--text-secondary'], display: 'block', marginBottom: '6px' }}>Kategori</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.filter(c => c !== 'Semua').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '10px 14px', border: `1px solid ${theme['--card-border']}`, borderRadius: '10px' }}>
                  <input type="checkbox" checked={form.isImportant} onChange={e => setForm(p => ({ ...p, isImportant: e.target.checked }))}
                    style={{ width: '18px', height: '18px', accentColor: '#EF9F27' }} />
                  <span style={{ fontSize: '14px', color: theme['--text-primary'], display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fas fa-star" style={{ color: '#EF9F27' }}></i>
                    Tandai sebagai catatan penting
                  </span>
                </label>

                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button type="button" className="btn-ghost" onClick={handleCloseForm} style={{ flex: 1 }}>
                    Batal
                  </button>
                  <button type="submit" className="btn-primary" style={{ flex: 2 }}>
                    {editingNote ? 'Simpan Perubahan' : 'Tambah Catatan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirm */}
        {deleteConfirm && (
          <div className="delete-modal">
            <div className="delete-card">
              <i className="fas fa-trash-can" style={{ fontSize: '36px', color: '#A32D2D', marginBottom: '12px' }}></i>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: theme['--text-primary'], marginBottom: '8px' }}>Hapus Catatan?</h3>
              <p style={{ fontSize: '13px', color: theme['--text-muted'], marginBottom: '20px' }}>Catatan yang dihapus tidak bisa dikembalikan.</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn-ghost" onClick={() => setDeleteConfirm(null)} style={{ flex: 1 }}>Batal</button>
                <button className="btn-primary" onClick={() => handleDelete(deleteConfirm)}
                  style={{ flex: 1, background: '#A32D2D' }}>Hapus</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}