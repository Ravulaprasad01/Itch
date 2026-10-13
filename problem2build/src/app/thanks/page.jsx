import { Heart } from 'lucide-react';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';
import ThanksRedirectButton from '@/components/itch/ThanksRedirectButton';

export default function ThanksPage() {
  return <div className="min-h-screen bg-background text-on-surface">
    <ItchHeader />
    <main className="mx-auto flex min-h-[calc(100vh-80px)] max-w-5xl items-center justify-center px-5 pb-20 pt-28 sm:px-8">
      <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-surface-container/50 px-6 py-12 text-center shadow-2xl sm:px-12 sm:py-16">
        <div className="mx-auto mb-7 grid h-16 w-16 place-items-center rounded-full border border-secondary/30 bg-secondary/10 text-secondary">
          <Heart size={27} fill="currentColor" strokeWidth={1.4} />
        </div>
        <p className="font-mono text-[10px] font-semibold tracking-[.2em] text-secondary">A NOTE FROM ITCH</p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Thanks for contributing.</h1>
        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-on-surface-variant">
          You’re signed out. Every problem shared helps make everyday frustrations easier to see and solve. Thanks for being part of Itch.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ThanksRedirectButton />
        </div>
      </section>
    </main>
    <ItchFooter />
  </div>;
}
