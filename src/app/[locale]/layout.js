import '../globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import CookieBanner from '@/components/CookieBanner';
import { getDictionary } from '@/lib/get-dictionary';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const h = dict.hero;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.docforge.site';

  // Construct alternates for all supported languages
  const languages = {
    'en': `${baseUrl}/en`,
    'fr': `${baseUrl}/fr`,
    'de': `${baseUrl}/de`,
    'es': `${baseUrl}/es`,
    'it': `${baseUrl}/it`,
    'pt': `${baseUrl}/pt`,
  };

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: `${dict.common.home} — DocForge AI`,
      template: `%s — DocForge AI`
    },
    description: h.subtitle,
    keywords: ['AI Document Generator', 'Legal Templates', 'Contract Maker', 'Business Proposals', 'NDA Generator', 'Privacy Policy Creator', 'DocForge AI'],
    openGraph: {
      title: dict.hero.title,
      description: h.subtitle,
      type: 'website',
      url: `/${locale}`,
      siteName: 'DocForge AI',
      locale: locale,
      images: [
        {
          url: '/og-image.jpg', // Ensure this image exists
          width: 1200,
          height: 630,
          alt: 'DocForge AI',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.hero.title,
      description: h.subtitle,
      creator: '@DocForgeAI',
      images: ['/og-image.jpg'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: `/${locale}`,
      languages: languages,
    },
    icons: {
      icon: '/icon.svg',
      shortcut: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
  };
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.docforge.site';

  const jsonLdData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DocForge AI',
    url: baseUrl,
    logo: `${baseUrl}/icon.svg`,
    sameAs: [
      'https://twitter.com/DocForgeAI',
      'https://github.com/DocForgeAI'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'support@docforge.site',
      contactType: 'customer support'
    }
  };

  return (
    <html lang={locale}>
      <body>
        <JsonLd data={jsonLdData} />
        <Header dict={dict} />
        <main style={{ paddingTop: '72px', minHeight: '100vh' }}>
          {children}
        </main>
        <Footer dict={dict} />
        <CookieBanner dict={dict} locale={locale} />
      </body>
    </html>
  );
}
