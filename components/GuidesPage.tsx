// components/GuidesPage.tsx

'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Toaster } from '@/components/ui/toaster'
import { Search, Plus } from 'lucide-react'
import initTranslations from '@/i18n'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Article {
  id: string
  title: string
  description: string
  category: string
  createdAt: string
}

interface GuidesPageProps {
  articles: Article[]
  lang: string
}

const GuidesPage: React.FC<GuidesPageProps> = ({ articles, lang }) => {
  const [t, setT] = useState<(key: string) => string>(() => (key: string) => key)
  const [filteredArticles, setFilteredArticles] = useState<Article[]>(articles)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    const loadTranslations = async () => {
      const { t } = await initTranslations(lang, ['common'])
      setT(() => t)
    }
    loadTranslations()
  }, [lang])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    filterArticles(query, selectedCategory)
  }

  const filterArticles = (query: string, category: string) => {
    const filtered = articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(query.toLowerCase()) ||
                            article.description.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'all' || article.category === category
      return matchesSearch && matchesCategory
    })
    setFilteredArticles(filtered)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterArticles(searchQuery, category)
  }

  const categories = Array.from(new Set(articles.map(article => article.category)))

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster />
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link href="/" className="font-bold text-xl">
            {t('portalName')}
          </Link>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{t('guides')}</h1>
          <Button asChild>
            <Link href={`/${lang}/guides/create`}>
              <Plus className="mr-2 h-4 w-4" /> {t('createGuide')}
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <Input
              type="search"
              placeholder={t('searchGuides')}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <Select value={selectedCategory} onValueChange={(value) => handleCategoryChange(value)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder={t('selectCategory')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('allCategories')}</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {t(category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
          {filteredArticles.map((article) => (
            <Link href={`/${lang}/guides/${article.id}`} key={article.id}>
              <div className="p-4 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                <div className="flex flex-col h-full">
                  <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">{article.description}</p>
                  <p className="text-xs text-gray-400 mb-2">{t('Category')}: {article.category}</p>
                  <p className="text-xs text-gray-400 mb-4">{t('Created at')}: {new Date(article.createdAt).toLocaleDateString()}</p>
                  <Button className="mt-auto w-full" variant="ghost">
                    {t('readMore')}
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default GuidesPage
