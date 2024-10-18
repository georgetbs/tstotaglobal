// app/[lang]/guides/[id]/page.tsx

import { notFound } from 'next/navigation'
import { getArticleById, Article } from '@/lib/getArticles'
import { serialize } from 'next-mdx-remote/serialize'
import dynamic from 'next/dynamic'
import React from 'react'

const ClientSideMDX = dynamic(() => import('@/components/ClientSideMDX'), { ssr: false })

interface PageProps {
  params: {
    lang: string
    id: string
  }
}

// Функция для расчета времени чтения
const calculateReadingTime = (text: string): string => {
  const wordsPerMinute = 200
  const words = text.split(/\s+/).length
  const minutes = Math.ceil(words / wordsPerMinute)
  return `${minutes} мин. чтения`
}

export default async function ArticlePage({ params: { id } }: PageProps) {
  const article: Article | null = getArticleById(id)

  if (!article) {
    notFound()
  }

  const mdxSource = await serialize(article.content)

  // Расчет времени чтения
  const readingTime = calculateReadingTime(article.content)

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl px-4 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">{article.title}</h1>
        <p className="text-xl text-gray-700 mb-8 text-center">{article.description}</p>
        <div className="text-gray-500 italic mb-4 text-center">
          <span>Создано: {new Date(article.createdAt).toLocaleDateString()}</span>
          <span className="mx-2">|</span>
          <span>{readingTime}</span>
        </div>
        
        <article className="prose prose-lg mx-auto">
          <ClientSideMDX source={mdxSource} />
        </article>
      </div>
    </div>
  )
}
