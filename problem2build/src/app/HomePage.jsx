'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, ArrowUpRight, Shield, Users, Pencil, Heart, Code2, Search,
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import ItchFooter from '@/components/itch/ItchFooter';

function ItchMark({ small = false }) {
  return <span className={`itch-mark ${small ? 'itch-mark-small' : ''}`} aria-hidden="true"><i/><b>!</b></span>;
}

function SiteHeader({ authenticated }) {
  return <header className="cinema-header">
    <Link href="/explore" className="cinema-brand" aria-label="Explore problems on Itch"><ItchMark/><span>itch<span className="brand-dot">.</span></span></Link>
    <nav aria-label="Main navigation">
      <Link href="/explore">Explore</Link><Link href="/discover">For builders</Link>{authenticated && <Link href="/community">Community</Link>}
    </nav>
    <div className="cinema-header-actions">{!authenticated && <Link className="cinema-signin" href="/auth">Sign in</Link>}{authenticated && <Link className="cinema-share" href="/problems/new">Share a problem <ArrowUpRight size={15}/></Link>}</div>
  </header>;
}

function RecentCommunityProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      setLoadError(true);
      return undefined;
    }

    let settled = false;
    const timeout = window.setTimeout(() => {
      if (settled) return;
      setLoading(false);
      setLoadError(true);
    }, 9000);
    const unsubscribe = onSnapshot(query(collection(db, 'problems'), where('moderationStatus', '==', 'visible')), snapshot => {
      settled = true;
      window.clearTimeout(timeout);
      const recentProblems = snapshot.docs
        .map(problemDoc => {
          const data = problemDoc.data();
          if (typeof data.title !== 'string' || typeof data.description !== 'string') return null;
          return {
            id: problemDoc.id,
            title: data.title,
            description: data.description,
            category: typeof data.category === 'string' ? data.category : data.category?.name || 'Community',
            meTooCount: Number.isInteger(data.meTooCount) ? data.meTooCount : 0,
            createdAt: data.createdAt?.toMillis?.() || 0,
          };
        })
        .filter(Boolean)
        .sort((left, right) => right.createdAt - left.createdAt)
        .slice(0, 4);

      setProblems(recentProblems);
      setLoading(false);
      setLoadError(false);
    }, () => {
      settled = true;
      window.clearTimeout(timeout);
      setLoading(false);
      setLoadError(true);
    });
    return () => { window.clearTimeout(timeout); unsubscribe(); };
  }, []);

  return <section className="home-recent" aria-labelledby="home-recent-title">
    <div className="home-recent-heading">
      <div><p className="cinema-eyebrow">From the community</p><h2 id="home-recent-title">Real problems. <em>Right now.</em></h2></div>
      <span className="home-recent-live"><i aria-hidden="true"/>Recent posts</span>
    </div>
    {loading ? <p className="home-recent-status" role="status">Loading recent problems…</p>
      : loadError ? <p className="home-recent-status" role="status">Recent problems are temporarily unavailable. You can still <Link href="/explore">explore the community</Link>.</p>
        : problems.length === 0 ? <p className="home-recent-status">No problems have been shared yet. Be the first to start a conversation.</p>
          : <div className="home-recent-grid">
            {problems.map((problem, index) => <Link className="home-problem-card" href={`/problems/${problem.id}`} key={problem.id}>
              <span className="home-problem-card-top"><span>{problem.category}</span><span>0{index + 1}</span></span>
              <h3>{problem.title}</h3>
              <p>{problem.description}</p>
              <span className="home-problem-card-bottom"><span>{problem.meTooCount} {problem.meTooCount === 1 ? 'person relates' : 'people relate'}</span><ArrowUpRight size={16} aria-hidden="true"/></span>
            </Link>)}
          </div>}
  </section>;
}

function Hero() {
  const planets = [
    { name: 'Share', icon: Pencil, detail: 'Describe what is getting in your way.' },
    { name: 'Support', icon: Heart, detail: 'Find people who recognize the same friction.' },
    { name: 'Build', icon: Code2, detail: 'Turn useful context into a better next step.' },
    { name: 'Discover', icon: Search, detail: 'Explore problems shared by the community.' },
  ];
  const [activePlanet, setActivePlanet] = useState(0);
  return <section className="cinema-hero" aria-labelledby="hero-title">
    <div className="hero-copy">
      <p className="cinema-eyebrow"><span className="eyebrow-pulse"/> A place for everyday problems</p>
      <p className="hero-community-promise">Anyone can post a problem. <span>Anyone can build the fix.</span></p>
      <h1 id="hero-title"><span>Share it,</span> <em>Support it,</em> <strong>Build it.</strong></h1>
      <h2 className="hero-subheading">Every problem deserves to be heard.</h2>
      <p className="hero-lede">Describe what’s getting in your way, find people who understand, or explore real problems where your skills could help.</p>
      <div className="hero-actions"><Link className="button-lime" href="/explore">Explore problems <ArrowRight size={17}/></Link></div>
      <div className="hero-proof"><span><Shield size={14}/> Your email stays private</span><span><Users size={14}/> Real experiences, shared by people</span></div>
    </div>
    <div className="solar-widget" aria-label="Itch community solar system">
      <div className="solar-system">
        <span className="solar-orbit solar-orbit-outer"><button type="button" className={`solar-planet solar-planet-discover ${activePlanet === 3 ? 'is-active' : ''}`} onClick={() => setActivePlanet(3)} aria-pressed={activePlanet === 3}><span><Search size={15}/>Discover</span></button></span>
        <span className="solar-orbit solar-orbit-middle"><button type="button" className={`solar-planet solar-planet-build ${activePlanet === 2 ? 'is-active' : ''}`} onClick={() => setActivePlanet(2)} aria-pressed={activePlanet === 2}><span><Code2 size={15}/>Build</span></button></span>
        <span className="solar-orbit solar-orbit-inner"><button type="button" className={`solar-planet solar-planet-share ${activePlanet === 0 ? 'is-active' : ''}`} onClick={() => setActivePlanet(0)} aria-pressed={activePlanet === 0}><span><Pencil size={15}/>Share</span></button></span>
        <span className="solar-orbit solar-orbit-support"><button type="button" className={`solar-planet solar-planet-support ${activePlanet === 1 ? 'is-active' : ''}`} onClick={() => setActivePlanet(1)} aria-pressed={activePlanet === 1}><span><Heart size={15}/>Support</span></button></span>
        <div className="solar-sun"><ItchMark/><b>itch.</b><small>EVERYDAY PROBLEMS</small></div>
      </div>
      <div className="solar-caption" aria-live="polite"><span className="solar-caption-dot"/><span><b>{planets[activePlanet].name}</b>{planets[activePlanet].detail}</span></div>
      <p className="solar-note">One community. Many problems worth solving.</p>
    </div>
    <a href="#home-recent-title" className="hero-scroll-cue"><span>Meet the community</span><ArrowRight size={14}/></a>
  </section>;
}

export default function LandingPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, user => { setAuthenticated(Boolean(user)); if (user) router.replace('/explore'); });
  }, [router]);

  return <div className="itch-cinematic-home">
    <SiteHeader authenticated={authenticated}/>
    <main id="main-content">
      <Hero/>
      <RecentCommunityProblems/>
    </main>
    <ItchFooter />
  </div>;
}
