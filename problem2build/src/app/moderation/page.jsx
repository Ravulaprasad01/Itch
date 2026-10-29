'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth';
import { collection, doc, limit, onSnapshot, orderBy, query, runTransaction, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, ExternalLink, Flag, LoaderCircle, ShieldCheck } from 'lucide-react';
import ItchHeader from '@/components/itch/ItchHeader';
import ItchFooter from '@/components/itch/ItchFooter';
import { auth, db } from '@/lib/firebase';

const REASON_LABELS = {
  spam: 'Spam or promotion',
  harassment: 'Harassment or abuse',
  'private-info': 'Private or identifying information',
  misleading: 'Misleading or harmful content',
  other: 'Something else',
};

export default function ModerationPage() {
  const [user, setUser] = useState(null);
  const [checkingRole, setCheckingRole] = useState(true);
  const [isModerator, setIsModerator] = useState(false);
  const [reports, setReports] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [notice, setNotice] = useState('');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    if (!auth) { setCheckingRole(false); return undefined; }
    return onAuthStateChanged(auth, async nextUser => {
      setUser(nextUser);
      setCheckingRole(true);
      setIsModerator(false);
      if (!nextUser) { setCheckingRole(false); return; }
      try {
        const token = await getIdTokenResult(nextUser, true);
        setIsModerator(token.claims.moderator === true);
      } catch { setIsModerator(false); }
      finally { setCheckingRole(false); }
    });
  }, []);

  useEffect(() => {
    if (!db || !isModerator) return undefined;
    return onSnapshot(query(collection(db, 'reports'), orderBy('createdAt', 'desc'), limit(100)), snapshot => {
      setReports(snapshot.docs.map(item => ({ id: item.id, ...item.data() })));
      setLoadError('');
    }, () => setLoadError('Could not load reports. Check your moderator access and connection.'));
  }, [isModerator]);

  const moderate = async (report, action) => {
    if (!db) { setLoadError('Moderation is not available right now.'); return; }
    setBusyId(report.id);
    setNotice('');
    setLoadError('');
    try {
      const reportRef = doc(db, 'reports', report.id);
      await runTransaction(db, async transaction => {
        const reportSnapshot = await transaction.get(reportRef);
        if (!reportSnapshot.exists()) throw new Error('This report no longer exists.');
        const data = reportSnapshot.data();
        if (!['problem', 'reply'].includes(data.targetType) || !data.problemId || !data.targetId) {
          throw new Error('This report has an invalid content reference.');
        }
        const targetRef = data.targetType === 'problem'
          ? doc(db, 'problems', data.problemId)
          : doc(db, 'problems', data.problemId, 'replies', data.targetId);
        let targetSnapshot = null;
        if (action !== 'dismiss') {
          targetSnapshot = await transaction.get(targetRef);
          if (!targetSnapshot.exists()) throw new Error('The reported content no longer exists.');
          transaction.update(targetRef, { moderationStatus: action === 'hide' ? 'hidden' : 'visible' });
        }
        transaction.update(reportRef, {
          status: action === 'dismiss' ? 'dismissed' : action === 'hide' ? 'actioned' : 'restored',
          reviewedBy: user.uid,
          reviewedAt: serverTimestamp(),
        });
      });
      setNotice(action === 'hide' ? 'Content hidden from public view.' : action === 'restore' ? 'Content restored to public view.' : 'Report dismissed.');
    } catch (error) {
      setLoadError(error?.message || 'Could not update this report.');
    } finally { setBusyId(''); }
  };

  return <div className="min-h-dvh flex flex-col bg-background text-on-surface">
    <ItchHeader/>
    <main id="main-content" className="moderation-page flex-1">
      <Link href="/explore" className="moderation-back"><ArrowLeft size={15}/> Back to Explore</Link>
      <header className="moderation-heading"><span><ShieldCheck size={17}/> TRUST & SAFETY</span><h1>Moderation desk</h1><p>Review community reports and keep problem conversations useful and respectful.</p></header>
      {checkingRole ? <p className="moderation-empty"><LoaderCircle className="animate-spin" size={18}/> Checking moderator access…</p>
        : !user ? <section className="moderation-empty"><h2>Moderator sign-in required</h2><p>Sign in with an account that has the moderator role.</p><Link href={`/auth?next=${encodeURIComponent('/moderation')}`}>Sign in</Link></section>
        : !isModerator ? <section className="moderation-empty"><h2>This area is restricted</h2><p>Only designated moderators can review private reports. If you manage Itch, grant your account the moderator custom claim using the setup notes.</p><Link href="/community-guidelines">Review the guidelines</Link></section>
          : <>
            {notice && <p className="moderation-notice" role="status">{notice}</p>}
            {loadError && <p className="moderation-error" role="alert">{loadError}</p>}
            <section className="moderation-reports" aria-label="Recent reports"><div className="moderation-list-heading"><h2>Recent reports</h2><span>{reports.length} shown · newest first</span></div>
              {reports.length === 0 ? <div className="moderation-empty"><Flag size={20}/><h3>No reports yet</h3><p>New reports will appear here for moderator review.</p></div> : reports.map(report => <article className="moderation-report" key={report.id}>
                <div className="moderation-report-top"><span className={`moderation-report-status is-${report.status || 'open'}`}>{report.status || 'open'}</span><time>{report.createdAt?.toDate?.().toLocaleString() || 'Just now'}</time></div>
                <h3>{REASON_LABELS[report.reason] || 'Content report'}</h3>
                <p>{report.targetType === 'problem' ? 'Problem post' : 'Conversation reply'} · Report {report.id.slice(0, 8)}</p>
                <Link className="moderation-target-link" href={`/problems/${report.problemId}${report.targetType === 'reply' ? `#reply-${report.targetId}` : ''}`} target="_blank">Open reported content <ExternalLink size={14}/></Link>
                <div className="moderation-report-actions"><button type="button" onClick={() => moderate(report, report.status === 'actioned' ? 'restore' : 'hide')} disabled={busyId === report.id}>{busyId === report.id ? 'Updating…' : report.status === 'actioned' ? 'Restore content' : 'Hide content'}</button>{report.status !== 'dismissed' && <button type="button" className="is-muted" onClick={() => moderate(report, 'dismiss')} disabled={busyId === report.id}>Dismiss report</button>}</div>
              </article>)}
            </section>
          </>}
    </main>
    <ItchFooter/>
  </div>;
}
