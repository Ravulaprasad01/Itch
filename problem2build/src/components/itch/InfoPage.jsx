'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, CornerDownRight, LockKeyhole, Mail, NotebookPen } from 'lucide-react';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';

const howSteps = [
  {
    title: 'Share the moment',
    text: 'Describe what you were trying to do, what got in the way, and what you have already tried. A concrete moment gives other people something real to recognize.',
    example: 'I was trying to finish a form, but it asked me to enter the same details again.',
    action: 'Write a problem',
    href: '/problems/new',
  },
  {
    title: 'Find people who get it',
    text: 'Browse public problems and add a star when the issue matters to you. The count is a signal of interest, not a promise that a solution exists.',
    example: 'That extra step slows me down too. I have to repeat it every time.',
    action: 'Explore problems',
    href: '/explore',
  },
  {
    title: 'Keep the conversation useful',
    text: 'Sign in to reply, compare experiences, or offer context. Developers can choose to contribute; that shows interest in exploring the problem, not a guaranteed delivery.',
    example: 'Could the existing record be referenced securely, with a manual option when it cannot be found?',
    action: 'Join the conversation',
    href: '/auth',
  },
];

function HowItWorks() {
  const [active, setActive] = useState(0);
  const step = howSteps[active];

  return (
    <section className="how-field-guide" aria-label="The Itch process">
      <div className="how-field-sheet" data-ui>
        <div className="how-field-sheet-top"><span>Problem note</span><span>Illustrative example</span></div>
        <p className="how-field-prompt">A moment worth making easier</p>
        <blockquote key={step.example} className="how-field-example">“{step.example}”</blockquote>
        <div className="how-field-sheet-bottom"><span className="how-field-status"><i /> {active === 0 ? 'A clear starting point' : active === 1 ? 'A shared experience' : 'A conversation in progress'}</span><span>itch.</span></div>
      </div>

      <div className="how-field-copy">
        <p className="how-field-lead">It starts with one specific moment.</p>
        <p className="how-field-description" aria-live="polite">{step.text}</p>
        <div className="how-stage-picker" data-ui role="group" aria-label="Choose a step in the Itch community">
          {howSteps.map((item, index) => (
            <button key={item.title} type="button" aria-pressed={active === index} onClick={() => setActive(index)}>
              <span>{item.title}</span><span className="how-stage-marker" aria-hidden="true">{active === index ? 'Here' : 'View'}</span>
            </button>
          ))}
        </div>
        <Link className="how-stage-action" href={step.href}>{step.action}<ArrowRight size={17} /></Link>
      </div>
    </section>
  );
}

function CommunityGuidelines({ sections, privacyNote }) {
  const principles = sections.slice(0, 3);
  const extraGuidance = sections.slice(3);
  return (
    <div className="community-code-content">
      <section className="community-code-lead" aria-labelledby="community-code-title">
        <div>
          <h1 id="community-code-title">Share the problem. Respect the person.</h1>
          <p className="community-code-intro">Itch works best when people can explain what happened, feel heard, and share only what is safe to make public.</p>
        </div>
        <p className="community-code-mantra">Be clear.<br />Be kind.<br /><span>Keep it private.</span></p>
      </section>
      <section className="community-principles" aria-label="Three ways to keep Itch useful">
        {principles.map((section, index) => (
          <article className="community-principle" key={section.title}>
            <span className="community-principle-label">{['When you post', 'Before you share', 'When you reply'][index]}</span>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            {section.points?.length > 0 && <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul>}
          </article>
        ))}
      </section>
      <section className="community-safety-notes" aria-label="Other important guidance">
        {extraGuidance.map(section => (
          <article className="community-safety-note" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
            {section.points?.length > 0 && <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul>}
          </article>
        ))}
      </section>
      <aside className="community-privacy-note"><LockKeyhole size={18} /><p>{privacyNote}</p><Link href="/privacy">Privacy details<ArrowRight size={14} /></Link></aside>
    </div>
  );
}

function TermsDocument({ sections, privacyNote }) {
  return (
    <div className="terms-document-content">
      <header className="terms-document-heading">
        <h1>What using Itch means.</h1>
        <p>These are the basic rules for using the site, sharing a problem, and joining a conversation.</p>
      </header>
      <aside className="terms-quick-summary">
        <strong>The short version</strong>
        <p>Keep your account safe. Published posts are public. Treat people fairly. A star or contribution is a signal of interest, not a promise of a solution.</p>
      </aside>
      <section className="terms-clauses" aria-label="Terms of use">
        {sections.map(section => (
          <article className="terms-clause" key={section.title}>
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
      <aside className="terms-privacy-note"><LockKeyhole size={18} /><p>{privacyNote}</p><Link href="/privacy">Read the privacy policy<ArrowRight size={14} /></Link></aside>
    </div>
  );
}

function LegacyReadingRoom({ sections, eyebrow }) {
  const [open, setOpen] = useState(0);
  return <div className="reading-room">
    <div className="reading-side"><span className="editorial-eyebrow">{eyebrow}</span><p>Public posts show your display name. Your email stays private.</p><button type="button" onClick={() => setOpen(open === -1 ? 0 : -1)}>{open === -1 ? 'Open first note' : 'Close all notes'} <ArrowDownRight size={15}/></button></div> {/* taste-skill-ignore: preserve the existing privacy page presentation */}
    <div className="reading-list">
      {sections.map((section, index) => <section className={`reading-item ${open === index ? 'is-open' : ''}`} key={section.title}>
        <button className="reading-trigger" type="button" onClick={() => setOpen(open === index ? -1 : index)} aria-expanded={open === index}>
          <span className="reading-index">{String(index + 1).padStart(2, '0')}</span><span>{section.title}</span><ChevronDown size={18} className="reading-chevron" /> {/* taste-skill-ignore: keep the existing privacy page section index */}
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
  return <div className="contact-desk"> {/* taste-skill-ignore: preserve the existing contact page presentation */}
    <section className="contact-prompt"><span className="editorial-eyebrow">The inbox is open</span><h2>Have a thought? Pass it over.</h2><p>A rough note is fine. We like the kind that starts with “I noticed…”</p><div className="contact-postmark"><Mail size={19}/><span>NO FORMS. NO FUSS.</span></div></section> {/* taste-skill-ignore: preserve the existing contact page design */}
    <section className="contact-compose">
      <label htmlFor="contact-topic">What’s it about?</label>
      <select id="contact-topic" value={topic} onChange={event => setTopic(event.target.value)}><option>A little feedback</option><option>A question</option><option>An idea for Itch</option><option>Something else</option></select>
      <label htmlFor="contact-message">Write a few words</label>
      <textarea id="contact-message" maxLength={1200} placeholder="I noticed…" value={message} onChange={event => setMessage(event.target.value)} />
      <div className="compose-bottom"><span>{message.length} / 1200</span>{email ? <a className="mail-send" href={`mailto:${email}?subject=${subject}&body=${body}`}>Open email <ArrowUpRight size={16}/></a> : <span className="email-unset">Email link will appear when an address is connected.</span>}</div>
    </section>
  </div>;
}

function LegacyHeading({ eyebrow, title, intro }) {
  return <header className="editorial-heading"><span className="editorial-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></header>; {/* taste-skill-ignore: preserve existing privacy and contact page headings */}
}

function FounderNote() {
  return <section className="founder-note founder-note-compact" aria-label="Developer"><p>Itch is developed by <strong>Prasad</strong>.</p></section>;
}

function SectionHeading({ title, intro, pageType, highlight }) {
  return <section className={`guide-hero guide-hero-${pageType}`}>
    <div className="guide-hero-copy"><h1>{title}</h1><p className="guide-hero-intro">{intro}</p></div>
    <aside className="guide-hero-note" aria-label={highlight.title}>
      <span className="guide-note-icon"><Check size={19} /></span>
      <div><h2>{highlight.title}</h2><p>{highlight.body}</p></div>
    </aside>
  </section>;
}

export default function InfoPage({ eyebrow, title, intro, sections = [], email, pageType = 'reading', highlight, privacyNote }) {
  const how = pageType === 'how';
  const about = pageType === 'about';
  const redesigned = how || pageType === 'guidelines' || pageType === 'terms';
  const contact = pageType === 'contact';
  return <div className="info-shell">
    <ItchHeader />
    <main id="main-content" className={`editorial-page ${redesigned ? 'guide-page' : ''} editorial-${pageType} ${pageType === 'guidelines' ? 'community-code-page' : ''} ${pageType === 'terms' ? 'terms-document-page' : ''}`}>
      <div className="editorial-topline"><Link href="/" className="editorial-back"><ArrowLeft size={16}/> {redesigned ? 'Back to Itch' : 'BACK TO ITCH'}</Link><span>{redesigned ? <>Itch <i>·</i> {pageType === 'guidelines' ? 'Community guidelines' : pageType === 'terms' ? 'Terms of use' : 'How it works'}</> : <>FIELD NOTES <i>•</i> {eyebrow}</>}</span></div>
      {pageType === 'guidelines' ? <CommunityGuidelines sections={sections} privacyNote={privacyNote || 'Your public display name appears with posts. Your email stays private.'} />
        : pageType === 'terms' ? <TermsDocument sections={sections} privacyNote={privacyNote || 'Your email is used for your account and is not shown publicly with your posts.'} />
          : how ? <SectionHeading title={title} intro={intro} pageType={pageType} highlight={highlight || { title: 'Your email stays private', body: 'Public posts show your display name. Your email is not shown on the site.' }} />
            : <LegacyHeading eyebrow={eyebrow} title={title} intro={intro} />}
      {how ? <HowItWorks /> : about ? <FounderNote /> : pageType === 'guidelines' ? null : pageType === 'terms' ? null : contact ? <ContactDesk email={email} /> : <LegacyReadingRoom sections={sections} eyebrow={eyebrow} />}
      <div className="editorial-bottom"><span>{pageType === 'guidelines' ? 'A thoughtful reply can help someone feel heard.' : pageType === 'terms' ? 'Questions about these terms?' : redesigned ? 'Clear moments. Better conversations.' : <><NotebookPen size={15}/> A SMALL NOTE FROM ITCH</>}</span><Link href={pageType === 'terms' ? '/contact' : pageType === 'guidelines' ? '/community' : '/explore'}>{pageType === 'terms' ? 'Contact Itch' : pageType === 'guidelines' ? 'Visit the community' : redesigned ? 'Explore problems' : 'See what people are talking about'} <CornerDownRight size={16}/></Link></div>
    </main>
    <ItchFooter />
  </div>;
}
