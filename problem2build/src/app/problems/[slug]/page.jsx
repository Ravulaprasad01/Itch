'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';
import ToastContainer from '@/components/itch/ToastContainer';
import { MOCK_PROBLEMS } from '@/lib/mock-data';

export default function ProblemDetailPage({ params }) {
  const problem = MOCK_PROBLEMS.find(p => p.slug === params.slug) || MOCK_PROBLEMS[0];

  const [toasts,   setToasts]   = useState([]);
  const [meToo,    setMeToo]    = useState({ active: false, count: problem.meTooCount    ?? 84  });
  const [want,     setWant]     = useState({ active: false, count: problem.wantThisCount ?? 112 });
  const [scratch,  setScratch]  = useState(false);
  const [devs,     setDevs]     = useState(problem.devInterestCount ?? 4);
  const [score,    setScore]    = useState(problem.priorityScore    ?? 92);
  const [bookmark, setBookmark] = useState(false);

  const [comments, setComments] = useState([
    { id:'c1', handle:'sara_cpa',   role:'Certified Practitioner', text:'This exact issue hit us twice last year — BoA changed their delimiter mid-quarter without any changelog notice. Entire reconciliation pipeline broke.', ago:'1 day ago', evidence:true,  upvotes:12 },
    { id:'c2', handle:'devMarcus',  role:'Full-Stack Dev',         text:'Starting a spike. Writing a local-first SQLite parser that auto-normalizes column headers via fuzzy matching against a known-schema dictionary.',         ago:'18 hrs ago', evidence:false, upvotes:7  },
    { id:'c3', handle:'elena_fp',   role:'Finance & Tax',          text:"Also affects Xero integrations. Date format varies between MM/DD/YYYY and DD-MM-YYYY depending on which branch portal you use. Absolute nightmare.",     ago:'14 hrs ago', evidence:true,  upvotes:9  },
  ]);
  const [comment, setComment]   = useState('');
  const [evidence, setEvidence] = useState(false);

  const urgency = problem.urgency || 'High';

  const notify = (title, sub, type) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { title, sub, type, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  };

  const toggleMeToo = () => {
    if (!meToo.active) { setMeToo({ active:true,  count:meToo.count+1 }); setScore(s=>Math.min(100,s+1)); notify('Signal Recorded','Updated Priority Score.','score'); }
    else               { setMeToo({ active:false, count:Math.max(0,meToo.count-1) }); setScore(s=>Math.max(0,s-1)); }
  };
  const toggleWant = () => {
    if (!want.active) { setWant({ active:true,  count:want.count+1 }); setScore(s=>Math.min(100,s+1)); notify('Signal Recorded','Updated Priority Score.','score'); }
    else              { setWant({ active:false, count:Math.max(0,want.count-1) }); setScore(s=>Math.max(0,s-1)); }
  };
  const toggleScratch = () => {
    if (!scratch) { setScratch(true);  setDevs(d=>d+1); notify('Developer Interest Logged','You claimed this problem sprint.','scratch'); }
    else          { setScratch(false); setDevs(d=>Math.max(0,d-1)); }
  };
  const addComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setComments([...comments, { id:`c${Date.now()}`, handle:'you', role:'Member', text:comment.trim(), ago:'Just now', evidence, upvotes:0 }]);
    setComment(''); setEvidence(false);
  };

  const scoreColor = score >= 75 ? 'text-primary' : score >= 50 ? 'text-amber-400' : 'text-tertiary';

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface">
      <ItchHeader />

      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 pt-8">

          {/* Ambient glows */}
          <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
            <div className="absolute top-0 left-1/3 w-[600px] h-[500px] bg-primary-container/[0.05] blur-[130px] rounded-full" />
            <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-secondary/[0.04] blur-[120px] rounded-full" />
          </div>

          {/* Breadcrumb */}
          <div className="animate-fade-up flex items-center justify-between mb-6 font-mono text-[11px] text-tertiary/60 border-b border-white/[0.05] pb-4">
            <div className="flex items-center gap-2">
              <Link href="/explore" className="hover:text-on-surface transition-colors flex items-center gap-1 group">
                <span className="material-symbols-outlined text-[0.95rem] group-hover:-translate-x-0.5 transition-transform duration-200">arrow_back</span>
                Explore
              </Link>
              <span className="text-white/20">/</span>
              <span className="text-primary font-semibold">
                {(problem.category?.name || 'SPEC').toUpperCase().replace(/ /g,'-')}-{(problem.id||'0001').replace('p-','').padStart(4,'0')}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-lowest/70 px-3 py-1 rounded-full border border-secondary/15">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inset-0 rounded-full bg-secondary opacity-60" />
                <span className="relative rounded-full h-1.5 w-1.5 bg-secondary" />
              </span>
              <span className="text-secondary text-[10px] font-medium tracking-wide">LIVE</span>
            </div>
          </div>

          {/* Problem Header Card */}
          <section
            className="animate-fade-up delay-100 rounded-2xl p-6 sm:p-8 mb-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(249,115,22,0.04), rgba(11,16,26,0.97))',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: 'rgba(0,0,0,0.5) 0px 12px 40px',
            }}
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-full bg-surface-container-high/70 text-tertiary/70">
                    #{problem.category?.name || 'General'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary/10 text-secondary flex items-center gap-1.5 border border-secondary/15">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                    {problem.status === 'validating' ? 'Validating' : 'Open'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                    urgency==='High' ? 'bg-primary-container/10 text-primary border-primary/15'
                    : urgency==='Med' ? 'bg-amber-500/10 text-amber-400 border-amber-400/15'
                    : 'bg-surface-container text-tertiary border-surface-variant/20'
                  }`}>
                    <span className="material-symbols-outlined text-[0.8rem]">priority_high</span>
                    {urgency}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold text-on-surface tracking-tight leading-snug">
                  {problem.title}
                </h1>

                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-tertiary/60">
                  <div className="flex items-center gap-1.5 bg-surface-container-high/40 px-2.5 py-1 rounded-full border border-white/[0.05]">
                    <div className="w-4 h-4 rounded-full bg-primary-container/20 flex items-center justify-center text-[9px] font-bold text-primary">
                      {(problem.author?.displayName||'A')[0]}
                    </div>
                    <span className="text-primary">@{problem.author?.username || 'member'}</span>
                  </div>
                  <span>·</span>
                  <span>Posted recently</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[0.9rem] text-secondary">public</span>
                    National
                  </span>
                </div>
              </div>

              {/* Action icons */}
              <div className="flex items-center gap-2 self-start shrink-0">
                <button
                  type="button" onClick={() => setBookmark(!bookmark)}
                  className={`p-2 rounded-xl transition-all duration-200 border ${bookmark ? 'bg-primary-container/15 text-primary border-primary/20' : 'text-tertiary/60 hover:text-on-surface bg-surface-container/50 hover:bg-surface-container border-white/[0.06]'}`}
                >
                  <span className="material-symbols-outlined text-[1.15rem]">bookmark</span>
                </button>
                <button type="button" className="p-2 rounded-xl text-tertiary/60 hover:text-on-surface bg-surface-container/50 hover:bg-surface-container border border-white/[0.06] transition-all duration-200">
                  <span className="material-symbols-outlined text-[1.15rem]">share</span>
                </button>
                <button type="button" className="flex items-center gap-1 px-3 py-2 rounded-xl font-mono text-[11px] text-tertiary/60 hover:text-error hover:bg-error-container/15 bg-surface-container/50 border border-white/[0.06] transition-all duration-200">
                  <span className="material-symbols-outlined text-[1rem]">flag</span>
                  Report
                </button>
              </div>
            </div>
          </section>

          {/* 2-col layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

            {/* ── LEFT COLUMN ─── */}
            <div className="lg:col-span-8 flex flex-col gap-5">

              {/* Signal Bar */}
              <div
                className="animate-fade-up delay-150 rounded-2xl p-5 sm:p-6"
                style={{ background: 'rgb(11,16,26)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: 'rgba(0,0,0,0.4) 0px 8px 28px' }}
              >
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  {/* Me Too / I Want This */}
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <button
                      type="button" onClick={toggleMeToo}
                      className={`group flex flex-col gap-2 p-4 rounded-2xl text-left transition-all duration-200 ${
                        meToo.active
                          ? 'bg-primary-container/15 border border-primary-container/40'
                          : 'bg-surface-container/60 hover:bg-surface-container border border-white/[0.06] hover:border-primary/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                          <span className="material-symbols-outlined text-[1.1rem] group-hover:scale-110 transition-transform duration-200">sync_problem</span>
                          Me Too
                        </span>
                        <span className="font-mono text-sm font-bold text-on-surface tabular-nums">{meToo.count}</span>
                      </div>
                      <p className="text-[0.75rem] text-tertiary/70 group-hover:text-tertiary transition-colors">I have this exact problem</p>
                      <div className="w-full h-1 rounded-full bg-surface-container-lowest overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-500"
                          style={{ width:`${Math.min(100,(meToo.count/(meToo.count+want.count))*100)}%` }}
                        />
                      </div>
                    </button>

                    <button
                      type="button" onClick={toggleWant}
                      className={`group flex flex-col gap-2 p-4 rounded-2xl text-left transition-all duration-200 ${
                        want.active
                          ? 'bg-primary-container/25 border border-primary'
                          : 'bg-primary-container/10 hover:bg-primary-container/20 border border-primary-container/30 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-primary">
                          <span className="material-symbols-outlined text-primary-container text-[1.1rem] group-hover:scale-110 transition-transform duration-200">bolt</span>
                          I Want This
                        </span>
                        <span className="font-mono text-sm font-bold text-primary tabular-nums">{want.count}</span>
                      </div>
                      <p className="text-[0.75rem] text-on-surface/80 font-medium">I would use a solution immediately</p>
                      <div className="w-full h-1 rounded-full bg-surface-container-lowest overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-container to-primary rounded-full shadow-[0_0_8px_rgba(249,115,22,0.5)] transition-all duration-500"
                          style={{ width:`${Math.min(100,(want.count/(meToo.count+want.count))*100)}%` }}
                        />
                      </div>
                    </button>
                  </div>

                  {/* Score */}
                  <div className="flex flex-col justify-between p-4 rounded-2xl sm:w-40 shrink-0" style={{ background:'rgba(6,12,22,0.7)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-tertiary/50 uppercase">Score</span>
                      <span className="material-symbols-outlined text-tertiary/40 text-[1rem] cursor-help" title="Calculated from signals, frequency & recency">help</span>
                    </div>
                    <div className="flex items-baseline gap-1 my-2">
                      <span className={`font-mono text-4xl font-bold tabular-nums num-pop ${scoreColor}`}>{score}</span>
                      <span className="font-mono text-xs text-tertiary/40">/100</span>
                    </div>
                    <div className="flex items-center gap-1 font-mono text-[10px] text-secondary/80 bg-secondary/8 px-2 py-0.5 rounded-lg">
                      <span className="material-symbols-outlined text-[0.85rem]">trending_up</span>
                      Top 4%
                    </div>
                  </div>
                </div>

                {/* Scratch CTA */}
                <div className="mt-4 pt-4 border-t border-white/[0.05] flex items-center justify-between gap-3 flex-wrap">
                  <span className="font-mono text-[11px] text-tertiary/60 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[0.9rem] text-secondary">engineering</span>
                    <span className="font-bold text-secondary/80 tabular-nums">{devs}</span> developers interested
                  </span>
                  <button
                    type="button" onClick={toggleScratch}
                    className={`action-btn btn-scratch inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border border-transparent ${
                      scratch ? 'btn-active-scratch' : 'bg-primary-container text-white hover:bg-primary shadow-[0_2px_16px_rgba(249,115,22,0.32)]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[1.1rem]">{scratch ? 'check_circle' : 'construction'}</span>
                    {scratch ? 'Claimed — In Progress!' : "I'm a Dev — Scratch This Itch"}
                  </button>
                </div>
              </div>

              {/* Problem Spec */}
              <article
                className="animate-fade-up delay-200 rounded-2xl p-6 sm:p-7 space-y-5"
                style={{ background:'rgb(11,16,26)', border:'1px solid rgba(255,255,255,0.07)', boxShadow:'rgba(0,0,0,0.4) 0px 8px 28px' }}
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
                  <h2 className="text-base font-bold text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[1.3rem]">subject</span>
                    Problem Specification
                  </h2>
                  <span className="font-mono text-[10px] text-tertiary/50 bg-surface-container px-2 py-0.5 rounded-lg border border-white/[0.05]">PUBLIC SPEC</span>
                </div>

                <p className="text-[0.875rem] text-on-surface/90 leading-relaxed">{problem.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { icon:'groups',   c:'text-primary',           label:'Affected Audience', v: problem.targetAudience },
                    { icon:'calendar_month', c:'text-secondary',   label:'Frequency',          v: 'Monthly close and quarterly filing peaks — high-pressure acute periods.' },
                    { icon:'map',      c:'text-tertiary/80',        label:'Location Scope',     v: 'National — variances across major and regional banking institutions.' },
                    { icon:'build',    c:'text-primary-container',  label:'Current Workaround', v: problem.currentWorkaround },
                  ].map(s => (
                    <div key={s.label} className="p-4 rounded-xl space-y-2 hover:border-white/[0.1] transition-all duration-200" style={{ background:'rgba(6,12,22,0.6)', border:'1px solid rgba(255,255,255,0.05)' }}>
                      <div className={`flex items-center gap-2 font-bold text-xs ${s.c}`}>
                        <span className="material-symbols-outlined text-[1.05rem]">{s.icon}</span>
                        <span className="text-on-surface">{s.label}</span>
                      </div>
                      <p className="text-[0.8rem] text-on-surface-variant/80 leading-relaxed">{s.v}</p>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl" style={{ background:'rgba(6,12,22,0.85)', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex items-center justify-between mb-2 font-mono text-[11px]">
                    <span className="flex items-center gap-1.5 text-on-surface/90">
                      <span className="material-symbols-outlined text-primary text-[1rem]">terminal</span>
                      FRICTION_IMPACT.log
                    </span>
                    <span className="text-error/80 bg-error-container/15 px-2 py-0.5 rounded-lg border border-error/20 flex items-center gap-1 text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                      OPERATIONAL BLOCKER
                    </span>
                  </div>
                  <p className="font-mono text-[0.8rem] text-on-surface-variant/75 leading-relaxed">&gt; {problem.painPoint}</p>
                </div>
              </article>

              {/* Community Discussion */}
              <section
                className="animate-fade-up delay-300 rounded-2xl p-6 sm:p-7 space-y-5"
                style={{ background:'rgb(11,16,26)', border:'1px solid rgba(255,255,255,0.07)', boxShadow:'rgba(0,0,0,0.4) 0px 8px 28px' }}
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
                  <div>
                    <h3 className="text-base font-bold text-on-surface">Community Discussion</h3>
                    <p className="text-[0.8rem] text-tertiary/60 mt-0.5">Real-world friction submitted by practitioners.</p>
                  </div>
                  <span className="font-mono text-[11px] text-tertiary/50 bg-surface-container px-3 py-1 rounded-full border border-white/[0.05]">{comments.length}</span>
                </div>

                {/* Notice */}
                <div className="flex items-center gap-2 p-3 rounded-xl text-xs" style={{ background:'rgba(6,12,22,0.6)', border:'1px solid rgba(255,255,255,0.05)' }}>
                  <span className="material-symbols-outlined text-primary/70 text-[1.1rem] shrink-0">info</span>
                  <span className="text-tertiary/70"><strong className="text-on-surface/80">Rule:</strong> Clarify the problem context only. No ads or self-promotion.</span>
                </div>

                {/* Input */}
                <form onSubmit={addComment} className="space-y-2">
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Add insight, describe your workaround, or ask a clarifying question…"
                    className="w-full rounded-xl p-4 text-[0.8rem] text-on-surface placeholder:text-tertiary/35 focus:outline-none focus:ring-1 focus:ring-primary-container/50 resize-none border border-white/[0.06] transition-all duration-200"
                    style={{ background:'rgba(6,12,22,0.85)' }}
                  />
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <label className="flex items-center gap-2 text-xs text-on-surface-variant/70 cursor-pointer select-none">
                      <input type="checkbox" checked={evidence} onChange={e => setEvidence(e.target.checked)} className="accent-primary-container rounded" />
                      Tag as first-party evidence
                    </label>
                    <button
                      type="submit" disabled={!comment.trim()}
                      className="px-4 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-xl hover:bg-primary-fixed transition-all duration-200 disabled:opacity-30 active:scale-95"
                    >
                      Post Insight
                    </button>
                  </div>
                </form>

                {/* Comments */}
                <div className="space-y-3">
                  {comments.map(c => (
                    <div
                      key={c.id}
                      className="p-4 rounded-xl space-y-2 transition-all duration-200 hover:border-white/[0.1]"
                      style={{
                        background: c.evidence ? 'rgba(78,222,163,0.04)' : 'rgba(6,12,22,0.55)',
                        border: c.evidence ? '1px solid rgba(78,222,163,0.18)' : '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-primary border border-white/[0.07]">
                            {c.handle[0].toUpperCase()}
                          </div>
                          <span className="text-xs font-bold text-on-surface">@{c.handle}</span>
                          {c.role && (
                            <span className="hidden sm:inline font-mono text-[10px] px-1.5 py-0.5 rounded-full bg-secondary/10 text-secondary/80 border border-secondary/15">{c.role}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {c.evidence && (
                            <span className="font-mono text-[10px] text-secondary/80 bg-secondary/8 px-2 py-0.5 rounded-full border border-secondary/20">Evidence</span>
                          )}
                          <span className="font-mono text-[11px] text-tertiary/45">{c.ago}</span>
                        </div>
                      </div>
                      <p className="text-[0.8rem] text-on-surface-variant/75 leading-relaxed">{c.text}</p>
                      {c.upvotes > 0 && (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-tertiary/45 pt-0.5">
                          <span className="material-symbols-outlined text-[0.8rem]">thumb_up</span>
                          {c.upvotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ── RIGHT SIDEBAR ─── */}
            <aside className="lg:col-span-4 flex flex-col gap-4 lg:sticky lg:top-24">

              {/* Build CTA */}
              <div
                className="animate-fade-up delay-100 p-5 rounded-2xl relative overflow-hidden"
                style={{ background:'linear-gradient(145deg, rgba(20,27,44,0.95), rgb(11,16,26))', border:'1px solid rgba(249,115,22,0.22)', boxShadow:'rgba(249,115,22,0.08) 0px 8px 28px -4px' }}
              >
                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-container/[0.06] rounded-full blur-2xl pointer-events-none" />
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary text-[1.3rem]">code</span>
                  <h3 className="text-sm font-bold text-on-surface">Build this?</h3>
                </div>
                <p className="text-[0.8rem] text-tertiary/70 mb-4 leading-relaxed">
                  {devs} developer{devs !== 1 ? 's' : ''} already interested. Claim the sprint and connect with users ready to test.
                </p>
                <button
                  type="button" onClick={toggleScratch}
                  className={`w-full inline-flex items-center justify-center gap-2 text-xs font-bold py-2.5 rounded-xl transition-all duration-200 active:scale-95 ${
                    scratch ? 'bg-secondary-container text-white' : 'bg-primary-container text-white hover:bg-primary shadow-[0_2px_14px_rgba(249,115,22,0.28)]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[1rem]">{scratch ? 'check_circle' : 'construction'}</span>
                  {scratch ? 'Claimed!' : 'Scratch This Itch'}
                </button>
              </div>

              {/* Score breakdown */}
              <div className="animate-fade-up delay-150 p-5 rounded-2xl flex flex-col gap-4" style={{ background:'rgb(11,16,26)', border:'1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[1.1rem]">query_stats</span>
                    <h4 className="text-[11px] font-bold text-on-surface uppercase tracking-wider">Signal Telemetry</h4>
                  </div>
                  <span className="font-mono text-[10px] text-tertiary/40">V2.4</span>
                </div>
                {[
                  { label:'DEMAND',    value: problem.demandScore    ?? 94, color:'text-primary',   bar:'bg-primary-container'  },
                  { label:'FREQUENCY', value: problem.frequencyScore ?? 88, color:'text-amber-400', bar:'bg-amber-500'           },
                  { label:'RECENCY',   value: problem.recencyScore   ?? 92, color:'text-secondary', bar:'bg-secondary'          },
                ].map(m => (
                  <div key={m.label} className="space-y-1">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="text-tertiary/50">{m.label}</span>
                      <span className={`font-bold ${m.color}`}>{m.value}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-surface-container-lowest overflow-hidden">
                      <div className={`h-full rounded-full ${m.bar} transition-all duration-700`} style={{ width:`${m.value}%` }} />
                    </div>
                  </div>
                ))}
                <p className="text-[0.75rem] text-tertiary/55 leading-relaxed border-t border-white/[0.05] pt-3">
                  Score balances recurring pain, specificity, and builder interest density — no arbitrary upvotes.
                </p>
              </div>

              {/* Related */}
              {MOCK_PROBLEMS.filter(p => p.id !== problem.id && p.category?.id === problem.category?.id).length > 0 && (
                <div className="animate-fade-up delay-200 p-5 rounded-2xl flex flex-col gap-3" style={{ background:'rgb(11,16,26)', border:'1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[1.1rem]">radar</span>
                    <h4 className="text-[11px] font-bold text-on-surface uppercase tracking-wider">Related</h4>
                  </div>
                  {MOCK_PROBLEMS.filter(p => p.id !== problem.id && p.category?.id === problem.category?.id).slice(0,2).map(rp => (
                    <Link
                      key={rp.id} href={`/problems/${rp.slug}`}
                      className="p-3 rounded-xl border border-white/[0.05] hover:border-primary/20 hover:bg-surface-container/60 transition-all duration-200 group block"
                    >
                      <p className="text-[0.8rem] text-on-surface-variant/80 group-hover:text-on-surface line-clamp-2 mb-2 transition-colors">{rp.title}</p>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-tertiary/45">
                        <span>{rp.meTooCount} Me Too</span>
                        <span>·</span>
                        <span className="text-primary/70 font-bold">{rp.priorityScore}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} />
      <ItchFooter />
    </div>
  );
}
