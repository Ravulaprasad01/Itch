'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, PencilLine, X } from 'lucide-react';
import { getIdTokenResult, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, getPublicDisplayName } from '@/lib/firebase';

export default function ItchHeader() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModerator, setIsModerator] = useState(false);
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
    } catch {
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
      setAccountType('');
      setIsModerator(false);
      if (!user) return;
      try {
        const [profile, tokenResult] = await Promise.all([
          db ? getDoc(doc(db, 'users', user.uid)) : null,
          getIdTokenResult(user),
        ]);
        if (requestId !== nameRequest || auth.currentUser?.uid !== user.uid) return;
        setAccountName(profile?.exists() ? profile.data().displayName : getPublicDisplayName(user));
        setAccountType(profile?.exists() ? profile.data().accountType || '' : '');
        setIsModerator(tokenResult.claims.moderator === true);
      } catch {
        if (requestId === nameRequest && auth.currentUser?.uid === user.uid) {
          setAccountName(getPublicDisplayName(user));
          setAccountType('');
          setIsModerator(false);
        }
      }
    });
  }, []);

  const navLinks = [
    { href: '/explore', label: 'Explore Problems' },
    ...(isAuthenticated ? [{ href: '/community', label: 'Community' }] : []),
    ...(isAuthenticated ? [{ href: '/profile', label: 'My Profile' }] : []),
    ...(isModerator ? [{ href: '/moderation', label: 'Moderation' }] : []),
  ];

  return (
    <header className={`itch-site-header fixed inset-x-0 top-0 z-50${scrolled ? ' is-scrolled' : ''}`}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 flex items-center justify-between gap-4" style={{ height: '64px' }}>

        {/* ── Brand ─────────────────────────────────────── */}
        <div className="flex items-center gap-6">
          <Link href="/explore" className="group flex shrink-0 items-center gap-2.5">
            <Image src="/itch-mark.svg" alt="" width={36} height={36} className="h-9 w-9 rounded-xl transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-4deg]" />
            <span className="flex flex-col">
              <span className="text-xl font-black leading-none text-white">Itch.</span>
              <span className="mt-1 hidden text-[8px] uppercase text-white/50 sm:block">Share it, Support it, Build it</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const active = pathname === link.href || pathname?.startsWith(link.href + '/');
              return <Link key={link.href} href={link.href} aria-current={active ? 'page' : undefined} className={`header-nav-link${active ? ' is-active' : ''}`}>{link.label}</Link>;
            })}
          </nav>
        </div>

        {/* ── Right actions ──────────────────────────────── */}
        <div className="flex items-center gap-2">
          {isAuthenticated && accountType === 'poster' && !onNewProblemPage && (
            <Link href="/problems/new" className="header-post-link">
              <PencilLine className="h-4 w-4" />
              <span className="hidden sm:inline">Post Problem</span>
            </Link>
          )}
          {isAuthenticated ? <>
            <span className="hidden max-w-36 truncate text-xs font-semibold text-on-surface-variant sm:inline" title={accountName}>{accountName}</span>
            <button type="button" onClick={handleSignOut} disabled={signOutPending} className="rounded-lg px-2.5 py-2 text-xs font-semibold text-on-surface-variant transition hover:bg-white/5 hover:text-on-surface disabled:cursor-wait disabled:opacity-60">{signOutPending ? 'Signing out…' : 'Sign out'}</button>
          </> : <Link href="/auth" className="header-auth-link">Sign in/up</Link>}
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
            <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} aria-current={pathname === link.href ? 'page' : undefined} className={`header-mobile-link${pathname === link.href ? ' is-active' : ''}`}>{link.label}</Link>
          ))}
          {accountName && accountType === 'poster' && !onNewProblemPage && (
            <Link href="/problems/new" onClick={() => setMobileOpen(false)} className="header-mobile-link">
              <PencilLine className="h-4 w-4" />
              Post a Problem
            </Link>
          )}
          {isAuthenticated ? <div className="header-mobile-account"><span className="truncate">{accountName}</span><button type="button" onClick={handleSignOut} disabled={signOutPending}>{signOutPending ? 'Signing out…' : 'Sign out'}</button></div> : <Link href="/auth" onClick={() => setMobileOpen(false)} className="header-mobile-link">Sign in/up</Link>}
          {signOutError && <p role="alert" className="px-3.5 text-xs text-red-300">{signOutError}</p>}
        </div>
      )}
    </header>
  );
}
