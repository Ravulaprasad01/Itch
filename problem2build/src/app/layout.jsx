import './globals.css';
import RouteTransition from '@/components/layout/RouteTransition';

export const metadata = {
  title: "Itch — Got a problem? Somebody's itching to solve it.",
  description: "Share everyday problems, find people who understand them, and help builders see what matters.",
  icons: { icon: '/itch-mark.svg', apple: '/itch-mark.svg' },
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
      <body className="bg-background text-on-surface antialiased font-sans" style={{ backgroundColor: 'rgb(6, 8, 15)', color: 'rgb(218, 226, 253)' }}>
        <RouteTransition>{children}</RouteTransition>
      </body>
    </html>
  );
}
