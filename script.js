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

// ── Scroll reveal — bidirectional ──
// Elements animate in when entering viewport from either direction,
// and reset when they fully leave so they re-animate on next entry.
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    } else {
      entry.target.classList.remove("visible");
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale")
  .forEach(el => observer.observe(el));

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
      bubble.style.transition = "opacity 0.15s ease";
      entered = true;
    } else {
      bubble.style.transition =
        "left 0.3s cubic-bezier(0.4,0,0.2,1), width 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.15s ease";
    }
    bubble.style.opacity = "1";
  });
});
navList.addEventListener("mouseleave", () => {
  bubble.style.opacity = "0";
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

// ── Custom cursor (dot + lagging ring) ──
const curDot  = document.createElement("div"); curDot.className  = "cur-dot";
const curRing = document.createElement("div"); curRing.className = "cur-ring";
document.body.appendChild(curDot);
document.body.appendChild(curRing);

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

// ── RAF loop: ring lerp ──
(function ringLoop() {
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
// INTRO — Neural network background + hacker terminal
// ─────────────────────────────────────────────────────
const intro       = document.getElementById("intro");
const introCanvas = document.getElementById("intro-canvas");

if (intro && introCanvas) {
  introCanvas.width  = window.innerWidth;
  introCanvas.height = window.innerHeight;
  const ctx = introCanvas.getContext("2d");
  const W = introCanvas.width, H = introCanvas.height;

  // ── Neural network nodes ──────────────────────────
  const NODE_COUNT = 72;
  const MAX_DIST   = Math.min(W, H) * 0.21;

  const nodes = Array.from({length: NODE_COUNT}, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r: Math.random() * 2.0 + 1.2,
    phase: Math.random() * Math.PI * 2,
    spd: Math.random() * 0.022 + 0.008,
  }));

  // Pulse packets travelling along edges
  const packets = [];
  let lastPacketMs = 0;

  // Canvas fade overlay (driven by terminal sequence end)
  let overlayAlpha = 0;
  let rafRunning   = true;

  function rafLoop(ts) {
    ctx.clearRect(0, 0, W, H);

    // Move nodes
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // Spawn a new pulse packet periodically
    if (ts - lastPacketMs > 110) {
      const i = Math.floor(Math.random() * NODE_COUNT);
      const j = Math.floor(Math.random() * NODE_COUNT);
      if (i !== j) {
        const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
        if (Math.sqrt(dx*dx + dy*dy) < MAX_DIST) {
          packets.push({ from: i, to: j, t: 0 });
          lastPacketMs = ts;
        }
      }
    }

    // Draw edges
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < MAX_DIST) {
          const s = 1 - d / MAX_DIST;
          ctx.strokeStyle = `rgba(139,92,246,${s * 0.26})`;
          ctx.lineWidth   = s * 0.9;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw + advance packets
    for (let p = packets.length - 1; p >= 0; p--) {
      packets[p].t += 0.02;
      if (packets[p].t >= 1) { packets.splice(p, 1); continue; }
      const n1 = nodes[packets[p].from], n2 = nodes[packets[p].to];
      const px = n1.x + (n2.x - n1.x) * packets[p].t;
      const py = n1.y + (n2.y - n1.y) * packets[p].t;
      ctx.shadowColor = '#00ff41';
      ctx.shadowBlur  = 10;
      ctx.fillStyle   = `rgba(0,255,65,${0.9 - packets[p].t * 0.4})`;
      ctx.beginPath(); ctx.arc(px, py, 2.4, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur  = 0;
    }

    // Draw nodes with breathing glow
    nodes.forEach(n => {
      n.phase += n.spd;
      const g = (Math.sin(n.phase) + 1) * 0.5;
      ctx.shadowColor = 'rgba(139,92,246,0.85)';
      ctx.shadowBlur  = 5 + g * 12;
      ctx.fillStyle   = `rgba(${155 + g*40},${120 + g*30},250,${0.6 + g * 0.4})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r + g * 1.3, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur  = 0;
    });

    // Dark fade overlay (triggered at terminal end)
    if (overlayAlpha > 0) {
      ctx.fillStyle = `rgba(3,0,8,${overlayAlpha})`;
      ctx.fillRect(0, 0, W, H);
    }

    if (rafRunning) requestAnimationFrame(rafLoop);
  }
  requestAnimationFrame(rafLoop);

  // ── Terminal typing sequence ──────────────────────
  const termOut     = document.getElementById("term-out");
  const termCur     = document.getElementById("term-cur");
  const grantedEl   = document.getElementById("intro-granted");

  const pause = ms => new Promise(r => setTimeout(r, ms));

  function typeInto(el, text, speed) {
    return new Promise(res => {
      let i = 0;
      const iv = setInterval(() => {
        el.textContent += text[i++];
        if (i >= text.length) { clearInterval(iv); res(); }
      }, speed);
    });
  }

  async function runTerminal() {
    await pause(620);

    const lines = [
      { t: 'login: mirhyderali',   s: 55, p: 300, dim: false },
      { t: 'password: ••••••••••', s: 60, p: 400, dim: true  },
    ];

    for (const line of lines) {
      const el = document.createElement('div');
      el.className = 'tline' + (line.dim ? ' tline-dim' : '');
      termOut.appendChild(el);
      termOut.parentElement.scrollTop = termOut.parentElement.scrollHeight;
      await typeInto(el, line.t, line.s);
      await pause(line.p);
    }

    // Hide cursor, show ACCESS GRANTED
    termCur.style.display = 'none';
    grantedEl.classList.add('show');
    await pause(700);

    // Ramp canvas to black over 400ms, then CSS-fade the whole intro
    await new Promise(res => {
      let fp = 0;
      const iv = setInterval(() => {
        fp = Math.min(fp + 0.05, 1);
        overlayAlpha = fp * fp;
        if (fp >= 1) { clearInterval(iv); res(); }
      }, 16);
    });

    rafRunning = false;
    intro.classList.add('out');
    setTimeout(() => intro.remove(), 750);
  }

  // Safety net — remove intro after 12s no matter what
  const safetyTimer = setTimeout(() => {
    if (intro.isConnected) {
      intro.classList.add('out');
      setTimeout(() => intro.remove(), 750);
    }
  }, 12000);

  runTerminal().then(() => clearTimeout(safetyTimer)).catch(() => {
    clearTimeout(safetyTimer);
    intro.classList.add('out');
    setTimeout(() => intro.remove(), 750);
  });
}

// ── Gaming / desk scene activation ──
const setupScene = document.getElementById("setup-scene");
if (setupScene) {
  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activateScene();
        sceneObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.45 });
  sceneObserver.observe(setupScene);
}

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
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if (e.key === 'Escape') { closePuzzle(); return; }
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
