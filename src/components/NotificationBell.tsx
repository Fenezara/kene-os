'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import Link from 'next/link';

export function NotificationBell() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    // Mock: fetch unread notifications count
    setCount(3); // Replace with real API call
  }, []);

  return (
    <Link href="/notifications" className="relative p-2 rounded-xl hover:bg-white/5 transition flex items-center justify-center shrink-0">
      <Bell className="w-5 h-5 text-white/40" />
      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#8A1C14] flex items-center justify-center"
          >
            <span className="text-[8px] font-black text-white">{count > 9 ? '9+' : count}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
}
