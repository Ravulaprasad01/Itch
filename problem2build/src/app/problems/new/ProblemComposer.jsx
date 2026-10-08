'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, Check, Heart, Save, ShieldCheck } from 'lucide-react';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';

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

export default function ProblemComposer() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [frequency, setFrequency] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [audience, setAudience] = useState('');
  const [workaround, setWorkaround] = useState('');
  const [meToo, setMeToo] = useState(false);
  const [fundingInterest, setFundingInterest] = useState(false);
  const [fundingAmount, setFundingAmount] = useState('');
  const [notice, setNotice] = useState('');
  const [showPreview, setShowPreview] = useState(false);

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
      setMeToo(Boolean(draft.meToo));
      setFundingInterest(Boolean(draft.fundingInterest));
      setFundingAmount(draft.fundingAmount || '');
      setNotice('Draft restored from this browser.');
    } catch {
      window.localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  const handleSaveDraft = () => {
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify({
      title,
      description,
      category,
      frequency,
      priority,
      audience,
      workaround,
      meToo,
      fundingInterest,
      fundingAmount,
    }));
    setNotice('Draft saved in this browser.');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!frequency) {
      setNotice('Choose how often this problem happens before reviewing it.');
      document.getElementById('frequency-options')?.focus();
      return;
    }
    setShowPreview(true);
    setNotice('Preview only. This build does not publish or send your problem yet.');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased">
      <ItchHeader />

      <main className="mx-auto w-full max-w-[860px] px-5 pb-16 pt-24 sm:px-8">
        <header className="mb-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-primary">Post a problem</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">What keeps getting in your way?</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-tertiary">
            Describe the friction in plain language. People can support it, and builders can decide whether to take it on.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="divide-y divide-white/10 border-y border-white/10">
          <section className="space-y-5 py-6" aria-labelledby="problem-section-title">
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
                <div className="grid grid-cols-4 gap-1 rounded-lg border border-white/10 bg-surface-container/30 p-1">
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
          </section>

          <section className="space-y-5 py-6" aria-labelledby="context-section-title">
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
          </section>

          <section className="space-y-5 py-6" aria-labelledby="signals-section-title">
            <div>
              <h2 id="signals-section-title" className="text-base font-semibold text-on-surface">Priority and support</h2>
              <p className="mt-1 text-xs text-tertiary">Signals help others understand how much this matters to you.</p>
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

            <button
              type="button"
              aria-pressed={meToo}
              onClick={() => setMeToo(!meToo)}
              className={`flex w-full items-center gap-3 rounded-lg border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${meToo ? 'border-rose-400/40 bg-rose-400/10' : 'border-white/10 bg-surface-container/25 hover:border-white/20 hover:bg-surface-container/50'}`}
            >
              <Heart className={`h-5 w-5 shrink-0 transition ${meToo ? 'fill-rose-400 text-rose-400' : 'text-tertiary'}`} />
              <span>
                <span className="block text-sm font-semibold text-on-surface">I experience this problem too</span>
                <span className="mt-1 block text-xs text-tertiary">Optional. Add your own “Me Too” signal to the problem.</span>
              </span>
              {meToo && <Check className="ml-auto h-4 w-4 text-rose-400" />}
            </button>
          </section>

          <section className="space-y-4 py-6" aria-labelledby="funding-section-title">
            <div>
              <h2 id="funding-section-title" className="text-base font-semibold text-on-surface">Would you consider contributing?</h2>
              <p className="mt-1 text-xs text-tertiary">Optional interest only. No payment or pledge is collected.</p>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-surface-container/25 p-4 transition hover:border-white/20 hover:bg-surface-container/50">
              <input
                type="checkbox"
                checked={fundingInterest}
                onChange={(event) => setFundingInterest(event.target.checked)}
                className="mt-0.5 h-4 w-4 accent-primary"
              />
              <span>
                <span className="block text-sm font-medium text-on-surface">I might contribute if a solution gets built</span>
                <span className="mt-1 block text-xs text-tertiary">This is not a payment, pledge, or guarantee.</span>
              </span>
            </label>

            {fundingInterest && (
              <div className="max-w-xs space-y-2">
                <label htmlFor="funding-amount" className="block text-sm font-medium text-on-surface">Amount you might consider <span className="font-normal text-tertiary">Optional</span></label>
                <div className="flex items-center rounded-lg border border-white/10 bg-surface-container/40 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/15">
                  <span className="pl-4 text-sm text-tertiary">$</span>
                  <input
                    id="funding-amount"
                    type="number"
                    min="1"
                    step="1"
                    inputMode="decimal"
                    value={fundingAmount}
                    onChange={(event) => setFundingAmount(event.target.value)}
                    placeholder="25"
                    className="w-full bg-transparent px-2 py-3 text-sm text-on-surface outline-none placeholder:text-tertiary/45"
                  />
                </div>
                <p className="text-xs leading-relaxed text-tertiary/70">Shown only as non-binding interest. It will not be charged or sent; saving a draft keeps it in this browser.</p>
              </div>
            )}
          </section>

          <div className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-medium text-on-surface transition hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Save className="h-4 w-4" />
              Save draft
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-container px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Review problem <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>

        {notice && (
          <div role="status" className="mt-5 flex items-start gap-3 rounded-lg border border-white/10 bg-surface-container/30 p-4 text-sm text-tertiary">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
            <p>{notice}</p>
          </div>
        )}

        {showPreview && (
          <section aria-labelledby="preview-title" className="mt-8 rounded-xl border border-white/10 bg-surface-container/25 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-primary">Preview only</p>
                <h2 id="preview-title" className="mt-2 text-xl font-bold text-on-surface">{title}</h2>
              </div>
              <button type="button" onClick={() => setShowPreview(false)} className="text-xs text-tertiary transition hover:text-on-surface">Edit</button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-tertiary">{description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {category && <span className="rounded-md bg-surface-container-high px-2.5 py-1 text-on-surface">{category}</span>}
              {frequency && <span className="rounded-md bg-surface-container-high px-2.5 py-1 text-on-surface">{frequency}</span>}
              <span className="rounded-md bg-primary/10 px-2.5 py-1 text-primary">{priority} priority</span>
              {meToo && <span className="rounded-md bg-rose-400/10 px-2.5 py-1 text-rose-300">Me Too</span>}
              {fundingInterest && fundingAmount && <span className="rounded-md bg-secondary/10 px-2.5 py-1 text-secondary">Might contribute ${fundingAmount}</span>}
            </div>
          </section>
        )}
      </main>

      <ItchFooter />
    </div>
  );
}