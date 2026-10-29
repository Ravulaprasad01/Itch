import InfoPage from '@/components/itch/InfoPage';

export const metadata = { title: 'Terms of Use', description: 'Plain-language terms for your Itch account, public posts, and participation in the community.', alternates: { canonical: '/terms' } };

export default function TermsPage() {
  return <InfoPage pageType="terms" title="What using Itch means." intro="These are the basic rules for using the site, sharing a problem, and joining a conversation." privacyNote="Your email supports your account and is not shown with public posts." sections={[
    { title: 'Your account', body: 'You need to sign in to publish a problem or reply. Keep access to your Google account secure. You are responsible for activity through your account; contact us if you think someone else has used it.' },
    { title: 'Public posts', body: 'Problems and replies you publish can be read by anyone. Your display name appears with them; your account email does not. Do not post information you want to keep private.' },
    { title: 'Content you share', body: 'You keep ownership of what you write. You give Itch permission to store and display it as needed to run the service and show your community conversations.' },
    { title: 'Use Itch responsibly', body: 'Do not break the law, harass people, expose private details, impersonate others, disrupt the site, or post spam or deceptive content. Follow the Community Guidelines when you post and reply.' },
    { title: 'Stars and contributions', body: 'A star shows that a problem matters to you. Its count is a signal of interest, not a verified count of everyone affected. Contribute records intent to explore the problem; it does not promise progress or a finished solution.' },
    { title: 'Reports and moderation', body: 'You can report a problem or reply that may break the guidelines. Reports are visible to the moderation team, not the public. Itch may hide content or restrict an account to protect the community. Reporting does not guarantee a specific outcome.' },
    { title: 'Changes and availability', body: 'Itch may change, pause, or remove features. Posts and replies are people’s experiences and opinions; Itch does not verify every claim or guarantee that a problem will be solved.' },
    { title: 'Privacy and questions', body: 'Read the Privacy Policy for information about account and site data. For questions about these terms, contact Itch using the link below.' },
  ]} />;
}
