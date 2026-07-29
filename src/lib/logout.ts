'use client';

export function handleLogout() {
  if (typeof window === 'undefined') return;

  try {
    // 1. Clear all session cookies
    document.cookie = 'kene-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax;';
    document.cookie = 'kene-session=; path=/dashboard; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax;';
    document.cookie = 'kene-session=; path=/portal; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax;';

    // 2. Clear all local & session storage
    localStorage.removeItem('kene_user');
    localStorage.removeItem('kene_user_avatar');
    localStorage.removeItem('kene_latest_client_photo');
    localStorage.removeItem('kene_saved_diagnoses');
    sessionStorage.clear();

    // 3. Call server logout endpoint silently
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  } catch (e) {
    console.error('[KÈNÈ LOGOUT] Error clearing session:', e);
  } finally {
    // 4. Force replace browser history entry so back button cannot re-enter
    window.location.replace('/login');
  }
}
