'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ScoreRingProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return '#00E5C5';
  if (score >= 50) return '#F5A623';
  return '#FF4D4D';
}

function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Fair';
  if (score >= 40) return 'Needs Attention';
  return 'Poor';
}

export function ScoreRing({
  score,
  size = 180,
  strokeWidth = 10,
  label,
  sublabel,
  className = '',
}: ScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(score); // SSR shows real score
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(score);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setAnimatedScore(score);
      return;
    }

    // Reset to 0 only client-side before animation
    setAnimatedScore(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [isVisible, score]);

  useEffect(() => {
    if (!isVisible) return;

    let raf: number;
    const duration = 1500;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    }

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, score]);

  return (
    <div ref={containerRef} className={`flex flex-col items-center ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="score-ring-track"
            strokeWidth={strokeWidth}
          />
          {/* Fill */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="score-ring-fill"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={isVisible ? offset : circumference}
            style={{
              filter: `drop-shadow(0 0 6px ${color}40)`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-display text-4xl font-bold tracking-tight"
            style={{ color }}
          >
            {animatedScore}
          </motion.span>
          <span className="text-xs font-medium text-muted-foreground tracking-wider uppercase mt-0.5">
            {label || getScoreLabel(score)}
          </span>
        </div>
      </div>
      {sublabel && (
        <p className="mt-3 text-sm text-muted-foreground text-center">{sublabel}</p>
      )}
    </div>
  );
}
