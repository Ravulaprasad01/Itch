'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ItchFooter() {
  // Avoid hydration mismatch by only rendering year on client
  const [year, setYear] = useState(null);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  return (
    <footer style={{ background: 'rgb(5,7,13)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 py-12">
        <div className="flex flex-col gap-6 border-b border-white/[0.05] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <img src="/itch-icon.svg" alt="" className="h-8 w-8 rounded-lg" />
              <span className="text-base font-black tracking-tight text-white">Itch</span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-tertiary/60">
              Share everyday problems, find people who understand them, and help builders see what matters.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-tertiary/60">
            <Link href="/explore" className="transition-colors hover:text-on-surface">Explore</Link>
            <Link href="/discover" className="transition-colors hover:text-on-surface">Developer Feed</Link>
            <Link href="/problems/new" className="transition-colors hover:text-on-surface">Post a Problem</Link>
          </nav>
        </div>

        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-tertiary/35">
          <span>Zero harassment · Zero ads · No private data disclosures.</span>
          {year && <span>© {year} Itch Platform</span>}
        </div>
      </div>
    </footer>
  );
}
