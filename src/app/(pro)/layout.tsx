'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ProLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { name: 'Tableau de bord', href: '/pro' },
    { name: 'Agenda / Planning', href: '/agenda' },
    { name: 'Caisse / POS', href: '/caisse' },
    { name: 'Clients CRM', href: '/clients' },
    { name: 'Comptabilité SYSCOHADA', href: '/compta' },
    { name: 'RH & Bulletins', href: '/rh' },
  ]

  return (
    <div className="min-h-screen bg-[#0F0A05] text-[#F8F1E4] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#1A1410] border-b md:border-b-0 md:border-r border-white/5 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 rounded bg-[#C8951E] flex items-center justify-center font-bold text-[#1A1410] font-display">K</div>
            <span className="font-display font-bold text-lg text-[#C8951E]">Kènè Pro</span>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-gold-kene/10 to-[#1A1410] border border-gold-kene/20 text-[#C8951E]'
                      : 'border border-transparent text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
            
            {/* Disabled Stubs */}
            <div 
              onClick={() => alert("Gestion des stocks et inventaires botaniques bientôt disponible !")}
              className="px-3 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-white/20 border border-transparent hover:bg-white/5 transition cursor-pointer"
            >
              Stocks & Articles (Bientôt)
            </div>
          </nav>
        </div>
        <div className="text-[10px] text-white/30 pt-4 border-t border-white/5 font-mono">
          Conformité SYSCOHADA & CNPS
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
