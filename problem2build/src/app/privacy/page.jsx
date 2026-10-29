import InfoPage from '@/components/itch/InfoPage';

export const metadata = { title: 'Privacy', description: 'Learn how Itch handles sign-in, public problem posts, replies, and personal information.', alternates: { canonical: '/privacy' } };

export default function PrivacyPage() {
  return <InfoPage eyebrow="Privacy" title="Your email stays private." intro="Sign in with Google to publish a problem under your display name. Your email address is not shown on posts." sections={[
    { icon: 'ShieldCheck', title: 'Google sign-in', body: 'Firebase Authentication handles sign-in. Itch uses your Firebase account ID to associate your posts with you.' },
    { icon: 'MessageCircle', title: 'Community conversations', body: 'Replies are stored with the problem they discuss and are visible to other visitors. Include only information you are comfortable sharing publicly.' },
    { icon: 'Lightbulb', title: 'Public problem posts', body: 'When you submit a problem, its title, description, category, context, and display name are stored in Firestore and shown in Explore. Do not include sensitive personal information.' },
    { icon: 'Check', title: 'Display name', body: 'You choose a unique public display name after signing in. It appears on your posts and replies; your email is not shown.' },
  ]} />;
}
