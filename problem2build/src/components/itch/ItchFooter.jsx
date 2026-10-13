'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
              <Image src="/itch-mark.svg" alt="" width={32} height={32} className="h-8 w-8 rounded-lg transition-transform duration-300 hover:-rotate-6 hover:scale-105" />
              <span className="text-base font-black tracking-tight text-white">Itch.</span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-tertiary/60">
              Share everyday problems, find people who understand them, and help builders see what matters.
            </p>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-3 text-xs text-tertiary/60 sm:grid-cols-3">
            <Link href="/explore" className="transition-colors hover:text-on-surface">Explore</Link>
            <Link href="/community" className="transition-colors hover:text-on-surface">Community</Link>
            <Link href="/problems/new" className="transition-colors hover:text-on-surface">Post a Problem</Link>
            <Link href="/about" className="transition-colors hover:text-on-surface">About</Link>
            <Link href="/how-it-works" className="transition-colors hover:text-on-surface">How it works</Link>
            <Link href="/privacy" className="transition-colors hover:text-on-surface">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-on-surface">Terms</Link>
            <Link href="/community-guidelines" className="transition-colors hover:text-on-surface">Community guidelines</Link>
            <Link href="/contact" className="transition-colors hover:text-on-surface">Contact</Link>
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
