// lib/getArticles.ts

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { slugify } from '@/utils/slugify';
import { Article, NavigationItem } from '@/types'; // Импортируем интерфейсы из types.ts

const articlesDirectory = path.join(process.cwd(), 'content', 'articles');

export const getNavigationItems = (): NavigationItem[] => {
  const buildTree = (dirPath: string, parentPath: string[] = []): NavigationItem[] => {
    const items: NavigationItem[] = [];
    const entries = fs.readdirSync(dirPath);

    entries.forEach((entry) => {
      const fullPath = path.join(dirPath, entry);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        // Check for an article with the same name as the directory
        const indexArticlePath = path.join(fullPath, `${entry}.mdx`);
        let indexArticle: NavigationItem | null = null;

        if (fs.existsSync(indexArticlePath)) {
          const fileContents = fs.readFileSync(indexArticlePath, 'utf8');
          const { data } = matter(fileContents);
          const slug = slugify(data.title || entry);

          indexArticle = {
            name: data.title || entry,
            slug,
            type: 'category', // It's a category with an article
            children: buildTree(fullPath, [...parentPath, data.title || entry]),
          };
        } else {
          indexArticle = {
            name: entry,
            type: 'category',
            children: buildTree(fullPath, [...parentPath, entry]),
          };
        }

        items.push(indexArticle);
      } else if (stats.isFile() && entry.endsWith('.mdx')) {
        const baseName = path.basename(entry, '.mdx');
        const parentDirName = path.basename(dirPath);

        // Skip index articles (handled in the directory logic)
        if (baseName !== parentDirName) {
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data } = matter(fileContents);
          const slug = slugify(data.title || baseName);

          items.push({
            name: data.title || baseName,
            slug,
            type: 'article',
          });
        }
      }
    });

    return items;
  };

  const navigationItems = buildTree(articlesDirectory);
  return navigationItems;
};

// Function to get all articles (flattened list)
export const getArticles = (): Article[] => {
  const articles: Article[] = [];

  const traverse = (dirPath: string, parentPath: string[] = []) => {
    const entries = fs.readdirSync(dirPath);

    entries.forEach((entry) => {
      const fullPath = path.join(dirPath, entry);
      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        traverse(fullPath, [...parentPath, entry]);
      } else if (stats.isFile() && entry.endsWith('.mdx')) {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const slug = slugify(data.title || entry.replace('.mdx', ''));

        const article: Article = {
          title: data.title || entry.replace('.mdx', ''),
          description: data.description || '',
          category: data.category || '',
          slug,
          content,
          createdAt: data.createdAt || '',
          path: [...parentPath, data.title || entry.replace('.mdx', '')], // Заполняем свойство path
        };

        articles.push(article);
      }
    });
  };

  traverse(articlesDirectory);
  return articles;
};

export const getArticleBySlug = (slug: string): Article | null => {
  const articles = getArticles();
  return articles.find((article) => article.slug === slug) || null;
};
