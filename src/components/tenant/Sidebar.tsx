'use client';

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
  { href: '/pro/dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { href: '/pro/appointments', label: 'Agenda', icon: Calendar },
  { href: '/pro/sales', label: 'Caisse (POS)', icon: ShoppingCart },
  { href: '/pro/inventory', label: 'Stock', icon: Package },
  { href: '/pro/clients', label: 'Fichier Clients', icon: Users },
  { href: '/pro/team', label: 'Équipe & RH', icon: Briefcase },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1A1410] border-r border-white/10 h-screen flex flex-col hidden md:flex sticky top-0">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-2 text-gold-kene">
          <Sparkles className="w-6 h-6" />
          <span className="font-display font-bold text-xl uppercase tracking-widest">Kènè Pro</span>
        </div>
        <p className="text-[10px] text-white/40 mt-1">Espace Gérant</p>
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
