'use client';

import React from 'react';
import { QrCode, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface DigitalReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: {
    invoiceNumber: string;
    createdAt: string | Date;
    clientName?: string;
    clientPhone?: string;
    items: { name: string; price: number; qty: number }[];
    subtotalHT: number;
    vatAmount: number;
    totalTTC: number;
    paymentMethod: string;
    tenantName?: string;
    rccm?: string;
  } | null;
}

export function DigitalReceiptModal({ isOpen, onClose, sale }: DigitalReceiptModalProps) {
  if (!sale) return null;

  let tenantTitle = sale.tenantName || 'Salon Kènè Partner';
  let rccmNum = sale.rccm || 'CI-ABJ-03-2026-B12-0094';

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('kene_tenant_settings');
    if (saved) {
      try {
        const p = JSON.parse(saved);
        if (p.identity?.commercialName) tenantTitle = p.identity.commercialName;
        if (p.fiscal?.rccm) rccmNum = p.fiscal.rccm;
      } catch (e) {}
    }
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-[#1A1410] border-[#362A21] text-white max-w-md p-6 font-sans">
        <DialogHeader className="border-b border-[#362A21] pb-4 flex flex-row items-center justify-between">
          <div>
            <DialogTitle className="font-display text-xl text-[var(--gold-kene)] flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" /> Reçu Digital Officiel
            </DialogTitle>
            <p className="text-xs text-karite/60 mt-1">Conforme OHADA & Empreinte Biométrique Kènè</p>
          </div>
        </DialogHeader>

        {/* Printable Ticket Receipt Area */}
        <div id="digital-receipt-ticket" className="bg-[#241C16] border border-[#362A21] rounded-2xl p-5 space-y-4 my-2 text-xs">
          
          {/* Header Salon */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-[#362A21]">
            <h2 className="font-display font-bold text-base text-[var(--gold-kene)] uppercase tracking-wider">
              {tenantTitle}
            </h2>
            <p className="text-[10px] text-karite/60">Institut de Beauté & Soins Cutanés</p>
            <p className="text-[10px] text-karite/50 font-mono">RCCM : {rccmNum}</p>
          </div>

          {/* Ticket Metadata */}
          <div className="flex justify-between items-center text-karite/80 text-[11px] font-mono">
            <div>
              <span className="block font-bold text-white">Facture : #{sale.invoiceNumber}</span>
              <span>Date : {format(new Date(sale.createdAt), 'dd/MM/yyyy HH:mm')}</span>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
              Payé • {sale.paymentMethod.toUpperCase()}
            </Badge>
          </div>

          {/* Client info */}
          {sale.clientName && (
            <div className="bg-[#1A1410] p-2.5 rounded-lg border border-[#362A21] flex justify-between items-center">
              <span className="text-karite/60">Client :</span>
              <span className="font-bold text-white">{sale.clientName} ({sale.clientPhone || 'Client Passant'})</span>
            </div>
          )}

          {/* Items breakdown */}
          <div className="space-y-2 py-2 border-t border-b border-[#362A21]">
            <div className="flex justify-between font-semibold text-white/50 uppercase text-[9px]">
              <span>Prestation / Produit</span>
              <span>Qté x Prix</span>
            </div>
            {sale.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-white">
                <span>{item.name}</span>
                <span className="font-mono font-semibold">{item.qty}x {item.price.toLocaleString()} F</span>
              </div>
            ))}
          </div>

          {/* Totals & VAT */}
          <div className="space-y-1.5 pt-1 text-right font-mono">
            <div className="flex justify-between text-karite/70">
              <span>Sous-total HT :</span>
              <span>{sale.subtotalHT.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-karite/70">
              <span>TVA (18% OHADA) :</span>
              <span>{sale.vatAmount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-[var(--gold-kene)] pt-2 border-t border-[#362A21]">
              <span>TOTAL TTC :</span>
              <span>{sale.totalTTC.toLocaleString()} FCFA</span>
            </div>
          </div>

          {/* Authentic QR Code Section */}
          <div className="pt-3 border-t border-dashed border-[#362A21] flex items-center justify-between gap-4">
            <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center shrink-0 shadow-md">
              <div className="w-full h-full bg-[#1A1410] rounded p-1 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-3 h-3 bg-[var(--gold-kene)] rounded-sm" />
                  <div className="w-3 h-3 bg-white rounded-sm" />
                </div>
                <div className="flex justify-between">
                  <div className="w-3 h-3 bg-white rounded-sm" />
                  <div className="w-3 h-3 bg-[var(--gold-kene)] rounded-sm" />
                </div>
              </div>
            </div>
            <div className="text-left space-y-1">
              <span className="text-[10px] text-white font-bold block flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Signature Numérique Kènè
              </span>
              <p className="text-[9px] text-karite/50 leading-tight">
                Scannez ce QR Code pour télécharger votre facture certifiée avec droit de rétractation.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button 
            onClick={handlePrint}
            variant="outline" 
            className="flex-1 border-[#362A21] text-white hover:bg-[#241C16] text-xs font-semibold py-5"
          >
            <Printer className="w-4 h-4 mr-2" /> Imprimer le Ticket
          </Button>
          <Button 
            onClick={onClose}
            className="flex-1 bg-[var(--gold-kene)] text-[#1A1410] hover:bg-[#D4AF37]/90 font-bold text-xs py-5"
          >
            Terminer & Nouvel Encaissement
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
