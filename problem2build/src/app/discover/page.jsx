'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DiscoverPage() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    if (!db) return;

    return onSnapshot(query(collection(db, 'problems'), orderBy('createdAt', 'desc')), snapshot => {
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
        });

        setProblems(communityProblems);
      }, () => setProblems([]));
  }, []);

  const sorted = [...problems].sort((a, b) => {
    if (a.isCommunityPost !== b.isCommunityPost) return a.isCommunityPost ? -1 : 1;
    if (a.isCommunityPost) return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
    return (b.devInterestCount || 0) - (a.devInterestCount || 0);
  });

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <ItchHeader />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-8">

          {/* Header */}
          <div className="animate-fade-up mb-10">
            <div className="inline-flex items-center gap-1.5 font-mono text-[11px] text-secondary bg-secondary/10 px-3 py-1 rounded-full border border-secondary/15 mb-3">
              <span className="material-symbols-outlined text-[0.95rem]">engineering</span>
              Developer Opportunity Radar
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Unclaimed Market Frictions</h1>
            <p className="text-sm text-tertiary/70 mt-1.5 max-w-xl leading-relaxed">
              Problems shared by the community, with context for builders who want to help.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((p, i) => (
              <div
                key={p.id}
                className="animate-fade-up card-lift rounded-2xl p-5 flex flex-col justify-between gap-4 relative overflow-hidden"
                style={{
                  animationDelay: `${i * 0.06}s`,
                  background: 'rgb(11,16,26)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: 'rgba(0,0,0,0.38) 0px 5px 20px',
                }}
              >
                {/* Top gradient accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary-container/60 via-primary/30 to-transparent" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] px-2.5 py-0.5 rounded-full bg-surface-container-high/80 text-tertiary/70">
                      #{p.category?.name || 'General'}
                    </span>
                    {p.isCommunityPost ? <span className="font-mono text-[10px] text-secondary">NEW</span> : <span className={`font-mono text-xs font-bold ${p.priorityScore >= 80 ? 'text-primary' : p.priorityScore >= 65 ? 'text-amber-400' : 'text-tertiary'}`}>
                      {p.priorityScore}
                    </span>}
                  </div>

                  <Link href={`/problems/${p.slug}`} className="block group">
                    <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug">
                      {p.title}
                    </h3>
                  </Link>

                  <p className="text-[0.8rem] text-tertiary/65 line-clamp-3 leading-relaxed">{p.description}</p>

                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                  <span className="font-mono text-[11px] text-tertiary/50 truncate max-w-[140px]">Posted by {p.author?.displayName || 'Community member'}</span>
                  <Link
                    href={`/problems/${p.slug}`}
                    className="inline-flex items-center gap-1.5 bg-primary-container text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-primary transition-all duration-200 active:scale-95 shadow-[0_2px_10px_rgba(249,115,22,0.25)]"
                  >
                    View
                    <span className="material-symbols-outlined text-[0.95rem]">arrow_forward</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          {sorted.length === 0 && <div className="mt-8 rounded-2xl border border-white/10 bg-surface-container/30 p-8 text-center"><h2 className="text-lg font-bold text-on-surface">No opportunities to explore yet</h2><p className="mt-2 text-sm text-tertiary">Community posts will appear here as people share problems.</p><Link href="/explore" className="mt-4 inline-flex text-sm font-semibold text-primary">Browse problems <span className="material-symbols-outlined ml-1 text-base">arrow_forward</span></Link></div>}
        </div>
      </main>

      <ItchFooter />
    </div>
  );
}
