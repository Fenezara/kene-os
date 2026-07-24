"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { KeneLogo } from "@/components/ui/logo";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0F0A05]/80 backdrop-blur-md border-b border-[#241C16]"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <KeneLogo href="/" subtitle="AFRICA" size="md" />

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <Link href="#features" className="hover:text-[#D4AF37] transition-colors">
            Fonctionnalités
          </Link>
          <Link href="#pricing" className="hover:text-[#D4AF37] transition-colors">
            Tarifs
          </Link>
          <Link href="#testimonials" className="hover:text-[#D4AF37] transition-colors">
            Témoignages
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-gray-300 hover:text-[#D4AF37] hover:bg-[#1A1410]">
              Connexion
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-[#D4AF37] text-[#0F0A05] hover:bg-[#F3E5AB] transition-colors">
              Commencer
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
