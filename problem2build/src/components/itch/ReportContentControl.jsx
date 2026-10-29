'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Flag } from 'lucide-react';
import { collection, doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const REASONS = [
  ['spam', 'Spam or promotion'],
  ['harassment', 'Harassment or abuse'],
  ['private-info', 'Private or identifying information'],
  ['misleading', 'Misleading or harmful content'],
  ['other', 'Something else'],
];

export default function ReportContentControl({ currentUser, problemId, targetId, targetType }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const submit = async event => {
    event.preventDefault();
    if (!currentUser) return;
    if (!reason || !db) {
      setError(!db ? 'Reporting is not available right now.' : 'Choose a reason to continue.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const safeReportId = `${currentUser.uid}_${targetType}_${problemId}_${targetId}`;
      const reportRef = doc(db, 'reports', safeReportId);
      const problemRef = doc(db, 'problems', problemId);
      const targetRef = targetType === 'problem' ? problemRef : doc(db, 'problems', problemId, 'replies', targetId);
      const rateRef = doc(db, 'rateLimits', currentUser.uid);
      const alreadyReported = await runTransaction(db, async transaction => {
        const [problemSnapshot, targetSnapshot, reportSnapshot, rateSnapshot] = await Promise.all([
          transaction.get(problemRef),
          targetRef.path === problemRef.path ? Promise.resolve(null) : transaction.get(targetRef),
          transaction.get(reportRef),
          transaction.get(rateRef),
        ]);
        const contentSnapshot = targetSnapshot || problemSnapshot;
        if (!problemSnapshot.exists() || !contentSnapshot.exists() || contentSnapshot.data().moderationStatus !== 'visible') {
          throw new Error('This content is no longer available.');
        }
        if (reportSnapshot.exists()) return true;
        const lastReportAt = rateSnapshot.data()?.lastReportAt?.toMillis?.();
        if (lastReportAt && Date.now() - lastReportAt < 10_000) {
          throw new Error('Please wait a few seconds before reporting again.');
        }
        transaction.set(reportRef, {
          targetType,
          problemId,
          targetId,
          reason,
          reporterId: currentUser.uid,
          status: 'open',
          createdAt: serverTimestamp(),
        });
        transaction.set(rateRef, { lastReportAt: serverTimestamp() }, { merge: true });
        return false;
      });
      setNotice(alreadyReported ? 'You already reported this content.' : 'Report sent to the moderation team.');
      setOpen(false);
    } catch (sendError) {
      setError(sendError?.message === 'Please wait a few seconds before reporting again.'
        || sendError?.message === 'This content is no longer available.'
        ? sendError.message
        : 'Could not send your report. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return <div className="report-control">
    {notice ? <span className="report-control-notice" role="status">{notice}</span> : <button type="button" className="report-control-trigger" onClick={() => { setOpen(value => !value); setError(''); }} aria-expanded={open}>
      <Flag size={14} aria-hidden="true"/> Report
    </button>}
    {open && <div className="report-control-panel">
      {!currentUser ? <p><Link href={`/auth?next=${encodeURIComponent(`/problems/${problemId}`)}`}>Sign in</Link> to report this content.</p> : <form onSubmit={submit}>
        <label htmlFor={`report-reason-${targetType}-${targetId}`}>Why are you reporting this?</label>
        <select id={`report-reason-${targetType}-${targetId}`} value={reason} onChange={event => setReason(event.target.value)} required>
          <option value="">Select a reason</option>
          {REASONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <button type="submit" disabled={busy || !reason}>{busy ? 'Sending…' : 'Send report'}</button>
        <p>Reports are reviewed against the <Link href="/community-guidelines">community guidelines</Link>.</p>
      </form>}
      {error && <p className="report-control-error" role="alert">{error}</p>}
    </div>}
  </div>;
}
