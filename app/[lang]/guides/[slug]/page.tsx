import { notFound } from 'next/navigation';
import { getArticleBySlug, getNavigationItems } from '@/lib/getArticles';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';
import dynamic from 'next/dynamic';

const GuidesPage = dynamic(() => import('@/components/GuidesPage'), { ssr: false });

interface PageProps {
  params: {
    lang: string;
    slug: string;
  };
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface Article {
  title: string;
  description: string;
  content: string;
  createdAt: string;
  slug: string;
  category: string; // Added category property
}

interface ProcessedArticle extends Article {
  mdxSource: MDXRemoteSerializeResult;
  headings: Heading[];
}

interface Translations {
  allRightsReserved: string;
  followOnX: string;
  about: string;
  privacy: string;
  guides: string;
  chooseArticle: string;
}

export default async function ArticlePage({
  params: { lang, slug },
}: PageProps) {
  const article = getArticleBySlug(slug);
  const navigationItems = getNavigationItems();

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

  // Process the article
  const mdxSource = await serialize(article.content);
  const headings = getHeadings(article.content);

  // Create the processed article with all required properties
  const processedArticle: ProcessedArticle = {
    ...article,
    content: article.content,
    mdxSource: mdxSource,
    headings: headings,
    category: article.category // Ensure category is included
  };

  const translations: Translations = {
    allRightsReserved: 'All rights reserved',
    followOnX: 'Follow on X',
    about: 'About',
    privacy: 'Privacy',
    guides: 'Guides',
    chooseArticle: 'Choose an article from the navigation'
  };

  return (
    <GuidesPage 
      navigationItems={navigationItems}
      lang={lang}
      translations={translations}
      defaultArticle={processedArticle}
    />
  );
}