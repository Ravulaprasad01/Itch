import InfoPage from '@/components/itch/InfoPage';

export const metadata = { title: 'Community Guidelines | Itch.', description: 'Guidelines for a thoughtful and helpful Itch community.' };

export default function CommunityGuidelinesPage() {
  return <InfoPage eyebrow="Community guidelines" title="Make it easier for people to be heard." intro="Itch works best when people can describe real frustrations and respond with care. These simple guidelines set the tone." sections={[
    { icon: 'MessageCircle', title: 'Be specific and constructive', body: 'Describe the situation and its impact. Focus on the friction and the experience rather than attacking a person.' },
    { icon: 'ShieldCheck', title: 'Respect privacy', body: 'Do not share private contact details, credentials, or identifying information about another person.' },
    { icon: 'Lightbulb', title: 'Assume good intent', body: 'People experience the same situation differently. Ask questions, listen, and disagree without harassment.' },
    { icon: 'Check', title: 'No spam or abuse', body: 'Keep contributions relevant and honest. Do not use the space to mislead, threaten, or repeatedly disrupt others.' },
  ]} />;
}
