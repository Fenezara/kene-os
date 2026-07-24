'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const { toast } = useToast();

  useEffect(() => {
    // Check saved theme preference
    const savedTheme = localStorage.getItem('kene_theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode');
      } else {
        document.documentElement.classList.remove('light-mode');
      }
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('kene_theme', nextTheme);

    if (nextTheme === 'light') {
      document.documentElement.classList.add('light-mode');
      toast({
        title: '☀️ Mode Clair Activé',
        description: 'L\'interface Kènè Pro est maintenant en Mode Ivoire & Or.',
      });
    } else {
      document.documentElement.classList.remove('light-mode');
      toast({
        title: '🌙 Mode Sombre Activé',
        description: 'L\'interface Kènè Pro est maintenant en Mode Cacao & Or.',
      });
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold font-display transition-all cursor-pointer shadow-md bg-white/5 border-white/10 hover:bg-white/10 text-white/80"
      title={theme === 'dark' ? 'Passer en Mode Clair (Ivoire & Or)' : 'Passer en Mode Sombre (Cacao & Or)'}
    >
      {theme === 'dark' ? (
        <>
          <Sun className="w-3.5 h-3.5 text-[#C8951E]" />
          <span className="hidden sm:inline">Mode Clair</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-[#C8951E]" />
          <span className="hidden sm:inline">Mode Sombre</span>
        </>
      )}
    </button>
  );
}
