'use client';

import React, { useState } from 'react';
import { Flame } from 'lucide-react';

export default function PriorityScoreBadge({ score, demand = 85, frequency = 70, recency = 80 }) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Score tier color
  const getScoreTheme = (val) => {
    if (val >= 80) {
      return 'text-amber-400 border-amber-500/40 bg-amber-500/10 shadow-[0_0_16px_rgba(245,158,11,0.2)]';
    }
    if (val >= 60) {
      return 'text-violet-300 border-violet-500/40 bg-violet-500/10 shadow-[0_0_16px_rgba(168,85,247,0.2)]';
    }
    return 'text-sky-300 border-sky-500/30 bg-sky-500/10';
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        aria-label={`Priority Score ${score} out of 100`}
        className={`group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-[transform,box-shadow] duration-200 hover:scale-105 active:scale-95 tabular-nums ${getScoreTheme(
          score
        )}`}
      >
        <Flame className="w-3.5 h-3.5 text-accent animate-pulse" />
        <span className="font-extrabold">{score}</span>
        <span className="text-[10px] font-semibold opacity-75 uppercase tracking-wider">Priority</span>
      </button>

      {showTooltip && (
        <div
          role="tooltip"
          className="absolute z-40 bottom-full right-0 mb-2 w-64 p-3.5 bg-surface border border-border-hi rounded-control shadow-popover text-xs space-y-2.5 pointer-events-none animate-fade-up"
        >
          <div className="flex items-center justify-between font-bold text-white border-b border-border pb-2">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-accent" />
              <span>Priority Score</span>
            </span>
            <span className="text-amber-400 font-extrabold tabular-nums">{score}/100</span>
          </div>

          <div className="space-y-2 text-neutral text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-muted">Demand Volume (50%):</span>
              <span className="font-semibold text-white tabular-nums">{demand} pts</span>
            </div>
            <div className="w-full bg-surface-hi h-1 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${demand}%` }} />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted">Frequency of Occurrence (25%):</span>
              <span className="font-semibold text-white tabular-nums">{frequency} pts</span>
            </div>
            <div className="w-full bg-surface-hi h-1 rounded-full overflow-hidden">
              <div className="bg-violet-400 h-full rounded-full" style={{ width: `${frequency}%` }} />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-muted">Recency Activity (25%):</span>
              <span className="font-semibold text-white tabular-nums">{recency} pts</span>
            </div>
            <div className="w-full bg-surface-hi h-1 rounded-full overflow-hidden">
              <div className="bg-sky-400 h-full rounded-full" style={{ width: `${recency}%` }} />
            </div>
          </div>

          <p className="text-[10px] text-muted leading-tight pt-1.5 border-t border-border/60">
            Calculated strictly from verified user signals and time decay. No manual boosting.
          </p>
        </div>
      )}
    </div>
  );
}
