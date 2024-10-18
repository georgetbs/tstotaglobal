'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Toaster } from '@/components/ui/toaster'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import initTranslations from '@/i18n'

interface PortalPageProps {
  params: {
    lang: string
  }
}

interface Category {
  id: string
  title: string
  description: string
  link: string
  icon: string
}

const PortalPage: React.FC<PortalPageProps> = ({ params: { lang } }) => {
  const [t, setT] = useState<(key: string) => string>(() => (key: string) => key)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadTranslations = async () => {
      const { t } = await initTranslations(lang, ['common'])
      setT(() => t)
    }
    loadTranslations()
  }, [lang])

  const changeLanguage = (newLang: string) => {
    router.push(`/${newLang}`)
    toast({
      title: t('languageChanged'),
      description: t('languageChangedDescription'),
    })
  }

  const categories: Category[] = [
    { id: 'guides', title: t('guides'), description: t('guidesDesc'), link: '/guides', icon: '📚' },
    { id: 'housing', title: t('housing'), description: t('housingDesc'), link: '/housing', icon: '🏠' },
    { id: 'jobs', title: t('jobs'), description: t('jobsDesc'), link: '/jobs', icon: '💼' },
    { id: 'events', title: t('events'), description: t('eventsDesc'), link: '/events', icon: '🎉' },
    { id: 'marketplace', title: t('marketplace'), description: t('marketplaceDesc'), link: '/marketplace', icon: '🛒' },
    { id: 'community', title: t('community'), description: t('communityDesc'), link: '/community', icon: '👥' },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Toaster />
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 px-4">
          <Link href="/" className="font-bold text-xl">
            {t('portalName')}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('ka')}>
                <span className="mr-2">🇬🇪</span> ქართული
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                <span className="mr-2">🇬🇧</span> English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('ru')}>
                <span className="mr-2">🇷🇺</span> Русский
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">{t('welcomeMessage')}</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="p-4">
                <CardTitle className="text-xl flex items-center space-x-2">
                  <span className="text-3xl">{category.icon}</span>
                  <span>{category.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                <Button asChild className="w-full">
                  <Link href={category.link}>{t('explore')}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="border-t bg-background/95 p-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} {t('portalName')}. {t('allRightsReserved')}.
          </div>
          <div className="flex space-x-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              {t('about')}
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              {t('contact')}
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              {t('privacy')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default PortalPage