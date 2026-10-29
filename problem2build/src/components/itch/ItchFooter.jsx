'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ItchFooter() {
  const [year, setYear] = useState(null);
  useEffect(() => { setYear(new Date().getFullYear()); }, []);

  return (
    <footer className="itch-site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-main">
          <div className="site-footer-brand">
            <Link href="/" className="site-footer-logo" aria-label="Itch home">
              <Image src="/itch-mark.svg" alt="" width={36} height={36} />
              <span>Itch<span>.</span></span>
            </Link>
            <p>A place to share everyday problems, find people who understand, and help useful ideas take shape.</p>
            <Link href="/explore" className="site-footer-cta">Explore the community <span aria-hidden="true">↗</span></Link>
          </div>
          <nav className="site-footer-links" aria-label="Explore Itch">
            <h2>Explore</h2>
            <Link href="/explore">Problems</Link>
            <Link href="/community">Community</Link>
            <Link href="/discover">For builders</Link>
          </nav>
          <nav className="site-footer-links" aria-label="About Itch">
            <h2>About</h2>
            <Link href="/about">Our story</Link>
            <Link href="/how-it-works">How it works</Link>
            <Link href="/community-guidelines">Guidelines</Link>
          </nav>
          <nav className="site-footer-links" aria-label="More information">
            <h2>More</h2>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
        <div className="site-footer-bottom">
          <span>{year ? `© ${year} Itch.` : 'Itch.'} Share with care.</span>
          <span>Your email stays private. Published problems are public.</span>
        </div>
      </div>
    </footer>
  );
}
