// app/[lang]/guides/page.tsx

import React from 'react';
import GuidesPage from '@/components/GuidesPage';
import { getArticleBySlug, getNavigationItems } from '@/lib/getArticles';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { remark } from 'remark';
import remarkParse from 'remark-parse';
import { visit } from 'unist-util-visit';
import { Article, NavigationItem } from '@/types'; // Импортируем Article из types.ts

interface Translations {
  guides: string;
  chooseArticle: string;
  allRightsReserved: string;
  followOnX: string;
  about: string;
  privacy: string;
}

interface PageProps {
  params: {
    lang: string;
  };
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface ProcessedArticle extends Article {
  mdxSource: MDXRemoteSerializeResult;
  headings: Heading[];
}

export default async function Page({ params }: PageProps) {
  const lang = params.lang;
  const navigationItems = await getNavigationItems();

  // Получаем статью 'introduction'
  const introductionArticle = await getArticleBySlug('introduction');

  // Обрабатываем статью
  if (introductionArticle) {
    const mdxSource = await serialize(introductionArticle.content);

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

    const headings = getHeadings(introductionArticle.content);

    if (!introductionArticle.path) {
      introductionArticle.path = [introductionArticle.category, introductionArticle.title];
    }

    const processedArticle: ProcessedArticle = {
      ...introductionArticle,
      mdxSource: mdxSource,
      headings: headings,
    };

    // Переводы на нужном языке
    const translations: Translations = {
      guides: 'Руководства',
      chooseArticle: 'Выберите статью',
      allRightsReserved: 'Все права защищены',
      followOnX: 'Следите за нами в X',
      about: 'О нас',
      privacy: 'Конфиденциальность',
    };

    return (
      <GuidesPage
        navigationItems={navigationItems}
        lang={lang}
        translations={translations}
        defaultArticle={processedArticle}
      />
    );
  } else {
    return <div>Статья 'introduction' не найдена.</div>;
  }
}
