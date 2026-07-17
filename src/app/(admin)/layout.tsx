import React from 'react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0F0A05] text-[#F8F1E4] flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-[#1A1410] border-b border-white/5 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#8B1A3B] flex items-center justify-center font-bold text-white font-display">A</div>
          <span className="font-display font-bold text-lg text-white">Console Admin Kènè</span>
        </div>
        <div className="text-sm text-white/60">
          Super-Administrateur
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex">
        {/* Left Nav */}
        <aside className="w-64 bg-[#1A1410] border-r border-white/5 p-6 space-y-2">
          <div className="px-3 py-2 rounded bg-white/5 text-white font-medium cursor-pointer">Entreprises (KYB)</div>
          <div className="px-3 py-2 rounded text-white/60 hover:text-white hover:bg-white/5 transition cursor-pointer">Abonnements B2B</div>
          <div className="px-3 py-2 rounded text-white/60 hover:text-white hover:bg-white/5 transition cursor-pointer">Supervision IA</div>
          <div className="px-3 py-2 rounded text-white/60 hover:text-white hover:bg-white/5 transition cursor-pointer">Logs d'audit</div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
