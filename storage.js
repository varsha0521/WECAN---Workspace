/* =========================================================
   WECAN — storage.js
   LocalStorage helpers + seed data. Loaded before all other
   workspace scripts.
   ========================================================= */

const WECAN_KEYS = {
  theme: 'WECAN_theme',
  projects: 'WECAN_projects',
  tasks: 'WECAN_tasks',
  notes: 'WECAN_notes',
  docs: 'WECAN_documents',
  chat: 'WECAN_ai_conversation',
  user: 'WECAN_user',
  seeded: 'WECAN_seeded_v1'
};

function saveData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error('WECAN storage: failed to save', key, err);
    return false;
  }
}

function loadData(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error('WECAN storage: failed to load', key, err);
    return fallback;
  }
}

/* ---- Seed data (only written once, on first visit) ---- */
const SEED_PROJECTS = [
  {
    id: 'proj-aurora',
    name: 'Project Aurora',
    tag: 'Design System 2.0',
    description: 'Unifying tokens, components, and docs into one source of truth for product design.',
    progress: 74,
    status: 'In Progress',
    deadline: 'Oct 18',
    color: '#7c6cf0',
    team: ['MK', 'RS', 'AJ']
  },
  {
    id: 'proj-atlas',
    name: 'Project Atlas',
    tag: 'Marketing Platform',
    description: 'Campaign builder and analytics suite for the growth team\u2019s Q4 push.',
    progress: 48,
    status: 'In Progress',
    deadline: 'Nov 02',
    color: '#5b8cff',
    team: ['TL', 'DN']
  },
  {
    id: 'proj-nova',
    name: 'Project Nova',
    tag: 'Mobile Experience',
    description: 'Native-feeling mobile workspace with offline sync and gesture navigation.',
    progress: 91,
    status: 'Review',
    deadline: 'Sep 24',
    color: '#3fc48a',
    team: ['AJ', 'MK', 'PS', 'RS']
  },
  {
    id: 'proj-lumen',
    name: 'Project Lumen',
    tag: 'AI Assistant v2',
    description: 'Context-aware suggestions and workspace-wide command understanding.',
    progress: 22,
    status: 'Backlog',
    deadline: 'Dec 12',
    color: '#e0a95c',
    team: ['DN', 'TL']
  }
];

const SEED_TASKS = [
  { id: 't-1', title: 'Audit color contrast across dark theme', tag: 'Aurora', priority: 'High', assignee: 'MK', due: 'Sep 18', column: 'todo' },
  { id: 't-2', title: 'Draft onboarding email sequence', tag: 'Atlas', priority: 'Medium', assignee: 'TL', due: 'Sep 20', column: 'todo' },
  { id: 't-3', title: 'Write spec for gesture navigation', tag: 'Nova', priority: 'High', assignee: 'AJ', due: 'Sep 16', column: 'in-progress' },
  { id: 't-4', title: 'Refactor component token pipeline', tag: 'Aurora', priority: 'Medium', assignee: 'RS', due: 'Sep 22', column: 'in-progress' },
  { id: 't-5', title: 'QA pass on offline sync edge cases', tag: 'Nova', priority: 'High', assignee: 'PS', due: 'Sep 15', column: 'review' },
  { id: 't-6', title: 'Prepare Q4 campaign brief', tag: 'Atlas', priority: 'Low', assignee: 'DN', due: 'Sep 26', column: 'backlog' },
  { id: 't-7', title: 'Define AI suggestion ranking model', tag: 'Lumen', priority: 'Medium', assignee: 'DN', due: 'Oct 01', column: 'backlog' },
  { id: 't-8', title: 'Ship redesigned settings panel', tag: 'Aurora', priority: 'Medium', assignee: 'AJ', due: 'Sep 12', column: 'done' },
  { id: 't-9', title: 'Publish component documentation site', tag: 'Aurora', priority: 'Low', assignee: 'RS', due: 'Sep 10', column: 'done' },
  { id: 't-10', title: 'Fix drag handle hit-area on touch', tag: 'Nova', priority: 'Low', assignee: 'PS', due: 'Sep 19', column: 'todo' }
];

const SEED_NOTES = [
  { id: 'n-1', title: 'Design review takeaways', body: 'Consolidate spacing scale to 4px base. Revisit elevation tokens before next sprint. Team agreed to defer icon set migration.', favorite: true, updated: 'Sep 14' },
  { id: 'n-2', title: 'Onboarding flow ideas', body: 'Try a progressive disclosure pattern for the first-run experience. Ask growth team about activation metrics baseline.', favorite: false, updated: 'Sep 12' },
  { id: 'n-3', title: 'AI assistant tone guidelines', body: 'Keep responses concise, confident, and specific. Avoid hedging language. Always offer a concrete next step.', favorite: true, updated: 'Sep 11' },
  { id: 'n-4', title: 'Q4 roadmap draft', body: 'Three themes: workspace performance, AI depth, mobile parity. Confirm capacity with eng leads next week.', favorite: false, updated: 'Sep 09' }
];

const SEED_DOCS = [
  { id: 'd-1', name: 'Product Strategy.pdf', type: 'pdf', size: '2.4 MB', updated: 'Sep 13', favorite: true },
  { id: 'd-2', name: 'Design System.fig', type: 'fig', size: '18.1 MB', updated: 'Sep 12', favorite: true },
  { id: 'd-3', name: 'Marketing Plan.docx', type: 'docx', size: '860 KB', updated: 'Sep 10', favorite: false },
  { id: 'd-4', name: 'Project Brief.pdf', type: 'pdf', size: '1.1 MB', updated: 'Sep 08', favorite: false },
  { id: 'd-5', name: 'Research Interviews.docx', type: 'docx', size: '540 KB', updated: 'Sep 05', favorite: false },
  { id: 'd-6', name: 'Brand Guidelines.pdf', type: 'pdf', size: '3.7 MB', updated: 'Aug 30', favorite: true }
];

function seedWorkspaceData() {
  if (loadData(WECAN_KEYS.seeded, false)) return;
  saveData(WECAN_KEYS.projects, SEED_PROJECTS);
  saveData(WECAN_KEYS.tasks, SEED_TASKS);
  saveData(WECAN_KEYS.notes, SEED_NOTES);
  saveData(WECAN_KEYS.docs, SEED_DOCS);
  saveData(WECAN_KEYS.chat, [
    { role: 'ai', text: 'Hi Alex. I can help you plan your day, summarize projects, or turn notes into tasks. What would you like to do?', time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }
  ]);
  if (!loadData(WECAN_KEYS.user, null)) {
    saveData(WECAN_KEYS.user, { name: 'Alex Rivera', initials: 'AR', plan: 'Pro plan' });
  }
  saveData(WECAN_KEYS.seeded, true);
}
