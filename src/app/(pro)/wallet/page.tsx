'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, History, ArrowUpRight, ArrowDownRight, QrCode, Star, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function WalletPage() {
  const [balance] = useState(12500);
  const [level] = useState('Or');
  const [pointsToNextLevel] = useState(2500);

  const transactions = [
    { id: '1', type: 'credit', amount: 5000, reason: 'Cashback Parrainage', date: new Date().toISOString() },
    { id: '2', type: 'debit', amount: 2000, reason: 'Réduction Soin Visage', date: new Date(Date.now() - 86400000*2).toISOString() },
    { id: '3', type: 'credit', amount: 1500, reason: 'Cashback Réservation', date: new Date(Date.now() - 86400000*5).toISOString() },
    { id: '4', type: 'credit', amount: 1000, reason: 'Bonus Anniversaire', date: new Date(Date.now() - 86400000*12).toISOString() },
  ];

  const levels = ['Bronze', 'Argent', 'Or', 'Platine'];
  const currentLevelIndex = levels.indexOf(level);

  return (
    <div className="space-y-8 text-white min-h-full max-w-5xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-display font-bold text-white tracking-tight">
          Wallet & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#C8951E]">Fidélité</span>
        </h1>
        <p className="text-white/60 mt-2">Gérez vos points Kènè et votre statut.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-[#0F0A05] rounded-3xl border border-[#C8951E]/30 p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#C8951E]/20 to-transparent blur-3xl rounded-full" />
          
          <div className="flex justify-between items-start z-10">
            <div>
              <div className="flex items-center gap-2 text-white/60 mb-2">
                <Wallet className="w-5 h-5" /> Solde actuel
              </div>
              <div className="text-5xl font-display font-bold text-white tracking-tight">
                {balance.toLocaleString('fr-FR')} <span className="text-2xl text-[#C8951E]">Pts</span>
              </div>
              <p className="text-sm text-white/50 mt-2">1 Pt = 1 FCFA utilisable en salon</p>
            </div>
            <div className="flex flex-col items-center p-3 bg-white/5 border border-white/10 rounded-2xl">
              <QrCode className="w-16 h-16 text-white mb-2" />
              <span className="text-xs text-white/50">Scanner pour payer</span>
            </div>
          </div>

          <div className="mt-8 z-10">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#C8951E]" />
                <span className="font-semibold text-white">Niveau {level}</span>
              </div>
              <span className="text-sm text-white/60">{pointsToNextLevel} pts avant Platine</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] w-[75%]" />
            </div>
            <div className="flex justify-between mt-3 text-xs text-white/40 px-1">
              {levels.map((lvl, idx) => (
                <span key={lvl} className={idx <= currentLevelIndex ? 'text-[#C8951E] font-medium' : ''}>
                  {lvl}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Action / Promo */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1A1410] border border-white/5 rounded-3xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-full bg-[#C8951E]/10 flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-[#C8951E]" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Bonus Parrainage</h3>
          <p className="text-sm text-white/60 mb-6">Gagnez 5000 pts pour chaque amie parrainée qui effectue sa première réservation.</p>
          <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-colors">
            Voir mon code
          </button>
        </motion.div>
      </div>

      {/* Historique */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-semibold text-white flex items-center gap-2">
            <History className="w-6 h-6 text-[#C8951E]" /> Historique des transactions
          </h2>
          <button className="text-sm text-[#C8951E] hover:underline">Voir tout</button>
        </div>

        <div className="bg-[#1A1410] border border-white/5 rounded-3xl overflow-hidden">
          {transactions.map((tx, idx) => (
            <div 
              key={tx.id} 
              className={`flex items-center justify-between p-4 px-6 hover:bg-white/[0.02] transition-colors ${idx !== transactions.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-[#4CAF6E]/10 text-[#4CAF6E]' : 'bg-[#E07A2B]/10 text-[#E07A2B]'}`}>
                  {tx.type === 'credit' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-medium text-white">{tx.reason}</p>
                  <p className="text-xs text-white/50">
                    {new Date(tx.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className={`font-semibold ${tx.type === 'credit' ? 'text-[#4CAF6E]' : 'text-white'}`}>
                {tx.type === 'credit' ? '+' : '-'}{tx.amount}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
