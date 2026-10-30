'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowRight, ArrowUpRight, Shield, Users, Pencil, Heart, Code2, Search,
} from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import ItchFooter from '@/components/itch/ItchFooter';

function ItchMark({ small = false }) {
  return <span className={`itch-mark ${small ? 'itch-mark-small' : ''}`} aria-hidden="true"><i/><b>!</b></span>;
}

function SiteHeader({ authenticated }) {
  return <header className="cinema-header">
    <Link href="/explore" className="cinema-brand" aria-label="Explore problems on Itch"><ItchMark/><span>itch<span className="brand-dot">.</span></span></Link>
    <nav aria-label="Main navigation">
      <Link href="/explore">Explore</Link>{authenticated && <Link href="/community">Community</Link>}
    </nav>
    <div className="cinema-header-actions">{!authenticated && <Link className="cinema-signin" href="/auth">Sign in</Link>}{authenticated && <Link className="cinema-share" href="/problems/new">Share a problem <ArrowUpRight size={15}/></Link>}</div>
  </header>;
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
      <h1 id="hero-title"><span>Share it.</span> <em>Support it.</em> <strong>Build it.</strong></h1>
      <h2 className="hero-subheading">Every problem deserves to be heard.</h2>
      <p className="hero-lede">Describe what’s getting in your way, find people who understand, or explore real problems where your skills could help.</p>
      <div className="hero-proof"><span><Shield size={14}/> Your email stays private</span><span><Users size={14}/> Real experiences, shared by people</span></div>
      <div className="hero-builder-invitation"><Code2 size={18} aria-hidden="true"/><span><b>Here to build?</b><small>Explore real problems and choose where your skills can help.</small></span><Link href="/discover" aria-label="Explore problems as a builder"><ArrowRight size={17}/></Link></div>
    </div>
    <div className="solar-widget" aria-label="Itch community solar system">
      <div className="solar-system">
        <span className="solar-orbit solar-orbit-outer"><span className="solar-orbit-track"><button type="button" className={`solar-planet solar-planet-discover ${activePlanet === 3 ? 'is-active' : ''}`} onClick={() => setActivePlanet(3)} aria-pressed={activePlanet === 3}><span><Search size={15}/>Discover</span></button></span></span>
        <span className="solar-orbit solar-orbit-middle"><span className="solar-orbit-track"><button type="button" className={`solar-planet solar-planet-build ${activePlanet === 2 ? 'is-active' : ''}`} onClick={() => setActivePlanet(2)} aria-pressed={activePlanet === 2}><span><Code2 size={15}/>Build</span></button></span></span>
        <span className="solar-orbit solar-orbit-inner"><span className="solar-orbit-track"><button type="button" className={`solar-planet solar-planet-share ${activePlanet === 0 ? 'is-active' : ''}`} onClick={() => setActivePlanet(0)} aria-pressed={activePlanet === 0}><span><Pencil size={15}/>Share</span></button></span></span>
        <span className="solar-orbit solar-orbit-support"><span className="solar-orbit-track"><button type="button" className={`solar-planet solar-planet-support ${activePlanet === 1 ? 'is-active' : ''}`} onClick={() => setActivePlanet(1)} aria-pressed={activePlanet === 1}><span><Heart size={15}/>Support</span></button></span></span>
        <div className="solar-sun"><ItchMark/><b>itch.</b><small>EVERYDAY PROBLEMS</small></div>
      </div>
      <div className="solar-caption" aria-live="polite"><span className="solar-caption-dot"/><span><b>{planets[activePlanet].name}</b>{planets[activePlanet].detail}</span></div>
      <p className="solar-note">One community. Many problems worth solving.</p>
    </div>
    <a href="#home-invitation" className="hero-scroll-cue"><span>Scroll to explore</span><ArrowRight size={14}/></a>
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
      <section id="home-invitation" className="home-invitation" aria-labelledby="home-invitation-title"><p className="cinema-eyebrow">A community starts with a click</p><h2 id="home-invitation-title">Nothing to scroll through<br/><em>until you choose to explore.</em></h2><p>When you’re ready, open the live community feed to see what people have shared.</p><Link href="/explore" className="button-lime">Explore problems <ArrowRight size={17}/></Link></section>
    </main>
    <ItchFooter />
  </div>;
}
