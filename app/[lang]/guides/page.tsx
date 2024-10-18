// app/[lang]/guides/page.tsx
import React from 'react';
import GuidesPage from '@/components/GuidesPage';
import { getArticleBySlug, getNavigationItems } from '@/lib/getArticles';

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

export default async function Page({ params }: PageProps) {
  const lang = params.lang;
  const navigationItems = await getNavigationItems();

  // Fetch the 'introduction' article
  const introductionArticle = await getArticleBySlug('introduction');

  // Handle case where the article is not found
  if (!introductionArticle) {
    return <div>Introduction article not found.</div>;
  }

  // Replace with actual translations based on the language
  const translations: Translations = {
    guides: 'Guides',
    chooseArticle: 'Choose an article',
    allRightsReserved: 'All rights reserved',
    followOnX: 'Follow on X',
    about: 'About',
    privacy: 'Privacy',
  };

  return (
    <GuidesPage
      navigationItems={navigationItems}
      lang={lang}
      translations={translations}
      defaultArticle={introductionArticle}
    />
  );
}
