import './globals.css';
import RouteTransition from '@/components/layout/RouteTransition';

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tryitch.online'),
  title: {
    default: 'Itch — Everyday problems deserve to be heard',
    template: '%s | Itch',
  },
  description: 'Share everyday problems, find people who understand, and help builders see what could be better.',
  icons: { icon: '/itch-mark.svg', apple: '/itch-mark.svg' },
  openGraph: {
    type: 'website',
    siteName: 'Itch',
    title: 'Itch — Everyday problems deserve to be heard',
    description: 'Share everyday problems, find people who understand, and help builders see what could be better.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Itch — Everyday problems deserve to be heard',
    description: 'Share everyday problems, find people who understand, and help builders see what could be better.',
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className="bg-background text-on-surface antialiased font-sans" style={{ backgroundColor: 'rgb(6, 8, 15)', color: 'rgb(218, 226, 253)' }}>
        <a className="skip-to-content" href="#main-content">Skip to content</a>
        <RouteTransition>{children}</RouteTransition>
      </body>
    </html>
  );
}
