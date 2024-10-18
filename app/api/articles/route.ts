// app/api/articles/route.ts

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { title, description, category, content, author } = await request.json()

    if (!title || !description || !category || !content || !author) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 })
    }

    const generateId = (): string => {
      return Math.floor(100000 + Math.random() * 900000).toString()
    }

    const id = generateId()
    const createdAt = new Date().toISOString()

    const filePath = path.join(process.cwd(), 'content', 'articles', category)
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(filePath, { recursive: true })
    }

    const fileName = `${id}.mdx`
    const fileContent = `---
id: "${id}"
title: "${title}"
description: "${description}"
category: "${category}"
author: "${author}"
createdAt: "${createdAt}"
---

${content}
`

    fs.writeFileSync(path.join(filePath, fileName), fileContent)

    return NextResponse.json({ message: 'Статья успешно создана', id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка при создании статьи' }, { status: 500 })
  }
}
