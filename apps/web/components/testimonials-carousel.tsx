'use client';

import { useEffect, useState, useCallback } from 'react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "I got my entire $2,400 deposit back thanks to the photos and PDF I shared with my landlord. Without ConditionLog, I would have had no proof.",
    author: "Sarah M.",
    role: "Renter in Portland, OR",
  },
  {
    quote: "So simple to use. I documented my entire apartment in under 20 minutes on move-in day. When I moved out, I had timestamped evidence of every scratch that was already there.",
    author: "James K.",
    role: "Renter in Austin, TX",
  },
  {
    quote: "My property manager tried to charge me for pre-existing damage. I pulled up my ConditionLog report and the charges were dropped immediately.",
    author: "Priya D.",
    role: "Renter in Chicago, IL",
  },
  {
    quote: "As a property manager, I actually recommend ConditionLog to my tenants. It makes move-in/move-out inspections transparent and fair for everyone.",
    author: "Tom R.",
    role: "Property Manager, Denver, CO",
  },
];

export function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const next = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  }, []);

  const prev = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setIsAnimating(false);
    }, 300);
  }, []);

  // Auto-advance every 6 seconds
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[current]!;

  return (
    <div className="relative mx-auto max-w-2xl text-center">
      {/* Quote icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="mx-auto mb-4 text-primary/20"
        aria-hidden="true"
      >
        <path d="M11.3 2.7c-2 1.3-3.8 3.3-5.3 6-1.2 2.2-1.7 4-1.7 5.5 0 1.8.5 3.2 1.6 4.2s2.3 1.6 3.8 1.6c1.1 0 2.1-.4 2.9-1.1.8-.8 1.2-1.7 1.2-2.9 0-1-.4-1.9-1.1-2.6-.7-.7-1.6-1.1-2.7-1.1-.4 0-.9.1-1.5.3.8-2.1 2.3-4.1 4.5-6l-1.7-3.9zm10.3 0c-2 1.3-3.8 3.3-5.3 6-1.2 2.2-1.7 4-1.7 5.5 0 1.8.5 3.2 1.6 4.2s2.3 1.6 3.8 1.6c1.1 0 2.1-.4 2.9-1.1.8-.8 1.2-1.7 1.2-2.9 0-1-.4-1.9-1.1-2.6-.7-.7-1.6-1.1-2.7-1.1-.4 0-.9.1-1.5.3.8-2.1 2.3-4.1 4.5-6L21.6 2.7z" />
      </svg>

      <div
        className="min-h-[120px] transition-all duration-300"
        style={{
          opacity: isAnimating ? 0 : 1,
          transform: isAnimating ? 'translateY(10px)' : 'translateY(0)',
        }}
      >
        <blockquote className="text-lg leading-relaxed text-foreground/90 sm:text-xl">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <div className="mt-4">
          <p className="font-semibold">{t.author}</p>
          <p className="text-sm text-muted-foreground">{t.role}</p>
        </div>
      </div>

      {/* Dots + navigation */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={prev}
          className="flex h-8 w-8 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Previous testimonial"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIsAnimating(true); setTimeout(() => { setCurrent(i); setIsAnimating(false); }, 300); }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="flex h-8 w-8 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Next testimonial"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
