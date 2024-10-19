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

interface LanguageSwitcherProps {
  lang: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ lang }) => {
  const pathname = usePathname();

  const getPathWithNewLang = (newLang: string) => {
    const segments = pathname?.split('/') || [];
    if (segments.length > 1) {
      segments[1] = newLang;
      return segments.join('/') || '/';
    }
    return `/${newLang}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[120px] justify-start">
          <Globe className="mr-2 h-4 w-4" />
          <span>{lang.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={getPathWithNewLang('ka')} className="w-full">
            <span className="mr-2">🇬🇪</span> ქართული
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={getPathWithNewLang('en')} className="w-full">
            <span className="mr-2">🇬🇧</span> English
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={getPathWithNewLang('ru')} className="w-full">
            <span className="mr-2">🇷🇺</span> Русский
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};