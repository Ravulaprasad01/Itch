import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';

function EverydayMoment() {
  return (
    <div className="story-moment" data-ui="problem-composer-example" aria-label="Illustrative everyday problem post">
      <span className="story-moment-label">AN EVERYDAY MOMENT</span>
      <p>“I had to start all over—again.”</p>
      <div className="story-moment-context">
        <span>What happens?</span>
        <span>Who else runs into this?</span>
      </div>
    </div>
  );
}

export default function OurStory() {
  return (
    <div className="story-redesign">
      <ItchHeader />
      <main id="main-content">
        <section className="story-opening" aria-labelledby="story-title">
          <div className="story-opening-copy">
            <h1 id="story-title">The little things <em>matter.</em></h1>
            <p>Itch is a community where people share everyday problems, find others facing the same friction, and help builders understand what needs attention.</p>
            <Link className="story-opening-link" href="/explore">Explore conversations <ArrowRight size={18} /></Link>
          </div>
          <div className="story-opening-art">
            <div className="story-bubble-shape" aria-hidden="true" />
            <EverydayMoment />
            <a className="story-scroll-cue" href="#story-begins">Our reason <ArrowDown size={15} /></a>
          </div>
        </section>

        <section className="story-begins" id="story-begins" aria-labelledby="story-begins-title">
          <div className="story-begins-statement">
            <h2 id="story-begins-title">Start by understanding.</h2>
          </div>
          <div className="story-begins-copy">
            <p>Every post starts with a real moment: what someone was trying to do, what got in the way, and who else is affected. Other people can add their experience, so builders see the need behind a request—not just a feature idea.</p>
            <p>Itch doesn’t promise a fix or decide which idea wins. It gives the people living with a problem a place to be heard, and gives the conversation somewhere useful to begin.</p>
            <div className="story-founder"><strong>Prasad</strong><span>Founder, Itch</span></div>
            <Link className="story-begins-link" href="/explore">See what people are sharing <ArrowRight size={18} /></Link>
          </div>
        </section>
      </main>
      <ItchFooter />
    </div>
  );
}
