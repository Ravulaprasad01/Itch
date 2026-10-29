import { ArrowDownRight, ArrowRight, Check, HeartHandshake } from 'lucide-react';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';
import ThanksRedirectButton from '@/components/itch/ThanksRedirectButton';

export const metadata = { title: 'Thanks for showing up' };

const nextSteps = [
  { marker: 'SHARED', title: 'A problem is seen', note: 'A small friction gets a place to be seen.' },
  { marker: 'FOUND', title: 'Someone recognizes it', note: 'Other people can find the experience familiar.' },
  { marker: 'NEXT', title: 'The conversation continues', note: 'The community decides what might help next.' },
];

export default function ThanksPage() {
  return <div className="min-h-[100svh] bg-background text-on-surface">
    <ItchHeader />
    <main id="main-content" className="thanks-page">
      <section className="thanks-receipt" aria-labelledby="thanks-title">
        <div className="thanks-receipt-index"><span><Check size={14} strokeWidth={2.5} /></span><b>SESSION ENDED</b><i>ITCH / COMMUNITY</i></div>
        <div className="thanks-receipt-body">
          <div className="thanks-receipt-copy">
            <h1 id="thanks-title">Thanks for<br /><em>showing up.</em></h1>
            <p className="thanks-note">A small note before you go</p>
            <p className="thanks-copy">You’re signed out. Every problem shared makes an everyday frustration easier to see—and easier for someone else to recognize.</p>
            <div className="thanks-route-wrap">
              <p className="thanks-route-label"><ArrowDownRight size={14} /> YOUR NEXT STEP</p>
              <ThanksRedirectButton />
            </div>
          </div>
          <aside className="thanks-contribution" aria-label="How a contribution moves through Itch">
            <div className="thanks-contribution-head"><HeartHandshake size={18} /><span>WHAT A CONTRIBUTION CAN DO</span></div>
            <div className="thanks-contribution-list">
              {nextSteps.map((item, index) => <div className="thanks-contribution-step" key={item.n}>
                <span className="thanks-step-marker">{item.marker}</span>
                <div><strong>{item.title}</strong><p>{item.note}</p></div>
                {index < nextSteps.length - 1 && <span className="thanks-step-connector" aria-hidden="true" />}
              </div>)}
            </div>
            <p className="thanks-contribution-foot">NO SPOTLIGHT NEEDED. JUST ONE HONEST STORY.</p>
          </aside>
        </div>
        <div className="thanks-receipt-foot"><span>THANK YOU FOR BEING PART OF ITCH</span><span>ITCH / 001</span></div>
      </section>
    </main>
    <ItchFooter />
  </div>;
}
