'use client'

import React from 'react';
import Link from 'next/link';
import { Settings, PanelLeft } from 'lucide-react';
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
import ArticleNavigation from '@/components/ArticleNavigation';
import { NavigationItem } from '@/types';

interface HeaderProps {
  lang: string;
  navigationItems?: NavigationItem[];
}

export default function Header({ lang, navigationItems = [] }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Panel button для мобильной навигации */}
          {navigationItems.length > 0 && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Open navigation</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <SheetHeader className="p-4">
                  <VisuallyHidden.Root>
                    <SheetTitle>Guides</SheetTitle>
                    <SheetDescription>Read the Guides</SheetDescription>
                  </VisuallyHidden.Root>
                </SheetHeader>
                <ArticleNavigation navigationItems={navigationItems} lang={lang} />
              </SheetContent>
            </Sheet>
          )}
          
          {/* Logo */}
          <Link
            href={`/${lang}`}
            className="text-lg font-bold tracking-tight text-foreground whitespace-nowrap"
          >
            george_tbs guides
          </Link>
        </div>

        {/* Desktop controls */}
        <div className="hidden lg:flex items-center gap-2">
          <LanguageSwitcher lang={lang} defaultLang="" />
          <ThemeToggle />
        </div>
          
        {/* Settings button for mobile */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Open settings</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 sm:w-96">
              <SheetHeader>
                <VisuallyHidden.Root>
                  <SheetTitle>Settings</SheetTitle>
                  <SheetDescription>Manage your preferences</SheetDescription>
                </VisuallyHidden.Root>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-4">
                <div className="space-y-1">
              
                  <LanguageSwitcher lang={lang} defaultLang="" />
                </div>
                <div className="space-y-1">
            
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}