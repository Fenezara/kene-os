'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientGroupRootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/portal');
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin h-8 w-8 border-4 border-[#C8951E] border-t-transparent rounded-full" />
    </div>
  );
}
