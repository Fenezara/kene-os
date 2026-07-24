"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { KeneLogo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="bg-[#0F0A05] border-t border-[#241C16] pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-4">
              <KeneLogo href="/" subtitle="AFRICA" size="md" />
            </div>
            <p className="text-gray-400 text-sm mb-6">
              La plateforme de gestion complète pour les salons de beauté et de bien-être haut de gamme.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#features" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Fonctionnalités</Link></li>
              <li><Link href="#pricing" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Tarifs</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Diagnostic IA</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Mises à jour</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Guides d'utilisation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Centre d'aide</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Témoignages</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Conditions d'utilisation</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Mentions légales</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-[#D4AF37] transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#241C16] pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Kènè SaaS. Tous droits réservés.</p>
          <p className="mt-2 md:mt-0">Fait avec élégance pour les professionnels de la beauté.</p>
        </div>
      </div>
    </footer>
  );
}
