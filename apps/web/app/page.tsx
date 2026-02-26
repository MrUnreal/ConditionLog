import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScrollReveal } from '@/components/scroll-reveal';
import { CountUp } from '@/components/count-up';
import { EvidenceScan } from '@/components/marketing/evidence-scan';
import { ScoreRing } from '@/components/marketing/score-ring';
import { PdfPreviewCard } from '@/components/marketing/pdf-preview-card';
import { BeforeAfterSlider } from '@/components/marketing/before-after-slider';
import { Logo } from '@/components/logo';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#080C12]">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06]" style={{ background: 'rgba(8,12,18,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo size={28} />
            <span className="text-lg font-bold tracking-tight sm:text-xl">ConditionLog</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-5">
            <Link href="/login" className="text-sm text-[#8A94A6] hover:text-white transition-colors">
              Sign in
            </Link>
            <Button size="sm" className="bg-[#00E5C5] text-[#080C12] hover:bg-[#00E5C5]/90 font-semibold rounded-full px-5" asChild>
              <Link href="/register">
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          {/* Background mesh */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,rgba(0,229,197,0.06),transparent_70%)]" aria-hidden="true" />

          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28 lg:py-36 relative z-10">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.8fr] lg:gap-20">
              {/* Left — Copy */}
              <div>
                <h1 className="animate-slide-up font-display font-extrabold uppercase tracking-tight leading-[0.92]" style={{ fontSize: 'clamp(52px, 8vw, 96px)' }}>
                  Never Lose Your
                  <br />
                  <span className="text-[#00E5C5]">Deposit Again</span>
                </h1>

                <p className="animate-slide-up delay-200 mt-6 max-w-md text-lg text-[#7A8BA6] leading-relaxed">
                  Document your rental with timestamped, evidence-grade photos.
                  Generate reports that hold up when it matters most.
                </p>

                <div className="animate-slide-up delay-300 mt-10 flex flex-col items-start gap-3">
                  <Button size="lg" className="h-[52px] px-7 text-base bg-[#00E5C5] text-[#080C12] hover:bg-[#00E5C5]/90 font-semibold shadow-lg shadow-[#00E5C5]/20 rounded-lg group" asChild>
                    <Link href="/register">
                      Get Started
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-0.5" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </Link>
                  </Button>
                  <Link href="/login" className="flex items-center gap-1.5 text-sm text-[#7A8BA6] hover:text-white transition-colors pl-1">
                    Already have an account?
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </Link>
                </div>
              </div>

              {/* Right — Phone mockup with Evidence Scan */}
              <div className="animate-scale-in delay-300 flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="relative mx-auto w-[260px] sm:w-[280px] rounded-[2.5rem] border-2 border-[#1E2A3A] bg-[#0A1018] p-2 shadow-2xl shadow-[#00E5C5]/5">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-28 rounded-b-2xl bg-[#0A1018] z-30" />
                    <div className="overflow-hidden rounded-[2rem]">
                      <EvidenceScan />
                    </div>
                  </div>
                  <div className="absolute -inset-10 -z-10 rounded-full bg-[#00E5C5]/5 blur-3xl" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Steps — Vertical Timeline ────────────────────────── */}
        <section id="how-it-works" className="border-t border-[#1E2A3A]/60 bg-[#080C12]">
          <div className="mx-auto max-w-3xl px-4 py-20 sm:py-28">
            <ScrollReveal direction="up">
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl lg:text-[44px] leading-[1.05]">
                From move&#8209;in to dispute&#8209;proof in&nbsp;10&nbsp;minutes.
              </h2>
            </ScrollReveal>

            {/* Timeline */}
            <div className="relative mt-16">
              {/* Vertical line */}
              <div className="absolute left-[23px] top-2 bottom-2 w-px bg-gradient-to-b from-[#00E5C5]/40 via-[#1E2A3A] to-[#1E2A3A]/20" aria-hidden="true" />

              <div className="space-y-12">
                <ScrollReveal delay={0}>
                  <TimelineStep
                    number="01"
                    title="Add your property"
                    description="Enter your address and lease details. We create your property file and generate a unique report ID — takes under 60 seconds."
                  />
                </ScrollReveal>
                <ScrollReveal delay={150}>
                  <TimelineStep
                    number="02"
                    title="Walk through every room"
                    description="Follow the guided inspection. Snap photos, flag existing damage, and add notes for walls, floors, fixtures, and appliances."
                  />
                </ScrollReveal>
                <ScrollReveal delay={300}>
                  <TimelineStep
                    number="03"
                    title="Download &amp; share your report"
                    description="Generate a timestamped PDF. Share via secure link or email — your evidence is locked, dated, and ready for any dispute."
                  />
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── Before / After — Full-width hero section ─────────── */}
        <section className="border-t border-[#1E2A3A]/60 bg-[#0A0E14]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
            <ScrollReveal>
              <div className="max-w-xl">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#00E5C5]">Visual comparison</p>
                <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl">See exactly what changed.</h2>
                <p className="mt-4 text-[#7A8BA6] leading-relaxed">
                  Side-by-side comparison of the same spots at move-in and move-out.
                  Drag the slider to visually prove what was already there — and what wasn&apos;t.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="mt-12 mx-auto max-w-2xl">
                <BeforeAfterSlider className="aspect-[4/3] sm:aspect-[16/10]" />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Condition Scoring ─────────────────────────────────── */}
        <section className="border-t border-[#1E2A3A]/60 bg-[#080C12]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <ScrollReveal direction="left">
                <div className="flex justify-center">
                  <ScoreRing score={94} size={220} sublabel="Overall property condition score" />
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right" delay={200}>
                <div>
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#00E5C5]">Evidence-grade tools</p>
                  <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">Condition Scoring</h3>
                  <p className="mt-4 text-[#7A8BA6] leading-relaxed">
                    Every room gets a condition score based on documented damage, wear, and overall state.
                    Track changes over time with clear, comparable metrics that hold up in any dispute.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Tag>Timestamped</Tag>
                    <Tag>Auditable</Tag>
                    <Tag>Comparable</Tag>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── PDF Report Preview ───────────────────────────────── */}
        <section className="border-t border-[#1E2A3A]/60 bg-[#0A0E14]">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <ScrollReveal direction="left" delay={200}>
                <div className="order-2 lg:order-1">
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#00E5C5]">One-click export</p>
                  <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">Professional Reports</h3>
                  <p className="mt-4 text-[#7A8BA6] leading-relaxed">
                    Generate a complete PDF with cover page, timestamped photos, detailed notes,
                    and condition summaries. Professional enough for legal disputes —
                    share via link or email in one click.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Tag>PDF Export</Tag>
                    <Tag>Email Sharing</Tag>
                    <Tag>Link Sharing</Tag>
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal direction="right">
                <div className="order-1 lg:order-2 flex justify-center">
                  <PdfPreviewCard />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────────────────────── */}
        <section className="border-t border-[#1E2A3A]/60 bg-[#080C12]">
          <div className="mx-auto max-w-5xl px-4 py-20 sm:py-28">
            <ScrollReveal>
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl text-center">
                Deposit disputes are real.
              </h2>
            </ScrollReveal>

            <div className="mt-16 grid gap-y-12 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
              <ScrollReveal delay={0}>
                <StatBlock
                  value={<>$<CountUp end={3700} duration={2200} /></>}
                  label="Average security deposit in the US"
                  color="teal"
                />
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <StatBlock
                  value={<><CountUp end={56} duration={2000} />%</>}
                  label="Renters who never document move-in condition"
                  color="amber"
                />
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <StatBlock
                  value={<>1 in <CountUp end={4} duration={1500} /></>}
                  label="Renters who lose part of their deposit"
                  color="red"
                />
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <StatBlock
                  value={<><CountUp end={8} duration={1500} /> min</>}
                  label="Average time to complete a ConditionLog inspection"
                  color="teal"
                />
              </ScrollReveal>
            </div>

            <ScrollReveal delay={400}>
              <p className="mt-10 text-center text-xs text-[#4A5568]">
                Sources: Apartment List, TransUnion SmartMove, 2023–2024
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Early Access CTA (replaces testimonial) ──────────── */}
        <section className="border-t border-[#1E2A3A]/60 bg-[#0A0E14]">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <ScrollReveal>
              <div className="rounded-2xl border border-[#1E2A3A] bg-[#0F1620] p-8 sm:p-12 flex flex-col items-center text-center relative overflow-hidden">
                <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#00E5C5]/5 blur-3xl" aria-hidden="true" />
                <p className="text-sm text-[#7A8BA6] relative z-10">Built by renters, for renters.</p>
                <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl relative z-10">
                  See what a real report looks&nbsp;like.
                </h3>
                <p className="mt-3 text-[#7A8BA6] max-w-md relative z-10">
                  Browse a sample ConditionLog report — no sign-up required.
                  Currently in early access.
                </p>
                <Button size="lg" className="mt-8 h-[52px] px-7 text-base bg-[#00E5C5] text-[#080C12] hover:bg-[#00E5C5]/90 font-semibold shadow-lg shadow-[#00E5C5]/20 rounded-lg relative z-10 group" asChild>
                  <Link href="/register">
                    Create My First Report
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-0.5" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────── */}
        <section className="border-t border-[#1E2A3A]/60 bg-[#080C12] relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(0,229,197,0.08),transparent_70%)]" aria-hidden="true" />
          <div className="mx-auto max-w-3xl px-4 py-20 sm:py-28 text-center relative z-10">
            <ScrollReveal>
              <h2 className="font-display text-3xl font-bold uppercase tracking-tight sm:text-4xl lg:text-[44px] leading-[1.05]">
                Your move&#8209;in is the most important day to&nbsp;document.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-lg text-[#7A8BA6]">
                Takes 8 minutes. Free forever. No landlord needed.
              </p>
              <Button size="lg" className="mt-10 h-[52px] px-7 text-base bg-[#00E5C5] text-[#080C12] hover:bg-[#00E5C5]/90 font-semibold shadow-lg shadow-[#00E5C5]/20 rounded-lg group" asChild>
                <Link href="/register">
                  Create My First Report
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2 transition-transform group-hover:translate-x-0.5" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-[#1E2A3A]/60 bg-[#080C12]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <div className="grid gap-10 sm:grid-cols-[1.4fr_1fr_1fr] sm:gap-8">
            {/* Brand column */}
            <div>
              <Link href="/" className="flex items-center gap-2">
                <Logo size={24} />
                <span className="font-semibold">ConditionLog</span>
              </Link>
              <p className="mt-3 text-sm text-[#4A5568] max-w-xs leading-relaxed">
                Evidence-grade rental documentation.
                Protect your deposit with timestamped photos and professional reports.
              </p>
              {/* GitHub link */}
              <a
                href="https://github.com/MrUnreal/ConditionLog"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm text-[#7A8BA6] hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                Open source
              </a>
            </div>

            {/* Product column */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#7A8BA6]">Product</p>
              <ul className="mt-3 space-y-2.5">
                <li><Link href="/dashboard" className="text-sm text-[#4A5568] hover:text-white transition-colors">Dashboard</Link></li>
                <li><Link href="/#how-it-works" className="text-sm text-[#4A5568] hover:text-white transition-colors">How it works</Link></li>
                <li><Link href="/register" className="text-sm text-[#4A5568] hover:text-white transition-colors">Get started</Link></li>
              </ul>
            </div>

            {/* Legal column */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#7A8BA6]">Legal</p>
              <ul className="mt-3 space-y-2.5">
                <li><Link href="/privacy" className="text-sm text-[#4A5568] hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-sm text-[#4A5568] hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-10 border-t border-[#1E2A3A]/40 pt-6">
            <p className="text-xs text-[#4A5568]">
              &copy; {new Date().getFullYear()} ConditionLog. Protecting renters&apos; deposits.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function TimelineStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-6 items-start">
      {/* Number circle */}
      <div className="relative z-10 flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border border-[#1E2A3A] bg-[#0F1620]">
        <span className="font-mono text-sm font-medium text-[#00E5C5]">{number}</span>
      </div>
      {/* Content */}
      <div className="pt-2.5">
        <h3 className="font-display text-xl font-bold uppercase tracking-tight">{title}</h3>
        <p className="mt-2 text-[#7A8BA6] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#00E5C5]/20 bg-[#00E5C5]/10 px-3 py-1 font-mono text-[10px] tracking-wider uppercase text-[#00E5C5]">
      {children}
    </span>
  );
}

const statColors = {
  teal: 'text-[#00E5C5]',
  amber: 'text-[#F5A623]',
  red: 'text-[#FF4D4D]',
} as const;

function StatBlock({ value, label, color }: { value: React.ReactNode; label: string; color: keyof typeof statColors }) {
  return (
    <div>
      <p className={`font-display text-5xl font-extrabold tracking-tight ${statColors[color]}`}>
        {value}
      </p>
      <p className="mt-2 text-sm text-[#7A8BA6] leading-relaxed">{label}</p>
    </div>
  );
}
