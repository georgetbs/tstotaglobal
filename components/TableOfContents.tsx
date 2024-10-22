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

    const headingElements = headings
      .filter((heading) => heading.level === 2 || heading.level === 3)
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null)

    headingElements.forEach((element) => {
      element.style.scrollMarginTop = '5rem'
    })

    // Функция определения активного заголовка
    const determineActiveHeading = () => {
      const HEADER_OFFSET = 100 // Отступ для учета sticky header

      // Получаем все позиции заголовков
      const headingPositions = headingElements.map(element => {
        const { top } = element.getBoundingClientRect()
        return {
          id: element.id,
          top: top
        }
      })

      // Находим последний заголовок, который находится выше или на уровне нашего отступа
      const currentHeading = headingPositions
        .filter(heading => heading.top <= HEADER_OFFSET)
        .slice(-1)[0]
      
      if (currentHeading) {
        setActiveId(currentHeading.id)
      } else if (headingPositions.length > 0) {
        // Если мы в самом начале и все заголовки ниже - берем первый
        setActiveId(headingPositions[0].id)
      }
    }

    // Вызываем функцию при скролле с небольшим throttle
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          determineActiveHeading()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)
    // Определяем начальный активный заголовок
    determineActiveHeading()

    return () => {
      window.removeEventListener('scroll', onScroll)
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
                              const headerOffset = 80
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