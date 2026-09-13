import React from "react";
import { motion } from "framer-motion";

// Full-page colorful animated ambience.
// Fixed behind all content; drifting aurora blobs + a soft shifting gradient.
const BLOBS = [
  { color: "rgba(56,189,248,0.75)", size: 460, top: "-8%", left: "-6%", dur: 16, dx: 90, dy: 120 },
  { color: "rgba(168,85,247,0.75)", size: 420, top: "16%", left: "80%", dur: 20, dx: -110, dy: 60 },
  { color: "rgba(236,72,153,0.65)", size: 400, top: "60%", left: "-12%", dur: 18, dx: 80, dy: -90 },
  { color: "rgba(52,211,153,0.70)", size: 440, top: "72%", left: "72%", dur: 24, dx: -70, dy: -110 },
  { color: "rgba(250,204,21,0.55)", size: 300, top: "38%", left: "44%", dur: 21, dx: 60, dy: 60 },
  { color: "rgba(99,102,241,0.65)", size: 360, top: "4%", left: "38%", dur: 17, dx: 50, dy: 80 },
];

const AnimatedBackground = () => {
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return <div className="fixed inset-0 -z-10 bg-[#0b1220] bg-[linear-gradient(120deg,#38bdf8,#6366f1,#a855f7,#ec4899,#f59e0b)] bg-[length:300%_300%]" />;
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0b1220]">
      {/* vivid shifting aurora gradient — THE changing background color */}
      <div className="absolute inset-0 bg-aurora opacity-80" />
      {/* brighter soft wash on top */}
      <div className="absolute inset-0 bg-aurora-soft" />
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="aurora-blob"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: `radial-gradient(circle, ${b.color}, transparent 70%)`,
          }}
          animate={{
            x: [0, b.dx, 0, -b.dx * 0.6, 0],
            y: [0, b.dy, 0, -b.dy * 0.5, 0],
            scale: [1, 1.2, 0.95, 1.15, 1],
          }}
          transition={{
            duration: b.dur,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;