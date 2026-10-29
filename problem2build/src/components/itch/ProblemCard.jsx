'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, Coins, MessageCircle, Star } from 'lucide-react';

const tones = ['coral', 'lilac', 'aqua', 'gold'];

export default function ProblemCard({ problem }) {
  const status = problem.status === 'validating' ? 'Finding momentum' : 'Open to ideas';
  const tone = tones[(problem.category?.id || 1) % tones.length];

  return <>
    <article className="explore-problem-card" data-tone={tone}>
      <div className="explore-card-topline">
        <span className="explore-category">{problem.category?.name || 'General'}</span>
        <span className="explore-status"><i />{status}</span>
      </div>

      <div className="explore-card-content">
        <Link href={`/problems/${problem.slug}`} className="explore-card-title-link">
          <h2>{problem.title}<ArrowUpRight size={18} /></h2>
        </Link>
        <p className="explore-card-description">{problem.painPoint || problem.description}</p>
        {problem.author?.displayName && <p className="explore-card-author">Posted by <strong>{problem.author.displayName}</strong></p>}
        {problem.fundingInterest && <p className="explore-card-funding"><Coins size={14} aria-hidden="true"/><span>Potential support for a solution</span>{problem.fundingAmount ? <strong>{problem.fundingCurrency} {problem.fundingAmount.toLocaleString()}</strong> : null}<small>non-binding</small></p>}
        <div className="explore-card-context">
          {problem.currentWorkaround && <p><span>RIGHT NOW</span>{problem.currentWorkaround}</p>}
          {problem.targetAudience && <p><span>WHO IT AFFECTS</span>{problem.targetAudience}</p>}
        </div>
      </div>

      <div className="explore-card-footer">
        <span className="explore-card-me-too"><Star size={13} aria-hidden="true" /> {problem.meTooCount || 0} {problem.meTooCount === 1 ? 'person faces this' : 'people face this'}</span>
        <Link href={`/problems/${problem.slug}`} className="explore-discussion-link"><MessageCircle size={15} /> Join conversation <ArrowUpRight size={14} /></Link>
      </div>
    </article>
  </>;
}
