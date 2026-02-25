import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { CountUp } from '@/components/count-up';
import { TestimonialsCarousel } from '@/components/testimonials-carousel';

/* ---- Property-themed SVG background patterns (heropatterns.com, CC BY 4.0) ---- */

/** Architect / random dots pattern — subtle blueprint feel */
const architectPattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%233b5dff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`;

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold shadow-sm shadow-primary/25">
              CL
            </div>
            <span className="text-lg font-bold sm:text-xl">ConditionLog</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" className="shadow-sm shadow-primary/25" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main id="main-content" className="flex-1">
        <section className="hero-gradient relative overflow-hidden">
          {/* Blueprint-style background pattern */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: architectPattern }}
            aria-hidden="true"
          />
          {/* Floating decorative orbs */}
          <div className="pointer-events-none absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-primary/5 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute right-[15%] bottom-[15%] h-48 w-48 rounded-full bg-violet-500/5 blur-3xl" aria-hidden="true" />

          <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28 lg:py-36">
            {/* Pill badge with ping animation */}
            <div className="animate-slide-down inline-flex items-center gap-2 rounded-full border bg-card/80 px-4 py-1.5 text-sm shadow-sm backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-muted-foreground">Free &amp; open for all renters</span>
            </div>

            <h1 className="animate-slide-up mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Protect Your<br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-violet-500 bg-clip-text text-transparent animate-gradient-x">
                Security Deposit
              </span>
            </h1>

            <p className="animate-slide-up delay-200 mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
              Document your rental property condition with timestamped photos and detailed notes.
              Generate professional reports that hold up when it matters most.
            </p>

            <div className="animate-slide-up delay-300 mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25 group" asChild>
                <Link href="/register">
                  Start Documenting Free
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-0.5" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="animate-fade-in delay-500 mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                Unlimited reports
              </span>
              <span className="flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                Works on any device
              </span>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
            <ScrollReveal direction="up">
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">Simple process</p>
                <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Three Steps to Protection</h2>
                <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                  Documenting your rental takes minutes but could save you thousands in deposit disputes.
                </p>
              </div>
            </ScrollReveal>

            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              <ScrollReveal delay={0}>
                <StepCard
                  step={1}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                  title="Add Your Property"
                  description="Enter your rental address, landlord info, and lease details. Set up in under a minute."
                />
              </ScrollReveal>
              <ScrollReveal delay={150}>
                <StepCard
                  step={2}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>}
                  title="Document Each Room"
                  description="Walk through every room. Snap photos, add notes about walls, floors, fixtures, and appliances."
                />
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <StepCard
                  step={3}
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m8 17 4 4 4-4" /></svg>}
                  title="Share & Download"
                  description="Generate a professional PDF, share via link or email. Your evidence — timestamped and irrefutable."
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Stats / Social Proof */}
        <section className="border-t bg-muted/40 relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: architectPattern }}
            aria-hidden="true"
          />
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 relative">
            <div className="grid gap-8 sm:grid-cols-3">
              <ScrollReveal delay={0}>
                <div className="stat-card rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-md">
                  <p className="text-3xl font-extrabold text-primary">
                    <CountUp end={100} suffix="%" />
                  </p>
                  <p className="mt-1 font-medium">Free to use</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">No hidden fees, ever</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={150}>
                <div className="stat-card rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-md">
                  <p className="text-3xl font-extrabold text-primary flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Timestamped
                  </p>
                  <p className="mt-1 font-medium">Every photo is dated</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">Tamper-proof documentation</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div className="stat-card rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-md">
                  <p className="text-3xl font-extrabold text-primary flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>
                    Shareable
                  </p>
                  <p className="mt-1 font-medium">PDF + link sharing</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">Send to landlords instantly</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="border-t relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24 relative">
            <ScrollReveal>
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">Why ConditionLog</p>
                <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Everything You Need</h2>
              </div>
            </ScrollReveal>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <ScrollReveal delay={0}>
                <HighlightCard
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>}
                  title="Room-by-Room Walkthrough"
                  description="Guided inspection flow for kitchen, bathroom, bedroom, and more."
                />
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <HighlightCard
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>}
                  title="Photo Documentation"
                  description="Upload unlimited photos with automatic timestamps and cloud storage."
                />
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <HighlightCard
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.342a2 2 0 0 0-.602-1.43l-4.44-4.342A2 2 0 0 0 13.56 2H6a2 2 0 0 0-2 2z"/><path d="M9 13h6"/><path d="M9 17h3"/></svg>}
                  title="Professional PDF Reports"
                  description="One-click PDF generation with cover page, photos, and notes."
                />
              </ScrollReveal>
              <ScrollReveal delay={0}>
                <HighlightCard
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>}
                  title="Instant Sharing"
                  description="Share reports via secure link or send directly by email."
                />
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <HighlightCard
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>}
                  title="Works on Any Device"
                  description="Responsive design works on phone, tablet, or desktop. Install as a PWA."
                />
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <HighlightCard
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>}
                  title="Secure & Private"
                  description="Your data is encrypted and only accessible to you. No third-party access."
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Impact Numbers */}
        <section className="border-t bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <ScrollReveal>
              <div className="text-center mb-12">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">The numbers speak</p>
                <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Deposit Disputes Are Real</h2>
              </div>
            </ScrollReveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <ScrollReveal delay={0}>
                <div className="rounded-xl border bg-card p-6 text-center">
                  <p className="text-4xl font-extrabold text-primary">
                    $<CountUp end={4000} duration={2500} />
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">Average deposit in the US</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <div className="rounded-xl border bg-card p-6 text-center">
                  <p className="text-4xl font-extrabold text-primary">
                    <CountUp end={36} />%
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">of renters lose some deposit</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="rounded-xl border bg-card p-6 text-center">
                  <p className="text-4xl font-extrabold text-primary">
                    <CountUp end={26} />%
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">don&apos;t document condition</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div className="rounded-xl border bg-card p-6 text-center">
                  <p className="text-4xl font-extrabold text-primary">
                    <CountUp end={5} /> min
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">to set up your first report</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: architectPattern }}
            aria-hidden="true"
          />
          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24 relative">
            <ScrollReveal>
              <div className="text-center mb-12">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">Trusted by renters</p>
                <h2 className="mt-2 text-3xl font-bold sm:text-4xl">What Our Users Say</h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <TestimonialsCarousel />
            </ScrollReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-gradient-to-br from-primary via-primary to-violet-600 text-primary-foreground relative overflow-hidden">
          {/* Decorative orbs */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" aria-hidden="true" />
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20 relative">
            <ScrollReveal>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Don&apos;t Wait Until Move-Out
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80 text-lg">
                Start documenting your rental condition today. It takes minutes and could save you thousands in deposit disputes.
              </p>
              <Button size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base shadow-lg group" asChild>
                <Link href="/register">
                  Get Started Now
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-0.5" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
              CL
            </div>
            <span className="font-semibold">ConditionLog</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ConditionLog. Protecting renters&apos; deposits.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ---- Sub-components ---- */

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group relative rounded-xl border bg-card p-8 text-center transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Step number */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground shadow-sm">
        Step {step}
      </div>
      {/* Gradient accent on hover */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-violet-500 opacity-0 transition-opacity group-hover:opacity-100 rounded-b-xl" aria-hidden="true" />
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function HighlightCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-xl border bg-card p-6 transition-all hover:shadow-md hover:border-primary/30 relative overflow-hidden">
      {/* Subtle gradient background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-violet-500/5 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all group-hover:bg-primary/15 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="mt-4 font-semibold">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
