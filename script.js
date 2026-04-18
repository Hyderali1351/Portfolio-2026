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
let spotX  = mouseX, spotY = mouseY;
let parallaxX = 0, parallaxY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  parallaxX = (e.clientX / window.innerWidth  - 0.5) * 2;
  parallaxY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// ── Cursor spotlight ──
const spotlight = document.createElement("div");
spotlight.className = "spotlight";
document.body.appendChild(spotlight);

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

// ── RAF loop: spotlight lerp ──
(function rafLoop() {
  spotX += (mouseX - spotX) * 0.14;
  spotY += (mouseY - spotY) * 0.14;
  spotlight.style.left = spotX + "px";
  spotlight.style.top  = spotY + "px";
  requestAnimationFrame(rafLoop);
})();

// ── Contact form ──
function handleSubmit(e) {
  e.preventDefault();
  document.getElementById("form-msg").textContent = "Thanks! I'll get back to you soon.";
  e.target.reset();
}

// ─────────────────────────────────────────
// INTRO — Hacker wireframe globe
// ─────────────────────────────────────────
const intro       = document.getElementById("intro");
const introCanvas = document.getElementById("intro-canvas");

if (intro && introCanvas) {
  introCanvas.width  = window.innerWidth;
  introCanvas.height = window.innerHeight;
  const ctx = introCanvas.getContext("2d");
  const W = introCanvas.width, H = introCanvas.height;
  const cx = W / 2, cy = H / 2;

  // Stars — green-tinted
  const STARS = Array.from({length: 280}, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() * 1.2 + 0.2,
    b: Math.random() * 0.7 + 0.2,
    g: Math.random() > 0.55, // some green, some white
  }));

  // Continent polygons [lon°, lat°]
  const LAND = [
    [[-168,60],[-168,72],[-148,72],[-141,68],[-138,60],[-136,58],[-130,54],
     [-126,50],[-124,46],[-124,42],[-122,36],[-118,32],[-110,22],[-100,18],
     [-88,16],[-83,10],[-78,8],[-82,10],[-90,28],[-88,30],[-82,32],
     [-80,25],[-80,32],[-76,34],[-75,39],[-74,41],[-70,43],[-67,45],
     [-64,46],[-60,47],[-55,50],[-52,47],[-58,52],[-65,58],
     [-80,63],[-96,72],[-118,72],[-140,66],[-154,60],[-164,54],[-168,56],[-168,60]],
    [[-80,10],[-75,12],[-65,11],[-52,4],[-38,-1],[-35,-5],[-35,-12],
     [-38,-16],[-40,-22],[-48,-28],[-52,-34],[-57,-38],[-65,-42],
     [-68,-55],[-75,-52],[-73,-42],[-70,-18],[-76,-8],[-80,2],[-80,10]],
    [[-10,36],[0,36],[12,38],[22,38],[28,42],[35,42],[35,48],
     [24,50],[28,56],[20,58],[15,58],[10,58],[5,62],[-2,62],
     [-5,58],[-8,54],[-10,50],[-8,44],[-5,40],[-10,36]],
    [[-18,15],[-16,10],[-12,5],[-5,4],[0,5],[8,4],[15,0],[35,-5],
     [38,-10],[35,-26],[32,-34],[22,-34],[18,-34],[16,-29],[12,-18],
     [12,-5],[0,5],[8,12],[15,22],[24,22],[35,30],[32,36],[10,38],
     [0,38],[-5,36],[-18,35],[-18,15]],
    [[-44,60],[-40,65],[-30,66],[-18,68],[-18,72],[-26,76],[-36,80],
     [-50,83],[-60,80],[-65,72],[-58,66],[-50,62],[-44,60]],
    // Asia (simplified)
    [[40,36],[45,38],[55,40],[65,38],[75,36],[80,28],[90,22],[100,10],
     [105,2],[110,-2],[115,2],[120,8],[130,30],[135,34],[140,38],[145,40],
     [140,44],[135,48],[130,48],[120,52],[110,56],[100,58],[90,58],
     [80,55],[70,52],[60,48],[50,46],[40,42],[36,38],[40,36]],
    // Australia
    [[114,-22],[118,-20],[122,-18],[128,-14],[134,-12],[138,-14],[140,-18],
     [148,-20],[154,-26],[156,-32],[152,-38],[148,-38],[144,-36],[140,-36],
     [136,-34],[130,-32],[124,-30],[118,-28],[114,-26],[114,-22]],
  ];

  // Hacker green palette
  const GN = {
    bright:  'rgba(0,255,65,0.90)',
    mid:     'rgba(0,255,65,0.38)',
    dim:     'rgba(0,255,65,0.10)',
    glow:    'rgba(0,255,65,0.55)',
    outline: 'rgba(0,255,65,0.60)',
    sphere:  'rgba(0,30,10,0.50)',
  };

  let R    = Math.min(W, H) * 0.28;
  const Rb = R;
  let vLon = 10, vLat = 8;
  const endLon = 195; // arbitrary end after 185° spin

  function proj(lon, lat) {
    const λ  = lon  * Math.PI / 180,  φ  = lat  * Math.PI / 180;
    const λ0 = vLon * Math.PI / 180,  φ1 = vLat * Math.PI / 180;
    const cosC = Math.sin(φ1)*Math.sin(φ) + Math.cos(φ1)*Math.cos(φ)*Math.cos(λ-λ0);
    if (cosC < 0) return null;
    return {
      x: cx + R * Math.cos(φ) * Math.sin(λ-λ0),
      y: cy - R * (Math.cos(φ1)*Math.sin(φ) - Math.sin(φ1)*Math.cos(φ)*Math.cos(λ-λ0)),
    };
  }

  function drawGlobe() {
    // Dark sphere fill
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2);
    ctx.fillStyle = GN.sphere; ctx.fill();

    // Outer ring glow
    ctx.shadowColor = GN.glow; ctx.shadowBlur = 18;
    ctx.strokeStyle = GN.outline; ctx.lineWidth = 1.3;
    ctx.stroke(); ctx.shadowBlur = 0;
    ctx.restore();

    // Clip to sphere for grid + continents
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2); ctx.clip();

    // Dense lat/lon mesh
    ctx.lineWidth = 0.5;
    for (let la=-75; la<=75; la+=15) {
      ctx.beginPath(); let f=true;
      ctx.strokeStyle = (la===0) ? GN.mid : GN.dim;
      for (let lo=-180; lo<=180; lo+=3) {
        const p=proj(lo,la); if(!p){f=true;continue;}
        f?(ctx.moveTo(p.x,p.y),f=false):ctx.lineTo(p.x,p.y);
      } ctx.stroke();
    }
    for (let lo=-180; lo<180; lo+=15) {
      ctx.beginPath(); let f=true;
      ctx.strokeStyle = (lo===0) ? GN.mid : GN.dim;
      for (let la=-85; la<=85; la+=3) {
        const p=proj(lo,la); if(!p){f=true;continue;}
        f?(ctx.moveTo(p.x,p.y),f=false):ctx.lineTo(p.x,p.y);
      } ctx.stroke();
    }

    // Continent outlines — bright with glow
    LAND.forEach(poly => {
      ctx.beginPath();
      let pen=false;
      for (const [lo,la] of poly) {
        const p=proj(lo,la);
        if(!p){pen=false;continue;}
        pen?ctx.lineTo(p.x,p.y):(ctx.moveTo(p.x,p.y),pen=true);
      }
      ctx.closePath();
      ctx.strokeStyle = GN.bright; ctx.lineWidth = 1.1;
      ctx.shadowColor = GN.glow; ctx.shadowBlur = 7;
      ctx.stroke(); ctx.shadowBlur = 0;
    });

    ctx.restore();

    // Subtle inner radial vignette
    const vig = ctx.createRadialGradient(cx,cy,R*.55, cx,cy,R);
    vig.addColorStop(0,'transparent');
    vig.addColorStop(1,'rgba(0,8,4,0.55)');
    ctx.save();
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.clip();
    ctx.fillStyle=vig; ctx.fillRect(cx-R,cy-R,R*2,R*2);
    ctx.restore();

    // Outer glow halo
    const halo = ctx.createRadialGradient(cx,cy,R*.9, cx,cy,R*1.15);
    halo.addColorStop(0,'rgba(0,255,65,0.12)');
    halo.addColorStop(1,'transparent');
    ctx.fillStyle=halo;
    ctx.beginPath(); ctx.arc(cx,cy,R*1.15,0,Math.PI*2); ctx.fill();
  }

  // Phase durations (ms): stars → appear → rotate → zoom → fade
  const P = { stars:300, appear:500, rotate:1400, pause:300, zoom:950, fade:480 };
  let t0 = null;

  function frame(ts) {
    if (!t0) t0 = ts;
    const t = ts - t0;
    const p1=P.stars, p2=p1+P.appear, p3=p2+P.rotate,
          p4=p3+P.pause, p5=p4+P.zoom;

    ctx.clearRect(0,0,W,H);

    // Stars
    const sa = Math.min(t/P.stars, 1);
    STARS.forEach(s => {
      ctx.globalAlpha = s.b * sa;
      ctx.fillStyle = s.g ? 'rgba(100,255,130,0.9)' : '#fff';
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    if (t > p1) {
      const ga = Math.min((t-p1)/P.appear, 1);

      // Spin globe during rotate phase
      if (t>p2 && t<=p3) {
        const rp=(t-p2)/P.rotate, re=rp<.5?2*rp*rp:1-Math.pow(-2*rp+2,2)/2;
        vLon = 10 + (endLon-10)*re;
      } else if (t>p3) { vLon=endLon; }

      // Zoom in
      if (t>p4 && t<=p5) {
        const zp=(t-p4)/P.zoom, ze=zp*zp;
        R = Rb*(1+ze*9);
      } else if (t>p5) { R=Rb*10; }

      ctx.save(); ctx.globalAlpha=ga;
      drawGlobe();
      ctx.restore();

      // Fade to dark
      if (t > p5) {
        const fp = Math.min((t-p5)/P.fade, 1);
        ctx.fillStyle = `rgba(4,1,16,${fp*fp})`;
        ctx.fillRect(0,0,W,H);
        if (fp >= 1) {
          intro.classList.add("out");
          setTimeout(() => intro.remove(), 750);
          return;
        }
      }
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
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
