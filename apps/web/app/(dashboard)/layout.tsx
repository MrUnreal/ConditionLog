import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { signOut } from '@/actions/auth';
import { Button } from '@/components/ui/button';
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
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16">
          <Link href="/dashboard" className="text-lg font-bold sm:text-xl">
            ConditionLog
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-4 sm:flex">
            <span className="text-sm text-muted-foreground">{user.email}</span>
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
      <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">{children}</main>
    </div>
  );
}
