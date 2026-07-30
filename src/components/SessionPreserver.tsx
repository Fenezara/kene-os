'use client';

import { useEffect } from 'react';

/**
 * Kènè OS — SessionPreserver
 * Silently preserves session cookies & local storage state across PWA & mobile tabs.
 * Never performs forced redirects to /login.
 */
export function SessionPreserver() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const preserveSession = () => {
      try {
        const savedUser = localStorage.getItem('kene_user');

        // Check if kene-session cookie exists
        const hasSessionCookie = document.cookie.split(';').some(c => c.trim().startsWith('kene-session='));

        if (!hasSessionCookie && savedUser) {
          try {
            const user = JSON.parse(savedUser);
            const role = user.role || 'client';
            const sessionVal = `${role}-${Date.now()}`;

            // Set client cookie
            document.cookie = `kene-session=${sessionVal}; path=/; max-age=31536000; SameSite=Lax`;

            // Silently sync with server session API
            fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ role: user.role, email: user.email || user.phone || 'user' }),
            }).catch(() => {});
          } catch (e) {}
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

    // 3. Periodic heartbeat check every 30 seconds
    const interval = setInterval(preserveSession, 30000);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', preserveSession);
      clearInterval(interval);
    };
  }, []);

  return null;
}
