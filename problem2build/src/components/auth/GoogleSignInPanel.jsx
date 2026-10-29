'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { ArrowLeft, CheckCircle2, Code2, LoaderCircle, ShieldCheck, UserRound } from 'lucide-react';
import { auth, db, getPublicDisplayName, googleProvider, isDisplayNameAvailable, isFirebaseConfigured, savePublicDisplayName } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function GoogleSignInPanel() {
  const router = useRouter();
  const initialAuthCheck = useRef(true);
  const authFlowStarted = useRef(false);
  const popupInFlight = useRef(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [checkingName, setCheckingName] = useState(false);
  const [nameAvailability, setNameAvailability] = useState('');

  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, async user => {
      if (!initialAuthCheck.current) return;
      initialAuthCheck.current = false;
      if (!user || authFlowStarted.current) return;

      try {
        const profile = db ? await getDoc(doc(db, 'users', user.uid)) : null;
        const savedProfile = profile?.exists() ? profile.data() : {};
        const savedName = savedProfile.displayName || '';
        if (savedName && ['poster', 'developer'].includes(savedProfile.accountType)) {
          router.replace('/explore');
          return;
        }
        setCurrentUser(user);
        setDisplayName(savedName || getPublicDisplayName(user));
        setAccountType(savedProfile.accountType || '');
      } catch {
        setCurrentUser(user);
        setDisplayName(getPublicDisplayName(user));
      }
    });
  }, [router]);

  const signIn = async () => {
    // State updates are asynchronous; use a ref to prevent two popup operations
    // from starting if the button is clicked repeatedly before React rerenders.
    if (popupInFlight.current) return;
    if (!auth || !isFirebaseConfigured) {
      setMessage('Google sign-in is not configured yet. Add the Firebase web app values to .env.local and restart the app.');
      return;
    }

    popupInFlight.current = true;
    setBusy(true);
    setMessage('');
    authFlowStarted.current = true;
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const profile = db ? await getDoc(doc(db, 'users', result.user.uid)) : null;
      const savedProfile = profile?.exists() ? profile.data() : {};
      const savedName = savedProfile.displayName || '';
      if (savedName && ['poster', 'developer'].includes(savedProfile.accountType)) {
        router.replace('/explore');
        router.refresh();
        return;
      }
      setCurrentUser(result.user);
      setDisplayName(savedName || getPublicDisplayName(result.user));
      setAccountType(savedProfile.accountType || '');
    } catch (error) {
      authFlowStarted.current = false;
      setMessage(error?.code === 'auth/popup-closed-by-user'
        ? 'Sign-in was closed before it finished.'
        : 'Google sign-in could not be completed. Check your connection and try again.');
    } finally {
      popupInFlight.current = false;
      setBusy(false);
    }
  };

  const checkName = async () => {
    const candidate = displayName.trim();
    if (!currentUser || candidate.length < 2) {
      setNameAvailability('Use at least 2 characters.');
      return;
    }
    setCheckingName(true);
    setNameAvailability('');
    try {
      const available = await isDisplayNameAvailable(candidate, currentUser.uid);
      setNameAvailability(available ? 'This name is available.' : 'This name is already in use.');
    } catch (error) {
      setNameAvailability(error?.code === 'permission-denied'
        ? 'Firestore denied the name check. The project owner needs to publish the updated Firestore rules.'
        : 'Could not check this name right now. Saving will check it again.');
    } finally {
      setCheckingName(false);
    }
  };

  const saveName = async event => {
    event.preventDefault();
    if (!currentUser || !db) return;
    setBusy(true);
    setMessage('');
    try {
      if (!accountType) {
        setMessage('Choose the profile that best describes how you’ll use Itch.');
        setBusy(false);
        return;
      }
      await savePublicDisplayName(currentUser, displayName, accountType);
      router.replace('/profile');
      router.refresh();
    } catch (error) {
      setMessage(error?.code === 'display-name/taken'
        ? 'That name is already in use. Choose a different display name.'
        : error?.code === 'permission-denied'
          ? 'Firestore denied this change. The project owner needs to publish the updated Firestore rules before names can be saved.'
        : error?.message || 'Your display name could not be saved. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return <main id="main-content" className="flex min-h-dvh items-center justify-center px-5 py-16 text-on-surface">
    <section className="w-full max-w-md rounded-3xl border border-white/10 bg-surface-container/50 p-7 shadow-2xl sm:p-9">
      <Link href="/" className="mb-9 inline-flex items-center gap-3 text-sm text-tertiary transition hover:text-on-surface">
        <Image src="/itch-mark.svg" alt="" width={38} height={38} />
        <span><b className="block text-lg leading-none text-on-surface">Itch.</b><small>POST IT. BACK IT. BUILD IT.</small></span>
      </Link>
      <Link href="/" className="mb-6 flex w-fit items-center gap-2 text-xs text-tertiary transition hover:text-on-surface"><ArrowLeft size={15}/> Back to Itch</Link>
      <p className="font-mono text-[10px] font-semibold tracking-[.18em] text-primary">SIGN IN TO ITCH</p>
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight">{currentUser ? 'Set up your Itch profile' : 'Welcome to Itch.'}</h1>
      <p className="mt-3 text-sm leading-6 text-tertiary">{currentUser
        ? 'Choose how you’ll take part. You can change this later from your profile.'
        : 'Sign in with Google to post problems and join the conversation. Your email stays private.'}</p>

      {currentUser ? <form onSubmit={saveName} className="mt-7">
        <fieldset className="mb-6">
          <legend className="mb-2 text-xs font-semibold text-on-surface-variant">I’m here to…</legend>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => { setAccountType('poster'); setMessage(''); }} aria-pressed={accountType === 'poster'} className={`itch-role-choice${accountType === 'poster' ? ' is-selected' : ''}`}>
              <span className="itch-role-icon"><UserRound size={17}/></span><span><strong>Share a problem</strong><small>Post it and follow the conversation.</small></span>
            </button>
            <button type="button" onClick={() => { setAccountType('developer'); setMessage(''); }} aria-pressed={accountType === 'developer'} className={`itch-role-choice${accountType === 'developer' ? ' is-selected' : ''}`}>
              <span className="itch-role-icon"><Code2 size={17}/></span><span><strong>Build solutions</strong><small>Offer help and earn verified credit.</small></span>
            </button>
          </div>
        </fieldset>
        <label htmlFor="public-display-name" className="mb-2 block text-xs font-semibold text-on-surface-variant">Display name</label>
        <div className="flex min-h-12 items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4 focus-within:border-primary/70">
          <UserRound size={17} className="shrink-0 text-tertiary" />
          <input id="public-display-name" value={displayName} onChange={event => { setDisplayName(event.target.value); setNameAvailability(''); }} onBlur={checkName} maxLength={30} autoComplete="nickname" required className="w-full bg-transparent text-sm text-on-surface outline-none placeholder:text-tertiary" placeholder="e.g. Alex Chen" />
        </div>
        <p className="mt-2 text-xs leading-5 text-tertiary">Names are unique, 2–30 characters. This is how the community will see you.</p>
        {(nameAvailability || checkingName) && <p aria-live="polite" className={`mt-1 text-xs ${nameAvailability === 'This name is available.' ? 'text-secondary' : 'text-tertiary'}`}>{checkingName ? 'Checking name…' : nameAvailability}</p>}
        <button type="submit" disabled={busy || checkingName} className="mt-5 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary px-4 text-sm font-bold text-on-primary transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">
          {busy ? <LoaderCircle size={18} className="animate-spin"/> : <CheckCircle2 size={18}/>}
          {busy ? 'Saving profile…' : 'Save profile'}
        </button>
      </form> : <button type="button" onClick={signIn} disabled={busy} className="mt-7 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-4 text-sm font-bold text-slate-900 transition hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60">
        {busy ? <LoaderCircle size={18} className="animate-spin"/> : <GoogleMark/>}
        {busy ? 'Connecting…' : 'Continue with Google'}
      </button>}

      <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-white/8 bg-black/15 p-3.5 text-xs leading-5 text-tertiary">
        <ShieldCheck size={16} className="mt-0.5 shrink-0 text-secondary"/>
        <span>Your display name is saved to your Itch account and shown with your posts. Your email is not shown publicly.</span>
      </div>
      {message && <p role="alert" className="mt-4 rounded-xl border border-red-300/20 bg-red-400/10 p-3 text-xs leading-5 text-red-100">{message}</p>}
      <p className="mt-5 flex items-center gap-2 text-xs text-tertiary"><CheckCircle2 size={14} className="text-secondary"/> Your profile mode controls the tools and activity shown on your profile.</p>
    </section>
  </main>;
}

function GoogleMark() {
  return <svg viewBox="0 0 48 48" aria-hidden="true" className="h-5 w-5">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" transform="translate(0 4) scale(1)" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.62 5.91c4.45-4.1 7.14-10.13 7.14-17.56Z" />
    <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.9 23.9 0 0 0 0 21.56l7.98-6.19Z" transform="translate(0 0) scale(1)" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.79l-7.62-5.91c-2.12 1.42-4.83 2.27-8.28 2.27-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z" />
  </svg>;
}
