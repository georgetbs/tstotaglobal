// components/WelcomePageClient.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface WelcomePageClientProps {
  translations: {
    welcomeMessage: string;
    welcomeDescription: string;
    exploreGuides: string;
    allRightsReserved: string;
    followOnX: string;
    about: string;
    privacy: string;
  };
  lang: string;
}

const WelcomePageClient: React.FC<WelcomePageClientProps> = ({ translations, lang }) => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-600 to-indigo-900 text-white">
      {/* Header */}
      <Header lang={lang} />

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-extrabold mb-6"
        >
          {translations.welcomeMessage}
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl max-w-2xl mb-8"
        >
          {translations.welcomeDescription}
        </motion.p>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button asChild className="bg-white text-indigo-600 font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-100 transition">
            <Link href={`/${lang}/guides`}>{translations.exploreGuides}</Link>
          </Button>
        </motion.div>
      </main>

      {/* Footer */}
      <Footer translations={translations} lang={lang} />
    </div>
  );
};

export default WelcomePageClient;
