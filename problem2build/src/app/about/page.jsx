import InfoPage from '@/components/itch/InfoPage';

export const metadata = { title: 'About Itch.', description: 'Why Itch exists: make everyday problems easier to see and worth solving.' };

export default function AboutPage() {
  return <InfoPage pageType="about" eyebrow="About Itch" title="Small frustrations deserve a place to go." intro="Itch is a place to put everyday friction into words, find others who recognize it, and help builders notice what is worth improving." sections={[
    { icon: 'MessageCircle', title: 'Start with real life', body: 'The most useful ideas often begin with a simple question: what keeps taking more effort than it should?' },
    { icon: 'ShieldCheck', title: 'Make room for people', body: 'A problem matters more when people can describe how it affects them. Itch is designed around clear, respectful conversation.' },
    { icon: 'Lightbulb', title: 'Help useful things get built', body: 'Shared experiences can help makers spot patterns and choose problems that deserve their attention.' },
    { icon: 'Check', title: 'A community built around problems', body: 'Members can publish problems, explore what others are dealing with, and join conversations with replies.' },
  ]} />;
}
