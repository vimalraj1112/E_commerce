import React, { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, animate } from "framer-motion";

// Counts up to `to` when scrolled into view. Prefix/suffix supported.
const CountUp = ({ to, prefix = "", suffix = "", duration = 1.6, decimals = 0 }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, {
        duration,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (v) =>
          setDisplay(
            decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString()
          ),
      });
      return () => controls.stop();
    }
  }, [inView, to, duration, decimals]);

  return (
    <span ref={ref}>
      {prefix}{display}{suffix}
    </span>
  );
};

export default CountUp;