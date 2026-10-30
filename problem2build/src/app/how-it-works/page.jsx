import InfoPage from '@/components/itch/InfoPage';

export const metadata = { title: 'How Itch Works: Share it, Support it, Build it', description: 'Share an everyday problem, support people who recognize it, and build toward useful next steps together.', alternates: { canonical: '/how-it-works' } };

export default function HowItWorksPage() {
  return <InfoPage pageType="how" title="Share it, Support it, Build it." intro="Anyone can bring an everyday problem. The community helps make it easier to understand, and builders can choose a real need to work on." highlight={{ title: 'Start with what happened', body: 'A moment, a workaround, and who it affects make a stronger starting point than a feature request alone.' }} />;
}
