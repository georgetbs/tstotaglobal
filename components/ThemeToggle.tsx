'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Moon, Sun, Laptop } from 'lucide-react'
import { useEffect, useState } from 'react'

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex space-x-1">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => setTheme('light')}
        title="Light mode"
      >
        <Sun className="h-5 w-5" />
        <span className="sr-only">Light mode</span>
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => setTheme('system')}
        title="System preference"
      >
        <Laptop className="h-5 w-5" />
        <span className="sr-only">System preference</span>
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="icon"
        onClick={() => setTheme('dark')}
        title="Dark mode"
      >
        <Moon className="h-5 w-5" />
        <span className="sr-only">Dark mode</span>
      </Button>
    </div>
  )
}