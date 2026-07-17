'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const Canvas3D = dynamic(() => import('@/components/kene/Canvas3D'), {
  ssr: false,
})

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0F0A05] p-0 md:p-4">
      {/* Background 3D Canvas */}
      <Canvas3D />

      {/* Mobile viewport container */}
      <main className="w-full max-w-md min-h-screen md:min-h-[85vh] md:max-h-[90vh] md:rounded-[2.5rem] bg-[#1A1410]/80 backdrop-blur-lg md:border md:border-white/10 shadow-2xl relative flex flex-col overflow-hidden text-foreground">
        {/* Content area */}
        <div id="kene-scroll-container" className="flex-1 overflow-y-auto scrollbar-none flex flex-col justify-between">
          {children}
        </div>
      </main>
    </div>
  )
}
