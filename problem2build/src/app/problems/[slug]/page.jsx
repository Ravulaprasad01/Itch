'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { ArrowLeft, Menu, MessageCircle, Send, X } from 'lucide-react';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';
import { auth, db, ensurePublicUser, getPublicDisplayName } from '@/lib/firebase';

export default function ProblemDetailPage({ params }) {
  const { slug } = use(params);
  const [communityProblem, setCommunityProblem] = useState(null);
  const problem = communityProblem;
  const [problemLoading, setProblemLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [replyError, setReplyError] = useState('');
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

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
        urgency: data.priority,
        status: data.status || 'open',
        meTooCount: data.meTooCount || 0,
        wantThisCount: data.wantThisCount || 0,
        commentsCount: data.replyCount || 0,
        isCommunityPost: true,
      });
      setProblemLoading(false);
    }, () => setProblemLoading(false));
  }, [slug]);
  useEffect(() => {
    if (!auth) return undefined;
    return onAuthStateChanged(auth, setCurrentUser);
  }, []);
  useEffect(() => {
    if (!db || !slug) return undefined;
    return onSnapshot(query(collection(db, 'problems', slug, 'replies'), orderBy('createdAt', 'asc')), snapshot => {
      setReplies(snapshot.docs.map(item => {
        const data = item.data();
        return { id: item.id, name: data.authorName || 'Community member', text: data.text || '', time: data.createdAt?.toDate?.().toLocaleString() || 'Just now' };
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
      const profile = await ensurePublicUser(currentUser);
      await addDoc(collection(db, 'problems', slug, 'replies'), { authorId: currentUser.uid, authorName: profile.displayName || getPublicDisplayName(currentUser), text: message.trim(), createdAt: serverTimestamp() });
      setMessage('');
    } catch (error) { setReplyError(error?.message || 'Could not send your reply. Please try again.'); }
    finally { setSending(false); }
  };

  if (problemLoading) return <div className="problem-chat-page"><ItchHeader/><main className="problem-chat-main"><p role="status">Loading problem…</p></main><ItchFooter/></div>;
  if (!problem) return <div className="problem-chat-page"><ItchHeader/><main className="problem-chat-main"><h1>Problem not found</h1><p>This problem may have been removed.</p><Link href="/explore">Back to Explore</Link></main><ItchFooter/></div>;

  return <div className="problem-chat-page">
    <ItchHeader />
    <main className="problem-chat-main">
      <div className="problem-chat-topbar">
        <Link href="/explore" className="problem-chat-back"><ArrowLeft size={16}/> Explore</Link>
        <p><span/>{problem.category?.name || 'Problem'} · Conversation</p>
        <button type="button" className="problem-menu-button" aria-label={menuOpen ? 'Close problem menu' : 'Open problem menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen(value => !value)}>{menuOpen ? <X/> : <Menu/>}<span>{menuOpen ? 'Close' : 'Problem details'}</span></button>
      </div>

      <header className="problem-chat-heading"><p>THE CONVERSATION</p><h1>{problem.title}</h1><span><MessageCircle size={14}/>{problem.author?.displayName ? `Posted by ${problem.author.displayName}` : 'Community member'} <i>·</i> {replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span><p>{problem.description}</p></header>

      <section className="problem-chat-thread" aria-label="Problem conversation">
        <div className="problem-chat-date">COMMUNITY CONVERSATION · {replies.length} REPLIES</div>
        {replies.map(reply => <article className="problem-chat-message" key={reply.id}><span className="problem-chat-avatar">{reply.name[0]}</span><div><div className="problem-chat-meta"><strong>{reply.name}</strong><time>{reply.time}</time></div><p>{reply.text}</p></div></article>)}
        {replies.length === 0 && <p className="community-local-note">No replies yet. Start the conversation with a useful question or your experience.</p>}
      </section>

      <form className="problem-chat-composer" onSubmit={sendMessage}><label className="sr-only" htmlFor="problem-reply">Write a message</label><textarea id="problem-reply" rows={2} value={message} onChange={event => setMessage(event.target.value)} placeholder={currentUser ? 'Write a thoughtful reply…' : 'Sign in to join the conversation'} /><div className="problem-chat-compose-actions"><span>Keep it kind and useful</span><button className="problem-chat-send" type="submit" disabled={!message.trim() || sending}>{sending ? 'Sending…' : currentUser ? 'Reply' : 'Sign in to reply'} <Send size={15}/></button></div>{replyError && <p role="alert">{replyError}</p>}</form>

      {menuOpen && <><button className="problem-menu-scrim" aria-label="Close problem details" onClick={() => setMenuOpen(false)}/><aside className="problem-menu-panel" aria-label="Problem details and specification"><div className="problem-menu-head"><div><span>PROBLEM MENU</span><h2>Details & specification</h2></div><button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}><X size={19}/></button></div><div className="problem-menu-body"><span className="problem-menu-category">{problem.category?.name || 'General'} · {problem.urgency || 'Open'}</span><h3>{problem.title}</h3><p>{problem.description}</p><dl><div><dt>Who it affects</dt><dd>{problem.targetAudience || 'Not specified'}</dd></div><div><dt>Current workaround</dt><dd>{problem.currentWorkaround || 'No workaround provided'}</dd></div><div><dt>Replies</dt><dd>{replies.length} community {replies.length === 1 ? 'reply' : 'replies'}</dd></div></dl></div></aside></>}
    </main>
    <ItchFooter />
  </div>;
}
