import { notFound } from 'next/navigation';
import { getArticleBySlug, getNavigationItems } from '@/lib/getArticles';
import { serialize } from 'next-mdx-remote/serialize';
import dynamic from 'next/dynamic';
import React from 'react';
import { visit } from 'unist-util-visit';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { PanelLeft } from 'lucide-react'; // Importing PanelLeft icon
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';

const ClientSideMDX = dynamic(() => import('@/components/ClientSideMDX'), { ssr: false });
const ArticleNavigation = dynamic(() => import('@/components/ArticleNavigation'), { ssr: false });
const TableOfContents = dynamic(() => import('@/components/TableOfContents'), { ssr: false });

interface PageProps {
  params: {
    lang: string;
    slug: string;
  };
  isDefault?: boolean;
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Translations {
  allRightsReserved: string;
  followOnX: string;
  about: string;
  privacy: string;
}

export default async function ArticlePage({
  params: { lang, slug },
  isDefault = false,
}: PageProps) {
  const article = await getArticleBySlug(slug);
  const navigationItems = await getNavigationItems();

  if (!article) {
    notFound();
  }

  const getHeadings = (markdownContent: string): Heading[] => {
    const headings: Heading[] = [];

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

  const headings = getHeadings(article.content);

  const mdxSource = await serialize(article.content);

  const calculateReadingTime = (text: string): string => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const readingTime = calculateReadingTime(article.content);

  const translations: Translations = {
    allRightsReserved: 'All rights reserved',
    followOnX: 'Follow on X',
    about: 'About',
    privacy: 'Privacy',
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang} />

      <div className="flex-1 overflow-hidden">
        <div className="mx-auto max-w-7xl flex">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50 lg:hidden"
              >
                <PanelLeft className="h-6 w-6" /> {/* Using PanelLeft instead of Menu */}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Navigate through the articles</SheetDescription>
              </SheetHeader>
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
                    <article>
                      <CardHeader className="px-0">
                        <CardTitle className="text-3xl lg:text-4xl font-bold">
                          {article.title}
                        </CardTitle>
                        <p className="text-muted-foreground mt-2">
                          {article.description}
                        </p>
                        <div className="text-sm text-muted-foreground mt-4 flex items-center space-x-4">
                          <span>
                            Created on: {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{readingTime}</span>
                        </div>
                      </CardHeader>
                      <div className="mt-8">
                        <ClientSideMDX source={mdxSource} />
                      </div>
                    </article>
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
  );
}
