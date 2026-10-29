'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ItchHeader from '@/components/itch/ItchHeader';
import ProblemList from '@/components/itch/ProblemList';
import ItchFooter from '@/components/itch/ItchFooter';
import { CATEGORIES } from '@/lib/mock-data';
import { problemFeedErrorMessage } from '@/lib/problem-feed-error';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ExplorePage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!db) { setLoading(false); setLoadError('Firebase is not configured.'); return undefined; }
    return onSnapshot(query(collection(db, 'problems'), where('moderationStatus', '==', 'visible'), orderBy('createdAt', 'desc')), snapshot => {
        const communityProblems = snapshot.docs.map(item => {
          const data = item.data();
          const category = CATEGORIES.find(topic => topic.name === data.category) || { id: 0, name: data.category || 'General' };
          return {
            id: item.id,
            slug: item.id,
            title: data.title,
            description: data.description,
            painPoint: data.description,
            currentWorkaround: data.workaround,
            targetAudience: data.audience,
            category,
            author: { displayName: data.authorName },
            urgency: data.priority,
            status: data.status || 'open',
            priorityScore: 0,
            demandScore: 0,
            frequencyScore: 0,
            recencyScore: 0,
            meTooCount: data.meTooCount || 0,
            wantThisCount: data.wantThisCount || 0,
            devInterestCount: data.devInterestCount || 0,
            fundingInterest: data.fundingInterest === true,
            fundingAmount: Number.isFinite(data.fundingAmount) ? data.fundingAmount : null,
            fundingCurrency: typeof data.fundingCurrency === 'string' ? data.fundingCurrency : 'INR',
            commentsCount: data.replyCount || 0,
            createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
            isCommunityPost: true,
          };
        });
        setProblems(communityProblems);
        setLoading(false);
        setLoadError('');
      }, error => { setLoading(false); setLoadError(problemFeedErrorMessage(error)); });
  }, []);

  const latestProblem = problems[0];
  const latestDescription = latestProblem?.description?.trim() || '';

  return (
    <div className="min-h-[100svh] flex flex-col bg-background text-on-surface">
      <ItchHeader />

      <main id="main-content" className="flex-1 pb-12 pt-20 sm:pb-16">
        <div className="explore-page-wrap">
          <header className={`explore-page-hero${!loading && latestProblem ? ' has-latest' : ''}`}>
            <div>
              <h1>Explore problems<br /><em>people want solved.</em></h1>
              <p className="explore-page-intro">Search real experiences, filter by topic, and open a problem to join the conversation.</p>
            </div>
            {!loading && latestProblem && (
              <article className="explore-latest-problem">
                <div className="explore-latest-meta">
                  <span>Recently shared</span>
                  <span>{latestProblem.category.name}</span>
                </div>
                <div>
                  <h2><Link href={`/problems/${latestProblem.slug}`}>{latestProblem.title}</Link></h2>
                  {latestDescription && <p>{latestDescription.length > 132 ? `${latestDescription.slice(0, 132).trimEnd()}…` : latestDescription}</p>}
                </div>
                <Link className="explore-latest-link" href={`/problems/${latestProblem.slug}`}>
                  Read the problem <ArrowRight aria-hidden="true" size={16} />
                </Link>
              </article>
            )}
          </header>

          <div className="explore-preview-label" aria-live="polite"><span>{loading ? 'Loading problems…' : `${problems.length} ${problems.length === 1 ? 'problem' : 'problems'} shared`}</span></div>

          {loadError ? <p role="alert" className="community-local-note">{loadError}</p> : loading ? <p role="status" className="community-local-note">Loading problems…</p> : <ProblemList initialProblems={problems} />}
        </div>
      </main>

      <ItchFooter />
    </div>
  );
}
