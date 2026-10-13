'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Compass, Layers, Menu, X, Sparkles } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/80 glass-nav transition-[background-color,border-color] duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image src="/itch-mark.svg" alt="" width={36} height={36} className="relative h-9 w-9 rounded-xl shadow-glow-accent transition-transform duration-200 group-hover:scale-105" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg tracking-tight text-white group-hover:text-accent transition-colors duration-150">
                Itch.
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-accent/15 text-accent border border-accent/30 tracking-wider">
                BETA
              </span>
            </div>
            <span className="text-[11px] text-muted tracking-tight -mt-0.5 hidden sm:inline">
              Got a problem? Somebody&apos;s itching to solve it.
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/"
            className="text-white hover:text-accent transition-colors duration-150 flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-accent" />
            <span>Problem Radar</span>
          </Link>
          <Link
            href="/discover"
            className="text-neutral hover:text-white transition-colors duration-150 flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-violet" />
            <span>Developer Board</span>
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/problems/new"
            className="group relative inline-flex items-center gap-2 bg-accent hover:bg-accent-hi text-bg px-4 py-2 rounded-control text-xs font-bold shadow-glow-accent transition-[transform,box-shadow,background-color] duration-200 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5] transition-transform duration-200 group-hover:rotate-90" />
            <span>Submit a Problem</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-neutral hover:text-white rounded-control hover:bg-surface-hi min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors duration-150"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-4 space-y-3 animate-fade-up">
          <p className="text-xs text-muted italic pb-1 border-b border-border/40">
            &quot;Got a problem? Somebody&apos;s itching to solve it.&quot;
          </p>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-white py-2"
          >
            Problem Radar
          </Link>
          <Link
            href="/discover"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-neutral hover:text-white py-2"
          >
            Developer Opportunity Board
          </Link>
          <div className="pt-2 border-t border-border">
            <Link
              href="/problems/new"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 bg-accent text-bg px-4 py-2.5 rounded-control text-xs font-bold shadow-glow-accent"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Submit a Problem</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
