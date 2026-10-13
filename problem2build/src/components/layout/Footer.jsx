import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-24 py-12 text-xs text-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Image src="/itch-mark.svg" alt="" width={24} height={24} className="h-6 w-6 rounded-md" />
            <span className="font-extrabold text-sm text-white tracking-tight">Itch.</span>
            <span className="text-border-hi">|</span>
            <span className="text-neutral font-medium italic">
              &quot;Got a problem? Somebody&apos;s itching to solve it.&quot;
            </span>
          </div>
          <p className="text-[11px] text-muted">
            Share everyday problems, find people who understand them, and help builders see what matters.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]">
          <span>© {new Date().getFullYear()} Itch Platform</span>
          <Link href="/about" className="hover:text-accent transition-colors">About</Link>
          <Link href="/how-it-works" className="hover:text-accent transition-colors">How it works</Link>
          <Link href="/privacy" className="hover:text-accent transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-accent transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
