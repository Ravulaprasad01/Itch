'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpenText,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Code2,
  Heart,
  Home,
  MessageSquareText,
  PencilLine,
  Pause,
  Plane,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import VoltageLink from '@/components/itch/VoltageLink';

function ItchBrand() {
  return (
    <div className="flex items-center gap-3">
      <Image src="/itch-mark.svg" alt="Itch logo" width={44} height={44} className="h-11 w-11 rounded-2xl object-cover transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-[-3deg]" />
      <div className="flex flex-col items-start">
        <span className="text-3xl font-black leading-none tracking-[-0.06em] text-white" style={{ fontFamily: '\"Plus Jakarta Sans\", \"Inter\", \"Segoe UI\", sans-serif' }}>
          Itch.
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
    a: 'Yes. You can browse public problems and join the community for free.',
  },
  {
    q: 'How do I post a problem?',
    a: 'Use Post a Problem to describe what happened, who it affects, and what you have tried. Sign in with Google to publish it under your display name.',
  },
  {
    q: 'Is my problem shared publicly?',
    a: 'Drafts stay in this browser until you submit. Submitted problems appear in Explore with your Google display name; your email is not shown.',
  },
  {
    q: 'Do I need to share private details?',
    a: 'No. Keep the description focused on the problem and leave out sensitive information.',
  },
  {
    q: 'How do I find problems like mine?',
    a: 'Browse the problem board and search by topic or keyword to find related stories.',
  },
  {
    q: 'How do I join a conversation?',
    a: 'Open any problem and sign in to add a reply. Replies appear for everyone in that problem’s conversation.',
  },
];

const PRODUCT_FLOW = [
  {
    label: 'Share',
    icon: PencilLine,
    userMessage: 'I keep running into the same frustrating problem.',
    reply: 'Describe what happened and who it affects, then publish it under your display name.',
    action: 'Write a problem',
    href: '/problems/new',
  },
  {
    label: 'Find support',
    icon: Heart,
    userMessage: 'Does this happen to anyone else?',
    reply: 'Browse submitted problems and select “Me Too” to indicate a shared experience, or “Want This” to express interest in a potential solution.',
    action: 'Explore problems',
    href: '/explore',
  },
  {
    label: 'Join in',
    icon: MessageSquareText,
    userMessage: 'Can I find people dealing with something similar?',
    reply: 'Browse by topic and join conversations to add context and learn how others experience the same friction.',
    action: 'Browse community',
    href: '/community',
  },
  {
    label: 'Build',
    icon: Code2,
    userMessage: 'Could this become a better tool or service?',
    reply: 'Builders can explore repeated frustrations and the real-world context behind them in the developer feed.',
    action: 'See developer feed',
    href: '/discover',
  },
];

function InteractiveFlowChat() {
  const [activeStep, setActiveStep] = useState(0);
  const [typedReply, setTypedReply] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const step = PRODUCT_FLOW[activeStep];

  useEffect(() => {
    setTypedReply('');
    setIsTyping(true);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedReply(step.reply);
      setIsTyping(false);
      return undefined;
    }

    let typeTimer;
    const startTimer = window.setTimeout(() => {
      let character = 0;
      typeTimer = window.setInterval(() => {
        character += 1;
        setTypedReply(step.reply.slice(0, character));
        if (character >= step.reply.length) {
          window.clearInterval(typeTimer);
          setIsTyping(false);
        }
      }, 18);
    }, 450);

    return () => {
      window.clearTimeout(startTimer);
      if (typeTimer) window.clearInterval(typeTimer);
    };
  }, [activeStep, step.reply]);

  return (
    <div className="journey-chat" data-scroll-reveal>
      <div className="journey-chat-topbar">
        <div className="journey-chat-brand"><span><MessageSquareText size={17}/></span><div><b>Itch guide</b><small>See what you can do here</small></div></div>
        <div className="journey-chat-status"><i/> INTERACTIVE TOUR</div>
      </div>
      <div className="journey-chat-layout">
        <div className="journey-chat-steps" role="group" aria-label="Explore what Itch can do">
          {PRODUCT_FLOW.map((item, index) => {
            const Icon = item.icon;
            return <button key={item.label} type="button" aria-pressed={activeStep === index} aria-controls="journey-chat-panel" onClick={() => setActiveStep(index)}>
              <span className="journey-chat-step-icon"><Icon size={16}/></span><span><small>0{index + 1}</small><b>{item.label}</b></span><ChevronRight size={15}/>
            </button>;
          })}
        </div>
        <div id="journey-chat-panel" className="journey-chat-panel" role="tabpanel" aria-live="polite" aria-label={`${step.label} example`}>
          <div className="journey-chat-intro"><span className="journey-chat-avatar"><MessageSquareText size={15}/></span><p>What would you like to do on Itch?</p></div>
          <div key={step.label} className="journey-chat-thread">
            <div className="journey-chat-message journey-chat-message-maya"><span className="journey-chat-person-avatar">M</span><div className="journey-chat-message-copy"><small>Maya</small><p>{step.userMessage}</p></div></div>
            <div className="journey-chat-message journey-chat-message-jordan"><span className="journey-chat-person-avatar">J</span><div className="journey-chat-message-copy"><small>Jordan</small>{isTyping && !typedReply ? <div className="journey-chat-typing" role="status" aria-label="Jordan is typing"><i/><i/><i/></div> : <p aria-live="off">{typedReply}{isTyping && <span className="journey-chat-caret" aria-hidden="true"/>}</p>}{!isTyping && <Link href={step.href}>{step.action}<ArrowRight size={14}/></Link>}</div></div>
          </div>
          <div className="journey-chat-footer"><span>STEP {String(activeStep + 1).padStart(2, '0')} / 04</span><div className="journey-chat-dots" aria-label={`Step ${activeStep + 1} of 4`}>{PRODUCT_FLOW.map((item, index) => <button key={item.label} type="button" aria-label={`Go to ${item.label}`} aria-current={activeStep === index ? 'step' : undefined} onClick={() => setActiveStep(index)}/>)}</div></div>
        </div>
      </div>
    </div>
  );
}

function NoteSketch({ type }) {
  return (
    <svg className="note-sketch" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {type === 'bank' && (
        <>
          <path d="M8 16 24 8l16 8M11 19h26M14 21v14m10-14v14m10-14v14M9 38h30M6 42h36" />
          <path d="m32 8 4 1-1-4" />
        </>
      )}
      {type === 'privacy' && (
        <>
          <path d="M24 7 38 12v10c0 9-6 15-14 19-8-4-14-10-14-19V12l14-5Z" />
          <path d="m17 24 5 5 10-12" />
        </>
      )}
      {type === 'share' && (
        <>
          <path d="m10 34 3-9L31 7l10 10-18 18-9 3 3-9" />
          <path d="m27 11 10 10M12 37c8 2 17 1 25-3" />
        </>
      )}
      {type === 'support' && (
        <>
          <path d="M24 39S8 29 8 18c0-9 12-12 16-3 4-9 16-6 16 3 0 11-16 21-16 21Z" />
          <path d="M6 11 3 8m39 3 3-3M24 5V2" />
        </>
      )}
      {type === 'build' && (
        <>
          <path d="M17 29c0-4-6-7-6-14a13 13 0 0 1 26 0c0 7-6 10-6 14H17Zm1 5h12m-10 5h8m-4-34v3" />
          <path d="m5 16 4 1m30-1 4-1M11 5l3 3m20-3-3 3" />
        </>
      )}
      {type === 'validation' && (
        <>
          <path d="M24 5a19 19 0 1 0 19 19" />
          <path d="m13 24 8 8L43 8" />
          <path d="m36 7 7 1-1-7" />
        </>
      )}
      {type === 'think' && (
        <>
          <path d="M18 34c-1-4-7-7-7-15a13 13 0 0 1 26 0c0 7-5 10-7 15H18Z" />
          <path d="M19 39h10m-8 4h6m-2-21c0-3 5-3 5 0 0 2-3 2-3 5m0 4v.2" />
        </>
      )}
      {type === 'question' && (
        <>
          <path d="M24 41c-3-4-10-7-14-14-4-8 1-18 9-19 7-1 9 5 11 8 2-3 4-9 11-8 8 1 13 11 9 19-4 7-11 10-14 14l-6 5-6-5Z" transform="translate(-2 -3) scale(.96)" />
          <path d="M21 19c1-5 10-5 10 1 0 3-4 4-5 7m0 5v.2" />
        </>
      )}
    </svg>
  );
}

const HERO_NOTES = [
  { label: 'AT HOME', title: '“Why is this simple thing such a hassle?”', detail: 'Start with the everyday moment you wish worked better.', tone: 'coral', icon: Home },
  { label: 'AT WORK', title: '“There has to be an easier way to do this.”', detail: 'A workaround can be the first clue to a better tool.', tone: 'lilac', icon: BriefcaseBusiness },
  { label: 'ON THE GO', title: '“I can’t be the only one dealing with this.”', detail: 'Find the people who recognize the same friction.', tone: 'aqua', icon: Users },
];

function HeroNoteFeature({ active, onChange }) {
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const noteRef = useRef(null);
  const note = HERO_NOTES[active];
  const NoteIcon = note.icon;
  const paused = hovering || focused || manuallyPaused;

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => onChange(index => (index + 1) % HERO_NOTES.length), 5600);
    return () => window.clearInterval(timer);
  }, [onChange, paused]);

  const updateTilt = (event) => {
    if (event.pointerType !== 'mouse' || !noteRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    noteRef.current.style.setProperty('--tilt-x', `${x * 5}deg`);
    noteRef.current.style.setProperty('--tilt-y', `${y * -5}deg`);
  };

  const resetTilt = () => {
    if (!noteRef.current) return;
    noteRef.current.style.setProperty('--tilt-x', '0deg');
    noteRef.current.style.setProperty('--tilt-y', '0deg');
  };

  const toggleRotation = () => {
    if (manuallyPaused) {
      setManuallyPaused(false);
      setHovering(false);
      setFocused(false);
      return;
    }
    setManuallyPaused(true);
  };

  return (
    <div
      className="hero-note-stage"
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => { setHovering(false); resetTilt(); }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onPointerMove={updateTilt}
    >
      <div className="hero-stage-caption"><span><i /> A THOUGHT WORTH KEEPING</span><span>ITCH / 0{active + 1}</span></div>
      <div id="hero-note-panel" className="hero-note-stack" role="tabpanel" aria-roledescription="note" aria-live={paused ? 'polite' : 'off'} aria-labelledby={`hero-note-tab-${active}`}>
        <div className="hero-note-shadow hero-note-shadow-back" aria-hidden="true"><span>little things</span><span>matter, too</span></div>
        <div className="hero-note-shadow hero-note-shadow-front" aria-hidden="true"><span>ONE SMALL CHANGE</span><span className="shadow-mark">↗</span></div>
        <button
          ref={noteRef}
          type="button"
          className={`hero-feature-note hero-feature-note-${note.tone}`}
          onClick={() => onChange(index => (index + 1) % HERO_NOTES.length)}
          aria-label={`${note.title} Select the next note`}
        >
          <span className="hero-note-tape" aria-hidden="true" />
          <span className="hero-note-meta"><span>{note.label}</span><NoteIcon size={18} /></span>
          <strong key={note.title} className="hero-note-quote">{note.title}</strong>
          <span className="hero-note-detail">{note.detail}</span>
          <span className="hero-note-foot"><span>THERE’S A PLACE TO START</span><ArrowUpRight size={17} /></span>
        </button>
      </div>
      <div className="hero-note-controls">
        <div className="hero-note-dots" role="tablist" aria-label="Choose a note">
          {HERO_NOTES.map((item, index) => <button key={item.tone} id={`hero-note-tab-${index}`} type="button" role="tab" aria-controls="hero-note-panel" aria-label={item.label} aria-selected={active === index} onClick={() => onChange(index)} />)}
        </div>
        <button type="button" className="hero-note-motion" onClick={toggleRotation} aria-label={manuallyPaused ? 'Play note rotation' : 'Pause note rotation'}>
          {manuallyPaused ? <Play size={13} /> : <Pause size={13} />}
          <span>{manuallyPaused ? 'PLAY' : 'PAUSE'}</span>
        </button>
      </div>
      <p className="hero-note-caption">A small frustration can be the beginning of a useful idea.</p>
    </div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [year, setYear] = useState(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [activeFaq, setActiveFaq] = useState(0);
  const [activeHeroNote, setActiveHeroNote] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [signOutPending, setSignOutPending] = useState(false);
  const changeHeroNote = React.useCallback((update) => setActiveHeroNote(update), []);
  const heroRef = useRef(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, user => {
      setIsAuthenticated(Boolean(user));
      if (user) router.replace('/explore');
    });
  }, [router]);

  const handleHomeSignOut = async () => {
    if (signOutPending) return;
    setSignOutPending(true);
    try {
      const signOutTask = auth ? signOut(auth) : Promise.resolve();
      router.replace('/thanks');
      await signOutTask;
    } catch (error) {
      console.error('Unable to sign out:', error);
      router.replace('/');
      setSignOutPending(false);
    }
  };

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

  const filteredProblems = [];

  return (
    <div className="bg-background text-on-surface antialiased min-h-screen flex flex-col">
      <header
        aria-hidden={!headerVisible}
        onFocusCapture={() => setHeaderVisible(true)}
        className={`sticky top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl transition-transform duration-300 ease-in-out ${headerVisible ? 'translate-y-0' : 'pointer-events-none -translate-y-full'}`}
      >
        <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-5 py-4 sm:px-6">
          <Link href={isAuthenticated ? '/explore' : '/'} className="group flex items-center gap-3">
            <ItchBrand />
          </Link>

          <nav className="flex items-center gap-2 sm:gap-3">
            {isAuthenticated ? <>
              <VoltageLink href="/explore" className="home-nav-voltage-link">
                Explore Problems
              </VoltageLink>
              <VoltageLink href="/community" className="home-nav-voltage-link">
                Community
              </VoltageLink>
              <VoltageLink href="/problems/new" className="home-voltage-link">
                Post a Problem
              </VoltageLink>
              <button type="button" onClick={handleHomeSignOut} disabled={signOutPending} className="home-header-signout" aria-label="Sign out">{signOutPending ? 'Signing out…' : 'Sign out'}</button>
            </> : <>
              <VoltageLink href="/explore" className="home-nav-voltage-link">
                Explore Problems
              </VoltageLink>
              <VoltageLink href="/auth" className="home-voltage-link">
                Sign in/up
              </VoltageLink>
            </>}
          </nav>
        </div>
      </header>

      <main className="home-page-main flex-1">
        <section
          ref={heroRef}
          className="home-hero relative overflow-hidden px-5 pb-16 pt-6 sm:pt-8"
        >
          <div data-hero-background className="home-hero-backdrop pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <span className="hero-backdrop-orbit hero-backdrop-orbit-one" />
            <span className="hero-backdrop-orbit hero-backdrop-orbit-two" />
            <span className="hero-backdrop-cross hero-backdrop-cross-one">+</span>
            <span className="hero-backdrop-cross hero-backdrop-cross-two">+</span>
          </div>

          <div className="relative mx-auto max-w-[1180px]">
            <div className="hero-layout">
              <div data-hero-content className="hero-main-content">
                <div className="hero-kicker animate-fade-up delay-75"><span /> A place for everyday problems</div>

                <h1 className="home-hero-title animate-fade-up delay-100">
                  <span>That little thing</span>
                  <span>that bugs you?</span>
                  <span className="home-hero-title-accent">It matters.</span>
                </h1>

                <p className="hero-description animate-fade-up delay-150">
                  Write down what keeps getting in your way. Find people who recognize it, and help builders see what’s worth fixing.
                </p>

                <div className="hero-actions animate-fade-up delay-200">
                  <Link href="/problems/new" className="hero-primary-action">
                    <PencilLine className="h-4 w-4" /> Put it into words <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link href="/explore" className="hero-secondary-action">
                    <Search className="h-4 w-4" /> Browse problems
                  </Link>
                </div>

                <div className="hero-reassurance animate-fade-up delay-300">
                  <span><CheckCircle2 size={15} /> Sign in to publish</span>
                  <i />
                  <span><ShieldCheck size={15} /> Your email stays private</span>
                </div>
              </div>

              <HeroNoteFeature active={activeHeroNote} onChange={changeHeroNote} />
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

        <section className="home-process-section home-chapter home-journey home-journey-simple px-5 py-16 sm:py-20">
          <div className="mx-auto max-w-[980px]">
            <header data-scroll-reveal className="scroll-reveal journey-simple-heading">
              <div className="journey-simple-intro">
                <h2><span>From “this is annoying”</span><span>to “this could be better.”</span></h2>
                <p>Choose a step to see how Itch helps people share a problem, find support, join a conversation, and connect ideas with builders.</p>
              </div>
            </header>
            <InteractiveFlowChat />
          </div>
        </section>

        <section className="home-scope-section home-chapter home-preview-chapter px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-[980px]">
            <header className="home-actions-heading"><p className="home-section-eyebrow"><span/> START WHERE YOU ARE</p><h2>Make the next step a small one.</h2><p>Write down what’s getting in your way, find a familiar problem, or follow a topic that matters to you.</p></header>
            <div className="home-action-notes">
              <Link href="/problems/new" className="home-action-note home-action-note-write"><span className="home-action-note-top">01 <PencilLine size={17}/></span><strong>Write it down</strong><p>Turn one frustrating moment into a clear problem.</p><span className="home-action-note-link">Post a problem <ArrowUpRight size={15}/></span></Link>
              <Link href="/explore" className="home-action-note home-action-note-explore"><span className="home-action-note-top">02 <Search size={17}/></span><strong>Find what feels familiar</strong><p>Browse problems and search by topic.</p><span className="home-action-note-link">Explore problems <ArrowUpRight size={15}/></span></Link>
              <Link href="/community" className="home-action-note home-action-note-follow"><span className="home-action-note-top">03 <Users size={17}/></span><strong>Follow a topic</strong><p>Keep conversations around your interests close.</p><span className="home-action-note-link">Visit community <ArrowUpRight size={15}/></span></Link>
            </div>
          </div>
        </section>

        <section className="home-faq-section home-chapter home-answers px-5 py-20 sm:py-28">
          <div className="mx-auto max-w-[780px]">
            <div data-scroll-reveal className="scroll-reveal home-faq-intro"><h2>Before you get started.</h2></div>
            <div data-scroll-stagger className="home-qa-explorer" aria-label="Frequently asked questions">
              {FAQ.map((item, index) => <article className={`home-faq-item ${activeFaq === index ? 'is-open' : ''}`} key={item.q}>
                <button type="button" aria-expanded={activeFaq === index} aria-controls={`home-faq-answer-${index}`} onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}>
                  <strong>{item.q}</strong><span aria-hidden="true">{activeFaq === index ? '−' : '+'}</span>
                </button>
                <div id={`home-faq-answer-${index}`} className={`home-faq-answer ${activeFaq === index ? 'is-open' : ''}`} aria-hidden={activeFaq !== index}><p>{item.a}</p></div>
              </article>)}
            </div>
          </div>
        </section>

        <section className="home-closing-section px-5 py-16 sm:py-24">
          <div data-scroll-reveal className="scroll-reveal home-closing-panel mx-auto max-w-[1180px]">
            <span className="home-closing-orbit" aria-hidden="true"/><div className="home-closing-copy"><p className="home-section-eyebrow"><span/> START WITH ONE SMALL THING</p><h2>What keeps getting<br/>in your way?</h2><p>Give that everyday frustration a place to start.</p></div>
            <div className="home-closing-actions"><Link href="/problems/new" className="home-closing-primary">Write it down <ArrowRight size={17}/></Link><Link href="/explore" className="home-closing-secondary">Explore problems <ArrowUpRight size={16}/></Link></div>
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
              <li><Link href="/about" className="transition hover:text-white">About</Link></li>
              <li><Link href="/how-it-works" className="transition hover:text-white">How it works</Link></li>
              <li><Link href="/explore" className="transition hover:text-white">Explore</Link></li>
              <li><Link href="/community" className="transition hover:text-white">Community</Link></li>
              <li><Link href="/problems/new" className="transition hover:text-white">Post a Problem</Link></li>
            </ul>
          </div>

          <div>
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Legal</p>
            <ul className="space-y-2 text-sm text-tertiary/70">
              <li><Link href="/community-guidelines" className="transition hover:text-white">Community Guidelines</Link></li>
              <li><Link href="/privacy" className="transition hover:text-white">Privacy</Link></li>
              <li><Link href="/terms" className="transition hover:text-white">Terms</Link></li>
              <li><Link href="/contact" className="transition hover:text-white">Contact</Link></li>
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
