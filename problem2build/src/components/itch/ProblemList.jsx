'use client';

import React, { useState, useMemo } from 'react';
import ProblemCard from './ProblemCard';
import Link from 'next/link';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES } from '@/lib/mock-data';

export default function ProblemList({ initialProblems = [] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return initialProblems.filter((problem) => {
      const matchesCategory = category === 'All' || problem.category?.name === category;
      const searchableFields = [
        problem.title,
        problem.description,
        problem.painPoint,
        problem.currentWorkaround,
        problem.targetAudience,
        problem.category?.name,
      ];
      const matchesQuery = !search || searchableFields.some((field) => String(field || '').toLowerCase().includes(search));

      return matchesCategory && matchesQuery;
    });
  }, [initialProblems, query, category]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">Search problems</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-tertiary/50" />
          <input
            type="search"
            placeholder="Search issues, workarounds, or people affected"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded-lg border border-white/10 bg-surface-container/40 py-3 pl-10 pr-10 text-sm text-on-surface outline-none transition placeholder:text-tertiary/45 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-tertiary transition hover:text-on-surface">
              <X className="h-4 w-4" />
            </button>
          )}
        </label>

        <label className="relative flex shrink-0 items-center">
          <SlidersHorizontal className="pointer-events-none absolute left-3 h-4 w-4 text-tertiary/55" />
          <span className="sr-only">Filter by category</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full appearance-none rounded-lg border border-white/10 bg-surface-container/40 py-3 pl-9 pr-9 text-sm text-on-surface outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15 sm:w-56"
          >
            <option value="All">All categories</option>
            {CATEGORIES.map(({ name }) => <option key={name} value={name}>{name}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-tertiary/55" />
        </label>
      </div>

      <p aria-live="polite" className="text-xs text-tertiary/65">
        {filtered.length} {filtered.length === 1 ? 'problem' : 'problems'}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-on-surface">No problems found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-tertiary">
            Try another keyword or category, or share a problem that is missing.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => { setQuery(''); setCategory('All'); }} className="rounded-lg border border-white/10 px-4 py-2 text-sm text-on-surface transition hover:bg-white/5">
              Clear filters
            </button>
            <Link href="/problems/new" className="rounded-lg bg-primary-container px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary">
              Post a problem
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((p, i) => (
            <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i * 0.04, 0.24)}s` }}>
              <ProblemCard problem={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
