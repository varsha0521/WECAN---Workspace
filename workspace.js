/* =========================================================
   WECAN — workspace.js
   App shell: view routing, sidebar, dashboard, documents,
   notes, settings, command palette.
   ========================================================= */

const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/></svg>',
  ai: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/><circle cx="12" cy="12" r="3.2"/></svg>',
  projects: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="7" height="7" rx="1.4"/><rect x="14" y="4" width="7" height="7" rx="1.4"/><rect x="3" y="15" width="7" height="5" rx="1.4"/><rect x="14" y="15" width="7" height="5" rx="1.4"/></svg>',
  tasks: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
  documents: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/></svg>',
  notes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 5a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M8 12h8M8 16h5"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.9 2.9l-.1-.1a1.7 1.7 0 00-1.9-.3 1.7 1.7 0 00-1 1.6V21a2 2 0 01-4 0v-.2a1.7 1.7 0 00-1-1.6 1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.9-2.9l.1-.1a1.7 1.7 0 00.3-1.9 1.7 1.7 0 00-1.6-1H3a2 2 0 010-4h.2a1.7 1.7 0 001.6-1 1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.9-2.9l.1.1a1.7 1.7 0 001.9.3H9a1.7 1.7 0 001-1.6V3a2 2 0 014 0v.2a1.7 1.7 0 001 1.6 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.9 2.9l-.1.1a1.7 1.7 0 00-.3 1.9V9a1.7 1.7 0 001.6 1H21a2 2 0 010 4h-.2a1.7 1.7 0 00-1.6 1z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.1 6.7L22 9.6l-5 4.9L18.2 22 12 18.3 5.8 22 7 14.5l-5-4.9 6.9-.9z"/></svg>',
  starOutline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2l3.1 6.7L22 9.6l-5 4.9L18.2 22 12 18.3 5.8 22 7 14.5l-5-4.9 6.9-.9z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  pdf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/></svg>'
};

let ACTIVE_VIEW = 'home';

/* ---- View routing ---- */
function switchView(view) {
  ACTIVE_VIEW = view;
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${view}`));
  document.querySelectorAll('.side-link[data-view]').forEach((l) => {
    l.classList.toggle('active', l.dataset.view === view);
  });
  const titles = {
    home: 'Home', ai: 'AI Assistant', projects: 'Projects', tasks: 'Tasks',
    documents: 'Documents', notes: 'Notes', settings: 'Settings'
  };
  document.title = `${titles[view] || 'WECAN'} \u2014 WECAN`;
  closeSidebarDrawer();
  window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

function initSidebarNav() {
  document.querySelectorAll('[data-view]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      switchView(el.dataset.view);
    });
  });
}

/* ---- Mobile sidebar drawer ---- */
function openSidebarDrawer() {
  document.querySelector('.sidebar').classList.add('open');
  document.querySelector('.sidebar-scrim').classList.add('open');
}
function closeSidebarDrawer() {
  const sb = document.querySelector('.sidebar');
  const scrim = document.querySelector('.sidebar-scrim');
  if (sb) sb.classList.remove('open');
  if (scrim) scrim.classList.remove('open');
}
function initSidebarDrawer() {
  const openBtn = document.getElementById('open-sidebar');
  const closeBtn = document.getElementById('close-sidebar');
  const scrim = document.querySelector('.sidebar-scrim');
  if (openBtn) openBtn.addEventListener('click', openSidebarDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebarDrawer);
  if (scrim) scrim.addEventListener('click', closeSidebarDrawer);
}

/* ---- User profile ---- */
function initUserProfile() {
  const user = loadData(WECAN_KEYS.user, { name: 'Alex Rivera', initials: 'AR', plan: 'Pro plan' });
  document.querySelectorAll('[data-user-initials]').forEach((el) => { el.textContent = user.initials; });
  document.querySelectorAll('[data-user-name]').forEach((el) => { el.textContent = user.name; });
  document.querySelectorAll('[data-user-plan]').forEach((el) => { el.textContent = user.plan; });
  document.querySelectorAll('[data-user-firstname]').forEach((el) => { el.textContent = user.name.split(' ')[0]; });

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.location.href = 'index.html';
    });
  }
}

/* ---- Dashboard ---- */
function renderDashboard() {
  const projects = loadData(WECAN_KEYS.projects, []);
  const tasks = loadData(WECAN_KEYS.tasks, []);
  const docs = loadData(WECAN_KEYS.docs, []);

  const openTasks = tasks.filter((t) => t.column !== 'done').length;
  document.getElementById('stat-projects').textContent = projects.length;
  document.getElementById('stat-tasks').textContent = openTasks;
  document.getElementById('stat-documents').textContent = docs.length;
  document.getElementById('stat-ai').textContent = loadData(WECAN_KEYS.chat, []).filter((m) => m.role === 'user').length;

  const list = document.getElementById('dashboard-projects');
  list.innerHTML = projects.slice(0, 3).map((p) => `
    <div class="dash-project">
      <div class="dp-icon" style="background:${p.color}">${p.name.split(' ')[1] ? p.name.split(' ')[1][0] : p.name[0]}</div>
      <div class="dp-body">
        <div class="dp-name">${p.name}</div>
        <div class="dp-sub">${p.tag}</div>
      </div>
      <div class="dp-progress">
        <div class="pct">${p.progress}%</div>
        <div class="progress-track"><span style="width:${p.progress}%"></span></div>
      </div>
    </div>
  `).join('');

  const activity = [
    { icon: ICONS.tasks, text: '<strong>Priya S.</strong> moved \u201cQA pass on offline sync edge cases\u201d to Review', time: '12 min ago' },
    { icon: ICONS.documents, text: '<strong>Riya S.</strong> uploaded <strong>Brand Guidelines.pdf</strong>', time: '1 hr ago' },
    { icon: ICONS.projects, text: '<strong>Project Nova</strong> reached 91% completion', time: '3 hr ago' },
    { icon: ICONS.ai, text: 'AI Assistant summarized <strong>Project Atlas</strong> for the team', time: 'Yesterday' },
    { icon: ICONS.notes, text: '<strong>Deepak N.</strong> added a note to <strong>Q4 roadmap draft</strong>', time: 'Yesterday' }
  ];
  document.getElementById('dashboard-activity').innerHTML = activity.map((a) => `
    <div class="activity-item">
      <div class="activity-dot">${a.icon}</div>
      <div>
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>
    </div>
  `).join('');
}

/* ---- Documents ---- */
const DOC_ICON_STYLES = {
  pdf: { bg: 'rgba(234,106,106,0.14)', color: '#ea6a6a' },
  fig: { bg: 'rgba(124,108,240,0.14)', color: '#7c6cf0' },
  docx: { bg: 'rgba(91,140,255,0.14)', color: '#5b8cff' }
};

function renderDocuments(filter = '') {
  const docs = loadData(WECAN_KEYS.docs, []);
  const activeTab = document.querySelector('#view-documents .tab-btn.active')?.dataset.tab || 'recent';
  let list = docs;
  if (activeTab === 'favorites') list = docs.filter((d) => d.favorite);
  if (filter) list = list.filter((d) => d.name.toLowerCase().includes(filter.toLowerCase()));

  const container = document.getElementById('documents-list');
  if (!list.length) {
    container.innerHTML = `
      <div class="state-block">
        <div class="state-icon">${ICONS.documents}</div>
        <h4>No documents found</h4>
        <p>Try a different search term or switch tabs.</p>
      </div>`;
    return;
  }
  container.innerHTML = list.map((d) => {
    const style = DOC_ICON_STYLES[d.type] || DOC_ICON_STYLES.pdf;
    return `
    <div class="doc-row">
      <div class="doc-icon" style="background:${style.bg}; color:${style.color}">${ICONS.pdf}</div>
      <div class="doc-body">
        <div class="doc-name">${d.name}</div>
        <div class="doc-meta">${d.size} \u00b7 Updated ${d.updated}</div>
      </div>
      <button class="doc-fav ${d.favorite ? 'active' : ''}" data-doc-fav="${d.id}" aria-label="Toggle favorite">${d.favorite ? ICONS.star : ICONS.starOutline}</button>
    </div>`;
  }).join('');

  container.querySelectorAll('[data-doc-fav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const all = loadData(WECAN_KEYS.docs, []);
      const doc = all.find((d) => d.id === btn.dataset.docFav);
      doc.favorite = !doc.favorite;
      saveData(WECAN_KEYS.docs, all);
      renderDocuments(document.getElementById('documents-search').value);
      showToast(doc.favorite ? 'Added to favorites' : 'Removed from favorites');
    });
  });
}

function initDocuments() {
  document.querySelectorAll('#view-documents .tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#view-documents .tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      renderDocuments(document.getElementById('documents-search').value);
    });
  });
  document.getElementById('documents-search').addEventListener('input', (e) => renderDocuments(e.target.value));
}

/* ---- Notes ---- */
function renderNotes(filter = '') {
  let notes = loadData(WECAN_KEYS.notes, []);
  if (filter) notes = notes.filter((n) => n.title.toLowerCase().includes(filter.toLowerCase()) || n.body.toLowerCase().includes(filter.toLowerCase()));
  const grid = document.getElementById('notes-grid');

  if (!notes.length) {
    grid.innerHTML = `
      <div class="state-block" style="grid-column: 1/-1;">
        <div class="state-icon">${ICONS.notes}</div>
        <h4>No notes yet</h4>
        <p>Capture ideas, meeting takeaways, or quick thoughts.</p>
        <button class="btn btn-primary btn-sm" id="empty-new-note">New note</button>
      </div>`;
    document.getElementById('empty-new-note')?.addEventListener('click', () => openNoteModal());
    return;
  }

  grid.innerHTML = notes.map((n) => `
    <div class="card note-card" data-note-id="${n.id}">
      <div class="nc-title">${n.title}</div>
      <div class="nc-body text-muted">${n.body}</div>
      <div class="nc-foot">
        <span class="nc-date">Updated ${n.updated}</span>
        <button class="doc-fav ${n.favorite ? 'active' : ''}" data-note-fav="${n.id}" aria-label="Toggle favorite">${n.favorite ? ICONS.star : ICONS.starOutline}</button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.note-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-note-fav]')) return;
      openNoteModal(card.dataset.noteId);
    });
  });
  grid.querySelectorAll('[data-note-fav]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const all = loadData(WECAN_KEYS.notes, []);
      const note = all.find((n) => n.id === btn.dataset.noteFav);
      note.favorite = !note.favorite;
      saveData(WECAN_KEYS.notes, all);
      renderNotes(document.getElementById('notes-search').value);
    });
  });
}

function openNoteModal(id) {
  const modal = document.getElementById('note-modal');
  const all = loadData(WECAN_KEYS.notes, []);
  const note = id ? all.find((n) => n.id === id) : null;
  document.getElementById('note-modal-title').textContent = note ? 'Edit note' : 'New note';
  document.getElementById('note-id').value = note ? note.id : '';
  document.getElementById('note-title-input').value = note ? note.title : '';
  document.getElementById('note-body-input').value = note ? note.body : '';
  document.getElementById('note-delete-btn').style.display = note ? 'inline-flex' : 'none';
  modal.classList.add('open');
  document.getElementById('note-title-input').focus();
}

function initNotes() {
  document.getElementById('new-note-btn').addEventListener('click', () => openNoteModal());
  document.getElementById('notes-search').addEventListener('input', (e) => renderNotes(e.target.value));

  document.getElementById('note-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('note-id').value;
    const title = document.getElementById('note-title-input').value.trim();
    const body = document.getElementById('note-body-input').value.trim();
    if (!title) { showToast('Give your note a title', 'error'); return; }

    let all = loadData(WECAN_KEYS.notes, []);
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
    if (id) {
      const note = all.find((n) => n.id === id);
      note.title = title; note.body = body; note.updated = dateStr;
      showToast('Note updated');
    } else {
      all.unshift({ id: 'n-' + Date.now(), title, body, favorite: false, updated: dateStr });
      showToast('Note created');
    }
    saveData(WECAN_KEYS.notes, all);
    closeModal('note-modal');
    renderNotes(document.getElementById('notes-search').value);
  });

  document.getElementById('note-delete-btn').addEventListener('click', () => {
    const id = document.getElementById('note-id').value;
    let all = loadData(WECAN_KEYS.notes, []);
    all = all.filter((n) => n.id !== id);
    saveData(WECAN_KEYS.notes, all);
    closeModal('note-modal');
    renderNotes('');
    showToast('Note deleted');
  });
}

/* ---- Settings ---- */
function initSettings() {
  const themeSwitch = document.getElementById('setting-theme-switch');
  if (!themeSwitch) return;
  themeSwitch.checked = loadData(WECAN_KEYS.theme, 'dark') === 'light';
  themeSwitch.addEventListener('change', () => {
    toggleTheme();
  });
}

/* ---- Generic modal helpers ---- */
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}
function initModalDismiss() {
  document.querySelectorAll('.modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
    overlay.querySelectorAll('[data-modal-close]').forEach((btn) => {
      btn.addEventListener('click', () => overlay.classList.remove('open'));
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach((o) => o.classList.remove('open'));
      closeCommandPalette();
      closeGlobalSearch();
    }
  });
}

/* ---- Command palette ---- */
const COMMANDS = [
  { label: 'New task', icon: ICONS.tasks, action: () => { switchView('tasks'); openTaskModal(); } },
  { label: 'New project', icon: ICONS.projects, action: () => { switchView('projects'); showToast('Use \u201cNew Project\u201d on the Projects page'); } },
  { label: 'New note', icon: ICONS.notes, action: () => { switchView('notes'); openNoteModal(); } },
  { label: 'Search workspace', icon: ICONS.search, action: () => openGlobalSearch() },
  { label: 'Open AI Assistant', icon: ICONS.ai, action: () => switchView('ai') },
  { label: 'Toggle theme', icon: ICONS.settings, action: () => toggleTheme() },
  { label: 'Settings', icon: ICONS.settings, action: () => switchView('settings') }
];
let cmdkSelected = 0;

function renderCommandList(filter = '') {
  const list = document.getElementById('cmdk-list');
  const filtered = COMMANDS.filter((c) => c.label.toLowerCase().includes(filter.toLowerCase()));
  cmdkSelected = 0;
  if (!filtered.length) {
    list.innerHTML = '<div class="search-results-empty">No matching commands</div>';
    return;
  }
  list.innerHTML = `<div class="cmdk-group-label">Commands</div>` + filtered.map((c, i) => `
    <div class="cmdk-item ${i === 0 ? 'selected' : ''}" data-cmd-index="${i}">
      ${c.icon}<span>${c.label}</span>
    </div>
  `).join('');
  list.querySelectorAll('.cmdk-item').forEach((item) => {
    item.addEventListener('click', () => {
      filtered[Number(item.dataset.cmdIndex)].action();
      closeCommandPalette();
    });
  });
  list.dataset.filtered = JSON.stringify(filtered.map((c) => c.label));
  list.currentFiltered = filtered;
}

function openCommandPalette() {
  const overlay = document.getElementById('cmdk-overlay');
  overlay.classList.add('open');
  const input = document.getElementById('cmdk-input');
  input.value = '';
  renderCommandList('');
  setTimeout(() => input.focus(), 30);
}
function closeCommandPalette() {
  document.getElementById('cmdk-overlay')?.classList.remove('open');
}

function initCommandPalette() {
  const overlay = document.getElementById('cmdk-overlay');
  if (!overlay) return;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeCommandPalette(); });
  const input = document.getElementById('cmdk-input');
  input.addEventListener('input', () => renderCommandList(input.value));

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      overlay.classList.contains('open') ? closeCommandPalette() : openCommandPalette();
    }
    if (!overlay.classList.contains('open')) return;
    const list = document.getElementById('cmdk-list');
    const items = list.querySelectorAll('.cmdk-item');
    if (!items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      cmdkSelected = Math.min(cmdkSelected + 1, items.length - 1);
      items.forEach((it, i) => it.classList.toggle('selected', i === cmdkSelected));
      items[cmdkSelected].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      cmdkSelected = Math.max(cmdkSelected - 1, 0);
      items.forEach((it, i) => it.classList.toggle('selected', i === cmdkSelected));
      items[cmdkSelected].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      items[cmdkSelected]?.click();
    }
  });

  document.querySelectorAll('[data-open-cmdk]').forEach((btn) => btn.addEventListener('click', openCommandPalette));
}

/* ---- Global search (also used for Search view / Ctrl+K adjacent) ---- */
function openGlobalSearch() {
  const overlay = document.getElementById('search-overlay');
  overlay.classList.add('open');
  const input = document.getElementById('search-input');
  input.value = '';
  renderSearchResults('');
  setTimeout(() => input.focus(), 30);
}
function closeGlobalSearch() {
  document.getElementById('search-overlay')?.classList.remove('open');
}
function initGlobalSearch() {
  const overlay = document.getElementById('search-overlay');
  if (!overlay) return;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeGlobalSearch(); });
  document.getElementById('search-input').addEventListener('input', (e) => renderSearchResults(e.target.value));
  document.querySelectorAll('[data-open-search]').forEach((btn) => btn.addEventListener('click', openGlobalSearch));
}

/* ---- Init everything ---- */
document.addEventListener('DOMContentLoaded', () => {
  seedWorkspaceData();
  initTheme();
  initUserProfile();
  initSidebarNav();
  initSidebarDrawer();
  initModalDismiss();
  initCommandPalette();
  initGlobalSearch();
  initDocuments();
  initNotes();
  initSettings();

  renderDashboard();
  renderDocuments();
  renderNotes();
  if (typeof initTasksBoard === 'function') initTasksBoard();
  if (typeof renderProjects === 'function') renderProjects();
  if (typeof initAiAssistant === 'function') initAiAssistant();

  switchView('home');
});
