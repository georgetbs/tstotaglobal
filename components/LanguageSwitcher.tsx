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
  defaultLang: string; // Язык по умолчанию, который не отображается в URL
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ lang, defaultLang }) => {
  const pathname = usePathname();

  const getPathWithNewLang = (newLang: string) => {
    // Разбиваем путь на сегменты
    const segments = pathname?.split('/').filter(Boolean) || [];
    
    // Если новый язык — язык по умолчанию, удаляем языковой сегмент
    if (newLang === defaultLang) {
      if (segments[0] === defaultLang) {
        segments.shift(); // Убираем первый сегмент, если это язык по умолчанию
      }
    } else {
      // Если это не язык по умолчанию, заменяем/добавляем языковой сегмент
      if (segments[0] === defaultLang || segments[0]?.length === 2) {
        segments[0] = newLang; // Заменяем существующий языковой сегмент
      } else {
        segments.unshift(newLang); // Добавляем языковой сегмент
      }
    }

    // Восстанавливаем путь
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
