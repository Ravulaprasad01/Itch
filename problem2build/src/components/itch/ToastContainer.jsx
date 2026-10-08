'use client';

import React from 'react';

export default function ToastContainer({ toasts = [] }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex flex-col items-center gap-2">
      {toasts.map((toast) => {
        const isScratch = toast.type === 'scratch';
        return (
          <div
            key={toast.id}
            className="toast-popup-animate pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-2xl text-on-surface text-xs"
            style={{
              background: 'rgba(11,16,26,0.97)',
              border: isScratch
                ? '1px solid rgba(78,222,163,0.4)'
                : '1px solid rgba(249,115,22,0.4)',
              boxShadow: isScratch
                ? '0 12px 36px -4px rgba(78,222,163,0.25), inset 0 1px 0 rgba(255,255,255,0.08)'
                : '0 12px 36px -4px rgba(249,115,22,0.25), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${isScratch ? 'bg-secondary/15 text-secondary' : 'bg-primary-container/15 text-primary'}`}>
              <span className="material-symbols-outlined text-[1.1rem] checkmark-pop">check_circle</span>
            </div>
            <div>
              <p className="font-semibold text-on-surface text-xs tracking-tight">{toast.title}</p>
              <p className="font-mono text-[10px] text-tertiary/70 mt-0.5">{toast.sub}</p>
            </div>
            <span className="w-1.5 h-1.5 rounded-full ml-1 shrink-0" style={{ background: isScratch ? '#4edea3' : '#f97316' }} />
          </div>
        );
      })}
    </div>
  );
}
