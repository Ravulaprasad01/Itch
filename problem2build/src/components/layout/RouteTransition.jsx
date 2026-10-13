'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import ItchLoader from '@/components/layout/ItchLoader';

export default function RouteTransition({ children }) {
  const pathname = usePathname();
  const [navigationDirection, setNavigationDirection] = useState('forward');
  const [activeRoute, setActiveRoute] = useState({ pathname, direction: 'forward' });
  const [hasNavigated, setHasNavigated] = useState(false);
  const [isNavigating, setIsNavigating] = useState(true);
  const navigationStartedAt = useRef(Date.now());
  const initialLoaderTimeout = useRef(null);
  const loaderTimeout = useRef(null);

  const startNavigationLoader = useCallback(() => {
    window.clearTimeout(initialLoaderTimeout.current);
    navigationStartedAt.current = Date.now();
    window.clearTimeout(loaderTimeout.current);
    setIsNavigating(true);
    loaderTimeout.current = window.setTimeout(() => setIsNavigating(false), 2000);
  }, []);

  useEffect(() => {
    initialLoaderTimeout.current = window.setTimeout(() => {
      navigationStartedAt.current = 0;
      setIsNavigating(false);
    }, 650);
    return () => window.clearTimeout(initialLoaderTimeout.current);
  }, [startNavigationLoader]);

  useEffect(() => {
    const handlePopState = () => {
      setNavigationDirection('back');
      startNavigationLoader();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [startNavigationLoader]);

  const handleLinkClick = (event) => {
    const anchor = event.target.closest('a[href]');
    if (!anchor || anchor.target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin === window.location.origin && destination.pathname !== pathname) {
      startNavigationLoader();
      setNavigationDirection('forward');
    }
  };

  useEffect(() => {
    if (pathname && pathname !== activeRoute.pathname) {
      if (!navigationStartedAt.current) startNavigationLoader();
      window.clearTimeout(loaderTimeout.current);
      const minimumVisibleTime = Math.max(0, 420 - (Date.now() - navigationStartedAt.current));
      if (minimumVisibleTime) {
        loaderTimeout.current = window.setTimeout(() => setIsNavigating(false), minimumVisibleTime);
      } else {
        setIsNavigating(false);
      }
      setActiveRoute({ pathname, direction: navigationDirection });
      setHasNavigated(true);
      if (navigationDirection === 'back') setNavigationDirection('forward');
    }
  }, [activeRoute.pathname, navigationDirection, pathname, startNavigationLoader]);

  useEffect(() => () => {
    window.clearTimeout(loaderTimeout.current);
  }, []);

  return (
    <div onClickCapture={handleLinkClick} key={activeRoute.pathname} className={`route-transition route-transition-${activeRoute.direction}${hasNavigated ? ' has-navigated' : ''}`}>
      {children}
      {isNavigating && <ItchLoader />}
    </div>
  );
}
