'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Lightbulb, ShieldCheck } from 'lucide-react';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';
import { auth, db, ensurePublicUser, getPublicDisplayName, isFirebaseConfigured } from '@/lib/firebase';

const CATEGORIES = [
  'Productivity',
  'Developer Tools',
  'Finance & Tax',
  'Health & Fitness',
  'Local & Community',
  'Creative',
  'Audio & Video',
];

const FREQUENCIES = ['Daily', 'Weekly', 'Monthly', 'Rarely'];
const PRIORITIES = [
  { value: 'Low', description: 'An inconvenience, but there is a workaround.' },
  { value: 'Medium', description: 'A recurring drain on time or effort.' },
  { value: 'High', description: 'Blocks important work or causes significant impact.' },
];
const DRAFT_KEY = 'itch-problem-draft-v1';
const COMPOSER_STEPS = [
  { title: 'The moment', hint: 'Describe what keeps getting in your way.' },
  { title: 'Who it affects', hint: 'Add the people and workarounds around it.' },
  { title: 'How it matters', hint: 'Set the impact and signals that fit.' },
  { title: 'Review', hint: 'Give it one last look before publishing to the community.' },
];

export default function ProblemComposer() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [audience, setAudience] = useState('');
  const [workaround, setWorkaround] = useState('');
  const [notice, setNotice] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [submittedProblemId, setSubmittedProblemId] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, setCurrentUser);
  }, []);

  useEffect(() => {
    try {
      const draft = JSON.parse(window.localStorage.getItem(DRAFT_KEY) || 'null');
      if (!draft) return;
      setTitle(draft.title || '');
      setDescription(draft.description || '');
      setCategory(draft.category || '');
      setFrequency(draft.frequency || '');
      setPriority(draft.priority || 'Medium');
      setAudience(draft.audience || '');
      setWorkaround(draft.workaround || '');
      setNotice('Draft restored from this browser.');
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (step === 0) {
      const fields = ['problem-title', 'problem-description', 'problem-category'].map(id => document.getElementById(id));
      const invalid = fields.find(field => field && !field.checkValidity());
      if (invalid) { invalid.reportValidity(); return; }
      if (!frequency) {
        setNotice('Choose how often this problem happens to continue.');
        document.getElementById('frequency-options')?.focus();
        return;
      }
      setNotice('');
      setStep(1);
      return;
    }
    if (step < 2) { setNotice(''); setStep(step + 1); return; }
    setShowPreview(true);
    setNotice('Review your details, then publish your problem for the community.');
    setStep(3);
  };

  const goBack = () => { setNotice(''); setStep(Math.max(0, step - 1)); };

  const handleSubmitProblem = async () => {
    if (!isFirebaseConfigured || !db || !auth) {
      setNotice('Firebase is not configured yet. Add your Firebase web app values to .env.local, then restart the app.');
      return;
    }
    if (!currentUser) {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, description, category, frequency, priority, audience, workaround }));
      window.location.href = `/auth?next=${encodeURIComponent('/problems/new')}`;
      return;
    }

    setSubmitting(true);
    setNotice('');
    try {
      const publicUser = await ensurePublicUser(currentUser);
      const displayName = publicUser.displayName || getPublicDisplayName(currentUser);
      const post = await addDoc(collection(db, 'problems'), {
        title: title.trim(),
        description: description.trim(),
        category,
        frequency,
        priority,
        audience: audience.trim(),
        workaround: workaround.trim(),
        authorId: currentUser.uid,
        authorName: displayName,
        status: 'open',
        meTooCount: 0,
        wantThisCount: 0,
        devInterestCount: 0,
        createdAt: serverTimestamp(),
      });
      setAuthorName(displayName);
      setSubmittedProblemId(post.id);
      setSubmitted(true);
      setNotice(`Your problem is live in Explore as ${displayName}. Your email is private.`);
      window.localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      setNotice(error?.message || 'We could not publish your problem. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased">
      <ItchHeader />

      <main className="composer-page">
        <header className="composer-hero">
          <div>
            <p className="composer-kicker"><span /> A NOTE TO THE FUTURE</p>
            <h1>Start with the<br /><em>thing that bugs you.</em></h1>
            <p>One clear moment is enough. We’ll help you shape it into something others can understand.</p>
          </div>
          <div className="composer-hero-note-stack" aria-label="Quick tips for writing a problem">
            <article className="composer-hero-note composer-hero-note-1"><span>START WITH A MOMENT</span><strong>What happened?</strong><i /></article>
            <article className="composer-hero-note composer-hero-note-2"><span>KEEP IT SIMPLE</span><strong>One clear example is enough.</strong><i /></article>
            <article className="composer-hero-note composer-hero-note-3"><span>YOUR PRIVACY</span><strong>Your email stays private.</strong><i /></article>
          </div>
        </header>

        <div className="composer-layout">
        <form onSubmit={handleSubmit} className="composer-form">
          <nav className="composer-stepper" aria-label="Problem post steps">
            {COMPOSER_STEPS.map((item, index) => <button key={item.title} type="button" disabled={index > step} aria-current={step === index ? 'step' : undefined} onClick={() => { if (index <= step) { setStep(index); setShowPreview(false); setNotice(''); } }}>
              <span>{index < step ? <CheckCircle2 size={15}/> : `0${index + 1}`}</span><b>{item.title}</b>
            </button>)}
          </nav>

          {step === 0 && <section className="problem-form-section space-y-5" aria-labelledby="problem-section-title">
            <div>
              <h2 id="problem-section-title" className="text-base font-semibold text-on-surface">The problem</h2>
              <p className="mt-1 text-xs text-tertiary">Start with what happens, not the product you want built.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="problem-title" className="block text-sm font-medium text-on-surface">Short title</label>
              <input
                id="problem-title"
                type="text"
                required
                minLength={10}
                maxLength={120}
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="For example: Bank exports break my monthly reconciliation"
                className="w-full rounded-lg border border-white/10 bg-surface-container/40 px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-tertiary/45 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
              />
              <p className="text-right font-mono text-[10px] text-tertiary/55">{title.length}/120</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="problem-description" className="block text-sm font-medium text-on-surface">What happens?</label>
              <textarea
                id="problem-description"
                required
                minLength={20}
                maxLength={600}
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Explain when it happens, why it is frustrating, and what it costs you."
                className="w-full resize-y rounded-lg border border-white/10 bg-surface-container/40 px-4 py-3 text-sm leading-relaxed text-on-surface outline-none transition placeholder:text-tertiary/45 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
              />
              <p className="text-right font-mono text-[10px] text-tertiary/55">{description.length}/600</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="problem-category" className="block text-sm font-medium text-on-surface">Category</label>
                <select
                  id="problem-category"
                  required
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-surface-container/40 px-4 py-3 text-sm text-on-surface outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                >
                  <option value="" disabled>Choose a category</option>
                  {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <fieldset id="frequency-options" tabIndex={-1} className="space-y-2 focus:outline-none">
                <legend className="text-sm font-medium text-on-surface">How often does it happen?</legend>
                <div className="grid grid-cols-2 gap-1 rounded-lg border border-white/10 bg-surface-container/30 p-1 sm:grid-cols-4">
                  {FREQUENCIES.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={frequency === item}
                      onClick={() => setFrequency(item)}
                      className={`rounded-md px-2 py-2 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${frequency === item ? 'bg-surface-container-high text-on-surface' : 'text-tertiary hover:text-on-surface'}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>}

          {step === 1 && <section className="problem-form-section space-y-5" aria-labelledby="context-section-title">
            <div>
              <h2 id="context-section-title" className="text-base font-semibold text-on-surface">A little more context</h2>
              <p className="mt-1 text-xs text-tertiary">These details help people understand the impact.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="problem-audience" className="block text-sm font-medium text-on-surface">Who else runs into this? <span className="font-normal text-tertiary">Optional</span></label>
              <input
                id="problem-audience"
                type="text"
                maxLength={200}
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                placeholder="For example: freelance bookkeepers"
                className="w-full rounded-lg border border-white/10 bg-surface-container/40 px-4 py-3 text-sm text-on-surface outline-none transition placeholder:text-tertiary/45 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="problem-workaround" className="block text-sm font-medium text-on-surface">How do you handle it today? <span className="font-normal text-tertiary">Optional</span></label>
              <textarea
                id="problem-workaround"
                rows={2}
                maxLength={400}
                value={workaround}
                onChange={(event) => setWorkaround(event.target.value)}
                placeholder="Describe your current workaround, even if it is just doing it by hand."
                className="w-full resize-y rounded-lg border border-white/10 bg-surface-container/40 px-4 py-3 text-sm leading-relaxed text-on-surface outline-none transition placeholder:text-tertiary/45 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </section>}

          {step === 2 && <>
          <section className="problem-form-section space-y-5" aria-labelledby="signals-section-title">
            <div>
              <h2 id="signals-section-title" className="text-base font-semibold text-on-surface">How much does it matter?</h2>
              <p className="mt-1 text-xs text-tertiary">Choose how strongly this problem affects your day.</p>
            </div>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-on-surface">How urgent is it?</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {PRIORITIES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    aria-pressed={priority === item.value}
                    onClick={() => setPriority(item.value)}
                    className={`rounded-lg border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${priority === item.value ? 'border-primary/50 bg-primary/10' : 'border-white/10 bg-surface-container/25 hover:border-white/20 hover:bg-surface-container/50'}`}
                  >
                    <span className={`block text-sm font-semibold ${priority === item.value ? 'text-primary' : 'text-on-surface'}`}>{item.value}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-tertiary">{item.description}</span>
                  </button>
                ))}
              </div>
            </fieldset>

          </section>

          </>}

          {step === 3 && <div className="composer-review-callout"><CheckCircle2 size={20}/><div><strong>{submitted ? `Posted by ${authorName}` : 'Your problem is ready to review.'}</strong><p>{submitted ? 'Your name appears on the post. Your email is never displayed.' : 'When you submit it, the problem appears in Explore under your Google name.'}</p></div></div>}

          <div className="composer-form-actions">
            {step > 0 && step < 3 && <button type="button" onClick={goBack} className="composer-back"><ChevronLeft size={16}/> Back</button>}
            {step === 3 && <button type="button" onClick={() => { setStep(0); setShowPreview(false); setSubmitted(false); setNotice(''); }} className="composer-save">Edit details</button>}
            {step < 3 ? <button type="submit" className="composer-next">{step === 2 ? 'Review my problem' : 'Next step'} <ChevronRight size={17}/></button> : <button type="button" onClick={handleSubmitProblem} disabled={submitted || submitting} className="composer-next">{submitted ? 'Problem posted' : submitting ? 'Posting…' : currentUser ? 'Submit problem' : 'Sign in & submit'} {!submitted && <CheckCircle2 size={16}/>}</button>}
          </div>
        </form>

        <aside className="composer-guide">
          <div className={`composer-guide-note composer-guide-tone-${Math.min(step, 2)}`}>
            <span className="composer-note-tape"/><span className="composer-guide-label"><Lightbulb size={14}/> A LITTLE NUDGE</span>
            <h2>{step < 3 ? COMPOSER_STEPS[step].title : 'One last look'}</h2>
            <p>{step < 3 ? COMPOSER_STEPS[step].hint : 'If it sounds like a real moment from your day, you’ve got it.'}</p>
            {step === 0 && <div className="composer-example"><span>TRY THIS SHAPE</span><strong>When ___ happens, I have to ___, which makes ___ harder.</strong></div>}
            {step === 1 && <div className="composer-example"><span>KEEP IT HUMAN</span><strong>Who runs into this too? What do you do instead?</strong></div>}
            {step === 2 && <div className="composer-example"><span>READY TO SHARE</span><strong>Your post will be public under your display name. Your email stays private.</strong></div>}
          </div>
          <p className="composer-guide-foot">Published problems are public. Your display name appears with the post; your email stays private.</p>
        </aside>
        </div>

        {notice && (
          <div role="status" className="mt-5 flex items-start gap-3 rounded-lg border border-white/10 bg-surface-container/30 p-4 text-sm text-tertiary">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <p>{notice}</p>
          </div>
        )}

        {showPreview && (
          <section aria-labelledby="preview-title" className="composer-review-preview">
            <div className="composer-preview-head">
              <div>
                <span>{submitted ? `POSTED BY ${authorName.toUpperCase()}` : 'POST PREVIEW'}</span>
                <h2 id="preview-title">{title}</h2>
              </div>
              <button type="button" onClick={() => { setStep(0); setShowPreview(false); setSubmitted(false); setNotice(''); }} className="text-xs text-tertiary transition hover:text-on-surface">Edit</button>
            </div>
            <p>{description}</p>
            <div className="composer-preview-tags">
              {category && <span>{category}</span>}
              {frequency && <span>{frequency}</span>}
              <span>{priority} priority</span>
            </div>
            {submitted && <Link href={submittedProblemId ? `/problems/${submittedProblemId}` : '/explore'} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">View your problem <ArrowRight size={15}/></Link>}
          </section>
        )}
      </main>

      <ItchFooter />
    </div>
  );
}
