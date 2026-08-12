'use client';

export function handleLogout() {
  if (typeof window === 'undefined') return;

  try {
    // 1. Set explicit logged out flag
    localStorage.setItem('kene_logged_out', 'true');

    // 2. Clear all session cookies across paths
    const pastDate = 'Thu, 01 Jan 1970 00:00:00 GMT; max-age=0; SameSite=Lax;';
    document.cookie = `kene-session=; path=/; expires=${pastDate}`;
    document.cookie = `kene-session=; path=/dashboard; expires=${pastDate}`;
    document.cookie = `kene-session=; path=/portal; expires=${pastDate}`;
    document.cookie = `kene-session=; path=/chat; expires=${pastDate}`;

    // 3. Clear user data
    localStorage.removeItem('kene_user');
    localStorage.removeItem('kene_user_avatar');
    localStorage.removeItem('kene_latest_client_photo');
    localStorage.removeItem('kene_saved_diagnoses');
    localStorage.removeItem('kene_chat_media_feed');
    localStorage.removeItem('kene_chat_active_step');
    localStorage.removeItem('kene_chat_consultation_data');
    localStorage.removeItem('kene_chat_dynamic_flow');
    sessionStorage.clear();

    // 4. Call server logout endpoint
    fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
  } catch (e) {
    console.error('[KÈNÈ LOGOUT] Error clearing session:', e);
  } finally {
    // 5. Hard redirect to login page
    window.location.href = '/login?logged_out=true';
  }
}
