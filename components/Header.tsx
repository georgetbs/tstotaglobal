'use client';

import React from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface HeaderProps {
  lang: string;
}

const Header: React.FC<HeaderProps> = ({ lang }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        {/* Logo and site name for desktop */}
        <Link
          href={`/${lang}`}
          className="hidden md:block text-xl md:text-2xl font-bold tracking-tight text-foreground"
        >
          george_tbs guides
        </Link>

        {/* Right side of the header */}
        <div className="flex items-center space-x-2 justify-end flex-1">
          {/* Switches visible only on desktop */}
          <div className="hidden md:flex items-center space-x-2">
            <LanguageSwitcher lang={lang} />
            <ThemeToggle />
          </div>

          {/* Settings button for mobile devices */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Open settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <VisuallyHidden.Root>
                  <SheetTitle>Settings</SheetTitle>
                  <SheetDescription>Manage your preferences</SheetDescription>
                </VisuallyHidden.Root>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 mt-4">
                {/* Site name inside Sheet for mobile */}
                <Link
                  href={`/${lang}`}
                  className="md:hidden text-xl font-bold tracking-tight text-foreground"
                >
                  george_tbs guides
                </Link>
                {/* Switches inside Sheet */}
                <LanguageSwitcher lang={lang} />
                <ThemeToggle />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
