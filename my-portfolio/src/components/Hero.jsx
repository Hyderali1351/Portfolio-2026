// src/components/Hero.jsx
import { useEffect, useRef } from "react";

const TAGS = ["MPI", "OpenMP", "SLURM", "CUDA", "InfiniBand", "Lustre FS", "OpenFOAM", "Kubernetes"];

export default function Hero() {
  return (
    <section style={styles.root}>
      {/* Background grid */}
      <div style={styles.gridBg} />
      <div style={styles.glow1} />
      <div style={styles.glow2} />

      <div style={styles.content}>
        <div style={styles.badge}>
          <span style={styles.dot} />
          Available for new projects
        </div>

        <p style={styles.sub}>// HPC Engineer &amp; Systems Architect</p>

        <h1 style={styles.headline}>
          Building systems that{" "}
          <span style={styles.accent}>scale beyond limits.</span>
        </h1>

        <p style={styles.description}>
          I design and optimize{" "}
          <em style={styles.em}>high-performance computing infrastructure</em> for
          research labs, financial firms, and national facilities. From bare-metal
          cluster orchestration to{" "}
          <em style={styles.em}>MPI/OpenMP workload tuning</em> — I make
          computation faster, cheaper, and more reliable.
        </p>

        <div style={styles.ctaRow}>
          <button style={styles.btnPrimary}>View My Work</button>
          <button style={styles.btnOutline}>Get In Touch</button>
        </div>

        <div style={styles.statsRow}>
          {[
            { value: "12+", label: "Years in HPC" },
            { value: "500k", label: "CPU cores managed" },
            { value: "3.2×", label: "Avg. perf. gain" },
          ].map((s, i) => (
            <>
              {i > 0 && <div key={`div-${i}`} style={styles.statDivider} />}
              <div key={s.label} style={styles.stat}>
                <span style={styles.statValue}>{s.value}</span>
                <span style={styles.statLabel}>{s.label}</span>
              </div>
            </>
          ))}
        </div>
      </div>

      <div style={styles.tagRow}>
        {TAGS.map((t) => (
          <span key={t} style={styles.tag}>{t}</span>
        ))}
      </div>
    </section>
  );
}

const C = { teal: "#00d2a0", bg: "#080c10", text: "#e8edf2", muted: "#7a8fa8" };

const styles = {
  root: {
    background: C.bg,
    minHeight: "100vh",
    padding: "64px 48px",
    fontFamily: "'Syne', sans-serif",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
  },
  gridBg: {
    position: "absolute", inset: 0, pointerEvents: "none",
    backgroundImage: `linear-gradient(rgba(0,230,180,0.04) 1px,transparent 1px),
                      linear-gradient(90deg,rgba(0,230,180,0.04) 1px,transparent 1px)`,
    backgroundSize: "40px 40px",
  },
  glow1: {
    position: "absolute", top: -80, right: -100, width: 500, height: 500,
    background: "radial-gradient(circle,rgba(0,210,160,0.10) 0%,transparent 70%)",
    pointerEvents: "none",
  },
  glow2: {
    position: "absolute", bottom: -100, left: "10%", width: 300, height: 300,
    background: "radial-gradient(circle,rgba(0,120,255,0.07) 0%,transparent 70%)",
    pointerEvents: "none",
  },
  content: { position: "relative", zIndex: 1, maxWidth: 720 },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    background: "rgba(0,210,160,0.08)", border: "0.5px solid rgba(0,210,160,0.3)",
    color: C.teal, fontFamily: "'Space Mono',monospace", fontSize: 11,
    letterSpacing: "0.12em", padding: "6px 14px", borderRadius: 2,
    marginBottom: 28, textTransform: "uppercase",
  },
  dot: {
    width: 6, height: 6, borderRadius: "50%", background: C.teal, display: "block",
  },
  sub: {
    fontFamily: "'Space Mono',monospace", fontSize: 13, color: "#3a8c74",
    letterSpacing: "0.06em", margin: "0 0 8px",
  },
  headline: {
    fontSize: "clamp(36px,5vw,56px)", fontWeight: 800, color: C.text,
    lineHeight: 1.08, margin: "0 0 20px", letterSpacing: "-0.02em",
  },
  accent: { color: C.teal },
  description: {
    fontSize: 16, fontWeight: 400, color: C.muted, lineHeight: 1.7,
    maxWidth: 560, margin: "0 0 40px",
  },
  em: { color: "#a8bcd0", fontStyle: "normal" },
  ctaRow: { display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 52 },
  btnPrimary: {
    background: C.teal, color: "#040a07",
    fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 700,
    letterSpacing: "0.08em", padding: "13px 28px", border: "none",
    borderRadius: 2, cursor: "pointer", textTransform: "uppercase",
  },
  btnOutline: {
    background: "transparent", color: "#a8bcd0",
    fontFamily: "'Space Mono',monospace", fontSize: 12, fontWeight: 400,
    letterSpacing: "0.08em", padding: "13px 28px",
    border: "0.5px solid rgba(168,188,208,0.25)", borderRadius: 2,
    cursor: "pointer", textTransform: "uppercase",
  },
  statsRow: { display: "flex", gap: 40, flexWrap: "wrap" },
  stat: { display: "flex", flexDirection: "column", gap: 2 },
  statValue: { fontSize: 22, fontWeight: 800, color: C.text, letterSpacing: "-0.02em" },
  statLabel: {
    fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#3e5568",
    letterSpacing: "0.1em", textTransform: "uppercase",
  },
  statDivider: { width: 0.5, background: "rgba(255,255,255,0.07)", alignSelf: "stretch", margin: "2px 0" },
  tagRow: {
    position: "absolute", bottom: 40, right: 48, display: "flex",
    gap: 8, flexWrap: "wrap", justifyContent: "flex-end", maxWidth: 320, zIndex: 1,
  },
  tag: {
    fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#2a5a4a",
    background: "rgba(0,210,160,0.05)", border: "0.5px solid rgba(0,210,160,0.15)",
    padding: "4px 10px", borderRadius: 2, letterSpacing: "0.06em", textTransform: "uppercase",
  },
};