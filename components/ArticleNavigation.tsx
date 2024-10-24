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
import { ChevronRight, FileText, Hash } from 'lucide-react';

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
    
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
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
      <ul 
        className={cn(
          'space-y-1.5',
          isSubcategory && 'ml-4 border-l border-border/50 mt-2 pl-2'
        )}
      >
        {items.map((item) => {
          const isActive = item.slug ? pathname === `/${lang}/guides/${item.slug}` : false;
          const isArticleCategory = isCategoryArticle(item);

          if (item.type === 'category') {
            if (isSubcategory) {
              return (
                <Accordion type="single" collapsible key={item.name}>
                  <AccordionItem value={item.name} className="border-none">
                    <AccordionTrigger
                      className={cn(
                        'hover:no-underline transition-all py-2 px-3 rounded-md group',
                        'text-sm font-medium',
                        'data-[state=open]:bg-accent/50',
                        isActive 
                          ? 'text-blue-500 bg-accent shadow-sm' 
                          : 'text-foreground hover:bg-accent hover:text-blue-500'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <ChevronRight 
                          className="h-4 w-4 shrink-0 transition-transform duration-200 
                          group-data-[state=open]:rotate-90" 
                        />
                        {isArticleCategory || item.slug ? (
                          <Link 
                            href={`/${lang}/guides/${item.slug}`}
                            className="flex-1 flex items-center gap-2"
                          >
                            <Hash className="h-4 w-4 shrink-0" />
                            {item.name}
                          </Link>
                        ) : (
                          <div className="flex-1 flex items-center gap-2">
                            <Hash className="h-4 w-4 shrink-0" />
                            {item.name}
                          </div>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-2">
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
                      'py-2 px-3 rounded-md transition-colors',
                      'text-sm font-medium flex items-center gap-2',
                      isActive 
                        ? 'text-blue-500 bg-accent shadow-sm' 
                        : 'text-foreground hover:bg-accent hover:text-blue-500'
                    )}
                  >
                    <Hash className="h-4 w-4 shrink-0" />
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
                    'flex items-center gap-2 py-2 px-3 rounded-md transition-all text-sm',
                    'hover:bg-accent/50',
                    isActive 
                      ? 'text-blue-500 font-medium bg-accent/70' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <FileText className="h-4 w-4 shrink-0" />
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
        <nav className="p-4 space-y-2">
          {renderNavigation(sortedNavigationItems)}
        </nav>
      </ScrollArea>
    </aside>
  );
}