import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
          <span className="text-lg font-bold sm:text-xl">ConditionLog</span>
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
        <section className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-24 lg:py-32">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Protect Your Security Deposit
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Document your rental property condition with timestamped photos and detailed notes.
            Generate professional reports for move-in and move-out.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/register">Start Documenting Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">How It Works</h2>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>
                }
                title="1. Add Your Property"
                description="Enter your rental address and start a new move-in or move-out inspection report."
              />
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                }
                title="2. Document Each Room"
                description="Walk through each room, take photos, and add notes about the condition of walls, floors, fixtures."
              />
              <FeatureCard
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" /><path d="M12 12v9" /><path d="m8 17 4 4 4-4" /></svg>
                }
                title="3. Share & Download"
                description="Generate a professional PDF report, share via link or email. Your evidence, timestamped and ready."
              />
            </div>
          </div>
        </section>

        {/* Trust section */}
        <section className="border-t">
          <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
            <h2 className="text-2xl font-bold sm:text-3xl">Built for Renters</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-3xl font-bold text-primary">100%</p>
                <p className="mt-1 text-sm text-muted-foreground">Free to use</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">Timestamped</p>
                <p className="mt-1 text-sm text-muted-foreground">Every photo is dated</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">Shareable</p>
                <p className="mt-1 text-sm text-muted-foreground">PDF + link for landlords</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t bg-primary text-primary-foreground">
          <div className="mx-auto max-w-6xl px-4 py-12 text-center sm:py-16">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Don&apos;t Wait Until Move-Out
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-primary-foreground/80">
              Start documenting your rental condition today. It takes minutes and could save you thousands.
            </p>
            <Button size="lg" variant="secondary" className="mt-6" asChild>
              <Link href="/register">Get Started Now</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ConditionLog. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
