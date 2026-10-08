'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function VerificationBanner() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div
      className="animate-fade-up mb-5 rounded-2xl px-5 py-3 relative overflow-hidden"
      style={{
        background: 'linear-gradient(120deg, rgba(78,222,163,0.05), rgba(11,16,26,0.9))',
        border: '1px solid rgba(78,222,163,0.18)',
      }}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-secondary text-[1.1rem] shrink-0">verified</span>
          <p className="text-xs text-on-surface">
            <span className="font-bold text-secondary">Account Verified.</span>{' '}
            5 posts remaining today.{' '}
            <span className="text-tertiary/70">Rule #1: Describe friction, not the solution.</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10px] text-primary bg-surface-container px-2.5 py-0.5 rounded-full border border-white/[0.06]">
            Tier 1 Contributor
          </span>
          <button
            type="button" onClick={() => setVisible(false)}
            className="text-tertiary/50 hover:text-on-surface transition-colors p-0.5 hover:scale-110 duration-200"
            aria-label="Dismiss"
          >
            <span className="material-symbols-outlined text-[1rem]">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
