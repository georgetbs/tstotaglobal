// types.ts

export interface Article {
    title: string;
    description: string;
    category: string;
    slug: string;
    content: string;
    createdAt: string;
    path?: string[];
  }
  
  export interface NavigationItem {
    name: string;
    slug?: string;
    type: 'category' | 'article';
    children?: NavigationItem[];
  }
  