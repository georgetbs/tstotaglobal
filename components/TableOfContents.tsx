'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings?: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  return (
    <aside className="pr-20 h-[calc(100vh-4rem)] overflow-hidden">
      <ScrollArea className="h-full ">
        <div className="p-6">
          <h2 className="text-lg font-semibold">Table of Contents</h2>
          {headings && headings.length > 0 ? (
            <nav className="space-y-1">
              {headings
                .filter((heading) => heading.level === 2 || heading.level === 3)
                .map((heading) => (
                  <a
                    key={heading.id}
                    href={`#${heading.id}`}
                    className={cn(
                      "block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors",
                      heading.level === 3 && "pl-4"
                    )}
                  >
                    {heading.text}
                  </a>
                ))}
            </nav>
          ) : (
            <p className="text-sm text-muted-foreground">Select an article to see the table of contents.</p>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}