'use client';

import { useEffect, useState } from 'react';

export default function ItchLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 2000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="itch-loader-overlay" role="status" aria-live="polite">
      <span className="sr-only">Loading Itch</span>
      <div className="itch-loader-scene" aria-hidden="true">
        <div className="itch-speeder">
          <span className="itch-speeder-wake">
            <span /><span /><span /><span />
          </span>
          <span className="itch-speeder-top" />
          <div className="itch-speeder-base">
            <span />
            <span className="itch-speeder-face" />
          </div>
        </div>
        <div className="itch-longfazers"><span /><span /><span /><span /></div>
        <p>Finding your way</p>
      </div>
    </div>
  );
}
