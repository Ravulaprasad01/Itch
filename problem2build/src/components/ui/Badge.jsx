import React from 'react';

const STATUS_CONFIG = {
  open: { label: 'OPEN', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  validating: { label: 'VALIDATING', bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  archived: { label: 'ARCHIVED', bg: 'bg-surface-raised text-muted border-border' },
  cancelled: { label: 'CANCELLED', bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  being_built: { label: 'BEING BUILT', bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
  solved: { label: 'SOLVED', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
};

export default function Badge({ status, category, className = '' }) {
  if (category) {
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-raised text-neutral border border-border-hi/70 ${className}`}>
        {category}
      </span>
    );
  }

  const config = STATUS_CONFIG[status] || {
    label: (status || 'OPEN').toUpperCase(),
    bg: 'bg-surface-raised text-muted border-border',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider border uppercase ${config.bg} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-90 animate-pulse" />
      <span>{config.label}</span>
    </span>
  );
}
