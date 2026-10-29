import InfoPage from '@/components/itch/InfoPage';

export const metadata = { title: 'Community Guidelines', description: 'Simple ways to share problems, protect privacy, and keep Itch conversations kind and useful.', alternates: { canonical: '/community-guidelines' } };

export default function CommunityGuidelinesPage() {
  return <InfoPage pageType="guidelines" title="Share the problem. Respect the person." intro="A few simple habits help people explain what happened, feel heard, and keep personal details safe." privacyNote="Use your display name on posts. Your account email is not shown publicly." sections={[
    { title: 'Describe what happened', body: 'Tell people what you were trying to do and where you got stuck. A real example helps others understand the problem.', points: ['Say who or what is affected.', 'Mention what you have already tried.', 'Start with the situation, not a product idea.'] },
    { title: 'Keep private details out', body: 'Problems and replies are public. Only include details you are comfortable sharing with anyone who visits the site.', points: ['Never post passwords, payment details, or private contact information.', 'Do not share someone else’s name, messages, or personal details without permission.', 'Leave out exact locations and identifying details when they are not needed.'] },
    { title: 'Reply to the person', body: 'People can experience the same thing differently. Listen first, ask a genuine question, and disagree with an idea without attacking its author.', points: ['No harassment, threats, hate, or personal attacks.', 'Do not dismiss a problem because it seems small to you.', 'Keep replies relevant and useful.'] },
    { title: 'Be honest about interest', body: 'A star means a problem matters to you. Contribute means you intend to explore it. Neither confirms a solution or guarantees that work will be finished.', points: ['Do not fake interest or claim work you have not done.', 'Share progress when it is real and explain what is still uncertain.', 'Do not spam, impersonate people, or make deceptive claims.'] },
    { title: 'Report something harmful', body: 'Use the report option on a problem or reply. Reports are private to the moderation team. A moderator may hide content or take other action, but a report does not guarantee removal or a personal reply.' },
    { title: 'If someone is in danger', body: 'Itch is for everyday problems and community discussion. It is not an emergency or professional support service. Contact local emergency services if someone is in immediate danger.' },
  ]} />;
}
