'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Megaphone, Download, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export default function ReportsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('revenue');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/tenant/reports');
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (e) {
        toast({ title: "❌ Erreur", description: "Impossible de charger les rapports.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [toast]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8,Donnees,exportees\nTest,123";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rapport_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "✅ Export réussi", description: "Fichier CSV téléchargé." });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin h-8 w-8 border-2 border-[#C8951E] border-t-transparent rounded-full" />
      </div>
    );
  }

  const tabs = [
    { id: 'revenue', label: 'CA par Praticienne', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'services', label: 'Prestations Populaires', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'retention', label: 'Taux de Fidélisation', icon: <PieChart className="w-5 h-5" /> },
    { id: 'marketing', label: 'Performance Marketing', icon: <Megaphone className="w-5 h-5" /> },
  ];

  const maxRevenue = Math.max(...data.revenueByEmployee.map((d: any) => d.revenue));

  return (
    <div className="space-y-8 text-white min-h-full max-w-5xl mx-auto pb-12 print:text-black">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight print:text-black">
            Tableaux de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] print:text-black">Bord</span>
          </h1>
          <p className="text-white/60 mt-2 print:text-gray-600">Analysez vos performances en un coup d'œil.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 print:hidden">
          <Button onClick={handlePrint} variant="outline" className="border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl">
            <Printer className="w-4 h-4 mr-2" /> Imprimer
          </Button>
          <Button onClick={handleExportCSV} className="bg-gradient-to-r from-[#F3E5AB] to-[#C8951E] text-[#0F0A05] rounded-xl hover:opacity-90 font-semibold">
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        </motion.div>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide print:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl whitespace-nowrap transition-all ${
              activeTab === tab.id 
              ? 'bg-[#1A1410] border border-[#C8951E]/30 text-[#C8951E] shadow-lg' 
              : 'bg-transparent border border-transparent text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="bg-[#1A1410] border border-white/5 rounded-3xl p-8 min-h-[400px] relative overflow-hidden print:bg-white print:border-gray-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C8951E]/5 to-transparent blur-3xl rounded-full print:hidden" />
        
        <AnimatePresence mode="wait">
          {activeTab === 'revenue' && (
            <motion.div
              key="revenue"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-display font-semibold mb-8 print:text-black">Chiffre d'Affaires par Praticienne</h2>
              <div className="flex items-end gap-6 h-64 pt-6">
                {data.revenueByEmployee.map((emp: any) => {
                  const heightPct = (emp.revenue / maxRevenue) * 100;
                  return (
                    <div key={emp.id} className="flex-1 flex flex-col items-center justify-end gap-2 group">
                      <div className="text-sm text-white/50 opacity-0 group-hover:opacity-100 transition-opacity -translate-y-2 print:opacity-100 print:text-gray-600">
                        {emp.revenue.toLocaleString('fr-FR')} F
                      </div>
                      <div 
                        className="w-full max-w-[60px] bg-gradient-to-t from-[#C8951E]/20 to-[#C8951E] rounded-t-lg transition-all duration-1000 print:bg-gray-400"
                        style={{ height: `${heightPct}%` }}
                      />
                      <div className="text-sm font-medium mt-2 print:text-black">{emp.name}</div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-display font-semibold mb-8 print:text-black">Prestations Populaires</h2>
              <div className="space-y-6">
                {data.popularServices.map((service: any) => {
                  const widthPct = (service.count / service.max) * 100;
                  return (
                    <div key={service.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium print:text-black">{service.name}</span>
                        <span className="text-white/60 print:text-gray-600">{service.count} réservations</span>
                      </div>
                      <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden print:bg-gray-200">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${widthPct}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-[#4E9FD1]/50 to-[#4E9FD1] rounded-full print:bg-blue-500"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'retention' && (
            <motion.div
              key="retention"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 flex flex-col items-center justify-center h-full"
            >
              <h2 className="text-xl font-display font-semibold w-full mb-8 print:text-black">Taux de Fidélisation</h2>
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Simple CSS Donut */}
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  <path
                    className="text-white/5 print:text-gray-200"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <motion.path
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${data.retention.returning}, 100` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="text-[#C8951E]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                </svg>
                <div className="absolute flex flex-col items-center text-center">
                  <span className="text-4xl font-bold text-white print:text-black">{data.retention.returning}%</span>
                  <span className="text-sm text-white/50 print:text-gray-600">Clients fidèles</span>
                </div>
              </div>
              <div className="flex gap-8 mt-8">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#C8951E]" />
                  <span className="text-sm text-white/80 print:text-black">Fidèles ({data.retention.returning}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10 print:bg-gray-200" />
                  <span className="text-sm text-white/80 print:text-black">Nouveaux ({data.retention.new}%)</span>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'marketing' && (
            <motion.div
              key="marketing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-display font-semibold mb-8 print:text-black">Performance Marketing</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/5 text-white/50 text-sm print:border-gray-200 print:text-gray-600">
                      <th className="py-4 px-4 font-medium">Campagne</th>
                      <th className="py-4 px-4 font-medium">Taux d'ouverture</th>
                      <th className="py-4 px-4 font-medium">Conversions</th>
                      <th className="py-4 px-4 font-medium">Performance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.marketing.map((m: any) => (
                      <tr key={m.id} className="border-b border-white/5 hover:bg-white/[0.02] print:border-gray-200 print:text-black">
                        <td className="py-4 px-4 font-medium">{m.campaign}</td>
                        <td className="py-4 px-4">{m.openRate}%</td>
                        <td className="py-4 px-4">{m.conversion}%</td>
                        <td className="py-4 px-4">
                          <div className="w-24 h-2 bg-white/5 rounded-full overflow-hidden print:bg-gray-200">
                            <div 
                              className={`h-full rounded-full ${m.conversion > 15 ? 'bg-emerald-500' : m.conversion > 10 ? 'bg-orange-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(m.conversion * 4, 100)}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
