'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WelcomeScreen } from '@/components/experience/WelcomeScreen';

export default function Home() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('kene_user');
      const hasCookie = document.cookie.split(';').some(c => c.trim().startsWith('kene-session='));

      if (savedUser && hasCookie) {
        try {
          const user = JSON.parse(savedUser);
          if (user.role === 'client') {
            router.replace('/portal');
            return;
          } else if (user.role === 'admin') {
            router.replace('/admin');
            return;
          } else {
            router.replace('/dashboard');
            return;
          }
        } catch (e) {}
      }

      setCheckingSession(false);
    }
  }, [router]);

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#0F0A05] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#C8951E] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Render Universal Welcome Screen for New Visitors (Option B)
  return <WelcomeScreen />;
}
