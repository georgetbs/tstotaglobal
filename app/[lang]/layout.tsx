import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme-provider";
import "@/app/globals.css";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const generateMetadata = ({ params: { lang } }: { params: { lang: string } }) => {
  return {
    title: `Next.js Special Guides by george_tbs`,
    description: "Made by georgetbs",
  };
}

export default function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode, params: { lang: string };
}>) {
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}