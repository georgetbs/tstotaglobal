'use client';

import { useState } from 'react';
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
import { Plus, Image as ImageIcon, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const CreateArticlePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [sections, setSections] = useState([{ title: '', content: '' }]);
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write');
  const router = useRouter();
  const { toast } = useToast();

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
        <Input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full"
        />
        <Input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full"
        />
        <Select onValueChange={setCategory}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="i18n">i18n</SelectItem>
            <SelectItem value="icons">Icons</SelectItem>
            <SelectItem value="supabase">Supabase</SelectItem>
            <SelectItem value="authentication">Authentication</SelectItem>
            <SelectItem value="routing">Routing</SelectItem>
            <SelectItem value="api-routes">API Routes</SelectItem>
            <SelectItem value="static-generation">Static Generation</SelectItem>
            <SelectItem value="ssr">Server-Side Rendering</SelectItem>
            <SelectItem value="dynamic-import">Dynamic Import</SelectItem>
            <SelectItem value="middleware">Middleware</SelectItem>
            <SelectItem value="performance">Performance Optimization</SelectItem>
            <SelectItem value="deployment">Deployment</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
            <SelectItem value="typescript">TypeScript</SelectItem>
            <SelectItem value="css-styling">CSS and Styling</SelectItem>
            <SelectItem value="debugging">Debugging</SelectItem>
          </SelectContent>
        </Select>
        {sections.map((section, index) => (
          <div key={index} className="space-y-2">
            <Input
              value={section.title}
              onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
              placeholder={`Section Title ${index + 1}`}
            />
            <ReactMde
              value={section.content}
              onChange={(value) => handleSectionChange(index, 'content', value)}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              generateMarkdownPreview={(markdown) =>
                Promise.resolve(<ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>)
              }
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
      <div className="prose prose-lg mt-8">
        <h2 className="text-2xl font-bold mb-2">Preview</h2>
        {sections.map((section, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold">{section.title}</h3>
            <ReactMarkdown className="prose" remarkPlugins={[remarkGfm]}>
              {section.content}
            </ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateArticlePage;
