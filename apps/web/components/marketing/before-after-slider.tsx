'use client';

import { useRef, useState, useCallback } from 'react';

export function BeforeAfterSlider({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setPosition(pct);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  }, [updatePosition]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  }, [isDragging, updatePosition]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl border border-[#1E2A3A] bg-[#0A1018] ${className}`}
      style={{ aspectRatio: '4/3', touchAction: 'none' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* "After" layer (full background) — damage visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A2233] via-[#0F1620] to-[#1A2233]">
        {/* Simulate room with visible damage */}
        <div className="absolute inset-[6%] rounded-lg">
          {/* Wall */}
          <div className="absolute top-[5%] left-[5%] right-[5%] bottom-[40%] rounded-lg bg-[#1E2A3A]/40" />
          {/* Floor */}
          <div className="absolute bottom-[5%] left-[5%] right-[5%] top-[60%] rounded-lg bg-[#1A2233]/60" />
          {/* Damage marks */}
          <div className="absolute top-[25%] left-[35%] w-12 h-8 rounded bg-[#F5A623]/15 border border-[#F5A623]/30" />
          <div className="absolute top-[45%] left-[55%] w-8 h-6 rounded bg-[#FF4D4D]/15 border border-[#FF4D4D]/30" />
          <div className="absolute bottom-[20%] left-[20%] w-16 h-3 rounded bg-[#F5A623]/10 border border-[#F5A623]/20" />
        </div>
        {/* Label */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-[#080C12]/80 px-2.5 py-1 backdrop-blur-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-[#F5A623]" />
          <span className="font-mono text-[10px] tracking-wider text-[#F5A623]">MOVE-OUT</span>
        </div>
      </div>

      {/* "Before" layer (clipped) — clean room */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-[#1A2233] via-[#0F1620] to-[#1A2233]"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        {/* Simulate clean room */}
        <div className="absolute inset-[6%] rounded-lg">
          {/* Wall */}
          <div className="absolute top-[5%] left-[5%] right-[5%] bottom-[40%] rounded-lg bg-[#1E2A3A]/40" />
          {/* Floor */}
          <div className="absolute bottom-[5%] left-[5%] right-[5%] top-[60%] rounded-lg bg-[#1A2233]/60" />
          {/* Clean — no damage marks */}
        </div>
        {/* Label */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-[#080C12]/80 px-2.5 py-1 backdrop-blur-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-[#00E5C5]" />
          <span className="font-mono text-[10px] tracking-wider text-[#00E5C5]">MOVE-IN</span>
        </div>
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 z-10 w-[2px]"
        style={{
          left: `${position}%`,
          background: 'linear-gradient(180deg, transparent, #00E5C5, transparent)',
          boxShadow: '0 0 12px 2px rgba(0, 229, 197, 0.25)',
        }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing"
        style={{ left: `${position}%` }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#00E5C5] bg-[#080C12]/90 shadow-lg backdrop-blur-sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00E5C5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8L22 12L18 16" />
            <path d="M6 8L2 12L6 16" />
          </svg>
        </div>
      </div>

      {/* Instruction text */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 rounded-full bg-[#080C12]/70 px-3 py-1 backdrop-blur-sm border border-[#1E2A3A]/50">
        <span className="font-mono text-[9px] tracking-widest text-[#8A94A6] uppercase">
          Drag to compare
        </span>
      </div>
    </div>
  );
}
