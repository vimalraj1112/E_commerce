// Reusable Framer Motion variants for a cohesive premium motion language.
// Import these anywhere for consistent entrance/tap transitions.

/** Fade + rise on scroll into view */
export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Parent that staggers its children into view */
export const staggerContainer = (stagger = 0.08, delay = 0) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** Blur + fade for hero words/lines */
export const blurUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Soft scale fade for cards / modals */
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

/** Slide in from the right (drawers, panels) */
export const slideRight = {
  hidden: { x: "110%" },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 260, damping: 30 },
  },
};

/** For whileHover on primary buttons */
export const springTap = { scale: 0.97 };

export const viewportOnce = { once: true, margin: "-80px" };

export const pageTransition = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};