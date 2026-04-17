// Typing animation
const titles = ["Web Developer", "Frontend Enthusiast", "Problem Solver", "Creative Coder"];
let ti = 0, ci = 0, deleting = false;
const typedEl = document.querySelector(".typed");

function type() {
  const current = titles[ti];
  typedEl.textContent = deleting ? current.slice(0, ci--) : current.slice(0, ci++);
  if (!deleting && ci > current.length) { deleting = true; setTimeout(type, 1500); return; }
  if (deleting && ci < 0) { deleting = false; ti = (ti + 1) % titles.length; }
  setTimeout(type, deleting ? 55 : 95);
}
type();

// Mobile nav
document.querySelector(".nav-toggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("open");
});
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => document.querySelector(".nav-links").classList.remove("open"));
});

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add("visible"), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

// ── Smooth bubble hover on nav ──
const navList = document.querySelector(".nav-links");
const bubble  = document.createElement("span");
bubble.className = "nav-bubble";
navList.appendChild(bubble);

let entered = false;

navList.querySelectorAll("li").forEach(li => {
  li.addEventListener("mouseenter", () => {
    // offsetLeft/offsetWidth are already relative to the parent — no math needed
    bubble.style.width  = li.offsetWidth  + "px";
    bubble.style.left   = li.offsetLeft   + "px";

    if (!entered) {
      // First entry: appear instantly, no slide
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

// ── Cursor spotlight ──
const spotlight = document.createElement("div");
spotlight.className = "spotlight";
document.body.appendChild(spotlight);

document.addEventListener("mousemove", (e) => {
  // Spotlight — direct pixel follow
  spotlight.style.left = e.clientX + "px";
  spotlight.style.top  = e.clientY + "px";

  // Orb parallax
  const x = (e.clientX / window.innerWidth  - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  document.querySelectorAll(".orb").forEach((orb, i) => {
    orb.style.transform = `translate(${x * (i + 1) * 10}px, ${y * (i + 1) * 10}px)`;
  });
});

// Contact form
function handleSubmit(e) {
  e.preventDefault();
  document.getElementById("form-msg").textContent = "Thanks! I'll get back to you soon.";
  e.target.reset();
}
