# WECAN — Premium AI Workspace

A frontend-only SaaS product concept: a landing page, auth screens, and a
full in-browser workspace (dashboard, AI assistant, projects, Kanban tasks,
documents, notes) built with plain HTML, CSS, and vanilla JavaScript.

## Structure

```
WECAN/
├── index.html          Landing page
├── login.html           Login screen
├── signup.html          Signup screen
├── workspace.html        The app (dashboard, AI, projects, tasks, docs, notes, settings)
├── css/
│   ├── style.css         Design tokens + shared components (buttons, forms, modals, toasts)
│   ├── landing.css       Landing + auth page styles
│   └── workspace.css     Workspace app styles
├── js/
│   ├── storage.js        LocalStorage helpers + seed data
│   ├── main.js            Theme, toasts, brand mark, landing widgets, auth forms
│   ├── workspace.js       View routing, sidebar, dashboard, docs, notes, settings, command palette
│   ├── tasks.js           Kanban board + drag and drop
│   ├── projects.js        Projects grid + detail modal
│   ├── ai.js              AI Assistant chat (simulated responses)
│   └── search.js          Global search across the workspace
└── assets/images/favicon.svg
```

## Running it

No build step. Open `index.html` in a browser, or serve the folder with
any static file server:

```
npx serve WECAN
```

## Notes

- All data (theme, tasks, notes, projects, AI conversation, favorites) is
  stored in `localStorage` and persists across reloads.
- Login and signup are UI-only: submitting either form seeds a user profile
  in `localStorage` and takes you into the workspace.
- The AI Assistant uses a small set of canned responses in `js/ai.js`.
  `generateAiResponse()` is written as a drop-in replacement point for a
  real API call.
- Keyboard shortcut `Ctrl/Cmd + K` opens the command palette from any view
  inside the workspace.
- Fonts: Space Grotesk (branding/headings), Inter (UI/navigation), Source
  Sans 3 (body text), loaded from Google Fonts. Swap the `@import` in
  `css/style.css` for local font files if you'd like to self-host.
