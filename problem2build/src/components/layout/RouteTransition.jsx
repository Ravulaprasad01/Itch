'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function RouteTransition({ children }) {
  const pathname = usePathname();
  const [navigationDirection, setNavigationDirection] = useState('forward');
  const [activeRoute, setActiveRoute] = useState({ pathname, direction: 'forward' });

  useEffect(() => {
    const handlePopState = () => {
      setNavigationDirection('back');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleLinkClick = (event) => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || anchor.target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin === window.location.origin && destination.pathname !== pathname) {
      setNavigationDirection('forward');
    }
  };

  useEffect(() => {
    if (pathname && pathname !== activeRoute.pathname) {
      setActiveRoute({ pathname, direction: navigationDirection });
      if (navigationDirection === 'back') setNavigationDirection('forward');
    }
  }, [activeRoute.pathname, navigationDirection, pathname]);

  return (
    <div onClickCapture={handleLinkClick} key={activeRoute.pathname} className={`route-transition route-transition-${activeRoute.direction}`}>
      {children}
    </div>
  );
}
