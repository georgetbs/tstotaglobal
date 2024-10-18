'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Select, SelectItem, SelectTrigger, SelectContent } from '@/components/ui/select'
import ReactMde from 'react-mde'
import 'react-mde/lib/styles/css/react-mde-all.css'
import { Plus, Image, Save } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const CreateArticlePage: React.FC = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [sections, setSections] = useState([{ title: '', content: '' }])
  const [selectedTab, setSelectedTab] = useState<'write' | 'preview'>('write')
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !category || sections.some(s => !s.content)) {
      toast({
        title: 'Ошибка',
        description: 'Все поля обязательны для заполнения',
        variant: 'destructive',
      })
      return
    }

    const content = sections.map(section => `## ${section.title}\n${section.content}`).join('\n\n')

    const response = await fetch('/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, description, category, content, author }),
    })

    if (response.ok) {
      toast({
        title: 'Успех',
        description: 'Статья успешно создана',
      })
      router.push('/guides')
    } else {
      toast({
        title: 'Ошибка',
        description: 'Не удалось создать статью',
        variant: 'destructive',
      })
    }
  }

  const addSection = () => {
    setSections([...sections, { title: '', content: '' }])
  }

  const handleSectionChange = (index: number, field: 'title' | 'content', value: string) => {
    const updatedSections = [...sections]
    updatedSections[index] = { ...updatedSections[index], [field]: value }
    setSections(updatedSections)
  }

  const insertImage = () => {
    const url = prompt('Введите URL изображения:')
    const altText = prompt('Введите описание изображения (для SEO):', 'Описание изображения')

    if (url) {
      const markdownImage = `\n![${altText}](${url})\n`
      const updatedSections = [...sections]
      updatedSections[sections.length - 1].content += markdownImage
      setSections(updatedSections)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Создание новой статьи</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input type="text" placeholder="Заголовок" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full" />
        <Input type="text" placeholder="Описание" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full" />
        <Input type="text" placeholder="Автор" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full" />
        <Select onValueChange={setCategory}>
          <SelectTrigger className="w-full">{category || 'Выберите категорию'}</SelectTrigger>
          <SelectContent>
            <SelectItem value="transportation">Транспорт</SelectItem>
            <SelectItem value="healthcare">Здравоохранение</SelectItem>
            <SelectItem value="education">Образование</SelectItem>
            <SelectItem value="legalServices">Юридические услуги</SelectItem>
            <SelectItem value="finance">Финансы</SelectItem>
            <SelectItem value="shopping">Покупки</SelectItem>
            <SelectItem value="food">Еда</SelectItem>
            <SelectItem value="culture">Культура</SelectItem>
            <SelectItem value="sports">Спорт</SelectItem>
            <SelectItem value="tourism">Туризм</SelectItem>
            <SelectItem value="language">Язык</SelectItem>
            <SelectItem value="utilities">Коммунальные услуги</SelectItem>
            <SelectItem value="technology">Технологии</SelectItem>
            <SelectItem value="entertainment">Развлечения</SelectItem>
            <SelectItem value="news">Новости</SelectItem>
            <SelectItem value="travel">Путешествия</SelectItem>
          </SelectContent>
        </Select>
        {sections.map((section, index) => (
          <div key={index} className="space-y-2">
            <Input value={section.title} onChange={(e) => handleSectionChange(index, 'title', e.target.value)} placeholder={`Заголовок раздела ${index + 1}`} />
            <ReactMde
              value={section.content}
              onChange={(value) => handleSectionChange(index, 'content', value)}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
              childProps={{ writeButton: { tabIndex: -1 } }}
            />
          </div>
        ))}
        <div className="flex items-center space-x-4 mt-4">
          <Button type="button" onClick={addSection} className="bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Добавить раздел</span>
          </Button>
          <Button type="button" onClick={insertImage} className="bg-green-600 text-white hover:bg-green-700 flex items-center space-x-2">
            <Image className="h-4 w-4" />
            <span>Вставить изображение</span>
          </Button>
          <Button type="submit" className="bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span>Создать статью</span>
          </Button>
        </div>
      </form>
      <div className="prose prose-lg mt-8">
        <h2 className="text-2xl font-bold mb-2">Предпросмотр</h2>
        {sections.map((section, index) => (
          <div key={index} className="mb-4">
            <h3 className="text-xl font-semibold">{section.title}</h3>
            <ReactMarkdown className="prose" children={section.content} remarkPlugins={[remarkGfm]} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CreateArticlePage
