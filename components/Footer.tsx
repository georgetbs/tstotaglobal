'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
  translations: {
    allRightsReserved: string;
    followOnX: string;
    about: string;
    privacy: string;
  };
  lang: string;
}

const Footer: React.FC<FooterProps> = ({ translations, lang }) => {
  return (
    <footer className="bg-background border-t py-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground px-4">
        <div className="mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} george_tbs. {translations.allRightsReserved}.
        </div>
        <div className="flex flex-wrap justify-center md:justify-end space-x-4">
          <Link href="https://x.com/george_tbs" target="_blank" className="hover:underline">
            {translations.followOnX}
          </Link>
          <Link href={`/${lang}/about`} className="hover:underline">
            {translations.about}
          </Link>
          <Link href={`/${lang}/privacy`} className="hover:underline">
            {translations.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;