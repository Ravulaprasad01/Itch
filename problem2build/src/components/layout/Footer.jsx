import React from 'react';
import { Flame } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-24 py-12 text-xs text-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className="w-5 h-5 rounded gradient-fire flex items-center justify-center text-bg font-black">
              <Flame className="w-3.5 h-3.5 text-bg fill-bg" />
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">Itch</span>
            <span className="text-border-hi">|</span>
            <span className="text-neutral font-medium italic">
              &quot;Got a problem? Somebody&apos;s itching to solve it.&quot;
            </span>
          </div>
          <p className="text-[11px] text-muted">
            The evidence-first problem marketplace. No vanity upvotes. Pure customer demand: <span className="text-sky-400 font-semibold">Me Too</span>, <span className="text-rose-400 font-semibold">I Want This</span>, and verified pain data.
          </p>
        </div>

        <div className="flex items-center gap-6 text-[11px]">
          <span>© {new Date().getFullYear()} Itch Platform</span>
          <span className="text-border">|</span>
          <span className="hover:text-accent transition-colors cursor-pointer">Scoring Algorithm</span>
          <span className="hover:text-accent transition-colors cursor-pointer">Manifesto</span>
          <span className="hover:text-accent transition-colors cursor-pointer">API</span>
        </div>
      </div>
    </footer>
  );
}
