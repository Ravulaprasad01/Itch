'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { ArrowLeft, ArrowRight, Coins, MessageCircle, Send, Star, Wrench } from 'lucide-react';
import { collection, doc, onSnapshot, orderBy, query, runTransaction, serverTimestamp, where } from 'firebase/firestore';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';
import { auth, db, ensurePublicUser } from '@/lib/firebase';
import ReportContentControl from '@/components/itch/ReportContentControl';

export default function ProblemDetailPage({ params }) {
  const { slug } = use(params);
  const [communityProblem, setCommunityProblem] = useState(null);
  const problem = communityProblem;
  const [problemLoading, setProblemLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [replyError, setReplyError] = useState('');
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [replies, setReplies] = useState([]);
  const [hasContributed, setHasContributed] = useState(false);
  const [accountType, setAccountType] = useState('');
  const [profileLoading, setProfileLoading] = useState(true);
  const [contributionBusy, setContributionBusy] = useState(false);
  const [contributionMessage, setContributionMessage] = useState('');

  useEffect(() => {
    if (!db) { setProblemLoading(false); return undefined; }
    return onSnapshot(doc(db, 'problems', slug), snapshot => {
      if (!snapshot.exists()) { setCommunityProblem(null); setProblemLoading(false); return; }
      const data = snapshot.data();
      setCommunityProblem({
        id: snapshot.id,
        slug: snapshot.id,
        title: data.title,
        description: data.description,
        painPoint: data.description,
        currentWorkaround: data.workaround,
        targetAudience: data.audience,
        category: { name: typeof data.category === 'string' ? data.category : data.category?.name || 'General' },
        author: { displayName: data.authorName },
        authorId: data.authorId,
        urgency: data.priority,
        status: data.status || 'open',
        meTooCount: data.meTooCount || 0,
        contributorCount: data.contributorCount || 0,
        selectedDeveloperId: data.selectedDeveloperId || null,
        wantThisCount: data.wantThisCount || 0,
        fundingInterest: data.fundingInterest === true,
        fundingAmount: Number.isFinite(data.fundingAmount) ? data.fundingAmount : null,
        fundingCurrency: typeof data.fundingCurrency === 'string' ? data.fundingCurrency : 'INR',
        commentsCount: data.replyCount || 0,
        isCommunityPost: true,
      });
      setProblemLoading(false);
    }, () => setProblemLoading(false));
  }, [slug]);
  const contributeToProblem = async () => {
    if (!currentUser) {
      router.push(`/auth?next=${encodeURIComponent(`/problems/${slug}`)}`);
      return;
    }
    if (accountType !== 'developer') {
      setContributionMessage('Choose the Developer profile type to join this problem.');
      return;
    }
    if (!db) {
      setContributionMessage('Problem contributions are unavailable right now.');
      return;
    }
    setContributionBusy(true);
    setContributionMessage('');
    try {
      const problemRef = doc(db, 'problems', slug);
      const contributorRef = doc(db, 'problems', slug, 'contributors', currentUser.uid);
      const result = await runTransaction(db, async transaction => {
        const [problemSnapshot, signalSnapshot] = await Promise.all([
          transaction.get(problemRef),
          transaction.get(contributorRef),
        ]);
        if (!problemSnapshot.exists()) throw new Error('Problem not found.');
        if (problemSnapshot.data().status === 'resolved' || problemSnapshot.data().authorId === currentUser.uid) throw new Error('This problem is not accepting contributors.');
        if (signalSnapshot.exists()) return { alreadyContributing: true };
        const count = Number.isSafeInteger(problemSnapshot.data().contributorCount) ? problemSnapshot.data().contributorCount : 0;
        transaction.update(problemRef, { contributorCount: count + 1 });
        transaction.set(contributorRef, { createdAt: serverTimestamp() });
        return { alreadyContributing: false };
      });
      setHasContributed(true);
    setContributionMessage(result.alreadyContributing ? 'Your interest is already recorded. Share progress in the conversation when you have an update.' : 'Your interest is recorded. This is not a promise of delivery; share progress in the conversation when you have an update.');
    } catch {
      setContributionMessage('Could not join this problem right now. Check that your profile is set to Developer, then try again.');
    } finally {
      setContributionBusy(false);
    }
  };
  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, setCurrentUser);
  }, []);
  useEffect(() => {
    if (!db || !currentUser?.uid) {
      setAccountType('');
      setProfileLoading(false);
      return undefined;
    }
    return onSnapshot(doc(db, 'users', currentUser.uid), snapshot => {
      const data = snapshot.exists() ? snapshot.data() : {};
      setAccountType(data.accountType || '');
      setProfileLoading(false);
    }, () => setProfileLoading(false));
  }, [currentUser?.uid]);
  useEffect(() => {
    if (!db || !currentUser?.uid || !slug) {
      setHasContributed(false);
      return undefined;
    }
    return onSnapshot(doc(db, 'problems', slug, 'contributors', currentUser.uid), snapshot => {
      setHasContributed(snapshot.exists());
    }, () => {
      setContributionMessage('Could not check your contribution status.');
    });
  }, [currentUser?.uid, slug]);
  useEffect(() => {
    if (!db || !slug) return undefined;
    return onSnapshot(query(collection(db, 'problems', slug, 'replies'), where('moderationStatus', '==', 'visible'), orderBy('createdAt', 'asc')), snapshot => {
      setReplies(snapshot.docs.map(item => {
        const data = item.data();
        return { id: item.id, name: data.authorName || 'Community member', role: data.authorRole === 'developer' ? 'developer' : '', text: data.text || '', time: data.createdAt?.toDate?.().toLocaleString() || 'Just now' };
      }));
    }, () => setReplyError('Could not load replies. Please refresh and try again.'));
  }, [slug]);
  const sendMessage = async event => {
    event.preventDefault();
    if (!message.trim()) return;
    if (!currentUser) { router.push(`/auth?next=${encodeURIComponent(`/problems/${slug}`)}`); return; }
    if (!db) { setReplyError('Firebase is not configured.'); return; }
    setSending(true); setReplyError('');
    try {
      await ensurePublicUser(currentUser);
      const problemRef = doc(db, 'problems', slug);
      const profileRef = doc(db, 'users', currentUser.uid);
      const rateRef = doc(db, 'rateLimits', currentUser.uid);
      const replyRef = doc(collection(db, 'problems', slug, 'replies'));
      await runTransaction(db, async transaction => {
        const [problemSnapshot, profileSnapshot, rateSnapshot] = await Promise.all([
          transaction.get(problemRef),
          transaction.get(profileRef),
          transaction.get(rateRef),
        ]);
        if (!problemSnapshot.exists()) throw new Error('This problem is no longer available.');
        if (!profileSnapshot.exists() || !profileSnapshot.data().displayName) {
          throw new Error('Finish setting up your Itch display name first.');
        }
        const lastReplyAt = rateSnapshot.data()?.lastReplyAt?.toMillis?.();
        if (lastReplyAt && Date.now() - lastReplyAt < 5_000) {
          throw new Error('Please wait a few seconds before sending another reply.');
        }
        transaction.set(replyRef, {
          authorId: currentUser.uid,
          authorName: profileSnapshot.data().displayName,
          authorRole: profileSnapshot.data().accountType === 'developer' ? 'developer' : 'member',
          text: message.trim(),
          moderationStatus: 'visible',
          createdAt: serverTimestamp(),
        });
        transaction.set(rateRef, { lastReplyAt: serverTimestamp() }, { merge: true });
      });
      setMessage('');
    } catch (error) {
      setReplyError(error?.message === 'Please wait a few seconds before sending another reply.'
        || error?.message === 'Finish setting up your Itch display name first.'
        || error?.message === 'This problem is no longer available.'
        ? error.message
        : 'Could not send your reply. Please check your connection and try again.');
    }
    finally { setSending(false); }
  };

  if (problemLoading) return <div className="problem-chat-page"><ItchHeader/><main id="main-content" className="problem-chat-main"><p role="status">Loading problem…</p></main><ItchFooter/></div>;
  if (!problem) return <div className="problem-chat-page"><ItchHeader/><main id="main-content" className="problem-chat-main"><h1>Problem not found</h1><p>This problem may have been removed.</p><Link href="/explore">Back to Explore</Link></main><ItchFooter/></div>;
  const canContribute = accountType === 'developer';

  return <div className="problem-chat-page problem-chat-normal-view">
    <ItchHeader />
    <main id="main-content" className="problem-chat-main">
      <div className="problem-chat-topbar">
        <Link href="/explore" className="problem-chat-back"><ArrowLeft size={16}/> Explore</Link>
        <p><span/>{problem.category?.name || 'Problem'} · Conversation</p>
      </div>

      <header className="problem-chat-heading">
        <h1>{problem.title}</h1>
        <div className="problem-chat-byline">
          <span className="problem-chat-author-mark" aria-hidden="true">{(problem.author?.displayName || 'C').slice(0, 1).toUpperCase()}</span>
          <span>Posted by <strong>{problem.author?.displayName || 'Community member'}</strong></span>
        </div>
        {currentUser?.uid !== problem.authorId && problem.status === 'open' && <button className="problem-contribute-cta" type="button" onClick={contributeToProblem} disabled={profileLoading || contributionBusy || hasContributed} aria-pressed={hasContributed}>
          <Wrench size={16} aria-hidden="true"/>
          <span>{profileLoading ? 'Checking developer profile…' : hasContributed ? 'Interest signaled' : !currentUser ? 'Sign in to join as a contributor' : canContribute ? 'Join as a contributor' : 'Choose Developer to join'}</span>
          <span className="problem-contribute-count" aria-label={`${problem.contributorCount || 0} developers have signaled interest`}><Star size={14} fill="currentColor" aria-hidden="true"/>{problem.contributorCount || 0}</span>
          {!hasContributed && <ArrowRight size={15} aria-hidden="true"/>}
        </button>}
      </header>
      {contributionMessage && <p className="problem-signal-status" role="status">{contributionMessage}{currentUser && accountType !== 'developer' && <> <Link href="/profile">Switch to Developer</Link></>}</p>}
      {currentUser?.uid !== problem.authorId && problem.status === 'open' && <div className="problem-contribution-explainer"><strong>What does contributing mean?</strong><span>This records your interest in exploring a solution. It is not a promise or proof of completed work. Share progress in the conversation when you have an update.</span></div>}
      <div className="problem-report-row"><span>See something that doesn’t belong?</span><ReportContentControl currentUser={currentUser} problemId={slug} targetId={slug} targetType="problem"/></div>

      <section className="problem-experience" aria-label="The experience behind this problem">
        <div className="problem-experience-moment">
          <h2 className="problem-experience-heading">The part that keeps getting in the way</h2>
          <blockquote>{problem.description}</blockquote>
        </div>
        {(problem.targetAudience || problem.currentWorkaround) && <div className="problem-experience-context">
          {problem.targetAudience && <div className="problem-experience-point"><span>WHO CARRIES IT</span><p>{problem.targetAudience}</p></div>}
          {problem.currentWorkaround && <div className="problem-experience-point"><span>WHAT THEY DO TODAY</span><p>{problem.currentWorkaround}</p></div>}
        </div>}
        <a className="problem-experience-invite" href="#problem-reply">Have you been here too? Add your experience <ArrowRight size={16}/></a>
      </section>

      {problem.fundingInterest && <aside className="problem-funding-signal" aria-label="Potential funding interest">
        <Coins size={19} aria-hidden="true" />
        <div><strong>Potential support for builders</strong><p>{problem.fundingAmount ? `The person who shared this problem may contribute ${problem.fundingCurrency} ${problem.fundingAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })} if a solution is built.` : 'The person who shared this problem may contribute if a solution is built.'} This is non-binding; no payment has been made or promised.</p></div>
      </aside>}

      <section className="problem-chat-thread" aria-label="Problem conversation">
        <div className="problem-chat-thread-heading"><div><p>Shared experience</p><h2>People who recognize it</h2></div><span><MessageCircle size={15}/>{replies.length}</span></div>
        {replies.map(reply => <article className="problem-chat-message" id={`reply-${reply.id}`} key={reply.id}><span className="problem-chat-avatar">{reply.name[0]}</span><div><div className="problem-chat-meta"><strong>{reply.name}</strong>{reply.role === 'developer' && <span className="problem-reply-role">Developer profile</span>}<time>{reply.time}</time></div><p>{reply.text}</p></div><ReportContentControl currentUser={currentUser} problemId={slug} targetId={reply.id} targetType="reply"/></article>)}
        {replies.length === 0 && <div className="problem-chat-empty"><span className="problem-chat-empty-icon"><MessageCircle size={19}/></span><div><strong>Be the first to reply</strong><p>Share a similar experience, ask a thoughtful question, or offer a useful next step.</p></div></div>}
      </section>

      <form className="problem-chat-composer" onSubmit={sendMessage}><label className="sr-only" htmlFor="problem-reply">Write a message</label><textarea id="problem-reply" rows={2} maxLength={2000} value={message} onChange={event => setMessage(event.target.value)} placeholder={currentUser ? accountType === 'developer' && hasContributed ? 'Share a progress update or useful context…' : 'Write a thoughtful reply…' : 'Sign in to join the conversation'} /><div className="problem-chat-compose-actions"><span>{accountType === 'developer' ? 'Developer profile · Share honest progress, not promises.' : 'Keep it kind and useful'}</span><button className="problem-chat-send" type="submit" disabled={!message.trim() || sending}>{sending ? 'Sending…' : currentUser ? 'Reply' : 'Sign in to reply'} <Send size={15}/></button></div>{replyError && <p role="alert">{replyError}</p>}</form>
    </main>
    <ItchFooter />
  </div>;
}
