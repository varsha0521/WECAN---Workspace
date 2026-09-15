/* =========================================================
   WECAN — search.js
   Powers the global search overlay (Ctrl+K adjacent "Search
   Workspace" command and the sidebar search field).
   ========================================================= */

function searchWorkspace(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results = [];
  const projects = loadData(WECAN_KEYS.projects, []);
  const tasks = loadData(WECAN_KEYS.tasks, []);
  const docs = loadData(WECAN_KEYS.docs, []);
  const notes = loadData(WECAN_KEYS.notes, []);
  const chat = loadData(WECAN_KEYS.chat, []);

  projects.forEach((p) => {
    if (p.name.toLowerCase().includes(q) || p.tag.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
      results.push({ group: 'Projects', icon: ICONS.projects, title: p.name, sub: p.tag, view: 'projects' });
    }
  });
  tasks.forEach((t) => {
    if (t.title.toLowerCase().includes(q) || t.tag.toLowerCase().includes(q)) {
      results.push({ group: 'Tasks', icon: ICONS.tasks, title: t.title, sub: `${t.tag} \u00b7 Due ${t.due}`, view: 'tasks' });
    }
  });
  docs.forEach((d) => {
    if (d.name.toLowerCase().includes(q)) {
      results.push({ group: 'Documents', icon: ICONS.documents, title: d.name, sub: `Updated ${d.updated}`, view: 'documents' });
    }
  });
  notes.forEach((n) => {
    if (n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)) {
      results.push({ group: 'Notes', icon: ICONS.notes, title: n.title, sub: n.body.slice(0, 60) + '\u2026', view: 'notes' });
    }
  });
  chat.forEach((m) => {
    if (m.role === 'user' && m.text.toLowerCase().includes(q)) {
      results.push({ group: 'AI Conversations', icon: ICONS.ai, title: m.text.slice(0, 60), sub: 'AI Assistant', view: 'ai' });
    }
  });

  return results;
}

function renderSearchResults(query) {
  const container = document.getElementById('search-results');
  if (!query.trim()) {
    container.innerHTML = `<div class="search-results-empty">Start typing to search projects, tasks, documents, notes, and AI conversations.</div>`;
    return;
  }
  const results = searchWorkspace(query);
  if (!results.length) {
    container.innerHTML = `<div class="search-results-empty">No results for \u201c${query}\u201d</div>`;
    return;
  }

  let lastGroup = null;
  let html = '';
  results.slice(0, 30).forEach((r) => {
    if (r.group !== lastGroup) {
      html += `<div class="cmdk-group-label">${r.group}</div>`;
      lastGroup = r.group;
    }
    html += `
      <div class="cmdk-item" data-search-view="${r.view}">
        ${r.icon}
        <span>${r.title}<br><span class="text-muted" style="font-size:0.78rem;">${r.sub}</span></span>
      </div>`;
  });
  container.innerHTML = html;
  container.querySelectorAll('[data-search-view]').forEach((item) => {
    item.addEventListener('click', () => {
      switchView(item.dataset.searchView);
      closeGlobalSearch();
    });
  });
}
