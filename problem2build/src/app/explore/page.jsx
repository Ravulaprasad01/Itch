'use client';

import React from 'react';
import ItchHeader from '@/components/itch/ItchHeader';
import ProblemList from '@/components/itch/ProblemList';
import ItchFooter from '@/components/itch/ItchFooter';
import { MOCK_PROBLEMS } from '@/lib/mock-data';

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <ItchHeader />

      <main className="flex-1 pb-12 pt-20 sm:pb-16">
        <div className="mx-auto max-w-[1080px] px-5 pt-8 sm:px-8">
          <div className="animate-fade-up mb-8">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-primary">Problem discovery</p>
            <h1 className="text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">Explore problems</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-tertiary">
              Understand the issue, current workaround, and who is affected before deciding what to support or build.
            </p>
          </div>

          <ProblemList initialProblems={MOCK_PROBLEMS} />
        </div>
      </main>

      <ItchFooter />
    </div>
  );
}
