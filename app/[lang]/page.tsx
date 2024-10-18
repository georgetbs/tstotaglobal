// app/[lang]/page.tsx

import initTranslations from '@/i18n'; // Импорт функции initTranslations
import WelcomePageClient from '@/components/WelcomePageClient';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ka' }, { lang: 'ru' }];
}

interface PageProps {
  params: {
    lang: string;
  };
}

const WelcomePage = async ({ params: { lang } }: PageProps) => {
  // Загрузка переводов с сервера
  const { t } = await initTranslations(lang, ['common']);

  // Получаем переводы строк на сервере и передаем их как пропсы
  const translations = {
    welcomeMessage: t('welcomeMessage'),
    welcomeDescription: t('welcomeDescription'),
    exploreGuides: t('exploreGuides'),
    allRightsReserved: t('allRightsReserved'),
    followOnX: t('followOnX'),
    about: t('about'),
    privacy: t('privacy'),
  };

  return <WelcomePageClient translations={translations} lang={lang} />;
};

export default WelcomePage;
