'use client';

import React, { useState } from 'react';
import { Check, User, Sparkles, Code2 } from 'lucide-react';

export default function SignalButtons({
  meTooInitial = 0,
  wantThisInitial = 0,
  devInterestInitial = 0,
  problemId,
}) {
  const [meToo, setMeToo] = useState({
    active: false,
    count: meTooInitial,
    ticking: false,
  });

  const [wantThis, setWantThis] = useState({
    active: false,
    count: wantThisInitial,
    ticking: false,
  });

  const [devInterest, setDevInterest] = useState({
    active: false,
    count: devInterestInitial,
    ticking: false,
  });

  const handleToggleMeToo = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setMeToo((prev) => ({
      active: !prev.active,
      count: prev.active ? prev.count - 1 : prev.count + 1,
      ticking: true,
    }));
    setTimeout(() => {
      setMeToo((p) => ({ ...p, ticking: false }));
    }, 160);
  };

  const handleToggleWantThis = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWantThis((prev) => ({
      active: !prev.active,
      count: prev.active ? prev.count - 1 : prev.count + 1,
      ticking: true,
    }));
    setTimeout(() => {
      setWantThis((p) => ({ ...p, ticking: false }));
    }, 160);
  };

  const handleToggleDevInterest = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDevInterest((prev) => ({
      active: !prev.active,
      count: prev.active ? prev.count - 1 : prev.count + 1,
      ticking: true,
    }));
    setTimeout(() => {
      setDevInterest((p) => ({ ...p, ticking: false }));
    }, 160);
  };

  return (
    <div className="flex flex-wrap items-center gap-2.5 pt-1">
      {/* Me Too Button */}
      <button
        type="button"
        onClick={handleToggleMeToo}
        title={meToo.active ? "You're counted as someone who faces this problem." : "I personally experience this problem"}
        aria-label={meToo.active ? "Remove Me Too signal" : "Add Me Too signal"}
        className={`group relative inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-full text-xs font-semibold border transition-[transform,background-color,border-color,box-shadow] duration-200 active:scale-95 ${
          meToo.active
            ? 'bg-sky-500/20 text-sky-300 border-sky-400/60 shadow-[0_0_16px_rgba(56,189,248,0.25)]'
            : 'bg-surface hover:bg-surface-hi text-neutral hover:text-white border-border hover:border-sky-500/40'
        }`}
      >
        {meToo.active ? (
          <Check className="w-3.5 h-3.5 text-sky-400 stroke-[2.5]" />
        ) : (
          <User className="w-3.5 h-3.5 text-sky-400/80 transition-transform duration-200 group-hover:scale-110" />
        )}
        <span>{meToo.active ? 'Me Too' : 'Me Too'}</span>
        <span
          className={`font-bold tabular-nums px-2 py-0.5 rounded-full text-[11px] ${
            meToo.ticking ? 'animate-count-tick' : ''
          } ${
            meToo.active
              ? 'bg-sky-500/30 text-white'
              : 'bg-surface-raised text-muted group-hover:text-white'
          }`}
        >
          {meToo.count}
        </span>
      </button>

      {/* I Want This Button */}
      <button
        type="button"
        onClick={handleToggleWantThis}
        title={wantThis.active ? "You're saying you would use a useful solution." : "I would use a useful solution"}
        aria-label={wantThis.active ? "Remove I Want This signal" : "Add I Want This signal"}
        className={`group relative inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-full text-xs font-semibold border transition-[transform,background-color,border-color,box-shadow] duration-200 active:scale-95 ${
          wantThis.active
            ? 'bg-rose-500/20 text-rose-300 border-rose-400/60 shadow-[0_0_16px_rgba(244,63,94,0.25)]'
            : 'bg-surface hover:bg-surface-hi text-neutral hover:text-white border-border hover:border-rose-500/40'
        }`}
      >
        {wantThis.active ? (
          <Check className="w-3.5 h-3.5 text-rose-400 stroke-[2.5]" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-rose-400/80 transition-transform duration-200 group-hover:scale-110" />
        )}
        <span>{wantThis.active ? 'I Want This' : 'I Want This'}</span>
        <span
          className={`font-bold tabular-nums px-2 py-0.5 rounded-full text-[11px] ${
            wantThis.ticking ? 'animate-count-tick' : ''
          } ${
            wantThis.active
              ? 'bg-rose-500/30 text-white'
              : 'bg-surface-raised text-muted group-hover:text-white'
          }`}
        >
          {wantThis.count}
        </span>
      </button>

      {/* Developer Interest Button */}
      <button
        type="button"
        onClick={handleToggleDevInterest}
        title="This is interest, not a contract or a claim."
        aria-label="Toggle developer interest in solving this"
        className={`group relative inline-flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-full text-xs font-semibold border transition-[transform,background-color,border-color,box-shadow] duration-200 active:scale-95 ${
          devInterest.active
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60 shadow-[0_0_16px_rgba(16,185,129,0.25)]'
            : 'bg-surface hover:bg-surface-hi text-neutral hover:text-white border-border hover:border-emerald-500/40'
        }`}
      >
        <Code2
          className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${
            devInterest.active ? 'text-emerald-400' : 'text-emerald-400/80'
          }`}
        />
        <span>I&apos;m Interested in Building This</span>
        <span
          className={`font-bold tabular-nums px-2 py-0.5 rounded-full text-[11px] ${
            devInterest.ticking ? 'animate-count-tick' : ''
          } ${
            devInterest.active
              ? 'bg-emerald-500/30 text-white'
              : 'bg-surface-raised text-muted group-hover:text-white'
          }`}
        >
          {devInterest.count}
        </span>
      </button>
    </div>
  );
}
