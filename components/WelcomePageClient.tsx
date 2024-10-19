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
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header lang={lang} />

      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 bg-gradient-to-b from-primary/20 to-background">
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          className="text-5xl md:text-6xl font-extrabold mb-6 text-foreground"
        >
          {translations.welcomeMessage}
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl max-w-2xl mb-8 text-muted-foreground"
        >
          {translations.welcomeDescription}
        </motion.p>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 transition">
            <Link href={`/${lang}/guides`}>{translations.exploreGuides}</Link>
          </Button>
        </motion.div>
      </main>

      <Footer translations={translations} lang={lang} />
    </div>
  );
};

export default WelcomePageClient;