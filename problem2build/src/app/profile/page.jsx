'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { ArrowRight, BadgeCheck, Code2, LoaderCircle, MessageSquareText, Star, UserRound, Wrench } from 'lucide-react';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';
import { auth, db, saveAccountType } from '@/lib/firebase';

const ROLE_COPY = {
  poster: { label: 'Problem poster', icon: UserRound },
  developer: { label: 'Developer', icon: Code2 },
};

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileReady, setProfileReady] = useState(false);
  const [problems, setProblems] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [solved, setSolved] = useState([]);
  const [activityReady, setActivityReady] = useState(false);
  const [savingRole, setSavingRole] = useState(false);
  const [roleNotice, setRoleNotice] = useState('');
  const [roleError, setRoleError] = useState('');

  useEffect(() => {
    if (!auth) { setAuthReady(true); return undefined; }
    return onAuthStateChanged(auth, nextUser => {
      setUser(nextUser);
      setAuthReady(true);
      if (!nextUser) router.replace(`/auth?next=${encodeURIComponent('/profile')}`);
    });
  }, [router]);

  useEffect(() => {
    if (!db || !user?.uid) return undefined;
    setProfileReady(false);
    return onSnapshot(doc(db, 'users', user.uid), snapshot => {
      setProfile(snapshot.exists() ? snapshot.data() : null);
      setProfileReady(true);
    }, () => setProfileReady(true));
  }, [user?.uid]);

  useEffect(() => {
    if (!db || !user?.uid) return undefined;
    setActivityReady(false);
    const stopProblems = onSnapshot(query(collection(db, 'problems'), where('authorId', '==', user.uid)), snapshot => {
      setProblems(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))
        .sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)));
      setActivityReady(true);
    }, () => setActivityReady(true));

    const stopSolved = onSnapshot(collection(db, 'users', user.uid, 'solvedProblems'), snapshot => {
      setSolved(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))
        .sort((a, b) => (b.completedAt?.toMillis?.() || 0) - (a.completedAt?.toMillis?.() || 0)));
    }, () => setSolved([]));

    const stopOpportunities = onSnapshot(query(collection(db, 'problems'), where('moderationStatus', '==', 'visible'), where('status', '==', 'open'), orderBy('createdAt', 'desc'), limit(40)), snapshot => {
      setOpportunities(snapshot.docs.map(item => ({ id: item.id, ...item.data() }))
        );
    }, () => setOpportunities([]));

    return () => { stopProblems(); stopSolved(); stopOpportunities(); };
  }, [user?.uid]);

  const averageRating = useMemo(() => {
    const rated = solved.filter(item => Number.isInteger(item.rating) && item.rating >= 1 && item.rating <= 5);
    return rated.length ? (rated.reduce((sum, item) => sum + item.rating, 0) / rated.length).toFixed(1) : '—';
  }, [solved]);

  const changeRole = async role => {
    if (!user || !profile || role === profile.accountType) return;
    setSavingRole(true);
    setRoleNotice('');
    setRoleError('');
    try {
      await saveAccountType(user, role);
      setRoleNotice(`Your profile is now set to ${ROLE_COPY[role].label.toLowerCase()}.`);
    } catch {
      setRoleError('Could not update your profile mode. Please try again.');
    } finally {
      setSavingRole(false);
    }
  };

  if (!authReady || (user && !profileReady)) {
    return <div className="min-h-dvh"><ItchHeader/><main id="main-content" className="profile-page"><p className="profile-loading"><LoaderCircle size={18} className="animate-spin"/> Loading your profile…</p></main><ItchFooter/></div>;
  }

  if (!user) return <div className="min-h-dvh"><ItchHeader/><main id="main-content" className="profile-page"><h1>Sign in to see your profile</h1><Link className="profile-primary-link" href="/auth">Sign in <ArrowRight size={16}/></Link></main><ItchFooter/></div>;

  const accountType = profile?.accountType;
  const isPoster = accountType === 'poster';
  const isDeveloper = accountType === 'developer';
  const greeting = profile?.displayName || user.displayName || 'Your profile';

  return <div className="min-h-dvh flex flex-col">
    <ItchHeader/>
    <main id="main-content" className="profile-page flex-1">
      <header className="profile-hero">
        <div>
          <p className="profile-kicker">YOUR ITCH PROFILE</p>
          <h1>{greeting}<span>.</span></h1>
          <p className="profile-intro">Your work and your impact, kept in one place.</p>
        </div>
        <div className="profile-mode-control" aria-label="Profile type">
          {Object.entries(ROLE_COPY).map(([role, option]) => {
            const Icon = option.icon;
            return <button key={role} type="button" onClick={() => changeRole(role)} disabled={savingRole || !profile} aria-pressed={accountType === role}>
              <Icon size={16}/>{option.label}
            </button>;
          })}
        </div>
      </header>
      {roleNotice && <p className="profile-inline-notice" role="status">{roleNotice}</p>}
      {roleError && <p className="profile-inline-error" role="alert">{roleError}</p>}

      {!profile && <section className="profile-setup-note"><h2>Finish setting up your profile</h2><p>Choose a display name and profile type to start using Itch.</p><Link href="/auth">Complete profile <ArrowRight size={16}/></Link></section>}
      {profile && !isPoster && !isDeveloper && <section className="profile-setup-note"><h2>Choose your place in Itch</h2><p>Pick a profile mode above. You can change it later.</p></section>}

      {isPoster && <>
        <section className="profile-stat-row" aria-label="Your problem activity">
          <div className="profile-stat-main"><span>PROBLEMS SHARED</span><strong>{activityReady ? problems.length : '—'}</strong><small>Stories you’ve put into the community</small></div>
          <div className="profile-stat-side"><span>OPEN CONVERSATIONS</span><strong>{activityReady ? problems.filter(item => item.status !== 'resolved').length : '—'}</strong><small>Still gathering experiences</small></div>
        </section>
        <section className="profile-list-section">
          <div className="profile-section-heading"><div><p>YOUR CONTRIBUTIONS</p><h2>Problems you shared</h2></div><Link href="/problems/new" className="profile-text-link">Share a problem <ArrowRight size={15}/></Link></div>
          {problems.length ? <div className="profile-problem-list">{problems.map(problem => <Link className="profile-problem-row" href={`/problems/${problem.id}`} key={problem.id}>
            <span className={`profile-status-dot${problem.status === 'resolved' ? ' is-done' : ''}`} aria-hidden="true"/>
            <span className="profile-problem-copy"><small>{problem.category || 'Community problem'} · {problem.status === 'resolved' ? 'RESOLVED' : 'OPEN'}</small><strong>{problem.title}</strong></span>
            <ArrowRight size={17}/>
          </Link>)}</div> : <div className="profile-empty"><MessageSquareText size={22}/><div><strong>Your first problem starts here.</strong><p>Share a moment that keeps getting in the way. People can add their experience and offer solutions.</p></div><Link href="/problems/new">Post a problem <ArrowRight size={15}/></Link></div>}
        </section>
      </>}

      {isDeveloper && <>
        <section className="profile-stat-row profile-developer-stats" aria-label="Your developer record">
          <div className="profile-stat-main"><span>POSTER-VERIFIED SOLVES</span><strong>{solved.length}</strong><small>Problems confirmed solved by their poster</small></div>
          <div className="profile-stat-side"><span>AVERAGE RATING</span><strong>{averageRating === '—' ? '—' : <>{averageRating}<small className="profile-rating-denominator"> / 5</small></>}</strong><small>{solved.length ? `${solved.length} verified ${solved.length === 1 ? 'rating' : 'ratings'}` : 'Ratings appear after a poster confirms a solve'}</small></div>
        </section>
        <section className="profile-list-section profile-solved-section">
          <div className="profile-section-heading"><div><p>YOUR TRACK RECORD</p><h2>Solutions you’ve completed</h2></div><span className="profile-verified-label"><BadgeCheck size={15}/> Poster confirmed</span></div>
          {solved.length ? <div className="profile-problem-list">{solved.map(item => <div className="profile-problem-row profile-solved-row" key={item.id}>
            <BadgeCheck size={17}/><span className="profile-problem-copy"><small>VERIFIED SOLVE</small><strong>{item.problemTitle}</strong></span><span className="profile-row-rating" aria-label={`${item.rating} out of 5 stars`}><Star size={15} fill="currentColor"/>{item.rating}</span>
          </div>)}</div> : <div className="profile-empty"><Wrench size={22}/><div><strong>Your builder record begins with a real result.</strong><p>Offer a clear plan on an open problem. When its poster confirms the solution, it becomes part of your record.</p></div></div>}
        </section>
        <section className="profile-list-section profile-opportunities-section">
          <div className="profile-section-heading"><div><p>OPEN COMMUNITY PROBLEMS</p><h2>Choose one to explore</h2><small className="profile-opportunity-note">Signal interest with one click, then share progress in the conversation. The count shows intent, not a promised solution.</small></div><Link href="/explore" className="profile-text-link">Explore all <ArrowRight size={15}/></Link></div>
          {opportunities.filter(problem => problem.authorId !== user.uid).length ? <div className="profile-opportunity-list">{opportunities.filter(problem => problem.authorId !== user.uid).slice(0, 8).map(problem => <Link className="profile-opportunity" href={`/problems/${problem.id}`} key={problem.id}>
            <span className="profile-opportunity-category">{problem.category || 'Community'}</span><strong>{problem.title}</strong><p>{problem.description?.slice(0, 132)}{problem.description?.length > 132 ? '…' : ''}</p><span className="profile-opportunity-action">View problem and signal interest <ArrowRight size={15}/></span>
          </Link>)}</div> : <div className="profile-empty"><MessageSquareText size={22}/><div><strong>No open opportunities just yet.</strong><p>New community problems will show up here.</p></div></div>}
        </section>
      </>}
    </main>
    <ItchFooter/>
  </div>;
}
