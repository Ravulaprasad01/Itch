'use client';

import { useEffect, useState } from 'react';
import ItchHeader from '@/components/itch/ItchHeader';
import ProblemList from '@/components/itch/ProblemList';
import ItchFooter from '@/components/itch/ItchFooter';
import ExploreStickyNotes from '@/components/itch/ExploreStickyNotes';
import { CATEGORIES } from '@/lib/mock-data';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function ExplorePage() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!db) { setLoading(false); setLoadError(true); return undefined; }
    return onSnapshot(query(collection(db, 'problems'), orderBy('createdAt', 'desc')), snapshot => {
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
            commentsCount: data.replyCount || 0,
            createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
            isCommunityPost: true,
          };
        });
        setProblems(communityProblems);
        setLoading(false);
        setLoadError(false);
      }, () => { setLoading(false); setLoadError(true); });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <ItchHeader />

      <main className="flex-1 pb-12 pt-20 sm:pb-16">
        <div className="explore-page-wrap">
          <header className="explore-page-hero">
            <div>
              <p className="explore-page-kicker"><span /> THE PROBLEM BOARD</p>
              <h1>Find a problem<br /><em>that feels familiar.</em></h1>
              <p className="explore-page-intro">The workarounds, little frustrations, and “why is this still hard?” moments. Start anywhere.</p>
            </div>
            <ExploreStickyNotes />
          </header>

          <div className="explore-preview-label"><span>{loading ? 'LOADING COMMUNITY PROBLEMS' : `${problems.length} COMMUNITY ${problems.length === 1 ? 'PROBLEM' : 'PROBLEMS'}`}</span><span>Browse at your own pace <i>↘</i></span></div>

          {loadError ? <p role="status" className="community-local-note">Could not load problems. Check your connection and try again.</p> : loading ? <p role="status" className="community-local-note">Loading problems…</p> : <ProblemList initialProblems={problems} />}
        </div>
      </main>

      <ItchFooter />
    </div>
  );
}
