'use client';

import React from 'react';
import Link from 'next/link';

const TRENDING = [
  { rank:'#1', label:'Local macOS Menubar Tools',  delta:'+48%', color:'text-primary',   bg:'bg-primary-container/10'    },
  { rank:'#2', label:'Tax & Bookkeeping Parsing',  delta:'+31%', color:'text-secondary', bg:'bg-secondary/10'             },
  { rank:'#3', label:'Offline-First Notion Alts',  delta:'+19%', color:'text-tertiary',  bg:'bg-surface-container-high'   },
  { rank:'#4', label:'Local LLM PDF Extraction',   delta:'+14%', color:'text-tertiary',  bg:'bg-surface-container-high'   },
];

const RULES = [
  { icon:'block',    text:'No personal attacks. Critiques must target friction only.' },
  { icon:'campaign', text:'Zero promotional spam or masked affiliate links.' },
  { icon:'lock',     text:'No private data or internal specs. Redact proprietary schema.' },
];

const cardStyle = {
  background: 'rgb(11,16,26)',
  border: '1px solid rgba(255,255,255,0.07)',
  boxShadow: 'rgba(0,0,0,0.3) 0px 6px 22px',
};

export default function Sidebar() {
  return (
    <aside className="lg:col-span-4 flex flex-col gap-4">

      {/* CTA */}
      <div
        className="animate-fade-up p-6 rounded-2xl relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(20,27,44,0.95), rgb(11,16,26))',
          border: '1px solid rgba(249,115,22,0.22)',
          boxShadow: 'rgba(249,115,22,0.1) 0px 8px 30px -4px',
        }}
      >
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-container/[0.06] rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-2.5">
          <span className="material-symbols-outlined text-primary text-[1.4rem]">bolt</span>
          <h3 className="text-sm font-bold text-on-surface">Got a problem?</h3>
        </div>
        <p className="text-[0.8rem] text-tertiary/75 mb-5 leading-relaxed">
          Articulate what hurts, gather community conviction, and let hungry developers ship a solution.
        </p>
        <Link
          href="/problems/new"
          className="w-full inline-flex items-center justify-center gap-2 bg-primary-container text-white text-xs font-bold py-2.5 rounded-xl hover:bg-primary transition-all duration-200 active:scale-95 shadow-[0_2px_14px_rgba(249,115,22,0.28)] hover:shadow-[0_4px_20px_rgba(249,115,22,0.42)] hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined text-[1rem]">edit_square</span>
          Post a Problem (5 Left)
        </Link>
      </div>

      {/* Trending */}
      <div className="animate-fade-up delay-100 p-5 rounded-2xl flex flex-col gap-3.5" style={cardStyle}>
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-bold text-on-surface uppercase tracking-wider">Trending Clusters</h4>
          <span className="font-mono text-[10px] text-tertiary/50">7d velocity</span>
        </div>
        <div className="flex flex-col gap-0.5">
          {TRENDING.map(t => (
            <div
              key={t.rank}
              className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-surface-container/70 transition-all duration-200 group cursor-pointer hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-[11px] text-tertiary/50 group-hover:text-primary w-5 transition-colors duration-200">{t.rank}</span>
                <span className="text-[0.8rem] text-on-surface-variant group-hover:text-on-surface transition-colors duration-200 font-medium">{t.label}</span>
              </div>
              <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full font-bold ${t.color} ${t.bg}`}>{t.delta}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rules */}
      <div className="animate-fade-up delay-200 p-5 rounded-2xl flex flex-col gap-3" style={cardStyle}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[1.1rem]">gavel</span>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-on-surface">Community Rules</h4>
        </div>
        <ul className="flex flex-col gap-2.5">
          {RULES.map(r => (
            <li key={r.icon} className="flex items-start gap-2 text-[0.8rem] text-on-surface-variant/80">
              <span className="material-symbols-outlined text-rose-400/80 text-[1rem] shrink-0 mt-0.5">{r.icon}</span>
              {r.text}
            </li>
          ))}
        </ul>
        <button type="button" className="font-mono text-[11px] text-tertiary/50 hover:text-primary transition-colors duration-200 inline-flex items-center gap-1 mt-1">
          Read full protocol
          <span className="material-symbols-outlined text-[0.875rem]">arrow_forward</span>
        </button>
      </div>

      {/* Status chip */}
      <div
        className="animate-fade-up delay-300 px-4 py-2.5 rounded-2xl flex items-center justify-between font-mono text-[11px] text-tertiary/50"
        style={{ background: 'rgba(6,10,20,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
          Feed Telemetry: Normal
        </div>
        <span>v2.4.1</span>
      </div>
    </aside>
  );
}
