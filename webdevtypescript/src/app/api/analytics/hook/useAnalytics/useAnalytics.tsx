//useAnalytics.tsx - FIXED VERSION
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const useAnalytics = () => {
  const pathname = usePathname();
  const clickCount = useRef<number>(0);
  const sessionStartTime = useRef<number>(0);
  const previousPathname = useRef<string>('');
  const sessionId = useRef<string>('');
  const visitedPages = useRef<Set<string>>(new Set());
  const hasInitializedSession = useRef<boolean>(false); // NEW: Track if session is initialized

  //Generate session ID once per browser session
  useEffect(() => {
    if (typeof window === 'undefined' || hasInitializedSession.current) return;
    
    //Check if we already have a session ID for this browser session
    let currentSessionId = sessionStorage.getItem('analytics_session_id');
    
    if (!currentSessionId) {
      //Generate new session ID: timestamp + random string
      currentSessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', currentSessionId);
      sessionStorage.setItem('analytics_session_start', Date.now().toString());
      
      //Clear visited pages for new session
      sessionStorage.removeItem('analytics_visited_pages');
    }
    
    sessionId.current = currentSessionId;
    
    //Get visited pages for this session
    const visitedPagesStr = sessionStorage.getItem('analytics_visited_pages');
    if (visitedPagesStr) {
      visitedPages.current = new Set(JSON.parse(visitedPagesStr));
    }
    
    hasInitializedSession.current = true;
  }, []);

  //Track clicks on the page
  useEffect(() => {
    const handleClick = () => {
      clickCount.current += 1;
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('click', handleClick);
    }
    
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('click', handleClick);
      }
    };
  }, []);

  //Track page views (runs on every pathname change)
  useEffect(() => {
    if (typeof window === 'undefined' || !hasInitializedSession.current) return;

    const trackPageView = async () => {
      try {
        sessionStartTime.current = Date.now();
        
        //Check if this is the first time visiting this page in this session
        const isFirstVisitToPage = !visitedPages.current.has(pathname);
        
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: pathname,
            totalClicks: 0,
            sessionId: sessionId.current,
            isInitialView: true, // Always true for page views
            isFirstVisitToPage: isFirstVisitToPage
          }),
        });
        
        //Mark this page as visited in this session
        visitedPages.current.add(pathname);
        sessionStorage.setItem('analytics_visited_pages', JSON.stringify([...visitedPages.current]));
        
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackPageView();
  }, [pathname]); // Remove hasTrackedView dependency

  //Send click data when user leaves page or navigates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sendClickData = async (pageToTrack: string) => {
      if (clickCount.current > 0 && pageToTrack) {
        try {
          const data = JSON.stringify({
            page: pageToTrack,
            totalClicks: clickCount.current,
            sessionId: sessionId.current,
            isInitialView: false, // This is a click update
            isFirstVisitToPage: false
          });

          if (navigator.sendBeacon) {
            const blob = new Blob([data], { type: 'application/json' });
            navigator.sendBeacon('/api/analytics/track', blob);
          } else {
            await fetch('/api/analytics/track', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: data,
              keepalive: true
            });
          }
          
          console.log(`Sent ${clickCount.current} clicks for page: ${pageToTrack}`);
        } catch (error) {
          console.error('Analytics click tracking error:', error);
        }
      }
    };

    const handleBeforeUnload = () => {
      sendClickData(pathname);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        sendClickData(pathname);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname]);

  //Handle page changes - send clicks from previous page
  useEffect(() => {
    //If we have a previous page with clicks, send them
    if (previousPathname.current && clickCount.current > 0 && hasInitializedSession.current) {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: previousPathname.current,
          totalClicks: clickCount.current,
          sessionId: sessionId.current,
          isInitialView: false,
          isFirstVisitToPage: false
        }),
      }).then(() => {
        console.log(`Navigation: Sent ${clickCount.current} clicks for ${previousPathname.current}`);
      }).catch(error => {
        console.error('Analytics click tracking error on navigation:', error);
      });
    }

    //Update previous pathname and reset click counter
    previousPathname.current = pathname;
    clickCount.current = 0;
    // DON'T reset sessionStartTime here - removed this line
  }, [pathname]);

  return {};
};

export default useAnalytics;