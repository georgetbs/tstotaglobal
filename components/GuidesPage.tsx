'use client'

import React, { useEffect, useState } from 'react'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import dynamic from 'next/dynamic'
import ArticleNavigation from '@/components/ArticleNavigation'
import TableOfContents from '@/components/TableOfContents'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Toaster } from '@/components/ui/toaster'
import { Article, NavigationItem } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

const ClientSideMDX = dynamic(() => import('@/components/ClientSideMDX'), { ssr: false })

interface Translations {
  guides: string
  chooseArticle: string
  allRightsReserved: string
  followOnX: string
  about: string
  privacy: string
}

interface Heading {
  id: string
  text: string
  level: number
}

interface GuidesPageProps {
  navigationItems: NavigationItem[]
  lang: string
  translations: Translations
  defaultArticle?: Article
}

export default function GuidesPage({
  navigationItems,
  lang,
  translations,
  defaultArticle,
}: GuidesPageProps) {
  const t = (key: keyof Translations) => translations[key]

  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)
  const [headings, setHeadings] = useState<Heading[]>([])
  const [readingTime, setReadingTime] = useState('')

  useEffect(() => {
    const processArticle = async () => {
      if (defaultArticle) {
        const mdx = await serialize(defaultArticle.content)
        setMdxSource(mdx)

        const getHeadings = async (markdownContent: string): Promise<Heading[]> => {
          const { remark } = await import('remark')
          const remarkParse = (await import('remark-parse')).default
          const { visit } = await import('unist-util-visit')

          const headings: Heading[] = []

          const tree = remark().use(remarkParse).parse(markdownContent)

          visit(tree, 'heading', (node: any) => {
            const text = node.children
              .filter((child: any) => child.type === 'text' || child.type === 'inlineCode')
              .map((child: any) => child.value)
              .join('')
            const id = text.toLowerCase().replace(/\s+/g, '-')
            headings.push({ id, text, level: node.depth })
          })

          return headings
        }

        const extractedHeadings = await getHeadings(defaultArticle.content)
        setHeadings(extractedHeadings)

        const wordsPerMinute = 200
        const words = defaultArticle.content.split(/\s+/).length
        const minutes = Math.ceil(words / wordsPerMinute)
        setReadingTime(`${minutes} min read`)
      }
    }

    processArticle()
  }, [defaultArticle])

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster />
      <Header lang={lang} />

      <div className="flex-1 overflow-hidden">
        <div className="mx-auto max-w-7xl flex">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 lg:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <ArticleNavigation navigationItems={navigationItems} lang={lang} />
            </SheetContent>
          </Sheet>

          <div className="hidden lg:block w-80 flex-shrink-0">
            <ArticleNavigation navigationItems={navigationItems} lang={lang} />
          </div>

          <main className="flex-grow overflow-hidden flex justify-center">
            <ScrollArea className="h-[calc(100vh-4rem)] w-full">
              <div className="py-8 px-4 lg:px-8 max-w-3xl mx-auto">
                <Card className="shadow-none border-none">
                  <CardContent className="p-0">
                    {defaultArticle && mdxSource ? (
                      <article>
                        <CardHeader className="px-0">
                          <CardTitle className="text-3xl lg:text-4xl font-bold">{defaultArticle.title}</CardTitle>
                          <p className="text-muted-foreground mt-2">{defaultArticle.description}</p>
                          <div className="text-sm text-muted-foreground mt-4 flex items-center space-x-4">
                            <span>
                              Created on: {new Date(defaultArticle.createdAt).toLocaleDateString()}
                            </span>
                            <span>•</span>
                            <span>{readingTime}</span>
                          </div>
                        </CardHeader>
                        <div className="mt-8">
                          <ClientSideMDX source={mdxSource} />
                        </div>
                      </article>
                    ) : (
                      <article>
                        <CardHeader className="px-0">
                          <CardTitle className="text-3xl lg:text-4xl font-bold">{t('guides')}</CardTitle>
                        </CardHeader>
                        <p className="mt-4">{t('chooseArticle')}</p>
                        <div className="mt-6 space-y-4">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[300px]" />
                        </div>
                      </article>
                    )}
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </main>

          <div className="hidden lg:block w-72 flex-shrink-0">
            <TableOfContents headings={headings} />
          </div>
        </div>
      </div>

      <Footer translations={translations} lang={lang} />
    </div>
  )
}