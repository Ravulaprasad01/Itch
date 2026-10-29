import LandingPage from './HomePage';
import { SITE_URL } from '@/lib/site';

export const metadata = {
  title: 'Everyday problems deserve to be heard',
  description: 'Share everyday problems, find people who understand, and help builders see what could be better.',
  alternates: { canonical: '/' },
};

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Itch',
    url: SITE_URL,
    description: 'Share everyday problems, find people who understand, and help builders see what could be better.',
  };

  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <LandingPage />
  </>;
}
