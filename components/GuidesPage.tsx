'use client';
import ArticleBreadcrumbs from '@/components/ArticleBreadcrumbs';
import React, { useEffect, useState } from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import dynamic from 'next/dynamic';
import ArticleNavigation from '@/components/ArticleNavigation';
import TableOfContents from '@/components/TableOfContents';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Article, NavigationItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, Calendar } from 'lucide-react';

const ClientSideMDX = dynamic(() => import('@/components/ClientSideMDX'), { ssr: false });

interface GuidesPageProps {
  navigationItems: NavigationItem[];
  lang: string;
  translations: {
    guides: string;
    chooseArticle: string;
    allRightsReserved: string;
    followOnX: string;
    about: string;
    privacy: string;
  };
  defaultArticle?: Article;
}

export default function GuidesPage({
  navigationItems,
  lang,
  translations,
  defaultArticle,
}: GuidesPageProps) {
  const t = (key: keyof typeof translations) => translations[key];

  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>();
  const [readingTime, setReadingTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const processArticle = async () => {
      if (defaultArticle) {
        setIsLoading(true);
        const mdx = await serialize(defaultArticle.content);
        setMdxSource(mdx);

        const getHeadings = async (markdownContent: string) => {
          const { remark } = await import('remark');
          const remarkParse = (await import('remark-parse')).default;
          const { visit } = await import('unist-util-visit');

          const headings: Array<{ id: string; text: string; level: number }> = [];
          const tree = remark().use(remarkParse).parse(markdownContent);

          visit(tree, 'heading', (node: any) => {
            const text = node.children
              .filter((child: any) => child.type === 'text' || child.type === 'inlineCode')
              .map((child: any) => child.value)
              .join('');
            const id = text.toLowerCase().replace(/\s+/g, '-');
            headings.push({ id, text, level: node.depth });
          });

          return headings;
        };

        const extractedHeadings = await getHeadings(defaultArticle.content);
        setHeadings(extractedHeadings);

        const wordsPerMinute = 200;
        const words = defaultArticle.content.split(/\s+/).length;
        const minutes = Math.ceil(words / wordsPerMinute);
        setReadingTime(`${minutes} min read`);
        setIsLoading(false);
      } else {
        setMdxSource(null);
        setHeadings([]);
        setReadingTime('');
      }
    };

    processArticle();
  }, [defaultArticle]);

  const shouldRenderArticle = !isLoading && mdxSource && defaultArticle;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header lang={lang} navigationItems={navigationItems} />
      <div className="w-full flex justify-center mx-auto">
        <div className="lg:mx-auto lg:flex lg:relative">
          {/* Левая боковая панель */}
          <div className="hidden lg:block w-80 flex-shrink-0 sticky top-16 h-screen overflow-y-auto">
            <ArticleNavigation navigationItems={navigationItems} lang={lang} />
          </div>

          {/* Основной контент */}
          <main className="px-6 lg:px-8">
            <div className="w-full max-w-3xl mx-auto">
              <Card className="shadow-none border-none bg-background">
                <CardContent className="p-0">
                  {shouldRenderArticle ? (
                    <article className="prose prose-slate dark:prose-invert">
                      <ArticleBreadcrumbs
                        path={defaultArticle.path || []}
                        articleTitle={defaultArticle.title}
                        categoryName={defaultArticle.category}
                      />
                      <CardHeader className="px-0 space-y-4">
                        <CardTitle className="text-3xl lg:text-4xl font-bold">
                          {defaultArticle.title}
                        </CardTitle>
                        <p className="text-muted-foreground text-lg">
                          {defaultArticle.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <time dateTime={defaultArticle.createdAt}>
                              {new Date(defaultArticle.createdAt).toLocaleDateString()}
                            </time>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{readingTime}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <div className="mt-8 [&>*:first-child]:mt-0 overflow-x-auto">
                        <ClientSideMDX source={mdxSource} />
                      </div>
                    </article>
                  ) : (
                    <article>
                      <CardHeader className="px-0 space-y-4">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-6 w-3/4" />
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                      </CardHeader>
                      <div className="mt-8 space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </article>
                  )}
                </CardContent>
              </Card>
            </div>
          </main>

          {/* Правая боковая панель */}
          <div className="hidden lg:block w-80 flex-shrink-0 sticky top-16 h-screen overflow-y-auto">
            <TableOfContents headings={headings} />
          </div>
        </div>
      </div>

      <Footer translations={translations} lang={lang} />
    </div>
  );
}