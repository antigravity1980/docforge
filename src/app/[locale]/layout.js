import '../globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const h = dict.hero;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.docforge.site'),
    title: `${dict.common.home} — DocForge AI`,
    description: h.subtitle,
    keywords: dict.common.generate,
    openGraph: {
      title: dict.hero.title,
      description: h.subtitle,
      type: 'website',
      url: '/',
      siteName: 'DocForge AI',
      locale: locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.hero.title,
      description: h.subtitle,
    },
    robots: {
      index: true,
      follow: true,
    },
    icons: {
      icon: '/icon.svg',
    },
  };
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body>
        <Header dict={dict} />
        <main style={{ paddingTop: '72px', minHeight: '100vh' }}>
          {children}
        </main>
        <Footer dict={dict} />
      </body>
    </html>
  );
}
