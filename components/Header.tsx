// components/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  lang: string;
}

const Header: React.FC<HeaderProps> = ({ lang }) => {
  const pathname = usePathname();

  // Function to replace the language code in the pathname
  const getPathWithNewLang = (newLang: string) => {
    const segments = pathname?.split('/') || [];
    if (segments.length > 1) {
      segments[1] = newLang;
      return segments.join('/') || '/';
    }
    return `/${newLang}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="container flex items-center justify-between h-16 px-6 mx-auto">
        <Link href={`/${lang}`} className="text-2xl font-bold tracking-tight">
          george_tbs guides
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={getPathWithNewLang('ka')}>
                <span className="mr-2">🇬🇪</span> ქართული
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={getPathWithNewLang('en')}>
                <span className="mr-2">🇬🇧</span> English
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={getPathWithNewLang('ru')}>
                <span className="mr-2">🇷🇺</span> Русский
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
