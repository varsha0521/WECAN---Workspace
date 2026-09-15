/* =========================================================
   WECAN — tasks.js
   Kanban board: render, drag & drop, create task modal.
   ========================================================= */

const TASK_COLUMNS = [
  { id: 'backlog', label: 'Backlog', color: '#6c6980' },
  { id: 'todo', label: 'To Do', color: '#5b8cff' },
  { id: 'in-progress', label: 'In Progress', color: '#7c6cf0' },
  { id: 'review', label: 'Review', color: '#e0a95c' },
  { id: 'done', label: 'Done', color: '#3fc48a' }
];

const PRIORITY_BADGE = {
  High: 'badge-red',
  Medium: 'badge-amber',
  Low: 'badge-green'
};

let draggedTaskId = null;

function taskCardHtml(task) {
  return `
    <div class="task-card" draggable="true" data-task-id="${task.id}">
      <div class="tc-tag">
        <span class="badge ${PRIORITY_BADGE[task.priority] || ''}"><span class="badge-dot"></span>${task.priority}</span>
      </div>
      <div class="tc-title">${task.title}</div>
      <div class="tc-foot">
        <span class="badge">${task.tag}</span>
        <span class="tc-due">${ICONS.clock.replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" width="12" height="12"')} ${task.due}</span>
      </div>
    </div>`;
}

function renderKanban() {
  const tasks = loadData(WECAN_KEYS.tasks, []);
  const board = document.getElementById('kanban-board');
  board.innerHTML = TASK_COLUMNS.map((col) => {
    const colTasks = tasks.filter((t) => t.column === col.id);
    return `
      <div class="kanban-col" data-column="${col.id}">
        <div class="kanban-col-head">
          <span class="dot" style="background:${col.color}"></span>
          <h4>${col.label}</h4>
          <span class="kc-count">${colTasks.length}</span>
        </div>
        <div class="kanban-col-body" data-dropzone="${col.id}">
          ${colTasks.map(taskCardHtml).join('') || ''}
        </div>
      </div>`;
  }).join('');

  attachDragEvents();
}

function attachDragEvents() {
  document.querySelectorAll('.task-card').forEach((card) => {
    card.addEventListener('dragstart', () => {
      draggedTaskId = card.dataset.taskId;
      setTimeout(() => card.classList.add('dragging'), 0);
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      draggedTaskId = null;
    });
  });

  document.querySelectorAll('.kanban-col').forEach((col) => {
    col.addEventListener('dragover', (e) => {
      e.preventDefault();
      col.classList.add('drag-over');
    });
    col.addEventListener('dragleave', () => col.classList.remove('drag-over'));
    col.addEventListener('drop', (e) => {
      e.preventDefault();
      col.classList.remove('drag-over');
      if (!draggedTaskId) return;
      const tasks = loadData(WECAN_KEYS.tasks, []);
      const task = tasks.find((t) => t.id === draggedTaskId);
      if (task && task.column !== col.dataset.column) {
        task.column = col.dataset.column;
        saveData(WECAN_KEYS.tasks, tasks);
        renderKanban();
        showToast(`Moved \u201c${task.title.slice(0, 30)}${task.title.length > 30 ? '\u2026' : ''}\u201d to ${TASK_COLUMNS.find((c) => c.id === col.dataset.column).label}`);
      }
    });
  });
}

function createTask({ title, description, priority, project, due }) {
  const tasks = loadData(WECAN_KEYS.tasks, []);
  const dueStr = due ? new Date(due).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }) : 'No date';
  const newTask = {
    id: 't-' + Date.now(),
    title, description: description || '',
    tag: project, priority,
    assignee: 'AR', due: dueStr, column: 'todo'
  };
  tasks.unshift(newTask);
  saveData(WECAN_KEYS.tasks, tasks);
  return newTask;
}

function openTaskModal() {
  document.getElementById('task-form').reset();
  openModal('task-modal');
  document.getElementById('task-name-input').focus();
}

function initTasksBoard() {
  renderKanban();

  document.getElementById('new-task-btn')?.addEventListener('click', openTaskModal);

  document.getElementById('task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('task-name-input').value.trim();
    const description = document.getElementById('task-desc-input').value.trim();
    const priority = document.getElementById('task-priority-input').value;
    const project = document.getElementById('task-project-input').value;
    const due = document.getElementById('task-due-input').value;

    const titleField = document.getElementById('field-task-name');
    if (!title) { setFieldError(titleField, 'Task name is required.'); return; }
    clearFieldError(titleField);

    createTask({ title, description, priority, project, due });
    closeModal('task-modal');
    renderKanban();
    renderDashboard();
    showToast('Task created');
  });
}
