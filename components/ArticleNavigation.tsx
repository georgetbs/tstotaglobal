'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationItem } from '@/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';

interface ArticleNavigationProps {
  navigationItems: NavigationItem[];
  lang: string;
}

const categoryOrder = [
  'Introduction',
  'i18n',
  'Icons',
  'Supabase',
  'Authentication',
  'Routing',
  'API Routes',
  'Static Generation',
  'Server-Side Rendering',
  'Dynamic Import',
  'Middleware',
  'Performance Optimization',
  'Deployment',
  'Testing',
  'TypeScript',
  'Tailwind CSS and Styling',
  'Debugging',
];

const sortCategories = (categories: NavigationItem[]): NavigationItem[] => {
  return categories.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.name);
    const indexB = categoryOrder.indexOf(b.name);
    if (indexA === -1 && indexB === -1) return a.name.localeCompare(b.name);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
};

export default function ArticleNavigation({ navigationItems, lang }: ArticleNavigationProps) {
  const pathname = usePathname();
  const sortedNavigationItems = sortCategories(navigationItems);

  const renderNavigation = (items: NavigationItem[], isSubcategory = false) => {
    if (!items || items.length === 0) return null;

    return (
      <ul className={cn('space-y-1', isSubcategory && 'ml-4')}>
        {items.map((item) => {
          const isActive = item.slug ? pathname === `/${lang}/guides/${item.slug}` : false;

          if (item.type === 'category' && item.children && item.children.length > 0) {
            if (isSubcategory) {
              return (
                <Accordion type="single" collapsible key={item.name}>
                  <AccordionItem value={item.name}>
                    <AccordionTrigger
                      className={cn(
                        'hover:no-underline transition-colors',
                        isActive ? 'text-primary font-medium' : 'text-foreground hover:text-primary'
                      )}
                    >
                      {item.slug ? <Link href={`/${lang}/guides/${item.slug}`}>{item.name}</Link> : item.name}
                    </AccordionTrigger>
                    <AccordionContent>{renderNavigation(item.children, true)}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              );
            } else {
              return (
                <li key={item.name}>
                  <div
                    className={cn(
                      'font-medium transition-colors',
                      isActive ? 'text-primary' : 'text-foreground hover:text-primary'
                    )}
                  >
                    {item.slug ? (
                      <Link href={`/${lang}/guides/${item.slug}`}>{item.name}</Link>
                    ) : (
                      <VisuallyHidden.Root>{item.name}</VisuallyHidden.Root>
                    )}
                  </div>
                  {renderNavigation(item.children, true)}
                </li>
              );
            }
          } else if (item.type === 'category') {
            return (
              <li key={item.name}>
                <div
                  className={cn(
                    'font-medium transition-colors',
                    isActive ? 'text-primary' : 'text-foreground hover:text-primary'
                  )}
                >
                  {item.slug ? (
                    <Link href={`/${lang}/guides/${item.slug}`}>{item.name}</Link>
                  ) : (
                    <VisuallyHidden.Root>{item.name}</VisuallyHidden.Root>
                  )}
                </div>
              </li>
            );
          } else {
            return (
              <li key={item.name}>
                <Link
                  href={`/${lang}/guides/${item.slug}`}
                  className={cn(
                    'block py-1 text-sm transition-colors',
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.name}
                </Link>
              </li>
            );
          }
        })}
      </ul>
    );
  };

  return (
    <aside className="w-64 h-[calc(100vh-4rem)]">
      <ScrollArea className="h-full">
        <div className="p-4">
          <nav>{renderNavigation(sortedNavigationItems)}</nav>
        </div>
      </ScrollArea>
    </aside>
  );
}
