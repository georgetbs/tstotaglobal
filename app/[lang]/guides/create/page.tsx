'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from '@/components/ui/select';
import ReactMde from 'react-mde';
import 'react-mde/lib/styles/css/react-mde-all.css';
import { Plus, Image as ImageIcon, Save, Moon, Sun } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CreateArticlePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [sections, setSections] = useState([{ title: '', content: '' }]);
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Инициализация темы и установка mounted
  useEffect(() => {
    setMounted(true);
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDark ? 'dark' : 'light');

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Применение темы только после монтирования компонента
  useEffect(() => {
    if (mounted) {
      document.body.classList.remove('light', 'dark');
      document.body.classList.add(theme);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(current => current === 'light' ? 'dark' : 'light');
  };

  // Остальной код остается без изменений...
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !category || sections.some((s) => !s.content)) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        variant: 'destructive',
      });
      return;
    }

    const content = sections
      .map((section) => `## ${section.title}\n${section.content}`)
      .join('\n\n');

    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, category, content, author }),
    });

    if (response.ok) {
      toast({
        title: 'Success',
        description: 'Article created successfully',
      });
      router.push('/guides');
    } else {
      toast({
        title: 'Error',
        description: 'Failed to create article',
        variant: 'destructive',
      });
    }
  };

  const addSection = () => {
    setSections([...sections, { title: '', content: '' }]);
  };

  const handleSectionChange = (
    index: number,
    field: 'title' | 'content',
    value: string
  ) => {
    const updatedSections = [...sections];
    updatedSections[index] = { ...updatedSections[index], [field]: value };
    setSections(updatedSections);
  };

  const insertImage = () => {
    const url = prompt('Enter the image URL:');
    const altText = prompt('Enter image description (for SEO):', 'Image description');

    if (url) {
      const markdownImage = `\n![${altText}](${url})\n`;
      const updatedSections = [...sections];
      updatedSections[sections.length - 1].content += markdownImage;
      setSections(updatedSections);
    }
  };

  // Предотвращаем рендеринг до монтирования
  if (!mounted) {
    return null;
  }

  return (
 <div className={`container mx-auto p-4 ${theme}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Create New Article</h1>
        <Button onClick={toggleTheme} variant="outline" size="icon" className="bg-background text-foreground">
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-background text-foreground"
        />
        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-background text-foreground"
        />
        <Input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full bg-background text-foreground"
        />
        <Select onValueChange={setCategory}>
          <SelectTrigger className="w-full bg-background text-foreground">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="bg-background">
            <SelectItem value="introduction">Introduction</SelectItem>
            <SelectItem value="Next.js">Next.js</SelectItem>
            <SelectItem value="app-router">App Router</SelectItem>
            <SelectItem value="tailwind-css">Tailwind CSS and Global Styling</SelectItem>
            <SelectItem value="i18n">i18n</SelectItem>
            <SelectItem value="AI Models">AI Models</SelectItem>
            <SelectItem value="shadcn">shadcn</SelectItem>
            <SelectItem value="markdown">Markdown</SelectItem>
            <SelectItem value="deployment">Deployment</SelectItem>
            <SelectItem value="vercel">Vercel</SelectItem>
            <SelectItem value="code-examples">Examples of code</SelectItem>
          </SelectContent>
        </Select>
        {sections.map((section, index) => (
          <div key={index} className="space-y-2">
            <Input
              value={section.title}
              onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
              placeholder={`Section Title ${index + 1}`}
              className="bg-background text-foreground"
            />
            <ReactMde
              value={section.content}
              onChange={(value) => handleSectionChange(index, 'content', value)}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={(markdown) =>
                Promise.resolve(
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    className={`prose ${theme === 'dark' ? 'prose-invert' : ''}`}
                  >
                    {markdown}
                  </ReactMarkdown>
                )
              }
              classes={{
                reactMde: `${theme === 'dark' ? 'react-mde-dark' : ''}`,
                textArea: 'bg-background text-foreground',
                preview: 'bg-background text-foreground'
              }}
            />
          </div>
        ))}
        <div className="flex items-center space-x-4 mt-4">
          <Button
            type="button"
            onClick={addSection}
            className="bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Section</span>
          </Button>
          <Button
            type="button"
            onClick={insertImage}
            className="bg-green-600 text-white hover:bg-green-700 flex items-center space-x-2"
          >
            <ImageIcon className="h-4 w-4" />
            <span>Insert Image</span>
          </Button>
          <Button
            type="submit"
            className="bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Create Article</span>
          </Button>
        </div>
      </form>
      <div className={`prose ${theme === 'dark' ? 'prose-invert' : ''} mt-8`}>
        <h2 className="text-2xl font-bold mb-2 text-foreground">Preview</h2>
        {sections.map((section, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold text-foreground">{section.title}</h3>
            <ReactMarkdown className={`prose ${theme === 'dark' ? 'prose-invert' : ''}`} remarkPlugins={[remarkGfm]}>
              {section.content}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateArticlePage;