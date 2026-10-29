'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, runTransaction, serverTimestamp, where } from 'firebase/firestore';
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, MessageCircle, ShieldCheck } from 'lucide-react';
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
const FUNDING_CURRENCIES = [
  { value: 'INR', label: 'INR ₹' },
  { value: 'USD', label: 'USD $' },
  { value: 'GBP', label: 'GBP £' },
  { value: 'EUR', label: 'EUR €' },
];
const PRIORITIES = [
  { value: 'Low', description: 'An inconvenience, but there is a workaround.' },
  { value: 'Medium', description: 'A recurring drain on time or effort.' },
  { value: 'High', description: 'Blocks important work or causes significant impact.' },
];
const DRAFT_KEY = 'itch-problem-draft-v1';
const MATCH_STOP_WORDS = new Set(['about', 'after', 'again', 'also', 'been', 'being', 'because', 'before', 'between', 'could', 'does', 'doing', 'each', 'from', 'have', 'help', 'into', 'just', 'more', 'most', 'other', 'over', 'same', 'some', 'such', 'than', 'that', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'when', 'where', 'which', 'while', 'with', 'would', 'your', 'problem', 'problems', 'happens', 'happen']);

const matchTokens = value => new Set(
  String(value || '').toLowerCase().match(/[a-z0-9]{3,}/g)?.filter(token => !MATCH_STOP_WORDS.has(token)) || [],
);

const overlapRatio = (left, right) => {
  if (!left.size || !right.size) return 0;
  let shared = 0;
  left.forEach(token => { if (right.has(token)) shared += 1; });
  return shared / Math.max(1, Math.min(left.size, right.size));
};

const findSimilarProblems = (problems, { title, description, category }) => {
  const titleTokens = matchTokens(title);
  const contextTokens = matchTokens(description);
  const draftTokens = new Set([...titleTokens, ...contextTokens]);
  if (draftTokens.size < 3) return [];

  return problems.map(problem => {
    const existingTitle = matchTokens(problem.title);
    const existingContext = matchTokens(`${problem.description || ''} ${problem.audience || ''} ${problem.workaround || ''}`);
    const existingAll = new Set([...existingTitle, ...existingContext]);
    const titleMatch = overlapRatio(titleTokens, existingTitle);
    const contextMatch = overlapRatio(contextTokens, existingAll);
    const overallMatch = overlapRatio(draftTokens, existingAll);
    const categoryMatch = category && problem.category?.toLowerCase() === category.toLowerCase() ? 0.12 : 0;
    const score = titleMatch * 0.28 + contextMatch * 0.47 + overallMatch * 0.25 + categoryMatch;
    return { ...problem, matchScore: score };
  })
    .filter(problem => problem.matchScore >= 0.19)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);
};

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
  const [fundingInterest, setFundingInterest] = useState(false);
  const [fundingAmount, setFundingAmount] = useState('');
  const [fundingCurrency, setFundingCurrency] = useState('INR');
  const [audience, setAudience] = useState('');
  const [workaround, setWorkaround] = useState('');
  const [notice, setNotice] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [accountType, setAccountType] = useState('');
  const [authReady, setAuthReady] = useState(false);
  const [submittedProblemId, setSubmittedProblemId] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [step, setStep] = useState(0);
  const [publishedProblems, setPublishedProblems] = useState([]);
  const [dismissSimilar, setDismissSimilar] = useState(false);
  const [similarProblemsReady, setSimilarProblemsReady] = useState(false);

  const shouldSuggestSimilar = step === 0 && !dismissSimilar && (title.trim().length >= 12 || description.trim().length >= 40);
  const similarProblems = useMemo(() => findSimilarProblems(publishedProblems, { title, description, category }), [publishedProblems, title, description, category]);

  useEffect(() => {
    if (!db || !shouldSuggestSimilar) {
      setSimilarProblemsReady(false);
      return undefined;
    }

    const recentProblems = query(collection(db, 'problems'), where('moderationStatus', '==', 'visible'), orderBy('createdAt', 'desc'), limit(50));
    return onSnapshot(recentProblems, snapshot => {
      setPublishedProblems(snapshot.docs.flatMap(problemDoc => {
        const data = problemDoc.data();
        if (data.status !== 'open') return [];
        return [{
          id: problemDoc.id,
          title: data.title,
          description: data.description,
          category: data.category,
          audience: data.audience,
          workaround: data.workaround,
        }];
      }));
      setSimilarProblemsReady(true);
    }, () => {
      // Suggestions are optional. A read failure should never prevent a new post.
      setPublishedProblems([]);
      setSimilarProblemsReady(true);
    });
  }, [shouldSuggestSimilar]);

  useEffect(() => {
    if (!auth) {
      setAuthReady(true);
      return undefined;
    }
    return onAuthStateChanged(auth, user => { setCurrentUser(user); setAuthReady(true); });
  }, []);

  useEffect(() => {
    let active = true;
    setAccountType('');
    if (!db || !currentUser?.uid) return () => { active = false; };
    getDoc(doc(db, 'users', currentUser.uid)).then(snapshot => {
      if (active) setAccountType(snapshot.exists() ? snapshot.data().accountType || '' : '');
    }).catch(() => {
      if (active) setAccountType('');
    });
    return () => { active = false; };
  }, [currentUser?.uid]);

  useEffect(() => {
    try {
      const draft = JSON.parse(window.localStorage.getItem(DRAFT_KEY) || 'null');
      if (!draft) return;
      setTitle(draft.title || '');
      setDescription(draft.description || '');
      setCategory(draft.category || '');
      setFrequency(draft.frequency || '');
      setPriority(draft.priority || 'Medium');
      setFundingInterest(draft.fundingInterest === true);
      setFundingAmount(draft.fundingAmount ? String(draft.fundingAmount) : '');
      setFundingCurrency(FUNDING_CURRENCIES.some(item => item.value === draft.fundingCurrency) ? draft.fundingCurrency : 'INR');
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

  const addWritingPrompt = prompt => {
    const current = description.trimEnd();
    if (current.endsWith(prompt)) return;
    const nextDescription = current ? `${current}${/\s$/.test(description) ? '' : ' '}${prompt}` : prompt;
    setDescription(nextDescription);
    setStep(0);
    setShowPreview(false);
    window.requestAnimationFrame(() => {
      const field = document.getElementById('problem-description');
      field?.focus();
      field?.setSelectionRange(field.value.length, field.value.length);
    });
  };

  const handleSubmitProblem = async () => {
    const numericFundingAmount = fundingAmount === '' ? null : Number(fundingAmount);
    if (fundingInterest && numericFundingAmount !== null && (
      !Number.isFinite(numericFundingAmount)
      || numericFundingAmount < 1
      || numericFundingAmount > 1_000_000
      || Math.abs(numericFundingAmount * 100 - Math.round(numericFundingAmount * 100)) > 1e-7
    )) {
      setNotice('Enter a potential amount between 1 and 1,000,000, with up to two decimal places.');
      return;
    }
    if (!isFirebaseConfigured || !db || !auth) {
      setNotice('Firebase is not configured yet. Add your Firebase web app values to .env.local, then restart the app.');
      return;
    }
    if (!currentUser) {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ title, description, category, frequency, priority, audience, workaround, fundingInterest, fundingAmount, fundingCurrency }));
      window.location.href = `/auth?next=${encodeURIComponent('/problems/new')}`;
      return;
    }
    if (accountType !== 'poster') {
      setNotice('Your profile is set to Developer. Switch to Problem poster from My Profile to publish a problem.');
      return;
    }

    setSubmitting(true);
    setNotice('');
    try {
      const publicUser = await ensurePublicUser(currentUser);
      const displayName = publicUser.displayName || getPublicDisplayName(currentUser);
      const profileRef = doc(db, 'users', currentUser.uid);
      const rateRef = doc(db, 'rateLimits', currentUser.uid);
      const problemRef = doc(collection(db, 'problems'));
      await runTransaction(db, async transaction => {
        const [profileSnapshot, rateSnapshot] = await Promise.all([
          transaction.get(profileRef),
          transaction.get(rateRef),
        ]);
        if (!profileSnapshot.exists() || !profileSnapshot.data().displayName) {
          throw new Error('Finish setting up your Itch display name before publishing.');
        }
        const lastProblemAt = rateSnapshot.data()?.lastProblemAt?.toMillis?.();
        if (lastProblemAt && Date.now() - lastProblemAt < 30_000) {
          throw new Error('Please wait 30 seconds before publishing another problem.');
        }
        transaction.set(problemRef, {
          title: title.trim(),
          description: description.trim(),
          category,
          frequency,
          priority,
          audience: audience.trim(),
          workaround: workaround.trim(),
          fundingInterest,
          fundingAmount: fundingInterest ? numericFundingAmount : null,
          fundingCurrency,
          authorId: currentUser.uid,
          authorName: profileSnapshot.data().displayName,
          status: 'open',
          moderationStatus: 'visible',
          meTooCount: 0,
          wantThisCount: 0,
          devInterestCount: 0,
          createdAt: serverTimestamp(),
        });
        transaction.set(rateRef, { lastProblemAt: serverTimestamp() }, { merge: true });
      });
      setAuthorName(displayName);
      setSubmittedProblemId(problemRef.id);
      setSubmitted(true);
      setNotice(`Your problem is live in Explore as ${displayName}. Your email is private.`);
      window.localStorage.removeItem(DRAFT_KEY);
    } catch (error) {
      setNotice(error?.message === 'Please wait 30 seconds before publishing another problem.'
        || error?.message === 'Finish setting up your Itch display name before publishing.'
        ? error.message
        : 'We could not publish your problem. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100svh] bg-background text-on-surface antialiased">
      <ItchHeader />

      <main id="main-content" className="composer-page">
        <header className="composer-hero">
          <div>
            <h1>What keeps getting<br /><em>in your way?</em></h1>
            <p>Describe what happens and how it affects you. You can add more context as you go.</p>
          </div>
          <aside className="composer-spark" aria-label="Interactive problem story preview">
            <div className="composer-spark-top"><span>YOUR PROBLEM, TAKING SHAPE</span><i aria-hidden="true" /></div>
            <div className="composer-spark-title">{title || 'A moment worth fixing'}</div>
            <div className="composer-spark-flow">
              <div className="composer-spark-line" aria-hidden="true"><i style={{ transform: `scaleY(${step >= 2 ? 1 : step === 1 ? 0.5 : 0.12})` }} /></div>
              <div className={`composer-spark-point${description ? ' is-filled' : ' is-current'}`}>
                <i aria-hidden="true"/><div><b>The moment</b><p>{description || 'What happens, and what does it interrupt?'}</p></div>
              </div>
              <div className={`composer-spark-point${audience || workaround ? ' is-filled' : step === 1 ? ' is-current' : ''}`}>
                <i aria-hidden="true"/><div><b>Who feels it</b><p>{audience || 'The people caught in the same friction'}</p></div>
              </div>
              <div className={`composer-spark-point${workaround ? ' is-filled' : step >= 1 ? ' is-current' : ''}`}>
                <i aria-hidden="true"/><div><b>What happens next</b><p>{workaround || 'The workaround they rely on today'}</p></div>
              </div>
            </div>
            <div className="composer-spark-prompts"><span>Need a first line?</span><div>
              {[['When…', 'When it happens,'], ['I have to…', 'I have to'], ['So…', 'That leaves me']].map(([label, prompt]) => <button key={label} type="button" onClick={() => addWritingPrompt(prompt)}>{label}</button>)}
            </div></div>
          </aside>
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
              <p className="text-right text-xs text-tertiary/70">{title.length}/120</p>
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
              <p className="text-right text-xs text-tertiary/70">{description.length}/600</p>
            </div>

            {shouldSuggestSimilar && similarProblemsReady && similarProblems.length > 0 && <aside className="composer-similar" aria-live="polite" aria-labelledby="composer-similar-title">
              <div className="composer-similar-heading">
                <div>
                  <span>BEFORE YOU POST</span>
                  <h3 id="composer-similar-title">Some similar conversations</h3>
                  <p>Optional: add your experience to a related problem, or keep writing a new post of your own.</p>
                </div>
                <MessageCircle size={19} aria-hidden="true" />
              </div>
              <div className="composer-similar-list">
                {similarProblems.map(problem => <article className="composer-similar-item" key={problem.id}>
                  <div className="composer-similar-item-copy">
                    <span>{problem.category || 'Community'}</span>
                    <h4>{problem.title || 'Community problem'}</h4>
                    {problem.description && <p>{problem.description}</p>}
                  </div>
                  <Link className="composer-similar-link" href={`/problems/${problem.id}#problem-reply`}>
                    Contribute to this problem <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </article>)}
              </div>
              <button type="button" className="composer-similar-continue" onClick={() => setDismissSimilar(true)}>Continue with a new post</button>
            </aside>}

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

          {step === 3 && <>
            <section className="composer-funding" aria-labelledby="funding-title">
              <div className="composer-funding-heading">
                <span>OPTIONAL · FOR BUILDERS</span>
                <h2 id="funding-title">Would you consider contributing money if this gets built?</h2>
                <p>A visible signal can help developers understand the potential support behind an urgent problem.</p>
              </div>
              <label className="composer-funding-toggle">
                <input type="checkbox" checked={fundingInterest} onChange={event => setFundingInterest(event.target.checked)} />
                <span><strong>I may contribute to a solution</strong><small>This is optional and non-binding. No payment is collected.</small></span>
              </label>
              {fundingInterest && <div className="composer-funding-amount">
                <label htmlFor="funding-amount">Possible amount <span>Optional</span></label>
                <div className="composer-funding-inputs">
                  <select aria-label="Contribution currency" value={fundingCurrency} onChange={event => setFundingCurrency(event.target.value)}>
                    {FUNDING_CURRENCIES.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
                  </select>
                  <input id="funding-amount" type="number" min="1" max="1000000" step="0.01" inputMode="decimal" placeholder="Leave blank if unsure" value={fundingAmount} onChange={event => setFundingAmount(event.target.value)} />
                </div>
                <p>The interest and any amount you enter will be public so developers can see it. It is not a pledge or payment.</p>
              </div>}
            </section>
            <div className="composer-review-callout"><CheckCircle2 size={20}/><div><strong>{submitted ? `Posted by ${authorName}` : 'Your problem is ready to review.'}</strong><p>{submitted ? 'Your name appears on the post. Your email is never displayed.' : 'When you submit it, the problem appears in Explore under your Google name.'}</p></div></div>
          </>}

          <div className="composer-form-actions">
            {step > 0 && step < 3 && <button type="button" onClick={goBack} className="composer-back"><ChevronLeft size={16}/> Back</button>}
            {step === 3 && <button type="button" onClick={() => { setStep(0); setShowPreview(false); setSubmitted(false); setNotice(''); }} className="composer-save">Edit details</button>}
            {step < 3 ? <button type="submit" className="composer-next">{step === 2 ? 'Review my problem' : 'Next step'} <ChevronRight size={17}/></button> : <button type="button" onClick={handleSubmitProblem} disabled={submitted || submitting} className="composer-next">{submitted ? 'Problem posted' : submitting ? 'Posting…' : currentUser ? 'Submit problem' : 'Sign in & submit'} {!submitted && <CheckCircle2 size={16}/>}</button>}
          </div>
        </form>

        </div>

        <p className="composer-privacy-note"><ShieldCheck size={16}/> Your post is public under your display name. Your email stays private.</p>

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
              {fundingInterest && <span>{fundingAmount ? `Potential ${fundingCurrency} ${Number(fundingAmount).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 'Open to contributing'}</span>}
            </div>
            {submitted && <Link href={submittedProblemId ? `/problems/${submittedProblemId}` : '/explore'} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80">View your problem <ArrowRight size={15}/></Link>}
          </section>
        )}
      </main>

      <ItchFooter />
    </div>
  );
}
