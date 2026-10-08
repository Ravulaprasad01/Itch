'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function AuthForm({ initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const isLogin = mode === 'login';

  const getSupabaseClient = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Authentication is not configured. Please contact the site administrator.');
    }

    return createClient(supabaseUrl, supabaseKey);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();
      const { data, error: authError } = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (authError) throw authError;

      if (isLogin || data.session) {
        router.push('/explore');
        router.refresh();
      } else {
        setNotice('Check your email for a confirmation link to finish creating your account.');
      }
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError('');
    setNotice('');
    setIsSubmitting(true);

    try {
      const supabase = getSupabaseClient();
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/explore`,
        },
      });

      if (authError) throw authError;
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Google authentication failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  const selectMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setNotice('');
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-12">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-surface-container/70 p-6 shadow-2xl backdrop-blur sm:p-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white">
            <img src="/itch-icon.svg" alt="" className="h-9 w-9 rounded-xl" />
            <span>Itch</span>
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-white/10 px-3 py-2 text-sm font-medium text-white/70 transition hover:border-white/20 hover:text-white"
          >
            Back
          </Link>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">Your Itch account</p>
        <h1 className="mt-2 text-2xl font-bold text-white">
          {isLogin ? 'Welcome back' : 'Join the community'}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          {isLogin ? 'Log in to support problems and discover what needs building.' : 'Create an account to share problems and support ideas.'}
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-xl border border-white/10 bg-black/20 p-1" role="group" aria-label="Choose login or signup">
          <button
            type="button"
            aria-pressed={isLogin}
            onClick={() => selectMode('login')}
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${isLogin ? 'bg-primary-container text-white shadow' : 'text-white/60 hover:text-white'}`}
          >
            Log in
          </button>
          <button
            type="button"
            aria-pressed={!isLogin}
            onClick={() => selectMode('signup')}
            className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition ${!isLogin ? 'bg-primary-container text-white shadow' : 'text-white/60 hover:text-white'}`}
          >
            Sign up
          </button>
        </div>

        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={isSubmitting}
          className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-white px-4 py-3 font-semibold text-slate-800 transition hover:bg-white/90 disabled:cursor-wait disabled:opacity-60"
        >
          <svg aria-hidden="true" viewBox="0 0 48 48" className="h-5 w-5">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(0 5)" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.97 46.98 31.91 46.98 24.55Z" />
            <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z" transform="translate(0 2)" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.89 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
          </svg>
          {isLogin ? 'Continue with Google' : 'Sign up with Google'}
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-white/40" aria-hidden="true">
          <span className="h-px flex-1 bg-white/10" />
          <span>OR CONTINUE WITH EMAIL</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-white/80">
            Email
            <input
              autoComplete="email"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-primary"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="block text-sm font-medium text-white/80">
            Password
            <input
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-primary"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              required
            />
          </label>

          {error && <p role="alert" className="rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
          {notice && <p role="status" className="rounded-xl border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{notice}</p>}

          <button
            className="w-full rounded-xl bg-primary-container px-4 py-3 font-semibold text-white transition hover:bg-primary disabled:cursor-wait disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Please wait...' : isLogin ? 'Log in' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-relaxed text-white/45">
          By continuing, you agree to use Itch respectfully and avoid sharing private information.
        </p>
      </section>
    </main>
  );
}
