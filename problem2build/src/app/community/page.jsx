'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Heart, MessageCircle, Search, Users } from 'lucide-react';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';
import { CATEGORIES } from '@/lib/mock-data';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const FOLLOW_KEY = 'itch-community-topics-v1';

export default function CommunityPage() {
  const [topic, setTopic] = useState('All topics');
  const [searchText, setSearchText] = useState('');
  const [following, setFollowing] = useState([]);
  const [allProblems, setAllProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(FOLLOW_KEY) || '[]');
      if (Array.isArray(saved)) setFollowing(saved);
      const requested = new URLSearchParams(window.location.search).get('topic');
      if (requested && CATEGORIES.some(category => category.name === requested)) setTopic(requested);
    } catch { /* Storage is optional in private browsing. */ }
  }, []);

  useEffect(() => {
    if (!db) { setLoading(false); setLoadError(true); return undefined; }
    return onSnapshot(query(collection(db, 'problems'), orderBy('createdAt', 'desc')), snapshot => {
      setAllProblems(snapshot.docs.map(item => {
        const data = item.data();
        const category = CATEGORIES.find(topicItem => topicItem.name === data.category) || { id: 0, name: data.category || 'General' };
        return { id: item.id, slug: item.id, title: data.title, description: data.description, painPoint: data.description, targetAudience: data.audience, category, author: { displayName: data.authorName }, commentsCount: data.replyCount || 0, createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString() };
      }));
      setLoading(false);
      setLoadError(false);
    }, () => { setLoading(false); setLoadError(true); });
  }, []);

  const topicCounts = useMemo(() => allProblems.reduce((counts, problem) => {
    const name = problem.category?.name || 'General';
    counts[name] = (counts[name] || 0) + 1;
    return counts;
  }, {}), [allProblems]);

  const problems = useMemo(() => allProblems.filter(problem => {
    const matchesTopic = topic === 'All topics' || problem.category?.name === topic;
    const search = searchText.trim().toLowerCase();
    const matchesQuery = !search || [problem.title, problem.description, problem.targetAudience, problem.category?.name].some(value => String(value || '').toLowerCase().includes(search));
    return matchesTopic && matchesQuery;
  }), [allProblems, searchText, topic]);

  const toggleFollow = (name) => {
    const next = following.includes(name) ? following.filter(item => item !== name) : [...following, name];
    setFollowing(next);
    try { window.localStorage.setItem(FOLLOW_KEY, JSON.stringify(next)); } catch { /* Private browsing can disable local storage. */ }
  };

  return <div className="community-page-shell">
    <ItchHeader />
    <main className="community-page-main">
      <section className="community-hero">
        <div>
          <p className="community-kicker"><span><MessageCircle size={15}/></span> COMMUNITY CONVERSATIONS</p>
          <h1>Find a conversation<br /><em>that feels familiar.</em></h1>
          <p>Choose a topic, open a problem, and join the conversation. Keep it simple: shared experiences, useful context, thoughtful replies.</p>
          <Link href="/explore" className="community-hero-action"><Users size={17}/> Browse all problems <ArrowRight size={15}/></Link>
        </div>
        <aside className="community-hero-note" aria-label="A community conversation prompt">
          <span className="community-hero-note-tape" aria-hidden="true" />
          <span className="community-hero-note-label">START A CONVERSATION</span>
          <strong>“I thought it was just me.”</strong>
          <span className="community-hero-note-footer">Find people who relate <MessageCircle size={13}/></span>
        </aside>
      </section>

      <div className="community-preview-notice"><span className="community-preview-dot"/><p><strong>Community conversations.</strong> Open a problem to share context and reply. Posts are public; your email stays private.</p></div>

      <section className="community-discovery" aria-labelledby="topic-heading">
        <div className="community-section-heading"><div><span>START WITH A TOPIC</span><h2 id="topic-heading">What’s on your mind?</h2></div><label className="community-search"><Search size={16}/><span className="sr-only">Search topics and problems</span><input value={searchText} onChange={event => setSearchText(event.target.value)} placeholder="Search conversations" /></label></div>

        <div className="community-topic-tabs" role="group" aria-label="Choose a community topic">
          <button type="button" aria-pressed={topic === 'All topics'} onClick={() => setTopic('All topics')}>All topics <span>{allProblems.length}</span></button>
          {CATEGORIES.map(category => <button key={category.id} type="button" aria-pressed={topic === category.name} onClick={() => setTopic(category.name)}>{category.name}<span>{topicCounts[category.name] || 0}</span></button>)}
        </div>

        {following.length > 0 && <div className="community-following-strip"><span>ON YOUR LIST</span>{following.map(name => <button type="button" key={name} onClick={() => setTopic(name)}>{name} <Heart size={12} fill="currentColor"/></button>)}</div>}

        <div className="community-story-list" aria-live="polite">
          {loading && <p role="status" className="community-local-note">Loading conversations…</p>}
          {loadError && <p role="alert" className="community-local-note">Could not load conversations. Check your connection and Firebase setup.</p>}
          {problems.map((problem, index) => {
            const category = problem.category?.name || 'General';
            const isFollowing = following.includes(category);
            return <article className="community-story" key={problem.id} style={{ '--story-delay': `${Math.min(index * 60, 300)}ms` }}>
              <div className="community-story-index">0{index + 1}</div>
              <div className="community-story-copy"><span>{category}</span><h3>{problem.title}</h3><p>{problem.painPoint || problem.description}</p><small><MessageCircle size={13}/>Posted by {problem.author?.displayName || 'Community member'}</small></div>
              <div className="community-story-actions"><button type="button" aria-pressed={isFollowing} onClick={() => toggleFollow(category)} className={isFollowing ? 'is-following' : ''}><Heart size={15} fill={isFollowing ? 'currentColor' : 'none'}/>{isFollowing ? 'Following' : 'Follow topic'}</button><Link href={`/problems/${problem.slug}`} aria-label={`Open discussion about ${problem.title}`}>Open conversation <ArrowRight size={15}/></Link></div>
            </article>;
          })}
          {!loading && !loadError && problems.length === 0 && <div className="community-empty"><h3>{allProblems.length === 0 ? 'No problems have been posted yet.' : 'No matching problems.'}</h3><p>{allProblems.length === 0 ? 'Share the first one and start a conversation.' : 'Try another topic or search term.'}</p>{allProblems.length === 0 ? <Link href="/problems/new">Post a problem <ArrowRight size={15}/></Link> : <button type="button" onClick={() => { setTopic('All topics'); setSearchText(''); }}>Show all problems</button>}</div>}
        </div>
      </section>
      <p className="community-local-note">Topic follows are saved in this browser.</p>
    </main>
    <ItchFooter />
  </div>;
}
