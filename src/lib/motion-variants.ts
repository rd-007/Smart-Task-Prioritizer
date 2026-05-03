import type { Variants, Transition } from "framer-motion";

// ============================================================
// Smart Task Prioritizer — Shared Motion Variants
// Source: DESIGN.md §13
// ============================================================

// ---------- Transitions ----------

/** Default snappy transition */
export const snappy: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

/** Smooth ease transition */
export const smooth: Transition = {
  duration: 0.2,
  ease: "easeOut",
};

// ---------- Card Hover Rise (4px) ----------

export const cardHover: Variants = {
  rest: {
    y: 0,
    boxShadow:
      "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
    transition: smooth,
  },
  hover: {
    y: -4,
    boxShadow:
      "0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07)",
    transition: smooth,
  },
};

// ---------- Fade In (page transition 180ms) ----------

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.18,
      ease: "easeOut",
    },
  },
};

// ---------- Fade In Up (for staggered lists) ----------

export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// ---------- Stagger Container ----------

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

// ---------- Sidebar Slide ----------

export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -16,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

// ---------- Slide In Right (sheet / panel) ----------

export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 16,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.25,
      ease: "easeOut",
    },
  },
};

// ---------- Scale In (modal / dialog) ----------

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.18,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.12,
      ease: "easeIn",
    },
  },
};

// ---------- Progress Fill ----------

export const progressFill: Variants = {
  hidden: { width: "0%" },
  visible: (width: string) => ({
    width,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  }),
};

// ---------- Confetti Burst (task complete) ----------

export const confettiBurst: Variants = {
  hidden: {
    scale: 0,
    opacity: 0,
  },
  visible: {
    scale: [0, 1.2, 1],
    opacity: [0, 1, 1],
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// ---------- Pulse (notification badge) ----------

export const pulse: Variants = {
  rest: { scale: 1 },
  pulse: {
    scale: [1, 1.15, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatDelay: 2,
    },
  },
};
