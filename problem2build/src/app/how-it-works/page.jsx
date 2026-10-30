import InfoPage from '@/components/itch/InfoPage';

export const metadata = { title: 'How Itch Works: Share it, Support it, Build it', description: 'Share an everyday problem, support people who recognize it, and build toward useful next steps together.', alternates: { canonical: '/how-it-works' } };

export default function HowItWorksPage() {
  return <InfoPage pageType="how" title="A problem, made easier to see." intro="Itch gives everyday frustrations a place to be described, recognized, and discussed. Start with what happened; let the community help make the need clearer." highlight={{ title: 'Start with what happened', body: 'A moment, a workaround, and who it affects make a stronger starting point than a feature request alone.' }} />;
}
