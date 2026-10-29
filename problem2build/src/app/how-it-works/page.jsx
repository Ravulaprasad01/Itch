import InfoPage from '@/components/itch/InfoPage';

export const metadata = { title: 'How Itch Works', description: 'See how Itch turns a specific everyday frustration into a shared, constructive community conversation.', alternates: { canonical: '/how-it-works' } };

export default function HowItWorksPage() {
  return <InfoPage pageType="how" title="A problem, made easier to see." intro="Itch gives everyday frustrations a place to be described, recognized, and discussed. Start with what happened; let the community help make the need clearer." highlight={{ title: 'Start with what happened', body: 'A moment, a workaround, and who it affects make a stronger starting point than a feature request alone.' }} />;
}
