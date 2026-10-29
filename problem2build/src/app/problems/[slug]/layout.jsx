export async function generateMetadata({ params }) {
  const { slug } = await params;
  return {
    title: 'Community problem',
    description: 'Read a real everyday problem and join the community conversation on Itch.',
    alternates: { canonical: `/problems/${encodeURIComponent(slug)}` },
  };
}

export default function ProblemLayout({ children }) {
  return children;
}
