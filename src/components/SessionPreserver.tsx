'use client';

import { useEffect } from 'react';

export function SessionPreserver() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const preserveSession = () => {
      try {
        const savedUser = localStorage.getItem('kene_user');
        if (!savedUser) return;

        const user = JSON.parse(savedUser);
        const role = user.role || 'client';

        // Check if kene-session cookie exists
        const hasSessionCookie = document.cookie.split(';').some(c => c.trim().startsWith('kene-session='));

        if (!hasSessionCookie) {
          const sessionVal = `${role}-${Date.now()}`;
          // Set persistent 1-year cookie for mobile devices & PWAs
          document.cookie = `kene-session=${sessionVal}; path=/; max-age=31536000; SameSite=Lax`;
          
          // Silently refresh server HttpOnly cookie
          fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: user.role, email: user.email || user.phone })
          }).catch(() => {});
        }
      } catch (e) {
        console.warn('[KÈNÈ SESSION PRESERVER] Error preserving session:', e);
      }
    };

    // 1. Initial check on mount
    preserveSession();

    // 2. Re-check whenever mobile app becomes visible or active again
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        preserveSession();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', preserveSession);

    // 3. Periodic heartbeat check every 10 seconds
    const interval = setInterval(preserveSession, 10000);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', preserveSession);
      clearInterval(interval);
    };
  }, []);

  return null;
}
