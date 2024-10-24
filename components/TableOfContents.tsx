'use client'

import React, { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ChevronRight, Hash } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings?: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    if (!headings?.length) return;

    const headingElements = headings
      .filter((heading) => heading.level === 2 || heading.level === 3)
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    const determineActiveHeading = () => {
      const HEADER_OFFSET = 100;

      const headingPositions = headingElements.map(element => ({
        id: element.id,
        top: element.getBoundingClientRect().top
      }));

      const currentHeading = headingPositions
        .filter(heading => heading.top <= HEADER_OFFSET)
        .slice(-1)[0];
      
      if (currentHeading) {
        setActiveId(currentHeading.id);
      } else if (headingPositions.length > 0) {
        setActiveId(headingPositions[0].id);
      }

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          determineActiveHeading();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll);
    determineActiveHeading();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [headings]);

  return (
    <aside className="pr-8 h-[calc(100vh-4rem)] relative">
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Hash className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-foreground">
              Table of Contents
            </h2>
          </div>
          
          <div className="mb-6">
            <Progress value={readingProgress} className="h-1 bg-gray-200">
              <div 
                className="h-full bg-blue-500 transition-all duration-300 ease-out rounded-full"
                style={{ width: `${readingProgress}%` }}
              />
            </Progress>
          </div>

          {headings && headings.length > 0 ? (
            <nav className="space-y-1">
              <ul className="space-y-3">
                {headings
                  .filter((heading) => heading.level === 2 || heading.level === 3)
                  .map((heading) => {
                    const isActive = activeId === heading.id;

                    return (
                      <motion.li
                        key={heading.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          href={`#${heading.id}`}
                          className={cn(
                            'group flex items-start py-1 transition-all duration-200',
                            isActive
                              ? 'text-blue-500 font-medium'
                              : 'text-muted-foreground hover:text-foreground',
                            heading.level === 3 && 'pl-4'
                          )}
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(heading.id);
                            if (element) {
                              const headerOffset = 80;
                              const elementPosition = element.getBoundingClientRect().top;
                              const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                              window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                              });
                            }
                          }}
                        >
                          <ChevronRight 
                            className={cn(
                              "h-4 w-4 mt-1 mr-2 transition-transform",
                              isActive ? "text-blue-500 rotate-90" : "text-muted-foreground",
                              "group-hover:text-blue-500"
                            )} 
                          />
                          <span className={cn(
                            'text-sm leading-tight',
                            heading.level === 3 && 'text-[13px]'
                          )}>
                            {heading.text}
                          </span>
                        </Link>
                      </motion.li>
                    );
                  })}
              </ul>
            </nav>
          ) : (
            <div className="py-4 px-2 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Select an article to see the table of contents
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}