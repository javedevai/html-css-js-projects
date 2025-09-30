/* ==========================================================================
   Minimalist Todo App — vanilla JS
   - Theme toggle: aria-pressed, localStorage, respects prefers-color-scheme
   - Todo features: add, complete, delete, filter (status)
   - Accessibility: aria-live announcements, labeled controls, keyboard-first
   - Performance: single render pipeline, minimal DOM work
   ========================================================================== */

(function () {
  'use strict';

  // Short helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const byId = (id) => document.getElementById(id);

  // Footer year
  $$('#year').forEach((el) => (el.textContent = new Date().getFullYear()));

  // THEME
  const THEME_KEY = 'theme';
  const toggle = byId('theme-toggle');

  const applyTheme = (theme) => {
    // theme: 'light' | 'dark' | null
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
      toggle?.setAttribute('aria-pressed', 'false');
    } else if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggle?.setAttribute('aria-pressed', 'true');
    } else {
      // Remove override to respect system preference
      document.documentElement.removeAttribute('data-theme');
      toggle?.setAttribute('aria-pressed', 'false');
    }
  };

  applyTheme(localStorage.getItem(THEME_KEY) || null);

  toggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });

  // TODO STATE
  const STORAGE_KEY = 'todos:minimal';
  let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); // {id,title,priority,due,completed}

  const uid = () => Math.random().toString(36).slice(2, 10);
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));

  // Accessibility live region
  const status = byId('status');
  const announce = (msg) => {
    if (status) status.textContent = msg;
  };

  // Elements
  const form = byId('todo-form');
  const errors = byId('form-errors');
  const list = byId('todo-list');
  const stats = byId('stats');
  const filterStatus = byId('filter-status');
  const clearCompletedBtn = byId('clear-completed');

  // CRUD
  const addTodo = (data) => {
    todos.unshift({
      id: uid(),
      title: data.title.trim(),
      priority: data.priority || 'normal',
      due: data.due || '',
      completed: false,
      createdAt: Date.now(),
    });
    save();
    announce(`Added: ${data.title.trim()}`);
    render();
    form.reset();
  };

  const toggleCompleted = (id) => {
    todos = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    save();
    const t = todos.find((t) => t.id === id);
    announce(`${t?.completed ? 'Completed' : 'Active'}: ${t?.title || 'Task'}`);
    render();
  };

  const deleteTodo = (id) => {
    const t = todos.find((t) => t.id === id);
    todos = todos.filter((t) => t.id !== id);
    save();
    announce(`Deleted: ${t?.title || 'Task'}`);
    render();
  };

  const clearCompleted = () => {
    const count = todos.filter((t) => t.completed).length;
    if (!count) return;
    todos = todos.filter((t) => !t.completed);
    save();
    announce(`Cleared ${count} completed`);
    render();
  };

  // Filters
  const filteredTodos = () => {
    const f = filterStatus?.value || 'all';
    return todos.filter((t) => {
      if (f === 'active') return !t.completed;
      if (f === 'completed') return t.completed;
      return true;
    });
  };

  // Render
  const renderStats = () => {
    const total = todos.length;
    const done = todos.filter((t) => t.completed).length;
    stats &&
      (stats.textContent = `${total} task${total !== 1 ? 's' : ''}, ${done} completed`);
  };

  const createItem = (t) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.setAttribute('role', 'listitem');
    li.dataset.id = t.id;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'input';
    cb.checked = t.completed;
    cb.id = `cb-${t.id}`;
    cb.setAttribute(
      'aria-label',
      `Mark "${t.title}" as ${t.completed ? 'active' : 'completed'}`,
    );
    cb.addEventListener('change', () => toggleCompleted(t.id));

    const content = document.createElement('div');
    content.innerHTML = `
      <div class="todo-title">${t.title}</div>
      <div class="todo-meta">${t.priority} • ${t.due || 'No due date'}</div>
    `;

    const actions = document.createElement('div');
    actions.className = 'todo-actions';

    const del = document.createElement('button');
    del.type = 'button';
    del.className = 'btn';
    del.setAttribute('aria-label', `Delete "${t.title}"`);
    del.innerHTML =
      '<span aria-hidden="true">🗑️</span><span class="sr-only">Delete</span>';
    del.addEventListener('click', () => deleteTodo(t.id));

    actions.append(del);
    li.append(cb, content, actions);
    return li;
  };

  const render = () => {
    if (!list) return;
    list.textContent = '';
    filteredTodos()
      .map(createItem)
      .forEach((el) => list.appendChild(el));
    renderStats();
  };

  // Validate form inputs with accessible errors
  const validate = ({ title }) => {
    const err = [];
    if (!title || title.trim().length < 2)
      err.push('Task must be at least 2 characters.');
    return err;
  };

  // EVENTS
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    errors.textContent = '';
    const data = {
      title: byId('task-title').value,
      priority: byId('task-priority').value,
      due: byId('task-due').value,
    };
    const err = validate(data);
    if (err.length) {
      const ul = document.createElement('ul');
      err.forEach((m) => {
        const li = document.createElement('li');
        li.textContent = m;
        ul.appendChild(li);
      });
      errors.appendChild(ul);
      return;
    }
    addTodo(data);
  });

  filterStatus?.addEventListener('input', render);
  clearCompletedBtn?.addEventListener('click', clearCompleted);

  // Init
  render();
})();
