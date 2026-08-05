'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Beaker, Tag, CheckCircle2, Clock, Printer, Sparkles, AlertCircle, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface LabFormulaOrder {
  id: string;
  clientName: string;
  diagnosisId: string;
  formulaName: string;
  date: string;
  status: 'pending' | 'in_preparation' | 'ready' | 'delivered';
  phototype: string;
  ingredients: { name: string; amount: string; category: string }[];
  bottleSize: string;
  batchNumber: string;
  expiryDate: string;
  preparedBy?: string;
}

const INITIAL_LAB_ORDERS: LabFormulaOrder[] = [
  {
    id: 'LAB-2024-001',
    clientName: 'Aminata Diallo',
    diagnosisId: 'DIAG-2024-089',
    formulaName: 'Sérum Magistral Éclat Bissap & Niacinamide Sur-Mesure',
    date: 'Aujourd\'hui 14:15',
    status: 'in_preparation',
    phototype: 'Phototype V (Afro-Subsaharien)',
    ingredients: [
      { name: 'Base Gel Aloe Vera Bio', amount: '25 ml', category: 'Base Hydratante' },
      { name: 'Extrait Concentré de Bissap (Hibiscus)', amount: '3.5 ml', category: 'AHA Naturel Éclat' },
      { name: 'Niacinamide Pure (Vitamine B3)', amount: '1.5 g (5%)', category: 'Anti-Taches PIH' },
      { name: 'Huile de Baobab Scellante', amount: '4 ml', category: 'Lipide Protecteur' },
      { name: 'Conservateur Cosgard Naturel', amount: '0.2 ml', category: 'Stabilisateur' },
    ],
    bottleSize: 'Flacon Dropper Verre Ambré 30ml',
    batchNumber: 'LOT-2024-ABJ-042',
    expiryDate: '21 Octobre 2026 (3 Mois)',
    preparedBy: 'Fatou Koné (Chimiste/Praticienne)',
  },
  {
    id: 'LAB-2024-002',
    clientName: 'Fatou Sarr',
    diagnosisId: 'DIAG-2024-092',
    formulaName: 'Baume Régénérant Karité Brut & Chébé Cuir Chevelu',
    date: 'Aujourd\'hui 13:40',
    status: 'ready',
    phototype: 'Cheveux 4C Crépus',
    ingredients: [
      { name: 'Beurre de Karité Brut Bio Non Raffiné', amount: '40 g', category: 'Beurre Nourrissant' },
      { name: 'Poudre de Chébé Authentique', amount: '5 g', category: 'Fortifiant Capillaire' },
      { name: 'Macerat Huileux de Neem & Moringa', amount: '10 ml', category: 'Purifiant Cuir Chevelu' },
      { name: 'Huile Essentielle de Menthe Poivrée', amount: '3 gouttes', category: 'Stimulant Circulatoire' },
    ],
    bottleSize: 'Pot Verre Ambré 60ml',
    batchNumber: 'LOT-2024-DKR-019',
    expiryDate: '21 Janvier 2027 (6 Mois)',
    preparedBy: 'Aminata Diallo',
  },
  {
    id: 'LAB-2024-003',
    clientName: 'Mariam Coulibaly',
    diagnosisId: 'DIAG-2024-095',
    formulaName: 'Élixir Apaisant Anti-Harmattan Neem & Aloe',
    date: 'Hier 16:30',
    status: 'delivered',
    phototype: 'Phototype VI (Peau Très Sèche)',
    ingredients: [
      { name: 'Jus d\'Aloe Vera Bio', amount: '35 ml', category: 'Hydratant Apaisant' },
      { name: 'Huile de Neem Bio', amount: '5 ml', category: 'Anti-Inflammatoire' },
      { name: 'Glycérine Végétale', amount: '3 ml', category: 'Humectant' },
    ],
    bottleSize: 'Flacon Spray 50ml',
    batchNumber: 'LOT-2024-BMK-008',
    expiryDate: '21 Octobre 2026 (3 Mois)',
    preparedBy: 'Kady Coulibaly',
  },
];

const RAW_MATERIALS = [
  { name: 'Beurre de Karité Brut Non Raffiné 🇬🇭', stock: '12.5 kg', status: 'optimal', category: 'Beurres' },
  { name: 'Huile de Baobab Pressée à Froid 🇸🇳', stock: '4.8 Litres', status: 'optimal', category: 'Huiles' },
  { name: 'Extrait Concentré de Bissap (Hibiscus) 🇨🇮', stock: '1.2 Litres', status: 'low', category: 'Actifs AHA' },
  { name: 'Poudre de Chébé Authentique 🇹🇩', stock: '2.8 kg', status: 'optimal', category: 'Poudres' },
  { name: 'Niacinamide Pure USP 5%', stock: '850 g', status: 'optimal', category: 'Actifs Dermo' },
  { name: 'Gel d\'Aloe Vera Bio 99%', stock: '8.2 Litres', status: 'optimal', category: 'Bases' },
  { name: 'Flacons Verre Ambré 30ml Dropper', stock: '142 unités', status: 'optimal', category: 'Conditionnement' },
];

export default function LabPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<LabFormulaOrder[]>(INITIAL_LAB_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<LabFormulaOrder>(INITIAL_LAB_ORDERS[0]);
  const [activeTab, setActiveTab] = useState<'orders' | 'raw_materials'>('orders');
  const [labelModalOrder, setLabelModalOrder] = useState<LabFormulaOrder | null>(null);

  const handleUpdateStatus = (orderId: string, newStatus: LabFormulaOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    if (selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
    toast({
      title: '🧪 Statut Laboratoire Mis à Jour',
      description: `Ordre ${orderId} passé en statut "${newStatus === 'ready' ? 'Prêt pour Flaconnage' : newStatus === 'delivered' ? 'Livré à la Cliente' : 'En Préparation'}".`,
    });
  };

  const handlePrintLabel = (order: LabFormulaOrder) => {
    setLabelModalOrder(order);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 overflow-hidden shadow-2xl border border-[#C8951E]/40 min-h-[160px] flex items-center">
        <img
          src="/images/botanical_laboratory_africa.jpg"
          alt="Laboratoire Cosmétique Africain"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F0A05] via-[#140E0A]/95 to-[#0A0603]/80" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#C8951E] uppercase tracking-widest font-display flex items-center gap-1.5 bg-[#C8951E]/20 px-3 py-1 rounded-full border border-[#C8951E]/40 backdrop-blur-md">
                <Beaker className="w-4 h-4 text-[#C8951E]" /> Laboratoire de Confection Cosmétique Sur-Mesure
              </span>
            </div>
            <h1 className="font-display font-black text-2xl text-white">
              Gestion de la Préparation Dermo-Botanique en Institut
            </h1>
            <p className="text-xs text-white/70 font-sans max-w-2xl">
              Formulation en direct, dosage au gramme/goutte, impression d'étiquettes personnalisées et suivi des matières premières brutes pour vos clientes.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#0A0603]/90 backdrop-blur-md border border-white/10 p-1.5 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-[#C8951E] to-[#8A5C0A] text-[#0F0A05] shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
               Ordres de Formulation ({orders.filter(o => o.status !== 'delivered').length})
            </button>
            <button
              onClick={() => setActiveTab('raw_materials')}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-display transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'raw_materials'
                  ? 'bg-gradient-to-r from-[#C8951E] to-[#8A5C0A] text-[#0F0A05] shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Beaker className="w-3.5 h-3.5" />
              Matières Premières
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'orders' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Orders List (Left Column 5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white/40 font-mono flex items-center justify-between">
              <span>Commandes Formulations Labo</span>
              <span className="text-[#C8951E] font-bold">{orders.length} au total</span>
            </h2>

            <div className="space-y-3">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    selectedOrder.id === order.id
                      ? 'bg-[#241C16] border-[#C8951E] shadow-xl shadow-[#C8951E]/10'
                      : 'bg-[#1A1410] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-[#C8951E] font-bold bg-[#C8951E]/10 px-2 py-0.5 rounded-md">
                        {order.id}
                      </span>
                      <h3 className="font-display font-bold text-sm text-white mt-1">
                        {order.clientName}
                      </h3>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                      order.status === 'in_preparation'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : order.status === 'ready'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-white/40'
                    }`}>
                      {order.status === 'in_preparation' ? '🧪 En Préparation' : order.status === 'ready' ? '✨… Prêt pour Flacon' : '📁¦ Livré'}
                    </span>
                  </div>

                  <p className="text-xs text-white/70 font-sans font-medium line-clamp-1">
                    {order.formulaName}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-white/40 border-t border-white/5 pt-2">
                    <span>Diagnostic : {order.diagnosisId}</span>
                    <span>{order.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Formula Detail & Lab Recipe (Right Column 7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-[#1A1410] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl relative">
              {/* Header info */}
              <div className="flex justify-between items-start border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[#C8951E] font-bold bg-[#C8951E]/10 border border-[#C8951E]/20 px-2.5 py-0.5 rounded-md">
                      Fiche de Formulation Labo #{selectedOrder.id}
                    </span>
                    <span className="text-xs text-white/40 font-mono">Lot: {selectedOrder.batchNumber}</span>
                  </div>
                  <h2 className="font-display font-black text-lg text-white mt-1">
                    {selectedOrder.formulaName}
                  </h2>
                  <p className="text-xs text-white/60 font-sans mt-0.5">
                    Cliente : <strong className="text-white">{selectedOrder.clientName}</strong> · {selectedOrder.phototype}
                  </p>
                </div>

                <Button
                  onClick={() => handlePrintLabel(selectedOrder)}
                  className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md hover:brightness-110 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer Étiquette Flacon
                </Button>
              </div>

              {/* Precise Lab Recipe Table */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#C8951E] font-display flex items-center gap-2">
                  <Beaker className="w-4 h-4" /> Recette & Dosages Exacts au Laboratoire
                </h3>

                <div className="bg-[#0A0603] border border-white/10 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs text-white/80">
                    <thead className="bg-[#241C16] text-[#C8951E] text-[10px] font-mono uppercase">
                      <tr>
                        <th className="p-3">Ingrédient / Actif Botanique</th>
                        <th className="p-3">Dosage Précis</th>
                        <th className="p-3">Rôle Dermo-Botanique</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 font-sans">
                      {selectedOrder.ingredients.map((ing, i) => (
                        <tr key={i} className="hover:bg-white/5 transition">
                          <td className="p-3 font-semibold text-white">{ing.name}</td>
                          <td className="p-3 font-mono font-bold text-[#C8951E]">{ing.amount}</td>
                          <td className="p-3 text-white/60">{ing.category}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Packaging info & Expiry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#241C16]/50 border border-white/5 p-4 rounded-2xl text-xs">
                <div>
                  <span className="text-[10px] text-white/40 font-mono block uppercase">Conditionnement Flacon</span>
                  <span className="font-bold text-white font-display mt-0.5 block">{selectedOrder.bottleSize}</span>
                </div>
                <div>
                  <span className="text-[10px] text-white/40 font-mono block uppercase">Péremption Produit Frais</span>
                  <span className="font-bold text-emerald-400 font-display mt-0.5 block">{selectedOrder.expiryDate}</span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <span className="text-xs text-white/40 font-sans">
                  Préparé par : <strong className="text-white">{selectedOrder.preparedBy}</strong>
                </span>

                <div className="flex gap-2">
                  {selectedOrder.status === 'in_preparation' && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'ready')}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Marquer comme Prêt (Flaconné)
                    </Button>
                  )}
                  {selectedOrder.status === 'ready' && (
                    <Button
                      onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                      className="bg-[#C8951E] hover:bg-[#C8951E]/90 text-[#0F0A05] font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#C8951E]/20"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Livrer à la Cliente (Caisse POS)
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Raw Materials Stock Inventory */
        <div className="bg-[#1A1410] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl">
          <div className="flex justify-between items-center">
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Beaker className="text-[#C8951E]" /> Stock des Matières Premières Brutes au Labo
            </h2>
            <span className="text-xs text-white/40 font-mono">Mis à jour en temps réel</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {RAW_MATERIALS.map((item, idx) => (
              <div key={idx} className="bg-[#0A0603] border border-white/10 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] text-[#C8951E] font-mono font-bold bg-[#C8951E]/10 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'low' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {item.status === 'low' ? '⚠️ï¸ Réapprovisionner' : 'Stock Optimal'}
                  </span>
                </div>
                <h3 className="font-display font-bold text-sm text-white">{item.name}</h3>
                <p className="text-xs font-mono font-bold text-[#C8951E]">{item.stock}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Printable Bottle Label Preview Modal / Overlay for print */}
      {labelModalOrder && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 print:p-0 print:bg-white print:static">
          <div className="bg-white text-black p-6 rounded-2xl max-w-sm w-full space-y-3 font-sans border-2 border-black print:border-none shadow-2xl">
            <div className="text-center border-b border-black pb-2">
              <h2 className="font-bold text-lg uppercase tracking-tight">KÈNÈ COSMÉTIQUE LAB</h2>
              <p className="text-[10px] text-gray-600 uppercase font-mono">Formulation Botanique Sur-Mesure en Institut</p>
            </div>

            <div className="space-y-1 text-xs">
              <p><strong>CLIENTE :</strong> {labelModalOrder.clientName}</p>
              <p><strong>FORMULE :</strong> {labelModalOrder.formulaName}</p>
              <p><strong>LOT N° :</strong> {labelModalOrder.batchNumber}</p>
              <p><strong>FLACON :</strong> {labelModalOrder.bottleSize}</p>
              <p><strong>PÉREMPTION :</strong> {labelModalOrder.expiryDate}</p>
            </div>

            <div className="border-t border-black pt-2 text-[9px] text-gray-700">
              <strong>INGRÉDIENTS :</strong> {labelModalOrder.ingredients.map(i => `${i.name} (${i.amount})`).join(', ')}.
            </div>

            <div className="text-center pt-2 border-t border-gray-300 print:hidden flex justify-end gap-2">
              <Button onClick={() => setLabelModalOrder(null)} className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg">Fermer</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
