/* =========================================================
   WECAN — ai.js
   Simulated AI Assistant chat. Structured so a real API call
   could later replace generateAiResponse() without touching
   the rest of the UI logic.
   ========================================================= */

const AI_WELCOME = {
  role: 'ai',
  text: 'Hi Alex. I can help you plan your day, summarize projects, or turn notes into tasks. What would you like to do?',
  time: aiTimestamp()
};

function aiTimestamp() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/* Canned responses keyed by intent-matching keywords. Falls back to a
   generic helpful reply if nothing matches. Swap this function for a
   real fetch() to /v1/messages to go live. */
function generateAiResponse(userText) {
  const q = userText.toLowerCase();
  const projects = loadData(WECAN_KEYS.projects, []);
  const tasks = loadData(WECAN_KEYS.tasks, []);

  if (q.includes('summarize') && q.includes('project')) {
    const lines = projects.map((p) => `\u2022 ${p.name} \u2014 ${p.progress}% complete, ${p.status.toLowerCase()}`).join('\n');
    return `Here\u2019s where things stand across your ${projects.length} active projects:\n\n${lines}\n\nProject Nova is closest to shipping \u2014 want me to draft a launch checklist?`;
  }
  if (q.includes('overdue') || (q.includes('task') && q.includes('show'))) {
    const openTasks = tasks.filter((t) => t.column !== 'done').slice(0, 4);
    const lines = openTasks.map((t) => `\u2022 ${t.title} (${t.priority} priority, due ${t.due})`).join('\n');
    return `You have ${tasks.filter((t) => t.column !== 'done').length} open tasks. Here are the highest priority ones:\n\n${lines}\n\nWant me to move the top one into Review?`;
  }
  if (q.includes('what should i work on') || q.includes('today')) {
    const highPriority = tasks.find((t) => t.priority === 'High' && t.column !== 'done');
    return highPriority
      ? `Based on priority and due dates, I\u2019d start with \u201c${highPriority.title}\u201d \u2014 it\u2019s marked High priority and due ${highPriority.due}. After that, clear anything sitting in Review so it doesn\u2019t block the team.`
      : `Your board looks clear of high-priority items \u2014 nice work. I\u2019d spend today moving Review items to Done.`;
  }
  if (q.includes('create task') || q.includes('create tasks')) {
    return `I can do that. Open the Tasks board and use \u201cNew Task,\u201d or tell me the task name here and I\u2019ll add it to your To Do column for you.`;
  }
  if (q.includes('note')) {
    return `You have a few recent notes, including \u201cDesign review takeaways\u201d and \u201cQ4 roadmap draft.\u201d Want me to turn either one into a task list?`;
  }
  if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
    return `Hey! Ready when you are \u2014 I can summarize projects, surface overdue tasks, or help you plan the day.`;
  }
  return `Got it \u2014 I don\u2019t have a live model connected in this preview, but in the full version I\u2019d act on that directly. For now, try asking me to summarize your projects, show overdue tasks, or suggest what to work on today.`;
}

function loadChatHistory() {
  let history = loadData(WECAN_KEYS.chat, null);
  if (!history || !history.length) {
    history = [AI_WELCOME];
    saveData(WECAN_KEYS.chat, history);
  }
  return history;
}

function renderChat() {
  const history = loadChatHistory();
  const container = document.getElementById('ai-messages');
  container.innerHTML = history.map((m, i) => renderMessage(m, i)).join('');
  container.scrollTop = container.scrollHeight;
  attachMessageActions();
}

function renderMessage(m, index) {
  if (m.role === 'ai') {
    return `
      <div class="msg msg-ai">
        <div class="msg-avatar">${ICONS.ai}</div>
        <div class="msg-body">
          <div class="msg-bubble">${escapeHtml(m.text).replace(/\n/g, '<br>')}</div>
          <div class="msg-meta">
            <span>${m.time}</span>
            <button data-copy-index="${index}" aria-label="Copy">${copyIcon()}</button>
            <button data-regen-index="${index}" aria-label="Regenerate">${regenIcon()}</button>
          </div>
        </div>
      </div>`;
  }
  return `
    <div class="msg msg-user">
      <div class="msg-avatar" data-user-initials>${loadData(WECAN_KEYS.user, { initials: 'AR' }).initials}</div>
      <div class="msg-body">
        <div class="msg-bubble">${escapeHtml(m.text)}</div>
        <div class="msg-meta"><span>${m.time}</span></div>
      </div>
    </div>`;
}

function copyIcon() { return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy'; }
function regenIcon() { return '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"/><path d="M20.5 9A9 9 0 105.6 5.6L1 10M23 14l-4.6 4.4A9 9 0 013.5 15"/></svg> Regenerate'; }

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function attachMessageActions() {
  document.querySelectorAll('[data-copy-index]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const history = loadChatHistory();
      const text = history[Number(btn.dataset.copyIndex)].text;
      navigator.clipboard?.writeText(text).then(() => showToast('Copied to clipboard'));
    });
  });
  document.querySelectorAll('[data-regen-index]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.regenIndex);
      const history = loadChatHistory();
      const priorUser = [...history].slice(0, idx).reverse().find((m) => m.role === 'user');
      if (!priorUser) return;
      showAiTyping(() => {
        history[idx] = { role: 'ai', text: generateAiResponse(priorUser.text + ' (regenerate)'), time: aiTimestamp() };
        saveData(WECAN_KEYS.chat, history);
        renderChat();
      });
    });
  });
}

function showAiTyping(callback) {
  const container = document.getElementById('ai-messages');
  const typingEl = document.createElement('div');
  typingEl.className = 'msg msg-ai';
  typingEl.id = 'ai-typing-msg';
  typingEl.innerHTML = `
    <div class="msg-avatar">${ICONS.ai}</div>
    <div class="msg-body">
      <div class="msg-bubble"><div class="ai-typing"><span></span><span></span><span></span></div></div>
    </div>`;
  container.appendChild(typingEl);
  container.scrollTop = container.scrollHeight;
  setTimeout(() => {
    typingEl.remove();
    callback();
  }, 900 + Math.random() * 500);
}

function sendAiMessage(text) {
  if (!text.trim()) return;
  const history = loadChatHistory();
  history.push({ role: 'user', text: text.trim(), time: aiTimestamp() });
  saveData(WECAN_KEYS.chat, history);
  renderChat();

  showAiTyping(() => {
    const current = loadChatHistory();
    current.push({ role: 'ai', text: generateAiResponse(text), time: aiTimestamp() });
    saveData(WECAN_KEYS.chat, current);
    renderChat();
  });
}

function initAiAssistant() {
  renderChat();
  const textarea = document.getElementById('ai-textarea');
  const sendBtn = document.getElementById('ai-send-btn');

  function trySend() {
    const val = textarea.value;
    if (!val.trim()) return;
    sendAiMessage(val);
    textarea.value = '';
    textarea.style.height = 'auto';
    sendBtn.disabled = true;
  }

  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    sendBtn.disabled = !textarea.value.trim();
  });
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      trySend();
    }
  });
  sendBtn.addEventListener('click', trySend);

  document.querySelectorAll('.ai-prompt-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      textarea.value = chip.textContent.trim();
      trySend();
    });
  });
}
