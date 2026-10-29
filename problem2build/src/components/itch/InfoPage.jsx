'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, CornerDownRight, Mail, NotebookPen } from 'lucide-react';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';

const defaultSteps = [
  { title: 'Name the itch', kicker: '01 — notice it', text: 'Start with one small, specific moment that takes more effort than it should.', note: 'What keeps taking more effort than it should?' },
  { title: 'See who gets it', kicker: '02 — find your people', text: 'Compare experiences. Someone else may have found a workaround, or be wishing for the same fix.', note: 'Wait, I thought it was just me.' },
  { title: 'Make it easier to fix', kicker: '03 — give it a nudge', text: 'A clear problem gives makers somewhere real to begin: a person, a moment, a need.', note: 'Now there’s something to build on.' },
];

function SectionHeading({ eyebrow, title, intro }) {
  return <header className="editorial-heading"><span className="editorial-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></header>;
}

function HowItWorks({ sections }) {
  const steps = sections.slice(0, 3).map((section, index) => ({ ...defaultSteps[index], ...section, text: section.body || defaultSteps[index].text }));
  const [active, setActive] = useState(0);
  return (
    <div className="story-layout">
      <section className="story-panel" aria-live="polite" key={active}>
        <div className="story-note"><span className="note-tape" /><span className="story-note-kicker">{steps[active].kicker || defaultSteps[active].kicker}</span><p>{steps[active].note || defaultSteps[active].note}</p><span className="note-scribble">✳</span></div>
        <div className="story-caption"><span>THE ITCH →</span><strong>{String(active + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}</strong></div>
      </section>
      <div className="story-steps" role="tablist" aria-label="How Itch works">
        {steps.map((step, index) => <button key={step.title} type="button" role="tab" aria-selected={active === index} className={`story-step ${active === index ? 'is-active' : ''}`} onClick={() => setActive(index)}>
          <span className="story-step-number">0{index + 1}</span><span className="story-step-copy"><strong>{step.title}</strong><span>{step.text}</span></span><ArrowRight className="story-step-arrow" size={18} />
        </button>)}
        <p className="preview-note"><span className="preview-dot" /> Published problems and replies are stored in the Itch community. Your email stays private.</p>
      </div>
    </div>
  );
}

function FounderNote() {
  return <section className="founder-note founder-note-compact" aria-label="Developer">
    <p>Itch is developed by <strong>Prasad</strong>.</p>
  </section>;
}

function ReadingRoom({ sections, eyebrow }) {
  const [open, setOpen] = useState(0);
  return <div className="reading-room">
    <div className="reading-side"><span className="editorial-eyebrow">{eyebrow}</span><p>How Itch works: share a problem, explore what others face, and join a conversation.</p><button onClick={() => setOpen(open === -1 ? 0 : -1)}>{open === -1 ? 'Open first note' : 'Close all notes'} <ArrowDownRight size={15}/></button></div>
    <div className="reading-list">
      {sections.map((section, index) => <section className={`reading-item ${open === index ? 'is-open' : ''}`} key={section.title}>
        <button className="reading-trigger" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
          <span className="reading-index">{String(index + 1).padStart(2, '0')}</span><span>{section.title}</span><ChevronDown size={18} className="reading-chevron" />
        </button>
        <div className="reading-answer" hidden={open !== index}><p>{section.body}</p></div>
      </section>)}
    </div>
  </div>;
}

function ContactDesk({ email }) {
  const [topic, setTopic] = useState('A little feedback');
  const [message, setMessage] = useState('');
  const subject = encodeURIComponent(`Itch — ${topic}`);
  const body = encodeURIComponent(message || 'Hi Itch,\n\n');
  return <div className="contact-desk">
    <section className="contact-prompt"><span className="editorial-eyebrow">The inbox is open</span><h2>Have a thought? Pass it over.</h2><p>A rough note is fine. We like the kind that starts with “I noticed…”</p><div className="contact-postmark"><Mail size={19}/><span>NO FORMS. NO FUSS.</span></div></section>
    <section className="contact-compose">
      <label htmlFor="contact-topic">What’s it about?</label>
      <select id="contact-topic" value={topic} onChange={event => setTopic(event.target.value)}><option>A little feedback</option><option>A question</option><option>An idea for Itch</option><option>Something else</option></select>
      <label htmlFor="contact-message">Write a few words</label>
      <textarea id="contact-message" maxLength={1200} placeholder="I noticed…" value={message} onChange={event => setMessage(event.target.value)} />
      <div className="compose-bottom"><span>{message.length} / 1200</span>{email ? <a className="mail-send" href={`mailto:${email}?subject=${subject}&body=${body}`}>Open email <ArrowUpRight size={16}/></a> : <span className="email-unset">Email link will appear when an address is connected.</span>}</div>
    </section>
  </div>;
}

export default function InfoPage({ eyebrow, title, intro, sections = [], email, pageType = 'reading' }) {
  const how = pageType === 'how';
  const about = pageType === 'about';
  const contact = pageType === 'contact';
  return <div className="info-shell">
    <ItchHeader />
    <main id="main-content" className={`editorial-page editorial-${pageType}`}>
      <div className="editorial-topline"><Link href="/" className="editorial-back"><ArrowLeft size={15}/> BACK TO ITCH</Link><span>FIELD NOTES <i>•</i> {eyebrow}</span></div>
      <SectionHeading eyebrow={eyebrow} title={title} intro={intro}/>
      {how ? <HowItWorks sections={sections}/> : about ? <FounderNote/> : contact ? <ContactDesk email={email}/> : <ReadingRoom sections={sections} eyebrow={eyebrow}/>}
      <div className="editorial-bottom"><span><NotebookPen size={15}/> A SMALL NOTE FROM ITCH</span><Link href="/explore">See what people are talking about <CornerDownRight size={16}/></Link></div>
    </main>
    <ItchFooter />
  </div>;
}
