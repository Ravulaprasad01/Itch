import InfoPage from '@/components/itch/InfoPage';

export const metadata = { title: 'Contact Itch', description: 'Questions, feedback, or ideas about Itch? Get in touch with the team.', alternates: { canonical: '/contact' } };

export default function ContactPage() {
  return <InfoPage pageType="contact" eyebrow="Contact" title="Tell us what’s on your mind." intro="Questions, feedback, and ideas are welcome. We want Itch to make it easier to talk about everyday problems and what could improve them." email={process.env.NEXT_PUBLIC_CONTACT_EMAIL || ''} sections={[
    { icon: 'MessageCircle', title: 'Share feedback', body: 'Let us know what felt clear, what felt confusing, or what would make the experience more useful.' },
    { icon: 'Lightbulb', title: 'Suggest an idea', body: 'Have a feature or problem area in mind? A short note is a great place to start.' },
  ]} />;
}
