import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              CL
            </div>
            <span className="text-lg font-bold sm:text-xl">ConditionLog</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main id="main-content" className="flex-1">
        <section className="hero-gradient relative overflow-hidden">
          {/* Decorative grid pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}} aria-hidden="true" />

          <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28 lg:py-36">
            {/* Pill badge */}
            <div className="animate-slide-down inline-flex items-center gap-2 rounded-full border bg-card/80 px-4 py-1.5 text-sm shadow-sm backdrop-blur">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
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
              <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25" asChild>
                <Link href="/register">
                  Start Documenting Free
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
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
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Simple process</p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Three Steps to Protection</h2>
              <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
                Documenting your rental takes minutes but could save you thousands in deposit disputes.
              </p>
            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              <StepCard
                step={1}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                title="Add Your Property"
                description="Enter your rental address, landlord info, and lease details. Set up in under a minute."
                delay="delay-100"
              />
              <StepCard
                step={2}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>}
                title="Document Each Room"
                description="Walk through every room. Snap photos, add notes about walls, floors, fixtures, and appliances."
                delay="delay-200"
              />
              <StepCard
                step={3}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m8 17 4 4 4-4" /></svg>}
                title="Share & Download"
                description="Generate a professional PDF, share via link or email. Your evidence — timestamped and irrefutable."
                delay="delay-300"
              />
            </div>
          </div>
        </section>

        {/* Stats / Social Proof */}
        <section className="border-t bg-muted/40">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <div className="grid gap-8 sm:grid-cols-3">
              <StatCard value="100%" label="Free to use" sublabel="No hidden fees, ever" />
              <StatCard value="Timestamped" label="Every photo is dated" sublabel="Tamper-proof documentation" />
              <StatCard value="Shareable" label="PDF + link sharing" sublabel="Send to landlords instantly" />
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Why ConditionLog</p>
              <h2 className="mt-2 text-3xl font-bold sm:text-4xl">Everything You Need</h2>
            </div>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <HighlightCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>}
                title="Room-by-Room Walkthrough"
                description="Guided inspection flow for kitchen, bathroom, bedroom, and more."
              />
              <HighlightCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>}
                title="Photo Documentation"
                description="Upload unlimited photos with automatic timestamps and cloud storage."
              />
              <HighlightCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 4v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.342a2 2 0 0 0-.602-1.43l-4.44-4.342A2 2 0 0 0 13.56 2H6a2 2 0 0 0-2 2z"/><path d="M9 13h6"/><path d="M9 17h3"/></svg>}
                title="Professional PDF Reports"
                description="One-click PDF generation with cover page, photos, and notes."
              />
              <HighlightCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" x2="12" y1="2" y2="15"/></svg>}
                title="Instant Sharing"
                description="Share reports via secure link or send directly by email."
              />
              <HighlightCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>}
                title="Works on Any Device"
                description="Responsive design works on phone, tablet, or desktop. Install as a PWA."
              />
              <HighlightCard
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>}
                title="Secure & Private"
                description="Your data is encrypted and only accessible to you. No third-party access."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-gradient-to-br from-primary via-primary to-violet-600 text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Don&apos;t Wait Until Move-Out
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-primary-foreground/80 text-lg">
              Start documenting your rental condition today. It takes minutes and could save you thousands in deposit disputes.
            </p>
            <Button size="lg" variant="secondary" className="mt-8 h-12 px-8 text-base shadow-lg" asChild>
              <Link href="/register">
                Get Started Now
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </Button>
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
  delay,
}: {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  return (
    <div className={`group relative rounded-xl border bg-card p-8 text-center transition-all hover:shadow-lg hover:-translate-y-1 ${delay}`}>
      {/* Step number */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground shadow-sm">
        Step {step}
      </div>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

function StatCard({
  value,
  label,
  sublabel,
}: {
  value: string;
  label: string;
  sublabel: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 text-center transition-shadow hover:shadow-md">
      <p className="text-3xl font-extrabold text-primary">{value}</p>
      <p className="mt-1 font-medium">{label}</p>
      <p className="mt-0.5 text-sm text-muted-foreground">{sublabel}</p>
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
    <div className="group rounded-xl border bg-card p-6 transition-all hover:shadow-md hover:border-primary/30">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
