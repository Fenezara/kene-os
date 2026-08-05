'use client';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'appointment', title: 'Nouveau RDV confirmé', desc: 'Aminata Diallo — Soin Karité · Demain 14h00', time: '5 min', read: false, icon: '📁…' },
  { id: '2', type: 'payment', title: 'Paiement Wave reçu', desc: '25 000 FCFA · Facture FAC-2024-0047', time: '23 min', read: false, icon: '💰' },
  { id: '3', type: 'stock', title: 'Alerte stock bas', desc: 'Beurre de Karité Pur — Plus que 3 unités', time: '1h', read: false, icon: '⚠️ï¸' },
  { id: '4', type: 'review', title: 'Nouvel avis 5 étoiles', desc: 'Fatou Koné a laissé un avis excellent', time: '2h', read: true, icon: '⭐' },
  { id: '5', type: 'marketing', title: 'Campagne envoyée', desc: 'WhatsApp · 47 destinataires · Taux ouverture 94%', time: '3h', read: true, icon: '📁£' },
  { id: '6', type: 'appointment', title: 'RDV annulé', desc: 'Mariam Coulibaly a annulé son RDV 16h30', time: 'Hier', read: true, icon: '❌' },
  { id: '7', type: 'payment', title: 'Paiement Orange Money', desc: '15 000 FCFA · Ndeye Sarr', time: 'Hier', read: true, icon: '🟠' },
  { id: '8', type: 'system', title: 'Sauvegarde automatique', desc: 'Données synchronisées avec succès', time: 'Hier', read: true, icon: '✨…' },
];

export default function NotificationsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-black text-white">Notifications</h1>
          <p className="text-sm text-white/50 mt-1">Vos alertes et mises à jour récentes</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold text-white/80 transition-colors self-start md:self-auto"
        >
          <CheckCircle2 className="w-4 h-4" />
          Tout marquer comme lu
        </motion.button>
      </div>

      <div className="space-y-3">
        {MOCK_NOTIFICATIONS.map((notif, index) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative p-4 md:p-5 rounded-2xl border transition-all ${
              notif.read 
                ? 'bg-[#1A1410]/50 border-white/5' 
                : 'bg-[#1A1410] border-[#C8951E]/30 shadow-lg shadow-[#C8951E]/5'
            } flex gap-4 items-start`}
          >
            {!notif.read && (
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-[#F3E5AB] to-[#C8951E] rounded-l-2xl" />
            )}
            
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
              notif.read ? 'bg-white/5 opacity-60' : 'bg-[#C8951E]/10'
            }`}>
              {notif.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className={`text-sm font-bold truncate ${notif.read ? 'text-white/60' : 'text-white/90'}`}>
                  {notif.title}
                </h3>
                <span className="text-xs font-medium text-white/40 whitespace-nowrap shrink-0">
                  {notif.time}
                </span>
              </div>
              <p className={`text-sm mt-1 line-clamp-2 ${notif.read ? 'text-white/40' : 'text-white/60'}`}>
                {notif.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
