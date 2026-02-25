import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { CountUp } from '@/components/count-up';
import { TestimonialsCarousel } from '@/components/testimonials-carousel';
import { EvidenceScan } from '@/components/marketing/evidence-scan';
import { ScoreRing } from '@/components/marketing/score-ring';
import { PdfPreviewCard } from '@/components/marketing/pdf-preview-card';
import { BeforeAfterSlider } from '@/components/marketing/before-after-slider';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#080C12]">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-[#1E2A3A]/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00E5C5] text-[#080C12] text-sm font-bold shadow-sm shadow-[#00E5C5]/20">
              CL
            </div>
            <span className="text-lg font-bold tracking-tight sm:text-xl">ConditionLog</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" className="text-[#8A94A6] hover:text-foreground" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" className="bg-[#00E5C5] text-[#080C12] hover:bg-[#00E5C5]/90 shadow-sm shadow-[#00E5C5]/20 font-semibold" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero — Full viewport dark with Evidence Scan */}
      <main id="main-content" className="flex-1">
        <section className="hero-gradient noise-overlay relative overflow-hidden">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24 lg:py-32 relative z-10">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left column — Copy */}
              <div>
                <div className="animate-slide-down inline-flex items-center gap-2 rounded-full border border-[#1E2A3A] bg-[#0F1620]/80 px-4 py-1.5 text-sm backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00E5C5] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00E5C5]" />
                  </span>
                  <span className="text-[#8A94A6]">Free &amp; open for all renters</span>
                </div>

                <h1 className="animate-slide-up mt-6 font-display text-4xl font-extrabold uppercase tracking-tight leading-[0.95] sm:text-5xl lg:text-6xl">
                  Never Lose Your
                  <br />
                  Deposit{' '}
                  <span className="text-[#00E5C5]">
                    Again
                  </span>
                </h1>

                <p className="animate-slide-up delay-200 mt-6 max-w-lg text-lg text-[#8A94A6] leading-relaxed">
                  Document your rental with timestamped, evidence-grade photos. 
                  Generate professional reports that hold up when it matters most.
                </p>

                <div className="animate-slide-up delay-300 mt-8 flex flex-col items-start gap-3 sm:flex-row">
                  <Button size="lg" className="btn-glow h-12 px-8 text-base bg-[#00E5C5] text-[#080C12] hover:bg-[#00E5C5]/90 font-semibold shadow-lg shadow-[#00E5C5]/20 group" asChild>
                    <Link href="/register">
                      Start Documenting Free
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-0.5" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base border-[#1E2A3A] text-[#8A94A6] hover:text-foreground hover:border-[#00E5C5]/50 hover:bg-[#00E5C5]/5" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                </div>

                {/* Trust indicators */}
                <div className="animate-fade-in delay-500 mt-10 flex flex-wrap items-center gap-5 text-sm text-[#8A94A6]">
                  <span className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E5C5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                    No credit card
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E5C5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                    Unlimited reports
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00E5C5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                    Any device
                  </span>
                </div>
              </div>

              {/* Right column — Phone mockup with Evidence Scan */}
              <div className="animate-scale-in delay-300 flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Phone frame */}
                  <div className="relative mx-auto w-[260px] sm:w-[280px] rounded-[2.5rem] border-2 border-[#1E2A3A] bg-[#0A1018] p-2 shadow-2xl shadow-[#00E5C5]/5">
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-28 rounded-b-2xl bg-[#0A1018] z-30" />
                    {/* Screen */}
                    <div className="overflow-hidden rounded-[2rem]">
                      <EvidenceScan />
                    </div>
                  </div>
                  {/* Floating glow behind phone */}
                  <div className="absolute -inset-10 -z-10 rounded-full bg-[#00E5C5]/5 blur-3xl" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-t border-[#1E2A3A]/60 bg-[#080C12]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
            <ScrollReveal direction="up">
              <div className="text-center">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#00E5C5]">Simple process</p>
                <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">Three Steps to Protection</h2>
                <p className="mx-auto mt-3 max-w-lg text-[#8A94A6]">
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

        {/* Interactive Feature Showcase — Evidence Scan, Score Ring, Before/After */}
        <section className="border-t border-[#1E2A3A]/60 bg-[#0A0E14]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
            <ScrollReveal>
              <div className="text-center">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#00E5C5]">Evidence-grade tools</p>
                <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">Built for Proof</h2>
              </div>
            </ScrollReveal>

            {/* Feature 1: Score Ring + Description */}
            <div className="mt-16 grid items-center gap-12 lg:grid-cols-2">
              <ScrollReveal direction="left">
                <div className="flex justify-center">
                  <ScoreRing score={94} sublabel="Overall property condition score" />
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={200}>
                <div>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight">Condition Scoring</h3>
                  <p className="mt-3 text-[#8A94A6] leading-relaxed">
                    Every room gets a condition score based on documented damage, wear, and overall state. 
                    Track changes over time with clear, comparable metrics.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Tag color="teal">Timestamped</Tag>
                    <Tag color="amber">AI-Ready</Tag>
                    <Tag color="teal">Auditable</Tag>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Feature 2: Before/After Slider */}
            <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
              <ScrollReveal direction="left" delay={200}>
                <div className="order-2 lg:order-1">
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight">Move-In vs Move-Out</h3>
                  <p className="mt-3 text-[#8A94A6] leading-relaxed">
                    Side-by-side comparison of the same spots. Drag the slider to visually prove 
                    what was already there and what changed during your tenancy.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Tag color="teal">Visual Diff</Tag>
                    <Tag color="amber">Dispute-Ready</Tag>
                    <Tag color="teal">Side-by-Side</Tag>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right">
                <div className="order-1 lg:order-2">
                  <BeforeAfterSlider className="max-w-md mx-auto" />
                </div>
              </ScrollReveal>
            </div>

            {/* Feature 3: PDF Preview Card */}
            <div className="mt-20 grid items-center gap-12 lg:grid-cols-2">
              <ScrollReveal direction="left">
                <div className="flex justify-center">
                  <PdfPreviewCard />
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={200}>
                <div>
                  <h3 className="font-display text-2xl font-bold uppercase tracking-tight">Professional Reports</h3>
                  <p className="mt-3 text-[#8A94A6] leading-relaxed">
                    One-click PDF generation with cover page, timestamped photos, detailed notes, 
                    and condition summaries. Professional enough for legal disputes.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Tag color="teal">PDF Export</Tag>
                    <Tag color="amber">Email Sharing</Tag>
                    <Tag color="teal">Link Sharing</Tag>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Stats / Social Proof */}
        <section className="border-t border-[#1E2A3A]/60 bg-[#080C12]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <ScrollReveal>
              <div className="text-center mb-12">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#00E5C5]">The numbers speak</p>
                <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">Deposit Disputes Are Real</h2>
              </div>
            </ScrollReveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <ScrollReveal delay={0}>
                <div className="stat-card rounded-2xl border border-[#1E2A3A] bg-[#0F1620] p-6 text-center">
                  <p className="text-4xl font-display font-extrabold text-[#00E5C5]">
                    $<CountUp end={4000} duration={2500} />
                  </p>
                  <p className="mt-2 text-sm text-[#8A94A6]">Average deposit in the US</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <div className="stat-card rounded-2xl border border-[#1E2A3A] bg-[#0F1620] p-6 text-center">
                  <p className="text-4xl font-display font-extrabold text-[#F5A623]">
                    <CountUp end={36} />%
                  </p>
                  <p className="mt-2 text-sm text-[#8A94A6]">of renters lose some deposit</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="stat-card rounded-2xl border border-[#1E2A3A] bg-[#0F1620] p-6 text-center">
                  <p className="text-4xl font-display font-extrabold text-[#FF4D4D]">
                    <CountUp end={26} />%
                  </p>
                  <p className="mt-2 text-sm text-[#8A94A6]">don&apos;t document condition</p>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <div className="stat-card rounded-2xl border border-[#1E2A3A] bg-[#0F1620] p-6 text-center">
                  <p className="text-4xl font-display font-extrabold text-[#00E5C5]">
                    <CountUp end={5} /> min
                  </p>
                  <p className="mt-2 text-sm text-[#8A94A6]">to set up your first report</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Feature highlights — glassmorphism cards */}
        <section className="border-t border-[#1E2A3A]/60 bg-[#0A0E14]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
            <ScrollReveal>
              <div className="text-center">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#00E5C5]">Why ConditionLog</p>
                <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">Everything You Need</h2>
              </div>
            </ScrollReveal>

            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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

        {/* Testimonials */}
        <section className="border-t border-[#1E2A3A]/60 bg-[#080C12]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
            <ScrollReveal>
              <div className="text-center mb-12">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#00E5C5]">Trusted by renters</p>
                <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">What Our Users Say</h2>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <TestimonialsCarousel />
            </ScrollReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-[#1E2A3A]/60 relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#00E5C5]/10 via-[#080C12] to-[#080C12]" />
          {/* Decorative orbs */}
          <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#00E5C5]/5 blur-3xl" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-[#00E5C5]/3 blur-3xl" aria-hidden="true" />
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20 relative z-10">
            <ScrollReveal>
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">
                Don&apos;t Wait Until Move-Out
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-[#8A94A6] text-lg">
                Start documenting your rental condition today. It takes minutes and could save you thousands in deposit disputes.
              </p>
              <Button size="lg" className="btn-glow mt-8 h-12 px-8 text-base bg-[#00E5C5] text-[#080C12] hover:bg-[#00E5C5]/90 font-semibold shadow-lg shadow-[#00E5C5]/20 group" asChild>
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
      <footer className="border-t border-[#1E2A3A]/60 bg-[#080C12] py-8">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-[#00E5C5] text-[#080C12] text-xs font-bold">
              CL
            </div>
            <span className="font-semibold">ConditionLog</span>
          </div>
          <p className="mt-3 text-sm text-[#8A94A6]">
            &copy; {new Date().getFullYear()} ConditionLog. Protecting renters&apos; deposits.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ---- Sub-components ---- */

function Tag({ children, color }: { children: React.ReactNode; color: 'teal' | 'amber' }) {
  const styles = {
    teal: 'bg-[#00E5C5]/10 text-[#00E5C5] border-[#00E5C5]/20',
    amber: 'bg-[#F5A623]/10 text-[#F5A623] border-[#F5A623]/20',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[10px] tracking-wider uppercase ${styles[color]}`}>
      {children}
    </span>
  );
}

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
    <div className="group relative rounded-2xl border border-[#1E2A3A] bg-[#0F1620] p-8 text-center transition-all hover:shadow-lg hover:shadow-[#00E5C5]/5 hover:-translate-y-1 hover:border-[#00E5C5]/30">
      {/* Step number */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#00E5C5] px-3 py-0.5 text-xs font-bold text-[#080C12] shadow-sm shadow-[#00E5C5]/20">
        Step {step}
      </div>
      {/* Teal accent on hover */}
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-[#00E5C5] to-[#00E5C5]/30 opacity-0 transition-opacity group-hover:opacity-100 rounded-b-2xl" aria-hidden="true" />
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#00E5C5]/10 text-[#00E5C5] transition-colors group-hover:bg-[#00E5C5]/15">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#8A94A6]">{description}</p>
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
    <div className="group rounded-2xl border border-[#1E2A3A] bg-[#0F1620] p-6 transition-all hover:shadow-md hover:shadow-[#00E5C5]/5 hover:border-[#00E5C5]/30 relative overflow-hidden">
      {/* Subtle teal gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00E5C5]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#00E5C5]/10 text-[#00E5C5] transition-all group-hover:bg-[#00E5C5]/15 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="mt-4 font-semibold">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[#8A94A6]">{description}</p>
      </div>
    </div>
  );
}
