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
  defaultLang: string;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ lang, defaultLang }) => {
  const pathname = usePathname();

  const getPathWithNewLang = (newLang: string) => {
    const segments = pathname?.split('/').filter(Boolean) || [];
    
    if (newLang === defaultLang) {
      if (segments[0] === defaultLang) {
        segments.shift();
      }
    } else {
      if (segments[0] === defaultLang || segments[0]?.length === 2) {
        segments[0] = newLang;
      } else {
        segments.unshift(newLang);
      }
    }

    return '/' + segments.join('/');
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
          <Link href={getPathWithNewLang('en')} className="w-full">
          <Globe className="mr-2 h-4 w-4" /> English
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
          <div className="flex items-center">
          <Globe className="mr-2 h-4 w-4" /> Русский
            <span className="ml-2 text-xs text-muted-foreground">(Coming soon)</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
          <div className="flex items-center">
          <Globe className="mr-2 h-4 w-4" /> ქართული
            <span className="ml-2 text-xs text-muted-foreground">(Coming soon)</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;