// ─── Framer Motion Variants ────────────────────────────────────────────────────

export const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const cardVariants = {
  hidden: { opacity: 0, y: 32, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.8, 0.25, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.96,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }),
};
