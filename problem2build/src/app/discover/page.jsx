'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';
import { problemFeedErrorMessage } from '@/lib/problem-feed-error';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DiscoverPage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    if (!db) { setLoading(false); setLoadError('Firebase is not configured.'); return undefined; }

    let settled = false;
    const timeout = window.setTimeout(() => {
      if (settled) return;
      setLoading(false);
      setLoadError('The problem feed is taking longer than expected. Check your connection and try again.');
    }, 10000);
    const unsubscribe = onSnapshot(query(collection(db, 'problems'), where('moderationStatus', '==', 'visible')), snapshot => {
        settled = true;
        window.clearTimeout(timeout);
        const communityProblems = snapshot.docs.map(problemDoc => {
          const data = problemDoc.data();
          const categoryName = typeof data.category === 'string' ? data.category : data.category?.name;
          return {
            ...data,
            id: problemDoc.id,
            slug: problemDoc.id,
            isCommunityPost: true,
            category: { name: categoryName || 'General' },
            targetAudience: data.audience || 'Community member',
            meTooCount: data.meTooCount || 0,
            wantThisCount: data.wantThisCount || 0,
            devInterestCount: data.devInterestCount || 0,
          };
        }).sort((left, right) => (right.createdAt?.toMillis?.() ?? 0) - (left.createdAt?.toMillis?.() ?? 0));

        setProblems(communityProblems);
        setLoading(false);
        setLoadError('');
      }, error => { settled = true; window.clearTimeout(timeout); setProblems([]); setLoading(false); setLoadError(problemFeedErrorMessage(error)); });
    return () => { window.clearTimeout(timeout); unsubscribe(); };
  }, [retryKey]);

  const sorted = problems;

  return (
    <div className="min-h-[100svh] flex flex-col bg-background text-on-surface">
      <ItchHeader />

      <main id="main-content" className="flex-1 pt-20 pb-16">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-8">

          <header className="discover-page-heading">
            <h1>Problems people<br/><em>want help solving.</em></h1>
            <div><span>For builders · Explore real posts and the context behind them.</span><span aria-live="polite">{loading ? 'Loading…' : `${sorted.length} ${sorted.length === 1 ? 'problem' : 'problems'}`}</span></div>
          </header>

          {loadError && <div className="explore-feed-error" role="alert"><p>{loadError}</p><button type="button" onClick={() => { setProblems([]); setLoading(true); setLoadError(''); setRetryKey(value => value + 1); }}>Try again</button></div>}
          {loading && <p className="community-local-note" role="status">Loading community problems…</p>}

          {!loading && !loadError && <div className="discover-list">
          {sorted.map((p) => (
            <article key={p.id} className="discover-problem-row">
              <div className="discover-problem-main">
                <span>{p.category?.name || 'General'}</span>
                <Link href={`/problems/${p.slug}`}><h2>{p.title}</h2></Link>
                <p>{p.description}</p>
                <small>Posted by {p.author?.displayName || 'Community member'}</small>
              </div>
              <Link href={`/problems/${p.slug}`} className="discover-open-link">Read problem <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
          </div>
          }
          {!loading && !loadError && sorted.length === 0 && <div className="discover-empty"><h2>No problems to explore yet.</h2><p>New community posts will appear here when they are shared.</p><Link href="/explore">Browse Explore <span aria-hidden="true">→</span></Link></div>}
        </div>
      </main>

      <ItchFooter />
    </div>
  );
}
