export const slugify = (text: string): string => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Заменяет пробелы на тире
      .replace(/[^\w-]+/g, '') // Удаляет все неалфавитные символы
      .replace(/--+/g, '-') // Заменяет несколько тире на одно
      .replace(/^-+|-+$/g, ''); // Удаляет тире в начале и конце строки
  };
  