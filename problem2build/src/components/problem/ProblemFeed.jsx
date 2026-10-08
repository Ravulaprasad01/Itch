'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Flame, TrendingUp, Clock, Filter, Plus } from 'lucide-react';
import ProblemCard from '@/components/problem/ProblemCard';
import { CATEGORIES } from '@/lib/mock-data';

export default function ProblemFeed({ initialProblems = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('priority'); // 'priority' | 'validated' | 'newest'

  // Filter & Sort logic
  const filteredProblems = useMemo(() => {
    return initialProblems
      .filter((p) => {
        const matchesCategory =
          selectedCategory === 'all' || p.category?.slug === selectedCategory;
        const matchesSearch =
          searchQuery.trim() === '' ||
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.painPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.targetAudience.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          return b.priorityScore - a.priorityScore;
        }
        if (sortBy === 'validated') {
          return (b.meTooCount + b.wantThisCount) - (a.meTooCount + a.wantThisCount);
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [initialProblems, searchQuery, selectedCategory, sortBy]);

  return (
    <section className="space-y-6">
      {/* Control Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-surface border border-border p-3.5 rounded-card shadow-card">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search problems by keyword, pain point, or audience..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-hi text-white placeholder-muted pl-10 pr-4 py-2.5 rounded-control text-sm border border-border focus:border-accent focus:outline-none transition-colors duration-150"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 bg-surface-hi p-1.5 rounded-control border border-border shrink-0">
          <button
            type="button"
            onClick={() => setSortBy('priority')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-inner text-xs font-bold transition-[background-color,color] duration-150 ${
              sortBy === 'priority'
                ? 'bg-accent text-bg shadow-sm'
                : 'text-neutral hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Priority Score</span>
          </button>

          <button
            type="button"
            onClick={() => setSortBy('validated')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-inner text-xs font-bold transition-[background-color,color] duration-150 ${
              sortBy === 'validated'
                ? 'bg-accent text-bg shadow-sm'
                : 'text-neutral hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Demand</span>
          </button>

          <button
            type="button"
            onClick={() => setSortBy('newest')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[38px] rounded-inner text-xs font-bold transition-[background-color,color] duration-150 ${
              sortBy === 'newest'
                ? 'bg-accent text-bg shadow-sm'
                : 'text-neutral hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Newest</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 min-h-[38px] rounded-full text-xs font-bold whitespace-nowrap border transition-[background-color,border-color,color] duration-150 ${
            selectedCategory === 'all'
              ? 'bg-accent text-bg border-accent shadow-glow-accent'
              : 'bg-surface hover:bg-surface-hi text-neutral border-border hover:border-border-hi'
          }`}
        >
          All Domains ({initialProblems.length})
        </button>

        {CATEGORIES.map((cat) => {
          const count = initialProblems.filter((p) => p.categoryId === cat.id).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-3.5 py-1.5 min-h-[38px] rounded-full text-xs font-semibold whitespace-nowrap border transition-[background-color,border-color,color] duration-150 ${
                selectedCategory === cat.slug
                  ? 'bg-accent text-bg font-bold border-accent shadow-glow-accent'
                  : 'bg-surface hover:bg-surface-hi text-neutral border-border hover:border-border-hi'
              }`}
            >
              {cat.name} {count > 0 && <span className="opacity-75 tabular-nums">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {filteredProblems.length === 0 ? (
          <div className="text-center py-16 bg-surface border border-dashed border-border rounded-card p-6 space-y-3">
            <Filter className="w-8 h-8 text-muted mx-auto" />
            <h3 className="text-base font-bold text-white">
              No matching problems yet.
            </h3>
            <p className="text-xs text-muted max-w-sm mx-auto">
              Try another keyword or browse all problems to discover market opportunities.
            </p>
            <div className="pt-2">
              <Link
                href="/problems/new"
                className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hi text-bg px-4 py-2 rounded-control text-xs font-bold shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Post a Problem</span>
              </Link>
            </div>
          </div>
        ) : (
          filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))
        )}
      </div>
    </section>
  );
}
