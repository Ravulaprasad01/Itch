'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { ArrowRight, Heart, X } from 'lucide-react';

export default function ThanksCommunityModal({ problem, onClose }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const topic = problem?.category?.name;
  const communityHref = topic ? `/community?topic=${encodeURIComponent(topic)}` : '/community';

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'Tab' && dialogRef.current) {
        const focusable = [...dialogRef.current.querySelectorAll('button:not(:disabled), a[href]')];
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  if (typeof document === 'undefined') return null;
  return createPortal((
    <div className="thanks-overlay" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section ref={dialogRef} className="thanks-dialog" role="dialog" aria-modal="true" aria-labelledby="thanks-title" aria-describedby="thanks-description">
        <button ref={closeRef} className="thanks-close" type="button" aria-label="Close thank-you message" onClick={onClose}><X size={18} /></button>
        <div className="thanks-heart-stage" aria-hidden="true">
          <span className="thanks-heart-orbit thanks-heart-orbit-one" />
          <span className="thanks-heart-orbit thanks-heart-orbit-two" />
          <Heart className="thanks-heart-icon" fill="currentColor" strokeWidth={1.2} />
          <span className="thanks-heart-spark thanks-heart-spark-one">✳</span>
          <span className="thanks-heart-spark thanks-heart-spark-two">✦</span>
        </div>
        <p className="thanks-kicker">A little kindness goes a long way</p>
        <h2 id="thanks-title">Thank you for showing up.</h2>
        <p id="thanks-description" className="thanks-copy">Your reaction is part of this preview. The next step is finding other people who recognize the same problem.</p>
        <p className="thanks-preview-note">Reactions aren’t shared with other people yet.</p>
        <div className="thanks-actions">
          <Link href="/explore" onClick={onClose} className="thanks-action-secondary">Explore more <ArrowRight size={16} /></Link>
          <Link href={communityHref} onClick={onClose} className="thanks-action-primary">Join community <ArrowRight size={16} /></Link>
        </div>
      </section>
    </div>
  ), document.body);
}
