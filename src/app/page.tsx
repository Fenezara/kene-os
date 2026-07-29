'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('kene_user');
      const hasCookie = document.cookie.split(';').some(c => c.trim().startsWith('kene-session='));

      if (savedUser && hasCookie) {
        try {
          const user = JSON.parse(savedUser);
          if (user.role === 'client') {
            router.replace('/portal');
          } else if (user.role === 'admin') {
            router.replace('/admin');
          } else {
            router.replace('/dashboard');
          }
          return;
        } catch (e) {}
      }

      // Direct Web App Entry: Open Portal Application immediately (NO LANDING PAGE)
      router.replace('/portal');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0F0A05] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-[#C8951E] border-t-transparent animate-spin" />
    </div>
  );
}
