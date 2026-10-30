'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function ItchLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 2000);
    return () => window.clearTimeout(timeout);
  }, []);

  if (!visible) return null;

  return (
    <div className="itch-loader-overlay" role="status" aria-live="polite" aria-label="Loading Itch">
      <div className="itch-loader-content">
        <div className="itch-loader-orbit" aria-hidden="true">
          <span className="itch-loader-orbit-line" />
          <Image src="/itch-mark.svg" alt="" width={54} height={54} priority className="itch-loader-mark" />
        </div>
        <p className="itch-loader-label">Getting Itch ready</p>
        <p className="itch-loader-flow" aria-hidden="true"><span>Share it</span><i /><span>Support it</span><i /><span>Build it</span></p>
      </div>
    </div>
  );
}
