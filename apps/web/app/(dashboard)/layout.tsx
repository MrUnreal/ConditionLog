import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { MobileNav } from './mobile-nav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="glass sticky top-0 z-50 border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                CL
              </div>
              <span className="text-lg font-bold sm:text-xl">ConditionLog</span>
            </Link>
            <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
              <Link href="/dashboard" className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                Dashboard
              </Link>
              <Link href="/properties" className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                Properties
              </Link>
            </nav>
          </div>

          {/* Desktop nav */}
          <div className="hidden items-center gap-4 sm:flex">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <ThemeToggle />
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit">
                Sign out
              </Button>
            </form>
          </div>

          {/* Mobile nav */}
          <MobileNav email={user.email ?? ''} />
        </div>
      </header>
      <main id="main-content" className="mx-auto max-w-6xl px-4 py-4 sm:py-8">{children}</main>
    </div>
  );
}
