// ═══════════════════════════════════════════════════════════════
// ROUTER v3 — GitHub Pages Compatible Hash Router
// Works with: username.github.io/repo/ AND custom domains
// Strategy: Hash-based (#) so GitHub Pages never returns 404
// ═══════════════════════════════════════════════════════════════
const Router = {
  _views:   {},
  _history: [],
  current:  null,

  register(id, fn) {
    this._views[id] = fn;
  },

  go(viewId, data = null, opts = {}) {
    // Validate view exists
    if (!this._views[viewId]) {
      console.warn('[Router] Unknown view:', viewId);
      viewId = 'home'; data = null;
    }

    // Save current to history (for back button)
    if (!opts.replace && this.current && this.current !== viewId) {
      this._history.push({ id: this.current, data: null });
    }

    // Build hash: #viewId or #viewId/data
    const hash = data !== null ? `#${viewId}/${data}` : `#${viewId}`;

    if (opts.replace) {
      history.replaceState({ viewId, data }, '', hash);
    } else {
      history.pushState({ viewId, data }, '', hash);
    }

    this._activate(viewId, data);
  },

  back() {
    if (this._history.length > 0) {
      history.back(); // triggers popstate
    } else {
      this.go('home', null, { replace: true });
    }
  },

  _activate(viewId, data) {
    // Hide all views
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    // Show target view
    const el = document.getElementById(`view-${viewId}`);
    if (!el) {
      // Fallback to home
      document.getElementById('view-home')?.classList.add('active');
      this.current = 'home';
      if (this._views['home']) this._views['home'](null);
      return;
    }

    el.classList.add('active');
    this.current = viewId;

    // Update bottom nav active state
    document.querySelectorAll('[data-nav]').forEach(b =>
      b.classList.toggle('active', b.dataset.nav === viewId)
    );

    // Show/hide header back button
    const backBtn = document.getElementById('header-back');
    if (backBtn) {
      backBtn.style.display = this._history.length > 0 ? 'flex' : 'none';
    }

    // Update page title
    const titles = {
      home: 'أساسيات التمريض العملي 1',
      chapters: 'الفصول الدراسية',
      search: 'البحث',
      flashcards: 'بطاقات التكرار',
      'quiz-select': 'الاختبارات',
      quiz: 'اختبار',
      vocab: 'المصطلحات',
      progress: 'تقدمي',
      settings: 'الإعدادات',
      more: 'المزيد'
    };
    document.title = titles[viewId] || 'تمريض عملي 1';

    // Run handler
    try {
      if (this._views[viewId]) this._views[viewId](data);
    } catch(err) {
      console.error('[Router] Handler error for', viewId, err);
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  },

  // Handle browser back/forward buttons
  _handlePop(e) {
    if (e.state?.viewId) {
      Router._history.pop(); // browser handled the back
      Router._activate(e.state.viewId, e.state.data);
    } else {
      Router._parseHash();
    }
  },

  // Parse #hash on page load
  _parseHash() {
    const hash = location.hash.replace('#', '');

    if (!hash) {
      // No hash = go home
      this.go('home', null, { replace: true });
      return;
    }

    const parts  = hash.split('/');
    const viewId = parts[0];
    const data   = parts[1]
      ? (isNaN(parts[1]) ? parts[1] : Number(parts[1]))
      : null;

    // Validate view exists, otherwise go home
    if (this._views[viewId]) {
      this._activate(viewId, data);
    } else {
      this.go('home', null, { replace: true });
    }
  },

  // Initialize router — call after all routes registered
  init() {
    window.addEventListener('popstate', e => Router._handlePop(e));
    this._parseHash();
  },

  // Sanitize HTML to prevent XSS
  sanitize(str) {
    if (str === null || str === undefined) return '';
    const d = document.createElement('div');
    d.textContent = String(str);
    return d.innerHTML;
  }
};
