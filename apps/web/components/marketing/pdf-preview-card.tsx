'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export function PdfPreviewCard({ className = '' }: { className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateY(((x - centerX) / centerX) * 12);
    setRotateX(-((y - centerY) / centerY) * 12);
  }

  function handleMouseLeave() {
    setRotateX(0);
    setRotateY(0);
    setIsHovering(false);
  }

  return (
    <div className={`perspective-[800px] ${className}`}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: isHovering ? rotateX : 2,
          rotateY: isHovering ? rotateY : -4,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative w-64 rounded-2xl border border-[#1E2A3A] bg-[#0F1620] p-6 shadow-2xl will-change-transform"
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: isHovering
            ? '0 20px 60px -10px rgba(0, 229, 197, 0.15), 0 8px 20px -6px rgba(0, 0, 0, 0.4)'
            : '0 10px 40px -10px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* PDF Header */}
        <div className="flex items-center gap-2 border-b border-[#1E2A3A] pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF4D4D]/10">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF4D4D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold text-foreground">Condition_Report.pdf</p>
            <p className="text-[10px] text-muted-foreground font-mono">2.4 MB · 12 pages</p>
          </div>
        </div>

        {/* Simulated PDF content */}
        <div className="mt-4 space-y-3">
          {/* Title line */}
          <div className="h-2.5 w-3/4 rounded-full bg-[#1A2233]" />
          <div className="h-2 w-full rounded-full bg-[#1A2233]/60" />
          <div className="h-2 w-5/6 rounded-full bg-[#1A2233]/60" />

          {/* Image placeholder */}
          <div className="mt-3 flex gap-2">
            <div className="h-12 w-12 rounded-lg bg-[#1A2233] flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E5C5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5">
                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="h-2 w-full rounded-full bg-[#1A2233]/60" />
              <div className="h-2 w-3/4 rounded-full bg-[#1A2233]/60" />
            </div>
          </div>

          {/* Status row */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex h-5 items-center gap-1 rounded-full bg-[#00E5C5]/10 px-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#00E5C5]" />
              <span className="text-[9px] font-mono text-[#00E5C5]">VERIFIED</span>
            </div>
            <div className="flex h-5 items-center gap-1 rounded-full bg-[#F5A623]/10 px-2">
              <div className="h-1.5 w-1.5 rounded-full bg-[#F5A623]" />
              <span className="text-[9px] font-mono text-[#F5A623]">3 FINDINGS</span>
            </div>
          </div>
        </div>

        {/* Gloss / reflection effect on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)',
            opacity: isHovering ? 1 : 0,
          }}
        />
      </motion.div>
    </div>
  );
}
