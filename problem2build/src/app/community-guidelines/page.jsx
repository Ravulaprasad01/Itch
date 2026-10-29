import InfoPage from '@/components/itch/InfoPage';

export const metadata = { title: 'Community Guidelines', description: 'Read the Itch community guidelines for sharing everyday problems and responding with care.', alternates: { canonical: '/community-guidelines' } };

export default function CommunityGuidelinesPage() {
  return <InfoPage eyebrow="Community guidelines" title="Make it easier for people to be heard." intro="Itch works best when people can describe real frustrations and respond with care. These simple guidelines set the tone." sections={[
    { icon: 'MessageCircle', title: 'Be specific and constructive', body: 'Describe the situation and its impact. Focus on the friction and the experience rather than attacking a person.' },
    { icon: 'ShieldCheck', title: 'Respect privacy', body: 'Do not share private contact details, credentials, or identifying information about another person.' },
    { icon: 'Lightbulb', title: 'Assume good intent', body: 'People experience the same situation differently. Ask questions, listen, and disagree without harassment.' },
    { icon: 'Check', title: 'No spam or abuse', body: 'Keep contributions relevant and honest. Do not use the space to mislead, threaten, or repeatedly disrupt others.' },
    { icon: 'Flag', title: 'Report concerns, don’t pile on', body: 'Use Report on a problem or reply when it breaks these guidelines. Reports are private to the moderation team. Moderators review them and may hide content; submitting a report does not guarantee removal or an individual response.' },
    { icon: 'MessageCircle', title: 'Show progress honestly', body: 'Choosing to contribute means you intend to explore a solution. It is not proof that work is complete or a promise that a solution will be delivered. Share real progress in the conversation, and be clear about uncertainty.' },
  ]} />;
}
