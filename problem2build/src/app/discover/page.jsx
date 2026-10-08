'use client';

import React from 'react';
import Link from 'next/link';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';
import { MOCK_PROBLEMS } from '@/lib/mock-data';

export default function DiscoverPage() {
  const sorted = [...MOCK_PROBLEMS].sort((a, b) => b.devInterestCount - a.devInterestCount);

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
              High-conviction problems ranked by verified signals. Find your next build.
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
                    <span className={`font-mono text-xs font-bold ${p.priorityScore >= 80 ? 'text-primary' : p.priorityScore >= 65 ? 'text-amber-400' : 'text-tertiary'}`}>
                      {p.priorityScore}
                    </span>
                  </div>

                  <Link href={`/problems/${p.slug}`} className="block group">
                    <h3 className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug">
                      {p.title}
                    </h3>
                  </Link>

                  <p className="text-[0.8rem] text-tertiary/65 line-clamp-3 leading-relaxed">{p.description}</p>

                  <div
                    className="p-3 rounded-xl flex items-center justify-around font-mono text-xs"
                    style={{ background: 'rgba(6,12,22,0.8)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    {[
                      { v: p.meTooCount,       l:'Me Too',    c:'text-primary'   },
                      { v: p.wantThisCount,    l:'Want This', c:'text-secondary' },
                      { v: p.devInterestCount, l:'Devs',      c:'text-secondary/70' },
                    ].map((m, idx) => (
                      <React.Fragment key={m.l}>
                        {idx > 0 && <div className="w-px h-5 bg-surface-container-high" />}
                        <div className="text-center">
                          <div className={`font-bold ${m.c}`}>{m.v}</div>
                          <div className="text-[10px] text-tertiary/50 mt-0.5">{m.l}</div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                  <span className="font-mono text-[11px] text-tertiary/50 truncate max-w-[140px]">{p.targetAudience}</span>
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
        </div>
      </main>

      <ItchFooter />
    </div>
  );
}
