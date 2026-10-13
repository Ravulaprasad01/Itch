'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, PencilLine, X } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, getPublicDisplayName } from '@/lib/firebase';
import VoltageLink from '@/components/itch/VoltageLink';

export default function ItchHeader() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [accountName, setAccountName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signOutPending, setSignOutPending] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const onNewProblemPage = pathname === '/problems/new';

  const handleSignOut = async () => {
    if (signOutPending) return;
    setSignOutPending(true);
    setSignOutError('');
    try {
      const signOutTask = auth ? signOut(auth) : Promise.resolve();
      router.replace('/thanks');
      await signOutTask;
    } catch (error) {
      console.error('Unable to sign out:', error);
      router.replace(pathname || '/');
      setSignOutError('Could not sign out. Please try again.');
      setSignOutPending(false);
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!auth) return undefined;
    let nameRequest = 0;
    return onAuthStateChanged(auth, async user => {
      const requestId = ++nameRequest;
      setIsAuthenticated(Boolean(user));
      setAccountName('');
      if (!user) return;
      try {
        const profile = db ? await getDoc(doc(db, 'users', user.uid)) : null;
        if (requestId !== nameRequest || auth.currentUser?.uid !== user.uid) return;
        setAccountName(profile?.exists() ? profile.data().displayName : getPublicDisplayName(user));
      } catch {
        if (requestId === nameRequest && auth.currentUser?.uid === user.uid) {
          setAccountName(getPublicDisplayName(user));
        }
      }
    });
  }, []);

  const navLinks = [
    { href: '/explore', label: 'Explore Problems' },
    ...(isAuthenticated ? [{ href: '/community', label: 'Community' }] : []),
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
          <Link href={isAuthenticated ? '/explore' : '/'} className="group flex shrink-0 items-center gap-2.5">
            <Image src="/itch-mark.svg" alt="" width={36} height={36} className="h-9 w-9 rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-4deg]" />
            <span className="flex flex-col">
              <span className="text-xl font-black leading-none text-white">Itch.</span>
              <span className="mt-1 hidden text-[8px] uppercase text-white/50 sm:block">Post it. Back it. Build it.</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = pathname === link.href || pathname?.startsWith(link.href + '/');
              return (
                <VoltageLink key={link.href} href={link.href} className={`nav-voltage-link${active ? ' is-active' : ''}`}>
                  {link.label}
                </VoltageLink>
              );
            })}
          </nav>
        </div>

        {/* ── Right actions ──────────────────────────────── */}
        <div className="flex items-center gap-2">
          {isAuthenticated && !onNewProblemPage && (
            <VoltageLink href="/problems/new" className="header-voltage-link">
              <PencilLine className="h-4 w-4" />
              <span className="hidden sm:inline">Post Problem</span>
            </VoltageLink>
          )}
          {isAuthenticated ? <>
            <span className="hidden max-w-36 truncate text-xs font-semibold text-on-surface-variant sm:inline" title={accountName}>{accountName}</span>
            <button type="button" onClick={handleSignOut} disabled={signOutPending} className="rounded-lg px-2.5 py-2 text-xs font-semibold text-on-surface-variant transition hover:bg-white/5 hover:text-on-surface disabled:cursor-wait disabled:opacity-60">{signOutPending ? 'Signing out…' : 'Sign out'}</button>
          </> : <Link href="/auth" className="rounded-lg px-2.5 py-2 text-xs font-semibold text-on-surface-variant transition hover:bg-white/5 hover:text-on-surface">Sign in/up</Link>}
          {signOutError && <span role="alert" className="text-[10px] text-red-300">{signOutError}</span>}

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
            <VoltageLink
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`mobile-voltage-link nav-voltage-link${pathname === link.href ? ' is-active' : ''}`}
            >
              {link.label}
            </VoltageLink>
          ))}
          {accountName && !onNewProblemPage && (
            <VoltageLink href="/problems/new" onClick={() => setMobileOpen(false)} className="mobile-voltage-link">
              <PencilLine className="h-4 w-4" />
              Post a Problem
            </VoltageLink>
          )}
          {isAuthenticated ? <div className="flex items-center justify-between px-3.5 py-2.5 text-sm"><span className="truncate font-semibold text-on-surface">{accountName}</span><button type="button" onClick={handleSignOut} disabled={signOutPending} className="text-xs text-tertiary hover:text-on-surface disabled:opacity-60">{signOutPending ? 'Signing out…' : 'Sign out'}</button></div> : <VoltageLink href="/auth" onClick={() => setMobileOpen(false)} className="mobile-voltage-link"><span>Sign in/up</span></VoltageLink>}
          {signOutError && <p role="alert" className="px-3.5 text-xs text-red-300">{signOutError}</p>}
        </div>
      )}
    </header>
  );
}
