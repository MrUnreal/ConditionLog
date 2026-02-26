'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  end: number;
  /** Duration of the animation in ms */
  duration?: number;
  /** Prefix to display before the number (e.g., "$") */
  prefix?: string;
  /** Suffix to display after the number (e.g., "%", "+") */
  suffix?: string;
  /** Number of decimal places */
  decimals?: number;
  /** Use locale formatting (e.g., 1,000) */
  useLocale?: boolean;
  className?: string;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function CountUp({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  useLocale = true,
  className = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(end); // Default to end value so "0" never shows
  const [hasStarted, setHasStarted] = useState(false);

  // Start counting when element becomes visible
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setValue(end);
      return;
    }

    // Reset to 0 only once we know the observer is set up (client-side)
    setValue(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, hasStarted]);

  // Run animation
  useEffect(() => {
    if (!hasStarted) return;

    let raf: number;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setValue(eased * end);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setValue(end);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hasStarted, end, duration]);

  const formatted = useLocale
    ? value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : value.toFixed(decimals);

  return (
    <span ref={ref} className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
