import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';
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
    <div className="min-h-screen bg-[#080C12]">
      <header className="glass sticky top-0 z-50 border-b border-[#1E2A3A]/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo size={28} />
              <span className="text-lg font-bold tracking-tight sm:text-xl">ConditionLog</span>
            </Link>
            <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
              <Link href="/dashboard" className="rounded-md px-3 py-1.5 text-sm font-medium text-[#8A94A6] hover:text-foreground hover:bg-[#1A2233] transition-colors">
                Dashboard
              </Link>
              <Link href="/properties" className="rounded-md px-3 py-1.5 text-sm font-medium text-[#8A94A6] hover:text-foreground hover:bg-[#1A2233] transition-colors">
                Properties
              </Link>
            </nav>
          </div>

          {/* Desktop nav */}
          <div className="hidden items-center gap-4 sm:flex">
            <span className="text-sm text-[#8A94A6]">{user.email}</span>
            <ThemeToggle />
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit" className="text-[#8A94A6] hover:text-foreground">
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
