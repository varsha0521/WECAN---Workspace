/* =========================================================
   WECAN — main.js
   Shared across all pages: theme, toasts, nav, landing widgets,
   auth form handling.
   ========================================================= */

/* ---- Brand mark ---- */
const BRAND_MARK_SVG = '<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1.25" y="1.25" width="29.5" height="29.5" rx="9" stroke="var(--accent)" stroke-width="1.4" opacity="0.45"/><circle cx="11" cy="11" r="4" fill="var(--accent)"/><circle cx="21" cy="21" r="4" fill="var(--accent-2)"/><path d="M13.8 13.8L18.2 18.2" stroke="var(--text-primary)" stroke-width="2" stroke-linecap="round"/></svg>';
function initBrandMarks() {
  document.querySelectorAll('.brand-mark').forEach((el) => { el.innerHTML = BRAND_MARK_SVG; });
}

/* ---- Theme ---- */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icons = document.querySelectorAll('[data-theme-icon]');
  icons.forEach((el) => { el.innerHTML = theme === 'light' ? ICON_SUN : ICON_MOON; });
}

function toggleTheme() {
  const current = loadData(WECAN_KEYS.theme, 'dark');
  const next = current === 'dark' ? 'light' : 'dark';
  saveData(WECAN_KEYS.theme, next);
  applyTheme(next);
  showToast(`Switched to ${next} mode`);
}

function initTheme() {
  const saved = loadData(WECAN_KEYS.theme, 'dark');
  applyTheme(saved);
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', toggleTheme);
  });
}

const ICON_SUN = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
const ICON_MOON = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1111.2 3 7 7 0 0021 12.8z"/></svg>';

/* ---- Toasts ---- */
function showToast(message, type = 'success') {
  let region = document.getElementById('toast-region');
  if (!region) {
    region = document.createElement('div');
    region.id = 'toast-region';
    document.body.appendChild(region);
  }
  const toast = document.createElement('div');
  toast.className = `toast${type === 'error' ? ' toast-error' : ''}`;
  toast.setAttribute('role', 'status');
  const icon = type === 'error'
    ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v5M12 16h.01"/></svg>'
    : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
  toast.innerHTML = `${icon}<span>${message}</span>`;
  region.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('leaving');
    setTimeout(() => toast.remove(), 240);
  }, 3200);
}

/* ---- Landing: nav scroll + mobile menu ---- */
function initLandingNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a, button').forEach((el) => {
      el.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ---- Landing: FAQ accordion ---- */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((other) => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-a').style.maxHeight = null;
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      a.style.maxHeight = !isOpen ? `${a.scrollHeight}px` : null;
      q.setAttribute('aria-expanded', String(!isOpen));
    });
  });
}

/* ---- Landing: pricing toggle ---- */
function initPricingToggle() {
  const toggle = document.querySelector('.pricing-toggle');
  if (!toggle) return;
  const monthlyBtn = toggle.querySelector('[data-period="monthly"]');
  const yearlyBtn = toggle.querySelector('[data-period="yearly"]');
  const priceEls = document.querySelectorAll('[data-price-monthly]');

  function setPeriod(period) {
    monthlyBtn.classList.toggle('active', period === 'monthly');
    yearlyBtn.classList.toggle('active', period === 'yearly');
    priceEls.forEach((el) => {
      const monthly = el.dataset.priceMonthly;
      const yearly = el.dataset.priceYearly;
      el.textContent = period === 'monthly' ? monthly : yearly;
    });
  }
  monthlyBtn.addEventListener('click', () => setPeriod('monthly'));
  yearlyBtn.addEventListener('click', () => setPeriod('yearly'));
}

/* ---- Form validation helpers ---- */
function setFieldError(fieldEl, message) {
  fieldEl.classList.add('has-error');
  const err = fieldEl.querySelector('.field-error');
  if (err) err.textContent = message;
}
function clearFieldError(fieldEl) {
  fieldEl.classList.remove('has-error');
}
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* ---- Login form ---- */
function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const emailField = document.getElementById('field-email');
    const passField = document.getElementById('field-password');
    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-password').value;

    if (!isValidEmail(email)) { setFieldError(emailField, 'Enter a valid email address.'); valid = false; }
    else clearFieldError(emailField);

    if (pass.length < 6) { setFieldError(passField, 'Password must be at least 6 characters.'); valid = false; }
    else clearFieldError(passField);

    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Signing in\u2026';
    setTimeout(() => {
      saveData(WECAN_KEYS.user, { name: 'Alex Rivera', initials: 'AR', plan: 'Pro plan' });
      window.location.href = 'workspace.html';
    }, 650);
  });
}

/* ---- Signup form ---- */
function initSignupForm() {
  const form = document.getElementById('signup-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const nameField = document.getElementById('field-name');
    const emailField = document.getElementById('field-signup-email');
    const passField = document.getElementById('field-signup-password');
    const confirmField = document.getElementById('field-confirm-password');

    const name = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const pass = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;

    if (name.length < 2) { setFieldError(nameField, 'Enter your full name.'); valid = false; }
    else clearFieldError(nameField);

    if (!isValidEmail(email)) { setFieldError(emailField, 'Enter a valid email address.'); valid = false; }
    else clearFieldError(emailField);

    if (pass.length < 6) { setFieldError(passField, 'Password must be at least 6 characters.'); valid = false; }
    else clearFieldError(passField);

    if (confirm !== pass || confirm.length === 0) { setFieldError(confirmField, 'Passwords do not match.'); valid = false; }
    else clearFieldError(confirmField);

    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.textContent = 'Creating workspace\u2026';
    setTimeout(() => {
      const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
      saveData(WECAN_KEYS.user, { name, initials: initials || 'U', plan: 'Free plan' });
      window.location.href = 'workspace.html';
    }, 650);
  });
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  initBrandMarks();
  initTheme();
  initLandingNav();
  initFaq();
  initPricingToggle();
  initLoginForm();
  initSignupForm();
});
