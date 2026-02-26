import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Branding side panel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between bg-[#080C12] p-10 text-foreground border-r border-[#1E2A3A]/60 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute -left-20 top-1/3 h-64 w-64 rounded-full bg-[#00E5C5]/5 blur-3xl pointer-events-none" aria-hidden="true" />
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <Logo size={28} />
          <span className="text-lg font-bold tracking-tight">ConditionLog</span>
        </Link>

        <div className="max-w-md relative z-10">
          <blockquote className="font-display text-2xl font-semibold uppercase leading-snug tracking-tight">
            &ldquo;I saved $2,400 on my security deposit because I had timestamped photos of every room.&rdquo;
          </blockquote>
          <p className="mt-4 text-[#8A94A6]">
            — Every renter who documented their move-in
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-[#8A94A6] relative z-10">
          <span className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E5C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
            Secure
          </span>
          <span className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E5C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
            Mobile-ready
          </span>
          <span className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E5C5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
            Free forever
          </span>
        </div>
      </div>

      {/* Auth form panel */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#0F1620] p-4 sm:p-8">
        {/* Mobile logo */}
        <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <Logo size={28} />
          <span className="text-lg font-bold tracking-tight">ConditionLog</span>
        </Link>

        <div className="w-full max-w-md animate-scale-in">{children}</div>
      </div>
    </div>
  );
}
