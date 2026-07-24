'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingCart, 
  Package, 
  Users, 
  Briefcase,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react';

const MENU_ITEMS = [
  { href: '/dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { href: '/agenda', label: 'Agenda & RDV', icon: Calendar },
  { href: '/pos', label: 'Caisse (POS)', icon: ShoppingCart },
  { href: '/inventory', label: 'Stock & Produits', icon: Package },
  { href: '/clients', label: 'Fichier Clients', icon: Users },
  { href: '/employees', label: 'Équipe & RH', icon: Briefcase },
];

export function Sidebar() {
  const pathname = usePathname();
  const [salonName, setSalonName] = useState('Kènè Pro');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTenant = localStorage.getItem('kene_tenant_settings');
      const savedUser = localStorage.getItem('kene_user');
      if (savedTenant) {
        try {
          const p = JSON.parse(savedTenant);
          if (p.identity?.commercialName) setSalonName(p.identity.commercialName);
        } catch (e) {}
      } else if (savedUser) {
        try {
          const u = JSON.parse(savedUser);
          if (u.salonName) setSalonName(u.salonName);
        } catch (e) {}
      }
    }
  }, []);

  return (
    <aside className="w-64 bg-[#1A1410] border-r border-white/10 h-screen flex flex-col hidden md:flex sticky top-0">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-gold-kene">
          <Sparkles className="w-5 h-5 text-[#C8951E] shrink-0" />
          <span className="font-display font-bold text-base uppercase tracking-wider text-[#F3E5AB] truncate">{salonName}</span>
        </div>
        <p className="text-[10px] text-white/40 mt-1">Espace Gestion Entreprise</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {MENU_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-gold-kene/10 text-gold-kene font-semibold border border-gold-kene/20' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all">
          <Settings className="w-5 h-5" />
          <span className="text-sm">Paramètres</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400/80 hover:bg-red-500/10 hover:text-red-400 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
