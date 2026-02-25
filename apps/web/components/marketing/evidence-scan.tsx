'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BoundingBox {
  id: string;
  label: string;
  x: number; // % from left
  y: number; // % from top
  width: number; // % width
  height: number; // % height
  delay: number; // seconds
  severity: 'good' | 'minor' | 'severe';
}

const defaultBoxes: BoundingBox[] = [
  { id: 'wall', label: 'Wall — No damage', x: 8, y: 12, width: 35, height: 28, delay: 0.8, severity: 'good' },
  { id: 'floor', label: 'Scratch detected', x: 55, y: 62, width: 38, height: 18, delay: 1.4, severity: 'minor' },
  { id: 'fixture', label: 'Light fixture OK', x: 30, y: 5, width: 22, height: 14, delay: 2.0, severity: 'good' },
  { id: 'baseboard', label: 'Scuff mark', x: 10, y: 75, width: 30, height: 12, delay: 2.4, severity: 'minor' },
];

const severityColors = {
  good: { border: '#00E5C5', bg: 'rgba(0, 229, 197, 0.08)', text: '#00E5C5' },
  minor: { border: '#F5A623', bg: 'rgba(245, 166, 35, 0.08)', text: '#F5A623' },
  severe: { border: '#FF4D4D', bg: 'rgba(255, 77, 77, 0.08)', text: '#FF4D4D' },
};

export function EvidenceScan({
  boxes = defaultBoxes,
  className = '',
}: {
  boxes?: BoundingBox[];
  className?: string;
}) {
  const [scanActive, setScanActive] = useState(false);
  const [visibleBoxes, setVisibleBoxes] = useState<Set<string>>(new Set());
  const [scanComplete, setScanComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !scanActive) {
          startScan();
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
      timerRef.current.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startScan() {
    setScanActive(true);
    setVisibleBoxes(new Set());
    setScanComplete(false);

    // Reveal boxes at their delay times
    boxes.forEach((box) => {
      const t = setTimeout(() => {
        setVisibleBoxes((prev) => new Set(prev).add(box.id));
      }, box.delay * 1000);
      timerRef.current.push(t);
    });

    // Mark complete
    const maxDelay = Math.max(...boxes.map((b) => b.delay)) + 1;
    const t = setTimeout(() => {
      setScanComplete(true);
    }, maxDelay * 1000);
    timerRef.current.push(t);

    // Restart cycle
    const restart = setTimeout(() => {
      setScanActive(false);
      setVisibleBoxes(new Set());
      setScanComplete(false);
      setTimeout(() => startScan(), 800);
    }, (maxDelay + 3) * 1000);
    timerRef.current.push(restart);
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl bg-[#0A1018] ${className}`}
      style={{ aspectRatio: '9/16' }}
    >
      {/* Simulated room photo (gradient placeholder) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A2233] via-[#0F1620] to-[#1A2233]">
        {/* Simulated room elements */}
        <div className="absolute inset-[8%] rounded-lg border border-[#1E2A3A]/50">
          {/* Wall texture lines */}
          <div className="absolute top-[20%] left-[10%] right-[10%] h-px bg-[#1E2A3A]/30" />
          <div className="absolute top-[40%] left-[10%] right-[10%] h-px bg-[#1E2A3A]/30" />
          <div className="absolute top-[60%] left-[10%] right-[10%] h-px bg-[#1E2A3A]/30" />
          <div className="absolute top-[80%] left-[10%] right-[10%] h-px bg-[#1E2A3A]/30" />
          {/* Floor line */}
          <div className="absolute bottom-[25%] left-0 right-0 h-px bg-[#1E2A3A]/60" />
          {/* Window shape */}
          <div className="absolute top-[10%] left-[30%] w-[25%] h-[20%] rounded border border-[#1E2A3A]/40 bg-[#0F1620]/50" />
          {/* Baseboard */}
          <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-[#1A2233]/60" />
        </div>
      </div>

      {/* Scan line */}
      <AnimatePresence>
        {scanActive && !scanComplete && (
          <motion.div
            initial={{ top: '0%', opacity: 0 }}
            animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            className="absolute left-0 right-0 z-10 h-[2px]"
            style={{
              background: 'linear-gradient(90deg, transparent, #00E5C5, transparent)',
              boxShadow: '0 0 20px 4px rgba(0, 229, 197, 0.3)',
            }}
          >
            {/* Scan spread glow */}
            <div
              className="absolute left-0 right-0 -top-12 h-24 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, transparent, rgba(0, 229, 197, 0.05), transparent)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bounding boxes */}
      {boxes.map((box) => {
        const colors = severityColors[box.severity];
        const isVisible = visibleBoxes.has(box.id);
        return (
          <AnimatePresence key={box.id}>
            {isVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute z-20"
                style={{
                  left: `${box.x}%`,
                  top: `${box.y}%`,
                  width: `${box.width}%`,
                  height: `${box.height}%`,
                }}
              >
                {/* Corner brackets */}
                <div className="absolute inset-0" style={{ borderColor: colors.border }}>
                  {/* Top-left */}
                  <div className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 rounded-tl-sm" style={{ borderColor: colors.border }} />
                  {/* Top-right */}
                  <div className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 rounded-tr-sm" style={{ borderColor: colors.border }} />
                  {/* Bottom-left */}
                  <div className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 rounded-bl-sm" style={{ borderColor: colors.border }} />
                  {/* Bottom-right */}
                  <div className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 rounded-br-sm" style={{ borderColor: colors.border }} />
                </div>

                {/* Background fill */}
                <div className="absolute inset-0" style={{ background: colors.bg }} />

                {/* Label */}
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="absolute -top-6 left-0 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span
                    className="inline-block h-1.5 w-1.5 rounded-full"
                    style={{ background: colors.border }}
                  />
                  <span
                    className="text-[10px] font-mono font-medium tracking-wide"
                    style={{ color: colors.text }}
                  >
                    {box.label}
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        );
      })}

      {/* Scan status indicator */}
      <div className="absolute bottom-4 left-4 right-4 z-30">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              scanComplete
                ? 'bg-[#00E5C5]'
                : scanActive
                ? 'bg-[#F5A623] animate-pulse'
                : 'bg-[#1E2A3A]'
            }`}
          />
          <span className="font-mono text-[10px] tracking-wider text-[#8A94A6]">
            {scanComplete
              ? 'SCAN COMPLETE — 4 AREAS ANALYZED'
              : scanActive
              ? 'SCANNING...'
              : 'READY'}
          </span>
        </div>
        {scanComplete && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mt-2 h-0.5 rounded-full bg-gradient-to-r from-[#00E5C5] to-[#00E5C5]/30"
          />
        )}
      </div>

      {/* Timestamp chip */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 rounded-full bg-[#080C12]/80 px-2.5 py-1 backdrop-blur-sm border border-[#1E2A3A]/50">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#00E5C5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span className="font-mono text-[9px] tracking-wider text-[#8A94A6]">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
        </span>
      </div>
    </div>
  );
}
