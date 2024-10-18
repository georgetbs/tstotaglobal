// lib/getArticles.ts

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Article {
  id: string
  title: string
  description: string
  category: string
  content: string
  createdAt: string
}

export const getArticles = (): Article[] => {
  const articlesDirectory = path.join(process.cwd(), 'content', 'articles')
  const categories = fs.readdirSync(articlesDirectory)

  const articles: Article[] = categories.flatMap(category => {
    const categoryPath = path.join(articlesDirectory, category)
    const files = fs.readdirSync(categoryPath)

    return files.map(filename => {
      const filePath = path.join(categoryPath, filename)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)

      console.log('Loaded article data:', { id: data.id, title: data.title, category })

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        content,
        createdAt: data.createdAt,
      }
    })
  })

  console.log('Total articles loaded:', articles.length)
  return articles
}

export const getArticleById = (id: string): Article | null => {
  const articles = getArticles()
  const article = articles.find(article => article.id === id)

  if (!article) {
    console.error('Article not found for id:', id)
  }

  return article || null
}
