'use client'
import React, { useEffect, useState } from 'react'
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
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (!headings?.length) return

    // Add scroll-margin-top to all heading elements
    const headingElements = headings
      .filter((heading) => heading.level === 2 || heading.level === 3)
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null)

    // Add scroll margin to account for sticky header
    headingElements.forEach((element) => {
      element.style.scrollMarginTop = '5rem' // Adjust this value based on your header height + desired padding
    })

    // Create an IntersectionObserver for each heading
    const callback: IntersectionObserverCallback = (entries) => {
      const visibleHeadings = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => entry.target)
        .sort((a, b) => {
          const aTop = a.getBoundingClientRect().top
          const bTop = b.getBoundingClientRect().top
          return aTop - bTop
        })

      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[0].id)
      }
    }

    const observer = new IntersectionObserver(callback, {
      // Adjust rootMargin to account for sticky header
      rootMargin: '-80px 0px -40% 0px',
      threshold: [0, 1]
    })

    headingElements.forEach((element) => observer.observe(element))

    return () => {
      observer.disconnect()
      // Clean up scroll margin styles
      headingElements.forEach((element) => {
        element.style.scrollMarginTop = ''
      })
    }
  }, [headings])

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
                    const isActive = activeId === heading.id

                    return (
                      <li key={heading.id}>
                        <Link
                          href={`#${heading.id}`}
                          className={cn(
                            'block py-1 text-sm transition-colors duration-200',
                            isActive
                              ? 'text-blue-600 font-bold'
                              : 'text-muted-foreground hover:text-primary',
                            heading.level === 3 && 'pl-4'
                          )}
                          onClick={(e) => {
                            e.preventDefault()
                            const element = document.getElementById(heading.id)
                            if (element) {
                              const headerOffset = 80 // Adjust this value based on your header height
                              const elementPosition = element.getBoundingClientRect().top
                              const offsetPosition = elementPosition + window.pageYOffset - headerOffset

                              window.scrollTo({
                                top: offsetPosition,
                                behavior: 'smooth'
                              })
                            }
                          }}
                        >
                          {heading.text}
                        </Link>
                      </li>
                    )
                  })}
              </ul>
            </nav>
          ) : (
            <p className="text-sm text-muted-foreground">
              Select an article to see the table of contents.
            </p>
          )}
        </div>
      </ScrollArea>
    </aside>
  )
}

/* Не забудь пофиксить что если два элемента видны, то надо первый делать активным*/