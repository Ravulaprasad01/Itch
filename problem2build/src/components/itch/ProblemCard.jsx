'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookmarkPlus, Code2, ThumbsUp } from 'lucide-react';

export default function ProblemCard({ problem }) {
  const [signals, setSignals] = useState({ meToo: false, wantThis: false, interested: false });
  const toggleSignal = (signal) => setSignals((current) => ({ ...current, [signal]: !current[signal] }));
  const status = problem.status === 'validating' ? 'Validating' : 'Open';

  return (
    <article className="group rounded-xl border border-white/10 bg-surface-container/25 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-surface-container/45 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-surface-container-high px-2.5 py-1 font-mono text-[10px] text-tertiary">
          {problem.category?.name || 'General'}
        </span>
        <span className={`rounded-md px-2.5 py-1 font-mono text-[10px] ${status === 'Validating' ? 'bg-secondary/10 text-secondary' : 'bg-white/5 text-tertiary'}`}>
          {status}
        </span>
      </div>

      <div>
        <Link href={`/problems/${problem.slug}`} className="group/title inline-block">
          <h2 className="text-lg font-bold leading-snug text-on-surface transition-colors group-hover/title:text-primary sm:text-xl">
            {problem.title}
          </h2>
        </Link>
        <div className="mt-3 space-y-2.5">
          <div className="border-l-2 border-primary/60 pl-3">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-primary">The issue</p>
            <p className="text-xs leading-relaxed text-tertiary/85 line-clamp-2">
              {problem.painPoint || problem.description}
            </p>
          </div>
          {problem.currentWorkaround && (
            <div className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-2 text-xs leading-relaxed text-tertiary/70">
              <span className="font-mono text-[10px] uppercase tracking-wide text-tertiary/50">Current workaround</span>
              <span className="min-w-0 line-clamp-2">{problem.currentWorkaround}</span>
            </div>
          )}
          {problem.targetAudience && (
            <div className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-2 text-[11px] leading-relaxed text-tertiary/60">
              <span className="font-mono uppercase tracking-wide text-tertiary/45">Affects</span>
              <span className="min-w-0 line-clamp-1">{problem.targetAudience}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4">
        <div className="flex flex-wrap items-center gap-2" aria-label="Support signals">
          <button
            type="button"
            aria-pressed={signals.meToo}
            onClick={() => toggleSignal('meToo')}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${signals.meToo ? 'border-primary/35 bg-primary/10 text-primary' : 'border-white/10 bg-surface-container/40 text-on-surface hover:border-primary/30 hover:bg-primary/5'}`}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {signals.meToo ? 'You relate' : 'Me Too'}
          </button>

          <button
            type="button"
            aria-pressed={signals.wantThis}
            onClick={() => toggleSignal('wantThis')}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${signals.wantThis ? 'border-secondary/35 bg-secondary/10 text-secondary' : 'border-white/10 bg-surface-container/40 text-on-surface hover:border-secondary/30 hover:bg-secondary/5'}`}
          >
            <BookmarkPlus className="h-3.5 w-3.5" />
            I Want This
          </button>

          <button
            type="button"
            aria-pressed={signals.interested}
            onClick={() => toggleSignal('interested')}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition ${signals.interested ? 'border-primary/35 bg-primary/10 text-primary' : 'border-white/10 bg-surface-container/40 text-on-surface hover:border-primary/30 hover:bg-primary/5'}`}
          >
            <Code2 className="h-3.5 w-3.5" />
            {signals.interested ? 'Interest noted' : "I'm Interested"}
          </button>
        </div>
      </div>
    </article>
  );
}
