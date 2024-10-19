'use client'

import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Heading {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  headings?: Heading[]
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const pathname = usePathname()

  return (
    <aside className="pr-20 h-[calc(100vh-4rem)] overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-4">
          <h2 className="text-m font-medium text-foreground">Table of Contents</h2>
          {headings && headings.length > 0 ? (
            <nav className="space-y-1">
              <ul>
                {headings
                  .filter((heading) => heading.level === 2 || heading.level === 3)
                  .map((heading) => {
                    const isActive = pathname === `#${heading.id}`

                    return (
                      <li key={heading.id}>
                        <Link
                          href={`#${heading.id}`}
                          className={cn(
                            'block py-1 text-sm transition-colors',
                            isActive
                              ? 'text-primary font-medium'
                              : 'text-muted-foreground hover:text-primary',
                            heading.level === 3 && 'pl-4'
                          )}
                        >
                          {heading.text}
                        </Link>
                      </li>
                    )
                  })}
              </ul>
            </nav>
          ) : (
            <p className="text-sm text-muted-foreground">Select an article to see the table of contents.</p>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}
