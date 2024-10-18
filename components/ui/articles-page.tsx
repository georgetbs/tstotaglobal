'use client'

import { useState, useEffect } from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Toaster } from '@/components/ui/toaster'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import initTranslations from '@/i18n'

interface ArticlesPageProps {
  params: {
    lang: string
  }
}

interface Article {
  title: string
  description: string
  category: string
  link: string
}

const ArticlesPage: React.FC<ArticlesPageProps> = ({ params: { lang } }) => {
  const [t, setT] = useState<(key: string) => string>(() => (key: string) => key)
  const router = useRouter()
  const { toast } = useToast()
  const [articles, setArticles] = useState<Article[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadTranslations = async () => {
      const { t } = await initTranslations(lang, ['common'])
      setT(() => t)
    }
    loadTranslations()
  }, [lang])

  useEffect(() => {
    // Загрузка статей
    const loadArticles = async () => {
      const articlesDirectory = path.join(process.cwd(), 'content', 'articles')
      const categories = fs.readdirSync(articlesDirectory)

      const allArticles: Article[] = categories.flatMap(category => {
        const categoryPath = path.join(articlesDirectory, category)
        const files = fs.readdirSync(categoryPath)

        return files.map(filename => {
          const filePath = path.join(categoryPath, filename)
          const fileContents = fs.readFileSync(filePath, 'utf8')
          const { data } = matter(fileContents)

          return {
            title: data.title || filename,
            description: data.description || '',
            category,
            link: `/articles/${category}/${filename.replace('.mdx', '')}`
          }
        })
      })

      setArticles(allArticles)
    }

    loadArticles()
  }, [])

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster />
      <main className="flex-grow container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('articles')}</h1>
          <Button asChild>
            <Link href="/articles/create">
              {t('createArticle')}
            </Link>
          </Button>
        </div>

        <div className="mb-6 relative">
          <input
            type="search"
            placeholder={t('searchArticles')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm pl-10 p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredArticles.map((article) => (
            <Card key={article.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">
                  <Link href={article.link}>
                    {article.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-4">{article.description}</p>
                <Button asChild className="w-full">
                  <Link href={article.link}>{t('readMore')}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ArticlesPage
