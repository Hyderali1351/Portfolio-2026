// Stop aurora — GSAP blobs replace it
window.__stopAurora = true;

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

// ── Visitor counter ──
(function () {
  const ct = document.getElementById("vc-count");
  // Try counterapi.dev (namespace/key must be pre-created at counterapi.dev)
  fetch("https://api.counterapi.dev/v1/mirhyderali/visits/up", { cache: "no-store" })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(data => {
      const raw = data?.count ?? data?.value ?? data?.hits ?? data?.views;
      if (ct && raw != null) ct.textContent = Number(raw).toLocaleString();
    })
    .catch(() => {
      // Fallback: countapi.dev v2 endpoint
      fetch("https://api.countapi.xyz/hit/mirhyderali.com/visits", { cache: "no-store" })
        .then(r => r.json())
        .then(data => {
          const raw = data?.value ?? data?.count;
          if (ct && raw != null) ct.textContent = Number(raw).toLocaleString();
        })
        .catch(() => {
          if (ct) ct.textContent = "—";
        });
    });
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
// INTRO — Particle MHA formation + hacker terminal
// ─────────────────────────────────────────────────────
const intro       = document.getElementById("intro");
const introCanvas = document.getElementById("intro-canvas");

if (intro && introCanvas) {
  introCanvas.width  = window.innerWidth;
  introCanvas.height = window.innerHeight;
  const ctx = introCanvas.getContext("2d");
  const W = introCanvas.width, H = introCanvas.height;

  // Hide the SVG logo — canvas particles form MHA instead
  const introLogo = document.getElementById('intro-logo');
  if (introLogo) introLogo.style.display = 'none';

  // ── Sample pixel positions of "MHA" text on offscreen canvas ──
  function getMHATargets(count) {
    const off = document.createElement('canvas');
    // Larger canvas = thicker strokes = easier to sample
    const tw  = Math.min(W * 0.65, 520);
    const th  = Math.round(tw * 0.38);
    off.width = tw; off.height = th;
    const oc = off.getContext('2d');
    oc.fillStyle = '#fff';
    // Arial loads synchronously — no font-loading race condition
    oc.font = `900 ${Math.round(th * 0.82)}px Arial, sans-serif`;
    oc.textAlign = 'center';
    oc.textBaseline = 'middle';
    oc.fillText('MHA', tw / 2, th / 2);
    const data = oc.getImageData(0, 0, tw, th).data;
    const lit  = [];
    const STEP = 4; // dense grid — catches strokes as narrow as 4px
    for (let py = 0; py < th; py += STEP) {
      for (let px = 0; px < tw; px += STEP) {
        if (data[(py * tw + px) * 4 + 3] > 15) {
          lit.push({ x: W / 2 - tw / 2 + px, y: H * 0.30 - th / 2 + py });
        }
      }
    }
    // Shuffle
    for (let i = lit.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lit[i], lit[j]] = [lit[j], lit[i]];
    }
    // If canvas text failed (e.g. sandboxed env), spread across a readable area
    if (lit.length < 20) {
      return Array.from({ length: count }, () => ({
        x: W / 2 + (Math.random() - 0.5) * Math.min(W * 0.55, 440),
        y: H * 0.30 + (Math.random() - 0.5) * 80,
      }));
    }
    return lit.slice(0, count);
  }

  const NODE_COUNT = 300;
  const MAX_DIST   = Math.min(W, H) * 0.18;
  const targets    = getMHATargets(NODE_COUNT);

  const nodes = Array.from({ length: NODE_COUNT }, (_, i) => {
    const tx = targets[i]?.x ?? W / 2 + (Math.random() - 0.5) * 60;
    const ty = targets[i]?.y ?? H * 0.30 + (Math.random() - 0.5) * 30;
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      r:  1.2 + Math.random() * 1.4,
      phase: Math.random() * Math.PI * 2,
      spd:   0.018 + Math.random() * 0.025,
      tx, ty,
      exVx: 0, exVy: 0,
    };
  });

  // Pulse packets along neural net edges (scatter phase)
  const packets = [];
  let lastPacketMs = 0;

  // Animation state
  let convergeT    = 0;      // 0→1 as particles approach MHA shape
  let exploding    = false;
  let overlayAlpha = 0;
  let rafRunning   = true;
  let startTs      = null;
  const SCATTER_MS  = 120;   // free drift before converge starts
  const CONVERGE_MS = 480;   // convergence duration

  const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  function rafLoop(ts) {
    if (startTs === null) startTs = ts;
    const elapsed = ts - startTs;
    ctx.clearRect(0, 0, W, H);

    if (!exploding && elapsed > SCATTER_MS) {
      convergeT = Math.min((elapsed - SCATTER_MS) / CONVERGE_MS, 1);
    }
    const blend = easeInOut(Math.min(convergeT, 1));
    const formed = blend > 0.88;

    // ── Update node positions ──
    nodes.forEach(n => {
      if (exploding) {
        n.exVx *= 1.07; n.exVy *= 1.07;
        n.x += n.exVx;  n.y += n.exVy;
      } else if (formed) {
        // Tiny orbit around target — breathing
        n.phase += n.spd;
        n.x = n.tx + Math.sin(n.phase) * 1.4;
        n.y = n.ty + Math.cos(n.phase * 0.7) * 1.4;
      } else {
        // Drift + lerp toward target
        n.x += n.vx * (1 - blend);
        n.y += n.vy * (1 - blend);
        n.x += (n.tx - n.x) * blend * 0.09;
        n.y += (n.ty - n.y) * blend * 0.09;
        if (blend < 0.2) {
          if (n.x < 0) n.x = W; if (n.x > W) n.x = 0;
          if (n.y < 0) n.y = H; if (n.y > H) n.y = 0;
        }
      }
    });

    // ── Neural net edges (fade out as converge starts) ──
    if (blend < 0.4) {
      const edgeFade = 1 - blend / 0.4;
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let j = i + 1; j < NODE_COUNT; j++) {
          const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < MAX_DIST) {
            const s = (1 - d / MAX_DIST) * edgeFade;
            ctx.strokeStyle = `rgba(139,92,246,${s * 0.25})`;
            ctx.lineWidth   = s * 0.85;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      // Pulse packets
      if (ts - lastPacketMs > 110) {
        const i = Math.floor(Math.random() * NODE_COUNT);
        const j = Math.floor(Math.random() * NODE_COUNT);
        if (i !== j) {
          const dx = nodes[j].x - nodes[i].x, dy = nodes[j].y - nodes[i].y;
          if (Math.sqrt(dx * dx + dy * dy) < MAX_DIST) {
            packets.push({ from: i, to: j, t: 0 }); lastPacketMs = ts;
          }
        }
      }
      for (let p = packets.length - 1; p >= 0; p--) {
        packets[p].t += 0.022;
        if (packets[p].t >= 1) { packets.splice(p, 1); continue; }
        const n1 = nodes[packets[p].from], n2 = nodes[packets[p].to];
        const px = n1.x + (n2.x - n1.x) * packets[p].t;
        const py = n1.y + (n2.y - n1.y) * packets[p].t;
        ctx.shadowColor = '#00ff41'; ctx.shadowBlur = 8;
        ctx.fillStyle   = `rgba(0,255,65,${(0.85 - packets[p].t * 0.4) * edgeFade})`;
        ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur  = 0;
      }
    }

    // ── Draw particles ──
    nodes.forEach(n => {
      n.phase += n.spd * (formed ? 1 : 0.5);
      const g = (Math.sin(n.phase) + 1) * 0.5;
      if (formed || exploding) {
        // Bright teal/green when MHA shape is formed — larger radius for readability
        ctx.shadowColor = '#00ffaa';
        ctx.shadowBlur  = 8 + g * 14;
        ctx.fillStyle   = `rgba(${80 + g*100},${220 + g*35},${180 + g*50},${0.85 + g * 0.15})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 1.8 + g * 1.4, 0, Math.PI * 2);
      } else {
        // Purple during scatter/converge, brightening as they close in
        const br = blend * 80;
        ctx.shadowColor = `rgba(${130 + br},${90 + br * 0.5},250,0.8)`;
        ctx.shadowBlur  = 4 + g * 8;
        ctx.fillStyle   = `rgba(${140 + br},${100 + g*30},250,${0.45 + blend * 0.45})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + g * 0.9, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Dark fade overlay
    if (overlayAlpha > 0) {
      ctx.fillStyle = `rgba(3,0,8,${overlayAlpha})`;
      ctx.fillRect(0, 0, W, H);
    }

    if (rafRunning) requestAnimationFrame(rafLoop);
  }
  requestAnimationFrame(rafLoop);

  const fireIntroDone = () => window.dispatchEvent(new CustomEvent('intro-done'));

  // After particles form MHA, open the doors
  const HOLD_MS = 60;
  const doorTimer = setTimeout(() => {
    rafRunning = false;
    intro.classList.add('door-open');
    setTimeout(() => {
      intro.remove();
      fireIntroDone();
    }, 680);
  }, SCATTER_MS + CONVERGE_MS + HOLD_MS);

  // Safety fallback
  setTimeout(() => {
    if (intro && intro.isConnected) {
      clearTimeout(doorTimer);
      intro.classList.add('door-open');
      setTimeout(() => { intro.remove(); fireIntroDone(); }, 680);
    }
  }, 5000);
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
  document.querySelectorAll('.exp-bubble').forEach(bubble => {
    const badge   = bubble.querySelector('.exp-bubble-badge');
    const body    = bubble.querySelector('.exp-bubble-body');
    const icon    = bubble.querySelector('.exp-expand-icon');
    const bullets = bubble.querySelectorAll('.exp-bullets li');

    // Cache natural height once while body is still in flow
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
      // Touch: tap the expand button to toggle (hover doesn't exist on mobile)
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
  });

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
  document.querySelectorAll('.project-card[data-project]').forEach(card => {
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
      ctx.fillStyle = 'rgba(5, 2, 16, 0.86)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Subtle purple pixel dust
      for (let i = 0; i < 700; i++) {
        ctx.fillStyle = `rgba(139,92,246,${Math.random() * 0.06})`;
        ctx.fillRect(
          Math.random() * canvas.width,
          Math.random() * canvas.height,
          1, 1
        );
      }
    }

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

    // Init when card scrolls into view
    const io = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setTimeout(initCanvas, 80); io.disconnect(); }
    }, { threshold: 0.1 });
    io.observe(card);

    // Mousedown + mousemove on the whole card (canvas has pointer-events:none)
    card.addEventListener('mousedown', e => {
      initCanvas();
      scratching = true;
      const r = canvas.getBoundingClientRect();
      scratchAt(e.clientX - r.left, e.clientY - r.top);
    });
    card.addEventListener('mousemove', e => {
      if (!scratching) return;
      const r = canvas.getBoundingClientRect();
      scratchAt(e.clientX - r.left, e.clientY - r.top);
    });
    window.addEventListener('mouseup', () => { scratching = false; });

    // Touch
    card.addEventListener('touchstart', e => {
      initCanvas();
      scratching = true;
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
  });

})();
