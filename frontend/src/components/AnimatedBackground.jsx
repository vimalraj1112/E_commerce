import React from "react";
import { motion } from "framer-motion";

// Full-page black & white ambience with a soft, transparent shopping-photo backdrop.
// The photo is painted at low opacity (so it reads as "transparent") and softened by a
// light gradient, keeping every card readable. Gray motion blobs drift on top.
const SHOP_IMG =
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1800&q=70";

const BLOBS = [
  { color: "rgba(220,220,220,0.85)", size: 460, top: "-8%", left: "-6%", dur: 16, dx: 90, dy: 120 },
  { color: "rgba(200,200,200,0.7)", size: 420, top: "16%", left: "80%", dur: 20, dx: -110, dy: 60 },
  { color: "rgba(230,230,230,0.9)", size: 400, top: "60%", left: "-12%", dur: 18, dx: 80, dy: -90 },
  { color: "rgba(210,210,210,0.8)", size: 440, top: "72%", left: "72%", dur: 24, dx: -70, dy: -110 },
  { color: "rgba(235,235,235,0.9)", size: 300, top: "38%", left: "44%", dur: 21, dx: 60, dy: 60 },
  { color: "rgba(215,215,215,0.8)", size: 360, top: "4%", left: "38%", dur: 17, dx: 50, dy: 80 },
];

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#f4f4f5]">
      {/* transparent shopping-photo backdrop */}
      <img
        src={SHOP_IMG}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-[0.22] grayscale"
        loading="eager"
      />
      {/* soft light veil so cards/text stay readable over the photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#f4f4f5]/70 via-[#f4f4f5]/60 to-[#f4f4f5]/80" />

      {/* subtle neutral shifting gradient + drifting gray blobs for motion */}
      <div className="absolute inset-0 bg-aurora-bw opacity-60" />
      {BLOBS.map((b, i) => (
        <motion.div
          key={i}
          className="aurora-blob-bw"
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