'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Heart,
  Home,
  MessageSquareText,
  PencilLine,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserRound,
  Users,
} from 'lucide-react';
import { MOCK_PROBLEMS } from '@/lib/mock-data';

function ItchBrand() {
  return (
    <div className="flex items-center gap-3">
      <img src="/itch-icon.svg" alt="Itch logo" className="h-11 w-11 rounded-2xl object-cover transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-3deg]" />
      <div className="flex flex-col items-start">
        <span className="text-3xl font-black leading-none tracking-[-0.06em] text-white" style={{ fontFamily: '\"Plus Jakarta Sans\", \"Inter\", \"Segoe UI\", sans-serif' }}>
          Itch
        </span>
        <span className="mt-1 text-[9px] uppercase tracking-[0.18em] text-white/55" style={{ fontFamily: '\"Plus Jakarta Sans\", \"Inter\", \"Segoe UI\", sans-serif' }}>
          Post it. Back it. Build it.
        </span>
      </div>
    </div>
  );
}

const CATEGORIES = [
  { name: 'Health', href: '/explore', icon: Heart },
  { name: 'Money', href: '/explore', icon: TrendingUp },
  { name: 'Work', href: '/explore', icon: BriefcaseBusiness },
  { name: 'Home', href: '/explore', icon: Home },
  { name: 'Education', href: '/explore', icon: BookOpenText },
  { name: 'Travel', href: '/explore', icon: Plane },
  { name: 'Family', href: '/explore', icon: Users },
  { name: 'Other', href: '/explore', icon: Sparkles },
];

const FAQ = [
  {
    q: 'Is it free?',
    a: 'Yes. Posting, supporting, and browsing are free in the current build.',
  },
  {
    q: 'Is my post public?',
    a: 'Yes. Posts are public so other people can validate the problem and developers can discover it.',
  },
  {
    q: 'Who owns my idea?',
    a: 'You keep ownership of the problem details you post. The platform is not a claim or transfer agreement.',
  },
  {
    q: 'Who can build?',
    a: 'Anyone who wants to explore a problem can browse the feed and signal interest. The current build does not require you to be a developer to post.',
  },
  {
    q: 'Do I need to be a developer?',
    a: 'No. You can post a problem, support a problem, or comment without writing code.',
  },
];

function handleFaqNotePointerMove(event) {
  if (
    event.pointerType !== 'mouse'
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    || !window.matchMedia('(min-width: 1280px) and (hover: hover) and (pointer: fine)').matches
  ) return;

  const bounds = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;

  event.currentTarget.style.setProperty('--faq-note-tilt-x', `${-y * 5}deg`);
  event.currentTarget.style.setProperty('--faq-note-tilt-y', `${x * 5}deg`);
}

function resetFaqNotePointer(event) {
  event.currentTarget.style.setProperty('--faq-note-tilt-x', '0deg');
  event.currentTarget.style.setProperty('--faq-note-tilt-y', '0deg');
}

const STEPS = [
  {
    icon: PencilLine,
    num: '01',
    badge: 'SHARE',
    title: 'Share the friction',
    body: 'Post the problem in under 30 seconds with a short description, what happens now, and who it affects.',
    foot: 'Takes under 30 seconds',
  },
  {
    icon: MessageSquareText,
    num: '02',
    badge: 'SUPPORT',
    title: 'Support the pain',
    body: 'People say “Me Too,” add “I Want This,” and leave comments so the issue is validated by real people.',
    foot: 'Comment and signal from the real community',
  },
  {
    icon: UserRound,
    num: '03',
    badge: 'BUILD',
    title: 'Build with evidence',
    body: 'Developers browse the strongest problems and click “I’m Interested” when there is real demand to act on.',
    foot: 'Signal-based discovery, not guesswork',
  },
];

const STEP_NOTES = [
  {
    title: 'Name the hassle',
    body: 'What keeps going wrong in your day?',
    color: 'flow-note-yellow',
  },
  {
    title: 'See who relates',
    body: '“Me too” shows when others share it.',
    color: 'flow-note-mint',
  },
  {
    title: 'Help builders notice',
    body: 'Clear demand helps builders choose what to explore.',
    color: 'flow-note-blue',
  },
];

export default function LandingPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [year, setYear] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    const revealTargets = document.querySelectorAll('[data-scroll-reveal], [data-scroll-stagger]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) return undefined;

    document.documentElement.classList.add('has-scroll-reveal');

    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          activeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -48px 0px',
    });

    revealTargets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('has-scroll-reveal');
    };
  }, []);

  useEffect(() => {
    let previousScrollY = window.scrollY;
    let animationFrame = 0;
    if (previousScrollY > 80) setHeaderVisible(false);

    const updateHeroMotion = () => {
      animationFrame = 0;
      const hero = heroRef.current;
      if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const progress = Math.min(Math.max(-hero.getBoundingClientRect().top / hero.offsetHeight, 0), 1);
      const content = hero.querySelector('[data-hero-content]');
      const background = hero.querySelector('[data-hero-background]');

      if (content) {
        content.style.transform = `translate3d(0, ${progress * 28}px, 0)`;
        content.style.opacity = String(1 - progress * 0.35);
      }
      if (background) {
        background.style.transform = `translate3d(0, ${progress * 18}px, 0)`;
      }
    };

    const scheduleHeroMotion = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(updateHeroMotion);
    };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - previousScrollY;

      scheduleHeroMotion();

      if (currentScrollY <= 24) {
        setHeaderVisible(true);
        previousScrollY = currentScrollY;
      } else if (Math.abs(scrollDelta) > 6) {
        setHeaderVisible(scrollDelta < 0);
        previousScrollY = currentScrollY;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', scheduleHeroMotion);
    scheduleHeroMotion();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', scheduleHeroMotion);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const filteredProblems = MOCK_PROBLEMS.filter((problem) => {
    return selectedCategory === 'All' || problem.category?.name === selectedCategory;
  });

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen flex flex-col">
      <header
        aria-hidden={!headerVisible}
        onFocusCapture={() => setHeaderVisible(true)}
        className={`sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl transition-transform duration-300 ease-in-out ${headerVisible ? 'translate-y-0' : 'pointer-events-none -translate-y-full'}`}
      >
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-3">
            <ItchBrand />
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            <Link href="/explore" className="rounded-full px-3 py-2 text-sm font-medium text-white/80 transition hover:text-white">
              Explore
            </Link>
            <Link href="/problems/new" className="rounded-full bg-primary-container px-4 py-2.5 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(249,115,22,0.32)] transition hover:bg-primary">
              Post a Problem
            </Link>
            <Link href="/auth" className="hidden rounded-full border border-white/10 bg-surface-container/60 px-3 py-2 text-sm font-medium text-white transition hover:border-white/20 sm:inline-flex">
              Log in / Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section
          ref={heroRef}
          className="relative overflow-hidden px-5 pb-16 pt-6 sm:pt-8"
        >
          <div data-hero-background className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary-container/[0.07] blur-[140px]" />
            <div className="absolute right-0 top-48 h-[500px] w-[500px] rounded-full bg-secondary/[0.04] blur-[120px]" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-primary-container/[0.03] blur-[110px]" />
          </div>

          <div className="relative mx-auto max-w-[1180px]">
            <aside className="hero-sticky-notes pointer-events-none absolute inset-x-0 top-36 z-10 hidden justify-between xl:flex" aria-label="Problems people want to solve">
              {[MOCK_PROBLEMS[0], MOCK_PROBLEMS[1]].map((problem, index) => (
                <Link
                  key={problem.id}
                  href={`/problems/${problem.slug}`}
                  className={`hero-sticky-note pointer-events-auto group relative block w-[184px] rounded-sm px-5 pb-5 pt-7 text-left shadow-[0_18px_42px_rgba(0,0,0,0.35)] transition duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${index === 0 ? 'hero-sticky-note-yellow' : 'hero-sticky-note-mint'}`}
                  aria-label={`Explore problem: ${problem.title}`}
                >
                  <span className="hero-sticky-pin" aria-hidden="true" />
                  <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.15em] opacity-60">
                    {problem.category?.name}
                  </span>
                  <span className="mt-3 block text-sm font-extrabold leading-snug tracking-[-0.03em]">
                    {index === 0 ? 'I waste hours fixing bank files.' : 'I want text shortcuts that stay private.'}
                  </span>
                  <span className="mt-2 block text-xs leading-relaxed opacity-75">
                    {index === 0
                      ? 'Different formats make simple bookkeeping hard.'
                      : 'Saved phrases should stay on my computer.'}
                  </span>
                  <span className="mt-5 flex items-center justify-between border-t border-current/15 pt-3 font-mono text-[9px] font-semibold uppercase tracking-[0.1em] opacity-65">
                    <span>{problem.meTooCount} people relate</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </aside>

            <div data-hero-content className="hero-main-content mb-16 flex flex-col items-center text-center">
              <div className="animate-fade-up delay-75 mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-surface-container/70 px-4 py-1.5 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-container" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                  Share it → Support it → Build it
                </span>
              </div>

              <h1 className="hero-headline max-w-4xl text-[2rem] font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-[3.6rem] lg:text-[5rem]">
                <span className="hero-headline-cell"><span>Real</span></span>
                <span className="hero-headline-cell"><span>Problems.</span></span>
                <span className="hero-headline-cell"><span>Real</span></span>
                <span className="hero-headline-cell"><span className="text-shimmer">support.</span></span>
                <span className="hero-headline-cell"><span>Real</span></span>
                <span className="hero-headline-cell"><span>builders.</span></span>
              </h1>

              <p className="animate-fade-up delay-150 mt-6 max-w-2xl text-base text-tertiary sm:text-lg">
                People post the problems they feel every day. The community supports the pain. Builders discover what is worth solving.
              </p>

              <div className="animate-fade-up delay-200 mt-8 flex flex-col items-center gap-3 sm:flex-row">
                <Link
                  href="/problems/new"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary-container px-8 py-3.5 text-sm font-bold text-white shadow-[0_4px_24px_rgba(249,115,22,0.4)] transition duration-200 hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_8px_28px_rgba(249,115,22,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
                >
                  <PencilLine className="h-4 w-4" />
                  Post a Problem
                </Link>
                <Link
                  href="/explore"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-surface-container/70 px-8 py-3.5 text-sm font-semibold text-on-surface transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
                >
                  <Search className="h-4 w-4" />
                  Explore Problems
                </Link>
              </div>

              <div className="animate-fade-up delay-300 mt-8 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-full border border-white/[0.06] bg-surface-container-lowest/60 px-6 py-2.5 font-mono text-[11px] text-tertiary/70">
                <span className="inline-flex items-center gap-1.5 text-secondary">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Free to use
                </span>
                <span className="text-white/10">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  Takes under 30 seconds
                </span>
                <span className="text-white/10">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Starting with our local community
                </span>
              </div>
            </div>

            {false && <div className="mb-20 grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.08),transparent_55%),rgba(11,16,26,1)] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.4)] sm:p-7">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                      <span className="rounded-full bg-primary-container/10 px-2.5 py-1 text-primary">Example</span>
                      <span className="rounded-full border border-secondary/20 bg-secondary/10 px-2.5 py-1 text-secondary">Validating</span>
                      <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-tertiary">Everyday pain</span>
                    </div>
                    <span className="font-mono text-[11px] text-tertiary/60">Posted by a local resident · 2h ago</span>
                  </div>

                  <div className="mb-5">
                    <h3 className="text-lg font-bold leading-snug text-on-surface sm:text-xl">
                      “My grandmother can’t order groceries because the apps are too complicated.”
                    </h3>
                    <p className="mt-2 text-[0.8rem] leading-relaxed text-tertiary">
                      The buttons are hard to read, the flow is confusing, and people are forced to ask family members to help with basic tasks.
                    </p>
                  </div>

                  <div className="mb-5 grid grid-cols-3 gap-3 rounded-xl border border-white/5 bg-background/70 p-4">
                    <div>
                      <p className="mb-1 font-mono text-[10px] uppercase text-tertiary/60">Support</p>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xl font-bold text-primary">24</span>
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 font-mono text-[10px] uppercase text-tertiary/60">Me Too</p>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xl font-bold text-on-surface">18</span>
                        <CheckCircle2 className="h-4 w-4 text-secondary" />
                      </div>
                    </div>
                    <div>
                      <p className="mb-1 font-mono text-[10px] uppercase text-tertiary/60">Interested</p>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-xl font-bold text-secondary">12</span>
                        <ArrowRight className="h-4 w-4 text-secondary" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap gap-1.5 font-mono text-[11px] text-tertiary/70">
                      <span className="rounded-lg bg-surface-container-high px-2 py-1">Home</span>
                      <span className="rounded-lg bg-surface-container-high px-2 py-1">Family</span>
                      <span className="rounded-lg bg-surface-container-high px-2 py-1">Accessibility</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-surface-container-high px-3 py-1.5 text-xs font-semibold text-on-surface">
                        <MessageSquareText className="h-3.5 w-3.5" />
                        Support
                      </button>
                      <button type="button" className="inline-flex items-center gap-1.5 rounded-xl bg-primary-container px-3 py-1.5 text-xs font-bold text-white">
                        <Sparkles className="h-3.5 w-3.5" />
                        I’m Interested
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 lg:col-span-5">
                <div className="rounded-2xl border border-white/10 bg-surface-container/70 p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-bold text-on-surface">Priority score</span>
                    </div>
                    <span className="rounded-lg border border-white/10 bg-surface-container px-2 py-1 font-mono text-[10px] text-tertiary">Based on support + frequency + recency</span>
                  </div>

                  <p className="mb-5 text-[0.8rem] leading-relaxed text-tertiary">
                    The score reflects how many people share the problem, how often it happens, and how recently it was posted.
                  </p>

                  <div className="rounded-xl border border-white/5 bg-background/80 p-4">
                    <svg className="h-[72px] w-full" fill="none" viewBox="0 0 320 72" aria-hidden="true">
                      <line x1="0" y1="18" x2="320" y2="18" stroke="#1e293b" strokeDasharray="2 5" />
                      <line x1="0" y1="44" x2="320" y2="44" stroke="#1e293b" strokeDasharray="2 5" />
                      <path d="M8 62 Q80 50,140 36 T240 22 T310 12" stroke="#ffb690" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                      <path d="M8 66 Q70 58,150 46 T250 34 T310 26" stroke="#4edea3" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
                      <circle cx="310" cy="12" r="4" fill="#f97316" />
                      <circle cx="310" cy="12" r="8" stroke="#f97316" strokeOpacity="0.25" strokeWidth="2" />
                    </svg>
                    <div className="mt-2 flex justify-between font-mono text-[10px] text-tertiary/55">
                      <span>More signals = more weight</span>
                      <span className="text-secondary">Fresh issue</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-400/20 bg-[rgba(11,16,26,1)] p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-secondary" />
                    <div>
                      <p className="text-xs font-bold text-on-surface">Truthful signals only</p>
                      <p className="mt-1 text-[0.8rem] leading-relaxed text-tertiary">
                        This build focuses on real problem support, comments, and developer interest — not fabricated scores or fake urgency.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>}

            {false && <div className="mb-24">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Latest problems</p>
                  <h2 className="mt-2 text-2xl font-bold text-on-surface sm:text-3xl">What people are dealing with right now</h2>
                </div>
                <Link href="/explore" className="inline-flex items-center gap-1 text-sm font-medium text-primary transition hover:text-primary-container">
                  View all <ChevronRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mb-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('All')}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${selectedCategory === 'All' ? 'bg-primary-container text-white' : 'border border-white/10 bg-surface-container/60 text-on-surface'}`}
                >
                  All
                </button>
                {CATEGORIES.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setSelectedCategory(name)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${selectedCategory === name ? 'bg-primary-container text-white' : 'border border-white/10 bg-surface-container/60 text-on-surface'}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {name}
                  </button>
                ))}
              </div>

              {filteredProblems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/15 bg-surface-container/40 px-6 py-10 text-center text-sm text-tertiary">
                  No problems here yet. Be the first to post one.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {filteredProblems.map((problem) => (
                    <Link
                      key={problem.id}
                      href={`/problems/${problem.slug}`}
                      className="group rounded-2xl border border-white/10 bg-surface-container/70 p-5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:bg-surface-container-high"
                    >
                      <div className="mb-4 flex items-center justify-between gap-2">
                        <span className="rounded-full bg-primary-container/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-primary">
                          {problem.category?.name || 'Other'}
                        </span>
                        <span className="font-mono text-[10px] uppercase text-tertiary/55">
                          {problem.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold leading-snug text-on-surface">
                        {problem.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-tertiary">
                        {problem.description}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/5 pt-4 text-[11px] text-tertiary/70">
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" />
                          {problem.meTooCount} support
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MessageSquareText className="h-3.5 w-3.5" />
                          {problem.commentsCount} comments
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>}
          </div>
        </section>

        <section className="px-5 py-12 sm:py-16">
          <div className="mx-auto max-w-[1180px]">
            <div data-scroll-reveal className="scroll-reveal mx-auto max-w-4xl border-b border-white/10 pb-10 text-center">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">What Itch provides</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-on-surface sm:text-5xl">A place to turn everyday frustration into buildable opportunity.</h2>
              </div>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-tertiary">
                Itch connects people who experience a problem with others who share it, then helps developers discover what is worth solving. It makes the need visible; builders decide what to make.
              </p>
            </div>

            <div data-scroll-reveal className="scroll-reveal mx-auto mt-10 max-w-4xl">
              <div data-scroll-stagger className="grid gap-4 sm:grid-cols-3" role="group" aria-label="Choose a step in the Itch process">
                {STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const isActive = activeStep === index;
                  const note = STEP_NOTES[index];

                  return (
                    <button
                      key={step.num}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveStep(index)}
                      className={`flow-note group relative min-h-40 rounded-sm px-5 pb-5 pt-7 text-left shadow-[0_12px_30px_rgba(0,0,0,0.22)] transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${note.color} ${isActive ? 'flow-note-active' : ''}`}
                    >
                      <span className="hero-sticky-pin" aria-hidden="true" />
                      <span className="flex items-center justify-between gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.15em] opacity-65">
                        <span>{step.num} · {step.badge}</span>
                        <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      </span>
                      <span className="mt-4 block text-base font-extrabold leading-snug tracking-[-0.03em]">
                          {note.title}
                      </span>
                      <span className="mt-2 block pr-8 text-xs leading-relaxed opacity-75">
                          {note.body}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 overflow-hidden rounded-lg border border-white/10 bg-surface-container/30">
                <div className="h-1 bg-white/5">
                  <div
                    className="h-full bg-primary transition-[width] duration-500 ease-out"
                    style={{ width: `${((activeStep + 1) / STEPS.length) * 100}%` }}
                  />
                </div>
                <div key={STEPS[activeStep].num} aria-live="polite" className="animate-fade-up grid gap-6 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
                      Step {STEPS[activeStep].num} / 03 · {STEPS[activeStep].badge}
                    </p>
                    <h3 className="mt-2 text-2xl font-bold text-on-surface">{STEPS[activeStep].title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-tertiary">{STEPS[activeStep].body}</p>
                    <p className="mt-4 text-xs text-tertiary/70">{STEPS[activeStep].foot}</p>
                  </div>
                  <Link
                    href={activeStep === 0 ? '/problems/new' : '/explore'}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-container px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:w-auto"
                  >
                    {activeStep === 0 ? 'Post a Problem' : activeStep === 1 ? 'Explore Problems' : 'Explore as a Builder'}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 px-5 py-10 sm:py-12">
          <div data-scroll-reveal className="scroll-reveal mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-[1fr_260px]">
            <div className="text-center md:text-left">
              <p className="mb-3 inline-flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                <ShieldCheck className="h-4 w-4" /> Clear scope
              </p>
              <h2 className="text-3xl font-black leading-tight text-on-surface sm:text-4xl">Validation first. No marketplace promises.</h2>
              <p className="mt-5 text-lg font-semibold text-on-surface">No payments. No funding proposals. No speculation.</p>
              <p className="mt-3 text-sm leading-relaxed text-tertiary">
                Itch helps people post problems, support them with signals and comments, and helps developers discover opportunities. This first version does not process payments or promise that a solution will be built.
              </p>
            </div>
            <Link
              href="/explore"
              className="validation-sticky-note group relative block rounded-sm px-5 pb-5 pt-8 text-left shadow-[0_16px_36px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:rotate-0 hover:shadow-[0_24px_42px_rgba(0,0,0,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="hero-sticky-pin" aria-hidden="true" />
              <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.15em] opacity-65">
                What validation means
              </span>
              <span className="mt-3 block text-base font-extrabold leading-snug">
                First, check if others have the same problem.
              </span>
              <span className="mt-2 block text-xs leading-relaxed opacity-75">
                It shows real interest. It does not guarantee a product or payment.
              </span>
              <span className="mt-4 inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] opacity-70">
                Explore shared problems
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </section>

        <section className="px-5 py-12 sm:py-16">
          <div className="faq-section-layout relative mx-auto max-w-[1180px]">
            <div className="mx-auto grid max-w-3xl gap-8">
              <div data-scroll-reveal className="scroll-reveal text-center">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Frequently asked questions</p>
                <h2 className="mx-auto mt-3 max-w-sm text-3xl font-bold text-on-surface sm:text-4xl">Before you get started.</h2>
              </div>

              <div data-scroll-reveal data-scroll-stagger className="scroll-reveal divide-y divide-white/10 border-y border-white/10">
                {FAQ.map((item) => (
                  <details key={item.q} className="group py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-on-surface transition-colors hover:text-primary focus-visible:outline-none focus-visible:text-primary">
                      {item.q}
                      <span className="text-xl font-light text-primary transition group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 max-w-2xl pr-8 text-sm leading-relaxed text-tertiary">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <div className="faq-thinking-notes" aria-label="Think about a problem to solve">
              <Link
                href="/problems/new"
                className="faq-thinking-note faq-thinking-note-yellow group"
                onPointerMove={handleFaqNotePointerMove}
                onPointerLeave={resetFaqNotePointer}
              >
                <span className="hero-sticky-pin" aria-hidden="true" />
                <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.14em] opacity-60">Start with a question</span>
                <span className="mt-2 block pr-8 text-sm font-extrabold leading-snug">What keeps taking more effort than it should?</span>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] opacity-65">
                  Write it down <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
              <Link
                href="/explore"
                className="faq-thinking-note faq-thinking-note-mint group"
                onPointerMove={handleFaqNotePointerMove}
                onPointerLeave={resetFaqNotePointer}
              >
                <span className="hero-sticky-pin" aria-hidden="true" />
                <span className="block font-mono text-[9px] font-bold uppercase tracking-[0.14em] opacity-60">Think it’s just you?</span>
                <span className="mt-2 block pr-8 text-sm font-extrabold leading-snug">Look around. Someone else may relate.</span>
                <span className="mt-3 inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-[0.1em] opacity-65">
                  Find shared problems <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-white/5 bg-[rgb(5,7,13)]">
        <div data-scroll-stagger className="mx-auto grid max-w-[1180px] gap-8 px-5 py-12 sm:px-6 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-3"><ItchBrand /></div>
            <p className="max-w-md text-sm leading-relaxed text-tertiary/70">
              A community for sharing everyday friction, supporting real pain, and helping useful software get built.
            </p>
          </div>

          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Company</p>
            <ul className="space-y-2 text-sm text-tertiary/70">
              <li><Link href="/" className="transition hover:text-white">About</Link></li>
              <li><Link href="/explore" className="transition hover:text-white">Explore</Link></li>
              <li><Link href="/problems/new" className="transition hover:text-white">Post a Problem</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Legal</p>
            <ul className="space-y-2 text-sm text-tertiary/70">
              <li><Link href="/" className="transition hover:text-white">Community Rules</Link></li>
              <li><Link href="/" className="transition hover:text-white">Privacy</Link></li>
              <li><Link href="/" className="transition hover:text-white">Terms</Link></li>
              <li><Link href="/" className="transition hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div data-scroll-reveal className="scroll-reveal px-5 pb-1 pt-1 text-center">
          <p className="text-sm font-semibold text-on-surface sm:text-base">Share it. Support it. Build it.</p>
        </div>

        <div className="border-t border-white/5">
          <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-3 px-5 py-5 text-center font-mono text-[11px] text-tertiary/45 sm:flex-row sm:px-6">
            <span>Rules: Zero harassment · Zero ads · No private data disclosures.</span>
            {year && <span>© {year} Itch</span>}
          </div>
        </div>
      </footer>
    </div>
  );
}
