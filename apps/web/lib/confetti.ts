'use client';

import confetti from 'canvas-confetti';

/**
 * Fire a celebration confetti burst.
 * Automatically skips for prefers-reduced-motion.
 */
export function fireConfetti() {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const duration = 2500;
  const end = Date.now() + duration;

  const colors = ['#3b5dff', '#7c3aed', '#06b6d4', '#f59e0b', '#10b981'];

  // Initial burst
  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.6 },
    colors,
    disableForReducedMotion: true,
  });

  // Continuous shower
  const interval = setInterval(() => {
    if (Date.now() > end) {
      clearInterval(interval);
      return;
    }

    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
      disableForReducedMotion: true,
    });
  }, 150);
}
