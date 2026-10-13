import InfoPage from '@/components/itch/InfoPage';

export const metadata = { title: 'Terms | Itch.', description: 'Simple terms for using the Itch community.' };

export default function TermsPage() {
  return <InfoPage eyebrow="Terms" title="A few basics for using Itch." intro="By using the site, please help keep it useful, respectful, and safe for everyone." sections={[
    { icon: 'MessageCircle', title: 'Use it respectfully', body: 'Do not use Itch to harass people, share someone else’s private information, or post content that is unlawful or harmful.' },
    { icon: 'ShieldCheck', title: 'Keep private details private', body: 'Describe the problem without including passwords, financial details, health records, or personal information about someone else.' },
    { icon: 'Lightbulb', title: 'Public posts and replies', body: 'Problems and replies you publish are visible to other visitors. Do not include passwords, private contact details, or sensitive personal information.' },
    { icon: 'Check', title: 'Respect the community', body: 'Keep contributions relevant, respectful, and focused on useful experiences and ideas.' },
  ]} />;
}
