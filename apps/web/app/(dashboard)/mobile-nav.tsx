'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/actions/auth';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/properties', label: 'Properties' },
];

export function MobileNav({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="sm:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="px-2" aria-label="Open navigation menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <span className="sr-only">Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64">
          <SheetHeader>
            <SheetTitle>Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-4 space-y-1">
            <nav aria-label="Mobile navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                    pathname.startsWith(link.href) ? 'bg-accent text-accent-foreground' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Separator className="my-3" />
            <p className="px-3 text-sm text-muted-foreground">{email}</p>
            <Separator className="my-3" />
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit" className="w-full justify-start">
                Sign out
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
