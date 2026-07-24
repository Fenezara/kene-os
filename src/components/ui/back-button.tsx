'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface BackButtonProps {
  fallbackUrl?: string;
  className?: string;
  label?: string;
}

export function BackButton({ fallbackUrl = '/portal', className = '', label = 'Retour' }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03, x: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleBack}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold font-display shadow-md transition-all cursor-pointer group bg-white/10 hover:bg-[#C8951E]/20 text-white hover:text-[#C8951E] border border-white/15 hover:border-[#C8951E]/50 backdrop-blur-md ${className}`}
      title="Retourner à la page précédente"
    >
      <ArrowLeft className="w-4 h-4 text-[#C8951E] group-hover:-translate-x-1 transition-transform duration-200" />
      <span>{label}</span>
    </motion.button>
  );
}
