'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, PencilLine, X } from 'lucide-react';

export default function ItchHeader() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const pathname = usePathname();
  const onNewProblemPage = pathname === '/problems/new';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/explore',       label: 'Explore Problems' },
    { href: '/discover',      label: 'Developer Feed'   },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(6, 8, 15, 0.96)'
          : 'rgba(6, 8, 15, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: scrolled ? '0 1px 32px rgba(0,0,0,0.7)' : 'none',
      }}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 flex items-center justify-between gap-4" style={{ height: '64px' }}>

        {/* ── Brand ─────────────────────────────────────── */}
        <div className="flex items-center gap-6">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <img src="/itch-icon.svg" alt="" className="h-9 w-9 rounded-xl transition-transform duration-200 group-hover:-translate-y-0.5" />
            <span className="flex flex-col">
              <span className="text-xl font-black leading-none text-white">Itch</span>
              <span className="mt-1 hidden text-[8px] uppercase text-white/50 sm:block">Post it. Back it. Build it.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = pathname === link.href || pathname?.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-item px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-surface-container-high text-on-surface'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/70'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* ── Right actions ──────────────────────────────── */}
        <div className="flex items-center gap-2">
          {!onNewProblemPage && (
            <Link
              href="/problems/new"
              className="inline-flex items-center gap-1.5 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all duration-200 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                boxShadow: '0 2px 16px rgba(249,115,22,0.38)',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 22px rgba(249,115,22,0.55)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 16px rgba(249,115,22,0.38)'}
            >
              <PencilLine className="h-4 w-4" />
              <span className="hidden sm:inline">Post Problem</span>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="md:hidden p-1.5 text-on-surface-variant hover:text-on-surface transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div
          className="md:hidden animate-fade-in px-5 py-4 flex flex-col gap-1.5"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(6,8,15,0.98)' }}
        >
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${
                pathname === link.href
                  ? 'bg-surface-container-high text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/60'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!onNewProblemPage && (
            <Link
              href="/problems/new"
              onClick={() => setMobileOpen(false)}
              className="mt-1 inline-flex items-center justify-center gap-2 text-white text-sm font-bold py-2.5 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
            >
              <PencilLine className="h-4 w-4" />
              Post a Problem
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
