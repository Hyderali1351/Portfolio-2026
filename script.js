// Stop aurora — GSAP blobs replace it
window.__stopAurora = true;

// Track light mode state (set early from DOM so other code can read it)
window.__lightMode = document.documentElement.getAttribute('data-theme') === 'light';

// ──────────────────────────────────────────────────────────────
// ADMIN MODE  — type  :admin  anywhere on the page to unlock
// Password: MHA@2026   (SHA-256 hash stored below — change both)
// ──────────────────────────────────────────────────────────────
(function () {
  let ADMIN_HASH = '5f538cfec35d8773084a5ced1429dddca8fa2411643836fab1a88e8450dfd7ec';
  const OWNER = 'Hyderali1351', REPO = 'Portfolio-2026', FILE = 'index.html';
  const RECOVERY_EMAIL = 'mirhyderali619@gmail.com';

  let active = false;
  let buf = '';

  // Listen for :admin typed anywhere (not in inputs)
  document.addEventListener('keydown', e => {
    if (active) return;
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    buf = (buf + e.key).slice(-6);
    if (buf === ':admin') { buf = ''; showLogin(); }
  });

  // ── Login modal ────────────────────────────────────────────
  function showLogin() {
    if (document.getElementById('adm-modal')) return;
    const m = document.createElement('div');
    m.id = 'adm-modal';
    m.innerHTML = `
      <div class="adm-box">
        <div class="adm-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span>Admin Access</span>
        </div>
        <input id="adm-pw" type="password" placeholder="Password" autocomplete="off" />
        <p id="adm-err" class="adm-err"></p>
        <div class="adm-btns">
          <button id="adm-cancel" class="adm-btn-ghost">Cancel</button>
          <button id="adm-enter" class="adm-btn-primary">Unlock</button>
        </div>
        <p style="text-align:center;margin-top:.75rem"><button id="adm-forgot" class="adm-link-btn">Forgot password?</button></p>
      </div>`;
    document.body.appendChild(m);
    const pw = document.getElementById('adm-pw');
    pw.focus();
    document.getElementById('adm-cancel').onclick = () => m.remove();
    document.getElementById('adm-enter').onclick  = () => tryLogin(m, pw.value);
    document.getElementById('adm-forgot').onclick = () => { m.remove(); showForgotPassword(); };
    pw.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(m, pw.value); });
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
  }

  async function tryLogin(modal, pw) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw));
    const hash = [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
    if (hash === ADMIN_HASH) {
      modal.remove();
      activateAdmin();
    } else {
      const err = document.getElementById('adm-err');
      err.textContent = 'Incorrect password';
      document.getElementById('adm-pw').classList.add('adm-shake');
      setTimeout(() => document.getElementById('adm-pw')?.classList.remove('adm-shake'), 500);
    }
  }

  // ── Forgot password ────────────────────────────────────────
  function showForgotPassword() {
    const m = document.createElement('div');
    m.id = 'adm-modal';
    m.innerHTML = `
      <div class="adm-box">
        <div class="adm-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
          <span>Password Recovery</span>
        </div>
        <p class="adm-hint" style="margin-bottom:.75rem">Enter your recovery email to get a one-time access code.</p>
        <input id="adm-rec-email" type="email" placeholder="Recovery email" autocomplete="off" />
        <p id="adm-err" class="adm-err"></p>
        <div class="adm-btns">
          <button id="adm-back" class="adm-btn-ghost">← Back</button>
          <button id="adm-send-otp" class="adm-btn-primary">Send Code</button>
        </div>
      </div>`;
    document.body.appendChild(m);
    document.getElementById('adm-rec-email').focus();
    document.getElementById('adm-back').onclick = () => { m.remove(); showLogin(); };
    document.getElementById('adm-send-otp').onclick = () => sendOtp(m);
    document.getElementById('adm-rec-email').addEventListener('keydown', e => { if (e.key === 'Enter') sendOtp(m); });
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
  }

  function sendOtp(modal) {
    const emailInput = document.getElementById('adm-rec-email');
    if (emailInput.value.trim().toLowerCase() !== RECOVERY_EMAIL.toLowerCase()) {
      document.getElementById('adm-err').textContent = 'Email not recognized';
      emailInput.classList.add('adm-shake');
      setTimeout(() => emailInput.classList.remove('adm-shake'), 500);
      return;
    }
    // Time-based 6-digit code, changes every 10 minutes
    const slot = Math.floor(Date.now() / 600000);
    const code = ((slot * 7919 + 31337) % 900000 + 100000).toString();
    modal.remove();
    showOtpEntry(code);
  }

  function showOtpEntry(code) {
    const m = document.createElement('div');
    m.id = 'adm-modal';
    m.innerHTML = `
      <div class="adm-box">
        <div class="adm-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.21 14.88a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.11 4h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 11.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 20.92z"/></svg>
          <span>Enter Access Code</span>
        </div>
        <p class="adm-hint" style="margin-bottom:.5rem">Your one-time code (valid 10 min):</p>
        <div class="adm-otp-display">${code}</div>
        <p class="adm-hint" style="margin:.6rem 0;font-size:.78rem;opacity:.6">Copy the code above and enter it below:</p>
        <input id="adm-otp-input" type="text" placeholder="6-digit code" maxlength="6" autocomplete="off" inputmode="numeric" />
        <p id="adm-err" class="adm-err"></p>
        <div class="adm-btns">
          <button id="adm-otp-cancel" class="adm-btn-ghost">Cancel</button>
          <button id="adm-otp-verify" class="adm-btn-primary">Verify &amp; Enter</button>
        </div>
      </div>`;
    document.body.appendChild(m);
    document.getElementById('adm-otp-input').focus();
    document.getElementById('adm-otp-cancel').onclick = () => m.remove();
    document.getElementById('adm-otp-verify').onclick = () => verifyOtp(m, code);
    document.getElementById('adm-otp-input').addEventListener('keydown', e => { if (e.key === 'Enter') verifyOtp(m, code); });
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
  }

  function verifyOtp(modal, code) {
    const entered = document.getElementById('adm-otp-input').value.trim();
    if (entered === code) {
      modal.remove();
      activateAdmin();
    } else {
      document.getElementById('adm-err').textContent = 'Incorrect code — check the number above';
      document.getElementById('adm-otp-input').classList.add('adm-shake');
      setTimeout(() => document.getElementById('adm-otp-input')?.classList.remove('adm-shake'), 500);
    }
  }

  // ── Activate edit mode ─────────────────────────────────────
  function activateAdmin() {
    active = true;

    // Build toolbar
    const bar = document.createElement('div');
    bar.id = 'adm-bar';
    bar.innerHTML = `
      <div class="adm-bar-l">
        <span class="adm-badge">⚡ Admin</span>
        <span class="adm-hint">Click any <span style="color:#a78bfa">highlighted</span> field to edit</span>
      </div>
      <div class="adm-bar-r">
        <button id="adm-add-exp"  class="adm-btn-add">＋ Experience</button>
        <button id="adm-add-proj" class="adm-btn-add">＋ Project</button>
        <button id="adm-save" class="adm-btn-primary">Save &amp; Publish</button>
        <button id="adm-exit" class="adm-btn-ghost">Exit</button>
      </div>`;
    document.body.appendChild(bar);

    // Make tagged elements editable
    document.querySelectorAll('[data-admin-key]').forEach(el => {
      el.contentEditable = 'true';
      el.classList.add('adm-field');
      el.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); el.blur(); } });
    });

    document.getElementById('adm-exit').onclick     = deactivateAdmin;
    document.getElementById('adm-save').onclick     = saveToGitHub;
    document.getElementById('adm-add-exp').onclick  = showAddExperience;
    document.getElementById('adm-add-proj').onclick = showAddProject;
  }

  function deactivateAdmin() {
    active = false;
    document.getElementById('adm-bar')?.remove();
    document.querySelectorAll('[data-admin-key]').forEach(el => {
      el.contentEditable = 'false';
      el.classList.remove('adm-field');
    });
  }

  // ── Add Experience ─────────────────────────────────────────
  const EXP_PRESETS = {
    hpc: {
      gc:'124,58,237', bar:'linear-gradient(90deg,#7c3aed,#4338ca)',
      bc:'rgba(124,58,237,0.18)', bbd:'rgba(124,58,237,0.5)', bco:'#a78bfa',
      icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 7V4M14 7V4M10 20v-3M14 20v-3M7 10H4M7 14H4M20 10h-3M20 14h-3"/></svg>`,
    },
    it: {
      gc:'37,99,235', bar:'linear-gradient(90deg,#2563eb,#0891b2)',
      bc:'rgba(37,99,235,0.18)', bbd:'rgba(37,99,235,0.5)', bco:'#60a5fa',
      icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
    },
    edu: {
      gc:'190,24,93', bar:'linear-gradient(90deg,#be185d,#7c3aed)',
      bc:'rgba(190,24,93,0.18)', bbd:'rgba(190,24,93,0.5)', bco:'#f472b6',
      icon:`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M12 13L2 8l10-5 10 5-10 5z"/><path d="M6 10.6V16a6 6 0 0 0 12 0v-5.4"/></svg>`,
    },
  };

  function showAddExperience() {
    const m = document.createElement('div');
    m.id = 'adm-modal';
    m.innerHTML = `
      <div class="adm-box adm-box--wide">
        <div class="adm-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          <span>Add Experience</span>
        </div>
        <div class="adm-form-grid">
          <label class="adm-label">Job Title
            <input id="af-title" type="text" placeholder="AI HPC Engineer" />
          </label>
          <label class="adm-label">Company &amp; Location
            <input id="af-company" type="text" placeholder="ACME Corp · City, ST" />
          </label>
          <label class="adm-label">Date Range
            <input id="af-date" type="text" placeholder="Jan 2024 – Present" />
          </label>
          <label class="adm-label">Category
            <select id="af-cat">
              <option value="hpc">AI &amp; HPC</option>
              <option value="it">IT Systems</option>
              <option value="edu">Education</option>
            </select>
          </label>
          <label class="adm-label" style="grid-column:1/-1">Brief Description
            <textarea id="af-blurb" rows="2" placeholder="One-line summary shown on card..."></textarea>
          </label>
          <label class="adm-label" style="grid-column:1/-1">Tags (comma-separated)
            <input id="af-tags" type="text" placeholder="Python, Kubernetes, InfiniBand" />
          </label>
          <label class="adm-label" style="grid-column:1/-1">Bullet Points (one per line)
            <textarea id="af-bullets" rows="4" placeholder="Deployed GPU clusters&#10;Configured InfiniBand fabric"></textarea>
          </label>
        </div>
        <p id="adm-err" class="adm-err"></p>
        <div class="adm-btns">
          <button id="af-cancel" class="adm-btn-ghost">Cancel</button>
          <button id="af-add" class="adm-btn-primary">Add Card</button>
        </div>
      </div>`;
    document.body.appendChild(m);
    document.getElementById('af-title').focus();
    document.getElementById('af-cancel').onclick = () => m.remove();
    document.getElementById('af-add').onclick = () => createExpCard(m);
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
  }

  function createExpCard(modal) {
    const title     = document.getElementById('af-title').value.trim();
    const company   = document.getElementById('af-company').value.trim();
    const date      = document.getElementById('af-date').value.trim();
    const cat       = document.getElementById('af-cat').value;
    const blurb     = document.getElementById('af-blurb').value.trim();
    const tagStr    = document.getElementById('af-tags').value.trim();
    const bulletStr = document.getElementById('af-bullets').value.trim();

    if (!title || !company) {
      document.getElementById('adm-err').textContent = 'Title and company are required';
      return;
    }

    const p = EXP_PRESETS[cat] || EXP_PRESETS.it;
    const tags    = tagStr    ? tagStr.split(',').map(t => `<span>${t.trim()}</span>`).join('') : '';
    const bullets = bulletStr ? bulletStr.split('\n').filter(Boolean).map(b => `<li>${b.replace(/^[•\-–]\s*/, '')}</li>`).join('') : '';
    const expIdx  = document.querySelectorAll('.exp-bubble').length;

    const html = `
      <div class="exp-bubble" data-category="${cat}">
        <div class="exp-bubble-glow" style="--gc:${p.gc}"></div>
        <div class="exp-bubble-bar" style="--bar:${p.bar}"></div>
        <div class="exp-bubble-inner">
          <div class="exp-bubble-top">
            <div class="exp-bubble-badge" style="--bc:${p.bc};--bbd:${p.bbd};--bco:${p.bco}">${p.icon}</div>
            <span class="exp-bubble-date">${date}</span>
          </div>
          <h3 class="exp-bubble-title" data-admin-key="exp.${expIdx}.title" contenteditable="true" class="adm-field">${title}</h3>
          <span class="exp-bubble-company" data-admin-key="exp.${expIdx}.company" contenteditable="true" class="adm-field">${company}</span>
          ${blurb ? `<p class="exp-bubble-blurb" data-admin-key="exp.${expIdx}.blurb" contenteditable="true" class="adm-field">${blurb}</p>` : ''}
          ${tags ? `<div class="exp-tags exp-tags--preview">${tags}</div>` : ''}
          ${bullets ? `<button class="exp-expand-btn" aria-label="Toggle details">
            <svg class="exp-expand-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            <span class="exp-expand-label">See all details</span>
          </button>
          <div class="exp-bubble-body"><ul class="exp-bullets">${bullets}</ul></div>` : ''}
        </div>
      </div>`;

    const bento = document.querySelector('.exp-bento');
    if (!bento) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = html.trim();
    const newCard = tmp.firstElementChild;
    // Mark editable fields with the adm-field class
    newCard.querySelectorAll('[data-admin-key]').forEach(el => {
      el.classList.add('adm-field');
      el.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); el.blur(); } });
    });

    // Insert before the edu card, or append
    const eduCard = bento.querySelector('.exp-bubble--edu');
    if (eduCard) bento.insertBefore(newCard, eduCard);
    else bento.appendChild(newCard);

    // Entrance animation
    if (window.gsap) gsap.fromTo(newCard, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out' });

    // Wire up GSAP expand/collapse
    if (window.admReinitExpCard) window.admReinitExpCard(newCard);

    modal.remove();
  }

  // ── Add Project ────────────────────────────────────────────
  const PROJ_GRADIENTS = {
    ai:    'radial-gradient(ellipse at 60% 30%,rgba(139,92,246,.22) 0%,transparent 65%),radial-gradient(ellipse at 20% 70%,rgba(236,72,153,.14) 0%,transparent 55%)',
    hpc:   'radial-gradient(ellipse at 70% 20%,rgba(96,165,250,.2) 0%,transparent 65%),radial-gradient(ellipse at 30% 80%,rgba(52,211,153,.12) 0%,transparent 55%)',
    web:   'radial-gradient(ellipse at 50% 20%,rgba(251,191,36,.18) 0%,transparent 65%),radial-gradient(ellipse at 70% 80%,rgba(167,139,250,.14) 0%,transparent 55%)',
    other: 'radial-gradient(ellipse at 50% 50%,rgba(100,100,100,.2) 0%,transparent 65%)',
  };

  function showAddProject() {
    const m = document.createElement('div');
    m.id = 'adm-modal';
    m.innerHTML = `
      <div class="adm-box adm-box--wide">
        <div class="adm-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          <span>Add Project</span>
        </div>
        <div class="adm-form-grid">
          <label class="adm-label">Project Name
            <input id="pf-name" type="text" placeholder="My Awesome Project" />
          </label>
          <label class="adm-label">Icon (emoji)
            <input id="pf-icon" type="text" placeholder="🚀" maxlength="4" />
          </label>
          <label class="adm-label">Type
            <select id="pf-type">
              <option value="ai">AI / ML</option>
              <option value="hpc">HPC / Infrastructure</option>
              <option value="web">Web</option>
              <option value="other">Other</option>
            </select>
          </label>
          <label class="adm-label">GitHub Link
            <input id="pf-link" type="url" placeholder="https://github.com/..." />
          </label>
          <label class="adm-label" style="grid-column:1/-1">Description
            <textarea id="pf-desc" rows="3" placeholder="What does this project do?"></textarea>
          </label>
          <label class="adm-label" style="grid-column:1/-1">Tags (comma-separated)
            <input id="pf-tags" type="text" placeholder="Python, React, Kubernetes" />
          </label>
        </div>
        <p id="adm-err" class="adm-err"></p>
        <div class="adm-btns">
          <button id="pf-cancel" class="adm-btn-ghost">Cancel</button>
          <button id="pf-add" class="adm-btn-primary">Add Project</button>
        </div>
      </div>`;
    document.body.appendChild(m);
    document.getElementById('pf-name').focus();
    document.getElementById('pf-cancel').onclick = () => m.remove();
    document.getElementById('pf-add').onclick = () => createProjCard(m);
    m.addEventListener('click', e => { if (e.target === m) m.remove(); });
  }

  function createProjCard(modal) {
    const name   = document.getElementById('pf-name').value.trim();
    const icon   = document.getElementById('pf-icon').value.trim() || '📁';
    const type   = document.getElementById('pf-type').value;
    const link   = document.getElementById('pf-link').value.trim() || 'https://github.com/Hyderali1351';
    const desc   = document.getElementById('pf-desc').value.trim();
    const tagStr = document.getElementById('pf-tags').value.trim();

    if (!name) { document.getElementById('adm-err').textContent = 'Project name is required'; return; }

    const grad = PROJ_GRADIENTS[type] || PROJ_GRADIENTS.other;
    const tags  = tagStr ? tagStr.split(',').map(t => `<span>${t.trim()}</span>`).join('') : '';
    const delay = document.querySelectorAll('.project-card').length * 130;

    const html = `
      <div class="project-card" data-project="${type}" style="--delay:${delay}ms">
        <div class="scratch-bg" style="background:${grad}"></div>
        <canvas class="scratch-canvas"></canvas>
        <div class="scratch-hint">✦ scratch to peek</div>
        <div class="project-content">
          <div class="project-top">
            <span class="project-icon">${icon}</span>
            <div class="project-links"><a href="${link}" target="_blank">&#60;/&#62;</a></div>
          </div>
          <h3>${name}</h3>
          ${desc ? `<p>${desc}</p>` : ''}
          ${tags ? `<div class="project-tags">${tags}</div>` : ''}
        </div>
      </div>`;

    const grid = document.querySelector('.projects-grid');
    if (!grid) return;
    const tmp = document.createElement('div');
    tmp.innerHTML = html.trim();
    const newCard = tmp.firstElementChild;
    grid.appendChild(newCard);

    // Entrance animation
    if (window.gsap) gsap.fromTo(newCard, { autoAlpha: 0, scale: 0.92, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.6)' });

    // Wire up scratch + tilt
    if (window.admReinitScratchCard) window.admReinitScratchCard(newCard);
    if (window.admReinitTilt) window.admReinitTilt(newCard);

    modal.remove();
  }

  // ── Save via GitHub API ────────────────────────────────────
  async function saveToGitHub() {
    let pat = sessionStorage.getItem('adm_pat');
    if (!pat) {
      const m = document.createElement('div');
      m.id = 'adm-modal';
      m.innerHTML = `
        <div class="adm-box">
          <div class="adm-header">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>GitHub Token</span>
          </div>
          <p class="adm-hint" style="margin-bottom:.5rem">Paste a fine-grained PAT with <strong>Contents: write</strong> for this repo. Stored in session only.</p>
          <details class="adm-pat-guide">
            <summary>How to create a token ▸</summary>
            <ol>
              <li>Go to <a href="https://github.com/settings/tokens?type=beta" target="_blank" rel="noopener">github.com/settings/tokens</a></li>
              <li>Click <strong>Generate new token</strong></li>
              <li>Name it (e.g. <em>Portfolio Admin</em>) and set an expiration</li>
              <li><strong>Repository access</strong> → Only select repositories → <strong>Portfolio-2026</strong></li>
              <li><strong>Permissions → Repository permissions → Contents</strong> → <em>Read and write</em></li>
              <li>Click <strong>Generate token</strong>, copy it, paste below</li>
            </ol>
          </details>
          <input id="adm-pat" type="password" placeholder="ghp_xxxxxxxxxxxx" autocomplete="off" style="margin-top:.75rem" />
          <p id="adm-err" class="adm-err"></p>
          <div class="adm-btns">
            <button id="adm-cancel" class="adm-btn-ghost">Cancel</button>
            <button id="adm-pat-ok" class="adm-btn-primary">Continue</button>
          </div>
        </div>`;
      document.body.appendChild(m);
      document.getElementById('adm-pat').focus();
      document.getElementById('adm-cancel').onclick = () => m.remove();
      document.getElementById('adm-pat-ok').onclick = () => {
        const v = document.getElementById('adm-pat').value.trim();
        if (!v) { document.getElementById('adm-err').textContent = 'Token required'; return; }
        sessionStorage.setItem('adm_pat', v);
        m.remove();
        saveToGitHub();
      };
      document.getElementById('adm-pat').addEventListener('keydown', e => {
        if (e.key === 'Enter') document.getElementById('adm-pat-ok').click();
      });
      return;
    }

    const btn = document.getElementById('adm-save');
    btn.textContent = 'Saving…';
    btn.disabled = true;

    try {
      // Temporarily strip admin markup before capturing HTML
      document.querySelectorAll('[data-admin-key]').forEach(el => {
        el.contentEditable = 'false';
        el.classList.remove('adm-field');
      });
      const bar = document.getElementById('adm-bar');
      bar.style.display = 'none';

      // Capture clean HTML
      const rawHtml = '<!DOCTYPE html>\n' + document.documentElement.outerHTML;

      // Restore
      bar.style.display = '';
      document.querySelectorAll('[data-admin-key]').forEach(el => {
        el.contentEditable = 'true';
        el.classList.add('adm-field');
      });

      // Get current file SHA from GitHub
      const headers = { 'Authorization': `Bearer ${pat}`, 'Accept': 'application/vnd.github+json' };
      const meta = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`, { headers });
      if (!meta.ok) throw new Error(`GitHub API ${meta.status}`);
      const { sha } = await meta.json();

      // Encode and commit
      const content = btoa(unescape(encodeURIComponent(rawHtml)));
      const put = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`, {
        method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'Update portfolio content via admin', content, sha }),
      });

      if (!put.ok) {
        const body = await put.json().catch(() => ({}));
        if (put.status === 401) { sessionStorage.removeItem('adm_pat'); throw new Error('Token rejected — re-enter it next save'); }
        throw new Error(body.message || `HTTP ${put.status}`);
      }

      btn.textContent = '✓ Published!';
      btn.style.background = 'rgba(34,197,94,0.22)';
      setTimeout(() => { btn.textContent = 'Save & Publish'; btn.disabled = false; btn.style.background = ''; }, 3500);

    } catch (err) {
      btn.textContent = `Error: ${err.message}`;
      btn.disabled = false;
      setTimeout(() => { btn.textContent = 'Save & Publish'; }, 4000);
    }
  }
})();

// ── Typing animation ──
const titles = ["HPC Infrastructure Engineer", "AI Systems Builder", "Problem Solver", "Creative Coder"];
let ti = 0, ci = 0, deleting = false;
const typedEl = document.querySelector(".typed");
function type() {
  const current = titles[ti];
  typedEl.textContent = deleting ? current.slice(0, ci--) : current.slice(0, ci++);
  if (!deleting && ci > current.length) { deleting = true; setTimeout(type, 1500); return; }
  if (deleting && ci <= 0) { deleting = false; ti = (ti + 1) % titles.length; }
  setTimeout(type, deleting ? 55 : 95);
}
type();

// ── Mobile nav ──
document.querySelector(".nav-toggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("open");
});
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => document.querySelector(".nav-links").classList.remove("open"));
});
// Close mobile nav when tapping outside
document.addEventListener("click", (e) => {
  const nav = document.querySelector(".nav");
  if (!nav.contains(e.target)) document.querySelector(".nav-links").classList.remove("open");
});

// Scroll reveals handled by GSAP ScrollTrigger (see bottom of file)

// ── Nav bubble hover ──
const navList = document.querySelector(".nav-links");
const bubble = document.createElement("span");
bubble.className = "nav-bubble";
navList.appendChild(bubble);

let entered = false;
navList.querySelectorAll("li").forEach(li => {
  li.addEventListener("mouseenter", () => {
    bubble.style.width  = li.offsetWidth  + "px";
    bubble.style.left   = li.offsetLeft   + "px";
    if (!entered) {
      bubble.style.transition = "opacity 0.15s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)";
      entered = true;
    } else {
      bubble.style.transition =
        "left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)";
    }
    bubble.style.opacity   = "1";
    bubble.style.transform = "translateY(calc(-50% - 3px))";
    bubble.style.boxShadow = "inset 0 1.5px 2px rgba(255,255,255,0.55), inset 0 -1px 2px rgba(0,0,0,0.18), 0 8px 24px rgba(167,139,250,0.45), 0 2px 8px rgba(255,255,255,0.1)";
  });
});
navList.addEventListener("mouseleave", () => {
  bubble.style.opacity   = "0";
  bubble.style.transform = "translateY(-50%)";
  bubble.style.boxShadow = "";
  entered = false;
});

// ── Mouse tracking ──
let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let parallaxX = 0, parallaxY = 0;
let ringX = mouseX, ringY = mouseY;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  parallaxX = (e.clientX / window.innerWidth  - 0.5) * 2;
  parallaxY = (e.clientY / window.innerHeight - 0.5) * 2;
  curDot.style.left = mouseX + "px";
  curDot.style.top  = mouseY + "px";
  document.body.classList.remove("cur-out");
});

// Hover state
document.addEventListener("mouseover", e => {
  if (e.target.closest("a, button, [role=button], input, textarea, select, label, .btn, .nav-bubble")) {
    document.body.classList.add("cur-hover");
  }
});
document.addEventListener("mouseout", e => {
  if (e.target.closest("a, button, [role=button], input, textarea, select, label, .btn, .nav-bubble")) {
    document.body.classList.remove("cur-hover");
  }
});

// Click burst
document.addEventListener("mousedown", () => document.body.classList.add("cur-click"));
document.addEventListener("mouseup",   () => document.body.classList.remove("cur-click"));

// Hide when mouse leaves window
document.addEventListener("mouseleave", () => document.body.classList.add("cur-out"));
document.addEventListener("mouseenter", () => document.body.classList.remove("cur-out"));

// ── Custom cursor (dot + lagging ring) — desktop only ──
const isTouch = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
const curDot  = document.createElement("div"); curDot.className  = "cur-dot";
const curRing = document.createElement("div"); curRing.className = "cur-ring";
if (!isTouch) { document.body.appendChild(curDot); document.body.appendChild(curRing); }

// ── Scroll progress bar ──
const prog = document.getElementById("scroll-prog");
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  prog.style.width = (docHeight > 0 ? scrollTop / docHeight * 100 : 0) + "%";
}, { passive: true });

// ─────────────────────────────────────────
// AURORA CANVAS BACKGROUND
// Rich flowing mesh-gradient — 9 color sources
// each drifts in a sinusoidal path + mouse parallax
// ─────────────────────────────────────────
const aCanvas = document.getElementById("bg-aurora");
const aCtx    = aCanvas.getContext("2d");

function resizeAurora() {
  if (window.__stopAurora) return; // Three.js owns the canvas
  aCanvas.width  = window.innerWidth;
  aCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeAurora, { passive: true });
resizeAurora();

// Each source: normalized center, radius fraction, RGB, phase offsets, motion scale
const sources = [
  { x:0.12, y:0.18, r:0.58, c:[108,46,230],  px:0.18, py:0.14, ox:0.0, oy:0.0, sx:0.00022, sy:0.00028, d:0.06 },
  { x:0.82, y:0.14, r:0.52, c:[28,76,218],   px:0.20, py:0.16, ox:1.2, oy:0.7, sx:0.00028, sy:0.00022, d:0.05 },
  { x:0.52, y:0.82, r:0.50, c:[182,18,98],   px:0.14, py:0.20, ox:2.3, oy:1.5, sx:0.00020, sy:0.00032, d:0.04 },
  { x:0.72, y:0.50, r:0.40, c:[0,155,185],   px:0.12, py:0.10, ox:0.8, oy:2.2, sx:0.00035, sy:0.00025, d:0.03 },
  { x:0.18, y:0.66, r:0.44, c:[98,56,232],   px:0.16, py:0.14, ox:1.9, oy:0.4, sx:0.00018, sy:0.00038, d:0.05 },
  { x:0.86, y:0.76, r:0.42, c:[68,56,245],   px:0.18, py:0.16, ox:0.4, oy:1.8, sx:0.00030, sy:0.00026, d:0.04 },
  { x:0.38, y:0.28, r:0.36, c:[0,188,224],   px:0.10, py:0.18, ox:1.6, oy:1.0, sx:0.00032, sy:0.00020, d:0.03 },
  { x:0.08, y:0.88, r:0.40, c:[228,96,178],  px:0.14, py:0.12, ox:2.6, oy:1.3, sx:0.00025, sy:0.00030, d:0.04 },
  { x:0.58, y:0.08, r:0.34, c:[138,72,255],  px:0.22, py:0.08, ox:0.6, oy:2.5, sx:0.00038, sy:0.00024, d:0.05 },
];

let lastAuroraTs = 0;
function drawAurora(ts) {
  if (window.__stopAurora) return; // Three.js took over — stop loop
  requestAnimationFrame(drawAurora);
  if (ts - lastAuroraTs < 33) return; // ~30fps
  lastAuroraTs = ts;

  const W = aCanvas.width, H = aCanvas.height;
  aCtx.fillStyle = "#040110";
  aCtx.fillRect(0, 0, W, H);

  sources.forEach((s, i) => {
    const cx = (s.x + Math.sin(ts * s.sx + s.ox) * s.px + parallaxX * s.d) * W;
    const cy = (s.y + Math.cos(ts * s.sy + s.oy) * s.py + parallaxY * s.d) * H;
    const r  = s.r * Math.min(W, H);
    const g  = aCtx.createRadialGradient(cx, cy, 0, cx, cy, r);
    const [red, grn, blu] = s.c;
    g.addColorStop(0,   `rgba(${red},${grn},${blu},0.55)`);
    g.addColorStop(0.45,`rgba(${red},${grn},${blu},0.18)`);
    g.addColorStop(1,   `rgba(${red},${grn},${blu},0)`);
    aCtx.fillStyle = g;
    aCtx.fillRect(0, 0, W, H);
  });
}
requestAnimationFrame(drawAurora);

// ── Spider web particle layer (desktop only) ──
if (!isTouch) (function () {
  const wc   = document.getElementById("web-canvas");
  const wCtx = wc.getContext("2d");
  const NODES    = 60;
  const MAX_DIST = 155;
  const PAD      = 35; // soft-bounce zone near edges

  function resize() {
    wc.width  = window.innerWidth;
    wc.height = window.innerHeight;
  }
  window.addEventListener("resize", resize, { passive: true });
  resize();

  // Spread particles evenly across the whole viewport from the start
  const pts = Array.from({ length: NODES }, () => ({
    x:  PAD + Math.random() * (window.innerWidth  - PAD * 2),
    y:  PAD + Math.random() * (window.innerHeight - PAD * 2),
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
  }));

  // Cache nav-link centres (nav is position:fixed so these stay stable)
  let navCentres = [];
  function cacheNav() {
    navCentres = Array.from(document.querySelectorAll(".nav-links a")).map(el => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
  }
  requestAnimationFrame(cacheNav); // run after first paint
  window.addEventListener("resize", cacheNav, { passive: true });

  let lastTs = 0;
  function drawWeb(ts) {
    if (window.__killSpiderWeb) return; // Three.js scene is active — stop this loop
    requestAnimationFrame(drawWeb);
    if (window.__lightMode) { wCtx.clearRect(0, 0, wc.width, wc.height); return; }
    if (ts - lastTs < 33) return;
    lastTs = ts;

    const W = wc.width, H = wc.height;
    wCtx.clearRect(0, 0, W, H);

    pts.forEach(p => {
      // Soft edge repulsion — keeps particles distributed across the full canvas
      if (p.x < PAD)   p.vx += 0.055;
      if (p.x > W-PAD) p.vx -= 0.055;
      if (p.y < PAD)   p.vy += 0.055;
      if (p.y > H-PAD) p.vy -= 0.055;

      // Speed cap (no global attractor — prevents clustering)
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > 0.65) { p.vx = p.vx / spd * 0.65; p.vy = p.vy / spd * 0.65; }

      p.x += p.vx;
      p.y += p.vy;
      // Safety wrap if repulsion isn't enough
      if (p.x < -8) p.x = W + 8; if (p.x > W + 8) p.x = -8;
      if (p.y < -8) p.y = H + 8; if (p.y > H + 8) p.y = -8;
    });

    // Particle ↔ particle edges
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const a = (1 - d / MAX_DIST) * 0.45;
          wCtx.beginPath();
          wCtx.moveTo(pts[i].x, pts[i].y);
          wCtx.lineTo(pts[j].x, pts[j].y);
          wCtx.strokeStyle = `rgba(196,181,253,${a.toFixed(3)})`;
          wCtx.lineWidth = 1.0;
          wCtx.stroke();
        }
      }
    }

    // Nearest particle → each nav link (web "reaches" toward the nav buttons)
    navCentres.forEach(nc => {
      let closest = null, minD = 210;
      pts.forEach(p => {
        const d = Math.hypot(p.x - nc.x, p.y - nc.y);
        if (d < minD) { minD = d; closest = p; }
      });
      if (closest) {
        const a = (1 - minD / 210) * 0.65;
        wCtx.beginPath();
        wCtx.moveTo(closest.x, closest.y);
        wCtx.lineTo(nc.x, nc.y);
        wCtx.strokeStyle = `rgba(167,139,250,${a.toFixed(3)})`;
        wCtx.lineWidth = 1.2;
        wCtx.stroke();
      }
    });

    // Mouse connections (visual only — no attraction force)
    pts.forEach(p => {
      const md = Math.hypot(p.x - mouseX, p.y - mouseY);
      if (md < 190) {
        const a = (1 - md / 190) * 0.65;
        wCtx.beginPath();
        wCtx.moveTo(p.x, p.y);
        wCtx.lineTo(mouseX, mouseY);
        wCtx.strokeStyle = `rgba(167,139,250,${a.toFixed(3)})`;
        wCtx.lineWidth = 1.2;
        wCtx.stroke();
      }
    });

    // Dots
    pts.forEach(p => {
      wCtx.beginPath();
      wCtx.arc(p.x, p.y, 1.35, 0, Math.PI * 2);
      wCtx.fillStyle = "rgba(196,181,253,0.65)";
      wCtx.fill();
    });
  }
  requestAnimationFrame(drawWeb);
})();

// ── Light mode bubble canvas ──
(function initBubbleCanvas() {
  const bc = document.getElementById('bubble-canvas');
  if (!bc) return;
  const bCtx = bc.getContext('2d');

  const COLORS = [
    [167, 139, 250], // lavender
    [252, 129, 109], // coral
    [110, 231, 183], // mint
    [147, 197, 253], // sky blue
    [244, 114, 182], // rose
    [251, 191,  36], // amber
    [253, 186, 116], // peach
    [196, 181, 253], // soft violet
    [134, 239, 172], // light green
    [165, 243, 252], // cyan
  ];

  function resize() {
    bc.width  = window.innerWidth;
    bc.height = window.innerHeight;
  }
  window.addEventListener('resize', resize, { passive: true });
  resize();

  function mkBubble(startRandom) {
    const r = 3 + Math.random() * 19;
    const c = COLORS[Math.floor(Math.random() * COLORS.length)];
    return {
      x:      Math.random() * window.innerWidth,
      y:      startRandom ? Math.random() * window.innerHeight : window.innerHeight + r + 12,
      r,
      color:  c,
      alpha:  0.18 + Math.random() * 0.28,
      speed:  0.22 + Math.random() * 0.72,
      drift:  (Math.random() - 0.5) * 0.38,
      phase:  Math.random() * Math.PI * 2,
      wobble: 0.18 + Math.random() * 0.48,
    };
  }

  const bubbles = Array.from({ length: 55 }, () => mkBubble(true));

  let lastBubbleTs = 0;
  function drawBubbles(ts) {
    requestAnimationFrame(drawBubbles);
    if (!window.__lightMode) { bCtx.clearRect(0, 0, bc.width, bc.height); return; }
    if (ts - lastBubbleTs < 33) return;
    lastBubbleTs = ts;

    const W = bc.width, H = bc.height;
    bCtx.clearRect(0, 0, W, H);

    bubbles.forEach(b => {
      b.y -= b.speed;
      b.x += Math.sin(ts * 0.0008 * b.wobble + b.phase) * b.drift;

      if (b.y + b.r < 0) {
        Object.assign(b, mkBubble(false));
        b.x = Math.random() * W;
      }

      // Fade in near bottom, fade out near top
      const fade = H * 0.13;
      let a = b.alpha;
      if (b.y > H - fade) a *= (H - b.y) / fade;
      if (b.y < fade)     a *= b.y / fade;
      if (a < 0.01) return;

      const [r, g, bl] = b.color;

      // Soft outer glow
      const glow = bCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r * 2.8);
      glow.addColorStop(0, `rgba(${r},${g},${bl},${(a * 0.28).toFixed(3)})`);
      glow.addColorStop(1, 'rgba(0,0,0,0)');
      bCtx.beginPath();
      bCtx.arc(b.x, b.y, b.r * 2.8, 0, Math.PI * 2);
      bCtx.fillStyle = glow;
      bCtx.fill();

      // Main bubble with sphere gradient (highlight top-left → colored fill → transparent edge)
      const grad = bCtx.createRadialGradient(
        b.x - b.r * 0.32, b.y - b.r * 0.32, b.r * 0.05,
        b.x, b.y, b.r
      );
      grad.addColorStop(0,    `rgba(255,255,255,${(a * 0.72).toFixed(3)})`);
      grad.addColorStop(0.38, `rgba(${r},${g},${bl},${(a * 0.92).toFixed(3)})`);
      grad.addColorStop(1,    `rgba(${r},${g},${bl},${(a * 0.22).toFixed(3)})`);
      bCtx.beginPath();
      bCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      bCtx.fillStyle = grad;
      bCtx.fill();

      // Small specular dot
      if (b.r > 5) {
        bCtx.beginPath();
        bCtx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.18, 0, Math.PI * 2);
        bCtx.fillStyle = `rgba(255,255,255,${(a * 0.52).toFixed(3)})`;
        bCtx.fill();
      }
    });
  }
  requestAnimationFrame(drawBubbles);
})();

// ── Visitor counter ──
(function () {
  const ct = document.getElementById("vc-count");
  if (!ct) return;

  // hitscounter.dev: free, CORS-enabled, persists across all devices
  // OFFSET bridges the gap between the live API count and the ~484 already shown
  const API_URL     = 'https://hitscounter.dev/api/hit?url=mirhyderali.com%2Fportfolio';
  const OFFSET      = 481;  // displayed = OFFSET + live API count (starts ≈484)
  const LOCAL_KEY   = 'mha_vc_live';
  const SESSION_KEY = 'mha_vs';

  function animateTo(target) {
    const from = Math.max(target - 8, 0);
    let cur = from;
    ct.textContent = from.toLocaleString();
    const iv = setInterval(() => {
      cur = Math.min(cur + 1, target);
      ct.textContent = cur.toLocaleString();
      if (cur >= target) clearInterval(iv);
    }, 55);
  }

  // Show last-known value immediately so there's no blank flash
  const cached = parseInt(localStorage.getItem(LOCAL_KEY) || '0', 10);
  if (cached) animateTo(cached);

  const isNewSession = !sessionStorage.getItem(SESSION_KEY);
  if (isNewSession) sessionStorage.setItem(SESSION_KEY, '1');

  if (isNewSession) {
    // New browser session → call API (increments counter server-side), read total
    fetch(API_URL, { cache: 'no-cache' })
      .then(r => r.text())
      .then(svg => {
        // SVG title format: "<title>today / total</title>"
        const m = svg.match(/<title>([\d,]+)\s*\/\s*([\d,]+)<\/title>/);
        if (!m) throw new Error('parse fail');
        const apiTotal = parseInt(m[2].replace(/,/g, ''), 10);
        const display  = OFFSET + apiTotal;
        localStorage.setItem(LOCAL_KEY, display);
        animateTo(display);
      })
      .catch(() => {
        // API down — fall back to cached or seed
        if (!cached) animateTo(OFFSET);
      });
  } else {
    // Same session — don't re-increment; cached value already shown above
    if (!cached) animateTo(OFFSET);
  }
})();

// ── Clock widget ──
(function () {
  const DAYS  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function tick() {
    const now  = new Date();
    const h24  = now.getHours();
    const ampm = h24 >= 12 ? 'PM' : 'AM';
    const h12  = h24 % 12 || 12;
    const hh   = String(h12).padStart(2, '0');
    const mm   = String(now.getMinutes()).padStart(2, '0');
    const ss   = String(now.getSeconds()).padStart(2, '0');
    const el   = document.getElementById('clock-time');
    const de   = document.getElementById('clock-date');
    if (el) el.textContent = `${hh}:${mm}:${ss} ${ampm}`;
    if (de) de.textContent = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;
  }
  tick();
  setInterval(tick, 1000);
})();

// ── Theme toggle ──
(function () {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  function applyTheme(isLight, store) {
    if (isLight) {
      document.documentElement.setAttribute('data-theme', 'light');
      window.__lightMode = true;
      if (store) localStorage.setItem('mha_theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      window.__lightMode = false;
      if (store) localStorage.setItem('mha_theme', 'dark');
    }
    document.querySelectorAll('.scratch-canvas').forEach(c => { if (c._repaintScratch) c._repaintScratch(); });
  }

  btn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    applyTheme(!isLight, true);
    btn.classList.add('theme-clicked');
    setTimeout(() => btn.classList.remove('theme-clicked'), 350);
  });

  // Follow system preference changes when user has no stored override
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (!localStorage.getItem('mha_theme')) applyTheme(e.matches, false);
    });
  }
})();

// ── RAF loop: ring lerp (desktop only) ──
if (!isTouch) (function ringLoop() {
  ringX += (mouseX - ringX) * 0.11;
  ringY += (mouseY - ringY) * 0.11;
  curRing.style.left = ringX + "px";
  curRing.style.top  = ringY + "px";
  requestAnimationFrame(ringLoop);
})();

// ── Contact form → Formspree ──
// To activate: sign up free at formspree.io, create a form, paste your form ID below
const FORMSPREE_ID = "YOUR_FORM_ID"; // ← replace with your Formspree form ID

async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const msg  = document.getElementById("form-msg");
  const btn  = form.querySelector("button[type=submit]");

  if (FORMSPREE_ID === "YOUR_FORM_ID") {
    // Fallback: open mail client if Formspree not configured
    const name    = form.name.value;
    const email   = form.email.value;
    const message = form.message.value;
    window.location.href = `mailto:mirhyderali619@gmail.com?subject=Portfolio message from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + "\n\nFrom: " + email)}`;
    return;
  }

  btn.textContent = "Sending…";
  btn.disabled = true;

  try {
    const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      msg.textContent = "✓ Message sent — I'll get back to you soon!";
      msg.style.color = "#4ade80";
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    msg.textContent = "Something went wrong — email me directly.";
    msg.style.color = "#f87171";
  } finally {
    btn.textContent = "Send Message";
    btn.disabled = false;
  }
}

// ─────────────────────────────────────────
// INTRO — Clean door reveal (no canvas)
// ─────────────────────────────────────────────────────
{
  const intro = document.getElementById("intro");
  if (intro) {
    const fireIntroDone = () => window.dispatchEvent(new CustomEvent('intro-done'));
    // Brief pause so the scan animation shows, then doors split open
    setTimeout(() => {
      intro.classList.add('door-open');
      setTimeout(() => { intro.remove(); fireIntroDone(); }, 680);
    }, 700);
    // Hard safety fallback
    setTimeout(() => {
      if (intro.isConnected) {
        intro.classList.add('door-open');
        setTimeout(() => { intro.remove(); fireIntroDone(); }, 680);
      }
    }, 4000);
  }
}

// ── Gaming / desk scene activation ──
// Gaming scene activation handled by GSAP ScrollTrigger (see bottom of file)

function activateScene() {
  const screen    = document.getElementById("s-screen");
  const tower     = document.getElementById("s-tower");
  const fanInner  = document.getElementById("s-fan-inner");
  const rgb       = document.getElementById("s-rgb");
  const kbd       = document.getElementById("s-kbd");
  const glow      = document.getElementById("scene-glow");
  const floorGrid = document.querySelector(".r-floor-grid");
  const chairRgb  = document.querySelector(".r-chair-rgb");

  setTimeout(() => { if (rgb) rgb.classList.add("on"); }, 350);
  setTimeout(() => {
    if (tower)    tower.classList.add("on");
    if (fanInner) { fanInner.style.animationDuration = "2s"; fanInner.classList.add("spin"); }
  }, 650);
  setTimeout(() => { if (fanInner) fanInner.style.animationDuration = "0.45s"; }, 1500);
  setTimeout(() => { if (screen) screen.classList.add("on"); }, 1100);
  setTimeout(() => {
    if (glow)      glow.classList.add("on");
    if (floorGrid) floorGrid.classList.add("active");
  }, 1700);
  setTimeout(() => { if (kbd) kbd.classList.add("on"); }, 2100);
  setTimeout(() => { if (chairRgb) chairRgb.classList.add("on"); }, 2500);
}

// ── Resume puzzle easter egg ──────────────────────────
// Trigger: type "sudo" anywhere on the page (not in an input)
// Login:   mirhyderali
// Password: MHA  (hint: watch the intro logo)
const TRIGGER = 'sudo';
let triggerBuf = '';

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closePuzzle(); return; }
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key.length !== 1) return;
  triggerBuf = (triggerBuf + e.key.toLowerCase()).slice(-TRIGGER.length);
  if (triggerBuf === TRIGGER) { triggerBuf = ''; openPuzzle(); }
});

const puzzleOverlay = document.getElementById('puzzle-overlay');
const puzzleOut     = document.getElementById('puzzle-out');
const puzzleInput   = document.getElementById('puzzle-input');
const puzzlePrompt  = document.getElementById('puzzle-prompt');

let pStage = 'idle'; // idle | login | password | done

function pLine(text, dim = false) {
  const el = document.createElement('div');
  el.className = 'tline' + (dim ? ' tline-dim' : '');
  el.textContent = text;
  puzzleOut.appendChild(el);
  puzzleOut.scrollTop = puzzleOut.scrollHeight;
}

function openPuzzle() {
  puzzleOut.innerHTML = '';
  pStage = 'login';
  puzzleInput.type = 'text';
  puzzleInput.value = '';
  puzzleInput.disabled = false;
  puzzlePrompt.textContent = 'login: ';
  puzzleOverlay.classList.add('show');
  pLine('> CLASSIFIED FILE DETECTED');
  pLine('> AUTHENTICATION REQUIRED', true);
  pLine('> login as: mirhyderali', true);
  setTimeout(() => puzzleInput.focus(), 300);
}

function closePuzzle() {
  puzzleOverlay.classList.remove('show');
  pStage = 'idle';
}

puzzleOverlay.addEventListener('click', e => {
  if (e.target === puzzleOverlay) closePuzzle();
});

puzzleInput.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const val = puzzleInput.value.trim();
  puzzleInput.value = '';

  if (pStage === 'login') {
    pLine('login: ' + val);
    if (val.toLowerCase() === 'mirhyderali') {
      pStage = 'done';
      puzzlePrompt.textContent = '';
      puzzleInput.disabled = true;
      pLine('> DECRYPTING CLASSIFIED FILE...');
      const barEl = document.createElement('div');
      barEl.className = 'tline tline-dim';
      puzzleOut.appendChild(barEl);
      let step = 0;
      const iv = setInterval(() => {
        step++;
        barEl.textContent = '  [' + '█'.repeat(step) + '░'.repeat(20 - step) + '] ' + (step * 5) + '%';
        puzzleOut.scrollTop = puzzleOut.scrollHeight;
        if (step >= 20) {
          clearInterval(iv);
          pLine('> resume.pdf ── UNLOCKED ✓');
          setTimeout(() => {
            const a = document.createElement('a');
            a.href = 'resume.pdf';
            a.download = 'MirHyderAli_Resume.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(closePuzzle, 1800);
          }, 400);
        }
      }, 55);
    } else {
      pLine('> unknown user — try again', true);
    }
  }

  puzzleInput.focus();
});

// ─────────────────────────────────────────
// GSAP PRO MAX ANIMATIONS + LENIS SMOOTH SCROLL
// ─────────────────────────────────────────
(function initProAnimations() {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // ── GSAP background blobs ──
  document.querySelectorAll('.bg-blob').forEach((blob, i) => {
    gsap.to(blob, {
      x: `random(${-80 - i * 18}, ${80 + i * 18})`,
      y: `random(${-60 - i * 14}, ${60 + i * 14})`,
      scale: gsap.utils.random(0.86, 1.14),
      duration: gsap.utils.random(11, 20),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 1.4,
    });
  });

  // ── GSAP floating particles in hero ──
  const heroEl = document.querySelector('.hero');
  if (heroEl) {
    const DOT_COLORS = ['#7c3aed','#2563eb','#be185d','#0891b2','#6d28d9','#a78bfa'];
    for (let i = 0; i < 24; i++) {
      const dot = document.createElement('div');
      dot.className = 'float-dot';
      const size = 2 + Math.random() * 4;
      const col  = DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)];
      Object.assign(dot.style, {
        width:  size + 'px',
        height: size + 'px',
        left:   Math.random() * 100 + '%',
        top:    (35 + Math.random() * 65) + '%',
        background: col,
        opacity: String(0.45 + Math.random() * 0.5),
        boxShadow: `0 0 ${size * 2.5}px ${col}`,
      });
      heroEl.appendChild(dot);
      gsap.to(dot, {
        y: -(200 + Math.random() * 260),
        x: (Math.random() - 0.5) * 90,
        opacity: 0,
        duration: 4.5 + Math.random() * 7,
        repeat: -1,
        delay: Math.random() * 7,
        ease: 'power1.in',
      });
    }
  }

  // Native scroll — spider-web canvas is lightweight;
  // no extra smooth-scroll layer to avoid RAF budget overrun.

  // ── Hero: set initial hidden state, reveal after intro ──
  const heroEls = [".hero-greeting", ".hero-name", ".hero-title", ".hero-sub", ".hero-cta"];
  gsap.set(heroEls, { autoAlpha: 0, y: 55 });
  gsap.set(".code-window", {
    autoAlpha: 0, x: 90,
    transformPerspective: 1000, rotationY: -5, rotationX: 3
  });

  function animateHero() {
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .to(".hero-greeting", { autoAlpha: 1, y: 0, duration: 0.8 })
      .to(".hero-name",     { autoAlpha: 1, y: 0, duration: 1.0, ease: "back.out(1.4)" }, "-=0.5")
      .to(".hero-title",    { autoAlpha: 1, y: 0, duration: 0.75 }, "-=0.55")
      .to(".hero-sub",      { autoAlpha: 1, y: 0, duration: 0.7  }, "-=0.45")
      .to(".hero-cta",      { autoAlpha: 1, y: 0, duration: 0.6  }, "-=0.4")
      .to(".code-window",   { autoAlpha: 1, x: 0, duration: 1.1, ease: "back.out(1.25)" }, "-=0.7");

    gsap.to(".code-window", {
      y: -16, duration: 3.8, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.4
    });
  }

  if (document.getElementById('intro')) {
    window.addEventListener('intro-done', animateHero, { once: true });
  } else {
    setTimeout(animateHero, 80);
  }

  // Code window hover: rotate to 0 on enter, restore on leave
  const codeWin = document.querySelector(".code-window");
  if (codeWin) {
    codeWin.addEventListener("mouseenter", () =>
      gsap.to(codeWin, { rotationY: 0, rotationX: 0, duration: 0.7, ease: "power3.out" })
    );
    codeWin.addEventListener("mouseleave", () =>
      gsap.to(codeWin, { rotationY: -5, rotationX: 3, duration: 0.7, ease: "power3.out" })
    );
  }

  // ── Scroll reveals (once: no re-animation on scroll-up = fast) ──────
  gsap.utils.toArray(".reveal").forEach(el => {
    const delay = parseFloat(el.style.getPropertyValue("--delay") || "0") / 1000;
    gsap.fromTo(el,
      { y: 60, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.85, ease: "power3.out", delay,
        scrollTrigger: { trigger: el, start: "top 88%", once: true } }
    );
  });

  gsap.utils.toArray(".reveal-left").forEach(el => {
    const delay = parseFloat(el.style.getPropertyValue("--delay") || "0") / 1000;
    gsap.fromTo(el,
      { x: -70, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.85, ease: "power3.out", delay,
        scrollTrigger: { trigger: el, start: "top 85%", once: true } }
    );
  });

  gsap.utils.toArray(".reveal-right").forEach(el => {
    const delay = parseFloat(el.style.getPropertyValue("--delay") || "0") / 1000;
    gsap.fromTo(el,
      { x: 70, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.85, ease: "power3.out", delay,
        scrollTrigger: { trigger: el, start: "top 85%", once: true } }
    );
  });

  gsap.utils.toArray(".reveal-scale").forEach(el => {
    const delay = parseFloat(el.style.getPropertyValue("--delay") || "0") / 1000;
    gsap.fromTo(el,
      { scale: 0.82, y: 35, autoAlpha: 0 },
      { scale: 1, y: 0, autoAlpha: 1, duration: 0.72, ease: "back.out(1.6)", delay,
        scrollTrigger: { trigger: el, start: "top 88%", once: true } }
    );
  });

  // ── Stat counter animation ──
  gsap.utils.toArray(".stat-num").forEach(el => {
    const raw = el.textContent.trim();
    const match = raw.match(/\d+\.?\d*/);
    if (!match) return;
    const end = parseFloat(match[0]);
    if (isNaN(end)) return;
    const suffix = raw.slice(match[0].length);
    const proxy = { val: 0 };
    ScrollTrigger.create({
      trigger: el, start: "top 85%", once: true,
      onEnter: () => gsap.to(proxy, {
        val: end, duration: 2, ease: "power2.out",
        onUpdate() { el.textContent = Math.round(proxy.val) + suffix; }
      })
    });
  });

  // ── Gaming scene: activate RGB + fan on scroll (no zoom) ──
  const sceneEl = document.getElementById('setup-scene');
  if (sceneEl) {
    let sceneActivated = false;
    ScrollTrigger.create({
      trigger: sceneEl,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        if (!sceneActivated) { sceneActivated = true; activateScene(); }
      }
    });
  }

  // ── Experience bento: entrance stagger ──
  gsap.set('.exp-bubble', { autoAlpha: 0, y: 50, scale: 0.96 });
  ScrollTrigger.create({
    trigger: '#experience',
    start: 'top 72%',
    once: true,
    onEnter: () => {
      gsap.to('.exp-bubble', {
        autoAlpha: 1, y: 0, scale: 1,
        duration: 0.75, ease: 'power3.out', stagger: 0.14,
      });
    }
  });

  // ── Experience bento: hover = open, leave = close ──
  // Exposed globally so admin mode can reinit newly-created cards
  window.admReinitExpCard = function(bubble) {
    const badge   = bubble.querySelector('.exp-bubble-badge');
    const body    = bubble.querySelector('.exp-bubble-body');
    const icon    = bubble.querySelector('.exp-expand-icon');
    const bullets = bubble.querySelectorAll('.exp-bullets li');

    const naturalH = body ? body.scrollHeight : 0;
    if (body) gsap.set(body, { height: 0, opacity: 0 });

    function openCard() {
      gsap.to(bubble, { y: -6, scale: 1.012, boxShadow: '0 22px 52px rgba(0,0,0,0.72)', duration: 0.38, ease: 'power2.out' });
      gsap.to(badge,  { rotation: 12, scale: 1.12, duration: 0.42, ease: 'back.out(2.5)' });
      if (!body || naturalH === 0) return;
      gsap.to(body,   { height: naturalH, opacity: 1, duration: 0.48, ease: 'power3.out' });
      if (icon) gsap.to(icon, { rotation: 180, duration: 0.36, ease: 'back.out(1.8)' });
      gsap.fromTo(bullets,
        { opacity: 0, x: -14 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out', delay: 0.2 }
      );
    }

    function closeCard() {
      gsap.to(bubble, { y: 0, scale: 1, boxShadow: '0 8px 32px rgba(0,0,0,0.55)', duration: 0.5, ease: 'power3.out' });
      gsap.to(badge,  { rotation: 0, scale: 1, duration: 0.55, ease: 'elastic.out(1, 0.5)' });
      if (!body || naturalH === 0) return;
      gsap.to(bullets, { opacity: 0, x: -10, duration: 0.18, stagger: 0.03, ease: 'power2.in' });
      gsap.to(body,    { height: 0, opacity: 0, duration: 0.38, ease: 'power3.inOut', delay: 0.08 });
      if (icon) gsap.to(icon, { rotation: 0, duration: 0.32, ease: 'power2.out' });
    }

    if (isTouch) {
      const btn = bubble.querySelector('.exp-expand-btn');
      if (btn) {
        let open = false;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          open ? closeCard() : openCard();
          open = !open;
        });
      }
    } else {
      bubble.addEventListener('mouseenter', openCard);
      bubble.addEventListener('mouseleave', closeCard);
    }
  };
  document.querySelectorAll('.exp-bubble').forEach(b => window.admReinitExpCard(b));

  // ── 3D card tilt on hover ──
  function addTilt(selector, maxDeg) {
    document.querySelectorAll(selector).forEach(card => {
      card.addEventListener("mousemove", e => {
        const r  = card.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
        const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
        gsap.to(card, {
          rotationY: dx * maxDeg, rotationX: -dy * (maxDeg * 0.75),
          transformPerspective: 900, scale: 1.04,
          ease: "power2.out", duration: 0.4, overwrite: "auto"
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotationY: 0, rotationX: 0, scale: 1,
          ease: "power3.out", duration: 0.65, overwrite: "auto"
        });
      });
    });
  }
  addTilt(".skill-card", 12);
  addTilt(".project-card", 10);

  // ── Click sparks ──
  const SPARK_COLORS = ['#a78bfa','#60a5fa','#f472b6','#34d399','#fbbf24','#00ff41','#c084fc'];
  document.addEventListener('click', e => {
    const count = 10 + Math.floor(Math.random() * 7);
    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div');
      const col   = SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];
      const size  = 4 + Math.random() * 4;
      Object.assign(spark.style, {
        position:      'fixed',
        left:          e.clientX + 'px',
        top:           e.clientY + 'px',
        width:         size + 'px',
        height:        size + 'px',
        borderRadius:  '50%',
        background:    col,
        boxShadow:     `0 0 ${size * 2}px ${col}, 0 0 ${size * 4}px ${col}80`,
        pointerEvents: 'none',
        zIndex:        '9999',
        transform:     'translate(-50%,-50%)',
      });
      document.body.appendChild(spark);
      const angle = Math.random() * Math.PI * 2;
      const dist  = 45 + Math.random() * 90;
      gsap.to(spark, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        opacity: 0,
        scale: 0,
        duration: 0.55 + Math.random() * 0.45,
        ease: 'power2.out',
        onComplete: () => spark.remove(),
      });
    }
  });

  // ── Magnetic buttons ──
  if (!isTouch) {
    document.querySelectorAll(".btn").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const r  = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width  / 2);
        const dy = e.clientY - (r.top  + r.height / 2);
        gsap.to(btn, { x: dx * 0.38, y: dy * 0.38, ease: "power2.out", duration: 0.35, overwrite: "auto" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, ease: "elastic.out(1.1, 0.5)", duration: 0.85, overwrite: "auto" });
      });
    });
  }

  // ── Nav: highlight active section ──
  const navAnchors = document.querySelectorAll(".nav-links a");
  document.querySelectorAll("section[id]").forEach(sec => {
    ScrollTrigger.create({
      trigger: sec, start: "top 55%", end: "bottom 55%",
      onToggle: ({ isActive }) => {
        if (!isActive) return;
        navAnchors.forEach(a => a.classList.remove("nav-active"));
        const match = document.querySelector(`.nav-links a[href="#${sec.id}"]`);
        if (match) match.classList.add("nav-active");
      }
    });
  });

  // ── Scroll progress ring ──
  const scrollRingBtn = document.getElementById('scroll-ring-btn');
  const srbFill = scrollRingBtn && scrollRingBtn.querySelector('.srb-fill');
  if (scrollRingBtn && srbFill) {
    const CIRC = 2 * Math.PI * 16; // r=16 → ~100.5
    srbFill.style.strokeDasharray  = CIRC;
    srbFill.style.strokeDashoffset = CIRC;

    function updateRing() {
      const scrolled  = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const pct       = maxScroll > 0 ? scrolled / maxScroll : 0;
      srbFill.style.strokeDashoffset = CIRC * (1 - pct);
      if (scrolled > 280) scrollRingBtn.classList.add('visible');
      else                scrollRingBtn.classList.remove('visible');
    }

    window.addEventListener('scroll', updateRing, { passive: true });
    scrollRingBtn.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  // ── Experience filter ──
  const expFilterBtns  = document.querySelectorAll('.exp-filter-btn');
  const expFilterTrack = document.querySelector('.exp-filter-track');
  const expBubbles     = document.querySelectorAll('.exp-bubble');

  function moveFilterTrack(btn) {
    if (!expFilterTrack) return;
    expFilterTrack.style.left  = btn.offsetLeft + 'px';
    expFilterTrack.style.width = btn.offsetWidth + 'px';
  }

  // Init track position on active button
  const initFilterBtn = document.querySelector('.exp-filter-btn.active');
  if (initFilterBtn) requestAnimationFrame(() => moveFilterTrack(initFilterBtn));

  expFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      expFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      moveFilterTrack(btn);

      const filter = btn.dataset.filter;
      expBubbles.forEach(bubble => {
        const match = filter === 'all' || bubble.dataset.category === filter;
        gsap.to(bubble, {
          autoAlpha: match ? 1 : 0.18,
          scale:     match ? 1 : 0.96,
          duration: 0.38,
          ease: 'power2.out',
        });
      });
    });
  });

  // ── Project card scratch reveal ──
  // Exposed globally so admin mode can reinit newly-created cards
  window.admReinitScratchCard = function(card) {
    const canvas = card.querySelector('.scratch-canvas');
    const hint   = card.querySelector('.scratch-hint');
    if (!canvas) return;

    const ctx  = canvas.getContext('2d');
    let inited = false;
    let scratching = false;

    function initCanvas() {
      if (inited) return;
      inited = true;
      canvas.width  = card.offsetWidth;
      canvas.height = card.offsetHeight;
      paintOverlay();
    }

    function paintOverlay() {
      ctx.globalCompositeOperation = 'source-over';
      if (window.__lightMode) {
        ctx.fillStyle = 'rgba(220, 208, 255, 0.93)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 700; i++) {
          ctx.fillStyle = `rgba(124,58,237,${Math.random() * 0.04})`;
          ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
        }
      } else {
        ctx.fillStyle = 'rgba(5, 2, 16, 0.86)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < 700; i++) {
          ctx.fillStyle = `rgba(139,92,246,${Math.random() * 0.06})`;
          ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
        }
      }
    }
    canvas._repaintScratch = paintOverlay;

    function scratchAt(cx, cy) {
      if (hint) hint.style.opacity = '0';
      ctx.globalCompositeOperation = 'destination-out';
      const r = 30;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0,   'rgba(0,0,0,1)');
      g.addColorStop(0.5, 'rgba(0,0,0,0.8)');
      g.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setTimeout(initCanvas, 80); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(card);

    card.addEventListener('mousedown', e => {
      e.preventDefault();
      initCanvas(); scratching = true;
      const r = canvas.getBoundingClientRect();
      scratchAt(e.clientX - r.left, e.clientY - r.top);
    });
    card.addEventListener('mousemove', e => {
      if (!scratching) return;
      const r = canvas.getBoundingClientRect();
      scratchAt(e.clientX - r.left, e.clientY - r.top);
    });
    window.addEventListener('mouseup', () => { scratching = false; });
    card.addEventListener('touchstart', e => {
      initCanvas(); scratching = true;
      const r = canvas.getBoundingClientRect();
      const t = e.touches[0];
      scratchAt(t.clientX - r.left, t.clientY - r.top);
    }, { passive: true });
    card.addEventListener('touchmove', e => {
      if (!scratching) return;
      const r = canvas.getBoundingClientRect();
      const t = e.touches[0];
      scratchAt(t.clientX - r.left, t.clientY - r.top);
    }, { passive: true });
    card.addEventListener('touchend', () => { scratching = false; });
  };
  document.querySelectorAll('.project-card[data-project]').forEach(c => window.admReinitScratchCard(c));

  // Expose tilt reinit for admin-created project cards
  window.admReinitTilt = function(card) {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) / (r.width  / 2);
      const dy = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
      gsap.to(card, { rotationY: dx * 10, rotationX: -dy * 7.5, transformPerspective: 900, scale: 1.04, ease: 'power2.out', duration: 0.4, overwrite: 'auto' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationY: 0, rotationX: 0, scale: 1, ease: 'power3.out', duration: 0.65, overwrite: 'auto' });
    });
  };

})();
