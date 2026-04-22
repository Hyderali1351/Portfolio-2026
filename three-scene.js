// three-scene.js — WebGL 3D hero background (scene #1 of 5)
// HPC Cluster Network: floating GPU nodes, InfiniBand lines, data packets, bloom

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }     from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// Stop the 2D aurora loop
window.__stopAurora = true;

// bg-aurora already has a 2D context from script.js — browsers block WebGL on
// a canvas that already has a 2D context. Create a fresh canvas instead.
const auroraEl = document.getElementById('bg-aurora');
if (auroraEl) auroraEl.style.opacity = '0'; // hide (loop already stopped)

const canvas = document.createElement('canvas');
Object.assign(canvas.style, {
  position: 'fixed', inset: '0', width: '100%', height: '100%',
  zIndex: '0', pointerEvents: 'none', display: 'block',
});
// Insert right after aurora so spider-web canvas stays on top
(auroraEl?.parentNode ?? document.body)
  .insertBefore(canvas, auroraEl?.nextSibling ?? null);

const isMobile = window.matchMedia('(hover:none) and (pointer:coarse)').matches;

// ── Renderer ──────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: !isMobile,
  powerPreference: 'high-performance',
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping         = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace    = THREE.SRGBColorSpace;

// ── Scene + Camera ─────────────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color('#040110');
scene.fog        = new THREE.FogExp2('#040110', 0.018);

const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 11);

// ── Bloom post-processing ──────────────────────────────────────
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
if (!isMobile) {
  composer.addPass(new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.9,   // strength
    0.65,  // radius
    0.12   // threshold
  ));
}

// ── Lighting ───────────────────────────────────────────────────
scene.add(new THREE.AmbientLight('#1a0835', 3));

const pl1 = new THREE.PointLight('#6d28d9', 6, 32);
pl1.position.set(-9, 6, 4);
scene.add(pl1);

const pl2 = new THREE.PointLight('#1d4ed8', 5, 32);
pl2.position.set(9, -6, 4);
scene.add(pl2);

const pl3 = new THREE.PointLight('#be185d', 2.5, 22);
pl3.position.set(0, 0, 9);
scene.add(pl3);

// ── Node factory ───────────────────────────────────────────────
const ACCENT = ['#7c3aed', '#2563eb', '#be185d', '#0891b2', '#4338ca', '#7c3aed'];

function makeNode(type) {
  const group = new THREE.Group();
  const col   = ACCENT[Math.floor(Math.random() * ACCENT.length)];

  const geo =
    type === 'gpu'    ? new THREE.BoxGeometry(1.5, 0.072, 1.05) :
    type === 'server' ? new THREE.BoxGeometry(0.28, 1.42, 0.46) :
                        new THREE.OctahedronGeometry(0.22);

  const mat = new THREE.MeshStandardMaterial({
    color: '#060218',
    emissive: col,
    emissiveIntensity: 0.45,
    metalness: 0.9,
    roughness: 0.2,
  });
  group.add(new THREE.Mesh(geo, mat));
  group.add(new THREE.LineSegments(
    new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.9 })
  ));

  group.position.set(
    (Math.random() - 0.5) * 26,
    (Math.random() - 0.5) * 16,
    (Math.random() - 0.5) * 12 - 3
  );
  group.rotation.set(
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2
  );
  group.userData = {
    baseY:      group.position.y,
    floatAmp:   0.15 + Math.random() * 0.35,
    floatSpeed: 0.15 + Math.random() * 0.25,
    floatOff:   Math.random() * Math.PI * 2,
    rotY:       (Math.random() - 0.5) * 0.004,
    rotX:       (Math.random() - 0.5) * 0.002,
    mat,
  };
  return group;
}

const NODE_TYPES = isMobile
  ? ['gpu','gpu','server','node','node','gpu']
  : ['gpu','gpu','gpu','gpu','gpu','server','server','server','node','node','node','gpu'];

const nodes = NODE_TYPES.map(t => { const n = makeNode(t); scene.add(n); return n; });

// ── Dynamic InfiniBand connection lines ────────────────────────
const pairs = [];
for (let i = 0; i < nodes.length; i++)
  for (let j = i + 1; j < nodes.length; j++)
    if (nodes[i].position.distanceTo(nodes[j].position) < 14)
      pairs.push([i, j]);

const lineArr = new Float32Array(pairs.length * 6);
const lineGeo = new THREE.BufferGeometry();
lineGeo.setAttribute('position', new THREE.BufferAttribute(lineArr, 3));
scene.add(new THREE.LineSegments(lineGeo,
  new THREE.LineBasicMaterial({ color: '#5b21b6', transparent: true, opacity: 0.22 })
));

// ── Data packets traveling along lines ─────────────────────────
const pktGeo = new THREE.SphereGeometry(0.055, 5, 5);
const pktMat = new THREE.MeshBasicMaterial({ color: '#00ff41' }); // matrix green → blooms
const PKT_N  = isMobile ? 4 : 14;

const packets = Array.from({ length: PKT_N }, () => ({
  mesh:    new THREE.Mesh(pktGeo, pktMat),
  pairIdx: Math.floor(Math.random() * Math.max(pairs.length, 1)),
  t:       Math.random(),
  speed:   0.004 + Math.random() * 0.007,
  dir:     Math.random() > 0.5 ? 1 : -1,
}));
packets.forEach(p => scene.add(p.mesh));

// ── Particle field ─────────────────────────────────────────────
const PC   = isMobile ? 100 : 320;
const pArr = new Float32Array(PC * 3);
for (let i = 0; i < PC; i++) {
  pArr[i * 3]     = (Math.random() - 0.5) * 42;
  pArr[i * 3 + 1] = (Math.random() - 0.5) * 30;
  pArr[i * 3 + 2] = (Math.random() - 0.5) * 22 - 5;
}
const pGeo = new THREE.BufferGeometry();
pGeo.setAttribute('position', new THREE.BufferAttribute(pArr, 3));
const particleMesh = new THREE.Points(pGeo,
  new THREE.PointsMaterial({ color: '#7c3aed', size: 0.055, sizeAttenuation: true, transparent: true, opacity: 0.55 })
);
scene.add(particleMesh);

// ── Mouse parallax ─────────────────────────────────────────────
let mx = 0, my = 0, camTX = 0, camTY = 0;
window.addEventListener('mousemove', e => {
  mx = (e.clientX / window.innerWidth  - 0.5) * 2;
  my = (e.clientY / window.innerHeight - 0.5) * 2;
}, { passive: true });

// ── Resize ─────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  composer.setSize(w, h);
}, { passive: true });

// ── Animation loop ─────────────────────────────────────────────
const clock  = new THREE.Clock();
const _posA  = new THREE.Vector3();
const _posB  = new THREE.Vector3();

(function tick() {
  requestAnimationFrame(tick);
  const t = clock.getElapsedTime();

  // Camera mouse parallax
  camTX += (mx * 1.5 - camTX) * 0.04;
  camTY += (-my * 1.0 - camTY) * 0.04;
  camera.position.x = camTX;
  camera.position.y = camTY;
  camera.lookAt(0, 0, 0);

  // Animate nodes: float + slow rotate + pulse emissive
  nodes.forEach((n, i) => {
    const d = n.userData;
    n.position.y = d.baseY + Math.sin(t * d.floatSpeed + d.floatOff) * d.floatAmp;
    n.rotation.y += d.rotY;
    n.rotation.x += d.rotX;
    d.mat.emissiveIntensity = 0.28 + Math.sin(t * 0.55 + i * 0.9) * 0.2;
  });

  // Update InfiniBand lines to follow node positions
  pairs.forEach(([i, j], k) => {
    lineArr[k * 6]     = nodes[i].position.x;
    lineArr[k * 6 + 1] = nodes[i].position.y;
    lineArr[k * 6 + 2] = nodes[i].position.z;
    lineArr[k * 6 + 3] = nodes[j].position.x;
    lineArr[k * 6 + 4] = nodes[j].position.y;
    lineArr[k * 6 + 5] = nodes[j].position.z;
  });
  lineGeo.attributes.position.needsUpdate = true;

  // Move data packets along connections
  packets.forEach(pk => {
    const pair = pairs[pk.pairIdx];
    if (!pair) return;
    pk.t += pk.speed * pk.dir;
    if (pk.t >= 1 || pk.t <= 0) {
      pk.dir    *= -1;
      pk.pairIdx = Math.floor(Math.random() * pairs.length);
      pk.t       = pk.dir === 1 ? 0 : 1;
    }
    _posA.copy(nodes[pair[0]].position);
    _posB.copy(nodes[pair[1]].position);
    pk.mesh.position.lerpVectors(_posA, _posB, pk.t);
  });

  // Slow particle field rotation for depth
  particleMesh.rotation.y = t * 0.016;
  particleMesh.rotation.x = t * 0.005;

  // Pulse point lights
  pl1.intensity = 6  + Math.sin(t * 0.44)        * 2;
  pl2.intensity = 5  + Math.sin(t * 0.37 + 1.3)  * 1.8;
  pl3.intensity = 2.5 + Math.sin(t * 0.6  + 2.1) * 0.9;

  composer.render();
})();
