import InfoPage from '@/components/itch/InfoPage';

export const metadata = { title: 'How Itch Works', description: 'Learn how to share an everyday problem, find people with similar experiences, and start a useful conversation.', alternates: { canonical: '/how-it-works' } };

export default function HowItWorksPage() {
  return <InfoPage pageType="how" eyebrow="How it works" title="From a daily itch to a clearer signal." intro="Itch gives a simple path to describe a friction, see who relates, and make the underlying need easier for builders to understand." sections={[
    { icon: 'MessageCircle', title: '1. Describe the friction', body: 'Write about a moment that takes too much time, effort, or patience. Clear details help others recognize the situation.' },
    { icon: 'ShieldCheck', title: '2. Find shared experience', body: 'Explore problems and support the ones that feel familiar. A shared signal can help show that a frustration reaches beyond one person.' },
    { icon: 'Lightbulb', title: '3. Give builders a direction', body: 'Patterns and context can help makers understand where a thoughtful solution could make a difference.' },
    { icon: 'Check', title: 'Post and join in', body: 'Sign in to publish a problem under your display name. Anyone can explore public posts; signed-in members can add replies to the conversation.' },
  ]} />;
}
