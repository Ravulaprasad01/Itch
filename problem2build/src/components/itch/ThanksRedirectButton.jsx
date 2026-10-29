'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Pause, Play, Search } from 'lucide-react';

const RETURN_SECONDS = 5;

export default function ThanksRedirectButton() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(RETURN_SECONDS);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return undefined;
    if (seconds === 0) {
      router.replace('/');
      return undefined;
    }

    const timer = window.setTimeout(() => setSeconds(value => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [paused, router, seconds]);

  const progress = ((RETURN_SECONDS - seconds) / RETURN_SECONDS) * 100;

  return <div className="thanks-next-step">
    <div className="thanks-next-actions">
      <Link href="/explore" className="thanks-explore-link"><Search size={16} /> Explore problems <ArrowRight size={15} /></Link>
      <button type="button" className="thanks-pause-button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>
        {paused ? <Play size={14} /> : <Pause size={14} />}{paused ? 'Resume timer' : 'Pause timer'}
      </button>
    </div>
    <button type="button" className="thanks-home-button" onClick={() => router.replace('/')} aria-live="polite">
      <span>{seconds > 0 ? `Back to home in ${seconds}s` : 'Returning home…'}</span><ArrowRight size={16} />
    </button>
    <div className={`thanks-countdown-track${paused ? ' is-paused' : ''}`} role="progressbar" aria-label="Automatic return to homepage" aria-valuemin={0} aria-valuemax={RETURN_SECONDS} aria-valuenow={RETURN_SECONDS - seconds}>
      <span style={{ width: `${progress}%` }} />
    </div>
    <p className="thanks-countdown-note" aria-live="polite">{paused ? 'Automatic return paused. Resume whenever you’re ready.' : 'We’ll take you home automatically; you can explore first.'}</p>
  </div>;
}
