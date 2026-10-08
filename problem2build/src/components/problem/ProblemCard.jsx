'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowUpRight, AlertTriangle, Wrench, Users } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import PriorityScoreBadge from '@/components/problem/PriorityScoreBadge';
import SignalButtons from '@/components/problem/SignalButtons';

export default function ProblemCard({ problem }) {
  if (!problem) return null;

  return (
    <article className="group relative bg-surface hover:bg-surface-hi border border-border hover:border-border-hi rounded-card p-5 sm:p-6 transition-[transform,background-color,border-color,box-shadow] duration-250 shadow-card hover:shadow-card-hover flex flex-col justify-between gap-5">
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 flex-wrap">
          <Badge status={problem.status} />
          {problem.category && (
            <Badge category={problem.category.name} />
          )}
          <span className="text-xs text-muted">
            Reported by <span className="text-white font-medium">{problem.author?.displayName || 'Anonymous'}</span>
          </span>
        </div>

        {/* Priority Score badge */}
        <PriorityScoreBadge
          score={problem.priorityScore}
          demand={problem.demandScore}
          frequency={problem.frequencyScore}
          recency={problem.recencyScore}
        />
      </div>

      {/* Main Content Area */}
      <div className="space-y-3.5">
        <Link href={`/problems/${problem.slug}`} className="block group-hover:text-white">
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-snug flex items-start justify-between gap-2.5">
            <span className="group-hover:text-accent-hi transition-colors duration-150">{problem.title}</span>
            <div className="p-1 rounded-control bg-surface-raised group-hover:bg-accent/20 group-hover:text-accent text-muted transition-colors shrink-0 mt-0.5">
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </h2>
        </Link>

        {/* Problem summary */}
        <p className="text-sm text-neutral line-clamp-2 leading-relaxed">
          {problem.description}
        </p>

        {/* Quantified Pain Point Box (Concentric inner radius rounded-control) */}
        {problem.painPoint && (
          <div className="bg-bg/80 border border-amber-500/20 rounded-control p-3.5 text-xs flex items-start gap-3 text-neutral">
            <div className="p-1 rounded bg-amber-500/15 text-amber-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-bold text-white mr-1.5">Cost & Impact:</span>
              <span className="text-neutral/95 leading-relaxed">{problem.painPoint}</span>
            </div>
          </div>
        )}

        {/* Target Audience & Workaround Badges */}
        <div className="flex items-center gap-4 text-xs text-muted pt-1 flex-wrap">
          {problem.targetAudience && (
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-muted" />
              <span>Target: <strong className="font-semibold text-white">{problem.targetAudience}</strong></span>
            </div>
          )}
          {problem.currentWorkaround && (
            <div className="flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-muted" />
              <span>Workaround: <span className="italic text-neutral truncate max-w-[220px]">{problem.currentWorkaround}</span></span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-4 border-t border-border/80 flex items-center justify-between gap-3 flex-wrap">
        <SignalButtons
          problemId={problem.id}
          meTooInitial={problem.meTooCount}
          wantThisInitial={problem.wantThisCount}
          devInterestInitial={problem.devInterestCount}
        />

        <Link
          href={`/problems/${problem.slug}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted hover:text-white transition-colors duration-150 min-h-[44px] px-3 rounded-control hover:bg-surface-raised"
        >
          <MessageSquare className="w-4 h-4 text-accent" />
          <span className="tabular-nums font-bold text-white">{problem.commentsCount || 0}</span>
          <span>evidence replies</span>
        </Link>
      </div>
    </article>
  );
}
