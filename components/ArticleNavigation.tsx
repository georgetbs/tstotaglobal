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

interface ArticleNavigationProps {
  navigationItems: NavigationItem[];
  lang: string;
}

const categoryOrder = [
  'Introduction',
  'Next.js | App Router',
  'Tailwind CSS and Global Styling',
  'i18n',
  'AI Models',
  'shadcn',
  'Markdown',
  'Deploy on Vercel',
  'Examples of code'
];

const sortCategories = (categories: NavigationItem[]): NavigationItem[] => {
  return [...categories].sort((a, b) => {
    const indexA = categoryOrder.indexOf(a.name);
    const indexB = categoryOrder.indexOf(b.name);
    
    // Если обе категории есть в массиве categoryOrder
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // Если только одна из категорий есть в массиве categoryOrder
    if (indexA !== -1) return -1; // a идет первой
    if (indexB !== -1) return 1;  // b идет первой
    
    // Если обеих категорий нет в массиве categoryOrder, 
    // оставляем их в исходном порядке
    return 0;
  });
};

const isCategoryArticle = (item: NavigationItem): boolean => {
  if (!item.children) return false;
  return item.children.some(child => 
    child.type === 'article' && 
    child.slug === item.slug
  );
};

export default function ArticleNavigation({ navigationItems, lang }: ArticleNavigationProps) {
  const pathname = usePathname();
  const sortedNavigationItems = sortCategories(navigationItems);

  const renderNavigation = (items: NavigationItem[], isSubcategory = false) => {
    if (!items) return null;

    return (
      <ul className={cn('space-y-1', isSubcategory && 'ml-4')}>
        {items.map((item) => {
          const isActive = item.slug ? pathname === `/${lang}/guides/${item.slug}` : false;
          const isArticleCategory = isCategoryArticle(item);

          if (item.type === 'category') {
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
                      {isArticleCategory || item.slug ? (
                        <Link href={`/${lang}/guides/${item.slug}`}>{item.name}</Link>
                      ) : (
                        item.name
                      )}
                    </AccordionTrigger>
                    <AccordionContent>
                      {item.children && renderNavigation(
                        item.children.filter(child => 
                          !(child.type === 'article' && child.slug === item.slug)
                        ), 
                        true
                      )}
                    </AccordionContent>
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
                    {isArticleCategory || item.slug ? (
                      <Link href={`/${lang}/guides/${item.slug}`}>{item.name}</Link>
                    ) : (
                      item.name
                    )}
                  </div>
                  {item.children && renderNavigation(
                    item.children.filter(child => 
                      !(child.type === 'article' && child.slug === item.slug)
                    ), 
                    true
                  )}
                </li>
              );
            }
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