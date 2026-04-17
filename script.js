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

// Cursor spotlight
const spotlight = document.createElement("div");
spotlight.className = "spotlight";
document.body.appendChild(spotlight);

// Smooth bubble hover on nav
const navList = document.querySelector(".nav-links");
const bubble = document.createElement("span");
bubble.className = "nav-bubble";
navList.appendChild(bubble);

let bubbleVisible = false;

function moveBubble(el) {
  const elRect = el.getBoundingClientRect();
  const listRect = navList.getBoundingClientRect();
  bubble.style.width  = elRect.width  + "px";
  bubble.style.height = elRect.height + "px";
  bubble.style.left   = (elRect.left - listRect.left) + "px";
  bubble.style.top    = (elRect.top  - listRect.top)  + "px";
  if (!bubbleVisible) {
    bubble.style.transition = "opacity 0.2s ease";
    bubbleVisible = true;
  } else {
    bubble.style.transition =
      "left 0.28s cubic-bezier(0.4,0,0.2,1), width 0.28s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease";
  }
  bubble.style.opacity = "1";
}

navList.querySelectorAll("li").forEach(li => {
  li.addEventListener("mouseenter", () => moveBubble(li));
});
navList.addEventListener("mouseleave", () => {
  bubble.style.opacity = "0";
  bubbleVisible = false;
});

// Combined mousemove — spotlight + parallax orbs
document.addEventListener("mousemove", (e) => {
  // spotlight
  spotlight.style.left = e.clientX + "px";
  spotlight.style.top  = e.clientY + "px";

  // orb parallax
  const x = (e.clientX / window.innerWidth  - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;
  document.querySelectorAll(".orb").forEach((orb, i) => {
    const f = (i + 1) * 10;
    orb.style.transform = `translate(${x * f}px, ${y * f}px)`;
  });
});

// Contact form
function handleSubmit(e) {
  e.preventDefault();
  const msg = document.getElementById("form-msg");
  msg.textContent = "Thanks! I'll get back to you soon.";
  e.target.reset();
}
