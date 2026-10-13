'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowDownUp, ArrowRight, Search, X } from 'lucide-react';
import ProblemCard from './ProblemCard';
import { CATEGORIES } from '@/lib/mock-data';

export default function ProblemList({ initialProblems = [] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('recent');

  const categoryCounts = useMemo(() => initialProblems.reduce((counts, problem) => {
    const name = problem.category?.name || 'General';
    counts[name] = (counts[name] || 0) + 1;
    return counts;
  }, {}), [initialProblems]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    const results = initialProblems.filter((problem) => {
      const matchesCategory = category === 'All' || problem.category?.name === category;
      const searchableFields = [problem.title, problem.description, problem.painPoint, problem.currentWorkaround, problem.targetAudience, problem.category?.name];
      return matchesCategory && (!search || searchableFields.some(field => String(field || '').toLowerCase().includes(search)));
    });
    return results.sort((a, b) => {
      if (sort === 'me-too') return (b.meTooCount || 0) - (a.meTooCount || 0);
      if (sort === 'want') return (b.wantThisCount || 0) - (a.wantThisCount || 0);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [initialProblems, query, category, sort]);

  return <div className="explore-browser">
    <div className="explore-tools">
      <label className="explore-search">
        <Search size={17} aria-hidden="true" />
        <span className="sr-only">Search problems</span>
        <input type="search" placeholder="Search a frustration, workaround, or group…" value={query} onChange={event => setQuery(event.target.value)} />
        {query && <button type="button" onClick={() => setQuery('')} aria-label="Clear search"><X size={15} /></button>}
      </label>
      <label className="explore-sort">
        <ArrowDownUp size={15} aria-hidden="true" />
        <span className="sr-only">Sort problems</span>
        <select value={sort} onChange={event => setSort(event.target.value)}>
          <option value="recent">Recently added</option><option value="me-too">Most relatable</option><option value="want">Most wanted</option>
        </select>
      </label>
    </div>

    <div className="explore-topics" role="group" aria-label="Filter by topic">
      <button type="button" aria-pressed={category === 'All'} onClick={() => setCategory('All')}>Everything <span>{initialProblems.length}</span></button>
      {CATEGORIES.map(topic => <button key={topic.id} type="button" aria-pressed={category === topic.name} onClick={() => setCategory(topic.name)}>{topic.name}<span>{categoryCounts[topic.name] || 0}</span></button>)}
    </div>

    <div className="explore-results-heading">
      <p aria-live="polite"><strong>{filtered.length}</strong> {filtered.length === 1 ? 'problem' : 'problems'} {category !== 'All' ? `in ${category}` : 'to look through'}</p>
      <Link href="/community">Find your people <ArrowRight size={15} /></Link>
    </div>

    {filtered.length ? <div className="explore-problem-list">
      {filtered.map((problem, index) => <div key={problem.id} className="explore-card-enter" style={{ '--card-delay': `${Math.min(index * 55, 275)}ms` }}><ProblemCard problem={problem} /></div>)}
    </div> : <div className="explore-empty">
      <span className="explore-empty-mark">?</span><h2>{initialProblems.length === 0 ? 'No problems have been posted yet.' : 'Nothing here by that name.'}</h2><p>{initialProblems.length === 0 ? 'Be the first to share a problem with the community.' : 'Try a broader search or choose another topic.'}</p>
      {initialProblems.length === 0 ? <Link href="/problems/new">Post the first problem <ArrowRight size={15}/></Link> : <button type="button" onClick={() => { setQuery(''); setCategory('All'); }}>Clear filters</button>}
    </div>}
  </div>;
}
