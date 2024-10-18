// app/[lang]/guides/page.tsx

import { getArticles, Article } from '@/lib/getArticles'
import dynamic from 'next/dynamic'

const GuidesPage = dynamic(() => import('@/components/GuidesPage'), {
  ssr: false,
})

interface PageProps {
  params: {
    lang: string
  }
}

export default async function Page({ params: { lang } }: PageProps) {
  const articles: Article[] = getArticles()

  return <GuidesPage articles={articles} lang={lang} />
}
