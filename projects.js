/* =========================================================
   WECAN — projects.js
   Projects grid + detail modal.
   ========================================================= */

const STATUS_BADGE = {
  'In Progress': 'badge-violet',
  'Review': 'badge-amber',
  'Backlog': '',
  'Done': 'badge-green'
};

function renderProjects() {
  const projects = loadData(WECAN_KEYS.projects, []);
  const grid = document.getElementById('projects-grid');

  if (!projects.length) {
    grid.innerHTML = `
      <div class="state-block" style="grid-column:1/-1;">
        <div class="state-icon">${ICONS.projects}</div>
        <h4>No projects yet</h4>
        <p>Start organizing your work by creating your first project.</p>
        <button class="btn btn-primary btn-sm">Create Project</button>
      </div>`;
    return;
  }

  grid.innerHTML = projects.map((p) => `
    <div class="card project-card" data-project-id="${p.id}">
      <div class="pc-top">
        <div class="dp-icon" style="background:${p.color}">${p.name.split(' ')[1] ? p.name.split(' ')[1][0] : p.name[0]}</div>
        <span class="badge ${STATUS_BADGE[p.status] || ''}">${p.status}</span>
      </div>
      <h3>${p.name}</h3>
      <p class="pc-desc">${p.description}</p>
      <div class="progress-track"><span style="width:${p.progress}%; background:${p.color}"></span></div>
      <div class="pc-meta">
        <div class="avatar-stack">
          ${p.team.map((initials) => `<div class="avatar" style="background:${p.color}">${initials}</div>`).join('')}
        </div>
        <span class="pc-deadline">Due ${p.deadline}</span>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', () => openProjectModal(card.dataset.projectId));
  });
}

function openProjectModal(id) {
  const projects = loadData(WECAN_KEYS.projects, []);
  const tasks = loadData(WECAN_KEYS.tasks, []);
  const p = projects.find((pr) => pr.id === id);
  if (!p) return;

  const relatedTasks = tasks.filter((t) => t.tag === p.name.split(' ')[1] || t.tag === p.name);
  const openCount = relatedTasks.filter((t) => t.column !== 'done').length;

  document.getElementById('project-modal-body').innerHTML = `
    <div style="display:flex; align-items:center; gap:14px; margin-bottom:18px;">
      <div class="dp-icon" style="width:46px;height:46px;font-size:1.1rem;background:${p.color}">${p.name.split(' ')[1] ? p.name.split(' ')[1][0] : p.name[0]}</div>
      <div>
        <h3 style="font-size:1.15rem;">${p.name}</h3>
        <p class="text-muted" style="font-size:0.85rem;">${p.tag}</p>
      </div>
      <span class="badge ${STATUS_BADGE[p.status] || ''}" style="margin-left:auto;">${p.status}</span>
    </div>
    <p style="margin-bottom:20px; font-size:0.92rem;">${p.description}</p>
    <div style="margin-bottom:20px;">
      <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem;">
        <span class="text-muted">Progress</span><strong>${p.progress}%</strong>
      </div>
      <div class="progress-track"><span style="width:${p.progress}%; background:${p.color}"></span></div>
    </div>
    <div style="display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:20px;">
      <div class="card" style="padding:14px;">
        <div class="text-muted" style="font-size:0.76rem; margin-bottom:4px;">Deadline</div>
        <div style="font-family:var(--font-ui); font-weight:600;">${p.deadline}</div>
      </div>
      <div class="card" style="padding:14px;">
        <div class="text-muted" style="font-size:0.76rem; margin-bottom:4px;">Open tasks</div>
        <div style="font-family:var(--font-ui); font-weight:600;">${openCount}</div>
      </div>
      <div class="card" style="padding:14px;">
        <div class="text-muted" style="font-size:0.76rem; margin-bottom:4px;">Team</div>
        <div class="avatar-stack">${p.team.map((i) => `<div class="avatar" style="width:22px;height:22px;font-size:0.62rem;background:${p.color}">${i}</div>`).join('')}</div>
      </div>
    </div>
    <button class="btn btn-outline btn-block" id="project-view-tasks">View tasks in Kanban</button>
  `;
  openModal('project-modal');
  document.getElementById('project-view-tasks').addEventListener('click', () => {
    closeModal('project-modal');
    switchView('tasks');
  });
}
