import OurStory from '@/components/itch/OurStory';

export const metadata = {
  title: 'Our Story',
  description: 'Why Itch exists: to make everyday problems easier to share, recognize, and understand together.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <OurStory />;
}
