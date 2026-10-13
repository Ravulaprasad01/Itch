'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';

export default function ThanksRedirectButton() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds === 0) {
      router.replace('/');
      return undefined;
    }

    const timer = window.setTimeout(() => setSeconds(value => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [router, seconds]);

  return <>
    <Link href="/explore" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-semibold text-on-surface transition hover:bg-white/5">
      <Search size={16} /> Explore Problems
    </Link>
    <button
      type="button"
      onClick={() => router.replace('/')}
      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-on-primary transition hover:brightness-110"
      aria-live="polite"
    >
      {seconds > 0 ? `Homepage in ${seconds}…` : 'Returning home…'}
      <ArrowRight size={16} />
    </button>
  </>;
}
