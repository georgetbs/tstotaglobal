// components/ArticleBreadcrumbs.tsx

import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ArticleBreadcrumbsProps {
  path?: string[];
  articleTitle: string;
  categoryName: string;
}

const ArticleBreadcrumbs: React.FC<ArticleBreadcrumbsProps> = ({
  path = [],
  articleTitle,
  categoryName,
}) => {
  // Не отображать, если имя статьи и категории совпадают
  if (articleTitle.trim().toLowerCase() === categoryName.trim().toLowerCase()) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 mt-8 -mb-12 text-m text-muted-foreground">
      {path.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="h-4 w-4" />}
          <span className={index === path.length - 1 ? 'text-foreground font-medium' : ''}>
            {item}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default ArticleBreadcrumbs;
